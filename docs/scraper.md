# Market Data Scraper & Database

An automated pipeline that crawls public Sri Lankan listing sites, keeps a
**SQLite database with per-listing price history**, and exports JSON snapshots
that the static React site renders (the "Live market watch" section on the
Price Guide page). A scheduled GitHub Action keeps everything fresh with zero
servers.

## Architecture

```
┌─ GitHub Actions (cron, every 6h on main) ─────────────────────────────┐
│                                                                       │
│  scraper/cli.js                                                       │
│    ├─ robots.txt check per host (skip if disallowed/unreachable)      │
│    ├─ rate-limited fetch (≥3s/request, honours Crawl-delay, backoff   │
│    │   on 429/503, identifying User-Agent)                            │
│    ├─ adapters: riyasewana (site-specific) · generic (JSON-LD +       │
│    │   heuristic cards) for patpat / autostream / others              │
│    ├─ normalize (LKR price parsing: "Rs 6.85M", "115 lakhs", …)       │
│    ├─ data/market.db  (SQLite: listings ∪ price_history ∪ runs)       │
│    └─ export → public/data/market-summary.json + latest-listings.json │
│                                                                       │
│  → git commit data/ + public/data/  → push to main                    │
└──────────────────────┬────────────────────────────────────────────────┘
                       ▼
        Pages workflow rebuilds the site → frontend fetches
        ./data/*.json → "Live market watch" updates automatically
```

Because GitHub Pages is static, the **repository itself is the database
host**: `data/market.db` is committed after each run (it stays small — WAL
sidecar files are gitignored), and the JSON exports in `public/data/` are what
the browser actually loads. When the project later gets a real backend, the
same scraper runs against Postgres with only `lib/store.js` swapped.

## Components

| Path | Role |
|------|------|
| `scraper/config.js` | Source list (enable/disable per site), start URLs, politeness defaults, tracked model buckets |
| `scraper/lib/robots.js` | robots.txt fetch/parse; wildcard rules, `Crawl-delay`; unreachable host ⇒ **skip** (fail closed) |
| `scraper/lib/fetcher.js` | Per-origin rate limiting, retries with backoff, hard backoff on 429/503 |
| `scraper/adapters/riyasewana.js` | Site-specific parser (item cards) with heuristic fallback + pagination |
| `scraper/adapters/generic.js` | schema.org JSON-LD extractor + LKR-price-card heuristic — works on many sites unchanged |
| `scraper/lib/normalize.js` | Common listing schema; Sri Lankan price parsing (M / lakhs / crore / comma formats) |
| `scraper/lib/store.js` | SQLite schema + upserts; **detects price changes and appends to `price_history`**; run log |
| `scraper/lib/export.js` | Aggregates → JSON: totals, per-source counts, per-category medians, per-model medians, detected price drops, run log |
| `scraper/cli.js` | Orchestrator (`--source=`, `--max-pages=`, `--fixtures`) |
| `scraper/test.js` | Offline unit tests (`npm run scrape:test`) incl. price-parsing and robots regressions |
| `.github/workflows/scrape.yml` | Cron every 6h + manual dispatch; tests → crawl → commit-if-changed |

## Database schema (SQLite, `data/market.db`)

- **`listings`** — one row per (source, source_id): title, category, location, current price, first_seen/last_seen timestamps. "Active" = seen within 14 days; disappeared listings stop updating `last_seen` (a proxy for *sold/delisted*, which later feeds days-on-market analytics).
- **`price_history`** — appended whenever a listing's parsed price changes; this is the raw material for the Fair Price Index and the "price drops" feed.
- **`runs`** — per-source crawl log (pages, found, added, updated, status, note) surfaced in the exported summary for observability.

## Running it

```bash
npm run scrape:test       # offline parser/robots unit tests
npm run scrape:fixtures   # full pipeline against local fixture HTML (no network)
npm run scrape            # live crawl of enabled sources
node scraper/cli.js --source=riyasewana --max-pages=5
```

Note: the development sandbox used to build this repo blocks outbound access
to `.lk` domains, so live crawling was validated structurally (fixtures +
tests); the first real crawl happens on the GitHub Actions runner, which has
normal internet access. If a site changes markup, the run log will show
`found:0` and the workflow fails loudly rather than silently.

## Adding a source

1. Add an entry to `SOURCES` in `scraper/config.js` (start with `adapter: 'generic'` — many sites expose JSON-LD).
2. If generic extraction is weak, copy `adapters/riyasewana.js` as a template and register it in `cli.js`.
3. Add a fixture HTML file + a test case.
4. Keep `enabled: false` until you've reviewed the site's terms (below).

## Compliance & ethics (read before enabling more sources)

- **robots.txt is enforced in code** — disallowed paths are never fetched, `Crawl-delay` is honoured, and an unreachable robots.txt means the host is skipped entirely.
- **Politeness:** ≥3s between requests per host, ≤3 index pages per source per run by default, exponential backoff, and an identifying User-Agent pointing at this repository.
- **Data use:** only public listing-page metadata (title/price/location/URL) is stored, for market-index aggregation; the site links back to the original ads and does not republish descriptions or images.
- **Terms of service:** some marketplaces prohibit scraping in their ToS regardless of robots.txt (ikman is deliberately not configured; LankaPropertyWeb ships `enabled: false`). Review each target's terms — and ideally pursue partnerships or official feeds — before enabling it. This framework is built for the compliant path: it's trivially pointed at partner/API feeds instead of HTML when those exist.
- For production scale, replace committed SQLite with a hosted DB and move crawling off GitHub Actions (runtime limits) to a scheduled worker.
