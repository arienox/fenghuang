import { db } from '@/lib/db'
import { habits, habitLogs } from '@/lib/schema'
import { eq, and, sql, desc } from 'drizzle-orm'

export async function ensureProteinHabit(userId: string){
	const existing = await db.select().from(habits).where(and(eq(habits.userId, userId), eq(habits.name, 'protein')))
	if(existing.length) return existing[0]
	const inserted = await db.insert(habits).values({ userId, name: 'protein', unit: 'grams', target: 180 }).returning()
	return inserted[0]
}

export async function logProtein(userId: string, grams: number, dateISO?: string){
	const habit = await ensureProteinHabit(userId)
	await db.insert(habitLogs).values({ habitId: habit.id, value: grams, loggedAt: dateISO ? (sql`${dateISO}::timestamp` as any) : undefined })
}

export async function weekProteinSummary(userId: string, startOfWeekISO: string){
	const end = sql`${startOfWeekISO}::date + INTERVAL '7 days'`
	const rows = await db.execute(sql`
		SELECT date_trunc('day', logged_at) AS day, SUM(value) AS grams
		FROM habit_logs
		WHERE habit_id = (
			SELECT id FROM habits WHERE user_id=${userId} AND name='protein' LIMIT 1
		) AND logged_at >= ${sql`${startOfWeekISO}::date`} AND logged_at < ${end}
		GROUP BY 1 ORDER BY 1
	`)
	return ((rows as any).rows||[]).map((r:any)=> ({ date: new Date(r.day).toISOString().slice(0,10), grams: Number(r.grams) }))
} 