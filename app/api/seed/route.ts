import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
export async function POST(){
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      project_id INT,
      title VARCHAR(300) NOT NULL,
      notes TEXT,
      kind VARCHAR(24) DEFAULT 'ops',
      expected_value NUMERIC(12,2) DEFAULT 0,
      minutes INT DEFAULT 60,
      importance INT DEFAULT 2,
      urgency INT DEFAULT 2,
      today BOOLEAN DEFAULT false,
      done BOOLEAN DEFAULT false,
      due_at TIMESTAMP,
      last_worked_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `)
  await pool.query(`TRUNCATE TABLE tasks RESTART IDENTITY;`)
  await pool.query(`
    INSERT INTO tasks (user_id,title,kind,expected_value,minutes,importance,urgency) VALUES
    ('demo','Cold outreach 20 DMs','revenue',2500,60,3,3),
    ('demo','Edit YouTube short','content',400,45,2,2),
    ('demo','Polish portfolio landing','revenue',1500,90,3,2),
    ('demo','Refactor task UI','ops',0,60,1,1),
    ('demo','Draft freelancing gig page','revenue',2000,90,3,2);
  `)
  return NextResponse.json({ ok:true })
}
