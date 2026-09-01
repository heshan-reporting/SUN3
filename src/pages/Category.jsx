import { useMemo, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { listingsFor, getCategory, DISTRICTS } from '../data/listings.js'
import ListingCard from '../components/ListingCard.jsx'

export default function Category() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const cat = getCategory(slug)
  const all = listingsFor(slug)

  const [district, setDistrict] = useState('All districts')
  const [maxPrice, setMaxPrice] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [inspectedOnly, setInspectedOnly] = useState(false)
  const [sort, setSort] = useState('best')

  const results = useMemo(() => {
    let r = all
    if (q) r = r.filter((l) => (l.title + ' ' + l.desc).toLowerCase().includes(q))
    if (district !== 'All districts') r = r.filter((l) => l.location === district)
    if (maxPrice) r = r.filter((l) => l.price <= Number(maxPrice))
    if (verifiedOnly) r = r.filter((l) => l.verified)
    if (inspectedOnly) r = r.filter((l) => l.inspected)
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price)
    return r
  }, [all, q, district, maxPrice, verifiedOnly, inspectedOnly, sort])

  if (!cat) return <div className="container empty">Category not found. <Link to="/">Go home</Link></div>

  return (
    <div className="container">
      <div className="breadcrumbs"><Link to="/">Home</Link> / {cat.name}</div>
      <div className="cat-layout" style={{ marginBottom: 48 }}>
        <aside className="filters">
          <h3>Filter {cat.name}</h3>
          <div className="filter-group">
            <label>District</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option>All districts</option>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Max price (Rs)</label>
            <input type="number" placeholder="e.g. 15000000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
          <div className="filter-group">
            <label>Trust filters</label>
            <label className="check-row" style={{ textTransform: 'none', letterSpacing: 0 }}>
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
              ✓ Verified sellers only
            </label>
            <label className="check-row" style={{ textTransform: 'none', letterSpacing: 0 }}>
              <input type="checkbox" checked={inspectedOnly} onChange={(e) => setInspectedOnly(e.target.checked)} />
              🔍 Inspected listings only
            </label>
          </div>
          {slug === 'vehicles' && (
            <div className="ai-hint">
              💡 <b>Budget search:</b> can't decide on a price? Use the <Link to="/finance" style={{ fontWeight: 700, textDecoration: 'underline' }}>leasing calculator</Link> to shop by monthly installment instead.
            </div>
          )}
        </aside>
        <div>
          <div className="results-head">
            <div className="count"><b>{results.length}</b> listings {q && <>for “{q}”</>} in {cat.name}</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ border: '1.5px solid var(--ink-200)', borderRadius: 9, padding: '8px 10px' }}>
              <option value="best">Best match</option>
              <option value="low">Price: low → high</option>
              <option value="high">Price: high → low</option>
            </select>
          </div>
          {results.length === 0
            ? <div className="empty">No listings match those filters (demo dataset is small). Try clearing filters.</div>
            : <div className="listing-grid">{results.map((l) => <ListingCard key={l.id} l={l} />)}</div>}
        </div>
      </div>
    </div>
  )
}
