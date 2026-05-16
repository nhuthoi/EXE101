const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config({
  path: path.join(__dirname, '.env')
});

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET =
  process.env.JWT_SECRET || 'super_secret_key';

// ======================= EMAIL CONFIG =======================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

transporter.verify((error) => {
  if (error) {
    console.log('Email config error:', error.message);
  } else {
    console.log('✓ Email service configured successfully');
  }
});

// ======================= MIDDLEWARE =======================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ======================= DATABASE =======================
const db = new sqlite3.Database(
  path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✓ Connected to SQLite database');
    initDatabase();
  }
});

// ======================= INIT DATABASE =======================
function initDatabase() {
  db.serialize(() => {

    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_name TEXT NOT NULL,
        email TEXT NOT NULL,
        needs TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS analytics (

  id INTEGER PRIMARY KEY AUTOINCREMENT,

  user_id INTEGER,

  username TEXT,

  page TEXT,

  action TEXT,

  details TEXT,

  ip_address TEXT,

  user_agent TEXT,

  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP

)
    `);
   

    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        business_type TEXT,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    insertDefaultServices();

  });
}

// ======================= DEFAULT SERVICES =======================
function insertDefaultServices() {
  const services = [
    {
      name: 'Chiến lược AI Marketing',
      description:
        'Phân tích dữ liệu khách hàng và tối ưu quảng cáo.',
      category: 'AI'
    },
    {
      name: 'Thiết kế website',
      description:
        'Website responsive chuẩn SEO.',
      category: 'Web'
    },
    {
      name: 'Bảo mật dữ liệu',
      description:
        'SSL/TLS, backup và bảo vệ dữ liệu.',
      category: 'Security'
    },
    {
      name: 'Quản lý mạng xã hội',
      description:
        'Quản lý nội dung và quảng cáo social.',
      category: 'Social'
    }
  ];

  services.forEach((service) => {
    db.run(
      `INSERT OR IGNORE INTO services (name, description, category)
       VALUES (?, ?, ?)`,
      [service.name, service.description, service.category]
    );
  });
}

// ======================= AUTH MIDDLEWARE =======================
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'No token provided'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token'
      });
    }

    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.is_admin) {
      next();
    } else {
      res.status(403).json({
        error: 'Admin access required'
      });
    }
  });
};

// ======================= AUTH APIs =======================

// REGISTER
app.post('/api/register', async (req, res) => {
  const {
    username,
    email,
    password,
    full_name,
    business_type
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'Vui lòng điền đầy đủ thông tin'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users
      (username, email, password, full_name, business_type)
      VALUES (?, ?, ?, ?, ?)`,
      [
        username,
        email,
        hashedPassword,
        full_name,
        business_type
      ],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({
              error: 'Username hoặc email đã tồn tại'
            });
          }

          return res.status(500).json({
            error: 'Lỗi đăng ký'
          });
        }

        res.json({
          success: true,
          message: 'Đăng ký thành công',
          user_id: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error: 'Lỗi server'
    });
  }
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({
          error: 'Lỗi server'
        });
      }

      if (!user) {
        return res.status(401).json({
          error: 'Sai tài khoản hoặc mật khẩu'
        });
      }

      const validPassword = await bcrypt.compare(
        password,
        user.password
      );

      if (!validPassword) {
        return res.status(401).json({
          error: 'Sai tài khoản hoặc mật khẩu'
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          is_admin: user.is_admin
        },
        JWT_SECRET,
        {
          expiresIn: '7d'
        }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          is_admin: user.is_admin
        }
      });
    }
  );
});

// PROFILE
app.get('/api/profile', verifyToken, (req, res) => {
  db.get(
    `SELECT id, username, email, full_name,
    business_type, is_admin, created_at
    FROM users WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(user);
    }
  );
});

// UPDATE PROFILE
app.put('/api/profile', verifyToken, (req, res) => {
  const { full_name, business_type } = req.body;

  db.run(
    `UPDATE users
    SET full_name = ?, business_type = ?
    WHERE id = ?`,
    [full_name, business_type, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật thành công'
      });
    }
  );
});

// ======================= SERVICES =======================
app.get('/api/services', (req, res) => {
  db.all(`SELECT * FROM services`, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);
  });
});

// ======================= CONTACT =======================
app.post('/api/contact', async (req, res) => {
  const { business_name, email, needs } = req.body;

  if (!business_name || !email || !needs) {
    return res.status(400).json({
      error: 'Vui lòng điền đầy đủ thông tin'
    });
  }

  db.run(
    `INSERT INTO contacts
    (business_name, email, needs)
    VALUES (?, ?, ?)`,
    [business_name, email, needs],
    async function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      // SEND EMAIL
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Marketing FPTU - Tiếp nhận yêu cầu',
          html: `
            <h2>Xin chào ${business_name}</h2>
            <p>Chúng tôi đã nhận được yêu cầu của bạn.</p>
            <p><b>Nhu cầu:</b> ${needs}</p>
            <p>Chúng tôi sẽ liên hệ sớm nhất.</p>
          `
        });

        console.log('✓ Email sent');
      } catch (mailError) {
        console.log('Email send error:', mailError.message);
      }

      res.json({
        success: true,
        message: 'Gửi liên hệ thành công',
        contact_id: this.lastID
      });
    }
  );
});

// ======================= CAMPAIGNS =======================
app.get('/api/campaigns', verifyToken, (req, res) => {
  db.all(
    `SELECT * FROM campaigns
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

app.post('/api/campaigns', verifyToken, (req, res) => {
  const {
    name,
    platform,
    goal,
    start_date,
    end_date
  } = req.body;

  db.run(
    `INSERT INTO campaigns
    (user_id, name, platform, goal, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      name,
      platform,
      goal,
      start_date,
      end_date
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        success: true,
        campaign_id: this.lastID
      });
    }
  );
});

app.put('/api/campaigns/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const {
    name,
    platform,
    goal,
    start_date,
    end_date,
    status
  } = req.body;

  db.run(
    `UPDATE campaigns
    SET name = ?, platform = ?, goal = ?,
    start_date = ?, end_date = ?, status = ?
    WHERE id = ? AND user_id = ?`,
    [
      name,
      platform,
      goal,
      start_date,
      end_date,
      status,
      id,
      req.user.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật thành công'
      });
    }
  );
});

app.delete('/api/campaigns/:id', verifyToken, (req, res) => {
  db.run(
    `DELETE FROM campaigns
    WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Đã xóa chiến dịch'
      });
    }
  );
});

// ======================= CLIENTS =======================
app.get('/api/clients', verifyToken, (req, res) => {
  db.all(
    `SELECT * FROM clients
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

app.post('/api/clients', verifyToken, (req, res) => {
  const {
    business_name,
    contact_name,
    email,
    phone,
    service,
    notes
  } = req.body;

  db.run(
    `INSERT INTO clients
    (user_id, business_name, contact_name,
    email, phone, service, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      business_name,
      contact_name,
      email,
      phone,
      service,
      notes
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        success: true,
        client_id: this.lastID
      });
    }
  );
});

app.put('/api/clients/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const {
    business_name,
    contact_name,
    email,
    phone,
    service,
    notes,
    status
  } = req.body;

  db.run(
    `UPDATE clients
    SET business_name = ?, contact_name = ?,
    email = ?, phone = ?, service = ?,
    notes = ?, status = ?
    WHERE id = ? AND user_id = ?`,
    [
      business_name,
      contact_name,
      email,
      phone,
      service,
      notes,
      status,
      id,
      req.user.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật khách hàng thành công'
      });
    }
  );
});

app.delete('/api/clients/:id', verifyToken, (req, res) => {
  db.run(
    `DELETE FROM clients
    WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Đã xóa khách hàng'
      });
    }
  );
});

// ======================= ADMIN APIs =======================

// ALL CONTACTS
app.get('/api/admin/contacts', verifyAdmin, (req, res) => {
  db.all(
    `SELECT * FROM contacts
     ORDER BY created_at DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

// ALL USERS
app.get('/api/admin/users', verifyAdmin, (req, res) => {
  db.all(
    `SELECT id, username, email,
    full_name, business_type,
    is_admin, created_at
    FROM users
    ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

// ALL CAMPAIGNS
app.get('/api/admin/campaigns', verifyAdmin, (req, res) => {
  db.all(
    `SELECT campaigns.*,
    users.username AS owner_name
    FROM campaigns
    JOIN users ON campaigns.user_id = users.id
    ORDER BY campaigns.created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

// ALL CLIENTS
app.get('/api/admin/clients', verifyAdmin, (req, res) => {
  db.all(
    `SELECT clients.*,
    users.username AS owner_name
    FROM clients
    JOIN users ON clients.user_id = users.id
    ORDER BY clients.created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

// ANALYTICS
app.get('/api/admin/analytics', verifyAdmin, (req, res) => {
  db.all(
    `SELECT * FROM analytics
     ORDER BY timestamp DESC
     LIMIT 100`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

// ======================= ANALYTICS =======================
app.post('/api/analytics', (req, res) => {

  const {
    user_id,
    username,
    page,
    action,
    details
  } = req.body;

  const ip =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress;

  const userAgent =
    req.headers['user-agent'];

  // INSERT ANALYTICS
  db.run(

    `INSERT INTO analytics (

      user_id,
      username,
      page,
      action,
      details,
      ip_address,
      user_agent

    )

    VALUES (?, ?, ?, ?, ?, ?, ?)`,

    [

      user_id || null,
      username || 'guest',
      page || 'unknown',
      action || 'unknown',
      details || '',
      ip,
      userAgent

    ],

    function(err) {

      if (err) {

        return res.status(500).json({
          error: err.message
        });

      }
    }

  );

});

// ======================= HEALTH =======================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'DL Marketing API v1.0'
  });
});

// ======================= HOME =======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
// ======================= ERROR HANDLER =======================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: 'Internal server error'
  });
});

// ======================= START SERVER =======================
app.post('/api/setup-admin', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'Thiếu thông tin'
    });
  }

  db.get(
    `SELECT * FROM users
     WHERE username = ? OR email = ?`,
    [username, email],
    async (err, user) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (user) {
        return res.status(400).json({
          error: 'Admin already exists'
        });
      }

      try {
        const hashedPassword =
          await bcrypt.hash(password, 10);

        db.run(
          `INSERT INTO users
          (
            username,
            email,
            password,
            full_name,
            business_type,
            is_admin
          )
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            username,
            email,
            hashedPassword,
            'System Admin',
            'Administration',
            1
          ],
          function (err) {

            if (err) {
              return res.status(500).json({
                error: err.message
              });
            }

            res.json({
              success: true,
              message: 'Admin created successfully',
              admin_id: this.lastID
            });

          }
        );

      } catch (error) {

        res.status(500).json({
          error: error.message
        });

      }

    }
  );
});
app.listen(PORT, () => {
  console.log(`
✓ Server running at http://localhost:${PORT}
✓ API ready
✓ SQLite connected
  `);
});

// ======================= SHUTDOWN =======================
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }

    console.log('\n✓ Server stopped');

    process.exit(0);
  });
});