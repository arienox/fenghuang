'use client'
import { useEffect, useMemo, useState } from 'react'

export function KPICardGrid(){
	const [tasks, setTasks] = useState<{ id:number; title:string; done:boolean }[]>([])
	const [rev, setRev] = useState<{ income:number; expense:number; net:number }|null>(null)
	const [protein, setProtein] = useState<{ date:string; grams:number }[]>([])
	const todayISO = useMemo(()=> new Date().toISOString().slice(0,10), [])
	const month = useMemo(()=> new Date().toISOString().slice(0,7), [])
	useEffect(()=>{
		;(async()=>{
			try{
				const t = await fetch('/api/tasks').then(r=>r.json()); setTasks(t.tasks||[])
			}catch{}
			try{
				const s = await fetch(`/api/finance/summary?month=${month}`).then(r=>r.json()); setRev(s)
			}catch{}
			try{
				const w = await fetch(`/api/health/protein?weekStart=${todayISO}`).then(r=>r.json()); setProtein(w.data||[])
			}catch{}
		})()
	}, [todayISO, month])
	const doneCount = tasks.filter(t=>t.done).length
	const totalCount = tasks.length
	const todaysProtein = protein.find(p=> p.date===todayISO)?.grams || 0
	const cards = [
		{label:'Deep Work (h)', value: `${doneCount}/${totalCount}`},
		{label:'This Month Revenue', value: `₹${rev?.income??0}`},
		{label:'Tasks Done', value:`${doneCount}/${totalCount}`},
		{label:'Protein (g)', value:`${todaysProtein}/180`}
	]
	return (
		<div className="grid grid-cols-4 gap-4" id="metrics">
			{cards.map((c)=> (
				<div key={c.label} className="rounded-2xl border p-4 shadow-sm">
					<div className="text-xs opacity-70">{c.label}</div>
					<div className="text-2xl font-semibold">{c.value}</div>
				</div>
			))}
		</div>
	)
}
