# ARC Command Center V0.2
## Recipe Automation & Transfer System (RATS) — Industrial Command Center

> **Full-stack industrial control platform for SECS/GEM recipe push, pull, and machine management.**
> Built on Python (FastAPI) + React (Vite) with role-based authorization.

---

## What's New in V0.2

### Major Changes from V0.1

| Feature | V0.1 | V0.2 |
|---|---|---|
| Architecture | Single-page Flask app | Full-stack microservices monorepo |
| Frontend | Vanilla JS / HTML | React + Vite + TailwindCSS |
| Auth system | None | Role-based auth with session timeout |
| Dashboard | Single RATS view | RATS System + System Status |
| Backend | Single main.py | Modular arc-system/server + client-rats |
| SECS/GEM engine | Inline | Dedicated Section Manager (12 machines) |
| Theme | Light only | Dark / Light mode toggle |
| Language | Thai / English mix | Switchable TH / EN via Language toggle |

### New Features in V0.2

- **Role-Based Authorization System**
  - Guest, Operator, Technician, Administrator roles
  - Passcode login (1111 / 2222 / 3333) and username/password login
  - 5-minute inactivity auto-logout with session persistence via localStorage
  - Logoff confirmation dialog

- **RATS-Only Dashboard** (as of v0.2.1)
  - MEMS telemetry panel removed from UI - RATS is the primary interface
  - Guests see a clear Authorization Required prompt before accessing RATS
  - Role-gated actions: Technician+ can push recipes, Administrator+ has full control

- **System Status View**
  - Live status indicators for all backend microservices
  - Shows RATS engine, Section Manager, and server connectivity

- **ARC Command Center Shell** (client-shell)
  - Unified React SPA that wraps all sub-systems
  - Sticky industrial navbar with branding, nav tabs, role badge, theme & language toggle
  - Dark mode glassmorphism design with Tailwind

- **Section Manager**
  - Supervises SECS/GEM connections to 12 machines
  - Each machine runs in its own managed process

---

## Architecture Overview

```
master-recipe-command-centerV0.2/
+-  arc-system/
|   +-  client-shell/        # React (Vite) SPA - main UI shell
|   |   +-  src/
|   |       +-  context/     # AuthContext, ThemeContext, LanguageContext
|   |       +-  components/  # Navbar, AuthModal
|   |       +-  views/       # RatsView, SystemView
|   +-  client-rats/         # Python FastAPI - RATS SECS/GEM engine (Port 8080)
|   +-  client-mems/         # Python FastAPI - MEMS telemetry engine (Port 8000)
|   +-  section-manager/     # SECS/GEM connection supervisor (12 machines)
|   +-  server/              # Node.js API gateway / auth server
+-  sandbox/                 # Development scratch (git-ignored)
+-  scripts/                 # Utility scripts
+-  start_command_center.bat # One-click full-stack launcher
+-  stop_command_center.bat  # Graceful shutdown script
```

---

## How to Use

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |

Install Python dependencies (RATS engine):
```
cd arc-system/client-rats
pip install -r requirement.txt
```

Install React dependencies (UI shell):
```
cd arc-system/client-shell
npm install
```

---

### Starting the System

**Option 1 - One-click launcher (recommended):**
```
Double-click: start_command_center.bat
```
This starts all services in order:
1. RATS SECS/GEM Engine         Port 8080
2. MEMS Telemetry Engine         Port 8000
3. Section Manager (12 machine SECS/GEM connections)
4. React UI dev server           Port 3000 (opens browser automatically)

**Option 2 - Manual start:**
```
Terminal 1 - RATS backend
cd arc-system/client-rats && python main.py

Terminal 2 - React UI
cd arc-system/client-shell && npm run dev
```

---

### Authentication

Open http://localhost:3000 in your browser.

Since RATS requires authorization, you will see a login prompt:

| Role | Passcode | Permissions |
|---|---|---|
| Guest | (no login) | View auth prompt only |
| Operator | 1111 | View RATS dashboard |
| Technician | 2222 | View + Push recipes |
| Administrator | 3333 | Full control (push, config, system) |

Sessions auto-expire after 5 minutes of inactivity and are saved across page refreshes.

---

### Stopping the System

```
Double-click: stop_command_center.bat
```
Or press Ctrl+C in the React dev server window.

---

## Roles & Permissions

```
GUEST         ->  Login prompt only
OPERATOR      ->  View RATS dashboard & recipe status
TECHNICIAN    ->  OPERATOR + push/pull recipes & machine config
ADMINISTRATOR ->  TECHNICIAN + full system admin (system status, all configs)
```

---

## Changelog

### V0.2.1 - 2026-08-17
- Removed MEMS dashboard from navigation - RATS is now the sole primary interface
- Added GuestAuthPrompt inline component - guests see auth gate instead of a blank page
- RATS tab always visible in navbar; auth enforced at the view level
- Logoff now keeps user on RATS tab (shows auth prompt instead of redirecting to MEMS)
- Footer and subtitle updated to reflect RATS-only focus
- Added comprehensive .gitignore (covers Python, Node, OS, secrets)
- Initialized git repository

### V0.2.0 - Initial release
- Full-stack microservices rewrite from V0.1 single-page Flask app
- React + Vite + TailwindCSS frontend shell
- Role-based authorization (Guest / Operator / Technician / Administrator)
- 5-minute inactivity auto-logout
- Dark / Light mode + TH / EN language switcher
- SECS/GEM Section Manager for 12 machines

---

## License

Internal use only - Stars Microelectronics (Thailand) PCL
ARC Engineering Team
