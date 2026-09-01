// Scraper configuration. Each source can be toggled independently.
//
// Politeness defaults are deliberately conservative: a few index pages per
// run, one request every few seconds, an identifying User-Agent, and
// robots.txt is checked before every crawl. Increase limits only with care
// and with the source's terms of service in mind (see docs/scraper.md).

export const USER_AGENT =
  'CeylonHubBot/0.1 (+https://github.com/heshan-reporting/SUN3; market-research crawler)'

export const DEFAULTS = {
  maxPagesPerRun: 3,
  requestDelayMs: 3000,
  timeoutMs: 20000,
  retries: 2,
}

export const SOURCES = [
  {
    name: 'riyasewana',
    enabled: true,
    adapter: 'riyasewana',
    baseUrl: 'https://riyasewana.com',
    startUrls: [
      { url: 'https://riyasewana.com/search/cars', category: 'vehicles', subcategory: 'car' },
      { url: 'https://riyasewana.com/search/motorcycles', category: 'vehicles', subcategory: 'motorcycle' },
      { url: 'https://riyasewana.com/search/vans', category: 'vehicles', subcategory: 'van' },
    ],
    fixture: 'riyasewana-cars.html',
  },
  {
    name: 'patpat',
    enabled: true,
    adapter: 'generic',
    baseUrl: 'https://patpat.lk',
    startUrls: [
      { url: 'https://patpat.lk/en/vehicle', category: 'vehicles', subcategory: null },
      { url: 'https://patpat.lk/en/property', category: 'property', subcategory: null },
    ],
    fixture: 'generic-jsonld.html',
  },
  {
    name: 'autostream',
    enabled: true,
    adapter: 'generic',
    baseUrl: 'https://www.autostream.lk',
    startUrls: [
      { url: 'https://www.autostream.lk/vehicles/', category: 'vehicles', subcategory: 'car' },
    ],
    fixture: 'generic-jsonld.html',
  },
  {
    name: 'lankapropertyweb',
    enabled: false, // enable after reviewing their terms; adapter='generic' works for JSON-LD pages
    adapter: 'generic',
    baseUrl: 'https://www.lankapropertyweb.com',
    startUrls: [
      { url: 'https://www.lankapropertyweb.com/sale/colombo', category: 'property', subcategory: null },
    ],
    fixture: 'generic-jsonld.html',
  },
]

// Model buckets tracked in the exported market summary (matched against
// listing titles, case-insensitively).
export const TRACKED_MODELS = [
  { key: 'toyota-aqua', label: 'Toyota Aqua', pattern: /toyota\s+aqua|(?:^|\s)aqua(?:\s|$)/i },
  { key: 'suzuki-wagon-r', label: 'Suzuki Wagon R', pattern: /wagon\s*r/i },
  { key: 'honda-vezel', label: 'Honda Vezel', pattern: /vezel/i },
  { key: 'toyota-prius', label: 'Toyota Prius', pattern: /prius/i },
  { key: 'toyota-kdh', label: 'Toyota KDH', pattern: /kdh/i },
  { key: 'nissan-leaf', label: 'Nissan Leaf', pattern: /leaf/i },
  { key: 'honda-fit', label: 'Honda Fit / GP5', pattern: /honda\s+fit|gp\s*5/i },
]
