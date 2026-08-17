import logging
import time
import sys
import os
from secsgem.hsms import HsmsSettings, HsmsConnectMode
from secsgem.gem import GemHostHandler
from secsgem.secs.variables import Binary
from secsgem.secs.functions import (
    SecsS01F03, SecsS01F04,
    SecsS07F01, SecsS07F02,
    SecsS07F03, SecsS07F04,
    SecsS07F05, SecsS07F06
)

from database import MACHINE_DB

logging.basicConfig(level=logging.INFO)

class DirectConnectHost(GemHostHandler):
    def __init__(self, settings, machine_name):
        super().__init__(settings)
        self.machine_name = machine_name

# ══════════════════════════════════════════════════════════════════════════════
# Importable function: run_push (Stripped down version: Backup + Push Only)
# ══════════════════════════════════════════════════════════════════════════════

def _connect(target, log):
    """สร้างการเชื่อมต่อ HSMS ใหม่ 1 เซสชัน คืนค่า host หรือ None ถ้าเชื่อมต่อไม่สำเร็จ"""
    settings = HsmsSettings(
        address=target["ip"], port=target["port"], session_id=target["session_id"],
        connect_mode=HsmsConnectMode.ACTIVE,
    )
    settings.timeouts.t3 = 45
    settings.timeouts.t6 = 10
    host = DirectConnectHost(settings, target["name"])
    host.enable()

    if not host.waitfor_communicating(timeout=15):
        host.disable()
        return None
    return host


def _disconnect(host, log):
    """ปิดการเชื่อมต่อแบบนุ่มนวล ป้องกัน exception ซ้อนตอน socket หลุดเอง"""
    try:
        host.settings.timeouts.t3 = 0
        host.settings.timeouts.t6 = 0
    except Exception:
        pass
    time.sleep(1.0)
    host.disable()


def run_push(machine_id: str, recipe_name: str, log_callback=None) -> dict:
    """
    Push a recipe binary file via SECS/GEM S7F3, with automatic backup of the
    current recipe beforehand. Backup และ Push ทำกันคนละ "เซสชันเชื่อมต่อ" กัน
    (disconnect แล้ว reconnect ใหม่) เพราะเครื่องมีปัญหากับการสลับโหมด
    upload (S7F5) -> download (S7F3) ติดกันในคอนเนคชันเดียว

    ก่อนส่งไฟล์จริง (S7F3) จะทำการ "ขออนุญาต" ก่อนด้วย S7F1 (PP-Load Inquire)
    บอกชื่อ PPID + ขนาดไฟล์ล่วงหน้า แล้วรอ S7F2 (PP-Load Grant) จากเครื่อง
    ตามสเปก SECS/GEM (SEMI E5) — ถ้าเครื่องปฏิเสธ (PPGNT != 0) จะได้รู้เหตุผล
    ตรงๆ จากเครื่อง แทนที่จะโดนตัดสายแบบไม่รู้สาเหตุ
    """
    def log(message: str, level: str = "INFO"):
        if log_callback:
            log_callback(message, level)

    # ── 1. Validate machine & Locate File ────────────────────────────────────
    if machine_id not in MACHINE_DB:
        msg = {
            "EN": f"Machine ID '{machine_id}' not found in configuration database.",
            "TH": f"ไม่พบรหัสเครื่องจักร '{machine_id}' ในฐานข้อมูลระบบ"
        }
        log(msg, "ALERT")
        return {"status": "error", "message": msg["EN"], "ackc7": None}

    target = MACHINE_DB[machine_id]
    safe_machine_name = machine_id.replace("#", "_")
    target_dir = f"C:/tmp/BondingProg/{safe_machine_name}"
    os.makedirs(target_dir, exist_ok=True)
    file_path = f"{target_dir}/{recipe_name}.PWB"

    if not os.path.exists(file_path):
        return {"status": "error", "message": "Recipe file not found locally.", "ackc7": None}

    with open(file_path, "rb") as f:
        file_bytes = f.read()

    # ═════════════════════════════════════════════════════════════════════════
    # SESSION 1: เช็คสูตรปัจจุบัน & Backup (S1F3 -> S7F5)
    # ═════════════════════════════════════════════════════════════════════════
    log({
        "EN": f"[Session 1/2] Establishing connection to {target['name']} for pre-push backup validation...",
        "TH": f"[เซสชัน 1/2] กำลังสร้างการเชื่อมต่อไปยัง {target['name']} เพื่อตรวจสอบระบบย้อนกลับ..."
    }, "INFO")
    host = _connect(target, log)
    if host is None:
        msg = {
            "EN": "Failed to establish connection (Backup session).",
            "TH": "การเชื่อมต่อล้มเหลว (เซสชันสำรองข้อมูล)"
        }
        return {"status": "error", "message": msg["EN"], "ackc7": None}

    log({
        "EN": "Connection established.",
        "TH": "การสื่อสารเชื่อมต่อสำเร็จ"
    }, "INFO")
    time.sleep(2.0)

    try:
        log({
            "EN": "Querying current active recipe for backup sequence...",
            "TH": "กำลังค้นหาสูตรปัจจุบันสำหรับกระบวนการสำรองข้อมูล..."
        }, "INFO")
        old_recipe_name = ""
        try:
            res_s1 = host.send_and_waitfor_response(SecsS01F03([564]))
            if res_s1 and res_s1.header.function == 4:
                s1f4 = SecsS01F04()
                s1f4.decode(res_s1.data)
                vals = s1f4.get()
                if vals and vals[0]:
                    old_recipe_name = str(vals[0]).strip()
                    log({
                        "EN": f"Active recipe detected: '{old_recipe_name}'",
                        "TH": f"ตรวจพบสูตรปัจจุบัน: '{old_recipe_name}'"
                    }, "INFO")

            if old_recipe_name and old_recipe_name != recipe_name:
                old_path = f"{target_dir}/{old_recipe_name}.PWB"
                if not os.path.exists(old_path):
                    log({
                        "EN": f"Initiating backup download for '{old_recipe_name}'...",
                        "TH": f"กำลังเริ่มดาวน์โหลดเพื่อสำรองข้อมูล '{old_recipe_name}'..."
                    }, "INFO")
                    res_s7f5 = host.send_and_waitfor_response(SecsS07F05(old_recipe_name))
                    if res_s7f5 and res_s7f5.header.function == 6:
                        s7f6 = SecsS07F06()
                        s7f6.decode(res_s7f5.data)
                        data = s7f6.get()
                        ppbody = data["PPBODY"] if isinstance(data, dict) else data[1]
                        with open(old_path, "wb") as f_out:
                            f_out.write(ppbody.encode('utf-8') if isinstance(ppbody, str) else ppbody)
                        log({
                            "EN": "Backup sequence completed successfully.",
                            "TH": "กระบวนการสำรองข้อมูลเสร็จสมบูรณ์"
                        }, "SUCCESS")
                else:
                    log({
                        "EN": f"Backup file '{old_recipe_name}' already exists locally. Skipping download.",
                        "TH": f"มีไฟล์สำรอง '{old_recipe_name}' อยู่แล้วในระบบ ข้ามการดาวน์โหลด"
                    }, "INFO")
        except Exception as e_bk:
            log({
                "EN": f"Backup sequence encountered an error (continuing to push): {e_bk}",
                "TH": f"กระบวนการสำรองข้อมูลเกิดข้อผิดพลาด (ดำเนินการส่งต่อ): {e_bk}"
            }, "ALERT")
    finally:
        _disconnect(host, log)
        log({
            "EN": "[Session 1/2] Backup connection gracefully terminated.",
            "TH": "[เซสชัน 1/2] ปิดการเชื่อมต่อสำหรับสำรองข้อมูลเรียบร้อยแล้ว"
        }, "INFO")

    # หน่วงเวลาให้เครื่องเคลียร์ state ของตัวเองให้เสร็จก่อนจะเปิดคอนเนคชันใหม่
    time.sleep(3.0)

    # ═════════════════════════════════════════════════════════════════════════
    # SESSION 2: เชื่อมต่อใหม่ -> ขออนุญาต (S7F1/S7F2) -> Push ไฟล์ (S7F3)
    # ═════════════════════════════════════════════════════════════════════════
    log({
        "EN": f"[Session 2/2] Establishing connection to {target['name']} for recipe push...",
        "TH": f"[เซสชัน 2/2] กำลังสร้างการเชื่อมต่อไปยัง {target['name']} เพื่อส่งข้อมูลสูตร..."
    }, "INFO")
    host = _connect(target, log)
    if host is None:
        msg = {
            "EN": "Failed to establish connection (Push session).",
            "TH": "การเชื่อมต่อล้มเหลว (เซสชันการส่งข้อมูล)"
        }
        return {"status": "error", "message": msg["EN"], "ackc7": None}

    log({
        "EN": "Connection established.",
        "TH": "การสื่อสารเชื่อมต่อสำเร็จ"
    }, "INFO")
    time.sleep(5.0)  # ตามสเปก push.py ที่รันผ่านเสมอ

    try:
        # 🟢 STEP 1: ขออนุญาตก่อนส่งไฟล์ (S7F1 -> S7F2) ตามสเปก SECS/GEM
        file_len = len(file_bytes)
        log({
            "EN": f"Requesting authorization to transfer '{recipe_name}' ({file_len:,} bytes) via S7F1...",
            "TH": f"กำลังขออนุญาตส่งข้อมูล '{recipe_name}' ({file_len:,} ไบต์) ผ่านคำสั่ง S7F1..."
        }, "INFO")
        s7f1 = SecsS07F01({"PPID": recipe_name, "LENGTH": file_len})
        response_s7f1 = host.send_and_waitfor_response(s7f1)

        if not (response_s7f1 and response_s7f1.header.function == 2):
            msg = {
                "EN": "No S7F2 response received (Timeout or disconnection).",
                "TH": "ไม่ได้รับการตอบรับ S7F2 (หมดเวลาหรือขาดการเชื่อมต่อ)"
            }
            log(msg, "ALERT")
            return {"status": "error", "message": msg["EN"], "ackc7": None}

        s7f2 = SecsS07F02()
        s7f2.decode(response_s7f1.data)
        ppgnt = s7f2.get()

        if ppgnt != 0:
            msg = {
                "EN": f"Transfer request rejected by equipment (PPGNT={ppgnt}) - Insufficient space or duplicate name.",
                "TH": f"เครื่องจักรปฏิเสธคำขอ (PPGNT={ppgnt}) - พื้นที่ไม่เพียงพอหรือชื่อซ้ำ"
            }
            log(msg, "ALERT")
            return {"status": "error", "message": msg["EN"], "ackc7": None, "ppgnt": ppgnt}

        log({
            "EN": "Transfer authorized (PPGNT=0). Preparing binary payload...",
            "TH": "อนุญาตการส่งข้อมูล (PPGNT=0) กำลังเตรียมไบนารีเปย์โหลด..."
        }, "SUCCESS")

        # 🟢 STEP 2: ส่งไฟล์จริง (S7F3)
        log({
            "EN": f"Transmitting recipe payload '{recipe_name}' via S7F3...",
            "TH": f"กำลังส่งข้อมูลสูตร '{recipe_name}' ผ่านคำสั่ง S7F3..."
        }, "INFO")
        s7f3 = SecsS07F03([recipe_name, Binary(file_bytes)])
        response_s7f3 = host.send_and_waitfor_response(s7f3)

        if response_s7f3 and response_s7f3.header.function == 4:
            s7f4 = SecsS07F04()
            s7f4.decode(response_s7f3.data)
            ackc7 = s7f4.get()
            if ackc7 == 0:
                msg = {
                    "EN": "Recipe push completed successfully.",
                    "TH": "กระบวนการส่งสูตรสำเร็จสมบูรณ์"
                }
                log(msg, "SUCCESS")
                return {"status": "ok", "message": msg["EN"], "ackc7": ackc7}
            else:
                msg = {
                    "EN": f"Equipment rejected payload (ACKC7={ackc7}).",
                    "TH": f"เครื่องจักรปฏิเสธข้อมูลที่ส่งไป (ACKC7={ackc7})"
                }
                log(msg, "ALERT")
                return {"status": "error", "message": msg["EN"], "ackc7": ackc7}
        else:
            msg = {
                "EN": "No S7F4 response received.",
                "TH": "ไม่ได้รับการตอบรับ S7F4"
            }
            return {"status": "error", "message": msg["EN"], "ackc7": None}

    finally:
        _disconnect(host, log)
        log({
            "EN": "[Session 2/2] Push connection gracefully terminated.",
            "TH": "[เซสชัน 2/2] ปิดการเชื่อมต่อการส่งข้อมูลเรียบร้อยแล้ว"
        }, "INFO")


# ══════════════════════════════════════════════════════════════════════════════
# Standalone CLI mode
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=== Master Recipe PoC (Pull & Push Only) ===")

    print("\n📋 รายชื่อเครื่องจักรในระบบ (MACHINE_DB):")
    for key, info in MACHINE_DB.items():
        print(f"   - {key}: {info['name']} (IP: {info['ip']})")

    TEST_ID = input("\n👉 กรุณาระบุรหัสเครื่องจักรเป้าหมาย (เช่น WB#78): ").strip()

    if TEST_ID not in MACHINE_DB:
        print(f"❌ ไม่พบรหัส '{TEST_ID}' ในไฟล์ database.py!")
        sys.exit()

    safe_machine_name = TEST_ID.replace("#", "_")
    target_dir = f"C:/tmp/BondingProg/{safe_machine_name}"

    available_files = []
    if os.path.exists(target_dir):
        available_files = [f.replace(".PWB", "") for f in os.listdir(target_dir) if f.endswith(".PWB")]

    if available_files:
        print(f"\n📂 ไฟล์ Recipe ที่พร้อม Push ในโฟลเดอร์ {target_dir}:")
        for f in available_files:
            print(f"   - {f}")
    else:
        print(f"\n⚠️ ไม่พบไฟล์ .PWB ในโฟลเดอร์ {target_dir} เลย")

    recipe_name = input("\n👉 กรุณาระบุชื่อ Recipe ที่ต้องการ Push (ไม่ต้องพิมพ์ .PWB): ").strip()

    def cli_log(message, level="INFO"):
        print(message)

    result = run_push(TEST_ID, recipe_name, log_callback=cli_log)
    print(f"\n📦 Result: {result}")