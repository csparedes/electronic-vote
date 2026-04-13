import { getDb } from '../../database'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const db = getDb()

  const allCandidates = await db.query.candidates.findMany({
    orderBy: (candidates, { asc }) => [asc(candidates.fullName)]
  })

  return allCandidates
})
