import { db } from '@/lib/db'
import { tasks } from '@/lib/schema'
import { and, eq, sql, inArray, between, desc } from 'drizzle-orm'
import { z } from 'zod'

export const TaskCreate = z.object({
	userId: z.string(),
	title: z.string().min(1),
	notes: z.string().optional(),
	kind: z.enum(['revenue','content','ops']).default('ops'),
	expectedValue: z.number().nonnegative().default(0),
	minutes: z.number().int().positive().default(30),
	importance: z.number().int().min(0).max(5).default(2),
	urgency: z.number().int().min(0).max(5).default(2),
	lane: z.enum(['now','next','later']).default('next')
})
export type TaskCreate = z.infer<typeof TaskCreate>

export const Task = z.object({
	id: z.number(),
	userId: z.string(),
	title: z.string(),
	done: z.boolean(),
	today: z.boolean(),
	lane: z.string()
})
export type Task = z.infer<typeof Task>

export async function listToday(dateISO?: string){
	const dateExpr = sql`${sql.raw('to_char(coalesce(due_at, now()), ')}${sql.raw("'YYYY-MM-DD'")}${sql.raw(')')}`
	const today = dateISO || new Date().toISOString().slice(0,10)
	const rows = await db.select({ id: tasks.id, title: tasks.title, done: tasks.done, today: tasks.today, lane: tasks.lane, userId: tasks.userId })
		.from(tasks)
		.where(and(eq(tasks.today, true), sql`${dateExpr} = ${today}`))
		.orderBy(tasks.id)
	return rows.map(r=> Task.parse(r))
}

export async function listBacklog(){
	const rows = await db.select({ id: tasks.id, title: tasks.title, done: tasks.done, today: tasks.today, lane: tasks.lane, userId: tasks.userId })
		.from(tasks)
		.where(eq(tasks.today, false))
		.orderBy(tasks.id)
	return rows.map(r=> Task.parse(r))
}

export async function toggleDone(id: number){
	const res = await db.execute(sql`UPDATE tasks SET done = NOT done WHERE id=${id}`)
	if(('rowCount' in res ? (res as any).rowCount : 0) === 0) throw new Error('Task not found')
}

export async function moveLane(id: number, lane: 'now'|'next'|'later'){
	await db.update(tasks).set({ lane }).where(eq(tasks.id, id))
}

export async function createTask(data: TaskCreate){
	const input = TaskCreate.parse(data)
	const inserted = await db.insert(tasks).values({
		userId: input.userId,
		title: input.title,
		notes: input.notes,
		kind: input.kind,
		expectedValue: String(input.expectedValue),
		minutes: input.minutes,
		importance: input.importance,
		urgency: input.urgency,
		lane: input.lane,
	})
	.returning({ id: tasks.id })
	return inserted[0]
}

export const MoneyFirstPlan = z.object({ limit: z.number().int().positive().max(20).default(5), date: z.string().optional() })
export type MoneyFirstPlan = z.infer<typeof MoneyFirstPlan>

function scoreFragment(){
	return sql`(
		CASE WHEN ${tasks.kind}='revenue' THEN 1000 WHEN ${tasks.kind}='content' THEN 200 ELSE 0 END
		+ (COALESCE(${tasks.importance},0)*2 + COALESCE(${tasks.urgency},0))
		+ (COALESCE(${tasks.expectedValue},0) / GREATEST(15, COALESCE(${tasks.minutes},60)))*100
	)`
}

export async function planMoneyFirst(params?: Partial<MoneyFirstPlan>){
	const { limit, date } = MoneyFirstPlan.parse({ limit: 5, ...params })
	const today = date || new Date().toISOString().slice(0,10)
	const candidates = await db.select({ id: tasks.id })
		.from(tasks)
		.where(and(eq(tasks.done,false), sql`(${tasks.today} = false OR ${sql.raw('coalesce(due_at::date, null) <> ')}${today}::date)`))
		.orderBy(desc(scoreFragment()), tasks.id)
		.limit(limit)
	const ids = candidates.map(c=>c.id).slice(0, limit)
	if(ids.length){
		await setToday(ids, today)
	}
	return { date: today, picked: ids }
}

export async function setToday(ids: number[], dateISO: string){
	if(ids.length===0) return
	await db.execute(sql`UPDATE tasks SET today=true, due_at=${sql`${dateISO}::date`} WHERE id = ANY(${sql`{${sql.join(ids, sql`,`)}}`}::int[])`)
}

export async function listDoneRange(fromISO: string, toISO: string){
	const rows = await db.select({ id: tasks.id, title: tasks.title, done: tasks.done, today: tasks.today, lane: tasks.lane, userId: tasks.userId })
		.from(tasks)
		.where(and(eq(tasks.done,true), between(tasks.dueAt, sql`${fromISO}::date`, sql`${toISO}::date`)))
		.orderBy(tasks.id)
	return rows.map(r=> Task.parse(r))
} 