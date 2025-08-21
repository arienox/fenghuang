import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest){
	const body = await req.json().catch(()=> ({}))
	return NextResponse.json({ ok:false, message: 'Not implemented; add embeddings' }, { status: 501 })
} 