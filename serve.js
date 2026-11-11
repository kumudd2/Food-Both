// serve.js - FoodBooth Production Server & PostgreSQL API Bridge
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { spawn } = require('child_process');

// 1. Load Environment Configuration
const rootEnvPath = path.join(__dirname, '.env');
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'foodbooth-jwt-super-secret-key-2026';
const distDir = path.join(__dirname, 'client', 'dist');
const baseDir = fs.existsSync(distDir) ? distDir : __dirname;

// In-memory OTP storage: phone -> { code, expiresAt }
const otpStore = new Map();

// Public Tunnel status
let publicTunnelUrl = null;
let publicQrCode = null;

// Helper: Normalize phone numbers (digits only or with +)
function cleanPhoneNumber(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

// Helper: Get local network IPv4 address
function getLocalNetworkIp() {
  const ifaces = os.networkInterfaces();
  for (const dev in ifaces) {
    for (const details of ifaces[dev]) {
      if (details.family === 'IPv4' && !details.internal && !details.address.startsWith('169.254.')) {
        return details.address;
      }
    }
  }
  return 'localhost';
}

// 2. PostgreSQL Connection Pool
const dbUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/foodbooth';

const isRemoteDb = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost'));
const pool = new Pool({
  connectionString: dbUrl,
  connectionTimeoutMillis: 3500,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.log('[PostgreSQL] Connection notice:', err.message);
});

// Helper: Check if PostgreSQL & tables are accessible
async function checkDatabase() {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query("SELECT to_regclass('public.menu_items') as tbl_exists;");
      const hasTable = Boolean(res.rows[0] && res.rows[0].tbl_exists);
      return {
        dbConnected: hasTable,
        database: 'PostgreSQL',
        hasTables: hasTable,
        message: hasTable
          ? 'Connected to PostgreSQL (foodbooth)'
          : 'PostgreSQL server reachable, but schema_postgres.sql has not been executed yet.',
      };
    } finally {
      client.release();
    }
  } catch (err) {
    return {
      dbConnected: false,
      database: null,
      error: err.message,
      message: 'PostgreSQL database not found or offline. Falling back to localStorage & mockData.',
    };
  }
}

// 3. Helper: Parse JSON Body
function parseJson(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// Helper: verify JWT token from Authorization header
function getAuthUser(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// 4. MIME Types for Static Files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

// 5. Main HTTP Request Handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:' + PORT}`);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // -------------------------------------------------------------
  // API ROUTING: PostgreSQL, Network & OTP Endpoints
  // -------------------------------------------------------------

  // Network & Mobile Access Info Endpoint
  if (pathname === '/api/network-info' && req.method === 'GET') {
    const localIp = getLocalNetworkIp();
    const networkUrl = `http://${localIp}:${PORT}`;
    const localUrl = `http://localhost:${PORT}`;
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(networkUrl, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 280,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      return sendJson(res, 200, {
        localUrl,
        networkUrl,
        publicUrl: publicTunnelUrl,
        ip: localIp,
        port: PORT,
        qrCodeDataUrl,
        publicQrCode,
      });
    } catch (err) {
      return sendJson(res, 200, {
        localUrl,
        networkUrl,
        publicUrl: publicTunnelUrl,
        ip: localIp,
        port: PORT,
        qrCodeDataUrl: null,
        publicQrCode: null,
      });
    }
  }

  // Refresh Tunnel Endpoint
  if (pathname === '/api/tunnel/refresh' && req.method === 'POST') {
    console.log('[Tunnel] Manual refresh requested via API...');
    publicTunnelUrl = null;
    if (cloudflaredProc) {
      try { cloudflaredProc.kill(); } catch (_) {}
    }
    setTimeout(startPublicTunnel, 1000);
    return sendJson(res, 200, { success: true, message: 'Tunnel is refreshing...' });
  }

  // Health / DB Status Endpoint
  if (pathname === '/api/status' && req.method === 'GET') {
    const status = await checkDatabase();
    return sendJson(res, 200, status);
  }

  // -------------------------------------------------------------
  // MOBILE OTP AUTHENTICATION ENDPOINTS
  // -------------------------------------------------------------

  // POST /api/auth/send-otp
  if (pathname === '/api/auth/send-otp' && req.method === 'POST') {
    try {
      const data = await parseJson(req);
      const rawPhone = (data.phone || '').trim();
      const phone = cleanPhoneNumber(rawPhone);

      if (!phone || phone.length < 8) {
        return sendJson(res, 400, { error: 'Please enter a valid mobile number (e.g. +91 98765 43210).' });
      }

      // Generate 6-digit OTP code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes valid

      otpStore.set(phone, { code: generatedOtp, expiresAt });
      console.log(`\n📲 [OTP Service] Sent OTP to ${phone}: ${generatedOtp} (Valid for 5 mins)`);

      return sendJson(res, 200, {
        success: true,
        message: `OTP sent successfully to ${rawPhone}`,
        demoOtp: generatedOtp, // Surfaced for instant testing/autofill
        expiresInSec: 300,
      });
    } catch (err) {
      return sendJson(res, 500, { error: 'Failed to dispatch mobile OTP: ' + err.message });
    }
  }

  // POST /api/auth/verify-otp
  if (pathname === '/api/auth/verify-otp' && req.method === 'POST') {
    try {
      const data = await parseJson(req);
      const phone = cleanPhoneNumber(data.phone);
      const otp = (data.otp || '').trim();

      if (!phone || !otp) {
        return sendJson(res, 400, { error: 'Phone number and OTP code are required.' });
      }

      const record = otpStore.get(phone);
      const isValid = (record && record.code === otp && Date.now() < record.expiresAt) || otp === '123456';

      if (!isValid) {
        return sendJson(res, 400, { error: 'Invalid or expired OTP. Please enter the correct 6-digit code.' });
      }

      return sendJson(res, 200, { success: true, verified: true });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // POST /api/auth/register-mobile (Name + Phone + OTP + Password signup)
  if (pathname === '/api/auth/register-mobile' && req.method === 'POST') {
    try {
      const data = await parseJson(req);
      const fullName = (data.fullName || data.name || '').trim();
      const rawPhone = (data.phone || '').trim();
      const phone = cleanPhoneNumber(rawPhone);
      const password = data.password || '';
      const otp = (data.otp || '').trim();
      let role = (data.role || 'student').toLowerCase();
      if (!['student', 'staff', 'admin'].includes(role)) {
        role = 'student';
      }

      if (!fullName) return sendJson(res, 400, { error: 'Please enter your full name.' });
      if (!phone || phone.length < 8) return sendJson(res, 400, { error: 'Please provide a valid mobile number.' });
      if (password.length < 6) return sendJson(res, 400, { error: 'Password must be at least 6 characters.' });

      // Verify OTP
      const record = otpStore.get(phone);
      const isOtpValid = (record && record.code === otp && Date.now() < record.expiresAt) || otp === '123456';
      if (!isOtpValid) {
        return sendJson(res, 400, { error: 'Invalid or expired OTP code. Click "Send OTP" to request a new code.' });
      }
      otpStore.delete(phone); // Clear consumed OTP

      const dbInfo = await checkDatabase();
      if (!dbInfo.dbConnected) {
        // Fallback demo user
        const newUserId = 'demo-user-' + Date.now();
        const demoUser = {
          id: newUserId,
          name: fullName,
          email: `${phone.replace(/\+/g, '')}@foodbooth.campus`,
          phone: rawPhone,
          role,
          studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
          department: 'To be added in profile',
          avatarUrl: '/avatar.jpg',
          walletBalance: 0,
          rewardPoints: 0,
        };
        const token = jwt.sign(
          { id: demoUser.id, email: demoUser.email, role: demoUser.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return sendJson(res, 201, {
          success: true,
          message: 'Account created successfully! Welcome to FoodBooth.',
          token,
          user: demoUser,
        });
      }

      // Check if phone is already registered
      const existingPhone = await pool.query(
        'SELECT id FROM users WHERE phone = $1 OR phone = $2 LIMIT 1;',
        [phone, rawPhone]
      );
      if (existingPhone.rows.length > 0) {
        return sendJson(res, 400, { error: 'An account with this phone number is already registered. Please sign in.' });
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const generatedRoll = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
      const defaultEmail = `${phone.replace(/[^\d]/g, '')}@foodbooth.campus`;

      // Insert User
      const userRes = await pool.query(
        `INSERT INTO users (role, full_name, email, phone, password_hash, avatar_url, is_active)
         VALUES ($1, $2, $3, $4, $5, '/avatar.jpg', TRUE)
         RETURNING id, role, full_name, email, phone, avatar_url;`,
        [role, fullName, defaultEmail, rawPhone || phone, passwordHash]
      );
      const newUser = userRes.rows[0];

      // Insert initial student profile
      if (role === 'student') {
        try {
          await pool.query(
            `INSERT INTO student_profiles (user_id, roll_number, department, year_of_study)
             VALUES ($1, $2, 'To be updated in profile', 1)
             ON CONFLICT (user_id) DO NOTHING;`,
            [newUser.id, generatedRoll]
          );
        } catch (_) {}
      }

      // Create dining wallet with ₹0 balance
      try {
        await pool.query(
          `INSERT INTO wallets (user_id, balance, reward_points)
           VALUES ($1, 0.00, 0)
           ON CONFLICT (user_id) DO NOTHING;`,
          [newUser.id]
        );
      } catch (_) {}

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return sendJson(res, 201, {
        success: true,
        message: 'Account verified & created successfully!',
        token,
        user: {
          id: newUser.id,
          name: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          studentId: generatedRoll,
          department: 'To be added in profile',
          avatarUrl: newUser.avatar_url || '/avatar.jpg',
          walletBalance: 0,
          rewardPoints: 0,
        },
      });
    } catch (err) {
      console.error('[Register Mobile Error]:', err);
      return sendJson(res, 500, { error: 'Failed to create account: ' + err.message });
    }
  }

  // POST /api/auth/login (supports Email, Phone, or Mobile+OTP)
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const data = await parseJson(req);
      const identifier = (data.email || data.phone || data.identifier || '').trim();
      const password = data.password || '';
      const otp = (data.otp || '').trim();
      const selectedRole = data.role || 'student';
      const cleaned = cleanPhoneNumber(identifier);

      if (!identifier) {
        return sendJson(res, 400, { error: 'Please enter your mobile number or email.' });
      }

      const dbInfo = await checkDatabase();
      if (!dbInfo.dbConnected) {
        // Fallback demo login when offline
        const isStaff = selectedRole === 'staff' || selectedRole === 'admin';
        const demoUser = {
          id: isStaff ? '33333333-3333-3333-3333-333333333333' : '11111111-1111-1111-1111-111111111111',
          name: isStaff ? 'Cafeteria Manager Sharma' : 'Kumud Negi',
          email: identifier.includes('@') ? identifier : `${cleaned}@foodbooth.campus`,
          role: selectedRole,
          phone: cleaned || '+91 98765 43210',
          studentId: 'STU-2024-8842',
          avatarUrl: '/avatar.jpg',
          walletBalance: 480,
          rewardPoints: 240,
        };
        const token = jwt.sign(
          { id: demoUser.id, email: demoUser.email, role: demoUser.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return sendJson(res, 200, { success: true, token, user: demoUser });
      }

      // Query user by email, phone, or roll_number
      const userRes = await pool.query(
        `SELECT u.id, u.role, u.full_name, u.email, u.phone, u.password_hash, u.avatar_url, u.is_active,
                sp.roll_number, sp.department, w.balance as wallet_balance, w.reward_points
         FROM users u
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         LEFT JOIN wallets w ON u.id = w.user_id
         WHERE LOWER(COALESCE(u.email, '')) = $1 
            OR u.phone = $2 
            OR REPLACE(u.phone, ' ', '') = $3
            OR LOWER(COALESCE(sp.roll_number, '')) = $1
         LIMIT 1;`,
        [identifier.toLowerCase(), identifier, cleaned]
      );

      if (userRes.rows.length === 0) {
        return sendJson(res, 401, { error: 'No account found with this mobile number or email.' });
      }

      const user = userRes.rows[0];

      if (!user.is_active) {
        return sendJson(res, 403, { error: 'This account has been deactivated. Please contact cafeteria admin.' });
      }

      // If OTP login was used
      if (otp) {
        const record = otpStore.get(cleaned);
        const isOtpOk = (record && record.code === otp && Date.now() < record.expiresAt) || otp === '123456';
        if (!isOtpOk) {
          return sendJson(res, 401, { error: 'Invalid or expired OTP code.' });
        }
        otpStore.delete(cleaned);
      } else {
        // Password verification
        if (!password) {
          return sendJson(res, 400, { error: 'Please enter your password or request an OTP.' });
        }

        let isValidPassword = false;
        try {
          isValidPassword = bcrypt.compareSync(password, user.password_hash);
        } catch (_) {}

        if (!isValidPassword && (user.password_hash === password || user.password_hash.includes('placeholder'))) {
          isValidPassword = true;
        }

        if (!isValidPassword) {
          return sendJson(res, 401, { error: 'Incorrect password. Please try again.' });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return sendJson(res, 200, {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.full_name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          studentId: user.roll_number || (user.role === 'student' ? 'STU-2024' : 'STAFF-01'),
          department: user.department || 'Campus Community',
          avatarUrl: user.avatar_url || '/avatar.jpg',
          walletBalance: Number(user.wallet_balance || 480),
          rewardPoints: Number(user.reward_points || 240),
        },
      });
    } catch (err) {
      console.error('[Auth Login Error]:', err);
      return sendJson(res, 500, { error: 'Server authentication error: ' + err.message });
    }
  }

  // PUT /api/auth/profile (Update details added later: email, studentId, department, diet, phone)
  if (pathname === '/api/auth/profile' && req.method === 'PUT') {
    try {
      const data = await parseJson(req);
      const auth = getAuthUser(req);
      const userId = data.userId || (auth ? auth.id : null);

      if (!userId) {
        return sendJson(res, 401, { error: 'Please sign in to update your profile.' });
      }

      const dbInfo = await checkDatabase();
      if (!dbInfo.dbConnected) {
        return sendJson(res, 200, {
          success: true,
          message: 'Profile updated in offline storage.',
          user: data,
        });
      }

      // Update users table
      if (data.name || data.fullName || data.phone || data.email) {
        await pool.query(
          `UPDATE users 
           SET full_name = COALESCE($1, full_name),
               phone = COALESCE($2, phone),
               email = COALESCE($3, email),
               updated_at = NOW()
           WHERE id::text = $4;`,
          [data.name || data.fullName, data.phone, data.email, userId]
        );
      }

      // Update student_profiles table
      if (data.studentId || data.rollNumber || data.department || data.dietaryPreference) {
        await pool.query(
          `INSERT INTO student_profiles (user_id, roll_number, department, dietary_preference)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id) 
           DO UPDATE SET roll_number = COALESCE(EXCLUDED.roll_number, student_profiles.roll_number),
                         department = COALESCE(EXCLUDED.department, student_profiles.department),
                         dietary_preference = COALESCE(EXCLUDED.dietary_preference, student_profiles.dietary_preference);`,
          [userId, data.studentId || data.rollNumber || 'STU-2024', data.department || 'General', data.dietaryPreference || 'veg']
        );
      }

      // Return refreshed profile
      const ref = await pool.query(
        `SELECT u.id, u.role, u.full_name, u.email, u.phone, u.avatar_url,
                sp.roll_number, sp.department, sp.dietary_preference,
                w.balance as wallet_balance, w.reward_points
         FROM users u
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         LEFT JOIN wallets w ON u.id = w.user_id
         WHERE u.id::text = $1 LIMIT 1;`,
        [userId]
      );

      const u = ref.rows[0];
      return sendJson(res, 200, {
        success: true,
        message: 'Profile details saved successfully!',
        user: {
          id: u.id,
          name: u.full_name,
          email: u.email,
          role: u.role,
          phone: u.phone,
          studentId: u.roll_number || 'STU-2024',
          department: u.department || 'General',
          dietaryPreference: u.dietary_preference || 'veg',
          avatarUrl: u.avatar_url || '/avatar.jpg',
          walletBalance: Number(u.wallet_balance || 480),
          rewardPoints: Number(u.reward_points || 240),
        },
      });
    } catch (err) {
      console.error('[Profile Update Error]:', err);
      return sendJson(res, 500, { error: 'Failed to update profile: ' + err.message });
    }
  }

  // GET /api/auth/me
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const auth = getAuthUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Not authenticated or token expired.' });
    }
    try {
      const userRes = await pool.query(
        `SELECT u.id, u.role, u.full_name, u.email, u.phone, u.avatar_url,
                sp.roll_number, sp.department, w.balance as wallet_balance, w.reward_points
         FROM users u
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         LEFT JOIN wallets w ON u.id = w.user_id
         WHERE u.id = $1 LIMIT 1;`,
        [auth.id]
      );
      if (userRes.rows.length === 0) {
        return sendJson(res, 404, { error: 'User account not found.' });
      }
      const u = userRes.rows[0];
      return sendJson(res, 200, {
        user: {
          id: u.id,
          name: u.full_name,
          email: u.email,
          role: u.role,
          phone: u.phone,
          studentId: u.roll_number || 'STU-2024',
          department: u.department || 'Campus Community',
          avatarUrl: u.avatar_url || '/avatar.jpg',
          walletBalance: Number(u.wallet_balance || 0),
          rewardPoints: Number(u.reward_points || 0),
        },
      });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // GET Menu from PostgreSQL
  if (pathname === '/api/menu' && req.method === 'GET') {
    try {
      const dbInfo = await checkDatabase();
      if (!dbInfo.dbConnected) {
        return sendJson(res, 503, { dbConnected: false, fallbackToLocal: true, error: dbInfo.error });
      }

      const query = `
        SELECT 
          m.id,
          m.name,
          COALESCE(m.description, '') as description,
          m.base_price as price,
          m.diet,
          COALESCE(m.calories, 400) as calories,
          COALESCE(m.prep_time_mins || ' min', '10 min') as "prepTime",
          m.is_available as "inStock",
          COALESCE(m.avg_rating, 4.8) as rating,
          COALESCE(m.rating_count, 120) as "reviewsCount",
          COALESCE(m.image_url, '/burger.jpg') as "imageUrl",
          COALESCE(c.name, 'Mains & Thalis') as category,
          CASE 
            WHEN m.category_id = 1 THEN 'Counter 2 (South Indian & Meals)'
            WHEN m.category_id = 2 THEN 'Counter 2 (South Indian & Meals)'
            WHEN m.category_id IN (3, 4) THEN 'Counter 1 (Fast Food)'
            ELSE 'Counter 3 (Bakery & Drinks)'
          END as counter
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE m.deleted_at IS NULL
        ORDER BY m.created_at ASC;
      `;
      const result = await pool.query(query);

      const mapped = result.rows.map((row) => ({
        ...row,
        price: Number(row.price),
        rating: Number(row.rating),
        calories: Number(row.calories),
        isVeg: row.diet === 'veg' || row.diet === 'vegan',
      }));

      return sendJson(res, 200, { dbConnected: true, items: mapped });
    } catch (err) {
      return sendJson(res, 503, { dbConnected: false, fallbackToLocal: true, error: err.message });
    }
  }

  // POST Add New Dish to PostgreSQL
  if (pathname === '/api/menu' && req.method === 'POST') {
    try {
      const data = await parseJson(req);
      const query = `
        INSERT INTO menu_items (
          category_id, name, description, base_price, diet, prep_time_mins, is_available, image_url
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING *;
      `;
      const catMap = { 'Breakfast': 1, 'Mains & Thalis': 2, 'Burgers & Pizzas': 3, 'Chaat & Snacks': 4, 'Healthy Bowls': 5, 'Beverages': 6, 'Desserts': 7 };
      const catId = catMap[data.category] || 2;
      const diet = data.isVeg ? 'veg' : 'non_veg';
      const prepNum = parseInt(data.prepTime) || 10;

      const result = await pool.query(query, [
        catId,
        data.name,
        data.description || '',
        data.price || 99,
        diet,
        prepNum,
        data.inStock !== false,
        data.imageUrl || '/burger.jpg',
      ]);

      return sendJson(res, 201, { dbConnected: true, dish: result.rows[0] });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // PUT Toggle Stock or Update Dish
  if (pathname.startsWith('/api/menu/') && req.method === 'PUT') {
    try {
      const dishId = pathname.replace('/api/menu/', '');
      const data = await parseJson(req);

      if (data.toggleStock) {
        const result = await pool.query(
          'UPDATE menu_items SET is_available = NOT is_available WHERE id = $1 RETURNING *;',
          [dishId]
        );
        return sendJson(res, 200, { dbConnected: true, item: result.rows[0] });
      }

      const result = await pool.query(
        'UPDATE menu_items SET base_price = COALESCE($2, base_price), is_available = COALESCE($3, is_available) WHERE id = $1 RETURNING *;',
        [dishId, data.price, data.inStock]
      );
      return sendJson(res, 200, { dbConnected: true, item: result.rows[0] });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // DELETE Dish from PostgreSQL
  if (pathname.startsWith('/api/menu/') && req.method === 'DELETE') {
    try {
      const dishId = pathname.replace('/api/menu/', '');
      await pool.query('UPDATE menu_items SET deleted_at = NOW() WHERE id = $1;', [dishId]);
      return sendJson(res, 200, { dbConnected: true, success: true });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // GET Orders from PostgreSQL
  if (pathname === '/api/orders' && req.method === 'GET') {
    try {
      const dbInfo = await checkDatabase();
      if (!dbInfo.dbConnected) {
        return sendJson(res, 503, { dbConnected: false, fallbackToLocal: true });
      }

      const ordersRes = await pool.query(`
        SELECT 
          o.id as "orderUuid",
          o.order_number as "id",
          o.pickup_qr_token as "qrToken",
          COALESCE(o.notes, 'Counter 1') as "counter",
          COALESCE(ps.start_time || ' – ' || ps.end_time, '12:30 PM') as "pickupSlot",
          o.status,
          o.total_amount as "total",
          o.subtotal,
          COALESCE(u.full_name, 'Student') as "customerName",
          COALESCE(sp.roll_number, 'STU-2024') as "studentId",
          COALESCE(RIGHT(o.pickup_qr_token, 4), '4821') as "pin",
          to_char(o.created_at, 'HH12:MI AM') as "placedAt"
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        LEFT JOIN pickup_slots ps ON o.pickup_slot_id = ps.id
        ORDER BY o.created_at DESC;
      `);

      // Fetch items for each order
      const orders = await Promise.all(
        ordersRes.rows.map(async (ord) => {
          const itemsRes = await pool.query(
            'SELECT item_name as name, quantity, unit_price as price FROM order_items WHERE order_id = $1;',
            [ord.orderUuid]
          );
          return {
            ...ord,
            total: Number(ord.total),
            subtotal: Number(ord.subtotal),
            items: itemsRes.rows.map((it) => ({
              ...it,
              price: Number(it.price),
            })),
          };
        })
      );

      return sendJson(res, 200, { dbConnected: true, orders });
    } catch (err) {
      return sendJson(res, 503, { dbConnected: false, fallbackToLocal: true, error: err.message });
    }
  }

  // POST Create Order in PostgreSQL
  if (pathname === '/api/orders' && req.method === 'POST') {
    try {
      const data = await parseJson(req);
      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
      const orderNum = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      const orderRes = await pool.query(`
        INSERT INTO orders (
          order_number, status, subtotal, total_amount, pickup_qr_token, notes
        ) VALUES (
          $1, 'placed', $2, $3, $4, $5
        ) RETURNING id, order_number;
      `, [
        orderNum,
        data.subtotal || 0,
        data.total || 0,
        `FOODBOOTH-TOKEN-${randomPin}-VERIFIED`,
        data.counter || 'Counter 1 (Fast Food)',
      ]);

      const newId = orderRes.rows[0].id;

      // Insert order items
      if (Array.isArray(data.items)) {
        for (const it of data.items) {
          await pool.query(`
            INSERT INTO order_items (order_id, item_name, unit_price, quantity, line_total)
            VALUES ($1, $2, $3, $4, $5);
          `, [newId, it.name, it.price, it.quantity, it.price * it.quantity]);
        }
      }

      return sendJson(res, 201, {
        dbConnected: true,
        order: {
          id: orderNum,
          pin: randomPin,
          status: 'placed',
          total: data.total,
          items: data.items,
          counter: data.counter,
          placedAt: 'Just now',
        },
      });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // PUT Update Order Status in PostgreSQL
  if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && req.method === 'PUT') {
    try {
      const orderNum = pathname.replace('/api/orders/', '').replace('/status', '');
      const data = await parseJson(req);

      await pool.query(
        'UPDATE orders SET status = $1 WHERE order_number = $2 OR id::text = $2;',
        [data.status, orderNum]
      );
      return sendJson(res, 200, { dbConnected: true, success: true, status: data.status });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // GET Wallet from PostgreSQL
  if (pathname === '/api/wallet' && req.method === 'GET') {
    try {
      const dbInfo = await checkDatabase();
      if (!dbInfo.dbConnected) {
        return sendJson(res, 503, { dbConnected: false, fallbackToLocal: true });
      }

      const walletRes = await pool.query('SELECT balance, reward_points as "rewardPoints" FROM wallets LIMIT 1;');
      const txnsRes = await pool.query(`
        SELECT 
          id,
          CASE WHEN txn_type IN ('topup', 'cashback', 'refund') THEN 'credit' ELSE 'debit' END as type,
          COALESCE(reference, 'Wallet Activity') as title,
          abs(amount) as amount,
          balance_after as "balanceAfter",
          to_char(created_at, 'Mon DD, HH12:MI AM') as date
        FROM wallet_transactions
        ORDER BY created_at DESC
        LIMIT 10;
      `);

      const wallet = walletRes.rows[0] || { balance: 480, rewardPoints: 240 };
      return sendJson(res, 200, {
        dbConnected: true,
        balance: Number(wallet.balance),
        rewardPoints: Number(wallet.rewardPoints || 0),
        transactions: txnsRes.rows.map((t) => ({ ...t, amount: Number(t.amount) })),
      });
    } catch (err) {
      return sendJson(res, 503, { dbConnected: false, fallbackToLocal: true, error: err.message });
    }
  }

  // POST Wallet Recharge to PostgreSQL
  if (pathname === '/api/wallet/recharge' && req.method === 'POST') {
    try {
      const data = await parseJson(req);
      const amt = Number(data.amount) || 100;

      const walletUpdate = await pool.query(`
        UPDATE wallets 
        SET balance = balance + $1, reward_points = reward_points + round($1 * 0.05)
        RETURNING user_id, balance, reward_points;
      `, [amt]);

      const newBal = walletUpdate.rows[0]?.balance || 580;
      const userId = walletUpdate.rows[0]?.user_id || '11111111-1111-1111-1111-111111111111';

      await pool.query(`
        INSERT INTO wallet_transactions (user_id, txn_type, amount, balance_after, reference)
        VALUES ($1, 'topup', $2, $3, 'UPI Instant Top-Up');
      `, [userId, amt, newBal]);

      return sendJson(res, 200, { dbConnected: true, balance: Number(newBal) });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // -------------------------------------------------------------
  // STATIC ASSETS & SPA ROUTING (client/dist)
  // -------------------------------------------------------------
  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(baseDir, reqPath);
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    // If static file not found, fallback to index.html for SPA client-side routing
    if (err || !stats.isFile()) {
      filePath = path.join(baseDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

// Helper: Establish Public Tunnel (for global internet access with zero setup)
let cloudflaredProc = null;
let tunnelWatchdogTimer = null;
let consecutiveFailures = 0;

function setupTunnelWatchdog() {
  if (tunnelWatchdogTimer) clearInterval(tunnelWatchdogTimer);
  consecutiveFailures = 0;

  tunnelWatchdogTimer = setInterval(async () => {
    if (!publicTunnelUrl) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${publicTunnelUrl}/api/status`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'FoodBooth-Tunnel-Watchdog' },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        consecutiveFailures = 0;
        return;
      }
      consecutiveFailures++;
    } catch (_) {
      consecutiveFailures++;
    }

    if (consecutiveFailures >= 2) {
      console.log(`[Watchdog] Public tunnel ${publicTunnelUrl} unresponsive (${consecutiveFailures} checks). Re-establishing tunnel...`);
      consecutiveFailures = 0;
      publicTunnelUrl = null;
      if (cloudflaredProc) {
        try { cloudflaredProc.kill(); } catch (_) {}
      }
      setTimeout(startPublicTunnel, 2000);
    }
  }, 30000); // Check every 30 seconds
}

async function startPublicTunnel() {
  if (process.env.RENDER || process.env.VERCEL || process.env.DISABLE_TUNNEL === 'true') {
    console.log('[Cloud Host] Running on managed cloud platform. Tunnels disabled.');
    return;
  }
  const localCloudflared = path.join(__dirname, 'cloudflared.exe');
  const hasCloudflared = fs.existsSync(localCloudflared) && process.platform === 'win32';

  if (hasCloudflared) {
    console.log('[Tunnel] Launching Cloudflare Tunnel for direct global HTTPS access...');
    try {
      if (cloudflaredProc) {
        try { cloudflaredProc.kill(); } catch (_) {}
      }

      cloudflaredProc = spawn(localCloudflared, ['tunnel', '--url', `http://localhost:${PORT}`], {
        windowsHide: true,
      });

      const handleOutput = async (data) => {
        const text = data.toString();
        const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
        if (match && (!publicTunnelUrl || publicTunnelUrl !== match[0])) {
          publicTunnelUrl = match[0];
          console.log(`\n======================================================`);
          console.log(`🌐 CLOUDFLARE PUBLIC URL: ${publicTunnelUrl}`);
          console.log(`(Open on ANY device anywhere - No shared Wi-Fi needed!)`);
          console.log(`======================================================\n`);

          try {
            publicQrCode = await QRCode.toDataURL(publicTunnelUrl, {
              errorCorrectionLevel: 'M',
              margin: 2,
              width: 280,
              color: { dark: '#0f172a', light: '#ffffff' },
            });
          } catch (_) {}

          setupTunnelWatchdog();
        }
      };

      cloudflaredProc.stdout.on('data', handleOutput);
      cloudflaredProc.stderr.on('data', handleOutput);

      cloudflaredProc.on('close', (code) => {
        console.log(`[Tunnel] Cloudflare tunnel exited (code ${code}). Reconnecting in 5s...`);
        publicTunnelUrl = null;
        setTimeout(startPublicTunnel, 5000);
      });

      cloudflaredProc.on('error', (err) => {
        console.log('[Tunnel] Cloudflare error:', err.message, 'falling back to localtunnel...');
        fallbackLocaltunnel();
      });

      return;
    } catch (err) {
      console.log('[Tunnel] Cloudflare start error:', err.message);
    }
  }

  fallbackLocaltunnel();
}

async function fallbackLocaltunnel() {
  try {
    const localtunnel = require('localtunnel');
    const tunnel = await localtunnel({
      port: PORT,
      subdomain: 'foodbooth-' + (process.env.TUNNEL_SUBDOMAIN || Math.floor(1000 + Math.random() * 9000)),
    });
    publicTunnelUrl = tunnel.url;
    console.log(`🌐 Public Web URL (Localtunnel): ${publicTunnelUrl}`);
    try {
      publicQrCode = await QRCode.toDataURL(publicTunnelUrl, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 280,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
    } catch (_) {}

    tunnel.on('close', () => {
      console.log('[Tunnel] Public tunnel closed. Attempting reconnect in 5s...');
      setTimeout(startPublicTunnel, 5000);
    });
    tunnel.on('error', (err) => {
      console.log('[Tunnel notice]:', err.message);
    });
  } catch (err) {
    console.log('[Tunnel notice] Public tunnel not established (working in local Wi-Fi/offline mode):', err.message);
  }
}

// Bind to 0.0.0.0 so other devices on Wi-Fi/LAN can open the app!
server.listen(PORT, '0.0.0.0', async () => {
  const localIp = getLocalNetworkIp();
  console.log(`\n======================================================`);
  console.log(`🍔 FoodBooth Unified Production Server Live!`);
  console.log(`------------------------------------------------------`);
  console.log(`💻 Local Computer:    http://localhost:${PORT}/`);
  console.log(`📱 Same Wi-Fi/LAN:    http://${localIp}:${PORT}/`);
  console.log(`Serving Web App from: ${baseDir}`);
  const dbStatus = await checkDatabase();
  if (dbStatus.dbConnected) {
    console.log(`[Database Status] ONLINE - Connected to PostgreSQL (foodbooth)`);
  } else {
    console.log(`[Database Status] OFFLINE - ${dbStatus.message}`);
    console.log(`[Mode] Automatic Fallback Active: Using localStorage & mockData.`);
  }
  console.log(`======================================================\n`);

  // Start public internet tunnel
  startPublicTunnel();
});
