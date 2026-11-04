# FoodBooth 🍔 – Campus Pre-Order Web App

A full-stack **campus food pre-ordering system** built with:

- **Frontend**: React (Vite) + Tailwind CSS + React Router + Axios  
- **Backend**: Node.js + Express + MongoDB (Mongoose)  
- **Auth**: JWT + bcrypt

---

## 📂 Project Structure

```
foodbooth/
├── client/          # React (Vite) frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level page components
│   │   ├── routes/       # React Router config
│   │   └── services/     # Axios API layer
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── server/          # Express backend
    ├── config/      # DB connection
    ├── controllers/ # Route handler logic
    ├── middleware/  # Auth & error handling
    ├── models/      # Mongoose schemas
    ├── routes/      # Express routers
    ├── seed/        # Database seed script
    ├── .env.example
    └── index.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [MongoDB](https://www.mongodb.com) (local or Atlas)
- Git

---

### 1️⃣ Clone the repo

```bash
git clone https://github.com/kumudd2/Food-Both.git
cd Food-Both
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, and PORT
```

**`.env` values:**

| Key | Example |
|-----|---------|
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb://localhost:27017/foodbooth` |
| `JWT_SECRET` | `your-strong-secret-key` |

**Seed the database (optional but recommended):**

```bash
node seed/seedData.js
```

This creates:
- 👤 Admin: `admin@foodbooth.edu` / `admin123`
- 🎓 Student: `jdoe24@university.edu` / `student123`
- 🍔 6 menu items, inventory, sample orders & feedback

**Start the server:**

```bash
npm run dev    # development (nodemon)
npm start      # production
```

API available at: `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev    # Vite dev server
```

App available at: `http://localhost:5173`  
(Vite automatically proxies `/api` requests to the backend)

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ✖ |
| POST | `/api/auth/login` | Login & get JWT | ✖ |
| GET | `/api/auth/me` | Get logged-in user | ✅ |

### Menu
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/menu` | List all menu items | ✖ |
| GET | `/api/menu/:id` | Get single item | ✖ |
| POST | `/api/menu` | Create item (admin) | ✅ |
| PUT | `/api/menu/:id` | Update item (admin) | ✅ |
| DELETE | `/api/menu/:id` | Delete item (admin) | ✅ |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders/my` | Get my orders | ✅ |
| GET | `/api/orders` | All orders (admin) | ✅ |
| POST | `/api/orders` | Place new order | ✅ |
| PATCH | `/api/orders/:id/status` | Update status (admin) | ✅ |

### Feedback
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/feedback` | List all feedback | ✅ |
| POST | `/api/feedback` | Submit feedback | ✅ |
| DELETE | `/api/feedback/:id` | Delete feedback | ✅ |

### Inventory
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/inventory` | View stock (admin) | ✅ |
| POST | `/api/inventory` | Upsert stock (admin) | ✅ |
| PATCH | `/api/inventory/:id` | Update quantity (admin) | ✅ |

---

## 🎨 Design

Matches the **FoodBooth design system**:
- Color palette: burnt orange primary (`#ab3500`), teal secondary (`#27657c`)
- Fonts: **Plus Jakarta Sans** (headings) + **Inter** (body)
- Icons: Material Symbols Outlined
- Responsive: mobile → tablet → desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 7 |
| Auth | JWT, bcrypt |
| Validation | express-validator |
| Dev tools | nodemon |

---

## 📄 License

MIT
