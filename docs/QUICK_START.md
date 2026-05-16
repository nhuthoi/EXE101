## 🚀 Hướng dẫn Chạy Nhanh

### Bước 1: Cài đặt Dependencies
```bash
npm install
```

### Bước 2: Chạy Server
```bash
npm start
```

Bạn sẽ thấy thông báo:
```
╔════════════════════════════════════════════════╗
║ 🚀 DL Marketing Server - Digital Marketing AI  ║
║ 📍 Đồng bằng sông Cửu Long                      ║
║ 🔒 Bảo mật & AI Marketing cho doanh nghiệp nhỏ ║
╚════════════════════════════════════════════════╝

✓ Server running at http://localhost:3000
✓ Database: SQLite (database.db)
```

### Bước 3: Truy cập Website

- **Trang chủ:** http://localhost:3000
- **Đăng nhập/Đăng ký:** http://localhost:3000/auth.html
- **Dashboard:** http://localhost:3000/dashboard.html (sau khi đăng nhập)

## 📌 Tài khoản Test

### Đăng ký tài khoản mới
1. Truy cập http://localhost:3000/auth.html
2. Chọn "Đăng ký ngay"
3. Điền thông tin và click "Đăng ký"

### Admin Account (Tạo thủ công)
Để tạo tài khoản admin, dùng SQLite CLI hoặc tool:

```sql
UPDATE users SET is_admin = 1 WHERE username = 'your_username';
```

## 🔍 Kiểm tra API

### Test endpoint POST (gửi liên hệ)
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "ABC Company",
    "email": "contact@abc.com",
    "needs": "Cần dịch vụ marketing"
  }'
```

### Test endpoint GET (xem dịch vụ)
```bash
curl http://localhost:3000/api/services
```

## 📁 Cấu trúc File

```
.
├── index.html          ← Trang chủ
├── auth.html           ← Đăng nhập/Đăng ký
├── dashboard.html      ← Bảng điều khiển (cần token)
├── styles.css          ← CSS chung
├── script.js           ← JavaScript frontend
├── server.js           ← Backend Node.js
├── package.json        ← Dependencies
└── database.db         ← Database SQLite (tự tạo)
```

## 🛑 Dừng Server
```bash
Ctrl + C
```

## ⚠️ Thường gặp

**Lỗi: "EADDRINUSE: address already in use"**
- Port 3000 đang được sử dụng
- Sửa: Thay PORT trong .env hoặc `PORT=3001 npm start`

**Lỗi: Không kết nối được database**
- Chắc chắn bạn đang chạy từ thư mục project
- Xóa `database.db` và chạy lại

**Dashboard trắng sau đăng nhập**
- Xóa localStorage: F12 → Storage → Clear All
- Đăng nhập lại

---

✅ Xong! Bây giờ bạn có website hoàn chỉnh với authentication!
