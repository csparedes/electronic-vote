interface RateLimitEntry {
  count: number
  firstAttempt: number
  lastAttempt: number
}

const attempts = new Map<string, RateLimitEntry>()

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 15 * 60 * 1000

function cleanup() {
  const now = Date.now()
  for (const [key, entry] of attempts.entries()) {
    if (now - entry.lastAttempt > WINDOW_MS) {
      attempts.delete(key)
    }
  }
}

export function checkRateLimit(identifier: string): { allowed: boolean, remaining: number, retryAfter?: number } {
  cleanup()

  const now = Date.now()
  const entry = attempts.get(identifier)

  if (!entry) {
    return { allowed: true, remaining: MAX_ATTEMPTS }
  }

  if (now - entry.firstAttempt > WINDOW_MS) {
    attempts.delete(identifier)
    return { allowed: true, remaining: MAX_ATTEMPTS }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((BLOCK_DURATION_MS - (now - entry.firstAttempt)) / 1000)
    return { allowed: false, remaining: 0, retryAfter }
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count }
}

export function recordFailedAttempt(identifier: string): void {
  cleanup()

  const now = Date.now()
  const entry = attempts.get(identifier)

  if (!entry) {
    attempts.set(identifier, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now
    })
  } else {
    entry.count++
    entry.lastAttempt = now
  }
}

export function clearAttempts(identifier: string): void {
  attempts.delete(identifier)
}
