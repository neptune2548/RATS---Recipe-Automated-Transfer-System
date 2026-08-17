// ═══════════════════════════════════════════════════════════════════════════
// i18n
// ═══════════════════════════════════════════════════════════════════════════
const i18n = {
  EN: {
    sys_id: "RATS-PTT-001",
    version: "v1.0",
    page_title: "RECIPE AUTOMATED TRANSFER SYSTEM",
    page_subtitle: "SECS/GEM COMMUNICATION CONTROL",
    scan_label: "MACHINE BARCODE / SERIAL",
    scan_placeholder: "Scan or type serial number...",
    scan_hint: "ENTER or scan barcode to query",
    scan_confirm: "IDENTIFY",
    scan_another: "Scan next machine...",
    clear_btn: "RELEASE",
    log_title: "SYSTEM EVENT LOG",
    live_tag: "LIVE",
    clear_log_btn: "PURGE",
    debug_title: "SYSTEM DIAGNOSTICS",
    debug_transport: "TRANSPORT",
    debug_recipe_server: "RECIPE SERVER",
    debug_gem_host: "GEM HOST",
    card_current_program: "LOADED PROGRAM",
    card_new_program: "TARGET PROGRAM",
    card_new_program_placeholder: "Scan or type program name",
    card_link: "LINK",
    card_port: "PORT",
    card_mode: "MODE",
    card_push: "PUSH",
    card_pull: "PULL / SYNC",
    card_check: "CHECK LINK",
    card_pulling: "SYNCING...",
    card_pushing: "PUSHING...",
    card_checking: "CHECKING...",
    card_status_idle: "IDLE",
    card_status_syncing: "SYNCING",
    card_status_pushing: "PUSHING",
    card_status_checking: "CHECKING",
    not_found_title: "MACHINE NOT FOUND",
    not_found_msg: "No machine registered for serial",
    machine_panel: "MACHINE CONTROL",
    awaiting_title: "AWAITING SCAN",
    awaiting_sub: "Point barcode scanner at machine label or enter serial manually",
    no_program: "— NO PROGRAM LOADED —",
    awaiting_events: "AWAITING SYSTEM EVENTS",
    loading_text: "LOADING...",
    no_recipes: "NO .PWB RECIPES FOUND",
    load_failed: "FAILED TO LOAD",
    events_label: "EVENTS",
    link_online: "ONLINE",
    link_offline: "OFFLINE",
    browse_recipes: "Browse recipes",
    modal_title: "RECIPE NOT FOUND",
    modal_msg_prefix: "The recipe",
    modal_msg_suffix: "was not found on the server.",
    modal_suggest_label: "CLOSEST AVAILABLE RECIPE",
    modal_suggest_question: "Do you want to use this program instead?",
    modal_accept: "ACCEPT",
    modal_reject: "REJECT",
    modal_no_suggestion: "No similar recipe could be found.",
    modal_dismiss: "CLOSE",
  },
  TH: {
    sys_id: "RATS-PTT-001",
    version: "v1.0",
    page_title: "RECIPE AUTOMATED TRANSFER SYSTEM",
    page_subtitle: "ระบบสื่อสาร SECS/GEM",
    scan_label: "บาร์โค้ด / ซีเรียลเครื่องจักร",
    scan_placeholder: "สแกนหรือพิมพ์หมายเลขซีเรียล...",
    scan_hint: "กด ENTER หรือสแกนบาร์โค้ด",
    scan_confirm: "ระบุเครื่อง",
    scan_another: "สแกนเครื่องถัดไป...",
    clear_btn: "ยกเลิก",
    log_title: "บันทึกเหตุการณ์ระบบ",
    live_tag: "สด",
    clear_log_btn: "ล้างบันทึก",
    debug_title: "การวินิจฉัยระบบ",
    debug_transport: "การเชื่อมต่อ",
    debug_recipe_server: "เซิร์ฟเวอร์สูตร",
    debug_gem_host: "GEM HOST",
    card_current_program: "โปรแกรมที่โหลดอยู่",
    card_new_program: "โปรแกรมเป้าหมาย",
    card_new_program_placeholder: "สแกนหรือพิมพ์ชื่อโปรแกรม",
    card_link: "สถานะลิงก์",
    card_port: "พอร์ต",
    card_mode: "โหมด",
    card_push: "ส่งสูตร",
    card_pull: "ดึงสูตร / ซิงค์",
    card_check: "ตรวจสอบลิงก์",
    card_pulling: "กำลังซิงค์...",
    card_pushing: "กำลังส่ง...",
    card_checking: "กำลังเช็ค...",
    card_status_idle: "พร้อม",
    card_status_syncing: "กำลังซิงค์",
    card_status_pushing: "กำลังส่ง",
    card_status_checking: "กำลังเช็ค",
    not_found_title: "ไม่พบเครื่องจักร",
    not_found_msg: "ไม่มีเครื่องจักรที่ลงทะเบียนด้วยซีเรียล",
    machine_panel: "ควบคุมเครื่องจักร",
    awaiting_title: "รอการสแกน",
    awaiting_sub: "ชี้สแกนเนอร์ที่ฉลากเครื่องจักร หรือพิมพ์หมายเลขซีเรียล",
    no_program: "— ไม่มีโปรแกรมที่โหลด —",
    awaiting_events: "รอเหตุการณ์ระบบ",
    loading_text: "กำลังโหลด...",
    no_recipes: "ไม่พบไฟล์สูตร .PWB",
    load_failed: "โหลดไม่สำเร็จ",
    events_label: "เหตุการณ์",
    link_online: "เชื่อมต่อแล้ว",
    link_offline: "ออฟไลน์",
    browse_recipes: "เลือกสูตร",
    modal_title: "ไม่พบสูตร",
    modal_msg_prefix: "สูตร",
    modal_msg_suffix: "ไม่พบในเซิร์ฟเวอร์",
    modal_suggest_label: "สูตรที่ใกล้เคียงที่สุด",
    modal_suggest_question: "ต้องการใช้โปรแกรมนี้แทนหรือไม่?",
    modal_accept: "ยืนยัน",
    modal_reject: "ยกเลิก",
    modal_no_suggestion: "ไม่พบสูตรที่ใกล้เคียง",
    modal_dismiss: "ปิด",
  },
};

let currentLang = "TH";

function t(key) { return i18n[currentLang][key] || key; }

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[currentLang][key]) el.textContent = i18n[currentLang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (i18n[currentLang][key]) el.placeholder = i18n[currentLang][key];
  });
  // Force full re-render for language change
  machinePanelRenderedId = null;
  renderScanArea();
  renderLeftPanel();
}

document.getElementById("langToggle").addEventListener("click", () => {
  currentLang = currentLang === "EN" ? "TH" : "EN";
  document.getElementById("langLabel").textContent = currentLang;
  applyI18n();
  renderEvents();
});

// ═══════════════════════════════════════════════════════════════════════════
// Theme Toggle (Light / Dark)
// ═══════════════════════════════════════════════════════════════════════════
function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("rats-theme", theme);

  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = theme === "dark" ? "#0b0d0f" : "#f4f6f8";
  }
}

// Initialize theme from localStorage (default: light)
(function initTheme() {
  const saved = localStorage.getItem("rats-theme") || "light";
  setTheme(saved);
})();

document.getElementById("themeToggle").addEventListener("click", () => {
  const next = getTheme() === "light" ? "dark" : "light";
  setTheme(next);
});

// ═══════════════════════════════════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════════════════════════════════
let activeMachine = null;
let newProgramValue = "";
let events = [];
let socket;
let wsConnected = false;
let wsLabel = "CONNECTING";
let connStatus = "connecting"; // "connecting" | "online" | "polling" | "error"
let pollIntervalId = null;
let scanError = null;
let diagOpen = false;
let dropdownOpen = false;
let lastLeftPanelSnapshot = "";
let lastEventsJson = "";

const scanArea = document.getElementById("scanArea");
const leftPanel = document.getElementById("leftPanel");
const eventLogEl = document.getElementById("eventLog");
const connDot = document.getElementById("connDot");
const connText = document.getElementById("connText");

// ═══════════════════════════════════════════════════════════════════════════
// Clock
// ═══════════════════════════════════════════════════════════════════════════
function updateClock() {
  const time = new Date().toLocaleTimeString("en-US", {
    hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  document.getElementById("clock").textContent = time;
  const fc = document.getElementById("footerClock");
  if (fc) fc.textContent = time;
}
updateClock();
setInterval(updateClock, 1000);

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

// Strip emoji from messages
function cleanMsg(msg) {
  return String(msg).replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]/gu, "").trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// Connection Status
// ═══════════════════════════════════════════════════════════════════════════
function setConn(status, label) {
  connStatus = status;
  wsLabel = label;

  const dotClass = {
    connecting: "bg-warn pulse-warn",
    online: "bg-ok pulse-ok",
    polling: "bg-warn pulse-warn",
    error: "bg-danger pulse-danger",
  }[status] || "bg-warn pulse-warn";

  const colorClass = {
    connecting: "text-warn",
    online: "text-ok",
    polling: "text-warn",
    error: "text-danger",
  }[status] || "text-warn";

  connDot.className = `conn-dot ${dotClass}`;
  connText.className = `conn-label ${colorClass}`;
  connText.textContent = `WS:${label}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// Scan Area Rendering
// ═══════════════════════════════════════════════════════════════════════════
function renderScanArea() {
  if (activeMachine) {
    scanArea.classList.remove("full-width");
    scanArea.innerHTML = `
      <div class="subbar-scan-active">
        <div class="scan-input" style="min-width:200px">
          <span class="prefix">&gt;_</span>
          <input id="scanInputSmall" type="text"
            data-i18n-placeholder="scan_another"
            placeholder="${escapeHtml(t('scan_another'))}"
            autocomplete="off" />
          <button id="scanConfirmBtnSmall" class="confirm-btn">GO</button>
        </div>
        <button id="clearScanBtn" class="release-btn" data-i18n="clear_btn">${escapeHtml(t('clear_btn'))}</button>
      </div>
    `;
    // Bind events
    const smallInput = document.getElementById("scanInputSmall");
    const smallBtn = document.getElementById("scanConfirmBtnSmall");
    const clearBtn = document.getElementById("clearScanBtn");

    smallInput.addEventListener("keydown", (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "Enter" && smallInput.value.trim()) {
        e.preventDefault();
        lookupMachine(smallInput.value.trim());
      }
    });
    smallBtn.addEventListener("click", () => {
      if (smallInput.value.trim()) lookupMachine(smallInput.value.trim());
    });
    clearBtn.addEventListener("click", clearScan);
  } else {
    scanArea.classList.add("full-width");
    scanArea.innerHTML = `
      <div class="scan-input" style="width:100%">
        <span class="prefix">&gt;_</span>
        <input id="scanInputMain" type="text"
          data-i18n-placeholder="scan_placeholder"
          placeholder="${escapeHtml(t('scan_placeholder'))}"
          autocomplete="off" autofocus />
        <button id="scanConfirmBtnMain" class="confirm-btn" data-i18n="scan_confirm">${escapeHtml(t('scan_confirm'))}</button>
      </div>
    `;
    // Bind events
    const mainInput = document.getElementById("scanInputMain");
    const mainBtn = document.getElementById("scanConfirmBtnMain");

    mainInput.addEventListener("keydown", (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "Enter" && mainInput.value.trim()) {
        e.preventDefault();
        lookupMachine(mainInput.value.trim());
      }
    });
    mainBtn.addEventListener("click", () => {
      if (mainInput.value.trim()) lookupMachine(mainInput.value.trim());
    });

    // Auto-focus
    setTimeout(() => mainInput.focus(), 50);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Left Panel Rendering
// ═══════════════════════════════════════════════════════════════════════════

function renderLeftPanel() {
  if (activeMachine) {
    renderMachinePanel();
  } else {
    renderAwaitingState();
  }
  renderFooterMachineInfo();
}

function renderFooterMachineInfo() {
  const el = document.getElementById("footerMachineInfo");
  if (!el) return;
  if (activeMachine) {
    el.innerHTML = `
      <span class="divider" style="color:var(--border)">|</span>
      <span class="label-xs" style="color:var(--primary)">${escapeHtml(activeMachine.id)}</span>
      <span class="divider" style="color:var(--border)">|</span>
      <span class="label-xs">${escapeHtml(activeMachine.name)}</span>
    `;
  } else {
    el.innerHTML = "";
  }
}

function renderAwaitingState() {
  let errorHtml = "";
  if (scanError) {
    errorHtml = `
      <div class="scan-error-card">
        <p class="error-title">${escapeHtml(t('not_found_title'))}</p>
        <p class="error-msg">${escapeHtml(t('not_found_msg'))}: <span class="error-serial">${escapeHtml(scanError)}</span></p>
      </div>
    `;
  }

  // Diagnostics panel
  const diagContentHtml = diagOpen ? `
    <div class="diag-content">
      <div class="diag-row">
        <span class="diag-key">${escapeHtml(t('debug_transport'))}</span>
        <span class="diag-val ${connStatus === 'online' ? 'text-ok' : 'text-warn'}">WS:${escapeHtml(wsLabel)}</span>
      </div>
      <div class="diag-row">
        <span class="diag-key">${escapeHtml(t('debug_recipe_server'))}</span>
        <span class="diag-val text-ok">ONLINE</span>
      </div>
      <div class="diag-row">
        <span class="diag-key">${escapeHtml(t('debug_gem_host'))}</span>
        <span class="diag-val text-ok">ONLINE</span>
      </div>
    </div>
  ` : "";

  leftPanel.innerHTML = `
    <div class="awaiting-state">
      <!-- Scan target graphic -->
      <div class="scan-target">
        <div class="outer">
          <div class="inner">
            <div class="dot pulse-lime"></div>
          </div>
        </div>
        <span class="corner tl"></span>
        <span class="corner tr"></span>
        <span class="corner bl"></span>
        <span class="corner br"></span>
      </div>

      <div style="text-align:center">
        <p class="await-title">${escapeHtml(t('awaiting_title'))}</p>
        <p class="await-sub">${escapeHtml(t('awaiting_sub'))}</p>
      </div>

      ${errorHtml}

      <!-- System diagnostics panel -->
      <div class="diag-panel">
        <button id="diagToggle" class="diag-toggle">
          <span class="diag-label label-sm text-muted-foreground">
            <svg style="width:14px;height:14px" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            ${escapeHtml(t('debug_title'))}
          </span>
          <svg class="chevron ${diagOpen ? 'open' : ''}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        ${diagContentHtml}
      </div>
    </div>
  `;

  // Bind diagnostics toggle
  const diagBtn = document.getElementById("diagToggle");
  if (diagBtn) {
    diagBtn.addEventListener("click", () => {
      diagOpen = !diagOpen;
      renderAwaitingState();
    });
  }
}

// Track whether the machine panel has been fully rendered at least once
let machinePanelRenderedId = null;

function renderMachinePanel() {
  const machine = activeMachine;

  // If the panel already exists for this machine, do an in-place update
  if (machinePanelRenderedId === machine.id && document.getElementById("targetProgramInput")) {
    updateMachinePanelInPlace();
    return;
  }

  // Full render (first time or machine changed)
  machinePanelRenderedId = machine.id;
  fullRenderMachinePanel();
}

// ── Surgical in-place update: only touches elements that change ──
function updateMachinePanelInPlace() {
  const machine = activeMachine;
  const isBusy = machine.status !== "IDLE";
  const loaded = machine.current_program && machine.current_program !== "None"
    ? machine.current_program : null;

  // Status pill
  const statusMap = {
    IDLE: { label: t('card_status_idle'), cls: "idle", dotPulse: "pulse-ok" },
    SYNCING: { label: t('card_status_syncing'), cls: "syncing", dotPulse: "pulse-warn" },
    PUSHING: { label: t('card_status_pushing'), cls: "pushing", dotPulse: "pulse-warn" },
    CHECKING: { label: t('card_status_checking'), cls: "checking", dotPulse: "" },
  };
  const st = statusMap[machine.status] || statusMap.IDLE;

  // Update status pill
  const pill = leftPanel.querySelector(".status-pill");
  if (pill) {
    pill.className = `status-pill ${st.cls}`;
    const dot = pill.querySelector(".dot");
    if (dot) dot.className = `dot ${st.dotPulse}`;
    // Update the text node (the label after the dot)
    const textNodes = Array.from(pill.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
    if (textNodes.length > 0) {
      textNodes[textNodes.length - 1].textContent = `\n            ${st.label}\n          `;
    }
  }

  // Update loaded program display
  const programDisplay = leftPanel.querySelector(".program-display");
  if (programDisplay) {
    programDisplay.className = `program-display ${loaded ? 'loaded' : 'empty'}`;
    programDisplay.textContent = loaded ? loaded : t('no_program');
  }

  // Update loaded program section label (for i18n)
  const programLabel = leftPanel.querySelector(".program-section .label-xs");
  if (programLabel) programLabel.textContent = t('card_current_program');

  // Update link badge
  const linkCell = leftPanel.querySelector(".telemetry-grid .data-cell:first-child .value");
  if (linkCell) {
    if (machine.link_status === "ONLINE") {
      linkCell.innerHTML = `<span class="link-online">${escapeHtml(t('link_online'))}</span>`;
    } else if (machine.link_status === "OFFLINE") {
      linkCell.innerHTML = `<span class="link-offline">${escapeHtml(t('link_offline'))}</span>`;
    } else if (machine.link_status === "CHECKING") {
      linkCell.innerHTML = '<span class="link-checking"><span class="spinner spin"></span><span>...</span></span>';
    } else {
      linkCell.innerHTML = '<span style="color:var(--muted-foreground);font-size:14px;font-family:var(--font-mono)">—</span>';
    }
  }

  // Update port value
  const portCell = leftPanel.querySelector(".telemetry-grid .data-cell:nth-child(2) .value");
  if (portCell) portCell.textContent = String(machine.port || '—');

  // Update target input disabled state (do NOT change value — user may be typing)
  const targetInput = document.getElementById("targetProgramInput");
  if (targetInput) {
    targetInput.disabled = isBusy;
  }

  // Update dropdown toggle disabled state
  const dropdownToggle = document.getElementById("recipeDropdownToggle");
  if (dropdownToggle) {
    dropdownToggle.disabled = isBusy;
  }

  // Update action buttons
  const checkBtn = document.getElementById("checkMachineBtn");
  const pullBtn = document.getElementById("pullProgramBtn");
  const pushBtn = document.getElementById("pushProgramBtn");

  const checkVariant = isBusy && machine.status === "CHECKING" ? "warn" : !isBusy ? "warn" : "ghost";
  const pullVariant = isBusy && machine.status === "SYNCING" ? "ok" : !isBusy ? "ok" : "ghost";
  const pushVariant = newProgramValue.trim() && !isBusy ? "lime" : "ghost";

  const checkLabel = isBusy && machine.status === "CHECKING" ? t('card_checking') : t('card_check');
  const pullLabel = isBusy && machine.status === "SYNCING" ? t('card_pulling') : t('card_pull');
  const pushLabel = isBusy && machine.status === "PUSHING" ? t('card_pushing') : t('card_push');

  const checkLoading = isBusy && machine.status === "CHECKING";
  const pullLoading = isBusy && machine.status === "SYNCING";
  const pushLoading = isBusy && machine.status === "PUSHING";

  if (checkBtn) {
    checkBtn.className = `cmd-btn ${checkVariant}`;
    checkBtn.disabled = isBusy;
    checkBtn.innerHTML = (checkLoading ? '<span class="btn-spinner spin"></span>' : '') + escapeHtml(checkLabel);
  }
  if (pullBtn) {
    pullBtn.className = `cmd-btn ${pullVariant}`;
    pullBtn.disabled = isBusy;
    pullBtn.innerHTML = (pullLoading ? '<span class="btn-spinner spin"></span>' : '') + escapeHtml(pullLabel);
  }
  if (pushBtn) {
    pushBtn.className = `cmd-btn ${pushVariant}`;
    pushBtn.disabled = !newProgramValue.trim() || isBusy;
    pushBtn.innerHTML = (pushLoading ? '<span class="btn-spinner spin"></span>' : '') + escapeHtml(pushLabel);
  }

  // Update faceplate header info (for i18n or machine change)
  const faceplateLabel = leftPanel.querySelector(".machine-faceplate .label-xs");
  if (faceplateLabel) faceplateLabel.textContent = `${t('machine_panel')} // ${machine.id}`;
  const nameEl = leftPanel.querySelector(".machine-faceplate .name");
  if (nameEl) nameEl.textContent = machine.name;
  const addrEl = leftPanel.querySelector(".machine-faceplate .addr");
  if (addrEl) addrEl.textContent = `${machine.ip || '—'}:${String(machine.port || '—')}`;
}

// ── Full innerHTML render (first time only or when machine changes) ──
function fullRenderMachinePanel() {
  const machine = activeMachine;
  const isBusy = machine.status !== "IDLE";
  const loaded = machine.current_program && machine.current_program !== "None"
    ? machine.current_program : null;

  // Status pill
  const statusMap = {
    IDLE: { label: t('card_status_idle'), cls: "idle", dotPulse: "pulse-ok" },
    SYNCING: { label: t('card_status_syncing'), cls: "syncing", dotPulse: "pulse-warn" },
    PUSHING: { label: t('card_status_pushing'), cls: "pushing", dotPulse: "pulse-warn" },
    CHECKING: { label: t('card_status_checking'), cls: "checking", dotPulse: "" },
  };
  const st = statusMap[machine.status] || statusMap.IDLE;

  // Link badge
  let linkHtml = '<span style="color:var(--muted-foreground);font-size:14px;font-family:var(--font-mono)">—</span>';
  if (machine.link_status === "ONLINE") {
    linkHtml = `<span class="link-online">${escapeHtml(t('link_online'))}</span>`;
  } else if (machine.link_status === "OFFLINE") {
    linkHtml = `<span class="link-offline">${escapeHtml(t('link_offline'))}</span>`;
  } else if (machine.link_status === "CHECKING") {
    linkHtml = '<span class="link-checking"><span class="spinner spin"></span><span>...</span></span>';
  }

  // Button variants
  const checkVariant = isBusy && machine.status === "CHECKING" ? "warn" : !isBusy ? "warn" : "ghost";
  const pullVariant = isBusy && machine.status === "SYNCING" ? "ok" : !isBusy ? "ok" : "ghost";
  const pushVariant = newProgramValue.trim() && !isBusy ? "lime" : "ghost";

  const checkLabel = isBusy && machine.status === "CHECKING" ? t('card_checking') : t('card_check');
  const pullLabel = isBusy && machine.status === "SYNCING" ? t('card_pulling') : t('card_pull');
  const pushLabel = isBusy && machine.status === "PUSHING" ? t('card_pushing') : t('card_push');

  const checkLoading = isBusy && machine.status === "CHECKING";
  const pullLoading = isBusy && machine.status === "SYNCING";
  const pushLoading = isBusy && machine.status === "PUSHING";

  leftPanel.innerHTML = `
    <div class="machine-panel">
      <!-- Faceplate header -->
      <div class="machine-faceplate">
        <div class="accent-bar"></div>
        <div class="info">
          <div>
            <p class="label-xs" style="margin-bottom:4px">${escapeHtml(t('machine_panel'))} // ${escapeHtml(machine.id)}</p>
            <h2 class="name">${escapeHtml(machine.name)}</h2>
            <p class="addr">${escapeHtml(machine.ip || '—')}:${escapeHtml(String(machine.port || '—'))}</p>
          </div>
          <span class="status-pill ${st.cls}">
            <span class="dot ${st.dotPulse}"></span>
            ${st.label}
          </span>
        </div>
      </div>

      <!-- Body -->
      <div class="machine-body">

        <!-- Loaded program -->
        <div class="program-section">
          <p class="label-xs" style="margin-bottom:8px">${escapeHtml(t('card_current_program'))}</p>
          <div class="program-display ${loaded ? 'loaded' : 'empty'}">
            ${loaded ? escapeHtml(loaded) : escapeHtml(t('no_program'))}
          </div>
        </div>

        <!-- Target program -->
        <div class="target-section">
          <label class="label-xs" style="margin-bottom:8px;display:block">${escapeHtml(t('card_new_program'))}</label>
          <div class="target-input-wrapper">
            <div class="target-input-row">
              <span class="input-prefix">&gt;</span>
              <input id="targetProgramInput" type="text"
                list="recipe-datalist"
                value="${escapeHtml(newProgramValue)}"
                placeholder="${escapeHtml(t('card_new_program_placeholder'))}"
                autocomplete="off"
                ${isBusy ? 'disabled' : ''} />
            </div>
            <datalist id="recipe-datalist"></datalist>
          </div>
        </div>

        <!-- Telemetry grid -->
        <div class="telemetry-grid">
          <div class="data-cell">
            <span class="label-xs">${escapeHtml(t('card_link'))}</span>
            <div class="value">${linkHtml}</div>
          </div>
          <div class="data-cell">
            <span class="label-xs">${escapeHtml(t('card_port'))}</span>
            <div class="value" style="color:var(--foreground)">${escapeHtml(String(machine.port || '—'))}</div>
          </div>
          <div class="data-cell">
            <span class="label-xs">${escapeHtml(t('card_mode'))}</span>
            <div class="value" style="color:var(--primary)">AUTO</div>
          </div>
        </div>

      </div>

      <!-- Action strip -->
      <div class="action-strip">
        <button id="checkMachineBtn" class="cmd-btn ${checkVariant}" ${isBusy ? 'disabled' : ''}>
          ${checkLoading ? '<span class="btn-spinner spin"></span>' : ''}${escapeHtml(checkLabel)}
        </button>
        <button id="pullProgramBtn" class="cmd-btn ${pullVariant}" ${isBusy ? 'disabled' : ''}>
          ${pullLoading ? '<span class="btn-spinner spin"></span>' : ''}${escapeHtml(pullLabel)}
        </button>
        <button id="pushProgramBtn" class="cmd-btn ${pushVariant}" ${!newProgramValue.trim() || isBusy ? 'disabled' : ''}>
          ${pushLoading ? '<span class="btn-spinner spin"></span>' : ''}${escapeHtml(pushLabel)}
        </button>
      </div>
    </div>
  `;

  // ── Bind machine panel events ──
  bindMachinePanelEvents();
  
  // Populate datalist automatically
  fetchMachineRecipesForDatalist(machine.id);
}

// ── Bind all interactive event handlers for the machine panel ──
function bindMachinePanelEvents() {
  const machine = activeMachine;
  const isBusy = machine.status !== "IDLE";

  // Target program input
  const targetInput = document.getElementById("targetProgramInput");
  const pushBtn = document.getElementById("pushProgramBtn");
  const pullBtn = document.getElementById("pullProgramBtn");
  const checkBtn = document.getElementById("checkMachineBtn");

  if (targetInput) {
    targetInput.addEventListener("input", () => {
      newProgramValue = targetInput.value;
      refreshPushButton();
    });
    targetInput.addEventListener("keydown", (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "Enter" && targetInput.value.trim()) {
        e.preventDefault();
        pushProgram(machine.id, targetInput.value.trim());
      }
    });
  }

  // Push button refresh
  function refreshPushButton() {
    const hasProgram = newProgramValue.trim().length > 0 && !isBusy;
    pushBtn.disabled = !hasProgram;
    pushBtn.className = `cmd-btn ${hasProgram ? 'lime' : 'ghost'}`;
  }

  if (pushBtn) {
    pushBtn.addEventListener("click", () => {
      if (newProgramValue.trim()) pushProgram(machine.id, newProgramValue.trim());
    });
  }
  if (pullBtn) {
    pullBtn.addEventListener("click", () => pullProgram(machine.id));
  }
  if (checkBtn) {
    checkBtn.addEventListener("click", () => checkMachine(machine.id));
  }
}

// ── Fetch recipes for datalist ──
async function fetchMachineRecipesForDatalist(machineId) {
  const datalist = document.getElementById("recipe-datalist");
  if (!datalist) return;
  try {
    const res = await fetch(`/api/machines/${encodeURIComponent(machineId)}/recipes`);
    const data = await res.json();
    const recipes = data.recipes || [];
    datalist.innerHTML = "";
    recipes.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      datalist.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to fetch recipes for datalist:", err);
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// Terminal Event Log Rendering
// ═══════════════════════════════════════════════════════════════════════════

function renderEvents() {
  const evJson = JSON.stringify(events) + currentLang;
  if (evJson === lastEventsJson) return;
  lastEventsJson = evJson;

  // Update footer event count
  const fc = document.getElementById("footerEventCount");
  if (fc) fc.textContent = `${events.length} ${t('events_label')}`;

  let html = '';

  // Column header
  html += `
    <div class="terminal-col-header">
      <span class="col-num">#</span>
      <span class="col-time">TIME</span>
      <span class="col-level">LEVEL</span>
      <span>MESSAGE</span>
    </div>
  `;

  if (events.length === 0) {
    html += `
      <div class="terminal-empty">
        <span style="color:var(--primary)" class="blink">_</span>
        <span>${escapeHtml(t('awaiting_events'))}</span>
      </div>
    `;
  } else {
    events.forEach((ev, i) => {
      const ts = ev.timestamp
        ? new Date(ev.timestamp).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
        : new Date().toLocaleTimeString("en-US", { hour12: false });

      const colorMap = {
        ALERT: "#f43f5e",
        SUCCESS: "#4ade80",
        WARN: "#fbbf24",
        INFO: "#5a6270",
      };
      const color = colorMap[ev.level] || "#5a6270";

      const prefixMap = {
        ALERT: "ERR ",
        SUCCESS: "OK  ",
        WARN: "WARN",
        INFO: "INFO",
      };
      const prefix = prefixMap[ev.level] || "INFO";

      const lineNum = String(i + 1).padStart(3, " ");
      const msgData = ev.message;
      let msgStr = typeof msgData === "object" && msgData !== null
        ? (msgData[currentLang] || msgData.EN || "")
        : String(msgData);
      const msg = cleanMsg(msgStr);

      html += `
        <div class="terminal-line">
          <span class="line-num">${lineNum}</span>
          <span class="line-time">${escapeHtml(ts)}</span>
          <span class="line-level" style="color:${color}">[${prefix}]</span>
          <span class="line-msg">${escapeHtml(msg)}</span>
        </div>
      `;
    });
  }

  // Blinking cursor at end
  html += `
    <div class="terminal-cursor">
      <span class="blink">_</span>
    </div>
  `;

  eventLogEl.innerHTML = html;
  eventLogEl.scrollTop = eventLogEl.scrollHeight;
}

// ═══════════════════════════════════════════════════════════════════════════
// UI State Transitions
// ═══════════════════════════════════════════════════════════════════════════

function clearScan() {
  activeMachine = null;
  newProgramValue = "";
  scanError = null;
  diagOpen = false;
  dropdownOpen = false;
  lastLeftPanelSnapshot = "";
  machinePanelRenderedId = null;
  renderScanArea();
  renderLeftPanel();
  setTimeout(() => {
    const mainInput = document.getElementById("scanInputMain");
    if (mainInput) mainInput.focus();
  }, 50);
}

function showMachineMode(machine) {
  activeMachine = machine;
  newProgramValue = "";
  scanError = null;
  dropdownOpen = false;
  lastLeftPanelSnapshot = "";
  machinePanelRenderedId = null;
  renderScanArea();
  renderLeftPanel();
}

// ═══════════════════════════════════════════════════════════════════════════
// API Calls
// ═══════════════════════════════════════════════════════════════════════════

async function lookupMachine(serial) {
  const trimmed = serial.trim();
  if (!trimmed) return;
  scanError = null;

  try {
    const res = await fetch(`/api/lookup/${encodeURIComponent(trimmed)}`);
    const data = await res.json();
    if (res.ok) {
      events = data.events || [];
      showMachineMode(data.machine);
      renderEvents();
    } else {
      events = data.events || events;
      scanError = trimmed;
      activeMachine = null;
      renderScanArea();
      renderLeftPanel();
      renderEvents();
    }
  } catch (err) {
    console.error("Lookup failed:", err);
  }
}

async function checkMachine(machineId) {
  if (!activeMachine) return;
  activeMachine.status = "CHECKING";
  renderMachinePanel();

  try {
    const res = await fetch(`/api/machines/${encodeURIComponent(machineId)}/check`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      activeMachine = data.machine;
      events = data.events || [];
      renderMachinePanel();
      renderEvents();
    } else {
      activeMachine.status = "IDLE";
      renderMachinePanel();
    }
  } catch (err) {
    console.error("Check failed:", err);
    activeMachine.status = "IDLE";
    renderMachinePanel();
  }
}

async function pullProgram(machineId) {
  if (!activeMachine) return;
  activeMachine.status = "SYNCING";
  renderMachinePanel();

  try {
    const res = await fetch(`/api/machines/${encodeURIComponent(machineId)}/pull`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      activeMachine = data.machine;
      events = data.events || [];
      renderMachinePanel();
      renderEvents();
    } else {
      activeMachine.status = "IDLE";
      renderMachinePanel();
    }
  } catch (err) {
    console.error("Pull failed:", err);
    activeMachine.status = "IDLE";
    renderMachinePanel();
  }
}

// ── Suggestion Modal ─────────────────────────────────────────────────────

function showSuggestionModal(requestedName, suggestedName, machineId) {
  // Remove any existing modal
  closeSuggestionModal();

  const hasSuggestion = !!suggestedName;

  const suggestionHtml = hasSuggestion ? `
    <div class="suggestion-card">
      <div class="suggestion-arrow">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      <div class="suggestion-info">
        <p class="suggestion-label">${escapeHtml(t('modal_suggest_label'))}</p>
        <p class="suggestion-name">${escapeHtml(suggestedName)}</p>
      </div>
    </div>
    <p class="modal-msg" style="margin-top:0">${escapeHtml(t('modal_suggest_question'))}</p>
  ` : `
    <div class="no-suggestion">${escapeHtml(t('modal_no_suggestion'))}</div>
  `;

  const actionsHtml = hasSuggestion ? `
    <div class="modal-actions">
      <button id="modalAcceptBtn" class="modal-btn accept">${escapeHtml(t('modal_accept'))}</button>
      <button id="modalRejectBtn" class="modal-btn reject">${escapeHtml(t('modal_reject'))}</button>
    </div>
  ` : `
    <div class="modal-actions">
      <button id="modalDismissBtn" class="modal-btn dismiss">${escapeHtml(t('modal_dismiss'))}</button>
    </div>
  `;

  const overlay = document.createElement('div');
  overlay.id = 'suggestionModal';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="suggestion-modal">
      <div class="modal-header">
        <div class="modal-icon">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
        </div>
        <span class="modal-title">${escapeHtml(t('modal_title'))}</span>
      </div>
      <div class="modal-body">
        <p class="modal-msg">
          ${escapeHtml(t('modal_msg_prefix'))}
          <span class="recipe-name">${escapeHtml(requestedName)}</span>
          ${escapeHtml(t('modal_msg_suffix'))}
        </p>
        ${suggestionHtml}
      </div>
      ${actionsHtml}
    </div>
  `;

  document.body.appendChild(overlay);

  // Bind buttons
  if (hasSuggestion) {
    document.getElementById('modalAcceptBtn').addEventListener('click', () => {
      closeSuggestionModal();
      // Update the input with the suggested name and execute the push
      const input = document.getElementById('targetProgramInput');
      if (input) {
        input.value = suggestedName;
        newProgramValue = suggestedName;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      executePush(machineId, suggestedName);
    });
    document.getElementById('modalRejectBtn').addEventListener('click', () => {
      closeSuggestionModal();
    });
  } else {
    document.getElementById('modalDismissBtn').addEventListener('click', () => {
      closeSuggestionModal();
    });
  }

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSuggestionModal();
  });
}

function closeSuggestionModal() {
  const existing = document.getElementById('suggestionModal');
  if (existing) existing.remove();
}

// ── Push flow: check → suggest → push ────────────────────────────────────

async function pushProgram(machineId, programName) {
  if (!activeMachine || !programName) return;

  // Step 1: Check if recipe exists on server
  try {
    const checkRes = await fetch('/api/recipes/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe_name: programName }),
    });
    const checkData = await checkRes.json();

    if (checkData.exact_match) {
      // Exact match found → push directly
      executePush(machineId, programName);
    } else {
      // No exact match → show suggestion modal
      showSuggestionModal(programName, checkData.suggestion, machineId);
    }
  } catch (err) {
    console.error('Recipe check failed:', err);
    alert("Network error: Could not verify recipe with the server.");
  }
}

async function executePush(machineId, programName) {
  if (!activeMachine) return;
  activeMachine.status = "PUSHING";
  renderMachinePanel();

  try {
    const res = await fetch(`/api/machines/${encodeURIComponent(machineId)}/push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program_name: programName }),
    });
    const data = await res.json();
    if (res.ok) {
      activeMachine = data.machine;
      newProgramValue = "";
      events = data.events || [];
      renderMachinePanel();
      renderEvents();
    } else {
      activeMachine.status = "IDLE";
      renderMachinePanel();
    }
  } catch (err) {
    console.error("Push failed:", err);
    activeMachine.status = "IDLE";
    renderMachinePanel();
  }
}

async function fetchStatus() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();
    events = data.events || [];
    renderEvents();
    if (activeMachine) {
      const updated = data.machines.find(m => m.id === activeMachine.id);
      if (updated) {
        activeMachine = updated;
        renderMachinePanel();
      }
    }
  } catch (err) {
    console.error("Status fetch failed:", err);
  }
}

// Clear log
const clearLogBtn = document.getElementById("clearLogBtn");
if (clearLogBtn) {
  clearLogBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/logs/clear", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        events = data.events || [];
        lastEventsJson = "";
        renderEvents();
      }
    } catch (err) {
      console.error("Failed to clear log:", err);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// WebSocket
// ═══════════════════════════════════════════════════════════════════════════

function startPolling() {
  stopPolling();
  pollIntervalId = setInterval(fetchStatus, 10000);
}

function stopPolling() {
  if (pollIntervalId) {
    clearInterval(pollIntervalId);
    pollIntervalId = null;
  }
}

function connectWS() {
  const scheme = location.protocol === "https:" ? "wss" : "ws";
  socket = new WebSocket(`${scheme}://${location.host}/ws`);

  socket.addEventListener("open", () => {
    setConn("online", "ONLINE");
    wsConnected = true;
    stopPolling();
  });

  socket.addEventListener("message", (e) => {
    const data = JSON.parse(e.data);
    events = data.events || [];
    renderEvents();
    if (activeMachine) {
      const updated = data.machines.find(m => m.id === activeMachine.id);
      if (updated) {
        activeMachine = updated;
        renderMachinePanel();
      }
    }
  });

  socket.addEventListener("close", () => {
    setConn("polling", "POLLING");
    wsConnected = false;
    startPolling();
    setTimeout(connectWS, 2000);
  });

  socket.addEventListener("error", () => {
    setConn("error", "ERROR");
    socket.close();
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Init
// ═══════════════════════════════════════════════════════════════════════════
applyI18n();
renderScanArea();
renderLeftPanel();
renderEvents();
connectWS();
fetchStatus();
startPolling();
