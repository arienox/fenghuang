export default function ProjectBoard(){
  const columns = [
    {title:'Now', items:['Ship daily plan', 'Reach out to 20 leads']},
    {title:'Next', items:['Finance auto-import', 'Protein tracker UI']},
    {title:'Later', items:['RAG wiki search', 'Streak gamification']},
  ]
  return (
    <div id="projects" className="rounded-2xl border p-4">
      <div className="font-medium mb-3">Project Board</div>
      <div className="grid grid-cols-3 gap-3">
        {columns.map(col=> (
          <div key={col.title} className="rounded-xl border p-3">
            <div className="text-sm font-medium mb-2">{col.title}</div>
            <ul className="text-sm space-y-2">
              {col.items.map(i=> <li key={i} className="rounded bg-muted p-2">{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
