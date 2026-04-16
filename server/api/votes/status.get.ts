import { getDb, votes } from '../../database'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const electionId = getQuery(event).electionId
    ? Number(getQuery(event).electionId)
    : undefined

  const db = getDb()

  if (electionId) {
    const vote = await db.query.votes.findFirst({
      where: and(
        eq(votes.userId, user.id),
        eq(votes.electionId, electionId)
      )
    })

    return { [electionId]: !!vote }
  }

  const userVotes = await db.query.votes.findMany({
    where: eq(votes.userId, user.id)
  })

  const status: Record<number, boolean> = {}
  for (const vote of userVotes) {
    status[vote.electionId] = true
  }

  return status
})
