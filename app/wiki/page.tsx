'use client'
import { useEffect, useState } from 'react'

type Note = { id:number; title:string; content:string }

export default function WikiPage(){
	const [notes, setNotes] = useState<Note[]>([])
	const [form, setForm] = useState({ title:'', content:'' })
	const [q, setQ] = useState('')
	const load = async()=>{ const r = await fetch(`/api/wiki/notes?q=${encodeURIComponent(q)}`); const j = await r.json(); setNotes(j.notes||[]) }
	useEffect(()=>{ load() }, [q])
	const submit = async (e:any)=>{
		e.preventDefault(); await fetch('/api/wiki/notes', { method:'POST', body: JSON.stringify(form) }); setForm({ title:'', content:'' }); load()
	}
	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Wiki</h1>
			<form onSubmit={submit} className="space-y-2">
				<input placeholder="Title" value={form.title} onChange={e=>setForm(f=>({ ...f, title: e.target.value }))} className="border rounded px-2 py-1 text-sm w-full" />
				<textarea placeholder="Content" value={form.content} onChange={e=>setForm(f=>({ ...f, content: e.target.value }))} className="border rounded px-2 py-1 text-sm w-full h-28" />
				<div className="flex items-center gap-2">
					<input placeholder="Search (stub)" value={q} onChange={e=>setQ(e.target.value)} className="border rounded px-2 py-1 text-sm" />
					<button className="text-sm border px-3 py-1 rounded">Create</button>
				</div>
			</form>
			<div className="grid gap-3">
				{notes.map(n=> (
					<div key={n.id} className="rounded border p-3">
						<div className="text-sm font-medium">{n.title}</div>
						<div className="text-xs opacity-70 whitespace-pre-wrap">{n.content}</div>
					</div>
				))}
			</div>
		</div>
	)
} 