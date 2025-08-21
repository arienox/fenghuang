import { NextRequest, NextResponse } from 'next/server'
import { ensureProteinHabit, logProtein, weekProteinSummary } from '@/lib/repo/health.repo'

export async function POST(req: NextRequest){
	const body = await req.json()
	const grams = Number(body.grams)
	if(!grams || grams <= 0) return NextResponse.json({ ok:false, error:'grams required' }, { status: 400 })
	await ensureProteinHabit('demo')
	await logProtein('demo', grams, body.date)
	return NextResponse.json({ ok:true })
}

export async function GET(req: NextRequest){
	const { searchParams } = new URL(req.url)
	const weekStart = searchParams.get('weekStart') || new Date().toISOString().slice(0,10)
	const data = await weekProteinSummary('demo', weekStart)
	return NextResponse.json({ data })
} 