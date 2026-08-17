"""
=============================================================================
Machine Efficiency Monitor System (MEMS) — Python FastAPI → SQLite Backend
=============================================================================
Provides a REST API to accept state changes and persists them into a local 
SQLite database, applying a per-machine 2-second de-duplication window.
Also serves the frontend static files.

Dependencies:
    pip install fastapi uvicorn

Usage:
    python server.py
=============================================================================
"""

import time
import sqlite3
import logging
from datetime import datetime, timezone
from typing import Dict
from contextlib import asynccontextmanager
import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

# ── Configuration ────────────────────────────────────────────────────────────

DB_PATH       = "mems.db"               # SQLite file (created if missing)
MIN_MSG_INTERVAL_SEC = 2.0              # Minimum gap between accepted messages

# ── Static Machine Metadata ──────────────────────────────────────────────────
# This represents the factory configuration (metadata).
# We merge this with dynamic states from the DB.
MACHINES_META = [
  { "id": "M01", "name": "ASM AD838-01", "line": "LINE-A", "oee": 87, "cycleTime": 4.2, "output": 1230 },
  { "id": "M02", "name": "ASM AD838-02", "line": "LINE-A", "oee": 91, "cycleTime": 4.1, "output": 1340 },
  { "id": "M03", "name": "ASM AD838-03", "line": "LINE-A", "oee": 0,  "cycleTime": 0,   "output": 880  },
  { "id": "M04", "name": "ASM AD838-04", "line": "LINE-A", "oee": 0,  "cycleTime": 0,   "output": 670  },
  { "id": "M05", "name": "FUJI NXT3-01", "line": "LINE-B", "oee": 94, "cycleTime": 3.8, "output": 2100 },
  { "id": "M06", "name": "FUJI NXT3-02", "line": "LINE-B", "oee": 88, "cycleTime": 3.9, "output": 1980 },
  { "id": "M07", "name": "FUJI NXT3-03", "line": "LINE-B", "oee": 82, "cycleTime": 4.0, "output": 1560 },
  { "id": "M08", "name": "FUJI NXT3-04", "line": "LINE-B", "oee": 0,  "cycleTime": 0,   "output": 1100 },
  { "id": "M09", "name": "JUKI FX-3-01", "line": "LINE-C", "oee": 96, "cycleTime": 3.5, "output": 2500 },
  { "id": "M10", "name": "JUKI FX-3-02", "line": "LINE-C", "oee": 0,  "cycleTime": 0,   "output": 1200 },
  { "id": "M11", "name": "JUKI FX-3-03", "line": "LINE-C", "oee": 79, "cycleTime": 4.5, "output": 1450 },
  { "id": "M12", "name": "JUKI FX-3-04", "line": "LINE-C", "oee": 85, "cycleTime": 4.2, "output": 1310 },
  { "id": "M13", "name": "PNS-EVO-01",   "line": "LINE-D", "oee": 90, "cycleTime": 3.7, "output": 930  },
  { "id": "M14", "name": "PNS-EVO-02",   "line": "LINE-D", "oee": 0,  "cycleTime": 0,   "output": 720  },
  { "id": "M15", "name": "PNS-EVO-03",   "line": "LINE-D", "oee": 92, "cycleTime": 3.6, "output": 2200 },
  { "id": "M16", "name": "PNS-EVO-04",   "line": "LINE-D", "oee": 0,  "cycleTime": 0,   "output": 540  },
  { "id": "WB#76", "name": "Wire Bonder #76", "line": "LINE-WB", "oee": 88, "cycleTime": 2.1, "output": 1420 },
  { "id": "WB#77", "name": "Wire Bonder #77", "line": "LINE-WB", "oee": 91, "cycleTime": 2.0, "output": 1500 },
  { "id": "WB#78", "name": "Wire Bonder #78", "line": "LINE-WB", "oee": 85, "cycleTime": 2.2, "output": 1380 },
  { "id": "WB#79", "name": "Wire Bonder #79", "line": "LINE-WB", "oee": 89, "cycleTime": 2.1, "output": 1460 },
  { "id": "WB#80", "name": "Wire Bonder #80", "line": "LINE-WB", "oee": 93, "cycleTime": 1.9, "output": 1620 },
  { "id": "WB#81", "name": "Wire Bonder #81", "line": "LINE-WB", "oee": 90, "cycleTime": 2.0, "output": 1550 },
  { "id": "WB#82", "name": "Wire Bonder #82", "line": "LINE-WB", "oee": 86, "cycleTime": 2.2, "output": 1410 },
  { "id": "WB#83", "name": "Wire Bonder #83", "line": "LINE-WB", "oee": 94, "cycleTime": 1.8, "output": 1680 },
  { "id": "WB#84", "name": "Wire Bonder #84", "line": "LINE-WB", "oee": 87, "cycleTime": 2.1, "output": 1430 },
  { "id": "WB#85", "name": "Wire Bonder #85", "line": "LINE-WB", "oee": 92, "cycleTime": 1.9, "output": 1590 },
  { "id": "WB#86", "name": "Wire Bonder #86", "line": "LINE-WB", "oee": 84, "cycleTime": 2.3, "output": 1350 },
  { "id": "WB#87", "name": "Wire Bonder #87", "line": "LINE-WB", "oee": 95, "cycleTime": 1.8, "output": 1710 },
]

# Provide fallback static mapping to bridge legacy IDs with expected dashboard strings
MACHINE_ID_MAPPING = {
    # DB might get "asm_ad838", map to a name or id if needed
}

# ── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("mems-server")

# ── Database ─────────────────────────────────────────────────────────────────

VALID_STATES = {"RUNNING", "DOWN", "IDLE", "OFFLINE"}

def init_database(path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(path, check_same_thread=False)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS machine_states_log (
            log_id      INTEGER PRIMARY KEY AUTOINCREMENT,
            machine_id  TEXT    NOT NULL,
            state       TEXT    NOT NULL CHECK (state IN ('RUNNING','DOWN','IDLE','OFFLINE')),
            timestamp   TEXT    NOT NULL DEFAULT (datetime('now'))
        );
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_machine_timestamp
        ON machine_states_log (machine_id, timestamp);
    """)

    conn.commit()
    log.info("Database initialised: %s", path)
    return conn

def insert_state(conn: sqlite3.Connection, machine_id: str, state: str) -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    try:
        conn.execute(
            "INSERT INTO machine_states_log (machine_id, state, timestamp) VALUES (?, ?, ?)",
            (machine_id, state, now),
        )
        conn.commit()
        log.info("DB INSERT  machine=%s  state=%s  ts=%s", machine_id, state, now)
    except sqlite3.Error as exc:
        log.error("DB error: %s", exc)

# ── Application State ────────────────────────────────────────────────────────

last_accepted: Dict[str, float] = {}

class AppState:
    db_conn: sqlite3.Connection = None

app_state = AppState()

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("=== MEMS Backend Server starting ===")
    app_state.db_conn = init_database(DB_PATH)
    yield
    if app_state.db_conn:
        app_state.db_conn.close()
    log.info("Clean shutdown complete.")

app = FastAPI(title="MEMS Dashboard API", lifespan=lifespan)

# ── API Endpoints ────────────────────────────────────────────────────────────

class StatePayload(BaseModel):
    state: str

@app.post("/api/mems/{machine_id}/state")
async def update_machine_state(machine_id: str, payload: StatePayload):
    state = payload.state.strip().upper()
    if state not in VALID_STATES:
        log.warning("Invalid state '%s' from %s — rejecting", state, machine_id)
        raise HTTPException(status_code=400, detail=f"Invalid state. Must be one of {VALID_STATES}")

    now = time.time()
    last_ts = last_accepted.get(machine_id, 0.0)

    if (now - last_ts) < MIN_MSG_INTERVAL_SEC:
        log.debug(
            "Rate-limited: machine=%s  state=%s  (%.1f s since last)",
            machine_id, state, now - last_ts,
        )
        return {"status": "ignored", "reason": "rate_limited"}

    last_accepted[machine_id] = now
    log.info("Accepted  machine=%s  state=%s", machine_id, state)
    
    if app_state.db_conn:
        # Check if we should find ID based on mapping
        # E.g. "asm_ad838" -> mapping, but here we just use what was sent
        insert_state(app_state.db_conn, machine_id, state)
        
    return {"status": "success", "machine_id": machine_id, "state": state}

@app.get("/api/mems/states")
async def get_recent_states(limit: int = 50):
    if not app_state.db_conn:
        return []
    
    cursor = app_state.db_conn.cursor()
    cursor.execute(
        "SELECT machine_id, state, timestamp FROM machine_states_log ORDER BY timestamp DESC LIMIT ?", 
        (limit,)
    )
    rows = cursor.fetchall()
    return [{"machine_id": r[0], "state": r[1], "timestamp": r[2]} for r in rows]

@app.get("/api/mems/machines")
async def get_machines():
    """Returns the full list of machines with their current dynamic state merged."""
    if not app_state.db_conn:
        return []

    # Get the latest state for each machine
    cursor = app_state.db_conn.cursor()
    
    # We use a group by subquery to find the latest log_id per machine_id
    cursor.execute("""
        SELECT m.machine_id, m.state, m.timestamp 
        FROM machine_states_log m
        INNER JOIN (
            SELECT machine_id, MAX(log_id) as max_id 
            FROM machine_states_log 
            GROUP BY machine_id
        ) max_logs ON m.machine_id = max_logs.machine_id AND m.log_id = max_logs.max_id
    """)
    rows = cursor.fetchall()
    
    # Build a lookup dictionary
    latest_states = {r[0]: {"state": r[1], "timestamp": r[2]} for r in rows}
    
    merged_machines = []
    now = datetime.now(timezone.utc)
    
    for meta in MACHINES_META:
        machine = dict(meta)
        
        # Determine dynamic state or fallback to default IDLE
        # Using machine.name or machine.id to lookup. For testing we might update asm_ad838, let's normalize.
        # Check if the exact id, or lowercase id, or name was updated.
        state_info = latest_states.get(machine["id"]) or latest_states.get(machine["name"]) or latest_states.get(machine["name"].lower().replace(" ", "_").replace("-", "_"))
        
        if state_info:
            machine["state"] = state_info["state"]
            
            # calculate stateSince in minutes
            ts = datetime.strptime(state_info["timestamp"], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
            diff_mins = max(0, int((now - ts).total_seconds() / 60))
            machine["stateSince"] = diff_mins
        else:
            # Fallback state if no data in DB yet
            machine["state"] = "IDLE"
            machine["stateSince"] = 0
            
        merged_machines.append(machine)
        
    return merged_machines

@app.get("/api/mems/events")
async def get_events(limit: int = 20):
    """Returns event logs in the format expected by the frontend."""
    if not app_state.db_conn:
        return []
    
    # We fetch slightly more to calculate "from" states
    cursor = app_state.db_conn.cursor()
    cursor.execute(
        "SELECT log_id, machine_id, state, timestamp FROM machine_states_log ORDER BY machine_id, timestamp DESC"
    )
    rows = cursor.fetchall()
    
    # Group by machine to find transitions
    machine_logs = {}
    for r in rows:
        m_id = r[1]
        if m_id not in machine_logs:
            machine_logs[m_id] = []
        machine_logs[m_id].append({"id": r[0], "state": r[2], "timestamp": r[3]})
        
    events = []
    for m_id, logs in machine_logs.items():
        # logs is ordered by timestamp DESC
        for i in range(len(logs) - 1):
            curr_log = logs[i]
            prev_log = logs[i+1]
            if curr_log["state"] != prev_log["state"]:
                # this is a transition
                events.append({
                    "id": f"E{curr_log['id']}",
                    "machine": m_id,
                    "from": prev_log["state"],
                    "to": curr_log["state"],
                    "timestamp": curr_log["timestamp"],
                    "reason": "State changed via API" # Dummy reason
                })
                
    # Sort globally by timestamp descending
    events.sort(key=lambda x: x["timestamp"], reverse=True)
    return events[:limit]

# ── Serve Static Files ───────────────────────────────────────────────────────
# We mount the static files from the current directory
static_dir = os.path.dirname(os.path.abspath(__file__))
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
