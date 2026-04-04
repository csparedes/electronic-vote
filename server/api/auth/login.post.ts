import { getDb, users } from '../../database'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../../utils/password'
import { sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  const db = getDb()
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

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
  } catch (sessionError) {
    console.error('[LOGIN] Session error:', sessionError)
    throw createError({
      statusCode: 500,
      message: 'Failed to create session'
    })
  }

  return sendRedirect(event, '/dashboard', 302)
})
