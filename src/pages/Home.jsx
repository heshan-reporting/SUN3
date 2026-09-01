import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CATEGORIES, LISTINGS } from '../data/listings.js'
import ListingCard from '../components/ListingCard.jsx'

const TRUST = [
  { ico: '🪪', t: 'NIC-Verified Sellers', s: 'Every seller identity-checked before their first ad goes live' },
  { ico: '🛡️', t: 'SafePay Escrow', s: 'Money held safely until you receive and approve the item' },
  { ico: '🔍', t: '220-Point Inspections', s: 'Independent vehicle & electronics reports you can download' },
  { ico: '📊', t: 'Fair Price Index', s: 'Every listing rated against real market data — no more guessing' },
]

export default function Home() {
  const featured = LISTINGS.filter((l) => l.featured)
  const fresh = LISTINGS.filter((l) => !l.featured).slice(0, 8)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('vehicles')
  const navigate = useNavigate()
  const go = (e) => {
    e.preventDefault()
    navigate(`/c/${cat}${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Buy, sell & rent with <em>zero fear</em>.<br />Sri Lanka's trust-first marketplace.</h1>
          <p className="lead">
            Vehicles, rentals, property, home & living and electronics — every seller verified,
            every payment protected, every price checked against the market.
          </p>
          <form className="hero-search" onSubmit={go}>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.emoji} {c.name}</option>)}
            </select>
            <input placeholder="What are you looking for?" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn btn-teal" type="submit">Search</button>
          </form>
          <div className="hero-stats">
            <div className="hero-stat"><b>100%</b><span>free to list</span></div>
            <div className="hero-stat"><b>Rs 0</b><span>lost to scams under SafePay</span></div>
            <div className="hero-stat"><b>3</b><span>languages — සිංහල · தமிழ் · English</span></div>
            <div className="hero-stat"><b>25</b><span>districts covered</span></div>
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div className="container">
          {TRUST.map((t) => (
            <div className="trust-item" key={t.t}>
              <div className="ico">{t.ico}</div>
              <div><b>{t.t}</b><span>{t.s}</span></div>
            </div>
          ))}
        </div>
      </div>

      <section className="section container">
        <div className="section-head">
          <div><h2>Browse by category</h2><p>One account, five marketplaces</p></div>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/c/${c.slug}`} className="cat-tile">
              <span className="emoji">{c.emoji}</span>
              <b>{c.name}</b>
              <span>{c.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><h2>Featured — verified & inspected</h2><p>Hand-checked listings with full reports</p></div>
          <Link className="see-all" to="/c/vehicles">See all →</Link>
        </div>
        <div className="listing-grid">
          {featured.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><h2>Fresh on CeylonHub</h2><p>Latest verified listings across the island</p></div>
        </div>
        <div className="listing-grid">
          {fresh.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><h2>How SafePay protects you</h2><p>The escrow that ends "pay first, hope later"</p></div>
          <Link className="see-all" to="/safepay">Learn more →</Link>
        </div>
        <div className="steps">
          <div className="step"><div className="num">1</div><b>Agree the deal</b><p>Chat in-app, agree a price. The seller's identity is already NIC-verified.</p></div>
          <div className="step"><div className="num">2</div><b>Pay into SafePay</b><p>Pay via LankaQR, bank transfer or card. CeylonHub holds the money — not the seller.</p></div>
          <div className="step"><div className="num">3</div><b>Inspect & approve</b><p>Receive the item or vehicle, check it against the listing and inspection report.</p></div>
          <div className="step"><div className="num">4</div><b>Money released</b><p>Approve and the seller is paid instantly. Problem? Full refund, dispute team in 24h.</p></div>
        </div>
      </section>

      <section className="section container">
        <div className="cta-band">
          <div>
            <h2>Selling? It takes 60 seconds — and it's free.</h2>
            <p>AI writes your ad from photos, suggests the right price, and translates it into all three languages.</p>
          </div>
          <Link to="/sell" className="btn btn-primary btn-lg">Post your ad free →</Link>
        </div>
      </section>
    </>
  )
}
