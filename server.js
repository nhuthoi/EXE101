const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_2026_dl_marketing';

// Email Configuration (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'nkkhoi5@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'bqsw qxuy obnd sptg'
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠️ Email config error:', error.message);
  } else {
    console.log('✓ Email service configured successfully');
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✓ Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT NOT NULL,
      email TEXT NOT NULL,
      needs TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Table creation error:', err);
    else console.log('✓ Contacts table ready');
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT,
      action TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Analytics table error:', err);
    else console.log('✓ Analytics table ready');
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT
    )
  `, (err) => {
    if (err) console.error('Services table error:', err);
    else console.log('✓ Services table ready');
    // Insert default services
    insertDefaultServices();
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      platform TEXT,
      goal TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Campaigns table error:', err);
    else console.log('✓ Campaigns table ready');
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      business_name TEXT NOT NULL,
      contact_name TEXT,
      email TEXT,
      phone TEXT,
      service TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Clients table error:', err);
    else console.log('✓ Clients table ready');
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      business_type TEXT,
      is_admin BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Users table error:', err);
    else console.log('✓ Users table ready');
  });
}

// Insert default services
function insertDefaultServices() {
  const services = [
    { name: 'Chiến lược AI Marketing', description: 'Phân tích dữ liệu khách hàng, định vị đối tượng và tối ưu nội dung quảng cáo tự động.', category: 'AI' },
    { name: 'Thiết kế website thần tốc', description: 'Website responsive, thân thiện SEO và tích hợp nền tảng CRM để khách hàng tương tác ngay lập tức.', category: 'Web' },
    { name: 'Bảo mật dữ liệu', description: 'Đánh giá rủi ro, cấu hình SSL/TLS, bảo vệ form liên hệ và sao lưu định kỳ.', category: 'Security' },
    { name: 'Quản lý mạng xã hội', description: 'Nội dung sáng tạo, chạy quảng cáo tập trung và phân tích hiệu suất.', category: 'Social' }
  ];

  services.forEach(service => {
    db.run(
      `INSERT OR IGNORE INTO services (name, description, category) VALUES (?, ?, ?)`,
      [service.name, service.description, service.category],
      (err) => {
        if (err) console.error('Insert service error:', err);
      }
    );
  });
}

// Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Admin Check Middleware
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.is_admin) {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  });
};

// API Routes

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password, full_name, business_type } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password, full_name, business_type) VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, full_name, business_type],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username hoặc email đã tồn tại' });
          }
          return res.status(500).json({ error: 'Lỗi đăng ký' });
        }

        res.json({
          success: true,
          message: 'Đăng ký thành công! Vui lòng đăng nhập.',
          user_id: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng điền username và password' });
  }

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Lỗi máy chủ' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Username hoặc password không chính xác' });
      }

      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Username hoặc password không chính xác' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, is_admin: user.is_admin },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({
          success: true,
          message: 'Đăng nhập thành công',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            is_admin: user.is_admin
          }
        });

        db.run(`INSERT INTO analytics (page, action) VALUES (?, ?)`, ['login', `user_${user.id}_login`]);
      } catch (error) {
        res.status(500).json({ error: 'Lỗi đăng nhập' });
      }
    }
  );
});

// Get user profile
app.get('/api/profile', verifyToken, (req, res) => {
  db.get(
    `SELECT id, username, email, full_name, business_type, is_admin, created_at FROM users WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Lỗi lấy dữ liệu' });
      }
      res.json(user);
    }
  );
});

// Update user profile
app.put('/api/profile', verifyToken, (req, res) => {
  const { full_name, business_type } = req.body;

  db.run(
    `UPDATE users SET full_name = ?, business_type = ? WHERE id = ?`,
    [full_name, business_type, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Lỗi cập nhật' });
      }
      res.json({ success: true, message: 'Cập nhật thông tin thành công' });
    }
  );
});

// Get all services
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM services', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Submit contact form
app.post('/api/contact', (req, res) => {
  const { business_name, email, needs } = req.body;

  // Validate input
  if (!business_name || !email || !needs) {
    res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Email không hợp lệ' });
    return;
  }

  // Insert into database
  db.run(
    `INSERT INTO contacts (business_name, email, needs) VALUES (?, ?, ?)`,
    [business_name, email, needs],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Lỗi lưu dữ liệu' });
        return;
      }

      res.json({
        success: true,
        message: 'Cảm ơn bạn! Yêu cầu của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ trong vòng 24 giờ.',
        contact_id: this.lastID
      });

      // Log analytics
      db.run(`INSERT INTO analytics (page, action) VALUES (?, ?)`, ['contact', 'form_submit']);
    }
  );
});

// Get all contacts (admin)
app.get('/api/admin/contacts', verifyAdmin, (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get analytics summary
app.get('/api/admin/analytics', verifyAdmin, (req, res) => {
  db.all('SELECT * FROM analytics ORDER BY timestamp DESC LIMIT 100', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Campaigns API
app.get('/api/campaigns', verifyToken, (req, res) => {
  db.all('SELECT * FROM campaigns WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/campaigns', verifyToken, (req, res) => {
  const { name, platform, goal, start_date, end_date } = req.body;
  if (!name || !platform) {
    return res.status(400).json({ error: 'Tên chiến dịch và nền tảng là bắt buộc' });
  }

  db.run(
    `INSERT INTO campaigns (user_id, name, platform, goal, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, name, platform, goal, start_date, end_date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, campaign_id: this.lastID });
    }
  );
});

app.put('/api/campaigns/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, platform, goal, start_date, end_date, status } = req.body;

  db.run(
    `UPDATE campaigns SET name = ?, platform = ?, goal = ?, start_date = ?, end_date = ?, status = ? WHERE id = ? AND user_id = ?`,
    [name, platform, goal, start_date, end_date, status || 'active', id, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Chiến dịch không tồn tại hoặc không có quyền' });
      res.json({ success: true, message: 'Cập nhật chiến dịch thành công' });
    }
  );
});

app.delete('/api/campaigns/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM campaigns WHERE id = ? AND user_id = ?', [id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Chiến dịch không tồn tại hoặc không có quyền' });
    res.json({ success: true, message: 'Đã xóa chiến dịch' });
  });
});

// Clients API
app.get('/api/clients', verifyToken, (req, res) => {
  db.all('SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/clients', verifyToken, (req, res) => {
  const { business_name, contact_name, email, phone, service, notes } = req.body;
  if (!business_name || !email) {
    return res.status(400).json({ error: 'Tên doanh nghiệp và email là bắt buộc' });
  }

  db.run(
    `INSERT INTO clients (user_id, business_name, contact_name, email, phone, service, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, business_name, contact_name, email, phone, service, notes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, client_id: this.lastID });
    }
  );
});

app.put('/api/clients/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { business_name, contact_name, email, phone, service, notes, status } = req.body;

  db.run(
    `UPDATE clients SET business_name = ?, contact_name = ?, email = ?, phone = ?, service = ?, notes = ?, status = ? WHERE id = ? AND user_id = ?`,
    [business_name, contact_name, email, phone, service, notes, status || 'pending', id, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Khách hàng không tồn tại hoặc không có quyền' });
      res.json({ success: true, message: 'Cập nhật khách hàng thành công' });
    }
  );
});

app.delete('/api/clients/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM clients WHERE id = ? AND user_id = ?', [id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Khách hàng không tồn tại hoặc không có quyền' });
    res.json({ success: true, message: 'Đã xóa khách hàng' });
  });
});

// Log page view
app.post('/api/analytics', (req, res) => {
  const { page } = req.body;
  db.run(
    `INSERT INTO analytics (page, action) VALUES (?, ?)`,
    [page, 'page_view'],
    (err) => {
      if (err) console.error('Analytics log error:', err);
      res.json({ success: true });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'DL Marketing API v1.0'
  });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║ DL Marketing Server - Digital Marketing AI     ║
║ Đồng bằng sông Cửu Long                        ║
║ Bảo mật & AI Marketing cho doanh nghiệp nhỏ    ║
╚════════════════════════════════════════════════╝

✓ Server running at http://localhost:${PORT}
✓ API documentation: http://localhost:${PORT}/api
✓ Database: SQLite (database.db)
  `);
});

app.get('/api/admin/campaigns', verifyAdmin, (req, res) => {
  const query = `
    SELECT campaigns.*, users.username as owner_name 
    FROM campaigns 
    JOIN users ON campaigns.user_id = users.id 
    ORDER BY campaigns.created_at DESC`;
    
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Admin: Lấy tất cả khách hàng của tất cả người dùng
app.get('/api/admin/clients', verifyAdmin, (req, res) => {
  const query = `
    SELECT clients.*, users.username as owner_name 
    FROM clients 
    JOIN users ON clients.user_id = users.id 
    ORDER BY clients.created_at DESC`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Admin: lấy tất cả user
app.get('/api/admin/users', verifyAdmin, (req, res) => {
  db.all(
    `SELECT id, username, email, full_name, business_type, is_admin, created_at 
     FROM users 
     ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Database close error:', err);
    console.log('\n✓ Server stopped gracefully');
    process.exit(0);
  });
});
