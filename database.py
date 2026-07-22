# database.py

# จำลองตารางข้อมูลเครื่องจักร (รอเปลี่ยนเป็น SQL ในอนาคต)
MACHINE_DB = {
    # รหัสบาร์โค้ด หรือ Asset Tag ที่เราสมมติขึ้นมาแปะหน้าเครื่อง
    "WB#76": {
        "name": "Wire Bonder #76",
        "ip": "169.254.13.76",
        "port": 5001,
        "session_id": 0
    },
    "WB#81": {
        "name": "Wire Bonder #81",
        #old "ip": "192.168.10.81",
        "ip": "169.254.13.81",
        "port": 5000,
        "session_id": 0
    },
    "WB#78": {
        "name": "Wire Bonder #78",
        #old "ip": "192.168.10.78",
        "ip": "169.254.13.78",
        "port": 5001,
        "session_id": 0
    },
    "WB#82": {
        "name": "Wire Bonder #82",
        #"ip": "192.168.11.82",
        "ip": "169.254.13.82",
        "port": 5001,
        "session_id": 0
    },
    "WB#83": {
        "name": "Wire Bonder #83",
        #"ip": "192.168.11.83",
        "ip": "169.254.13.83",
        "port": 5001,
        "session_id": 0
    },
    "WB#84": {
        "name": "Wire Bonder #84",
        "ip": "169.254.13.84",
        #"ip": "192.168.11.84",
        "port": 5001,
        "session_id": 0
    }
}

SERIAL_TO_MACHINE = {
    "WB#76": "WB#76",
    "WB#81": "WB#81",
    "WB#78": "WB#78",
    "IX01-023": "WB#82",
    "IX01-025": "WB#83",
    "IX01-028": "WB#84"
}