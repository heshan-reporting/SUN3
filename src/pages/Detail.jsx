import { useParams, Link } from 'react-router-dom'
import { getListing, getCategory, formatLKR, gradientFor, DEAL_LABELS } from '../data/listings.js'

function monthlyLease(price) {
  // Indicative: 70% financed over 60 months at 15% p.a. flat-ish reducing approximation
  const principal = price * 0.7
  const r = 0.15 / 12
  const n = 60
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
}

export default function Detail() {
  const { id } = useParams()
  const l = getListing(id)
  if (!l) return <div className="container empty">Listing not found. <Link to="/">Go home</Link></div>
  const cat = getCategory(l.cat)
  const deal = DEAL_LABELS[l.deal]
  const showLease = l.cat === 'vehicles' && !l.per

  return (
    <div className="container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to={`/c/${l.cat}`}>{cat.name}</Link> / {l.title}
      </div>
      <div className="detail-layout" style={{ marginBottom: 48 }}>
        <div>
          <div className="detail-media" style={{ background: gradientFor(l.cat, l.id) }}>
            <span className="thumb-icon">{l.icon}</span>
            <div className="card-badges">
              {l.verified && <span className="badge badge-verified">✓ VERIFIED SELLER</span>}
              {l.inspected && <span className="badge badge-inspected">🔍 INSPECTED</span>}
              {l.escrow && <span className="badge badge-escrow">🛡️ SAFEPAY ELIGIBLE</span>}
            </div>
          </div>

          <div className="panel" style={{ marginTop: 18 }}>
            <h3>Details</h3>
            <div className="spec-grid">
              {Object.entries(l.specs).map(([k, v]) => (
                <div className="spec" key={k}><b>{k}</b>{v}</div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Description</h3>
            <p style={{ fontSize: 14.5, color: 'var(--ink-700)' }}>{l.desc}</p>
          </div>

          {l.inspection && (
            <div className="panel">
              <h3>🔍 CeylonHub Inspection Report <span className="score-pill">{l.inspection.score}/100</span></h3>
              <div className="inspection-list">
                <div className="inspection-row"><span>Mechanical / diagnostic</span><b>{l.inspection.engine}</b></div>
                <div className="inspection-row"><span>Body & exterior</span><b>{l.inspection.body}</b></div>
                <div className="inspection-row"><span>Battery / hybrid system</span><b>{l.inspection.hybrid}</b></div>
                <div className="inspection-row"><span>History check</span><b>{l.inspection.accident}</b></div>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 10 }}>
                Independent 220-point inspection by a CeylonHub-certified inspector. Full PDF report available to serious buyers.
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="panel">
            <div className="price-xl">{formatLKR(l.price)}{l.per && <span style={{ fontSize: 15, color: 'var(--ink-500)' }}> {l.per}</span>}</div>
            {deal && (
              <div className={`deal-meter ${l.deal === 'great' || l.deal === 'good' ? 'great' : 'fair'}`}>
                <span style={{ fontSize: 26 }}>{l.deal === 'great' ? '🟢' : l.deal === 'good' ? '🟩' : l.deal === 'fair' ? '🟡' : '🔴'}</span>
                <div>
                  <b>{deal.label}</b><br />
                  <span>This listing is {deal.blurb}.</span>
                </div>
              </div>
            )}
            {showLease && (
              <div className="ai-hint" style={{ marginBottom: 14 }}>
                💳 <b>From ~Rs {monthlyLease(l.price).toLocaleString('en-LK')}/month</b> with 30% down over 60 months.{' '}
                <Link to="/finance" style={{ fontWeight: 700, textDecoration: 'underline' }}>Compare leasing offers →</Link>
              </div>
            )}
            <button className="btn btn-teal btn-lg" style={{ width: '100%', marginBottom: 10 }}>💬 Chat with seller</button>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 10 }}>🛡️ Buy with SafePay</button>
            <button className="btn btn-ghost" style={{ width: '100%' }}>📞 Show number</button>
            <p style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 12 }}>
              ⚠️ Never pay a seller directly in advance. SafePay holds your money until you approve the item.
            </p>
          </div>

          <div className="panel">
            <h3>Seller</h3>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{l.seller}</p>
            {l.verified
              ? <p className="tag-verified-inline" style={{ marginTop: 6 }}>✓ NIC verified · Phone verified · Member since 2025</p>
              : <p style={{ fontSize: 13, color: 'var(--red-600)', marginTop: 6 }}>⚠ This seller has not completed identity verification.</p>}
          </div>

          <div className="panel">
            <h3>Safety checklist</h3>
            <div className="check-row">✅ Meet at a Safe Deal Point or busy public place</div>
            <div className="check-row">✅ Use SafePay for any advance or deposit</div>
            {l.cat === 'vehicles' && <div className="check-row">✅ Ask for the CR book & CeylonHub title check</div>}
            {l.cat === 'property' && <div className="check-row">✅ Request the deed & title verification report</div>}
            <div className="check-row">✅ Report suspicious behaviour — 24/7 hotline</div>
          </div>
        </div>
      </div>
    </div>
  )
}
