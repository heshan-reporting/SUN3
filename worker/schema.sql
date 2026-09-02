-- D1 schema for the CeylonHub scraper worker.
-- Apply with:  npx wrangler d1 execute ceylonhub --file=./schema.sql --remote
CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY,
  source TEXT NOT NULL,
  source_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  location TEXT,
  price_lkr INTEGER,
  price_text TEXT,
  image_url TEXT,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL,
  UNIQUE(source, source_id)
);
CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY,
  listing_id INTEGER NOT NULL,
  price_lkr INTEGER,
  observed_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY,
  source TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  found INTEGER DEFAULT 0,
  added INTEGER DEFAULT 0,
  updated INTEGER DEFAULT 0,
  status TEXT,
  note TEXT
);
CREATE INDEX IF NOT EXISTS idx_listings_cat ON listings(category, last_seen);
CREATE INDEX IF NOT EXISTS idx_history_listing ON price_history(listing_id, observed_at);
