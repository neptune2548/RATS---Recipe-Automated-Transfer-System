// Data fetched from backend
const STATE_COLORS = {
  RUNNING: "#10B981",
  DOWN: "#EF4444",
  IDLE: "#F59E0B",
  OFFLINE: "#6b7280"
};

let MACHINES = [];
let EVENT_LOG = [];

// Keep static shift and donut data for now since backend doesn't provide them dynamically yet
const SHIFT_DATA = [
  { name: "06:00", running: 70, idle: 20, down: 10 },
  { name: "07:00", running: 75, idle: 15, down: 10 },
  { name: "08:00", running: 80, idle: 12, down: 8  },
  { name: "09:00", running: 85, idle: 8,  down: 7  },
  { name: "10:00", running: 78, idle: 14, down: 8  },
  { name: "11:00", running: 82, idle: 10, down: 8  },
  { name: "12:00", running: 76, idle: 16, down: 8  },
  { name: "13:00", running: 84, idle: 9,  down: 7  },
];

const DONUT_DATA = [
  { name: "Running", value: 10, fill: "#10B981" },
  { name: "Idle",    value: 3,  fill: "#F59E0B" },
  { name: "Down",    value: 3,  fill: "#EF4444" },
];

let currentFilter = "ALL";
let chartInstances = {};

// App Logic

function updateClock() {
  const now = new Date();
  
  document.getElementById('clock-date').textContent = now.toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "2-digit"
  }) + " ";
  
  document.getElementById('clock-time').textContent = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
}

async function fetchData() {
  try {
    const [machinesRes, eventsRes] = await Promise.all([
      fetch('/api/mems/machines'),
      fetch('/api/mems/events')
    ]);

    if (machinesRes.ok) {
      MACHINES = await machinesRes.json();
    }
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      // parse timestamps
      EVENT_LOG = events.map(e => ({
        ...e,
        timestamp: new Date(e.timestamp + "Z") // append Z to treat as UTC
      }));
    }

    renderAll();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

function renderAll() {
  renderHeaderStats();
  renderKPIBar();
  renderMachineGrid(currentFilter);
  renderCharts();
  renderEventLog();
}

function renderHeaderStats() {
  if (!MACHINES.length) return;
  const total = MACHINES.length;
  const running = MACHINES.filter((m) => m.state === "RUNNING").length;
  const down = MACHINES.filter((m) => m.state === "DOWN").length;
  const idle = MACHINES.filter((m) => m.state === "IDLE").length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-running').textContent = running;
  document.getElementById('stat-idle').textContent = idle;
  document.getElementById('stat-down').textContent = down;
}

function renderKPIBar() {
  if (!MACHINES.length) return;
  const running = MACHINES.filter((m) => m.state === "RUNNING");
  const avgOEE = running.length ? Math.round(running.reduce((s, m) => s + m.oee, 0) / running.length) : 0;
  const totalOutput = MACHINES.reduce((s, m) => s + m.output, 0);
  const downCount = MACHINES.filter((m) => m.state === "DOWN").length;
  const utilization = Math.round((running.length / MACHINES.length) * 100);

  const kpis = [
    { label: "AVG OEE", value: `${avgOEE}%`, sub: "Running machines", icon: "trending-up", color: "#10B981" },
    { label: "TOTAL OUTPUT", value: totalOutput.toLocaleString(), sub: "Units this shift", icon: "package", color: "#3b82f6" },
    { label: "MACHINE DOWN", value: `${downCount}`, sub: `of ${MACHINES.length} total`, icon: "alert-triangle", color: "#EF4444" },
    { label: "UTILIZATION", value: `${utilization}%`, sub: `${running.length} active lines`, icon: "gauge", color: "#F59E0B" },
  ];

  const container = document.getElementById('kpi-bar');
  container.innerHTML = kpis.map(kpi => `
    <div class="flex items-center gap-4 rounded-xl border border-[#2a2f3e] bg-[#161b27] px-5 py-4" style="border-left-color: ${kpi.color}; border-left-width: 3px;">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style="background-color: ${kpi.color}18; color: ${kpi.color}">
        <i data-lucide="${kpi.icon}" class="h-5 w-5"></i>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-wider text-[#6b7280]">${kpi.label}</p>
        <p class="font-mono text-2xl font-bold" style="color: ${kpi.color}">${kpi.value}</p>
        <p class="font-mono text-xs text-[#4b5563]">${kpi.sub}</p>
      </div>
    </div>
  `).join('');
  
  // Update dynamic Donut Data based on actual states
  DONUT_DATA[0].value = running.length;
  DONUT_DATA[1].value = MACHINES.filter(m => m.state === "IDLE").length;
  DONUT_DATA[2].value = downCount;
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function getStateIcon(state) {
  if (state === 'RUNNING') return 'check-circle-2';
  if (state === 'DOWN') return 'x-circle';
  if (state === 'IDLE') return 'minus-circle';
  return 'circle';
}

function renderMachineGrid(filter = "ALL") {
  const container = document.getElementById('machine-grid');
  const filtered = filter === "ALL" ? MACHINES : MACHINES.filter((m) => m.state === filter);

  container.innerHTML = filtered.map(machine => {
    const color = STATE_COLORS[machine.state] || STATE_COLORS.OFFLINE;
    const isRunning = machine.state === "RUNNING";
    
    return `
      <div class="rounded-xl border border-[#2a2f3e] bg-[#161b27] p-4 transition-all duration-300 hover:scale-[1.02] glow-${machine.state}">
        <!-- Card Header -->
        <div class="mb-3 flex items-start justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="cpu" class="h-4 w-4 text-[#4b5563]"></i>
            <div>
              <p class="font-mono text-sm font-bold text-white">${machine.name}</p>
              <p class="font-mono text-xs text-[#4b5563]">${machine.line}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 rounded-md px-2 py-1" style="background-color: ${color}18">
            <i data-lucide="${getStateIcon(machine.state)}" class="h-4 w-4" style="color: ${color}"></i>
            <span class="font-mono text-xs font-bold" style="color: ${color}">${machine.state}</span>
          </div>
        </div>

        <!-- State duration bar -->
        <div class="mb-3">
          <div class="mb-1 flex justify-between">
            <span class="font-mono text-xs text-[#6b7280]">IN STATE</span>
            <span class="font-mono text-xs font-bold" style="color: ${color}">${formatDuration(machine.stateSince)}</span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#1e2538]">
            <div class="h-full rounded-full transition-all" style="width: ${Math.min((machine.stateSince / 480) * 100, 100)}%; background-color: ${color}"></div>
          </div>
        </div>

        <!-- Metrics -->
        <div class="grid grid-cols-3 gap-2">
          <div class="rounded-md bg-[#0d1117] px-2 py-1.5 text-center">
            <div class="mb-0.5 flex items-center justify-center gap-1 text-[#4b5563]">
              <i data-lucide="trending-up" class="h-3 w-3"></i>
              <span class="font-mono text-[10px]">OEE</span>
            </div>
            <p class="font-mono text-sm font-bold" style="color: ${isRunning ? color : '#6b7280'}">${isRunning ? machine.oee + '%' : '—'}</p>
          </div>
          <div class="rounded-md bg-[#0d1117] px-2 py-1.5 text-center">
            <div class="mb-0.5 flex items-center justify-center gap-1 text-[#4b5563]">
              <i data-lucide="timer" class="h-3 w-3"></i>
              <span class="font-mono text-[10px]">CYCLE</span>
            </div>
            <p class="font-mono text-sm font-bold" style="color: ${isRunning ? color : '#6b7280'}">${isRunning ? machine.cycleTime + 's' : '—'}</p>
          </div>
          <div class="rounded-md bg-[#0d1117] px-2 py-1.5 text-center">
            <div class="mb-0.5 flex items-center justify-center gap-1 text-[#4b5563]">
              <i data-lucide="package" class="h-3 w-3"></i>
              <span class="font-mono text-[10px]">OUTPUT</span>
            </div>
            <p class="font-mono text-sm font-bold" style="color: ${color}">${machine.output.toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons(); // Re-render icons for new HTML
}

function setupFilters() {
  const buttons = document.querySelectorAll('#machine-filters button');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentFilter = e.target.dataset.filter;
      
      // Update active state
      buttons.forEach(b => {
        b.style.borderColor = "#2a2f3e";
        b.style.color = "#6b7280";
        b.style.backgroundColor = "transparent";
      });

      const color = currentFilter === "ALL" ? "#94a3b8" : STATE_COLORS[currentFilter];
      e.target.style.borderColor = color;
      e.target.style.color = color;
      e.target.style.backgroundColor = `${color}18`;

      renderMachineGrid(currentFilter);
    });
  });

  // Init first button
  const allBtn = document.querySelector('#machine-filters button[data-filter="ALL"]');
  allBtn.style.borderColor = "#94a3b8";
  allBtn.style.color = "#94a3b8";
  allBtn.style.backgroundColor = "#94a3b818";
}

function renderCharts() {
  Chart.defaults.color = '#6b7280';
  Chart.defaults.font.family = 'monospace';

  // Donut Chart
  const total = DONUT_DATA.reduce((s, d) => s + d.value, 0);
  const runningPct = total > 0 ? Math.round((DONUT_DATA[0].value / total) * 100) : 0;
  document.getElementById('utilization-pct').textContent = runningPct + '%';

  const ctxDonut = document.getElementById('donutChart').getContext('2d');
  
  if (chartInstances.donut) {
    chartInstances.donut.data.datasets[0].data = DONUT_DATA.map(d => d.value);
    chartInstances.donut.update();
  } else {
    chartInstances.donut = new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: DONUT_DATA.map(d => d.name),
        datasets: [{
          data: DONUT_DATA.map(d => d.value),
          backgroundColor: DONUT_DATA.map(d => d.fill),
          borderWidth: 2,
          borderColor: '#0d1117'
        }]
      },
      options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#161b27',
            borderColor: '#2a2f3e',
            borderWidth: 1,
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            callbacks: {
              label: (context) => ` ${context.raw} machines`
            }
          }
        }
      }
    });
  }

  // Bar Chart (Static for now)
  const ctxBar = document.getElementById('barChart').getContext('2d');
  if (!chartInstances.bar) {
    chartInstances.bar = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: SHIFT_DATA.map(d => d.name),
        datasets: [
          { label: 'RUNNING', data: SHIFT_DATA.map(d => d.running), backgroundColor: STATE_COLORS.RUNNING },
          { label: 'IDLE', data: SHIFT_DATA.map(d => d.idle), backgroundColor: STATE_COLORS.IDLE },
          { label: 'DOWN', data: SHIFT_DATA.map(d => d.down), backgroundColor: STATE_COLORS.DOWN, borderRadius: {topLeft: 4, topRight: 4} }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { display: false }, border: { color: '#2a2f3e' } },
          y: { stacked: true, grid: { color: '#1e2538', drawBorder: false }, border: { display: false }, max: 100, ticks: { callback: (value) => value + '%' } }
        },
        plugins: {
          legend: { labels: { boxWidth: 12, usePointStyle: true, pointStyle: 'rectRounded' } },
          tooltip: { mode: 'index', backgroundColor: '#161b27', borderColor: '#2a2f3e', borderWidth: 1 }
        }
      }
    });
  }
}

function getRelative(date) {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

function renderEventLog() {
  document.getElementById('event-count').textContent = EVENT_LOG.length + ' entries';
  const container = document.getElementById('event-log-container');

  if (EVENT_LOG.length === 0) {
    container.innerHTML = `<p class="text-xs text-[#6b7280] text-center mt-4">No recent events.</p>`;
    return;
  }

  container.innerHTML = EVENT_LOG.map(evt => {
    const toColor = STATE_COLORS[evt.to] || STATE_COLORS.OFFLINE;
    const fromColor = STATE_COLORS[evt.from] || STATE_COLORS.OFFLINE;
    
    return `
      <div class="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-x-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#1e2538]" style="border-left: 2px solid ${toColor}">
        <!-- Machine name -->
        <span class="truncate font-mono text-xs font-semibold text-[#e2e8f0]">${evt.machine}</span>
        
        <!-- From state -->
        <span class="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold" style="color: ${fromColor}; background-color: ${fromColor}18">${evt.from}</span>
        
        <!-- Arrow -->
        <i data-lucide="arrow-right" class="h-3 w-3 text-[#4b5563]"></i>
        
        <!-- To state -->
        <span class="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold" style="color: ${toColor}; background-color: ${toColor}18">${evt.to}</span>
        
        <!-- Reason + time -->
        <div class="min-w-0">
          <p class="truncate font-mono text-xs text-[#94a3b8]">${evt.reason}</p>
          <p class="font-mono text-[10px] text-[#4b5563]">
            ${evt.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })} 
            <span class="text-[#374151]">&middot; ${getRelative(evt.timestamp)}</span>
          </p>
        </div>
      </div>
    `;
  }).join('');
  lucide.createIcons();
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupFilters();
  updateClock();
  
  // Initial fetch and render
  fetchData();
  
  // Loop fetch every 3 seconds
  setInterval(fetchData, 3000);
  setInterval(updateClock, 1000);
});
