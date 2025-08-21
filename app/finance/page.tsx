'use client'
import { useEffect, useMemo, useState } from 'react'

type Tx = { id:number; source:string; kind:string; amount:string; occurredAt?: string }

export default function FinancePage(){
	const month = useMemo(()=> new Date().toISOString().slice(0,7), [])
	const [summary, setSummary] = useState<{ income:number; expense:number; net:number }|null>(null)
	const [last, setLast] = useState<Tx[]>([])
	const [form, setForm] = useState({ kind:'income', source:'', amount:'' })
	const load = async()=>{
		const s = await fetch(`/api/finance/summary?month=${month}`).then(r=>r.json()); setSummary(s)
		// naive latest list by calling record page is not ideal; stubbed here
	}
	useEffect(()=>{ load() }, [month])
	const submit = async (e: any)=>{
		e.preventDefault()
		await fetch('/api/finance/record', { method:'POST', body: JSON.stringify({ ...form, amount: Number(form.amount) }) })
		setForm({ kind:'income', source:'', amount:'' })
		load()
	}
	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Finance</h1>
			<form onSubmit={submit} className="flex items-end gap-2">
				<select value={form.kind} onChange={e=>setForm(f=>({ ...f, kind: e.target.value }))} className="border rounded px-2 py-1 text-sm">
					<option value="income">Income</option>
					<option value="expense">Expense</option>
				</select>
				<input placeholder="Source" value={form.source} onChange={e=>setForm(f=>({ ...f, source:e.target.value }))} className="border rounded px-2 py-1 text-sm" />
				<input placeholder="Amount" value={form.amount} onChange={e=>setForm(f=>({ ...f, amount:e.target.value }))} className="border rounded px-2 py-1 text-sm" />
				<button className="text-sm border px-3 py-1 rounded">Add</button>
			</form>
			<div className="grid grid-cols-3 gap-4">
				<div className="rounded-2xl border p-4">
					<div className="text-xs opacity-70">Income</div>
					<div className="text-xl font-semibold">₹{summary?.income??0}</div>
				</div>
				<div className="rounded-2xl border p-4">
					<div className="text-xs opacity-70">Expense</div>
					<div className="text-xl font-semibold">₹{summary?.expense??0}</div>
				</div>
				<div className="rounded-2xl border p-4">
					<div className="text-xs opacity-70">Net</div>
					<div className="text-xl font-semibold">₹{summary?.net??0}</div>
				</div>
			</div>
			{/* Table placeholder */}
			<div className="rounded-2xl border p-4">
				<div className="text-sm font-medium mb-2">Latest</div>
				<div className="text-xs opacity-60">Coming soon</div>
			</div>
		</div>
	)
} 