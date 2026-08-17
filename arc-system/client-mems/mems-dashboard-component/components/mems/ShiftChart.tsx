"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { BarChart2 } from "lucide-react"
import { DONUT_DATA, SHIFT_DATA, STATE_COLORS } from "@/lib/mems-data"

const RADIAN = Math.PI / 180

function CustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="font-mono text-xs font-bold"
      style={{ fontSize: 11 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function DonutChart() {
  const total = DONUT_DATA.reduce((s, d) => s + d.value, 0)
  const runningPct = Math.round((DONUT_DATA[0].value / total) * 100)

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#6b7280]">
        Current Shift Distribution
      </p>
      <div className="relative h-56 w-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DONUT_DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              dataKey="value"
              labelLine={false}
              label={CustomLabel as any}
              strokeWidth={2}
              stroke="#0d1117"
            >
              {DONUT_DATA.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#161b27",
                border: "1px solid #2a2f3e",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 12,
                color: "#e2e8f0",
              }}
              formatter={(value: number) => [`${value} machines`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold text-[#10B981]">{runningPct}%</span>
          <span className="font-mono text-xs text-[#6b7280]">UTILIZATION</span>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-2 flex gap-4">
        {DONUT_DATA.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.fill }} />
            <span className="font-mono text-xs text-[#94a3b8]">
              {d.name} <span className="font-bold" style={{ color: d.fill }}>{d.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HourlyBar() {
  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#6b7280]">
        Hourly Utilization (Shift 06:00 – 14:00)
      </p>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SHIFT_DATA} barSize={20} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontFamily: "monospace", fontSize: 11 }}
              axisLine={{ stroke: "#2a2f3e" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontFamily: "monospace", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                backgroundColor: "#161b27",
                border: "1px solid #2a2f3e",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 12,
                color: "#e2e8f0",
              }}
              formatter={(value: number, name: string) => [`${value}%`, name.toUpperCase()]}
            />
            <Legend
              wrapperStyle={{ fontFamily: "monospace", fontSize: 11, paddingTop: 8 }}
              formatter={(value) => (
                <span style={{ color: "#94a3b8" }}>{value.toUpperCase()}</span>
              )}
            />
            <Bar dataKey="running" stackId="a" fill={STATE_COLORS.RUNNING} radius={[0, 0, 0, 0]} name="running" />
            <Bar dataKey="idle"    stackId="a" fill={STATE_COLORS.IDLE}    radius={[0, 0, 0, 0]} name="idle" />
            <Bar dataKey="down"    stackId="a" fill={STATE_COLORS.DOWN}    radius={[4, 4, 0, 0]} name="down" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function ShiftChart() {
  return (
    <section className="rounded-xl border border-[#2a2f3e] bg-[#161b27] p-5">
      <div className="mb-5 flex items-center gap-2">
        <BarChart2 className="h-4 w-4 text-[#10B981]" />
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-[#94a3b8]">
          Shift Utilization
        </h2>
      </div>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <DonutChart />
        <div className="h-px w-full bg-[#2a2f3e] md:h-48 md:w-px" />
        <HourlyBar />
      </div>
    </section>
  )
}
