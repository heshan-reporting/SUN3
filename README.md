# CeylonHub — Sri Lanka's Trust-First Marketplace (Prototype)

A professional-grade **React (Vite)** prototype of a five-vertical Sri Lankan marketplace — **vehicle sales,
vehicle rentals, property, home & living, and electronics** — built around one idea the incumbents
(patpat.lk, ikman.lk, riyasewana.com, autostream.lk) don't own: **verified trust**.

## What's in this repo

| Path | Contents |
|------|----------|
| `src/` | React SPA: home, 5 category pages with trust filters, listing detail with inspection reports & deal ratings, free listing wizard, multi-lender leasing calculator, SafePay escrow explainer, Fair Price Index (interactive chart), and the full strategy at `/strategy` |
| `docs/strategy.md` | Consolidated strategy: gap analysis, USPs, value propositions, phased revenue model, risks, architecture recommendation |
| `docs/research/sri-lanka-competitors.md` | Deep research on patpat.lk, autostream.lk, ikman.lk, riyasewana, LankaPropertyWeb, Facebook Marketplace — with cited gaps & pricing |
| `docs/research/international-platforms.md` | Feature & revenue-model research on Carvana, CarGurus, Auto Trader, Encar, Cars24/Spinny, Turo, Zillow, Rightmove, PropertyGuru, Back Market, Vinted, Mercari, OLX, Carousell, Jiji |
| `docs/research/market-context.md` | Sri Lanka 2026 macro: vehicle import boom, payments (LankaQR/CEFTS), trust environment, languages, competitor funding |
| `scraper/` | Automated market-data crawler: robots.txt-aware, rate-limited, per-site adapters (riyasewana + generic JSON-LD), SQLite DB with price history (`data/market.db`), JSON exports for the site (`public/data/`), offline fixtures & tests — see [`docs/scraper.md`](docs/scraper.md) |
| `.github/workflows/scrape.yml` | Scheduled workflow (every 6h on `main`) that runs the crawler and commits updated data — which auto-redeploys the site |
| `.github/workflows/static.yml` | GitHub Actions workflow that builds the app and deploys `dist/` to GitHub Pages on push to `main` |
| `legacy/ads-ai-brain.html` | The demo page that previously lived at the repo root (preserved) |

## Run locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # serve the production build

npm run scrape:test      # scraper unit tests (offline)
npm run scrape:fixtures  # full scrape pipeline against local fixtures
npm run scrape           # live crawl (respects robots.txt + rate limits)
```

## Static or dynamic? (short answer)

GitHub Pages serves **static files only** — which is fine for this React prototype (Vite builds it to static
assets; hash routing avoids the need for server rewrites). The **real platform must be dynamic**: listings,
search, chat, auth, escrow and payments need an API backend. The recommended path — keep this SPA, add a
hosted API — is detailed in [`docs/strategy.md`](docs/strategy.md) §8.

## Headline USPs (see `/strategy` in the app for the full case)

1. **SafePay escrow on every deal type** — including vehicle booking deposits, tenancy deposits and event bookings
2. **NIC-verified sellers** — free, mandatory, upstream
3. **Fair Price Index + deal ratings** — built from verified sale prices, not asking prices
4. **Certified inspections** (vehicles, incl. hybrid-battery health) + **certified refurbished electronics** with warranty
5. **Neutral multi-lender leasing comparison** — every lender competes for each buyer
6. **Rental infrastructure** — calendars, deposit escrow, insurance verification, digital handovers
7. **Trilingual, AI-native listing flow** — Sinhala / Tamil / English
8. **Diaspora mode** for remote-safe property buying

*All listings in the prototype are demo data; research figures are cited in `docs/research/`.*
