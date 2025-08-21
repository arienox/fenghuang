import { db } from '@/lib/db'
import { transactions } from '@/lib/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

export const AddTransaction = z.object({
	userId: z.string(),
	source: z.string().min(1),
	kind: z.enum(['income','expense']),
	amount: z.number().positive(),
	category: z.string().optional(),
	meta: z.any().optional(),
	occurredAt: z.string().optional(),
})
export type AddTransaction = z.infer<typeof AddTransaction>

export async function addTransaction(data: AddTransaction){
	const input = AddTransaction.parse(data)
	await db.insert(transactions).values({
		userId: input.userId,
		source: input.source,
		kind: input.kind,
		amount: String(input.amount),
		category: input.category,
		meta: input.meta as any,
		occurredAt: input.occurredAt ? sql`${input.occurredAt}::timestamp` as any : undefined,
	})
}

export async function listLatest(n: number){
	const rows = await db.select().from(transactions).orderBy(desc(transactions.occurredAt)).limit(n)
	return rows
}

export async function monthSummary(yyyyMM: string){
	// yyyyMM like 2025-08
	const start = `${yyyyMM}-01`
	const end = sql`${start}::date + INTERVAL '1 month'`
	const rows = await db.execute(sql`
		SELECT kind, SUM(amount)::numeric AS total
		FROM transactions
		WHERE occurred_at >= ${sql`${start}::date`} AND occurred_at < ${end}
		GROUP BY kind
	`)
	const map: Record<string, number> = {}
	for(const r of (rows as any).rows||[]){ map[r.kind] = Number(r.total) }
	return { income: map.income||0, expense: map.expense||0, net: (map.income||0) - (map.expense||0) }
} 