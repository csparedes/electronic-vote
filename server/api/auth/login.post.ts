import { getDb, users } from '../../database'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../../utils/password'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '../../utils/rateLimit'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const rateLimitKey = `login:${email.toLowerCase()}:${clientIp}`

  const rateLimit = checkRateLimit(rateLimitKey)

  if (!rateLimit.allowed) {
    throw createError({
      statusCode: 429,
      message: `Too many login attempts. Please try again in ${rateLimit.retryAfter} seconds.`,
      data: { retryAfter: rateLimit.retryAfter }
    })
  }

  const db = getDb()
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (!user) {
    recordFailedAttempt(rateLimitKey)
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    recordFailedAttempt(rateLimitKey)
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  clearAttempts(rateLimitKey)

  try {
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        identification: user.identification
      }
    })
  } catch {
    throw createError({
      statusCode: 500,
      message: 'Failed to create session'
    })
  }

  return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
})
