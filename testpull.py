import logging
import time
import sys
import os
from secsgem.hsms import HsmsSettings
from secsgem.gem import GemHostHandler
from secsgem.secs.functions import SecsS07F20, SecsS07F06

from database import MACHINE_DB

logging.basicConfig(level=logging.INFO)


class DirectConnectHost(GemHostHandler):
    def __init__(self, settings, machine_name):
        super().__init__(settings)
        self.machine_name = machine_name


# ══════════════════════════════════════════════════════════════════════════════
# Importable function: run_pull
# ══════════════════════════════════════════════════════════════════════════════

def run_pull(machine_id: str, log_callback=None) -> dict:
    """
    Pull (sync) all new recipes from a machine via SECS/GEM S7F5.

    Args:
        machine_id: Key in MACHINE_DB (e.g. "WB#76")
        log_callback: Optional callable(message: str, level: str).
                      level is one of "INFO", "SUCCESS", "ALERT".

    Returns:
        dict with keys: status ("ok"|"error"), message, pulled (list), skipped (list)
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
        return {"status": "error", "message": msg["EN"], "pulled": [], "skipped": []}

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
        return {"status": "error", "message": msg["EN"], "pulled": [], "skipped": []}

    log({
        "EN": "Connection established. Initializing 3-second delay...",
        "TH": "เชื่อมต่อการสื่อสารแล้ว เริ่มการหน่วงเวลา 3 วินาที..."
    }, "INFO")
    time.sleep(3.0)
    log({
        "EN": "Communication verified. Ready to transmit S7F19 request.",
        "TH": "ตรวจสอบการสื่อสารสำเร็จ พร้อมส่งคำสั่ง S7F19"
    }, "SUCCESS")

    pulled = []
    skipped = []

    try:
        # ── 3. Request recipe list (S7F19 → S7F20) ──────────────────────────
        log({
            "EN": "Requesting recipe inventory from equipment via S7F19...",
            "TH": "กำลังขอรายการสูตรจากเครื่องจักรผ่านคำสั่ง S7F19..."
        }, "INFO")
        s7f19 = host.stream_function(7, 19)()
        response = host.send_and_waitfor_response(s7f19)

        if response is None or response.header.function != 20:
            msg = {
                "EN": "No S7F20 response received from equipment.",
                "TH": "ไม่ได้รับการตอบกลับ S7F20 จากเครื่องจักร"
            }
            log(msg, "ALERT")
            return {"status": "error", "message": msg["EN"], "pulled": [], "skipped": []}

        s7f20 = SecsS07F20()
        s7f20.decode(response.data)
        recipe_list = s7f20.get()

        if not recipe_list:
            msg = {
                "EN": "S7F20 received, but equipment recipe inventory is empty.",
                "TH": "ได้รับ S7F20 แต่รายการสูตรในเครื่องจักรว่างเปล่า"
            }
            log(msg, "ALERT")
            return {"status": "ok", "message": msg["EN"], "pulled": [], "skipped": []}

        # ── 4. Prepare save directory & differential check ───────────────────
        # แปลง machine_id ให้ปลอดภัยเป็นชื่อโฟลเดอร์: # → _  (เช่น WB#76 → WB_76)
        safe_machine_name = machine_id.replace("#", "_")
        save_directory = f"C:/tmp/BondingProg/{safe_machine_name}"
        os.makedirs(save_directory, exist_ok=True)

        existing_files = [
            f.replace(".PWB", "")
            for f in os.listdir(save_directory)
            if f.endswith(".PWB")
        ]
        new_recipes = [name for name in recipe_list if name not in existing_files]

        log({
            "EN": f"Target directory resolved: {save_directory}",
            "TH": f"ตำแหน่งแฟ้มข้อมูลเป้าหมาย: {save_directory}"
        }, "INFO")
        log({
            "EN": f"Inventory match: Equipment possesses {len(recipe_list)} recipes. Local system possesses {len(existing_files)} recipes.",
            "TH": f"สรุปข้อมูล: เครื่องจักรมีสูตรทั้งหมด {len(recipe_list)} รายการ ระบบมีสูตรแล้ว {len(existing_files)} รายการ"
        }, "INFO")

        if not new_recipes:
            msg = {
                "EN": "No new programs detected. Local repository is fully synchronized.",
                "TH": "ไม่พบโปรแกรมใหม่ ข้อมูลในระบบสอดคล้องกับเครื่องจักรแล้ว"
            }
            log(msg, "SUCCESS")
            return {"status": "ok", "message": msg["EN"], "pulled": [], "skipped": list(existing_files)}

        # ── 5. Pull new files (S7F5 → S7F6) ─────────────────────────────────
        log({
            "EN": f"Detected {len(new_recipes)} new recipes. Initiating automated pull sequence...",
            "TH": f"ตรวจพบสูตรใหม่ {len(new_recipes)} รายการ เริ่มกระบวนการดาวน์โหลดสูตรอัตโนมัติ..."
        }, "INFO")

        success_count = 0
        fail_count = 0
        invalid_chars = ["(", ")", ":", "*", "?", '"', "<", ">", "|", "\\", "/", " "]

        for target_recipe in new_recipes:
            # Filter dangerous names
            if any(char in target_recipe for char in invalid_chars) or len(target_recipe) > 30:
                log({
                    "EN": f"Skipping recipe '{target_recipe}' due to invalid nomenclature.",
                    "TH": f"ข้ามสูตร '{target_recipe}' เนื่องจากรูปแบบชื่อไม่ถูกต้อง"
                }, "ALERT")
                skipped.append(target_recipe)
                fail_count += 1
                continue

            log({
                "EN": f"Downloading recipe payload: {target_recipe} ...",
                "TH": f"กำลังดาวน์โหลดข้อมูลสูตร: {target_recipe} ..."
            }, "INFO")

            try:
                s7f5 = host.stream_function(7, 5)(target_recipe)
                response_s7f5 = host.send_and_waitfor_response(s7f5)

                if response_s7f5 is not None and response_s7f5.header.function == 6:
                    s7f6 = SecsS07F06()
                    s7f6.decode(response_s7f5.data)
                    s7f6_data = s7f6.get()

                    # 🔍 DEBUG: ดู type จริงของ s7f6_data ก่อนแกะ เพื่อตรวจสอบ root cause
                    log(f"🔍 DEBUG: type(s7f6_data)={type(s7f6_data)} "
                        f"keys={list(s7f6_data.keys()) if isinstance(s7f6_data, dict) else 'N/A'}", "INFO")

                    # ⚠️ สำคัญ: s7f6.get() คืนมาเป็น dict {'PPID':..., 'PPBODY':...}
                    # ไม่ใช่ list! เงื่อนไข isinstance(..., list) ด้านบนของเดิมเลย
                    # เป็น False เสมอ ทำให้ตกไปที่ else: ppbody = s7f6_data ซึ่งคือ
                    # dict ทั้งก้อน (มี PPID ติดมาด้วย) แล้วพอไม่ตรง str/bytes/list
                    # เลยถูก str(ทั้ง dict) แปลงเป็น text -> ไฟล์บวม ~2.9x และส่ง
                    # text ของ dict (ไม่ใช่ recipe จริง) เข้าเครื่องตอน push
                    # ต้องดึง key 'PPBODY' ออกมาตรงๆก่อนเสมอ
                    if isinstance(s7f6_data, dict):
                        ppbody = s7f6_data.get("PPBODY", s7f6_data)
                    elif isinstance(s7f6_data, list) and len(s7f6_data) > 1:
                        ppbody = s7f6_data[1]
                    else:
                        ppbody = s7f6_data

                    # 🔍 DEBUG: ดู type จริงของ ppbody หลังแกะออกจาก dict แล้ว
                    log(f"🔍 DEBUG: type(ppbody)={type(ppbody)} len={len(ppbody) if hasattr(ppbody, '__len__') else 'N/A'}", "INFO")

                    # Convert to bytes safely
                    # ⚠️ สำคัญ: ถ้า secsgem decode item type ผิดเป็น <A> (ASCII)
                    # แทน <B> (Binary) ตัว ppbody จะกลายเป็น str ที่จริงๆแล้วถูก
                    # decode มาจาก raw bytes แบบ 1-byte-1-char (เทียบเท่า latin-1)
                    # ห้าม encode กลับด้วย utf-8 เด็ดขาด เพราะ utf-8 จะตีความ
                    # byte value >= 0x80 บางตัวเป็น invalid แล้ว errors="ignore"
                    # จะทิ้งไบต์เหล่านั้นไปเงียบๆ กระจายทั่วไฟล์ -> ไฟล์ขาดเป็นช่วงๆ
                    # (สาเหตุของไฟล์ recipe ที่ pull แล้วขนาดหายไปหลัก KB)
                    if isinstance(ppbody, str):
                        file_bytes = ppbody.encode("latin-1")
                    elif isinstance(ppbody, bytes):
                        file_bytes = ppbody
                    elif isinstance(ppbody, list):
                        try:
                            file_bytes = bytes(ppbody)
                        except TypeError:
                            joined_str = "".join(str(x) for x in ppbody)
                            file_bytes = joined_str.encode("latin-1")
                    else:
                        file_bytes = str(ppbody).encode("latin-1")

                    log(f"🔍 DEBUG: len(file_bytes) หลัง encode = {len(file_bytes)}", "INFO")

                    output_filename = f"{save_directory}/{target_recipe}.PWB"
                    with open(output_filename, "wb") as f:
                        f.write(file_bytes)

                    log({
                        "EN": f"Download successful: {target_recipe}",
                        "TH": f"ดาวน์โหลดสำเร็จ: {target_recipe}"
                    }, "SUCCESS")
                    pulled.append(target_recipe)
                    success_count += 1
                else:
                    log({
                        "EN": f"Download failed: {target_recipe} (Equipment rejected request).",
                        "TH": f"ดาวน์โหลดล้มเหลว: {target_recipe} (เครื่องจักรปฏิเสธคำขอ)"
                    }, "ALERT")
                    fail_count += 1

            except ConnectionResetError:
                log({
                    "EN": "CRITICAL ERROR: Equipment disconnected abruptly.",
                    "TH": "ข้อผิดพลาดร้ายแรง: เครื่องจักรตัดการเชื่อมต่อกะทันหัน"
                }, "ALERT")
                break

            except Exception as e:
                log({
                    "EN": f"System error during download of {target_recipe}: {e}",
                    "TH": f"เกิดข้อผิดพลาดของระบบระหว่างดาวน์โหลดสูตร {target_recipe}: {e}"
                }, "ALERT")
                fail_count += 1

            # Delay between pulls
            time.sleep(3.0)

        summary = {
            "EN": f"Synchronization summary: {success_count} succeeded, {fail_count} failed.",
            "TH": f"สรุปการซิงโครไนซ์: สำเร็จ {success_count} รายการ, ล้มเหลว {fail_count} รายการ"
        }
        log(summary, "SUCCESS" if fail_count == 0 else "INFO")

        return {
            "status": "ok",
            "message": summary["EN"],
            "pulled": pulled,
            "skipped": skipped,
        }

    except Exception as e:
        msg = {
            "EN": f"Critical system error encountered: {e}",
            "TH": f"เกิดข้อผิดพลาดร้ายแรงในระบบ: {e}"
        }
        log(msg, "ALERT")
        return {"status": "error", "message": msg["EN"], "pulled": pulled, "skipped": skipped}

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
    print("=== Master Recipe PoC (Smart Sync Pull) ===")

    print("\n📋 รายชื่อเครื่องจักรในระบบ (MACHINE_DB):")
    for key, info in MACHINE_DB.items():
        print(f"   - {key}: {info['name']} (IP: {info['ip']})")

    TEST_ID = input("\n👉 กรุณาระบุรหัสเครื่องจักรที่ต้องการ Pull (เช่น WB#82): ").strip()

    def cli_log(message, level="INFO"):
        print(message)

    result = run_pull(TEST_ID, log_callback=cli_log)
    print(f"\n📦 Result: {result}")