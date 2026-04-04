import { getDb, elections } from '../../database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, description, startDate, endDate, status } = body

  if (!name || !startDate || !endDate) {
    throw createError({
      statusCode: 400,
      message: 'Name, start date and end date are required'
    })
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

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

  const db = getDb()

  const [newElection] = await db.insert(elections).values({
    name,
    description: description || null,
    startDate: start,
    endDate: end,
    status: status || 'draft'
  }).returning()

  return {
    message: 'Election created successfully',
    election: newElection
  }
})
