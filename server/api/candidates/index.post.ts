import { getDb, candidates } from '../../database'
import { requireAuth, ROLES } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event, [ROLES.ADMIN, ROLES.DEV])

  const body = await readBody(event)
  const { fullName, listName, imageUrl } = body

  if (!fullName || !listName) {
    throw createError({
      statusCode: 400,
      message: 'Full name and list name are required'
    })
  }

  if (fullName.length > 200) {
    throw createError({
      statusCode: 400,
      message: 'Full name must be at most 200 characters'
    })
  }

  if (listName.length > 100) {
    throw createError({
      statusCode: 400,
      message: 'List name must be at most 100 characters'
    })
  }

  const db = getDb()

  const [newCandidate] = await db.insert(candidates).values({
    fullName,
    listName,
    imageUrl: imageUrl || null
  }).returning()

  return {
    message: 'Candidate created successfully',
    candidate: newCandidate
  }
})
