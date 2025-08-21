import { NextRequest, NextResponse } from 'next/server'
import { listToday, toggleDone } from '@/lib/repo/tasks.repo'
export async function GET(){
	const tasks = await listToday()
	return NextResponse.json({ tasks })
}
export async function POST(req: NextRequest){
	const body = await req.json()
	if(body?.toggle){ await toggleDone(Number(body.id)) }
	return NextResponse.json({ ok:true })
}
