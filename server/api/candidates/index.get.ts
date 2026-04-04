import { getDb } from '../../database'

export default defineEventHandler(async () => {
  const db = getDb()

  const allCandidates = await db.query.candidates.findMany({
    orderBy: (candidates, { asc }) => [asc(candidates.fullName)]
  })

  return allCandidates
})
