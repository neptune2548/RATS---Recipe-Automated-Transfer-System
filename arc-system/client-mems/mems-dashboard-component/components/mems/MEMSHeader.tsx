"use client"

import { useEffect, useState } from "react"
import { Factory, Wifi, Clock } from "lucide-react"
import { MACHINES } from "@/lib/mems-data"

export function MEMSHeader() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const total = MACHINES.length
  const running = MACHINES.filter((m) => m.state === "RUNNING").length
  const down = MACHINES.filter((m) => m.state === "DOWN").length
  const idle = MACHINES.filter((m) => m.state === "IDLE").length

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <header className="flex flex-col gap-3 border-b border-[#2a2f3e] bg-[#0d1117] px-6 py-4 md:flex-row md:items-center md:justify-between">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]/10 ring-1 ring-[#10B981]/30">
          <Factory className="h-5 w-5 text-[#10B981]" />
        </div>
        <div>
          <h1 className="font-mono text-lg font-bold tracking-widest text-white">
            MEMS <span className="text-[#10B981]">DASHBOARD</span>
          </h1>
          <p className="font-mono text-xs text-[#6b7280]">Machine Efficiency Monitor System</p>
        </div>
        <div className="ml-3 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
          </span>
          <span className="font-mono text-xs text-[#10B981]">LIVE</span>
          <Wifi className="h-3 w-3 text-[#10B981]" />
        </div>
      </div>

      {/* Center: Machine stats */}
      <div className="flex items-center gap-4">
        <StatBadge label="TOTAL" value={total} color="text-[#94a3b8]" />
        <div className="h-6 w-px bg-[#2a2f3e]" />
        <StatBadge label="RUNNING" value={running} color="text-[#10B981]" />
        <StatBadge label="IDLE" value={idle} color="text-[#F59E0B]" />
        <StatBadge label="DOWN" value={down} color="text-[#EF4444]" />
      </div>

      {/* Right: Date / Time */}
      <div className="flex items-center gap-2 rounded-lg border border-[#2a2f3e] bg-[#161b27] px-4 py-2">
        <Clock className="h-4 w-4 text-[#6b7280]" />
        <div className="font-mono text-sm">
          <span className="text-[#6b7280]">{dateStr} </span>
          <span className="font-bold text-[#e2e8f0]">{timeStr}</span>
        </div>
      </div>
    </header>
  )
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="text-center">
      <p className="font-mono text-xs text-[#6b7280]">{label}</p>
      <p className={`font-mono text-xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
