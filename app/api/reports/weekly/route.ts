import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tasks, habitLogs } from '@/lib/schema'
import { and, eq, gte, lt, sql } from 'drizzle-orm'
import { monthSummary } from '@/lib/repo/finance.repo'

export async function GET(req: NextRequest){
	const now = new Date()
	const start = new Date(now); start.setDate(now.getDate()-7)
	const startISO = start.toISOString().slice(0,10)
	const endISO = now.toISOString().slice(0,10)
	const doneRows = await db.select({ id: tasks.id }).from(tasks).where(and(eq(tasks.done,true), gte(tasks.dueAt, sql`${startISO}::date`), lt(tasks.dueAt, sql`${endISO}::date`)))
	const month = now.toISOString().slice(0,7)
	const fin = await monthSummary(month)
	const prot = await db.execute(sql`
		WITH days AS (
			SELECT date_trunc('day', logged_at) AS d, SUM(value) AS g
			FROM habit_logs WHERE logged_at >= ${sql`${startISO}::date`} AND logged_at < ${sql`${endISO}::date`}
			GROUP BY 1
		)
		SELECT COUNT(*) FILTER (WHERE g >= 180) AS ok, COUNT(*) AS total FROM days
	`)
	const ok = Number((prot as any).rows?.[0]?.ok||0)
	const total = Number((prot as any).rows?.[0]?.total||0)
	const compliance = total ? Math.round((ok/total)*100) : 0
	const md = `# Weekly Review\n\n- Tasks completed: ${doneRows.length}\n- Revenue this month: ₹${fin.income} (Net: ₹${fin.net})\n- Protein compliance: ${compliance}% (>=180g)`
	return NextResponse.json({ markdown: md })
} 