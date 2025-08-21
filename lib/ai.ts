type In = { id:number; importance:number; urgency:number; kind?:string; expectedValue?: number; minutes?: number }
export function moneyFirstScore(t: In){
  const revenueBonus = (t.kind==='revenue' ? 1000 : t.kind==='content' ? 200 : 0)
  const ev = Math.max(0, Number(t.expectedValue||0))
  const roi = ev / Math.max(15, Number(t.minutes||60)) // value per minute
  return (t.importance*2 + t.urgency) + revenueBonus + roi*100
}
export async function prioritizeTasks(tasks: In[]) {
  return tasks.sort((a,b)=> moneyFirstScore(b) - moneyFirstScore(a))
}
export function todayISO(){ return new Date().toISOString().slice(0,10) }
