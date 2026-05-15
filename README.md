# 🚀 DL Marketing - Digital Marketing AI & Bảo mật

Website thần tốc cho dịch vụ Digital Marketing tại Đồng bằng sông Cửu Long, tập trung vào AI và bảo mật dữ liệu.

## 📋 Tính năng

### Frontend
- ✅ Landing page responsive hiện đại
- ✅ Hệ thống đăng ký/đăng nhập (auth.html)
- ✅ Dashboard cá nhân (dashboard.html)
- ✅ **Campaign Manager** - Quản lý chiến dịch social media (campaigns.html)
- ✅ **AI Content Generator** - Tạo nội dung hỗ trợ AI
- ✅ **Client Management** - Quản lý khách hàng (clients.html)
- ✅ **Portfolio & Case Studies** - Hiển thị các dự án thành công (portfolio.html)
- ✅ **Pricing Page** - Bảng giá các gói dịch vụ (pricing.html)
- ✅ Form liên hệ tích hợp API
- ✅ Giao diện tối (Dark Mode)
- ✅ Tối ưu hóa SEO

### Backend
- ✅ API REST với Express.js
- ✅ Xác thực JWT (đăng nhập/đăng ký)
- ✅ Database SQLite
- ✅ Quản lý người dùng
- ✅ Quản lý liên hệ
- ✅ Phân tích hoạt động
- ✅ Phân quyền Admin

### Bảo mật
- ✅ Mật khẩu mã hóa bcryptjs
- ✅ JWT Token xác thực
- ✅ CORS bảo vệ
- ✅ Validation dữ liệu
- ✅ Email validation

## 🛠 Cài đặt

### Yêu cầu
- Node.js >= 14
- npm hoặc yarn

### Các bước cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Cấu hình biến môi trường (.env):**
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_2026_dl_marketing
```

3. **Chạy server:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 🎯 Hướng dẫn Sử dụng Các Tính Năng

### 1. Đăng nhập / Đăng ký
- Truy cập `http://localhost:3000` → Click "Đăng nhập"
- Chọn "Đăng ký ngay" để tạo tài khoản mới
- Nhập email, mật khẩu, thông tin doanh nghiệp

### 2. Dashboard Cá nhân (dashboard.html)
- Sau đăng nhập, bạn vào được Dashboard
- Xem và chỉnh sửa thông tin profile
- Xem danh sách các dịch vụ
- Quản lý các nút điều hướng

### 3. Campaign Manager (campaigns.html)
- **Tab Campaigns**: Tạo, chỉnh sửa, xóa chiến dịch
- **Tab AI Content**: Tạo nội dung tự động với AI
  - Chọn loại nội dung (Social Post, Email, Article)
  - Chọn tone (Formal, Casual, Professional)
  - Nhập topic → AI sẽ tạo nội dung
- **Tab Analytics**: Xem thống kê hiệu suất
- **Tab Branding**: Tạo brand guide với color picker

### 4. Client Manager (clients.html)
- Tìm kiếm khách hàng theo tên
- Thêm khách hàng mới
- Xem và cập nhật thông tin khách hàng
- Theo dõi trạng thái (Active/Inactive)

### 5. Portfolio (portfolio.html)
- Xem các dự án thành công
- Lọc theo danh mục (Retail, Service, Digital)
- Xem chi tiết case study và kết quả

### 6. Pricing (pricing.html)
- Xem 3 gói dịch vụ: Starter, Professional, Enterprise
- So sánh chi tiết các tính năng
- Xem FAQ về dịch vụ
- Chọn gói phù hợp

## 🌐 Cấu trúc Project

```
EXE101_Project/
├── index.html              # Trang chủ
├── auth.html               # Trang đăng nhập/đăng ký
├── dashboard.html          # Trang quản lý cá nhân
├── campaigns.html          # Quản lý chiến dịch + AI Content + Analytics
├── clients.html            # Quản lý khách hàng
├── portfolio.html          # Portfolio & Case Studies
├── pricing.html            # Bảng giá dịch vụ
├── styles.css              # Stylesheet chính
├── script.js               # JavaScript frontend
├── server.js               # Backend Express
├── package.json            # Dependencies
├── .env                    # Biến môi trường
├── database.db            # Database SQLite (tự tạo)
└── README.md              # Hướng dẫn này
```

## 📡 API Endpoints

### Xác thực (Authentication)

#### Đăng ký
```http
POST /api/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Tên đầy đủ",
  "business_type": "retail"
}
```

#### Đăng nhập
```http
POST /api/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "full_name": "Tên đầy đủ",
    "is_admin": false
  }
}
```

### Hồ sơ (Profile)

#### Lấy thông tin hồ sơ
```http
GET /api/profile
Authorization: Bearer {token}
```

#### Cập nhật hồ sơ
```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "full_name": "Tên mới",
  "business_type": "service"
}
```

### Dịch vụ (Services)

#### Lấy danh sách dịch vụ
```http
GET /api/services
```

### Liên hệ (Contacts)

#### Gửi yêu cầu liên hệ
```http
POST /api/contact
Content-Type: application/json

{
  "business_name": "Tên doanh nghiệp",
  "email": "contact@business.com",
  "needs": "Mô tả nhu cầu"
}
```

### Admin

#### Xem tất cả liên hệ (Admin only)
```http
GET /api/admin/contacts
Authorization: Bearer {admin_token}
```

#### Xem phân tích (Admin only)
```http
GET /api/admin/analytics
Authorization: Bearer {admin_token}
```

## 🔐 Bảo mật

### Cách sử dụng JWT Token

1. **Sau đăng nhập, lưu token:**
```javascript
localStorage.setItem('token', data.token);
```

2. **Gửi token với mỗi request cần xác thực:**
```javascript
fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Loại người dùng

- **User thường**: Có thể xem profile, dịch vụ, gửi yêu cầu liên hệ
- **Admin**: Có thể xem tất cả liên hệ, phân tích hoạt động

## 📊 Database Schema

### Bảng users
```sql
id (INTEGER PRIMARY KEY)
username (TEXT UNIQUE)
email (TEXT UNIQUE)
password (TEXT)
full_name (TEXT)
business_type (TEXT)
is_admin (BOOLEAN)
created_at (DATETIME)
```

### Bảng contacts
```sql
id (INTEGER PRIMARY KEY)
business_name (TEXT)
email (TEXT)
needs (TEXT)
created_at (DATETIME)
```

### Bảng services
```sql
id (INTEGER PRIMARY KEY)
name (TEXT)
description (TEXT)
category (TEXT)
```

### Bảng analytics
```sql
id (INTEGER PRIMARY KEY)
page (TEXT)
action (TEXT)
timestamp (DATETIME)
```

## 🎨 Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa các biến CSS trong `styles.css`:
```css
:root {
  --blue: #3db2ff;
  --cyan: #69e2ff;
  --accent: #82ffca;
  /* ... */
}
```

### Thêm dịch vụ mới
Sửa trong `server.js`, hàm `insertDefaultServices()`:
```javascript
const services = [
  { name: 'Dịch vụ mới', description: '...', category: 'Category' },
  // ...
];
```

## 🚀 Triển khai (Deployment)

### Trên Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Trên VPS
```bash
npm install
npm start
# Hoặc sử dụng PM2
pm2 start server.js --name "dl-marketing"
```

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Thay đổi PORT trong .env hoặc chạy:
PORT=3001 npm start
```

### Database bị khóa
```bash
# Xóa file database.db và chạy lại
npm start
```

### Token không hợp lệ
- Kiểm tra JWT_SECRET trong .env
- Đảm bảo token chưa hết hạn (7 ngày)
- Xóa localStorage và đăng nhập lại

## 📝 License

MIT License - Tự do sử dụng cho mục đích thương mại và cá nhân

## 👨‍💻 Hỗ trợ

Liên hệ: lienhe@dlmarketing.vn

---

**DL Marketing Cửu Long** - Đồng hành cùng doanh nghiệp nhỏ thành công! 🚀
