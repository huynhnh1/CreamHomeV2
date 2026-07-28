# 🎂 Cream Home v2 – Tích Hợp Google Sheets

Landing page tiệm bánh ngọt cao cấp **Cream Home** – phiên bản với tính năng lưu đơn đặt bánh vào **Google Sheets**.

---

## ✨ Tính Năng Mới (so với v1)

- 📊 **Lưu đơn vào Google Sheets** – mỗi đơn submit tự động vào Sheet
- ⏳ **Loading state** – nút "Gửi" hiện trạng thái đang gửi
- 🔔 **Có thể nhận email thông báo** khi có đơn mới
- 🛡️ **Fallback an toàn** – nếu Sheets lỗi vẫn hiện success cho khách

---

## 🚀 Cách Chạy

### Bước 1: Cài đặt Google Sheets (bắt buộc để lưu data)

Xem file **[README-SHEETS.md](./README-SHEETS.md)** để thiết lập Google Apps Script.

### Bước 2: Mở website

Dự án là **HTML/CSS/JS thuần**, không cần cài đặt gì thêm.

```bash
# Double-click vào index.html
# Hoặc dùng Live Server trong VS Code
```

---

## 📁 Cấu Trúc Thư Mục

```
cream-home-sheets/
├── index.html           # Trang chính
├── style.css            # CSS – không đổi so với v1
├── script.js            # JS – thêm Google Sheets integration
├── README.md            # File này
├── README-SHEETS.md     # Hướng dẫn thiết lập Google Sheets
└── images/              # 12 ảnh AI-generated
```

---

## ⚙️ Cấu Hình Google Sheets

Mở `script.js`, tìm dòng đầu và paste URL Apps Script của bạn:

```javascript
// Trước
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';

// Sau khi cấu hình
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

Xem **[README-SHEETS.md](./README-SHEETS.md)** để biết cách lấy URL này.

---

## 📊 Dữ Liệu Được Lưu

Mỗi đơn đặt bánh sẽ lưu vào Google Sheet với các cột:

| Cột | Dữ liệu |
|-----|--------|
| Thời Gian | Timestamp đặt bánh |
| Họ Tên | Tên khách hàng |
| SĐT | Số điện thoại |
| Ngày Nhận | Ngày nhận bánh |
| Giờ Nhận | Giờ nhận bánh |
| Loại Bánh | Loại bánh đã chọn |
| Ghi Chú | Lời ghi trên bánh / ghi chú đặc biệt |
| Nguồn | `Cream Home Website` |

---

## 🔄 Cập Nhật Sau Này

```bash
git add .
git commit -m "Cập nhật URL Google Sheets"
git push
```

---

## 📞 Liên Hệ Tiệm

- 📍 123 Nguyễn Đình Chiểu, Quận 3, TP.HCM
- 📞 090 123 4567
- 📧 hello@creamhome.vn
- 🕐 T2–T7: 8:00–20:00 | CN: 9:00–18:00

---

*Làm với ❤️ – Một chút ngọt ngào cho ngày thêm vui 🍰*
