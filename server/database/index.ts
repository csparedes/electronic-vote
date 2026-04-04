import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users, elections, candidates, electionCandidates } from './schema'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

type DbType = PostgresJsDatabase<{
  users: typeof users
  elections: typeof elections
  candidates: typeof candidates
  electionCandidates: typeof electionCandidates
}>

let _db: DbType | null = null
let _sql: ReturnType<typeof postgres> | null = null

export function getDb(): DbType {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/app'
    _sql = postgres(databaseUrl)
    _db = drizzle(_sql, { schema: { users, elections, candidates, electionCandidates } })
  }
  return _db
}

export { users, elections, candidates, electionCandidates }
