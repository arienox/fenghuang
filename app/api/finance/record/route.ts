import { NextResponse } from 'next/server'
import { addTransaction } from '@/lib/repo/finance.repo'
export async function POST(req: Request){
	const body = await req.json()
	await addTransaction({
		userId: body.userId || 'demo',
		source: body.source,
		kind: body.kind,
		amount: Number(body.amount),
		category: body.category,
		meta: body.meta,
		occurredAt: body.occurredAt,
	})
	return NextResponse.json({ ok:true })
}
