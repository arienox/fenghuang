export default function Sidebar(){
  return (
    <div className="p-4 space-y-2">
      <h2 className="font-semibold text-lg">Aryan Command Center</h2>
      <nav className="space-y-1 text-sm">
        <a className="block hover:underline" href="/">Dashboard</a>
        <a className="block hover:underline" href="#projects">Projects</a>
        <a className="block hover:underline" href="#tasks">Tasks</a>
        <a className="block hover:underline" href="#finance">Finance</a>
        <a className="block hover:underline" href="#health">Health</a>
        <a className="block hover:underline" href="#wiki">Wiki</a>
      </nav>
    </div>
  )
}
