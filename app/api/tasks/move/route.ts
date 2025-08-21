import { NextRequest, NextResponse } from 'next/server'
import { moveLane } from '@/lib/repo/tasks.repo'
export async function POST(req: NextRequest){
	const { id, lane } = await req.json()
	if(!id || !['now','next','later'].includes(lane)) return NextResponse.json({ ok:false, error:'Invalid payload' }, { status: 400 })
	await moveLane(Number(id), lane)
	return NextResponse.json({ ok:true })
} 