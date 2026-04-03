import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core'

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
