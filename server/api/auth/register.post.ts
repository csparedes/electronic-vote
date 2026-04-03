import { getDb, users } from '../../database'
import { eq } from 'drizzle-orm'
import { validateEmail, validateIdentification, validatePassword, validateName } from '../../utils/validation'
import { hashPassword } from '../../utils/password'
import { ROLES } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { identification, email, password, name } = body

  if (!identification || !email || !password || !name) {
    throw createError({
      statusCode: 400,
      message: 'All fields are required'
    })
  }

  if (!validateEmail(email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  if (!validateIdentification(identification)) {
    throw createError({
      statusCode: 400,
      message: 'Identification must be between 5 and 50 characters'
    })
  }

  if (!validatePassword(password)) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters'
    })
  }

  if (!validateName(name)) {
    throw createError({
      statusCode: 400,
      message: 'Name must be between 2 and 100 characters'
    })
  }

  const db = getDb()

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: 'Email already registered'
    })
  }

  const existingIdentification = await db.query.users.findFirst({
    where: eq(users.identification, identification)
  })

  if (existingIdentification) {
    throw createError({
      statusCode: 409,
      message: 'Identification already registered'
    })
  }

  const passwordHash = await hashPassword(password)

  const [newUser] = await db.insert(users).values({
    identification,
    email,
    passwordHash,
    name,
    role: ROLES.VOTER
  }).returning({
    id: users.id,
    identification: users.identification,
    email: users.email,
    name: users.name,
    role: users.role
  })

  return {
    message: 'User registered successfully',
    user: newUser
  }
})
