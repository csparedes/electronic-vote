import { getDb, votes, elections, electionCandidates, ELECTION_STATUS } from '../../database'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const body = await readBody(event)
  const { electionId, candidateId } = body

  if (!electionId || !candidateId) {
    throw createError({
      statusCode: 400,
      message: 'Election ID and Candidate ID are required'
    })
  }

  const db = getDb()

  const election = await db.query.elections.findFirst({
    where: eq(elections.id, electionId)
  })

  if (!election) {
    throw createError({
      statusCode: 404,
      message: 'Election not found'
    })
  }

  if (election.status !== ELECTION_STATUS.ACTIVE) {
    throw createError({
      statusCode: 400,
      message: 'This election is not active'
    })
  }

  const now = new Date()

  if (election.startDate > now) {
    throw createError({
      statusCode: 400,
      message: 'This election has not started yet'
    })
  }

  if (election.endDate < now) {
    throw createError({
      statusCode: 400,
      message: 'This election has already ended'
    })
  }

  const candidateAssociation = await db.query.electionCandidates.findFirst({
    where: and(
      eq(electionCandidates.electionId, electionId),
      eq(electionCandidates.candidateId, candidateId)
    )
  })

  if (!candidateAssociation) {
    throw createError({
      statusCode: 400,
      message: 'This candidate is not part of this election'
    })
  }

  const existingVote = await db.query.votes.findFirst({
    where: and(
      eq(votes.userId, user.id),
      eq(votes.electionId, electionId)
    )
  })

  if (existingVote) {
    throw createError({
      statusCode: 409,
      message: 'You have already voted in this election'
    })
  }

  const newVote = await db.insert(votes).values({
    userId: user.id,
    electionId,
    candidateId
  }).returning()

  return {
    message: 'Vote cast successfully',
    vote: newVote[0]
  }
})
