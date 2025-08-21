'use client'
import { useEffect, useState } from 'react'

type Task = { id:number; title:string; lane:string; done:boolean }

export default function ProjectsPage(){
	const [tasks, setTasks] = useState<Task[]>([])
	const load = async()=>{ const r = await fetch('/api/tasks/backlog'); const j = await r.json(); setTasks((j.tasks||[]).filter((t:Task)=>!t.done)) }
	useEffect(()=>{ load() },[])
	const lanes: Array<'now'|'next'|'later'> = ['now','next','later']
	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">Projects — Kanban</h1>
			<div className="grid grid-cols-3 gap-4">
				{lanes.map(lane=> (
					<div key={lane} className="rounded-2xl border p-4 min-h-56">
						<div className="text-sm font-medium mb-2">{lane[0].toUpperCase()+lane.slice(1)}</div>
						<div className="space-y-2">
							{tasks.filter(t=>t.lane===lane).map(t=> (
								<div key={t.id} className="border rounded px-3 py-2 text-sm">{t.title}</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
} 