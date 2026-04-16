import { getDb, elections, electionCandidates } from '../../database'
import { eq, and, lte, gte } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const db = getDb()

  const now = new Date()

  const activeElections = await db.query.elections.findMany({
    where: and(
      eq(elections.status, 'active'),
      lte(elections.startDate, now),
      gte(elections.endDate, now)
    ),
    orderBy: (elections, { asc }) => [asc(elections.endDate)]
  })

  const result = []

  for (const election of activeElections) {
    const electionCandidatesList = await db.query.electionCandidates.findMany({
      where: eq(electionCandidates.electionId, election.id),
      with: {
        candidate: true
      }
    })

    result.push({
      ...election,
      candidates: electionCandidatesList.map(ec => ec.candidate)
    })
  }

  return result
})
