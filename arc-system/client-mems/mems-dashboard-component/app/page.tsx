import { MEMSHeader } from "@/components/mems/MEMSHeader"
import { KPIBar } from "@/components/mems/KPIBar"
import { MachineGrid } from "@/components/mems/MachineGrid"
import { ShiftChart } from "@/components/mems/ShiftChart"
import { EventLog } from "@/components/mems/EventLog"

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-white">
      <MEMSHeader />
      <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-6 md:px-6">
        {/* KPI summary bar */}
        <KPIBar />

        {/* Machine status grid */}
        <MachineGrid />

        {/* Charts + Events side by side on large screens */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ShiftChart />
          </div>
          <div className="xl:col-span-1">
            <EventLog />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a2f3e] px-6 py-3 text-center">
        <p className="font-mono text-xs text-[#374151]">
          MEMS v2.4.1 &nbsp;·&nbsp; SHIFT: 06:00 – 14:00 &nbsp;·&nbsp; PLANT: FACTORY-01
        </p>
      </footer>
    </main>
  )
}
