import { getDb, candidates } from '../../database'
import { eq } from 'drizzle-orm'
import { requireAuth, ROLES } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event, [ROLES.ADMIN, ROLES.DEV])

  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid candidate ID'
    })
  }

  const body = await readBody(event)
  const { fullName, listName, imageUrl } = body

  const db = getDb()

  const existing = await db.query.candidates.findFirst({
    where: eq(candidates.id, id)
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Candidate not found'
    })
  }

  if (fullName && fullName.length > 200) {
    throw createError({
      statusCode: 400,
      message: 'Full name must be at most 200 characters'
    })
  }

  if (listName && listName.length > 100) {
    throw createError({
      statusCode: 400,
      message: 'List name must be at most 100 characters'
    })
  }

  const updateData: Record<string, unknown> = {}
  if (fullName !== undefined) updateData.fullName = fullName
  if (listName !== undefined) updateData.listName = listName
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null

  const [updated] = await db.update(candidates)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(candidates.id, id))
    .returning()

  return {
    message: 'Candidate updated successfully',
    candidate: updated
  }
})
