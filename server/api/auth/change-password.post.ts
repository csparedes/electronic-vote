import { getDb, users } from '../../database'
import { eq } from 'drizzle-orm'
import { verifyPassword, hashPassword } from '../../utils/password'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const sessionUser = await requireAuth(event)

  const body = await readBody(event)
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      message: 'Current password and new password are required'
    })
  }

  if (newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      message: 'New password must be at least 8 characters'
    })
  }

  const db = getDb()
  const user = await db.query.users.findFirst({
    where: eq(users.id, sessionUser.id)
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  const isValidPassword = await verifyPassword(currentPassword, user.passwordHash)

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Current password is incorrect'
    })
  }

  const passwordHash = await hashPassword(newPassword)

  await db.update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, sessionUser.id))

  return { message: 'Password changed successfully' }
})
