import { getDb } from '../../database'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const db = getDb()

  const allElections = await db.query.elections.findMany({
    orderBy: (elections, { desc }) => [desc(elections.createdAt)]
  })

  return allElections
})
