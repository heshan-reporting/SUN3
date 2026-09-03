import { useEffect, useState } from 'react'

// Loads the JSON snapshots the scraper exports into public/data/. Returns
// null until loaded; { error } if the files aren't there (e.g. scraper has
// never run in this deployment), letting pages fall back to demo content.
export function useMarketData() {
  const [state, setState] = useState({ summary: null, latest: null, error: null })
  useEffect(() => {
    let alive = true
    const base = import.meta.env.BASE_URL
    // If a live Worker API is configured (VITE_MARKET_API=https://<worker>.workers.dev),
    // read live rows from D1; otherwise fall back to the committed static JSON.
    const api = import.meta.env.VITE_MARKET_API
    const summaryUrl = api ? `${api}/api/market-summary` : `${base}data/market-summary.json`
    const latestUrl = api ? `${api}/api/latest-listings` : `${base}data/latest-listings.json`
    Promise.all([
      fetch(summaryUrl).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(latestUrl).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    ])
      .then(([summary, latest]) => alive && setState({ summary, latest, error: null }))
      .catch((e) => alive && setState({ summary: null, latest: null, error: String(e) }))
    return () => { alive = false }
  }, [])
  return state
}

export function timeAgo(iso) {
  if (!iso) return ''
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 48) return `${hrs} h ago`
  return `${Math.round(hrs / 24)} days ago`
}
