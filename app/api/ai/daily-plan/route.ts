import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
export const runtime = 'nodejs'
function todayStr(){ return new Date().toISOString().slice(0,10) }
export async function GET(){
  const today = todayStr()
  // Select top 5 by money-first score
  const { rows } = await pool.query(`
    WITH cand AS (
      SELECT *,
        (CASE WHEN kind='revenue' THEN 1000 WHEN kind='content' THEN 200 ELSE 0 END
         + (importance*2 + urgency)
         + (COALESCE(expected_value,0) / GREATEST(15, COALESCE(minutes,60)))*100
        ) AS score
      FROM tasks
      WHERE done=false AND (today=false OR due_at::date <> $1::date)
    )
    SELECT id FROM cand ORDER BY score DESC, id ASC LIMIT 5;
  `, [today])
  const ids: number[] = rows.map((r: { id: number }) => r.id)
  if(ids.length){
    await pool.query('UPDATE tasks SET today=true, due_at = $1::date WHERE id = ANY($2::int[])', [today, ids])
  }
  const listed = await pool.query('SELECT id,title,done FROM tasks WHERE today=true AND due_at::date=$1::date ORDER BY id', [today])
  return NextResponse.json({ date: today, picked: ids, tasks: listed.rows })
}
export async function POST(){ return GET() }
