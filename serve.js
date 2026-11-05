// serve.js - FoodBooth Production Server & PostgreSQL API Bridge
const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

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
const distDir = path.join(__dirname, 'client', 'dist');
const baseDir = fs.existsSync(distDir) ? distDir : __dirname;

// 2. PostgreSQL Connection Pool
const dbUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/foodbooth';

const pool = new Pool({
  connectionString: dbUrl,
  connectionTimeoutMillis: 3000,
});

pool.on('error', (err) => {
  // Prevent unhandled pool crash
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
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
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
  // API ROUTING: PostgreSQL Endpoints
  // -------------------------------------------------------------

  // Health / DB Status Endpoint
  if (pathname === '/api/status' && req.method === 'GET') {
    const status = await checkDatabase();
    return sendJson(res, 200, status);
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
          o.id,
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
            [ord.id]
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
        RETURNING balance, reward_points;
      `, [amt]);

      const newBal = walletUpdate.rows[0]?.balance || 580;

      await pool.query(`
        INSERT INTO wallet_transactions (txn_type, amount, balance_after, reference)
        VALUES ('topup', $1, $2, 'UPI Instant Top-Up');
      `, [amt, newBal]);

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

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`\n======================================================`);
  console.log(`FoodBooth Unified Server running at http://localhost:${PORT}/`);
  console.log(`Serving Web App from: ${baseDir}`);
  const dbStatus = await checkDatabase();
  if (dbStatus.dbConnected) {
    console.log(`[Database Status] ONLINE - Connected to PostgreSQL (foodbooth)`);
  } else {
    console.log(`[Database Status] OFFLINE - ${dbStatus.message}`);
    console.log(`[Mode] Automatic Fallback Active: Using localStorage & mockData.`);
  }
  console.log(`======================================================\n`);
});
