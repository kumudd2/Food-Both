# FoodBooth - Campus Dining Pre-Order & Kitchen KDS Platform

A modern, production-grade campus dining hall pre-ordering and kitchen management web application.

---

## 📂 Project Architecture

```
Food-Both/
├── client/              # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/  # Modular UI & Portal Components
│   │   │   ├── AdminPortal.jsx         # Kitchen KDS, Stock, Sales & Audit Log
│   │   │   ├── CartDrawer.jsx          # Slide-out food tray & checkout
│   │   │   ├── DishModal.jsx           # Customizer with portion & addons
│   │   │   ├── Icons.jsx               # Monochrome SVG line icons
│   │   │   ├── MenuScreen.jsx          # Dynamic 1–6 column responsive catalog
│   │   │   ├── Navbar.jsx              # Responsive header with wallet pill
│   │   │   ├── OrderTrackerScreen.jsx  # Live 5-stage timeline & digital QR pass
│   │   │   └── WalletScreen.jsx        # RFID Meal Card & UPI top-up
│   │   ├── data/
│   │   │   └── mockData.js             # Initial state, dishes, counters & coupons
│   │   ├── App.jsx                     # Root state management & localStorage sync
│   │   └── index.css                   # Custom animations & responsive utilities
│   ├── public/                         # Food photography & local static assets
│   ├── dist/                           # Production-compiled client bundle
│   └── package.json
│
├── server/              # Express + MongoDB REST API Backend
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route business logic
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Data schemas (User, Food, Order, Feedback)
│   ├── routes/          # Express route definitions
│   ├── seed/            # Seed script
│   └── package.json
│
├── database/            # SQL Schemas & Database Artifacts
│   ├── cafeteria.db     # SQLite local database
│   ├── schema_sqlite.sql
│   ├── schema_postgres.sql
│   ├── seed_data.sql
│   └── build_database.cs
│
├── legacy_v1/           # Archived Legacy Monolithic Prototype
│   ├── index.html       # Original single-file prototype
│   ├── assets/          # Legacy CDN script bundles
│   ├── css/
│   └── js/
│
├── launch.bat           # 1-Click Windows Production App Launcher
├── serve.js             # High-speed static SPA server (Port 3000)
└── package.json         # Unified root scripts
```

---

## 🚀 Quick Start

### 1. Launch Production Web App
Double-click `launch.bat` or run:
```bash
npm start
```
Open **`http://localhost:3000`** in your browser.

### 2. Frontend Development
```bash
npm run dev
```

### 3. Build Production Bundle
```bash
npm run build
```

---

## 💡 Key Features

### Student Dining Experience
- **Fluid Edge-to-Edge Grid**: Automatically reflows from 1 column on phones to 6 columns on widescreen desktop monitors.
- **Search & Filters**: Instant search, category tabs (Breakfast, Mains, Chaat, Beverages, etc.), dietary toggles (Veg / Non-Veg / Vegan), and sorting.
- **Dish Customizer**: Adjust portion sizes, choose spice levels, and select add-on upgrades.
- **Slide-Out Tray**: Coupon vouchers (`CAMPUS50`, `STUDENT10`), pickup time slot selection, payment method choices.
- **Persistent Floating Tray Button**: Corner-anchored FAB (`fixed bottom-4 right-4 sm:bottom-6 sm:right-6`) that hovers above content without page scrolling.
- **Live Order Tracker**: 5-stage preparation timeline (`Placed` → `Confirmed` → `Preparing` → `Ready` → `Collected`), digital QR pickup pass, and 4-digit verification PIN.
- **Campus Dining Wallet**: Digital RFID meal card with cardholder credentials, quick UPI top-up (+₹100, +₹200, +₹500, +₹1000), loyalty pass subscriptions, and transaction audit log.

### Kitchen Staff & Administration Console
- **Kitchen KDS Kanban**: 3-column ticket pipeline (*New Incoming* → *Currently Cooking* → *Ready at Counter*) with counter filtering and stage advancement.
- **Stock & Menu Controls**: Instant **In Stock / Sold Out** switch synced with student menu, full **Add Dish Modal**, inline editing, and deletion.
- **Daily Sales & Analytics**: Gross Revenue KPI cards, Counter 1/2/3 revenue distribution bars, rush hour volume distribution, and top-selling dishes leaderboard.
- **Orders Audit Log**: Comprehensive ticket history, multi-status filters, customer roll numbers, item details modal, and **1-click Export to CSV**.
