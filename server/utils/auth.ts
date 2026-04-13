import type { H3Event } from 'h3'
import { ROLES } from '../database/schema'
import type { Role } from '../database/schema'

interface SessionUser {
  id: number
  email: string
  name: string
  role: string
  identification: string
}

export async function requireAuth(event: H3Event, requiredRoles?: Role[]) {
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = (session.user as SessionUser).role as Role
    if (!requiredRoles.includes(userRole)) {
      throw createError({
        statusCode: 403,
        message: 'Insufficient permissions'
      })
    }
  }

  return session.user as SessionUser
}

export { ROLES, type Role }
