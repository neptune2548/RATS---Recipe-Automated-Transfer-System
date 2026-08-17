# RATS — Recipe Automated Transfer System
### ARC Command Center V0.2

A centralized control system for managing and transferring wire bonding recipes across 12 Wire Bonder machines (WB76-WB87) via the SECS/GEM protocol. Supports real-time status monitoring, Pull (retrieve), and Push (deploy) operations with a role-based authorization system.

---

## What is this project?

RATS connects to Wire Bonder machines on the factory floor over SECS/GEM and lets authorized users:
- **Check** the current recipe loaded on each machine
- **Pull** the active recipe from a machine back to the server
- **Push** a new recipe from the server to a machine
- **Monitor** connection status of all 12 machines in real-time

The system runs as a full-stack app: Python FastAPI backend handles the SECS/GEM communication, React frontend provides the UI dashboard.

---

## What is New in V0.2.1 (2026-08-17)

### Changes from V0.1

| Feature | V0.1 | V0.2 |
|---|---|---|
| Frontend | Single HTML + Vanilla JS file | React + Vite SPA |
| Authentication | None | Role-based (Guest / Operator / Technician / Admin) |
| Dashboard | RATS only | RATS + System Status view |
| Machine connections | Direct from main.py | Section Manager supervises all 12 machines |
| Dark Mode | No | Yes (toggle in navbar) |
| Language | Thai/English mixed | TH / EN toggle button |
| Font loading | Google Fonts CDN | Fully local — no internet dependency |

### Latest changes in V0.2.1
- Removed MEMS dashboard tab — RATS is the only primary interface
- Guests now see an "Authorization Required" screen instead of a blank page
- RATS tab is always visible in navbar; auth is enforced at the view level
- After logout, user stays on RATS tab and sees the auth prompt
- All fonts (Inter, JetBrains Mono, Chakra Petch) are now served locally

---

## Project Structure

```
master-recipe-command-centerV0.2/
+-  arc-system/
|   +-  client-rats/         RATS Backend — Python FastAPI (Port 8080)
|   |   +-  main.py          API server + SECS/GEM orchestration
|   |   +-  testpull.py      Pull recipe from machine
|   |   +-  testpush.py      Push recipe to machine
|   |   +-  database.py      Machine IP/Port registry (local copy)
|   |   +-  requirement.txt  Python dependencies
|   |
|   +-  client-shell/        React UI (Port 3000)
|   |   +-  src/
|   |       +-  views/       RatsView, SystemView
|   |       +-  context/     AuthContext, ThemeContext, LanguageContext
|   |       +-  components/  Navbar, AuthModal
|   |
|   +-  section-manager/     SECS/GEM connection supervisor (all 12 machines)
|   +-  client-mems/         MEMS Backend (Port 8000) — backend kept, hidden in UI
|   +-  server/              Node.js API Gateway
|
+-  database.py              Central machine registry (WB76-WB87, IP, Port)
+-  start_command_center.bat One-click launcher — starts all services
+-  stop_command_center.bat  Graceful shutdown for all services
```

---

## How to Use

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+

Install Python dependencies:
```
cd arc-system/client-rats
pip install -r requirement.txt
```

Install Node dependencies (first time only):
```
cd arc-system/client-shell
npm install
```

---

### Starting the System

**Option 1 — One-click (recommended):**
```
Double-click: start_command_center.bat
```

This starts all services in order:
1. RATS SECS/GEM Engine     Port 8080
2. MEMS Telemetry Engine     Port 8000
3. Section Manager (manages all 12 machine connections)
4. React UI dev server       Port 3000  (browser opens automatically)

**Option 2 — Manual:**
```
Terminal 1:  cd arc-system/client-rats   ->  python main.py
Terminal 2:  cd arc-system/client-shell  ->  npm run dev
```

---

### Login / Authorization

Open http://localhost:3000 — you will see the "Authorization Required" screen.

| Role | Passcode | Access |
|---|---|---|
| Guest | (no login) | Auth prompt only |
| Operator | 1111 | View machine status and recipes |
| Technician | 2222 | View + Pull / Push recipes |
| Administrator | 3333 | Full control including system config |

Sessions auto-expire after 5 minutes of inactivity and persist across page refreshes.

---

### Stopping the System

```
Double-click: stop_command_center.bat
```
Or press Ctrl+C in the React dev server window.

---

## Machine Registry

| Machine ID | Name | IP | Port |
|---|---|---|---|
| WB#76 | Wire Bonder #76 | 169.254.13.76 | 5001 |
| WB#77 | Wire Bonder #77 | 169.254.13.77 | 5001 |
| WB#78 | Wire Bonder #78 | 169.254.13.78 | 5001 |
| WB#79 | Wire Bonder #79 | 169.254.13.79 | 5001 |
| WB#80 | Wire Bonder #80 | 169.254.13.80 | 5001 |
| WB#81 | Wire Bonder #81 | 169.254.13.81 | 5000 |
| WB#82 | Wire Bonder #82 | 169.254.13.82 | 5001 |
| WB#83 | Wire Bonder #83 | 169.254.13.83 | 5001 |
| WB#84 | Wire Bonder #84 | 169.254.13.84 | 5001 |
| WB#85 | Wire Bonder #85 | 169.254.13.85 | 5001 |
| WB#86 | Wire Bonder #86 | 169.254.13.86 | 5001 |
| WB#87 | Wire Bonder #87 | 192.168.11.87 | 5001 |

---

Stars Microelectronics (Thailand) PCL — ARC Engineering Team
