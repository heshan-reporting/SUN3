import { Link } from 'react-router-dom'
import { formatLKR, gradientFor, DEAL_LABELS } from '../data/listings.js'

export default function ListingCard({ l }) {
  const deal = DEAL_LABELS[l.deal]
  return (
    <Link to={`/l/${l.id}`} className="card">
      <div className="card-media" style={{ background: gradientFor(l.cat, l.id) }}>
        <span className="thumb-icon" aria-hidden>{l.icon}</span>
        <div className="card-badges">
          {l.featured && <span className="badge badge-featured">★ FEATURED</span>}
          {l.verified && <span className="badge badge-verified">✓ VERIFIED</span>}
          {l.inspected && <span className="badge badge-inspected">🔍 INSPECTED</span>}
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">{l.title}</div>
        <div className="card-price">
          {formatLKR(l.price)}{l.per && <span className="per"> {l.per}</span>}
          {' '}{deal && <span className={`badge ${deal.cls}`}>{deal.label}</span>}
        </div>
        <div className="card-meta">
          <span>📍 {l.location}</span>
          <span>🕐 {l.posted}</span>
        </div>
        <div className="card-foot">
          <span className="seller-chip"><span className="dot" />{l.seller.split('(')[0].trim()}</span>
          {l.escrow && <span title="SafePay escrow available">🛡️ SafePay</span>}
        </div>
      </div>
    </Link>
  )
}
