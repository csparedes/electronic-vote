import { getDb } from '../../database'

export default defineEventHandler(async () => {
  const db = getDb()

  const allElections = await db.query.elections.findMany({
    orderBy: (elections, { desc }) => [desc(elections.createdAt)]
  })

  return allElections
})
