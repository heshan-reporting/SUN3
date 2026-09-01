#!/usr/bin/env node
// CeylonHub market crawler.
//
//   node scraper/cli.js                 crawl all enabled sources (live)
//   node scraper/cli.js --source=riyasewana
//   node scraper/cli.js --fixtures      parse local fixture HTML instead of the network
//   node scraper/cli.js --max-pages=5
//
// Live crawling checks robots.txt per host, rate-limits requests, and stops at
// maxPagesPerRun. Results land in data/market.db (SQLite) and are exported to
// public/data/*.json for the static frontend.

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { SOURCES, DEFAULTS, USER_AGENT } from './config.js'
import { SEED } from './seed.js'
import { makeListing } from './lib/normalize.js'
import { politeFetch } from './lib/fetcher.js'
import { getRobots, isAllowed, crawlDelayMs } from './lib/robots.js'
import { openDb, upsertListing, startRun, finishRun } from './lib/store.js'
import { exportJson } from './lib/export.js'
import * as riyasewana from './adapters/riyasewana.js'
import * as generic from './adapters/generic.js'

const ADAPTERS = { riyasewana, generic }
const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..')

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)

const useFixtures = Boolean(args.fixtures)
const maxPages = Number(args['max-pages']) || DEFAULTS.maxPagesPerRun
const dbPath = path.join(ROOT, 'data', 'market.db')
const outDir = path.join(ROOT, 'public', 'data')

// With SCRAPE_DEBUG=1, every fetched page is snapshotted to data/debug/ so a
// CI run can upload them as an artifact — the only way to see real markup
// when developing from a network-restricted environment.
const debug = process.env.SCRAPE_DEBUG === '1'
const debugDir = path.join(ROOT, 'data', 'debug')
if (debug) fs.mkdirSync(debugDir, { recursive: true })
let debugSeq = 0
const snapshot = (srcName, html) => {
  if (!debug) return
  fs.writeFileSync(path.join(debugDir, `${srcName}-${String(++debugSeq).padStart(2, '0')}.html`), html)
}

const db = openDb(dbPath)
const now = new Date().toISOString()
let grandTotal = 0

// --seed loads the labelled sample dataset (see scraper/seed.js) so the feed,
// images and price-history are populated where compliant live crawling is
// blocked. It records a run per source-group just like a real crawl.
if (args.seed) {
  const runId = startRun(db, 'seed', now)
  const stats = { pages: 1, found: SEED.length, added: 0, updated: 0 }
  for (const s of SEED) {
    const l = makeListing({ ...s, url: s.url + '#' + encodeURIComponent(s.title) })
    if (!l) continue
    // Seed a small prior price a few days back so price-drop detection has data.
    if (l.priceLkr) {
      const prior = Math.round(l.priceLkr * 1.04)
      const daysAgo = new Date(Date.now() - 5 * 86400_000).toISOString()
      const existing = db.prepare('SELECT id FROM listings WHERE source=? AND source_id=?').get(l.source, l.sourceId)
      if (!existing) {
        db.prepare(`INSERT INTO listings (source, source_id, url, title, category, subcategory, location,
          price_lkr, price_text, image_url, attrs_json, first_seen, last_seen)
          VALUES (@source,@sourceId,@url,@title,@category,@subcategory,@location,@prior,@priorText,@imageUrl,'{}',@daysAgo,@daysAgo)`)
          .run({ ...l, prior, priorText: `Rs ${prior}`, daysAgo })
        db.prepare('INSERT INTO price_history (listing_id, price_lkr, observed_at) VALUES ((SELECT id FROM listings WHERE source=? AND source_id=?), ?, ?)')
          .run(l.source, l.sourceId, prior, daysAgo)
      }
    }
    const r = upsertListing(db, l, now)
    if (r === 'added') stats.added++
    else stats.updated++
  }
  finishRun(db, runId, { ...stats, status: 'ok', note: 'seed dataset (labelled -sample)' })
  grandTotal += stats.found
  console.log(`[seed] loaded ${SEED.length} sample listings`)
  const summary = exportJson(db, outDir)
  console.log(`Export → public/data/ · active listings: ${summary.totalActive}`)
  db.close()
  process.exit(0)
}

for (const src of SOURCES) {
  if (!src.enabled) continue
  if (args.source && args.source !== src.name) continue
  const adapter = ADAPTERS[src.adapter]
  const runId = startRun(db, src.name, now)
  const stats = { pages: 0, found: 0, added: 0, updated: 0 }
  let status = 'ok'
  let note = ''

  try {
    if (useFixtures) {
      const fixturePath = path.join(ROOT, 'scraper', 'fixtures', src.fixture)
      if (!fs.existsSync(fixturePath)) {
        status = 'skipped'
        note = 'no fixture'
      } else {
        const html = fs.readFileSync(fixturePath, 'utf8')
        for (const start of src.startUrls.slice(0, 1)) {
          const { listings } = adapter.parse(html, { baseUrl: src.baseUrl, source: src.name, ...start })
          stats.pages++
          stats.found += listings.length
          for (const l of listings) {
            const r = upsertListing(db, l, now)
            if (r === 'added') stats.added++
            else stats.updated++
          }
        }
      }
    } else {
      const robots = await getRobots(src.baseUrl, USER_AGENT)
      if (!robots.reachable) {
        status = 'skipped'
        note = 'host unreachable (or robots.txt fetch failed) — skipping politely'
      } else {
        const delay = Math.max(DEFAULTS.requestDelayMs, crawlDelayMs(robots) || 0)
        for (const start of src.startUrls) {
          let pageUrl = start.url
          let pagesLeft = maxPages
          while (pageUrl && pagesLeft-- > 0) {
            if (!isAllowed(robots, pageUrl)) {
              note += `robots disallows ${pageUrl}; `
              break
            }
            const html = await politeFetch(pageUrl, { delayMs: delay })
            snapshot(src.name, html)
            const { listings, nextUrl } = adapter.parse(html, { baseUrl: src.baseUrl, source: src.name, ...start })
            stats.pages++
            stats.found += listings.length
            for (const l of listings) {
              const r = upsertListing(db, l, now)
              if (r === 'added') stats.added++
              else stats.updated++
            }
            if (listings.length === 0) break // empty page → don't chase pagination
            pageUrl = nextUrl
          }
        }
      }
    }
  } catch (e) {
    status = 'error'
    note = String(e.message || e).slice(0, 300)
  }

  finishRun(db, runId, { ...stats, status, note })
  grandTotal += stats.found
  console.log(
    `[${src.name}] ${status} — pages:${stats.pages} found:${stats.found} added:${stats.added} updated:${stats.updated}${note ? ' — ' + note : ''}`,
  )
}

const summary = exportJson(db, outDir)
console.log(
  `Export → public/data/ · active listings: ${summary.totalActive} · sources: ${JSON.stringify(summary.bySource)}`,
)
db.close()

// Non-zero exit only on total failure so the scheduled workflow surfaces it;
// individual source errors are recorded in the runs table instead.
if (!useFixtures && grandTotal === 0) {
  console.error('No source returned any listings — treating run as failed.')
  process.exit(1)
}
