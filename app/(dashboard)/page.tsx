'use client'
import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'
import { KPICardGrid } from '@/components/cards'
import TaskList from '@/components/task-list'
import ProjectBoard from '@/components/project-board'
import FinanceChart from '@/components/finance-chart'
import HealthStats from '@/components/health-stats'
import WikiList from '@/components/wiki-list'
export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 min-h-dvh">
      <aside className="col-span-2 border-r"><Sidebar/></aside>
      <main className="col-span-10">
        <Topbar/>
        <div className="p-6 space-y-8">
          <KPICardGrid/>
          <div className="grid grid-cols-12 gap-6">
            <section className="col-span-7 space-y-6">
              <TaskList/>
              <ProjectBoard/>
            </section>
            <aside className="col-span-5 space-y-6">
              <FinanceChart/>
              <HealthStats/>
              <WikiList/>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
