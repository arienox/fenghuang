import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { webhookEvents } from '@/lib/schema'
import { addTransaction } from '@/lib/repo/finance.repo'
import { sql } from 'drizzle-orm'

export async function POST(req: NextRequest){
	const payload = await req.json().catch(()=> null)
	if(!payload) return NextResponse.json({ ok:false, error:'invalid json' }, { status:400 })
	const eventId = payload.id as string
	const provider = 'stripe'
	try{
		await db.insert(webhookEvents).values({ provider, eventId, payload: payload as any })
	}catch(e){ /* possibly duplicate */ }
	if(payload.type === 'invoice.payment_succeeded'){
		const amount = Number(payload.data?.object?.amount_paid||0)/100
		if(amount>0){
			await addTransaction({ userId:'demo', source:'stripe', kind:'income', amount, meta: { invoice_id: payload.data?.object?.id } })
		}
	}
	return NextResponse.json({ ok:true })
} 