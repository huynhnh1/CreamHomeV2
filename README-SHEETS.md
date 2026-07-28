# 📊 Hướng Dẫn Thiết Lập Google Sheets

Hướng dẫn này giúp bạn kết nối form đặt bánh với Google Sheets.  
Mỗi lần khách submit → dữ liệu **tự động lưu vào Sheet** của bạn.

---

## Bước 1: Tạo Google Sheet

1. Vào **[sheets.google.com](https://sheets.google.com)** → Tạo bảng tính mới
2. Đặt tên sheet: **`Cream Home – Đơn Đặt Bánh`**
3. Ở hàng 1, điền các tiêu đề cột này (theo đúng thứ tự):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Thời Gian | Họ Tên | SĐT | Ngày Nhận | Giờ Nhận | Loại Bánh | Ghi Chú | Nguồn |

---

## Bước 2: Mở Apps Script

Trong Google Sheet → click menu **Extensions (Tiện ích mở rộng) → Apps Script**

---

## Bước 3: Paste Code Apps Script

Xóa hết code cũ, paste đoạn code sau vào:

```javascript
function doPost(e) {
  try {
    // Lấy sheet đầu tiên
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    // Parse data từ request
    var data = JSON.parse(e.postData.contents);
    
    // Thêm hàng mới vào sheet
    sheet.appendRow([
      data.timestamp  || new Date().toLocaleString("vi-VN"),
      data.name       || "",
      data.phone      || "",
      data.pickupDate || "",
      data.pickupTime || "Chưa chọn",
      data.cakeType   || "",
      data.message    || "Không có",
      data.source     || "Website",
    ]);
    
    // Trả về kết quả thành công
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Đã lưu đơn hàng!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Trả về lỗi
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm test – chạy thủ công để kiểm tra kết nối
function testSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([
    new Date().toLocaleString("vi-VN"),
    "Test Khách Hàng",
    "090 000 0000",
    "2024-12-25",
    "10:00",
    "Bánh Kem Dâu Tây Hokkaido / Hokkaido Strawberry Cream Cake",
    "Chúc mừng sinh nhật nhé!",
    "Test",
  ]);
  Logger.log("✅ Test thành công! Kiểm tra Google Sheet của bạn.");
}
```

---

## Bước 4: Lưu và Deploy

1. Click **Save** (Ctrl+S) → Đặt tên project: `CreamHome Form Handler`
2. Click **Deploy (Triển khai) → New deployment (Triển khai mới)**
3. Click ⚙️ bên cạnh "Select type" → chọn **Web app**
4. Điền:
   - **Description**: `Cream Home Form v1`
   - **Execute as (Thực thi bằng)**: **`Me (email của bạn)`**
   - **Who has access (Ai có quyền truy cập)**: **`Anyone (Bất kỳ ai)`** ← **Quan trọng!**
5. Click **Deploy**
6. **Cấp quyền** khi được hỏi (Review permissions → Advanced → Go to CreamHome Form → Allow)
7. **Copy URL** dạng: `https://script.google.com/macros/s/AKfycb.../exec`

---

## Bước 5: Paste URL vào script.js

Mở file `script.js`, tìm dòng đầu:

```javascript
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
```

Thay bằng URL vừa copy:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

**Lưu file** → **Push lên GitHub** → **Xong!** 🎉

---

## Bước 6: Test thử

1. Mở website → Điền form đặt bánh → Submit
2. Vào Google Sheet → Kiểm tra xem có hàng mới không
3. Nếu chưa thấy → Đợi 5-10 giây rồi refresh Sheet

---

## ✅ Checklist

- [ ] Đã tạo Google Sheet với 8 cột header
- [ ] Đã paste code vào Apps Script
- [ ] Đã Deploy với **Execute as: Me** và **Access: Anyone**
- [ ] Đã cấp quyền cho Apps Script
- [ ] Đã copy URL vào `script.js`
- [ ] Đã test thử và thấy data trong Sheet

---

## 🔄 Cập nhật Apps Script (khi cần sửa)

Nếu bạn sửa code trong Apps Script sau này:
- **Phải tạo deployment mới** (không thể edit deployment cũ)
- Click **Deploy → New deployment** → làm lại từ bước 4
- Copy URL mới → paste vào `script.js`

---

## 🔔 Nhận Email Thông Báo Khi Có Đơn Mới

Trong Apps Script, thêm vào cuối hàm `doPost`:

```javascript
// Gửi email thông báo
MailApp.sendEmail({
  to: "your-email@gmail.com",  // ← Thay bằng email của bạn
  subject: "🎂 Cream Home – Đơn đặt bánh mới từ " + data.name,
  body: [
    "Khách hàng: " + data.name,
    "SĐT: " + data.phone,
    "Ngày nhận: " + data.pickupDate + " " + (data.pickupTime || ""),
    "Loại bánh: " + data.cakeType,
    "Ghi chú: " + (data.message || "Không có"),
    "Thời gian đặt: " + data.timestamp,
  ].join("\n")
});
```

---

*Nếu gặp khó khăn, chụp màn hình lỗi và hỏi Cream Home dev team nhé!* 🍰
