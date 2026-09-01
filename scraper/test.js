// Offline unit tests for the parsing pipeline. Run: npm run scrape:test
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import * as riyasewana from './adapters/riyasewana.js'
import * as generic from './adapters/generic.js'
import { parsePriceLKR } from './lib/normalize.js'
import { isAllowed, crawlDelayMs } from './lib/robots.js'

const here = path.dirname(url.fileURLToPath(import.meta.url))
const fixture = (f) => fs.readFileSync(path.join(here, 'fixtures', f), 'utf8')

test('parsePriceLKR handles Sri Lankan formats', () => {
  assert.equal(parsePriceLKR('Rs. 11,250,000'), 11_250_000)
  assert.equal(parsePriceLKR('Rs 6.85M'), 6_850_000)
  assert.equal(parsePriceLKR('115 lakhs'), 11_500_000)
  assert.equal(parsePriceLKR('1.2 crore'), 12_000_000)
  assert.equal(parsePriceLKR('Negotiable'), null)
  assert.equal(parsePriceLKR(''), null)
})

test('riyasewana adapter parses item cards', () => {
  const { listings, nextUrl } = riyasewana.parse(fixture('riyasewana-cars.html'), {
    baseUrl: 'https://riyasewana.com',
    source: 'riyasewana',
    category: 'vehicles',
    subcategory: 'car',
  })
  assert.equal(listings.length, 4)
  const aqua = listings.find((l) => /aqua/i.test(l.title))
  assert.ok(aqua)
  assert.equal(aqua.priceLkr, 11_450_000)
  assert.equal(aqua.location, 'Colombo')
  assert.match(aqua.url, /^https:\/\/riyasewana\.com\/buy\//)
  assert.match(nextUrl, /page=2/)
  const negotiable = listings.find((l) => /kdh/i.test(l.title))
  assert.equal(negotiable.priceLkr, null)
  // Regression: "Honda Vezel RS 2018" must not parse "RS 2018" as the price
  const vezel = listings.find((l) => /vezel/i.test(l.title))
  assert.equal(vezel.priceLkr, 13_750_000)
})

test('generic adapter extracts JSON-LD and heuristic cards', () => {
  const { listings, nextUrl } = generic.parse(fixture('generic-jsonld.html'), {
    baseUrl: 'https://www.example.lk',
    source: 'example',
    category: 'vehicles',
    subcategory: 'car',
  })
  const titles = listings.map((l) => l.title)
  assert.ok(titles.some((t) => /prius/i.test(t)), 'JSON-LD item found')
  assert.ok(titles.some((t) => /fit gp5/i.test(t)), 'heuristic card found')
  const prius = listings.find((l) => /prius/i.test(l.title))
  assert.equal(prius.priceLkr, 14_500_000)
  assert.match(prius.url, /^https:\/\/www\.example\.lk\//)
  assert.match(nextUrl, /page=2/)
})

test('robots rules are honoured', () => {
  const robots = {
    reachable: true,
    group: { agents: ['*'], disallow: ['/admin', '/search*sort='], allow: ['/search/cars'], crawlDelay: 10 },
  }
  assert.equal(isAllowed(robots, 'https://x.lk/search/cars'), true)
  assert.equal(isAllowed(robots, 'https://x.lk/admin/panel'), false)
  assert.equal(isAllowed(robots, 'https://x.lk/search/cars?sort=price'), false)
  assert.equal(crawlDelayMs(robots), 10000)
  assert.equal(isAllowed({ reachable: false, group: null }, 'https://x.lk/'), false, 'unreachable robots → do not crawl')
})
