import { useState } from 'react'
import { CATEGORIES, DISTRICTS } from '../data/listings.js'

const STEPS = ['Category', 'Details', 'Verify & Publish']

export default function Sell() {
  const [step, setStep] = useState(0)
  const [cat, setCat] = useState('vehicles')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [done, setDone] = useState(false)

  return (
    <div className="container section">
      <div className="wizard">
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Post your ad — free, in 60 seconds</h1>
        <p style={{ color: 'var(--ink-500)', marginBottom: 22 }}>
          Free forever for individuals. No listing caps, no forced boosts. Verified ads sell up to 3× faster.
        </p>
        <div className="wizard-steps">
          {STEPS.map((s, i) => <div key={s} className={`ws ${i <= step ? 'on' : ''}`}>{i + 1}. {s}</div>)}
        </div>

        {done ? (
          <div className="panel" style={{ textAlign: 'center', padding: 44 }}>
            <div style={{ fontSize: 48 }}>🎉</div>
            <h3 style={{ fontSize: 22, margin: '10px 0' }}>Demo complete!</h3>
            <p style={{ color: 'var(--ink-500)' }}>
              In the live product your ad would now go through instant AI moderation, NIC verification,
              and be published in Sinhala, Tamil and English simultaneously.
            </p>
          </div>
        ) : (
          <div className="panel">
            {step === 0 && (
              <>
                <div className="form-row">
                  <label>What are you selling or renting?</label>
                  <select value={cat} onChange={(e) => setCat(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <label>District</label>
                  <select>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select>
                </div>
                <button className="btn btn-teal btn-lg" onClick={() => setStep(1)}>Continue →</button>
              </>
            )}
            {step === 1 && (
              <>
                <div className="form-row">
                  <label>Title</label>
                  <input placeholder="e.g. Toyota Aqua G Grade 2019" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-2col">
                  <div className="form-row">
                    <label>Price (Rs)</label>
                    <input type="number" placeholder="e.g. 11500000" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div className="form-row">
                    <label>Photos</label>
                    <input type="file" multiple disabled title="Disabled in demo" />
                  </div>
                </div>
                <div className="form-row">
                  <label>Description</label>
                  <textarea rows={4} placeholder="Or let AI write it from your photos…" />
                </div>
                <div className="ai-hint">
                  🤖 <b>AI Assistant:</b> upload photos and we auto-detect make, model, year and condition, draft your
                  description in three languages, and suggest a price from the Fair Price Index
                  {price ? <> — your Rs {Number(price).toLocaleString('en-LK')} looks about right for a well-kept example.</> : '.'}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-teal btn-lg" onClick={() => setStep(2)}>Continue →</button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h3>Verification & add-ons</h3>
                <div className="check-row"><input type="checkbox" defaultChecked disabled /> NIC verification (required, free, one-time)</div>
                <div className="check-row"><input type="checkbox" defaultChecked /> Accept SafePay escrow payments (recommended — buyers trust it)</div>
                {cat === 'vehicles' && <div className="check-row"><input type="checkbox" /> Book a 220-point inspection — Rs 9,900 (inspected ads sell ~3× faster)</div>}
                {cat === 'property' && <div className="check-row"><input type="checkbox" /> Legal title verification — from Rs 14,900</div>}
                {cat === 'electronics' && <div className="check-row"><input type="checkbox" /> Certified Refurbished grading + 6-month warranty (for shops)</div>}
                <div className="check-row"><input type="checkbox" /> Boost to top of category — Rs 750 / 7 days (optional)</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setDone(true)}>Publish free ✓</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
