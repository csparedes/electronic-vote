import { getDb, elections, votes, electionCandidates } from '../../../database'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../../utils/auth'

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
  }) as Array<{ candidate: { id: number, fullName: string, listName: string, imageUrl: string | null } }>

  const voteCounts = await db.query.votes.findMany({
    where: eq(votes.electionId, id)
  })

  const voteCountByCandidate: Record<number, number> = {}
  for (const vote of voteCounts) {
    voteCountByCandidate[vote.candidateId] = (voteCountByCandidate[vote.candidateId] || 0) + 1
  }

  const totalVotes = voteCounts.length

  const results = electionCandidatesList.map(ec => ({
    id: ec.candidate.id,
    fullName: ec.candidate.fullName,
    listName: ec.candidate.listName,
    imageUrl: ec.candidate.imageUrl,
    voteCount: voteCountByCandidate[ec.candidate.id] || 0,
    percentage: totalVotes > 0 ? Math.round(((voteCountByCandidate[ec.candidate.id] || 0) / totalVotes) * 100) : 0
  }))

  results.sort((a, b) => b.voteCount - a.voteCount)

  return {
    election: {
      id: election.id,
      name: election.name,
      description: election.description,
      startDate: election.startDate,
      endDate: election.endDate,
      status: election.status
    },
    totalVotes,
    results
  }
})
