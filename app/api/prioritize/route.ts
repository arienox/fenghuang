import { NextResponse } from 'next/server'
import { moneyFirstScore } from '@/lib/ai'
export async function POST(req: Request){
  const { tasks } = await req.json();
  const ranked = [...tasks].sort((a:any,b:any)=> moneyFirstScore(b) - moneyFirstScore(a))
  return NextResponse.json({ ranked })
}
