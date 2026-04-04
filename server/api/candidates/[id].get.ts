import { getDb, candidates } from '../../database'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
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
