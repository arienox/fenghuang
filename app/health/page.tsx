'use client'
import { useEffect, useMemo, useState } from 'react'

type Day = { date:string; grams:number }

export default function HealthPage(){
	const weekStart = useMemo(()=> new Date().toISOString().slice(0,10), [])
	const [grams, setGrams] = useState('')
	const [week, setWeek] = useState<Day[]>([])
	const load = async()=>{ const r = await fetch(`/api/health/protein?weekStart=${weekStart}`).then(r=>r.json()); setWeek(r.data||[]) }
	useEffect(()=>{ load() }, [weekStart])
	const submit = async (e:any)=>{
		e.preventDefault()
		await fetch('/api/health/protein', { method:'POST', body: JSON.stringify({ grams: Number(grams) }) })
		setGrams('')
		load()
	}
	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Health</h1>
			<form onSubmit={submit} className="flex gap-2 items-end">
				<input placeholder="Protein grams" value={grams} onChange={e=>setGrams(e.target.value)} className="border rounded px-2 py-1 text-sm" />
				<button className="text-sm border px-3 py-1 rounded">Add</button>
			</form>
			<div className="rounded-2xl border p-4">
				<div className="text-sm font-medium mb-2">Weekly Protein</div>
				<div className="flex items-end gap-2 h-32">
					{week.map(d=> (
						<div key={d.date} className="flex flex-col items-center">
							<div className="bg-blue-500 w-6" style={{ height: `${Math.min(100, (d.grams/180)*100)}%` }} />
							<div className="text-[10px] opacity-60">{d.date.slice(5)}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
} 