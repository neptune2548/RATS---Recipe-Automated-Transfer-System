"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, MinusCircle, Cpu, Timer, TrendingUp, Package } from "lucide-react"
import { MACHINES, Machine, MachineState, STATE_COLORS } from "@/lib/mems-data"

const STATE_ICONS: Record<MachineState, React.ReactNode> = {
  RUNNING: <CheckCircle2 className="h-4 w-4" style={{ color: STATE_COLORS.RUNNING }} />,
  DOWN: <XCircle className="h-4 w-4" style={{ color: STATE_COLORS.DOWN }} />,
  IDLE: <MinusCircle className="h-4 w-4" style={{ color: STATE_COLORS.IDLE }} />,
}

const STATE_GLOW: Record<MachineState, string> = {
  RUNNING: "shadow-[0_0_12px_0px_rgba(16,185,129,0.3)] border-[#10B981]/30",
  DOWN: "shadow-[0_0_12px_0px_rgba(239,68,68,0.35)] border-[#EF4444]/40",
  IDLE: "shadow-[0_0_10px_0px_rgba(245,158,11,0.25)] border-[#F59E0B]/30",
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function MachineCard({ machine }: { machine: Machine }) {
  const color = STATE_COLORS[machine.state]
  const glow = STATE_GLOW[machine.state]

  return (
    <div
      className={`rounded-xl border bg-[#161b27] p-4 transition-all duration-300 hover:scale-[1.02] ${glow}`}
    >
      {/* Card Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#4b5563]" />
          <div>
            <p className="font-mono text-sm font-bold text-white">{machine.name}</p>
            <p className="font-mono text-xs text-[#4b5563]">{machine.line}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-md px-2 py-1"
          style={{ backgroundColor: `${color}18` }}
        >
          {STATE_ICONS[machine.state]}
          <span className="font-mono text-xs font-bold" style={{ color }}>
            {machine.state}
          </span>
        </div>
      </div>

      {/* State duration bar */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between">
          <span className="font-mono text-xs text-[#6b7280]">IN STATE</span>
          <span className="font-mono text-xs font-bold" style={{ color }}>
            {formatDuration(machine.stateSince)}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1e2538]">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min((machine.stateSince / 480) * 100, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <Metric
          icon={<TrendingUp className="h-3 w-3" />}
          label="OEE"
          value={machine.state === "RUNNING" ? `${machine.oee}%` : "—"}
          highlight={machine.state === "RUNNING"}
          color={color}
        />
        <Metric
          icon={<Timer className="h-3 w-3" />}
          label="CYCLE"
          value={machine.state === "RUNNING" ? `${machine.cycleTime}s` : "—"}
          highlight={machine.state === "RUNNING"}
          color={color}
        />
        <Metric
          icon={<Package className="h-3 w-3" />}
          label="OUTPUT"
          value={machine.output.toLocaleString()}
          highlight
          color={color}
        />
      </div>
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
  highlight,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
  color: string
}) {
  return (
    <div className="rounded-md bg-[#0d1117] px-2 py-1.5 text-center">
      <div className="mb-0.5 flex items-center justify-center gap-1" style={{ color: "#4b5563" }}>
        {icon}
        <span className="font-mono text-[10px]">{label}</span>
      </div>
      <p
        className="font-mono text-sm font-bold"
        style={{ color: highlight ? color : "#6b7280" }}
      >
        {value}
      </p>
    </div>
  )
}

export function MachineGrid() {
  const [filter, setFilter] = useState<MachineState | "ALL">("ALL")

  const filtered =
    filter === "ALL" ? MACHINES : MACHINES.filter((m) => m.state === filter)

  const filters: Array<{ label: string; value: MachineState | "ALL"; color: string }> = [
    { label: "ALL", value: "ALL", color: "#94a3b8" },
    { label: "RUNNING", value: "RUNNING", color: STATE_COLORS.RUNNING },
    { label: "IDLE", value: "IDLE", color: STATE_COLORS.IDLE },
    { label: "DOWN", value: "DOWN", color: STATE_COLORS.DOWN },
  ]

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-[#94a3b8]">
          Machine Status Grid
        </h2>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="rounded-md border px-3 py-1 font-mono text-xs font-bold transition-all"
              style={{
                borderColor: filter === f.value ? f.color : "#2a2f3e",
                color: filter === f.value ? f.color : "#6b7280",
                backgroundColor: filter === f.value ? `${f.color}18` : "transparent",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>
    </section>
  )
}
