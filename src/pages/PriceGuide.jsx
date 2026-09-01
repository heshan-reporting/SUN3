import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

// 18 months of demo index data (Rs M): median asking price vs verified sale
// price for a Toyota Aqua 2019 on CeylonHub. Illustrative only.
const MONTHS = ['Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26']
const ASKING = [12.9, 12.8, 12.6, 12.5, 12.4, 12.3, 12.4, 12.5, 12.6, 12.5, 12.4, 12.2, 12.1, 12.0, 11.9, 11.8, 11.8, 11.7]
const SOLD = [12.1, 12.0, 11.9, 11.8, 11.7, 11.6, 11.7, 11.8, 11.8, 11.7, 11.6, 11.5, 11.4, 11.3, 11.2, 11.2, 11.1, 11.1]

const SERIES = [
  { name: 'Asking price', color: '#0e9384', data: ASKING },
  { name: 'Verified sold', color: '#d97706', data: SOLD },
]

const MODELS = [
  { model: 'Toyota Aqua 2019', fair: 'Rs 11.1 M – 11.7 M', trend: '▼ 5.1% (12 mo)' },
  { model: 'Suzuki Wagon R FX 2018', fair: 'Rs 6.6 M – 7.1 M', trend: '▼ 3.4% (12 mo)' },
  { model: 'Honda Vezel RS 2018', fair: 'Rs 13.2 M – 14.1 M', trend: '▬ 0.8% (12 mo)' },
  { model: 'Toyota KDH 201 2016', fair: 'Rs 14.8 M – 15.6 M', trend: '▲ 2.1% (12 mo)' },
  { model: 'Yamaha FZ-S V3 2022', fair: 'Rs 1.19 M – 1.31 M', trend: '▼ 6.2% (12 mo)' },
]

function PriceChart() {
  const W = 720, H = 300, PAD = { l: 44, r: 130, t: 16, b: 30 }
  const [hover, setHover] = useState(null)
  const yMin = 10.8, yMax = 13.2
  const x = (i) => PAD.l + (i / (MONTHS.length - 1)) * (W - PAD.l - PAD.r)
  const y = (v) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b)
  const paths = useMemo(() => SERIES.map((s) => s.data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')), [])
  const ticks = [11, 11.5, 12, 12.5, 13]

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.max(0, Math.min(MONTHS.length - 1, Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (MONTHS.length - 1))))
    setHover(i)
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 560 }} role="img"
        aria-label="Toyota Aqua 2019 price index, April 2025 to September 2026: median asking price fell from 12.9 to 11.7 million rupees; verified sale price from 12.1 to 11.1 million."
        onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#e4e7ec" strokeWidth="1" />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#667085">{t.toFixed(1)}</text>
          </g>
        ))}
        {[0, 5, 11, 17].map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#667085">{MONTHS[i]}</text>
        ))}
        {SERIES.map((s, si) => (
          <g key={s.name}>
            <path d={paths[si]} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" />
            <text x={W - PAD.r + 8} y={y(s.data[s.data.length - 1]) + 4} fontSize="12" fontWeight="600" fill="#344054">{s.name}</text>
            <circle cx={x(s.data.length - 1)} cy={y(s.data[s.data.length - 1])} r="4" fill={s.color} stroke="#fff" strokeWidth="2" />
          </g>
        ))}
        {hover != null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="#98a2b3" strokeWidth="1" strokeDasharray="3 3" />
            {SERIES.map((s) => (
              <circle key={s.name} cx={x(hover)} cy={y(s.data[hover])} r="4.5" fill={s.color} stroke="#fff" strokeWidth="2" />
            ))}
            <g transform={`translate(${Math.min(x(hover) + 10, W - PAD.r - 150)}, ${PAD.t + 6})`}>
              <rect width="150" height="62" rx="8" fill="#101828" opacity="0.92" />
              <text x="10" y="18" fontSize="11" fill="#e4e7ec" fontWeight="700">{MONTHS[hover]}</text>
              <text x="10" y="36" fontSize="11" fill="#5eead4">Asking: Rs {ASKING[hover].toFixed(1)} M</text>
              <text x="10" y="52" fontSize="11" fill="#fcd34d">Sold: Rs {SOLD[hover].toFixed(1)} M</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}

export default function PriceGuide() {
  return (
    <div className="container section doc">
      <h1>📊 CeylonHub Fair Price Index</h1>
      <p className="sub">
        Sri Lanka's first public price guide across vehicles, property and electronics — built from verified
        SafePay transactions, not asking prices. (Demo data shown.)
      </p>

      <div className="steps" style={{ marginBottom: 28 }}>
        <div className="step"><b>Rs 11.1–11.7 M</b><p>Fair range today — Toyota Aqua 2019</p></div>
        <div className="step"><b>▼ 5.1%</b><p>Aqua 12-month price change</p></div>
        <div className="step"><b>~6%</b><p>Typical gap between asking and actual sale price</p></div>
        <div className="step"><b>18 mo</b><p>Transaction history behind every estimate</p></div>
      </div>

      <div className="panel">
        <h3>Toyota Aqua 2019 — price index (Rs millions)</h3>
        <PriceChart />
        <p style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 8 }}>
          Sellers ask ~6% above what buyers actually pay. Deal ratings on every CeylonHub listing use the
          verified sale line, so you negotiate from reality.
        </p>
      </div>

      <h2>Fair price ranges — popular models</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Model</th><th>Fair price range</th><th>12-month trend</th></tr></thead>
          <tbody>
            {MODELS.map((m) => (
              <tr key={m.model}><td><b>{m.model}</b></td><td>{m.fair}</td><td>{m.trend}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="callout">
        <b>Why this matters:</b> after the 2025 import-tax changes, Sri Lankan vehicle pricing became deeply
        opaque — some sellers even advertise the leasing installment as the "price". The Fair Price Index turns
        that opacity into CeylonHub's moat: buyers come for the truth, and the data itself becomes a product for
        banks, insurers and leasing companies. <Link to="/strategy" style={{ fontWeight: 700 }}>See the full strategy →</Link>
      </div>
    </div>
  )
}
