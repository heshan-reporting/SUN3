/**
 * CeylonHub scraper Worker (Cloudflare).
 *
 * Two entry points:
 *   scheduled()  — cron-triggered crawl: fetch sources (robots.txt-aware,
 *                  rate-limited), parse, upsert into D1, track price history.
 *   fetch()      — JSON API the static React site reads:
 *                    GET /api/market-summary
 *                    GET /api/latest-listings
 *                    GET /api/health
 *                    POST /run           (manual crawl; requires ?key=RUN_KEY)
 *
 * Dependency-free: parsing uses native HTMLRewriter + JSON-LD extraction, so
 * it stays well under the Worker size limit and runs at the edge (a different
 * IP reputation than GitHub Actions, which the target sites 403).
 *
 * Bindings (see wrangler.toml): env.DB (D1), env.ALLOWED_ORIGIN,
 * and optional secret env.RUN_KEY (`wrangler secret put RUN_KEY`).
 */

const USER_AGENT =
  'CeylonHubBot/1.0 (+https://github.com/heshan-reporting/SUN3; market-research crawler)'

const SOURCES = [
  {
    name: 'riyasewana', mode: 'cards', baseUrl: 'https://riyasewana.com',
    start: [{ url: 'https://riyasewana.com/search/cars', category: 'vehicles', subcategory: 'car' }],
  },
  {
    name: 'patpat', mode: 'jsonld', baseUrl: 'https://patpat.lk',
    start: [{ url: 'https://patpat.lk/en/vehicle', category: 'vehicles', subcategory: null }],
  },
  {
    name: 'autostream', mode: 'jsonld', baseUrl: 'https://www.autostream.lk',
    start: [{ url: 'https://www.autostream.lk/vehicles/', category: 'vehicles', subcategory: 'car' }],
  },
]

const TRACKED_MODELS = [
  { key: 'toyota-aqua', label: 'Toyota Aqua', re: /aqua/i },
  { key: 'suzuki-wagon-r', label: 'Suzuki Wagon R', re: /wagon\s*r/i },
  { key: 'honda-vezel', label: 'Honda Vezel', re: /vezel/i },
  { key: 'toyota-prius', label: 'Toyota Prius', re: /prius/i },
  { key: 'toyota-kdh', label: 'Toyota KDH', re: /kdh/i },
  { key: 'nissan-leaf', label: 'Nissan Leaf', re: /leaf/i },
]

// ── helpers ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function parsePriceLKR(text) {
  if (!text) return null
  const t = String(text).toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ')
  let m
  if ((m = t.match(/([\d.]+)\s*crore/))) return Math.round(parseFloat(m[1]) * 1e7)
  if ((m = t.match(/([\d.]+)\s*lakh?s?/))) return Math.round(parseFloat(m[1]) * 1e5)
  if ((m = t.match(/([\d.]+)\s*m(?:illion)?\b/))) return Math.round(parseFloat(m[1]) * 1e6)
  const digits = t.replace(/[^\d]/g, '')
  return digits.length >= 4 && digits.length <= 12 ? parseInt(digits, 10) : null
}

function abs(href, base) { try { return new URL(href, base).toString() } catch { return null } }

async function fetchText(url, timeoutMs = 20000) {
  const res = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/html', 'accept-language': 'en,si;q=0.8,ta;q=0.8' },
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    cf: { cacheTtl: 0 },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

async function robotsAllows(baseUrl, targetUrl) {
  try {
    const res = await fetch(new URL('/robots.txt', baseUrl).toString(), {
      headers: { 'user-agent': USER_AGENT }, signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return true // no robots → allowed
    const txt = await res.text()
    const path = new URL(targetUrl).pathname
    let active = false, disallowed = false
    for (const raw of txt.split(/\r?\n/)) {
      const line = raw.replace(/#.*/, '').trim()
      const [field, ...rest] = line.split(':')
      const value = rest.join(':').trim()
      if (/^user-agent$/i.test(field)) active = value === '*' || USER_AGENT.toLowerCase().includes(value.toLowerCase())
      else if (active && /^disallow$/i.test(field) && value && path.startsWith(value)) disallowed = true
    }
    return !disallowed
  } catch {
    return false // fail closed on robots errors
  }
}

// JSON-LD extraction (Product / Vehicle / Offer / residence types)
function parseJsonLd(html, ctx) {
  const out = []
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html))) {
    let data
    try { data = JSON.parse(m[1].trim()) } catch { continue }
    const nodes = []
    const walk = (n) => {
      if (!n || typeof n !== 'object') return
      if (Array.isArray(n)) return n.forEach(walk)
      nodes.push(n)
      n['@graph'] && walk(n['@graph'])
      n.itemListElement && walk(n.itemListElement)
      n.item && walk(n.item)
    }
    walk(data)
    for (const n of nodes) {
      const type = String(n['@type'] || '')
      if (!/product|vehicle|car|offer|apartment|house|residence/i.test(type)) continue
      const offer = n.offers && !Array.isArray(n.offers) ? n.offers : (n.offers || [])[0] || {}
      const url = n.url || offer.url
      const title = n.name || n.title
      if (!url || !title) continue
      out.push(makeRecord(ctx, {
        url: abs(url, ctx.baseUrl), title,
        priceText: (n.price ?? offer.price) != null ? `Rs ${n.price ?? offer.price}` : null,
        location: n.address?.addressLocality || null,
        imageUrl: abs(typeof n.image === 'string' ? n.image : n.image?.[0] || '', ctx.baseUrl),
      }))
    }
  }
  return out
}

// Card heuristic via native HTMLRewriter: collect anchors + a price signal.
async function parseCards(html, ctx) {
  const anchors = []
  let cur = null
  const rewriter = new HTMLRewriter()
    .on('a[href]', {
      element(el) {
        const href = el.getAttribute('href')
        cur = { href, title: el.getAttribute('title') || '', text: '' }
        anchors.push(cur)
      },
      text(t) { if (cur) cur.text += t.text },
    })
  await rewriter.transform(new Response(html)).arrayBuffer()

  const origin = new URL(ctx.baseUrl).origin
  const out = []
  const seen = new Set()
  // Pair each ad anchor with the nearest price found in raw HTML around it.
  for (const a of anchors) {
    const url = abs(a.href, ctx.baseUrl)
    if (!url || !url.startsWith(origin)) continue
    if (!/\/(buy|ad|vehicle|listing)\//i.test(url)) continue
    const title = (a.title || a.text).trim()
    if (title.length < 8 || seen.has(url)) continue
    const idx = html.indexOf(a.href)
    const window = idx >= 0 ? html.slice(idx, idx + 600) : ''
    const price = window.match(/(?:rs|lkr)\.?\s*[\d,]{4,}(?:\.\d+)?\s*(?:m|million|lakhs?)?/i)
    seen.add(url)
    out.push(makeRecord(ctx, { url, title, priceText: price ? price[0] : null }))
  }
  return out
}

function makeRecord(ctx, { url, title, priceText, location, imageUrl }) {
  if (!url || !title) return null
  return {
    source: ctx.name, sourceId: url, url,
    title: title.replace(/\s+/g, ' ').trim().slice(0, 300),
    category: ctx.category, subcategory: ctx.subcategory || null,
    location: location ? location.trim().slice(0, 100) : null,
    priceLkr: parsePriceLKR(priceText), priceText: priceText || null,
    imageUrl: imageUrl || null,
  }
}

// ── D1 upsert with price history ─────────────────────────────────────────
async function upsert(env, l, now) {
  if (!l) return 'skip'
  const row = await env.DB.prepare('SELECT id, price_lkr FROM listings WHERE source=? AND source_id=?')
    .bind(l.source, l.sourceId).first()
  if (!row) {
    const res = await env.DB.prepare(
      `INSERT INTO listings (source, source_id, url, title, category, subcategory, location,
        price_lkr, price_text, image_url, first_seen, last_seen)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(l.source, l.sourceId, l.url, l.title, l.category, l.subcategory, l.location,
      l.priceLkr, l.priceText, l.imageUrl, now, now).run()
    if (l.priceLkr != null) {
      await env.DB.prepare('INSERT INTO price_history (listing_id, price_lkr, observed_at) VALUES (?,?,?)')
        .bind(res.meta.last_row_id, l.priceLkr, now).run()
    }
    return 'added'
  }
  await env.DB.prepare(
    `UPDATE listings SET url=?, title=?, location=?, price_lkr=?, price_text=?, image_url=?, last_seen=? WHERE id=?`
  ).bind(l.url, l.title, l.location, l.priceLkr, l.priceText, l.imageUrl, now, row.id).run()
  if (l.priceLkr != null && l.priceLkr !== row.price_lkr) {
    await env.DB.prepare('INSERT INTO price_history (listing_id, price_lkr, observed_at) VALUES (?,?,?)')
      .bind(row.id, l.priceLkr, now).run()
    return 'price-changed'
  }
  return 'updated'
}

async function crawl(env, { maxPages = 2 } = {}) {
  const now = new Date().toISOString()
  const report = []
  for (const src of SOURCES) {
    const runIns = await env.DB.prepare('INSERT INTO runs (source, started_at, status) VALUES (?,?,?)')
      .bind(src.name, now, 'running').run()
    const runId = runIns.meta.last_row_id
    let found = 0, added = 0, updated = 0, status = 'ok', note = ''
    try {
      for (const start of src.start) {
        if (!(await robotsAllows(src.baseUrl, start.url))) { note += `robots disallows ${start.url}; `; continue }
        const ctx = { name: src.name, baseUrl: src.baseUrl, category: start.category, subcategory: start.subcategory }
        const html = await fetchText(start.url)
        const listings = src.mode === 'jsonld' ? parseJsonLd(html, ctx) : await parseCards(html, ctx)
        found += listings.length
        for (const l of listings) {
          const r = await upsert(env, l, now)
          if (r === 'added') added++; else if (r !== 'skip') updated++
        }
        await sleep(3000) // politeness between sources/pages
      }
    } catch (e) { status = 'error'; note = String(e.message || e).slice(0, 300) }
    await env.DB.prepare('UPDATE runs SET finished_at=?, found=?, added=?, updated=?, status=?, note=? WHERE id=?')
      .bind(new Date().toISOString(), found, added, updated, status, note || null, runId).run()
    report.push({ source: src.name, found, added, updated, status, note })
  }
  return report
}

// ── JSON API (what the React site reads) ─────────────────────────────────
function median(nums) {
  if (!nums.length) return null
  const s = [...nums].sort((a, b) => a - b), mid = s.length >> 1
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

async function buildSummary(env) {
  const cutoff = new Date(Date.now() - 14 * 864e5).toISOString()
  const { results } = await env.DB.prepare('SELECT * FROM listings WHERE last_seen >= ?').bind(cutoff).all()
  const bySource = {}, byCat = {}
  for (const l of results) {
    bySource[l.source] = (bySource[l.source] || 0) + 1
    ;(byCat[l.category] ||= []).push(l)
  }
  const categories = Object.fromEntries(Object.entries(byCat).map(([c, ls]) => {
    const p = ls.map((x) => x.price_lkr).filter((v) => v > 5e4)
    return [c, { count: ls.length, medianPriceLkr: median(p) }]
  }))
  const models = TRACKED_MODELS.map((m) => {
    const ls = (byCat.vehicles || []).filter((l) => m.re.test(l.title))
    return { key: m.key, label: m.label, count: ls.length, medianPriceLkr: median(ls.map((x) => x.price_lkr).filter((v) => v > 5e5)) }
  }).filter((m) => m.count > 0)
  const runs = (await env.DB.prepare('SELECT source, started_at, finished_at, found, added, updated, status FROM runs ORDER BY id DESC LIMIT 20').all()).results
  return { updatedAt: new Date().toISOString(), totalActive: results.length, bySource, categories, models, priceDrops: [], lastRuns: runs }
}

async function buildLatest(env) {
  const cutoff = new Date(Date.now() - 14 * 864e5).toISOString()
  const { results } = await env.DB.prepare(
    'SELECT source, url, title, category, subcategory, location, price_lkr, price_text, image_url, first_seen, last_seen FROM listings WHERE last_seen >= ? ORDER BY last_seen DESC LIMIT 100'
  ).bind(cutoff).all()
  return results.map((l) => ({
    source: l.source, url: l.url, title: l.title, category: l.category, subcategory: l.subcategory,
    location: l.location, priceLkr: l.price_lkr, priceText: l.price_text, imageUrl: l.image_url,
    firstSeen: l.first_seen, lastSeen: l.last_seen,
  }))
}

function json(data, env, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': env.ALLOWED_ORIGIN || '*',
      'cache-control': 'public, max-age=300',
    },
  })
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(crawl(env))
  },
  async fetch(request, env) {
    const url = new URL(request.url)
    try {
      if (url.pathname === '/api/market-summary') return json(await buildSummary(env), env)
      if (url.pathname === '/api/latest-listings') return json(await buildLatest(env), env)
      if (url.pathname === '/api/health') return json({ ok: true, time: new Date().toISOString() }, env)
      if (url.pathname === '/run' && request.method === 'POST') {
        if (env.RUN_KEY && url.searchParams.get('key') !== env.RUN_KEY) return json({ error: 'unauthorized' }, env, 401)
        return json({ ran: await crawl(env, { maxPages: Number(url.searchParams.get('pages')) || 2 }) }, env)
      }
      return json({ error: 'not found', endpoints: ['/api/market-summary', '/api/latest-listings', '/api/health', 'POST /run?key='] }, env, 404)
    } catch (e) {
      return json({ error: String(e.message || e) }, env, 500)
    }
  },
}
