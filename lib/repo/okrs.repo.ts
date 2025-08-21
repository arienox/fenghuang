import { db } from '@/lib/db'
import { okrs, keyResults } from '@/lib/schema'
import { eq, and, sql } from 'drizzle-orm'
import { z } from 'zod'

export const OkrCreate = z.object({ userId: z.string(), title: z.string().min(1), targetDate: z.string().optional() })
export type OkrCreate = z.infer<typeof OkrCreate>

export async function createOKR(data: OkrCreate){
	const input = OkrCreate.parse(data)
	const res = await db.insert(okrs).values({ userId: input.userId, title: input.title, targetDate: input.targetDate ? (sql`${input.targetDate}::timestamp` as any) : undefined }).returning({ id: okrs.id })
	return res[0]
}

export async function listOKRs(userId: string){
	return db.select().from(okrs).where(eq(okrs.userId, userId))
}

export const KRCreate = z.object({ okrId: z.number().int(), name: z.string().min(1), targetValue: z.number().nonnegative(), unit: z.string().default('count') })
export type KRCreate = z.infer<typeof KRCreate>

export async function addKeyResult(data: KRCreate){
	const input = KRCreate.parse(data)
	const res = await db.insert(keyResults).values({ okrId: input.okrId, name: input.name, targetValue: String(input.targetValue), unit: input.unit }).returning({ id: keyResults.id })
	return res[0]
}

export async function updateKeyResultValue(krId: number, value: number){
	await db.update(keyResults).set({ currentValue: String(value) }).where(eq(keyResults.id, krId))
}

export async function progress(okrId: number){
	const rows = await db.select({ target: keyResults.targetValue, current: keyResults.currentValue }).from(keyResults).where(eq(keyResults.okrId, okrId))
	if(rows.length===0) return { percent: 0 }
	let totalTarget = 0, totalCurrent = 0
	for(const r of rows){ totalTarget += Number(r.target||0); totalCurrent += Number(r.current||0) }
	return { percent: totalTarget ? Math.min(100, Math.round((totalCurrent/totalTarget)*100)) : 0 }
} 