export function KPICardGrid(){
  const cards = [
    {label:'Deep Work (h)', value:'0'},
    {label:'This Month Revenue', value:'₹0'},
    {label:'Tasks Done', value:'0/0'},
    {label:'Protein (g)', value:'0/180'}
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
