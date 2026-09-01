import fs from 'node:fs'
import path from 'node:path'
import { TRACKED_MODELS } from '../config.js'
import { median } from './normalize.js'

// Export DB aggregates + latest listings as JSON for the static frontend.
export function exportJson(db, outDir) {
  fs.mkdirSync(outDir, { recursive: true })
  const now = new Date().toISOString()
  const cutoff = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString() // "active" = seen in 14 days

  const active = db.prepare(
    'SELECT * FROM listings WHERE last_seen >= ? ORDER BY last_seen DESC'
  ).all(cutoff)

  const bySource = {}
  const byCategory = {}
  for (const l of active) {
    bySource[l.source] = (bySource[l.source] || 0) + 1
    ;(byCategory[l.category] ||= []).push(l)
  }

  const categories = Object.fromEntries(
    Object.entries(byCategory).map(([cat, ls]) => {
      const prices = ls.map((l) => l.price_lkr).filter((p) => p && p > 50_000)
      return [cat, { count: ls.length, medianPriceLkr: median(prices), withPrice: prices.length }]
    }),
  )

  const models = TRACKED_MODELS.map((m) => {
    const ls = (byCategory.vehicles || []).filter((l) => m.pattern.test(l.title))
    const prices = ls.map((l) => l.price_lkr).filter((p) => p && p > 500_000)
    return { key: m.key, label: m.label, count: ls.length, medianPriceLkr: median(prices) }
  }).filter((m) => m.count > 0)

  const lastRuns = db.prepare(
    'SELECT source, started_at, finished_at, pages, found, added, updated, status FROM runs ORDER BY id DESC LIMIT 20'
  ).all()

  const priceDrops = db.prepare(`
    SELECT l.title, l.url, l.source, l.price_lkr AS current, ph.price_lkr AS previous
    FROM listings l
    JOIN price_history ph ON ph.listing_id = l.id
    WHERE ph.observed_at = (
      SELECT MAX(observed_at) FROM price_history
      WHERE listing_id = l.id AND observed_at < (SELECT MAX(observed_at) FROM price_history WHERE listing_id = l.id)
    )
    AND l.price_lkr < ph.price_lkr AND l.last_seen >= ?
    ORDER BY (ph.price_lkr - l.price_lkr) DESC LIMIT 10
  `).all(cutoff)

  const summary = {
    updatedAt: now,
    totalActive: active.length,
    bySource,
    categories,
    models,
    priceDrops,
    lastRuns,
  }
  fs.writeFileSync(path.join(outDir, 'market-summary.json'), JSON.stringify(summary, null, 1))

  const latest = active.slice(0, 100).map((l) => ({
    source: l.source,
    url: l.url,
    title: l.title,
    category: l.category,
    subcategory: l.subcategory,
    location: l.location,
    priceLkr: l.price_lkr,
    priceText: l.price_text,
    imageUrl: l.image_url,
    firstSeen: l.first_seen,
    lastSeen: l.last_seen,
  }))
  fs.writeFileSync(path.join(outDir, 'latest-listings.json'), JSON.stringify(latest, null, 1))

  return summary
}
