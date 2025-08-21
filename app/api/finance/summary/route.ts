import { NextRequest, NextResponse } from 'next/server'
import { monthSummary } from '@/lib/repo/finance.repo'
export async function GET(req: NextRequest){
	const { searchParams } = new URL(req.url)
	const month = searchParams.get('month') || new Date().toISOString().slice(0,7)
	const summary = await monthSummary(month)
	return NextResponse.json(summary)
} 