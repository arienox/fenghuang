import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { notes } from '@/lib/schema'
import { desc, sql } from 'drizzle-orm'

export async function POST(req: NextRequest){
	const body = await req.json()
	const res = await db.insert(notes).values({ userId: body.userId || 'demo', title: body.title, content: body.content }).returning({ id: notes.id })
	return NextResponse.json({ id: res[0].id })
}

export async function GET(req: NextRequest){
	const { searchParams } = new URL(req.url)
	const q = searchParams.get('q')
	const rows = await db.select().from(notes).orderBy(desc(notes.createdAt)).limit(20)
	// RAG stub: ignore q for now
	return NextResponse.json({ notes: rows })
} 