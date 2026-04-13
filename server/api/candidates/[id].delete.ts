import { getDb, candidates } from '../../database'
import { eq } from 'drizzle-orm'
import { requireAuth, ROLES } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event, [ROLES.ADMIN, ROLES.DEV])

  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid candidate ID'
    })
  }

  const db = getDb()

  const existing = await db.query.candidates.findFirst({
    where: eq(candidates.id, id)
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Candidate not found'
    })
  }

  await db.delete(candidates).where(eq(candidates.id, id))

  return {
    message: 'Candidate deleted successfully'
  }
})
