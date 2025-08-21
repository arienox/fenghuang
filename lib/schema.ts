import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, numeric } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: varchar('id', { length: 64 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  vision: text('vision'),
  status: varchar('status', { length: 24 }).default('active'),
  priority: integer('priority').default(2),
  progress: integer('progress').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  projectId: integer('project_id'),
  title: varchar('title', { length: 300 }).notNull(),
  notes: text('notes'),
  kind: varchar('kind', { length: 24 }).default('ops'), /* revenue | content | ops */
  expectedValue: numeric('expected_value', { precision: 12, scale: 2 }).default('0'), /* INR */
  minutes: integer('minutes').default(30),
  importance: integer('importance').default(2),
  urgency: integer('urgency').default(2),
  lane: varchar('lane', { length: 16 }).default('next'),
  today: boolean('today').default(false),
  done: boolean('done').default(false),
  dueAt: timestamp('due_at'),
  lastWorkedAt: timestamp('last_worked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  source: varchar('source', { length: 120 }).notNull(),
  kind: varchar('kind', { length: 16 }).notNull(), /* income|expense */
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  category: varchar('category', { length: 48 }),
  meta: jsonb('meta'),
  occurredAt: timestamp('occurred_at').defaultNow().notNull(),
})

export const habits = pgTable('habits', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  name: varchar('name', { length: 120 }).notNull(),
  unit: varchar('unit', { length: 32 }).default('count'),
  target: integer('target').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const habitLogs = pgTable('habit_logs', {
  id: serial('id').primaryKey(),
  habitId: integer('habit_id').notNull(),
  value: integer('value').default(0),
  loggedAt: timestamp('logged_at').defaultNow().notNull(),
})

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const taskDeps = pgTable('task_deps', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').notNull(),
  dependsOn: integer('depends_on').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const okrs = pgTable('okrs', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }),
  title: varchar('title', { length: 200 }),
  targetDate: timestamp('target_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const keyResults = pgTable('key_results', {
  id: serial('id').primaryKey(),
  okrId: integer('okr_id'),
  name: varchar('name', { length: 200 }),
  targetValue: numeric('target_value', { precision: 12, scale: 2 }),
  currentValue: numeric('current_value', { precision: 12, scale: 2 }).default('0'),
  unit: varchar('unit', { length: 24 }).default('count'),
})

export const webhookEvents = pgTable('webhook_events', {
  id: serial('id').primaryKey(),
  provider: varchar('provider', { length: 32 }),
  eventId: varchar('event_id', { length: 128 }).unique(),
  payload: jsonb('payload'),
  receivedAt: timestamp('received_at').defaultNow().notNull(),
})
