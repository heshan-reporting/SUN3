// Minimal robots.txt support: fetch once per host, honour Disallow rules for
// our UA (falling back to '*'), and honour Crawl-delay when present.

const cache = new Map()

function parseRobots(text) {
  const groups = [] // { agents: [], disallow: [], allow: [], crawlDelay }
  let current = null
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim()
    if (!line) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const field = line.slice(0, idx).trim().toLowerCase()
    const value = line.slice(idx + 1).trim()
    if (field === 'user-agent') {
      if (!current || current.hasRules) {
        current = { agents: [], disallow: [], allow: [], crawlDelay: null, hasRules: false }
        groups.push(current)
      }
      current.agents.push(value.toLowerCase())
    } else if (current) {
      current.hasRules = true
      if (field === 'disallow') current.disallow.push(value)
      else if (field === 'allow') current.allow.push(value)
      else if (field === 'crawl-delay') current.crawlDelay = Number(value) || null
    }
  }
  return groups
}

function groupFor(groups, ua) {
  const uaLower = ua.toLowerCase()
  return (
    groups.find((g) => g.agents.some((a) => a !== '*' && uaLower.includes(a))) ||
    groups.find((g) => g.agents.includes('*')) ||
    null
  )
}

function ruleMatches(rule, path) {
  if (rule === '') return false
  // Support trailing '$' and '*' wildcards (Google-style)
  const pattern = rule
    .split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*')
  const re = new RegExp('^' + (pattern.endsWith('\\$') ? pattern.slice(0, -2) + '$' : pattern))
  return re.test(path)
}

export async function getRobots(baseUrl, userAgent, fetchImpl = fetch) {
  const origin = new URL(baseUrl).origin
  if (cache.has(origin)) return cache.get(origin)
  let robots
  try {
    const res = await fetchImpl(origin + '/robots.txt', {
      headers: { 'user-agent': userAgent },
      signal: AbortSignal.timeout(15000),
    })
    if (res.status >= 400) {
      robots = { reachable: true, group: null } // no robots file → allowed
    } else {
      const groups = parseRobots(await res.text())
      robots = { reachable: true, group: groupFor(groups, userAgent) }
    }
  } catch {
    // Network failure: be conservative and treat the host as off-limits this run.
    robots = { reachable: false, group: null }
  }
  cache.set(origin, robots)
  return robots
}

export function isAllowed(robots, url) {
  if (!robots.reachable) return false
  if (!robots.group) return true
  const path = new URL(url).pathname + new URL(url).search
  let allowed = true
  let longest = -1
  for (const rule of robots.group.disallow) {
    if (ruleMatches(rule, path) && rule.length > longest) { allowed = false; longest = rule.length }
  }
  for (const rule of robots.group.allow) {
    if (ruleMatches(rule, path) && rule.length > longest) { allowed = true; longest = rule.length }
  }
  return allowed
}

export function crawlDelayMs(robots) {
  return robots.group?.crawlDelay ? robots.group.crawlDelay * 1000 : null
}
