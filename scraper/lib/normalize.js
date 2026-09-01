// Normalization helpers shared by all adapters.

// Parse Sri Lankan price strings into integer LKR.
// Handles: "Rs. 11,250,000", "Rs 6.85M", "115 lakhs", "1.2 crore", "Rs.13,500,000 (negotiable)"
export function parsePriceLKR(text) {
  if (!text) return null
  const t = String(text).toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ')
  let m
  if ((m = t.match(/([\d.]+)\s*(?:crore|kot)/))) return Math.round(parseFloat(m[1]) * 10_000_000)
  if ((m = t.match(/([\d.]+)\s*(?:lakh|lak|laks|lakhs)/))) return Math.round(parseFloat(m[1]) * 100_000)
  if ((m = t.match(/([\d.]+)\s*m(?:illion)?\b/))) return Math.round(parseFloat(m[1]) * 1_000_000)
  const digits = t.replace(/[^\d]/g, '')
  if (digits.length >= 4 && digits.length <= 12) return parseInt(digits, 10)
  return null
}

// A normalized listing record. `sourceId` should be stable across runs so we
// can detect price changes; default to the URL when the site has no id.
export function makeListing({ source, url, title, priceText, category, subcategory, location, imageUrl, attrs }) {
  if (!url || !title) return null
  const cleanTitle = title.replace(/\s+/g, ' ').trim().slice(0, 300)
  if (!cleanTitle) return null
  return {
    source,
    sourceId: url,
    url,
    title: cleanTitle,
    category: category || 'other',
    subcategory: subcategory || null,
    location: location ? location.replace(/\s+/g, ' ').trim().slice(0, 100) : null,
    priceLkr: parsePriceLKR(priceText),
    priceText: priceText ? priceText.replace(/\s+/g, ' ').trim().slice(0, 100) : null,
    imageUrl: imageUrl || null,
    attrs: attrs || {},
  }
}

export function absoluteUrl(href, base) {
  try {
    return new URL(href, base).toString()
  } catch {
    return null
  }
}

export function median(nums) {
  if (!nums.length) return null
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}
