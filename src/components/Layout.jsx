import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/listings.js'

const LANGS = ['EN', 'සිං', 'தமிழ்']

export function Header() {
  const [lang, setLang] = useState('EN')
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const go = (e) => {
    e.preventDefault()
    navigate(`/c/vehicles${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>🛡️ Every seller NIC-verified · Every payment protected by SafePay escrow</span>
          <div className="topbar-links">
            <Link to="/strategy">Investor deck</Link>
            <div className="lang-switch" title="Full Sinhala & Tamil interfaces ship at launch">
              {LANGS.map((l) => (
                <button key={l} className={l === lang ? 'active' : ''} onClick={() => setLang(l)}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">C</span>
            CeylonHub<span className="lk">.lk</span>
          </Link>
          <form className="search-bar" onSubmit={go}>
            <input placeholder="Search Toyota Aqua, apartments in Colombo 5, iPhone…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button type="submit">Search</button>
          </form>
          <div className="header-actions">
            <Link to="/finance" className="btn btn-ghost">Financing</Link>
            <Link to="/sell" className="btn btn-primary">+ Post Ad — Free</Link>
          </div>
        </div>
        <nav className="nav-cats">
          <div className="container">
            {CATEGORIES.map((c) => (
              <NavLink key={c.slug} to={`/c/${c.slug}`} className={({ isActive }) => (isActive ? 'active' : '')}>
                <span>{c.emoji}</span>{c.name}
              </NavLink>
            ))}
            <NavLink to="/price-guide" className={({ isActive }) => (isActive ? 'active' : '')}>📊 Price Guide</NavLink>
            <NavLink to="/market" className={({ isActive }) => (isActive ? 'active' : '')}>📡 Live Feed</NavLink>
            <NavLink to="/strategy" className={({ isActive }) => (isActive ? 'active' : '')}>🧭 Strategy</NavLink>
          </div>
        </nav>
      </header>
    </>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo"><span className="logo-mark">C</span>CeylonHub<span className="lk">.lk</span></div>
            <p>Sri Lanka's trust-first marketplace. Verified sellers, escrow-protected payments, certified inspections — in Sinhala, Tamil and English.</p>
          </div>
          <div>
            <h4>Marketplace</h4>
            {CATEGORIES.map((c) => <Link key={c.slug} to={`/c/${c.slug}`}>{c.name}</Link>)}
          </div>
          <div>
            <h4>Trust & Tools</h4>
            <Link to="/safepay">SafePay Escrow</Link>
            <Link to="/price-guide">Fair Price Index</Link>
            <Link to="/finance">Leasing Calculator</Link>
            <Link to="/sell">Post an Ad</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/strategy">Strategy & Revenue Model</Link>
            <Link to="/strategy">Why CeylonHub Wins</Link>
            <Link to="/safepay">Safety Centre</Link>
          </div>
        </div>
        <div className="fine">
          <span>© 2026 CeylonHub (concept prototype). Demo listings — not real offers.</span>
          <span>Built with React · Deployed on GitHub Pages</span>
        </div>
      </div>
    </footer>
  )
}
