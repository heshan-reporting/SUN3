import * as cheerio from 'cheerio'
import { makeListing, absoluteUrl } from '../lib/normalize.js'

// Generic extractor for sites we don't have a dedicated adapter for.
// Strategy 1: schema.org JSON-LD (Product / Offer / Vehicle / ItemList) —
//   many marketplaces embed it for SEO and it is the most stable interface.
// Strategy 2: heuristic card detection — anchors whose surrounding block
//   contains an LKR price pattern.
export function parse(html, { baseUrl, category, subcategory, source }) {
  const $ = cheerio.load(html)
  const out = []
  const seen = new Set()
  const push = (l) => {
    if (l && !seen.has(l.url)) {
      seen.add(l.url)
      out.push(l)
    }
  }

  // --- JSON-LD ---
  $('script[type="application/ld+json"]').each((_, el) => {
    let data
    try {
      data = JSON.parse($(el).contents().text())
    } catch {
      return
    }
    const nodes = []
    const collect = (n) => {
      if (!n || typeof n !== 'object') return
      if (Array.isArray(n)) return n.forEach(collect)
      nodes.push(n)
      if (n['@graph']) collect(n['@graph'])
      if (n.itemListElement) collect(n.itemListElement)
      if (n.item) collect(n.item)
    }
    collect(data)
    for (const n of nodes) {
      const type = String(n['@type'] || '')
      if (!/product|vehicle|car|offer|apartment|house|residence|singlefamily/i.test(type)) continue
      const offer = n.offers && !Array.isArray(n.offers) ? n.offers : (n.offers || [])[0] || {}
      const price = n.price ?? offer.price
      const url = n.url || offer.url
      if (!url) continue
      push(makeListing({
        source, category, subcategory,
        url: absoluteUrl(url, baseUrl),
        title: n.name || n.title,
        priceText: price != null ? `Rs ${price}` : null,
        location: n.address?.addressLocality || n.areaServed || null,
        imageUrl: absoluteUrl(typeof n.image === 'string' ? n.image : n.image?.[0] || '', baseUrl),
        attrs: { jsonLdType: type },
      }))
    }
  })

  // --- Heuristic cards ---
  if (out.length < 5) {
    $('a[href]').each((_, el) => {
      const $a = $(el)
      const href = absoluteUrl($a.attr('href') || '', baseUrl)
      if (!href || !href.startsWith(new URL(baseUrl).origin)) return
      const block = $a.closest('article,li,div')
      const text = block.text() || ''
      const priceMatch = text.match(/(?:rs|lkr|රු)\.?\s*[\d,]{4,}(?:\.\d+)?\s*(?:m|million|lakhs?)?/i)
      if (!priceMatch) return
      const title = ($a.attr('title') || $a.find('h1,h2,h3,h4').first().text() || $a.text()).trim()
      if (title.length < 8 || /^(rs|lkr)/i.test(title)) return
      push(makeListing({
        source, category, subcategory,
        url: href,
        title,
        priceText: priceMatch[0],
        imageUrl: absoluteUrl(block.find('img').attr('src') || '', baseUrl),
      }))
    })
  }

  const next = $('a[rel="next"]').attr('href') ||
    $('a').filter((_, el) => /next|more|»/i.test($(el).text().trim())).first().attr('href')
  return { listings: out, nextUrl: next ? absoluteUrl(next, baseUrl) : null }
}
