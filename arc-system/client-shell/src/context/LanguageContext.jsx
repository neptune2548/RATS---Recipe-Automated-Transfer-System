import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  TH: {
    // Navbar
    mems_dashboard: 'แดชบอร์ด MEMS',
    rats_command: 'ระบบ RATS',
    system_status: 'สถานะระบบ',
    role: 'สิทธิ์: ',
    guest: 'ผู้เยี่ยมชม (Guest)',
    operator: 'พนักงานปฏิบัติการ (Operator)',
    technician: 'ช่างเทคนิค (Technician)',
    administrator: 'ผู้ดูแลระบบ (Admin)',
    switch_lang: 'ภาษา',

    // RATS View
    rats_header_title: 'ควบคุมระบบโอนย้ายสูตร RATS',
    rats_sub_title: 'ระบบส่งถ่ายสูตรการผลิตอัตโนมัติสำหรับเครื่องเชื่อมสายทอง',
    python_online: 'ระบบ PYTHON ออนไลน์',
    python_offline: 'ระบบ PYTHON ออฟไลน์',
    rats_offline_banner: 'ระบบ RATS Python ออฟไลน์อยู่: กรุณาเปิดไฟล์ start_command_center.bat หรือ python client-rats/main.py เพื่อเชื่อมต่อเครื่องจักร',
    scan_placeholder: 'สแกนบาร์โค้ด / ซีเรียลนัมเบอร์',
    scan_btn: 'สแกน',
    bonder_fleet: 'รายการเครื่อง Wire Bonder',
    machines_count: ' เครื่อง',
    selected_machine: 'เครื่องที่เลือก: ',
    protocol_hsms: 'การเชื่อมต่อ: แอคทีฟ',
    machine_status: 'สถานะเครื่องจักร',
    current_recipe: 'สูตรการผลิตปัจจุบัน',
    link_status: 'สถานะการเชื่อมต่อ',
    test_link: '1. ทดสอบการเชื่อมต่อ',
    pull_recipe: '2. ดึงสูตรการผลิต',
    push_recipe: '3. ส่งสูตรการผลิต',
    push_req_permission: 'จำเป็นต้องใช้สิทธิ์ช่างเทคนิค (Technician) ขึ้นไป เพื่อส่งสูตรการผลิต',
    target_push: 'สูตรการผลิตที่จะส่งไปยังเครื่อง:',
    custom_recipe_placeholder: 'หรือพิมพ์ชื่อสูตรที่ต้องการ...',
    event_log_title: 'บันทึกเหตุการณ์ระบบ (ตรวจสอบแบบเรียลไทม์)',
    purge_log: 'ล้างบันทึก',
    no_logs: 'ยังไม่มีบันทึกเหตุการณ์',

    // MEMS View
    mems_title: 'แดชบอร์ดประสิทธิภาพเครื่องจักร MEMS',
    mems_sub: 'ระบบติดตาม OEE ประสิทธิภาพ และสถานะการทำงานแบบเรียลไทม์',
    oee_overall: 'ภาพรวม OEE',
    active_machines: 'เครื่องจักรที่ทำงานอยู่',
    total_output: 'ผลผลิตรวม',

    // System View
    system_title: 'สถานะและการตั้งค่าระบบ ARC',
    security_level: 'ระดับความปลอดภัยและสิทธิ์การใช้งาน',
    roles_permissions: 'ตารางสิทธิ์ผู้ใช้งาน',

    // Common
    online: 'ออนไลน์',
    offline: 'ออฟไลน์',
    checking: 'กำลังตรวจสอบ...',
    unchecked: 'ยังไม่ได้ตรวจสอบ',
    none: 'ไม่มี',

    // Logoff Modal
    logoff_title: 'ยืนยันการออกจากระบบ',
    logoff_confirm_text: 'คุณต้องการออกจากระบบและกลับสู่โหมดผู้เยี่ยมชม (Guest) หรือไม่?',
    cancel: 'ยกเลิก',
    confirm_logoff: 'ยืนยันออกจากระบบ',
  },
  EN: {
    // Navbar
    mems_dashboard: 'MEMS DASHBOARD',
    rats_command: 'RATS COMMAND',
    system_status: 'SYSTEM STATUS',
    role: 'ROLE: ',
    guest: 'Guest',
    operator: 'Operator',
    technician: 'Technician',
    administrator: 'Administrator',
    switch_lang: 'Language',

    // RATS View
    rats_header_title: 'RATS Recipe Control',
    rats_sub_title: 'Recipe Automated Transfer System for Wire Bonder Fleet',
    python_online: 'PYTHON BACKEND ONLINE',
    python_offline: 'PYTHON BACKEND OFFLINE',
    rats_offline_banner: 'RATS Python Engine is offline: Start the backend server by running start_command_center.bat or python client-rats/main.py to connect to live wire bonders.',
    scan_placeholder: 'Scan Barcode / Serial Number',
    scan_btn: 'SCAN',
    bonder_fleet: 'WIRE BONDER FLEET',
    machines_count: ' MACHINES',
    selected_machine: 'SELECTED MACHINE: ',
    protocol_hsms: 'Connection: Active',
    machine_status: 'MACHINE STATUS',
    current_recipe: 'CURRENT RECIPE PROGRAM',
    link_status: 'LINK STATUS',
    test_link: '1. TEST LINK',
    pull_recipe: '2. PULL RECIPE',
    push_recipe: '3. PUSH RECIPE',
    push_req_permission: 'Technician role or higher required to execute Recipe Push.',
    target_push: 'Target Recipe Program to Push:',
    custom_recipe_placeholder: 'Or type custom program name...',
    event_log_title: 'SYSTEM EVENT LOG (REAL TIME AUDIT)',
    purge_log: 'PURGE LOG',
    no_logs: 'No event logs recorded yet.',

    // MEMS View
    mems_title: 'MEMS Machine Efficiency Monitor',
    mems_sub: 'Real-time OEE, Equipment Efficiency & Operation Telemetry',
    oee_overall: 'OVERALL OEE',
    active_machines: 'ACTIVE MACHINES',
    total_output: 'TOTAL OUTPUT',

    // System View
    system_title: 'ARC System Status & Configuration',
    security_level: 'Security Level & Access Control',
    roles_permissions: 'ROLES & PERMISSIONS TABLE',

    // Common
    online: 'ONLINE',
    offline: 'OFFLINE',
    checking: 'CHECKING...',
    unchecked: 'UNCHECKED',
    none: 'None',

    // Logoff Modal
    logoff_title: 'LOGOFF CONFIRMATION',
    logoff_confirm_text: 'Are you sure you want to log off and return to Guest mode?',
    cancel: 'CANCEL',
    confirm_logoff: 'CONFIRM LOGOFF',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('arc_language') || 'TH';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('arc_language', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'TH' ? 'EN' : 'TH';
    setLanguage(nextLang);
  };

  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.TH;
    return dict[key] || TRANSLATIONS.EN[key] || key;
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language.toLowerCase());
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
