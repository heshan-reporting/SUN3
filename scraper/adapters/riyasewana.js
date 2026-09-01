import * as cheerio from 'cheerio'
import { makeListing, absoluteUrl } from '../lib/normalize.js'

// Riyasewana search pages render listings as a list of item blocks, each with
// an anchor to the ad, a title, and text blocks carrying price/location/date.
// Site markup shifts over time, so this parses defensively: primary selectors
// first, then a heuristic fallback over anchors that look like ad links.
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

  // Primary: <li class="item"> cards
  $('li.item').each((_, el) => {
    const $el = $(el)
    const a = $el.find('h2 a, a').first()
    const href = a.attr('href')
    const title = a.attr('title') || a.text()
    if (!href) return
    const boxes = $el.find('.boxintxt').map((_, b) => $(b).text().trim()).get()
    // Price lives in its own box ("Rs. 11,450,000" or "Negotiable"). Require a
    // plausible amount so "RS 2018" inside a title never counts as a price.
    const priceBox = boxes.find((b) => /rs\.?\s*\d[\d,]{4,}/i.test(b) || /negotiable/i.test(b))
    const priceMatch = priceBox ? null : $el.text().match(/(?:^|\s)rs\.?\s*\d[\d,]{4,}/i)
    const location = boxes.find((b) => b && !/rs|km|negoti|\d{4}-\d{2}/i.test(b)) || null
    push(makeListing({
      source, category, subcategory,
      url: absoluteUrl(href, baseUrl),
      title,
      priceText: priceBox || (priceMatch ? priceMatch[0] : null),
      location,
      imageUrl: absoluteUrl($el.find('img').attr('src') || '', baseUrl),
      attrs: { boxes },
    }))
  })

  // Fallback: anchors under /search/-style ad URLs with nearby price text
  if (out.length === 0) {
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || ''
      if (!/riyasewana\.com\/(?:buy|ad)\//i.test(absoluteUrl(href, baseUrl) || '')) return
      const title = $(el).attr('title') || $(el).text()
      const around = $(el).closest('li,div,td').text()
      const priceMatch = around.match(/rs\.?\s*[\d,]{4,}/i)
      push(makeListing({
        source, category, subcategory,
        url: absoluteUrl(href, baseUrl),
        title,
        priceText: priceMatch ? priceMatch[0] : null,
      }))
    })
  }

  // Pagination: next page link
  const next = $('a').filter((_, el) => /next|»/i.test($(el).text())).first().attr('href')
  return { listings: out, nextUrl: next ? absoluteUrl(next, baseUrl) : null }
}
