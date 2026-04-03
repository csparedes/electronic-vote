import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from './schema'

const connectionString = useRuntimeConfig().databaseUrl

const client = postgres(connectionString)
export const db = drizzle(client, { schema: { users } })

export { users }
