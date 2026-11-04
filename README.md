# 🍔 Smart Cafeteria - Campus Pre-Order Dining Web Platform (18 Pages)

A comprehensive, responsive, high-fidelity **Cafeteria Pre-Order & Dining Web Platform** built with **React 18**, **Tailwind CSS**, and **HTML5**. It includes **18 deeply developed pages**, full state synchronization, live customer quantity adjustment controls, a dedicated bill and checkout experience, digital QR pickup verification, and an integrated kitchen management system.

---

## 🚀 Quick Launch Instructions

1. Simply double-click **`launch.bat`** or open [**`index.html`**](file:///d:/new/index.html) in any web browser (Edge, Chrome, Firefox, Brave, Safari).
2. **Zero installation & 100% Offline-Ready**: All libraries (React 18, Babel Standalone, Tailwind CSS, QRCode.js, Canvas Confetti) and food photography assets are bundled locally in the `assets/` directory. No Node.js, npm, or build step is needed!

---

## 📑 Complete Catalog of 18 Pages

### 🍽️ Section 1: Main Dining
1. **Home / Landing Page** (`home`)
   - Campus Dining Hero Banner with quick order CTA.
   - Real-time queue metrics: Current Queue Wait (6-8 mins), Active Kitchen Orders (42), Cafeteria Crowd (58% Normal), Student Wallet Deals.
   - Category exploration grid (7 categories).
   - Popular student favorites with instant `[-] qty [+]` controls.
   - 4-step interactive guide on how pre-ordering skips the queue.

2. **Food Menu & Pre-Ordering Page** (`menu`)
   - Complete food menu with prices in ₹, ratings, preparation time, calorie counts, and veg badges.
   - Live search by title or description.
   - Category filter tabs: *All Dishes*, *Breakfast*, *Main Course*, *Snacks & Fast Food*, *Healthy & Diet*, *Beverages*, *Desserts & Bakery*.
   - Dietary & macro filters: *🌱 Pure Veg*, *💪 High Protein (12g+)*, *⭐ Chef Specials*.
   - Sorting options: *Recommended*, *Price: Low to High*, *Price: High to Low*, *Highest Rated*, *Lowest Calories*.
   - Add to Cart button and live quantity stepper `[-] count [+]` right on the cards.

3. **Dish Detail & Customization Page** (`dish-detail`)
   - High-resolution dish photography with ratings breakdown.
   - Portion size selector: *Regular*, *Large (1.5x)*, *Meal Combo + Drink*.
   - Detailed nutritional breakdown: Calories (kcal), Protein (g), Carbohydrates (g), Fats (g).
   - Optional extra add-ons (Extra cheese, Double patty, Peri-peri seasoning, etc.).
   - Interactive quantity adjuster and instant "Add To Tray" CTA.

4. **My Cart & Live Tray Page** (`cart`)
   - Itemized cart table matching the user's reference mockup (`Veg Burger @ ₹65`, `Cold Coffee @ ₹60`, `French Fries @ ₹70`).
   - **Customer Quantity Feature**: Real-time increase/decrease `[-] count [+]` stepper with dynamic subtotal and tax updates.
   - Single-item removal and "Clear Tray" action.
   - Promo coupon code field (e.g. `CAMPUS10`, `STUDENT50`).
   - Eco-friendly cutlery toggle ("Don't include single-use plastic cutlery 🌱").
   - Detailed Bill Breakdown (Subtotal, GST 5%, Packing: FREE, Discounts, Grand Total).

5. **Checkout & Dedicated Bill Page** (`checkout`)
   - Designated Cafeteria Counter selector (*Counter 1 Fast Food*, *Counter 2 South Indian*, *Counter 3 Beverages*).
   - Pickup Time Slot selector: Express (~10 mins), 11:30 AM, 11:45 AM, 12:00 PM, 12:15 PM, 12:30 PM, 12:45 PM, 01:00 PM.
   - Special cooking notes & allergies textarea.
   - Payment method selector:
     * *Student Meal Card* (RFID STU-2024-8842 - Balance: ₹480)
     * *Instant UPI / QR* (PhonePe / GPay / Paytm)
     * *Pay Cash at Counter Pickup*
   - Itemized tax invoice breakdown with 5% GST and instant confirmation.

### ⏳ Section 2: Live Orders & Tokens
6. **Live Order Tracking Page** (`tracking`)
   - Active Order ID tracking (e.g. `ORD-10045`), estimated pickup time, and counter location.
   - Multi-stage timeline with animated indicators:
     1. *Order Placed & Confirmed*
     2. *Accepted by Counter Chef*
     3. *Cooking in Kitchen (Animated Pulse)*
     4. *Ready at Pickup Counter*
     5. *Collected by Student*
   - Interactive simulation button ("⚡ Simulate Kitchen Step") to test real-time state changes.

7. **Digital QR Pickup Token Page** (`order-ready`)
   - Celebratory confetti burst on order completion 🎉.
   - High-resolution scannable QR Code token generated dynamically using QRCode.js.
   - 4-digit verification PIN (`4829`) for instant counter pickup.
   - Official Printable Cafeteria Bill Receipt generator (`window.print()`).

8. **Order History & Quick Reorder Page** (`orders-history`)
   - Filterable tabs: *All*, *Ongoing*, *Completed*.
   - Complete item details, dates, and total amount paid.
   - **1-Click Reorder Button**: Automatically repopulates the tray with past favorites.
   - View tax invoice and printable slip.

### 💳 Section 3: Campus Services
9. **Campus Digital Wallet & Meal Card Page** (`wallet`)
   - Virtual Campus RFID Smartcard visual (`STU-2024-8842`).
   - Current balance display (₹480.00).
   - Quick recharge presets (+₹100, +₹250, +₹500, +₹1,000).
   - 5% automatic campus dining cashback ledger.
   - Itemized transaction history (debits, credits, UPI top-ups).

10. **Weekly Meal Subscription & Meal Planner Page** (`meal-plans`)
    - *Power Breakfast Pass* (₹799/month - ₹32/meal)
    - *Student Lunch Thali Pack* (₹1,499/month - ₹60/meal)
    - *Athlete & High-Protein Diet Plan* (₹1,999/month - ₹80/meal)
    - Instant activation directly onto student RFID cards.

11. **Nutrition, Macros & Calorie Diet Tracker Page** (`nutrition`)
    - Daily calorie target meter vs consumed calories.
    - Macronutrient split: Protein (g), Carbohydrates (g), Fats (g).
    - Food items logged today with individual macro values.

12. **Live Cafeteria Crowd & Table Availability Monitor Page** (`crowd-monitor`)
    - Real-time occupancy sensors across 3 campus dining areas:
      * *Main Dining Hall (Ground Floor)*: 62% Occupancy
      * *Express Kiosk & Coffee Bar (1st Floor)*: 88% Peak Rush
      * *Garden Terrace & Green Patio*: 34% Quiet & Relaxed
    - Free table reservation form for study groups and lunch breaks.

13. **Bulk Catering & Society Event Orders Page** (`catering`)
    - Menu packages for Hackathons, Seminars, Workshops, and Cultural Fests.
    - Interactive headcount slider (15 to 200 guests) with instant cost estimation.
    - Venue delivery selector (Auditorium, Computer Labs, Hostel Common Room).

14. **Customer Reviews, Chef Specials & Suggestion Voting Box Page** (`reviews`)
    - Verified student review board with star ratings.
    - **Interactive Student Suggestion Voting Box**: Submit new dish proposals and upvote favorites for next Friday's special menu!

### 👤 Section 4: Account & Management
15. **User Profile & Account Settings Page** (`profile`)
    - Student ID card (`Kumud Negi`, `CSE - 2nd Year`, `STU-2024-8842`).
    - Linked RFID meal card, dining wallet balance, and loyalty points.
    - Dietary preference management.

16. **Login, Registration & Student ID Authentication Page** (`login`)
    - Cafeteria food tray vector illustration.
    - Email / Roll No and password with show/hide toggle.
    - Google Campus SSO and College ID single-click authentication.
    - Pre-filled credentials for one‑click testing.

17. **Kitchen Display System (KDS) & Admin Dashboard Page** (`admin`)
    - Live Kanban kitchen queue: *New Orders*, *Cooking in Kitchen*, *Ready at Counter*.
    - Interactive order status advancement buttons.
    - Today's revenue analytics (`₹12,450`), today's orders count (`128`), and kitchen prep time stats.

18. **Help Center, Cafeteria Timings & Contact Support Page** (`help`)
    - Complete operating hours for all 3 campus food counters.
    - Searchable FAQ accordion.
    - Direct cafeteria manager hotline and email support.

---

## 🎛️ Navigation & Interactions

* **Top Global Navbar**: Shows campus location, food search, active cooking order pill, sound FX toggle, live cart badge, and user avatar.
* **Collapsible Sidebar**: Gives categorized 1‑click access to all 18 pages with badge counts.
* **Bottom Quick‑Page Dock**: Sticky bottom bar allowing instantaneous switching between any of the 18 pages.
* **Tactile Web Audio Feedback**: Realistic audio clicks, add‑to‑tray pops, and order placement fanfares generated via the Web Audio API.
* **Print Bill Feature**: Clicking *"Print Cafeteria Receipt"* triggers a clean, professional paper invoice.