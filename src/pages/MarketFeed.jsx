import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMarketData, timeAgo } from '../lib/marketData.js'
import { formatLKR } from '../data/listings.js'

const SOURCE_COLORS = {
  riyasewana: '#0e9384',
  patpat: '#d97706',
  autostream: '#6366f1',
}

// Category/subcategory → emoji, used for the branded thumbnail fallback when a
// source photo is unavailable, so every card stays visual and on-topic.
const ICONS = {
  car: '🚗', suv: '🚙', van: '🚐', motorcycle: '🏍️', 'three-wheeler': '🛺',
  apartment: '🏢', house: '🏡', land: '🌴', furniture: '🛋️', appliance: '🧊',
  phone: '📱', laptop: '💻', tv: '📺', gaming: '🎮',
}
const CAT_ICON = { vehicles: '🚗', property: '🏠', 'home-living': '🛋️', electronics: '📱' }
const iconFor = (l) => ICONS[l.subcategory] || CAT_ICON[l.category] || '🏷️'

function FeedCard({ l }) {
  const [imgFailed, setImgFailed] = useState(false)
  const sourceKey = l.source.replace('-sample', '')
  const color = SOURCE_COLORS[sourceKey] || '#667085'
  return (
    <a href={l.url} target="_blank" rel="noreferrer" className="card">
      <div className="card-media" style={{ background: `linear-gradient(135deg, ${color}, #0a3a35)` }}>
        {l.imageUrl && !imgFailed ? (
          <img
            src={l.imageUrl}
            alt={l.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span className="thumb-icon" aria-hidden>{iconFor(l)}</span>
        )}
        <div className="card-badges">
          <span className="badge" style={{ background: color, color: '#fff' }}>{sourceKey.toUpperCase()}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">{l.title}</div>
        <div className="card-price">{l.priceLkr ? formatLKR(l.priceLkr) : l.priceText || 'Price on request'}</div>
        <div className="card-meta">
          {l.location && <span>📍 {l.location}</span>}
          <span>🕐 seen {timeAgo(l.lastSeen)}</span>
        </div>
        <div className="card-foot">
          <span>View original ad ↗</span>
        </div>
      </div>
    </a>
  )
}

export default function MarketFeed() {
  const { summary, latest, error } = useMarketData()
  const [source, setSource] = useState('all')

  if (error || !summary) {
    return (
      <div className="container section doc">
        <h1>📡 Live Market Feed</h1>
        <div className="empty">
          Market data hasn't been generated for this deployment yet. The scraper workflow
          (Actions → "Scrape market data") produces it automatically every 6 hours.
        </div>
      </div>
    )
  }

  const items = (latest || []).filter((l) => source === 'all' || l.source === source)
  const sources = Object.keys(summary.bySource)

  return (
    <div className="container section">
      <div className="doc" style={{ marginBottom: 18 }}>
        <h1>📡 Live Market Feed</h1>
        <p className="sub">
          {summary.totalActive.toLocaleString('en-LK')} listings across {sources.length} sources · database
          updated {timeAgo(summary.updatedAt)} · pipeline refreshes automatically every 6 hours. Cards link
          to the original ads; photos load from the source (with a branded fallback).
          {sources.some((s) => s.endsWith('-sample')) && (
            <><br /><span style={{ color: 'var(--amber-600)', fontWeight: 600 }}>⚠ Showing a labelled sample dataset.</span>{' '}
            The target sites currently block automated access (HTTP 403 / robots.txt); live rows appear once a
            compliant source or data partnership is connected — see <code>docs/scraper.md</code>.</>
          )}
        </p>
      </div>
      <div className="results-head">
        <div className="count"><b>{items.length}</b> listings shown</div>
        <select value={source} onChange={(e) => setSource(e.target.value)} style={{ border: '1.5px solid var(--ink-200)', borderRadius: 9, padding: '8px 10px' }}>
          <option value="all">All sources</option>
          {sources.map((s) => <option key={s} value={s}>{s.replace('-sample', '')} ({summary.bySource[s]})</option>)}
        </select>
      </div>
      {items.length === 0
        ? <div className="empty">Nothing from this source in the current snapshot.</div>
        : <div className="listing-grid">{items.map((l) => <FeedCard key={l.url} l={l} />)}</div>}
      <p style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 20 }}>
        Aggregated from public listing pages for market-research purposes (robots.txt-aware, rate-limited);
        all rights to listings and images remain with their sources. Methodology: <Link to="/strategy" style={{ fontWeight: 600, color: 'var(--teal-700)' }}>strategy</Link> · <code>docs/scraper.md</code>.
      </p>
    </div>
  )
}
