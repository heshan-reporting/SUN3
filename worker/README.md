# CeylonHub Scraper Worker (Cloudflare)

An always-on alternative to the GitHub Actions cron. Runs the market crawl on
Cloudflare's edge, stores results in a **D1 (SQLite) database**, and serves the
same JSON the React site reads — with **live** data instead of a committed
snapshot.

## Why a Worker (vs. the GitHub Action)

| | GitHub Actions cron (`.github/workflows/scrape.yml`) | Cloudflare Worker (this) |
|---|---|---|
| Runs | on a schedule, then exits | always-on; cron + on-demand HTTP |
| Egress IP | GitHub datacenter (riyasewana/patpat return **403**) | Cloudflare edge (different reputation) |
| Database | SQLite committed to the repo | D1 (managed SQLite), queried live |
| Serves API | no (static JSON only) | yes (`/api/*`, CORS to your site) |

Both honour robots.txt and rate-limit. Neither evades bot protection — if a
source keeps 403'ing the Worker too, the compliant fix is a data partnership or
an allowed source, not spoofing.

## Endpoints

- `GET /api/market-summary` — totals, per-source counts, category & model medians, run log
- `GET /api/latest-listings` — up to 100 recent listings (with image URLs)
- `GET /api/health`
- `POST /run?key=<RUN_KEY>&pages=2` — trigger a crawl on demand

## Deploy (one-time)

```bash
cd worker
npm install
npx wrangler login

# 1. Create the D1 database, then paste its id into wrangler.toml
npx wrangler d1 create ceylonhub

# 2. Create the tables
npm run db:init            # applies schema.sql to the remote D1

# 3. (optional) protect the manual /run endpoint
npx wrangler secret put RUN_KEY

# 4. Ship it (cron trigger is in wrangler.toml)
npm run deploy
```

Kick off the first crawl without waiting for cron:

```bash
curl -X POST "https://ceylonhub-scraper.<your-subdomain>.workers.dev/run?key=YOUR_RUN_KEY"
curl "https://ceylonhub-scraper.<your-subdomain>.workers.dev/api/market-summary"
```

## Point the site at the live Worker

Build the frontend with the Worker URL and the "Live Feed" / "Price Guide"
pages read live D1 data instead of the static JSON:

```bash
# from the repo root
VITE_MARKET_API="https://ceylonhub-scraper.<your-subdomain>.workers.dev" npm run build
```

(No env var → the site keeps using the committed `public/data/*.json`, so
nothing breaks if the Worker isn't deployed.)

## Notes

- The parser is dependency-free (native `HTMLRewriter` + JSON-LD extraction),
  so the Worker stays tiny and fast. It mirrors the Node adapters in
  `../scraper/`.
- D1 free tier easily covers this (a few thousand rows, a handful of writes per
  run). Cron on the Workers free plan supports these schedules.
- Watch logs live with `npm run tail`.
