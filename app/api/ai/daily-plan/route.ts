import { NextResponse } from 'next/server'
import { planMoneyFirst, listToday } from '@/lib/repo/tasks.repo'
export const runtime = 'nodejs'
export async function GET(){
	const { date, picked } = await planMoneyFirst({ limit: 5 })
	const tasks = await listToday(date)
	return NextResponse.json({ date, picked, tasks })
}
export async function POST(){ return GET() }
