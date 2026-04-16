import { pgTable, varchar, timestamp, serial, text, primaryKey, integer, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  identification: varchar('identification', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('voter'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const ROLES = {
  VOTER: 'voter',
  ADVISOR: 'advisor',
  ADMIN: 'admin',
  DEV: 'dev'
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const elections = pgTable('elections', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type Election = typeof elections.$inferSelect
export type NewElection = typeof elections.$inferInsert

export const ELECTION_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  FINISHED: 'finished'
} as const

export type ElectionStatus = (typeof ELECTION_STATUS)[keyof typeof ELECTION_STATUS]

export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 200 }).notNull(),
  listName: varchar('list_name', { length: 100 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type Candidate = typeof candidates.$inferSelect
export type NewCandidate = typeof candidates.$inferInsert

export const electionCandidates = pgTable('election_candidates', {
  electionId: integer('election_id').notNull().references(() => elections.id, { onDelete: 'cascade' }),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id, { onDelete: 'cascade' })
}, table => ({
  pk: primaryKey({ columns: [table.electionId, table.candidateId] })
}))

export type ElectionCandidate = typeof electionCandidates.$inferSelect

export const electionsRelations = relations(elections, ({ many }) => ({
  electionCandidates: many(electionCandidates)
}))

export const candidatesRelations = relations(candidates, ({ many }) => ({
  electionCandidates: many(electionCandidates)
}))

export const electionCandidatesRelations = relations(electionCandidates, ({ one }) => ({
  election: one(elections, {
    fields: [electionCandidates.electionId],
    references: [elections.id]
  }),
  candidate: one(candidates, {
    fields: [electionCandidates.candidateId],
    references: [candidates.id]
  })
}))

export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  electionId: integer('election_id').notNull().references(() => elections.id, { onDelete: 'cascade' }),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, table => ({
  userElectionUnique: uniqueIndex('user_election_unique').on(table.userId, table.electionId)
}))

export type Vote = typeof votes.$inferSelect
export type NewVote = typeof votes.$inferInsert

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id]
  }),
  election: one(elections, {
    fields: [votes.electionId],
    references: [elections.id]
  }),
  candidate: one(candidates, {
    fields: [votes.candidateId],
    references: [candidates.id]
  })
}))
