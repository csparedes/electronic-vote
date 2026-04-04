import { getDb, elections } from '../../database'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid election ID'
    })
  }

  const db = getDb()

  const existing = await db.query.elections.findFirst({
    where: eq(elections.id, id)
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Election not found'
    })
  }

  await db.delete(elections).where(eq(elections.id, id))

  return {
    message: 'Election deleted successfully'
  }
})
