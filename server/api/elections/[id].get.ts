import { getDb, elections, electionCandidates } from '../../database'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid election ID'
    })
  }

  const db = getDb()

  const election = await db.query.elections.findFirst({
    where: eq(elections.id, id)
  })

  if (!election) {
    throw createError({
      statusCode: 404,
      message: 'Election not found'
    })
  }

  const electionCandidatesList = await db.query.electionCandidates.findMany({
    where: eq(electionCandidates.electionId, id),
    with: {
      candidate: true
    }
  })

  return {
    ...election,
    candidates: electionCandidatesList.map(ec => ec.candidate)
  }
})
