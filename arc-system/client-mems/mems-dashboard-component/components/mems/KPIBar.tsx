import { TrendingUp, Package, AlertTriangle, Gauge } from "lucide-react"
import { MACHINES } from "@/lib/mems-data"

export function KPIBar() {
  const running = MACHINES.filter((m) => m.state === "RUNNING")
  const avgOEE = running.length
    ? Math.round(running.reduce((s, m) => s + m.oee, 0) / running.length)
    : 0
  const totalOutput = MACHINES.reduce((s, m) => s + m.output, 0)
  const downCount = MACHINES.filter((m) => m.state === "DOWN").length
  const utilization = Math.round((running.length / MACHINES.length) * 100)

  const kpis = [
    {
      label: "AVG OEE",
      value: `${avgOEE}%`,
      sub: "Running machines",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "#10B981",
    },
    {
      label: "TOTAL OUTPUT",
      value: totalOutput.toLocaleString(),
      sub: "Units this shift",
      icon: <Package className="h-5 w-5" />,
      color: "#3b82f6",
    },
    {
      label: "MACHINE DOWN",
      value: `${downCount}`,
      sub: `of ${MACHINES.length} total`,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "#EF4444",
    },
    {
      label: "UTILIZATION",
      value: `${utilization}%`,
      sub: `${running.length} active lines`,
      icon: <Gauge className="h-5 w-5" />,
      color: "#F59E0B",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex items-center gap-4 rounded-xl border border-[#2a2f3e] bg-[#161b27] px-5 py-4"
          style={{ borderLeftColor: kpi.color, borderLeftWidth: 3 }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${kpi.color}18`, color: kpi.color }}
          >
            {kpi.icon}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#6b7280]">{kpi.label}</p>
            <p className="font-mono text-2xl font-bold" style={{ color: kpi.color }}>
              {kpi.value}
            </p>
            <p className="font-mono text-xs text-[#4b5563]">{kpi.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
