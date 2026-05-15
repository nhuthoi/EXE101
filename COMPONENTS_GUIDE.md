# 🎯 DL Marketing - Production Ready

## ✅ Các tính năng đã sẵn sàng

### 1. **Email Notifications**
- ✅ Liên hệ form tự động gửi email về: `nkkhoi5@gmail.com`
- ✅ Chiến dịch mới tự động thông báo qua email
- ✅ Thực time notifications

### 2. **Admin Account**
```
Username: adminFptu_EXE101
Email: nkkhoi5@gmail.com
Password: Admin@fptuEXE101
```
Truy cập: http://localhost:3000/auth.html

### 3. **Modular Components** (`/components` folder)

#### `api.js` - Centralized API calls
```javascript
import { API } from './components/api.js';

// Login
const result = await API.login('username', 'password');

// Create campaign
await API.createCampaign('Campaign Name', 'facebook', 'Goal', '2024-01-01', '2024-01-31');

// Create client
await API.createClient('Business Name', 'Contact', 'email@example.com', '0912345678', 'Social', 'Notes');

// Get all campaigns
const campaigns = await API.getCampaigns();

// Delete campaign
await API.deleteCampaign(campaignId);
```

#### `auth.js` - Authentication helpers
```javascript
import { Auth } from './components/auth.js';

// Check login
if (Auth.isLoggedIn()) {
  const user = Auth.getUser();
  console.log(user.username);
}

// Require login
Auth.requireLogin();

// Logout
Auth.logout();
```

#### `notifications.js` - Toast notifications
```javascript
import { Notification } from './components/notifications.js';

Notification.success('Operation successful!');
Notification.error('Something went wrong');
Notification.warning('Warning message');
Notification.info('Info message');
```

#### `campaigns-manager.js` - Campaign management
```javascript
import { CampaignsManager } from './components/campaigns-manager.js';

// Load campaigns
await CampaignsManager.load();

// Get all
const all = CampaignsManager.getAll();

// Create
await CampaignsManager.create('Name', 'facebook', 'Goal', '2024-01-01', '2024-01-31');

// Update
await CampaignsManager.update(id, 'Name', 'facebook', 'Goal', '2024-01-01', '2024-01-31', 'active');

// Delete
await CampaignsManager.delete(id);

// Search
const campaign = CampaignsManager.getById(id);
```

#### `clients-manager.js` - Client management
```javascript
import { ClientsManager } from './components/clients-manager.js';

// Load clients
await ClientsManager.load();

// Create
await ClientsManager.create('Business', 'Contact', 'email@ex.com', '0912345678', 'Service', 'Notes');

// Update
await ClientsManager.update(id, 'Business', 'Contact', 'email@ex.com', '0912345678', 'Service', 'Notes', 'active');

// Delete
await ClientsManager.delete(id);

// Search
const filtered = ClientsManager.search('ABC');

// Get
const client = ClientsManager.getById(id);
```

## 🚀 Quick Start

### 1. Server đang chạy
```bash
✓ Running at http://localhost:3000
✓ Email service: Configured
✓ Database: SQLite
```

### 2. Test contact form
Truy cập http://localhost:3000 → Scroll xuống form → Gửi liên hệ
→ Email sẽ được gửi đến `nkkhoi5@gmail.com`

### 3. Login & Test features
1. Truy cập http://localhost:3000/auth.html
2. Click "Đăng ký ngay" để tạo account mới
3. Hoặc login với admin account (xem trên)
4. Truy cập Dashboard → Campaigns, Clients

### 4. Sử dụng Components (trong code mới)
Tạo file HTML mới với `type="module"`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <script type="module">
    import { API } from './components/api.js';
    import { Notification } from './components/notifications.js';
    import { Auth } from './components/auth.js';

    // Your code here
    if (Auth.isLoggedIn()) {
      const campaigns = await API.getCampaigns();
      Notification.success('Loaded ' + campaigns.length + ' campaigns');
    }
  </script>
</body>
</html>
```

## 📊 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | ❌ | Đăng ký |
| POST | `/api/login` | ❌ | Đăng nhập |
| GET | `/api/profile` | ✅ | Lấy profile |
| PUT | `/api/profile` | ✅ | Cập nhật profile |
| GET | `/api/services` | ❌ | Danh sách dịch vụ |
| POST | `/api/contact` | ❌ | Gửi liên hệ (→ email) |
| GET | `/api/campaigns` | ✅ | Danh sách campaigns |
| POST | `/api/campaigns` | ✅ | Tạo campaign |
| PUT | `/api/campaigns/:id` | ✅ | Cập nhật campaign |
| DELETE | `/api/campaigns/:id` | ✅ | Xóa campaign |
| GET | `/api/clients` | ✅ | Danh sách clients |
| POST | `/api/clients` | ✅ | Tạo client |
| PUT | `/api/clients/:id` | ✅ | Cập nhật client |
| DELETE | `/api/clients/:id` | ✅ | Xóa client |
| GET | `/api/admin/contacts` | ✅🔐 | Tất cả liên hệ |
| GET | `/api/admin/analytics` | ✅🔐 | Analytics |

## 📁 Project Structure

```
EXE101_Project/
├── index.html              # Landing page
├── auth.html              # Login/Register
├── dashboard.html         # Dashboard
├── campaigns.html         # Campaign manager
├── clients.html          # Client manager
├── portfolio.html        # Portfolio
├── pricing.html          # Pricing
├── styles.css            # Global styles
├── script.js             # Global JS
├── server.js             # Express backend
├── package.json          # Dependencies
├── .env                  # Environment config
├── database.db           # SQLite database
├── components/           # ← NEW: Modular components
│   ├── api.js           # API calls
│   ├── auth.js          # Auth helpers
│   ├── notifications.js # Toast notifications
│   ├── campaigns-manager.js
│   └── clients-manager.js
└── setup.js             # Setup script (run once)
```

## 🔐 Bảo mật

- ✅ JWT Authentication (7-day expiry)
- ✅ bcryptjs password hashing (10 rounds)
- ✅ CORS enabled
- ✅ Input validation
- ✅ Admin-only endpoints protected
- ✅ Email verification ready

## 🐛 Troubleshooting

**Port 3000 đã sử dụng?**
```bash
PORT=3001 npm start
```

**Database bị lock?**
```bash
rm database.db
npm start  # Sẽ tạo DB mới
```

**Email không gửi?**
- Kiểm tra `.env` có Gmail App Password đúng không
- Gmail cần 2FA enable
- Kiểm tra lại email: nkkhoi5@gmail.com

## 📞 Support

Server running at: http://localhost:3000
Admin login: http://localhost:3000/auth.html

---

**Ready for production! 🚀**
