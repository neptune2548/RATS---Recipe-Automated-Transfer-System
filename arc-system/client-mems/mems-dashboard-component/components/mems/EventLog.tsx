"use client"

import { ScrollText, ArrowRight } from "lucide-react"
import { EVENT_LOG, MachineState, STATE_COLORS } from "@/lib/mems-data"

function StateBadge({ state }: { state: MachineState }) {
  const color = STATE_COLORS[state]
  return (
    <span
      className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
      style={{ color, backgroundColor: `${color}18` }}
    >
      {state}
    </span>
  )
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function getRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m ago`
}

export function EventLog() {
  return (
    <section className="rounded-xl border border-[#2a2f3e] bg-[#161b27] p-5">
      <div className="mb-4 flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-[#10B981]" />
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-[#94a3b8]">
          Recent Events
        </h2>
        <span className="ml-auto rounded-full bg-[#10B981]/10 px-2 py-0.5 font-mono text-xs text-[#10B981]">
          {EVENT_LOG.length} entries
        </span>
      </div>

      {/* Table header */}
      <div className="mb-2 grid grid-cols-[1fr_auto_auto_auto_1fr] gap-x-3 px-2">
        {["MACHINE", "FROM", "", "TO", "REASON / TIME"].map((h, i) => (
          <span key={i} className="font-mono text-[10px] uppercase tracking-wider text-[#4b5563]">
            {h}
          </span>
        ))}
      </div>

      {/* Scrollable rows */}
      <div className="max-h-72 space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#2a2f3e_transparent]">
        {EVENT_LOG.map((evt, i) => (
          <div
            key={evt.id}
            className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-x-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#1e2538]"
            style={{ borderLeft: `2px solid ${STATE_COLORS[evt.to]}` }}
          >
            {/* Machine name */}
            <span className="truncate font-mono text-xs font-semibold text-[#e2e8f0]">
              {evt.machine}
            </span>

            {/* From state */}
            <StateBadge state={evt.from} />

            {/* Arrow */}
            <ArrowRight className="h-3 w-3 text-[#4b5563]" />

            {/* To state */}
            <StateBadge state={evt.to} />

            {/* Reason + time */}
            <div className="min-w-0">
              <p className="truncate font-mono text-xs text-[#94a3b8]">{evt.reason}</p>
              <p className="font-mono text-[10px] text-[#4b5563]">
                {formatTimestamp(evt.timestamp)}{" "}
                <span className="text-[#374151]">· {getRelative(evt.timestamp)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
