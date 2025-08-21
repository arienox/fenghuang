import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
function todayStr(){ return new Date().toISOString().slice(0,10) }
export async function GET(){
  const { rows } = await pool.query(
    `SELECT id,title,done FROM tasks WHERE today=true AND to_char(coalesce(due_at, now()), 'YYYY-MM-DD')=$1 ORDER BY id`,
    [todayStr()]
  )
  return NextResponse.json({ tasks: rows })
}
export async function POST(req: NextRequest){
  const body = await req.json();
  if(body?.toggle){
    await pool.query('UPDATE tasks SET done = NOT done WHERE id=$1',[body.id])
  }
  return NextResponse.json({ ok:true })
}
