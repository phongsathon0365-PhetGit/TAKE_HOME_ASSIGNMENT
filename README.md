# TAKE_HOME_ASSIGNMENT UI Automation

ชุดทดสอบ UI สำหรับเว็บ (https://www.saucedemo.com/) เขียนด้วย TypeScript และ Playwright Test

## แนวทางการออกแบบ

เลือกใช้ Page Object Model (POM) เพื่อแยกตัวเลือก element Locator และการทำงานแต่ละหน้าออกจากขั้นตอนและการตรวจสอบใน test:

- คลาสใน `tests/web-testing/pages/` รวม locator และ action ที่เกี่ยวข้องกับหน้า Login, Shopping Cart และ Checkout ไว้ด้วยกัน หาก selector ของหน้าเว็บเปลี่ยน จะปรับแก้ได้ในจุดที่เกี่ยวข้อง
- ไฟล์ใน `tests/web-testing/tests-web/` อธิบาย flow และตรวจผลลัพธ์ของแต่ละ scenario ทำให้เห็นจุดประสงค์ของ test ได้ชัด และนำ action ใน page object กลับมาใช้ซ้ำได้
- ข้อมูลที่ใช้ร่วมกัน เช่น credentials, base URL, ข้อความ และยอดเงิน เก็บไว้ใน `tests/web-testing/fixtures/testdata.local.json`; ข้อมูลเฉพาะของ checkout เช่น ข้อมูลผู้ซื้อและรายการสินค้าที่คาดหวังอยู่ใน test นั้น

ใช้ POM เฉพาะส่วนที่ช่วยลดการซ้ำและทำให้แก้ไขง่าย 

## Test scenarios

1. Login — ตรวจการเข้าสู่ระบบด้วยข้อมูลถูกต้อง การเปิดหน้า Inventory ข้อความ error เมื่อใช้ข้อมูลไม่ถูกต้อง และกรณี `locked_out_user`
2. Shopping Cart — เพิ่มสินค้า ตรวจชื่อและจำนวน แล้วลบสินค้าและตรวจผล
3. Checkout — กรอกข้อมูลผู้ซื้อ ตรวจรายการสินค้าและยอดรวม ยืนยันคำสั่งซื้อ และตรวจข้อความสำเร็จ

## การติดตั้งและรันทดสอบ

ต้องติดตั้ง Node.js และ npm ก่อน จาก root ของโปรเจกต์ รัน:

`bash`
npm ci
npx playwright install chromium
npx playwright test


หลังรันทดสอบ สามารถเปิด HTML report ได้ด้วย:

`bash`
npx playwright show-report


การตั้งค่าปัจจุบันรันทดสอบบน Chromium โดย Playwright config อยู่ที่ `playwright.config.ts`


