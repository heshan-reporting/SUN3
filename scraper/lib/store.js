import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

export function openDb(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.exec(`
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
      attrs_json TEXT,
      first_seen TEXT NOT NULL,
      last_seen TEXT NOT NULL,
      UNIQUE(source, source_id)
    );
    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY,
      listing_id INTEGER NOT NULL REFERENCES listings(id),
      price_lkr INTEGER,
      observed_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY,
      source TEXT NOT NULL,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      pages INTEGER DEFAULT 0,
      found INTEGER DEFAULT 0,
      added INTEGER DEFAULT 0,
      updated INTEGER DEFAULT 0,
      status TEXT,
      note TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_listings_cat ON listings(category, last_seen);
    CREATE INDEX IF NOT EXISTS idx_history_listing ON price_history(listing_id, observed_at);
  `)
  return db
}

export function upsertListing(db, l, now) {
  const existing = db
    .prepare('SELECT id, price_lkr FROM listings WHERE source = ? AND source_id = ?')
    .get(l.source, l.sourceId)
  if (!existing) {
    const info = db.prepare(`
      INSERT INTO listings (source, source_id, url, title, category, subcategory, location,
        price_lkr, price_text, image_url, attrs_json, first_seen, last_seen)
      VALUES (@source, @sourceId, @url, @title, @category, @subcategory, @location,
        @priceLkr, @priceText, @imageUrl, @attrsJson, @now, @now)
    `).run({ ...l, attrsJson: JSON.stringify(l.attrs), now })
    if (l.priceLkr != null) {
      db.prepare('INSERT INTO price_history (listing_id, price_lkr, observed_at) VALUES (?, ?, ?)')
        .run(info.lastInsertRowid, l.priceLkr, now)
    }
    return 'added'
  }
  db.prepare(`
    UPDATE listings SET url=@url, title=@title, location=@location, price_lkr=@priceLkr,
      price_text=@priceText, image_url=@imageUrl, last_seen=@now WHERE id=@id
  `).run({ ...l, id: existing.id, now })
  if (l.priceLkr != null && l.priceLkr !== existing.price_lkr) {
    db.prepare('INSERT INTO price_history (listing_id, price_lkr, observed_at) VALUES (?, ?, ?)')
      .run(existing.id, l.priceLkr, now)
    return 'price-changed'
  }
  return 'updated'
}

export function startRun(db, source, now) {
  return db.prepare('INSERT INTO runs (source, started_at, status) VALUES (?, ?, ?)')
    .run(source, now, 'running').lastInsertRowid
}

export function finishRun(db, id, { pages, found, added, updated, status, note }) {
  db.prepare(`
    UPDATE runs SET finished_at = ?, pages = ?, found = ?, added = ?, updated = ?, status = ?, note = ?
    WHERE id = ?
  `).run(new Date().toISOString(), pages, found, added, updated, status, note || null, id)
}
