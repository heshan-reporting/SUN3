import { USER_AGENT, DEFAULTS } from '../config.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const lastRequestAt = new Map() // per-origin politeness clock

export async function politeFetch(url, { delayMs = DEFAULTS.requestDelayMs, timeoutMs = DEFAULTS.timeoutMs, retries = DEFAULTS.retries } = {}) {
  const origin = new URL(url).origin
  const last = lastRequestAt.get(origin) || 0
  const wait = last + delayMs - Date.now()
  if (wait > 0) await sleep(wait)
  lastRequestAt.set(origin, Date.now())

  let lastErr
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xhtml+xml',
          'accept-language': 'en,si;q=0.8,ta;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (res.status === 429 || res.status === 503) {
        // Backing off hard on throttle signals is part of being a good citizen.
        lastErr = new Error(`HTTP ${res.status}`)
        await sleep(delayMs * (attempt + 2) * 2)
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    } catch (e) {
      lastErr = e
      if (attempt < retries) await sleep(delayMs * (attempt + 1))
    }
  }
  throw lastErr
}
