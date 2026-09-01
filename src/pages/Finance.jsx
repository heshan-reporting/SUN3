import { useState } from 'react'

const LENDERS = [
  { name: 'LOLC Finance', rate: 14.5, note: 'Largest NBFI · 219 branches' },
  { name: "People's Leasing", rate: 15.0, note: 'Est. 1995 · 111 branches' },
  { name: 'Commercial Bank Leasing', rate: 13.5, note: 'Bank leasing arm' },
  { name: 'Bank of Ceylon Leasing', rate: 13.8, note: 'State bank' },
]

function monthly(principal, annualRate, months) {
  const r = annualRate / 100 / 12
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export default function Finance() {
  const [price, setPrice] = useState(11_500_000)
  const [downPct, setDownPct] = useState(30)
  const [months, setMonths] = useState(60)
  const principal = price * (1 - downPct / 100)
  const best = Math.min(...LENDERS.map((l) => l.rate))

  return (
    <div className="container section">
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>💳 Compare leasing across every lender</h1>
      <p style={{ color: 'var(--ink-500)', marginBottom: 26, maxWidth: 640 }}>
        Sri Lanka's first <b>neutral</b> multi-lender comparison — we show every partner's real rate side by side,
        instead of pushing one finance company. One application, offers from all. (Demo rates shown, ~13–18% p.a.
        is the current market band.)
      </p>
      <div className="calc-grid">
        <div className="panel">
          <h3>Your lease</h3>
          <div className="range-row">
            <div className="row-top"><span>Vehicle price</span><b>Rs {price.toLocaleString('en-LK')}</b></div>
            <input type="range" min="1000000" max="40000000" step="250000" value={price} onChange={(e) => setPrice(+e.target.value)} />
          </div>
          <div className="range-row">
            <div className="row-top"><span>Down payment</span><b>{downPct}% (Rs {(price * downPct / 100).toLocaleString('en-LK')})</b></div>
            <input type="range" min="20" max="60" step="5" value={downPct} onChange={(e) => setDownPct(+e.target.value)} />
          </div>
          <div className="range-row">
            <div className="row-top"><span>Term</span><b>{months} months</b></div>
            <input type="range" min="12" max="84" step="12" value={months} onChange={(e) => setMonths(+e.target.value)} />
          </div>
          <div className="calc-out">
            <div className="sub">Best available estimate</div>
            <div className="monthly">Rs {Math.round(monthly(principal, best, months)).toLocaleString('en-LK')}</div>
            <div className="sub">per month at {best}% p.a. · amount financed Rs {principal.toLocaleString('en-LK')}</div>
          </div>
        </div>
        <div className="panel">
          <h3>Offers from partner lenders</h3>
          {LENDERS.map((l) => (
            <div key={l.name} className="inspection-row" style={{ marginBottom: 8, alignItems: 'center' }}>
              <div>
                <b style={{ fontSize: 14 }}>{l.name}</b>
                <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{l.note} · {l.rate}% p.a.</div>
              </div>
              <b style={{ color: 'var(--teal-800)' }}>Rs {Math.round(monthly(principal, l.rate, months)).toLocaleString('en-LK')}/mo</b>
            </div>
          ))}
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 10 }}>Get pre-approved — one form, all lenders</button>
          <p style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 10 }}>
            Pre-approval is soft-checked and free. Lenders pay CeylonHub per funded lease — you never pay us.
          </p>
        </div>
      </div>
    </div>
  )
}
