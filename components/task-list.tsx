'use client'
import { useEffect, useState } from 'react'
export default function TaskList(){
  const [tasks, setTasks] = useState<any[]>([])
  const load = async()=>{ const r = await fetch('/api/tasks'); const j = await r.json(); setTasks(j.tasks||[]) }
  useEffect(()=>{ load() },[])
  const toggle = async (id:number)=>{ await fetch('/api/tasks', { method:'POST', body: JSON.stringify({ id, toggle:true }) }); load() }
  const plan = async ()=>{ await fetch('/api/ai/daily-plan'); load() }
  return (
    <div id="tasks" className="rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Today’s Checklist</div>
        <button onClick={plan} className="text-xs border px-2 py-1 rounded">Auto-plan (Money-first)</button>
      </div>
      <ul className="space-y-2">
        {tasks.map(t=> (
          <li key={t.id} className="flex items-center gap-3">
            <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} />
            <span className={t.done? 'line-through opacity-60':''}>{t.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
