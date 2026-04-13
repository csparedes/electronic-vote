import { getDb, candidates } from '../../database'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid candidate ID'
    })
  }

  const db = getDb()

  const candidate = await db.query.candidates.findFirst({
    where: eq(candidates.id, id)
  })

  if (!candidate) {
    throw createError({
      statusCode: 404,
      message: 'Candidate not found'
    })
  }

  return candidate
})
