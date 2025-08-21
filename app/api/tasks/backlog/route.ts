import { NextResponse } from 'next/server'
import { listBacklog } from '@/lib/repo/tasks.repo'
export async function GET(){
	const items = await listBacklog()
	return NextResponse.json({ tasks: items })
} 