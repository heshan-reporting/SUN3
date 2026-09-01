import { Link } from 'react-router-dom'

export default function SafePay() {
  return (
    <div className="container section doc">
      <h1>🛡️ SafePay — escrow for every deal</h1>
      <p className="sub">
        The single biggest complaint about buying online in Sri Lanka is "I paid an advance and the seller
        disappeared." SafePay makes that structurally impossible.
      </p>

      <div className="steps" style={{ marginBottom: 30 }}>
        <div className="step"><div className="num">1</div><b>Buyer pays CeylonHub</b><p>LankaQR, bank transfer (CEFTS), card or wallet. The seller never holds your money early.</p></div>
        <div className="step"><div className="num">2</div><b>Funds held in trust</b><p>Held in a regulated partner-bank trust account, visible to both parties in the app.</p></div>
        <div className="step"><div className="num">3</div><b>Deliver & inspect</b><p>Item delivered or handed over at a Safe Deal Point. Buyer has 48 hours to inspect.</p></div>
        <div className="step"><div className="num">4</div><b>Release or refund</b><p>Approve → instant payout to seller. Dispute → human resolution team within 24 hours.</p></div>
      </div>

      <h2>What it covers</h2>
      <ul>
        <li><b>Goods (electronics, home & living):</b> flat 2% buyer-protection fee, capped at Rs 4,900. Free for the seller.</li>
        <li><b>Vehicle deposits & advances:</b> hold a booking deposit safely while inspection and paperwork complete — flat Rs 4,900.</li>
        <li><b>Rental & tenancy deposits:</b> deposits held for the rental period and released per the digital agreement — fair to both sides, ends deposit theft.</li>
        <li><b>Wedding/event bookings:</b> 50% confirms the date, balance releases after the event.</li>
      </ul>

      <h2>Safe Deal Points</h2>
      <p>
        Partner locations (fuel stations, bank branches, partner dealerships) in every district with CCTV and
        staff awareness — a neutral, safe place to meet, inspect and hand over. Free to use for any CeylonHub deal.
      </p>

      <div className="callout">
        <b>Why sellers love it too:</b> "SafePay accepted" listings convert better because buyers trust them,
        and sellers get guaranteed cleared funds — no fake bank slips, no bounced cheques, no cash-counting risk.
      </div>

      <p style={{ marginTop: 20 }}>
        <Link to="/" className="btn btn-teal btn-lg">Browse protected listings →</Link>
      </p>
    </div>
  )
}
