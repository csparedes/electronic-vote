import { getDb, elections, electionCandidates, candidates } from '../../../database'
import { eq, and } from 'drizzle-orm'
import type { Candidate } from '../../../database/schema'
import { requireAuth, ROLES } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event, [ROLES.ADMIN, ROLES.DEV])

  const electionId = Number(getRouterParam(event, 'id'))

  if (isNaN(electionId)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid election ID'
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

  if (event.method === 'GET') {
    const associations = await db.query.electionCandidates.findMany({
      where: eq(electionCandidates.electionId, electionId),
      with: {
        candidate: true
      }
    })

    return {
      election,
      candidates: associations.map(a => a.candidate)
    }
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    const { candidateId } = body

    if (!candidateId) {
      throw createError({
        statusCode: 400,
        message: 'Candidate ID is required'
      })
    }

    const candidate = await db.query.candidates.findFirst({
      where: eq(candidates.id, candidateId)
    })

    if (!candidate) {
      throw createError({
        statusCode: 404,
        message: 'Candidate not found'
      })
    }

    const existingAssociation = await db.query.electionCandidates.findFirst({
      where: and(
        eq(electionCandidates.electionId, electionId),
        eq(electionCandidates.candidateId, candidateId)
      )
    })

    if (existingAssociation) {
      throw createError({
        statusCode: 409,
        message: 'Candidate is already associated with this election'
      })
    }

    const existingCandidatesInElection = await db.query.electionCandidates.findMany({
      where: eq(electionCandidates.electionId, electionId),
      with: {
        candidate: true
      }
    })

    const existingCandidates = existingCandidatesInElection as Array<{ candidate: Candidate }>
    const hasSameList = existingCandidates.some(
      ec => ec.candidate.listName === candidate.listName
    )

    if (hasSameList) {
      throw createError({
        statusCode: 409,
        message: `A candidate from list "${candidate.listName}" is already registered in this election`
      })
    }

    await db.insert(electionCandidates).values({
      electionId,
      candidateId
    })

    return {
      message: 'Candidate added to election successfully',
      candidate
    }
  }

  if (event.method === 'DELETE') {
    const body = await readBody(event)
    const { candidateId } = body

    if (!candidateId) {
      throw createError({
        statusCode: 400,
        message: 'Candidate ID is required'
      })
    }

    await db.delete(electionCandidates).where(
      and(
        eq(electionCandidates.electionId, electionId),
        eq(electionCandidates.candidateId, candidateId)
      )
    )

    return {
      message: 'Candidate removed from election successfully'
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
