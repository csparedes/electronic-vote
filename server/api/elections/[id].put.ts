import { getDb, elections } from '../../database'
import { eq } from 'drizzle-orm'
import { ELECTION_STATUS } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid election ID'
    })
  }

  const body = await readBody(event)
  const { name, description, startDate, endDate, status } = body

  const db = getDb()

  const existing = await db.query.elections.findFirst({
    where: eq(elections.id, id)
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Election not found'
    })
  }

  if (name || startDate || endDate) {
    const start = startDate ? new Date(startDate) : existing.startDate
    const end = endDate ? new Date(endDate) : existing.endDate

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw createError({
        statusCode: 400,
        message: 'Invalid date format'
      })
    }

    if (end <= start) {
      throw createError({
        statusCode: 400,
        message: 'End date must be after start date'
      })
    }
  }

  if (status && !Object.values(ELECTION_STATUS).includes(status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid status. Must be draft, active, or finished'
    })
  }

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (description !== undefined) updateData.description = description
  if (startDate !== undefined) updateData.startDate = new Date(startDate)
  if (endDate !== undefined) updateData.endDate = new Date(endDate)
  if (status !== undefined) updateData.status = status

  const [updated] = await db.update(elections)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(elections.id, id))
    .returning()

  return {
    message: 'Election updated successfully',
    election: updated
  }
})
