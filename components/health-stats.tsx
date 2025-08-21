export default function HealthStats(){
  return (
    <div id="health" className="rounded-2xl border p-4">
      <div className="font-medium mb-3">Health & Protein</div>
      <ul className="text-sm space-y-1">
        <li>Protein target: 180g</li>
        <li>Logged today: 0g</li>
        <li>Workout: TBD</li>
      </ul>
    </div>
  )
}
