import logging
import time
import sys
from secsgem.hsms import HsmsSettings
from secsgem.gem import GemHostHandler
from secsgem.secs.functions import SecsS07F20

from database import MACHINE_DB

logging.basicConfig(level=logging.INFO)


class DirectConnectHost(GemHostHandler):
    def __init__(self, settings, machine_name):
        super().__init__(settings)
        self.machine_name = machine_name


# ══════════════════════════════════════════════════════════════════════════════
# Importable function: run_check
# ══════════════════════════════════════════════════════════════════════════════

def run_check(machine_id: str, log_callback=None) -> dict:
    """
    Check connectivity to a machine via SECS/GEM.
    Connects, waits for communicating, sends S7F19 to get recipe list.

    Args:
        machine_id: Key in MACHINE_DB (e.g. "WB#78")
        log_callback: Optional callable(message: str, level: str).

    Returns:
        dict with keys: status ("ok"|"error"), message, recipe_count (int)
    """
    def log(message: str, level: str = "INFO"):
        if log_callback:
            log_callback(message, level)

    # ── 1. Validate machine ──────────────────────────────────────────────────
    if machine_id not in MACHINE_DB:
        msg = {
            "EN": f"Machine ID '{machine_id}' not found in configuration database.",
            "TH": f"ไม่พบรหัสเครื่องจักร '{machine_id}' ในฐานข้อมูลระบบ"
        }
        log(msg, "ALERT")
        return {"status": "error", "message": msg["EN"], "recipe_count": 0}

    target = MACHINE_DB[machine_id]
    log({
        "EN": f"Establishing connection to {target['name']} via {target['ip']}:{target['port']}",
        "TH": f"กำลังสร้างการเชื่อมต่อไปยัง {target['name']} ผ่าน {target['ip']}:{target['port']}"
    }, "INFO")

    # ── 2. Connect ───────────────────────────────────────────────────────────
    settings = HsmsSettings(
        address=target["ip"],
        port=target["port"],
        active=True,
        session_id=target["session_id"],
    )

    host = DirectConnectHost(settings, target["name"])
    host.enable()

    log({
        "EN": "Awaiting communication state (timeout: 15s)...",
        "TH": "กำลังรอสถานะการสื่อสาร (หมดเวลาใน 15 วินาที)..."
    }, "INFO")
    if not host.waitfor_communicating(timeout=15):
        host.disable()
        msg = {
            "EN": "Timeout: Failed to establish communication within 15 seconds.",
            "TH": "หมดเวลา: ไม่สามารถเชื่อมต่อการสื่อสารได้ภายใน 15 วินาที"
        }
        log(msg, "ALERT")
        return {"status": "error", "message": msg["EN"], "recipe_count": 0}

    log({
        "EN": "Communication established. Preparing S7F19 request...",
        "TH": "การสื่อสารเชื่อมต่อสำเร็จ กำลังเตรียมคำสั่ง S7F19..."
    }, "SUCCESS")

    try:
        log({
            "EN": "Transmitting S1F1 (Are You There) connection test...",
            "TH": "กำลังส่งคำสั่งทดสอบการเชื่อมต่อ S1F1 (Are You There)..."
        }, "INFO")
        s1f1 = host.stream_function(1, 1)()
        response = host.send_and_waitfor_response(s1f1)

        if response is None or response.header.function != 2:
            func_num = response.header.function if response else "N/A"
            msg = {
                "EN": f"No valid S1F2 response received (Function: {func_num}).",
                "TH": f"ไม่ได้รับการตอบกลับ S1F2 ที่ถูกต้อง (Function: {func_num})"
            }
            log(msg, "ALERT")
            return {"status": "error", "message": msg["EN"], "recipe_count": 0}

        log({
            "EN": "S1F2 response received. Connection validated successfully.",
            "TH": "ได้รับการตอบกลับ S1F2 ยืนยันการเชื่อมต่อสำเร็จ"
        }, "SUCCESS")

        msg = f"Connection established with {target['name']}."
        return {"status": "ok", "message": msg, "recipe_count": 0}

    except Exception as e:
        msg = {
            "EN": f"System error encountered: {e}",
            "TH": f"เกิดข้อผิดพลาดของระบบ: {e}"
        }
        log(msg, "ALERT")
        return {"status": "error", "message": msg["EN"], "recipe_count": 0}

    finally:
        host.disable()
        log({
            "EN": "Connection gracefully terminated.",
            "TH": "ปิดการเชื่อมต่ออย่างสมบูรณ์เรียบร้อยแล้ว"
        }, "INFO")
        time.sleep(1)


# ══════════════════════════════════════════════════════════════════════════════
# Standalone CLI mode
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=== Master Recipe PoC (Test Link) ===")

    print("\n📋 รายชื่อเครื่องจักรในระบบ (MACHINE_DB):")
    for key, info in MACHINE_DB.items():
        print(f"   - {key}: {info['name']} (IP: {info['ip']})")

    TEST_ID = input("\n👉 กรุณาระบุรหัสเครื่องจักร (เช่น WB#83): ").strip()

    def cli_log(message, level="INFO"):
        print(message)

    result = run_check(TEST_ID, log_callback=cli_log)
    print(f"\n📦 Result: {result}")
