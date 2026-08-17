export type MachineState = "RUNNING" | "DOWN" | "IDLE"

export interface Machine {
  id: string
  name: string
  line: string
  state: MachineState
  stateSince: number // minutes in current state
  oee: number // 0-100
  cycleTime: number // seconds
  output: number // units this shift
}

export interface ShiftUtilization {
  name: string
  running: number
  idle: number
  down: number
}

export interface EventLog {
  id: string
  machine: string
  from: MachineState
  to: MachineState
  timestamp: Date
  reason: string
}

export const MACHINES: Machine[] = [
  { id: "M01", name: "ASM AD838-01", line: "LINE-A", state: "RUNNING", stateSince: 142, oee: 87, cycleTime: 4.2, output: 1230 },
  { id: "M02", name: "ASM AD838-02", line: "LINE-A", state: "RUNNING", stateSince: 98,  oee: 91, cycleTime: 4.1, output: 1340 },
  { id: "M03", name: "ASM AD838-03", line: "LINE-A", state: "DOWN",    stateSince: 23,  oee: 0,  cycleTime: 0,   output: 880  },
  { id: "M04", name: "ASM AD838-04", line: "LINE-A", state: "IDLE",    stateSince: 11,  oee: 0,  cycleTime: 0,   output: 670  },
  { id: "M05", name: "FUJI NXT3-01", line: "LINE-B", state: "RUNNING", stateSince: 210, oee: 94, cycleTime: 3.8, output: 2100 },
  { id: "M06", name: "FUJI NXT3-02", line: "LINE-B", state: "RUNNING", stateSince: 185, oee: 88, cycleTime: 3.9, output: 1980 },
  { id: "M07", name: "FUJI NXT3-03", line: "LINE-B", state: "RUNNING", stateSince: 72,  oee: 82, cycleTime: 4.0, output: 1560 },
  { id: "M08", name: "FUJI NXT3-04", line: "LINE-B", state: "IDLE",    stateSince: 5,   oee: 0,  cycleTime: 0,   output: 1100 },
  { id: "M09", name: "JUKI FX-3-01", line: "LINE-C", state: "RUNNING", stateSince: 310, oee: 96, cycleTime: 3.5, output: 2500 },
  { id: "M10", name: "JUKI FX-3-02", line: "LINE-C", state: "DOWN",    stateSince: 47,  oee: 0,  cycleTime: 0,   output: 1200 },
  { id: "M11", name: "JUKI FX-3-03", line: "LINE-C", state: "RUNNING", stateSince: 130, oee: 79, cycleTime: 4.5, output: 1450 },
  { id: "M12", name: "JUKI FX-3-04", line: "LINE-C", state: "RUNNING", stateSince: 88,  oee: 85, cycleTime: 4.2, output: 1310 },
  { id: "M13", name: "PNS-EVO-01",   line: "LINE-D", state: "RUNNING", stateSince: 55,  oee: 90, cycleTime: 3.7, output: 930  },
  { id: "M14", name: "PNS-EVO-02",   line: "LINE-D", state: "IDLE",    stateSince: 18,  oee: 0,  cycleTime: 0,   output: 720  },
  { id: "M15", name: "PNS-EVO-03",   line: "LINE-D", state: "RUNNING", stateSince: 200, oee: 92, cycleTime: 3.6, output: 2200 },
  { id: "M16", name: "PNS-EVO-04",   line: "LINE-D", state: "DOWN",    stateSince: 8,   oee: 0,  cycleTime: 0,   output: 540  },
]

export const SHIFT_DATA: ShiftUtilization[] = [
  { name: "06:00", running: 70, idle: 20, down: 10 },
  { name: "07:00", running: 75, idle: 15, down: 10 },
  { name: "08:00", running: 80, idle: 12, down: 8  },
  { name: "09:00", running: 85, idle: 8,  down: 7  },
  { name: "10:00", running: 78, idle: 14, down: 8  },
  { name: "11:00", running: 82, idle: 10, down: 8  },
  { name: "12:00", running: 76, idle: 16, down: 8  },
  { name: "13:00", running: 84, idle: 9,  down: 7  },
]

const now = new Date()
const ago = (mins: number) => new Date(now.getTime() - mins * 60000)

export const EVENT_LOG: EventLog[] = [
  { id: "E01", machine: "PNS-EVO-04",   from: "RUNNING", to: "DOWN",    timestamp: ago(8),  reason: "Motor fault detected" },
  { id: "E02", machine: "PNS-EVO-02",   from: "RUNNING", to: "IDLE",    timestamp: ago(18), reason: "Material shortage" },
  { id: "E03", machine: "ASM AD838-03", from: "RUNNING", to: "DOWN",    timestamp: ago(23), reason: "Nozzle clog alarm" },
  { id: "E04", machine: "FUJI NXT3-04", from: "RUNNING", to: "IDLE",    timestamp: ago(5),  reason: "Awaiting feeder reload" },
  { id: "E05", machine: "ASM AD838-04", from: "DOWN",    to: "IDLE",    timestamp: ago(11), reason: "Fault cleared, pending restart" },
  { id: "E06", machine: "JUKI FX-3-02", from: "RUNNING", to: "DOWN",    timestamp: ago(47), reason: "Vision system error" },
  { id: "E07", machine: "FUJI NXT3-03", from: "IDLE",    to: "RUNNING", timestamp: ago(72), reason: "Production resumed" },
  { id: "E08", machine: "ASM AD838-01", from: "IDLE",    to: "RUNNING", timestamp: ago(142), reason: "Shift startup complete" },
  { id: "E09", machine: "FUJI NXT3-01", from: "IDLE",    to: "RUNNING", timestamp: ago(210), reason: "Preventive maint. done" },
  { id: "E10", machine: "JUKI FX-3-01", from: "IDLE",    to: "RUNNING", timestamp: ago(310), reason: "Auto-start on schedule" },
]

export const STATE_COLORS: Record<MachineState, string> = {
  RUNNING: "#10B981",
  DOWN: "#EF4444",
  IDLE: "#F59E0B",
}

export const DONUT_DATA = [
  { name: "Running", value: 10, fill: "#10B981" },
  { name: "Idle",    value: 3,  fill: "#F59E0B" },
  { name: "Down",    value: 3,  fill: "#EF4444" },
]
