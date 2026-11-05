-- ============================================================
-- FoodBooth PostgreSQL Seed Data
-- Compatible with PostgreSQL 13+ and schema_postgres.sql
-- ============================================================

BEGIN;

-- 1. Users
INSERT INTO users (id, role, full_name, email, phone, password_hash, avatar_url, is_active)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'student', 'Kumud Negi', 'kumud.negi@college.edu', '+91 98765 43210', '$2b$10$hashedpassword123placeholder', '/avatar.jpg', TRUE),
  ('22222222-2222-2222-2222-222222222222', 'staff', 'Chef Ramesh Kumar', 'ramesh.counter1@college.edu', '+91 98765 43211', '$2b$10$hashedpassword123placeholder', '/avatar.jpg', TRUE),
  ('33333333-3333-3333-3333-333333333333', 'admin', 'Cafeteria Manager Sharma', 'cafeteria.admin@college.edu', '+91 98765 43212', '$2b$10$hashedpassword123placeholder', '/avatar.jpg', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 2. Student Profile
INSERT INTO student_profiles (user_id, roll_number, department, year_of_study, dietary_preference, allergies, notify_order_updates, notify_offers)
VALUES ('11111111-1111-1111-1111-111111111111', 'STU-2024-8842', 'CSE - 2nd Year', 2, 'veg', ARRAY['Lactose (Low)'], TRUE, TRUE)
ON CONFLICT (roll_number) DO NOTHING;

-- 3. Categories
INSERT INTO categories (id, name, sort_order, is_active) VALUES
  (1, 'Breakfast', 1, TRUE),
  (2, 'Mains & Thalis', 2, TRUE),
  (3, 'Burgers & Pizzas', 3, TRUE),
  (4, 'Chaat & Snacks', 4, TRUE),
  (5, 'Healthy Bowls', 5, TRUE),
  (6, 'Beverages', 6, TRUE),
  (7, 'Desserts', 7, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, is_active = EXCLUDED.is_active;

-- 4. Cafeteria Settings
INSERT INTO cafeteria_settings (id, name, address, contact_phone, tax_percent, is_open, slot_length_mins, default_slot_cap, payment_gateway)
VALUES (1, 'Central Campus Dining Hall', 'Ground Floor, Student Activity Center, Block C', '+91 11 2345 6789', 5.00, TRUE, 15, 20, 'CampusPay / UPI')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 5. Operating Hours
INSERT INTO operating_hours (day_of_week, opens_at, closes_at, is_closed) VALUES
  (0, '07:30', '22:00', FALSE),
  (1, '07:30', '22:00', FALSE),
  (2, '07:30', '22:00', FALSE),
  (3, '07:30', '22:00', FALSE),
  (4, '07:30', '22:00', FALSE),
  (5, '08:00', '22:30', FALSE),
  (6, '08:00', '21:00', FALSE)
ON CONFLICT (day_of_week) DO NOTHING;

-- 6. Menu Items
INSERT INTO menu_items (
    id, category_id, name, description, ingredients, image_url,
    base_price, diet, calories, prep_time_mins, is_available, is_special,
    stock_qty, low_stock_alert, avg_rating, rating_count
) VALUES
  ('a0000001-0000-0000-0000-000000000001', 3, 'Classic Gourmet Burger',
   'Juicy seasoned patty, melted cheddar cheese, crisp lettuce, tomato slices, and signature house burger sauce in a toasted brioche bun.',
   'Wheat Brioche, Patty, Cheddar Cheese, Lettuce, Tomato, Secret Sauce', '/burger.jpg',
   149.00, 'non_veg', 520, 10, TRUE, TRUE, 80, 10, 4.80, 184),

  ('a0000001-0000-0000-0000-000000000002', 1, 'Crispy Butter Masala Dosa',
   'Golden paper-thin crispy fermented crepe stuffed with spiced potato masala, served with piping hot drumstick sambar and fresh coconut chutney.',
   'Fermented Rice & Lentil Crepe, Spiced Potato Masala, Butter, Sambar, Coconut Chutney', '/dosa.jpg',
   85.00, 'veg', 310, 8, TRUE, TRUE, 120, 15, 4.90, 320),

  ('a0000001-0000-0000-0000-000000000003', 2, 'Royal Campus Special Thali',
   'Complete wholesome student meal: Paneer butter masala, yellow dal tadka, jeera rice, 3 butter rotis, boondi raita, crispy papad, and hot gulab jamun.',
   'Paneer, Yellow Dal, Wheat Rotis, Basmati Rice, Yogurt Raita, Gulab Jamun, Papad', '/thali.jpg',
   140.00, 'veg', 680, 12, TRUE, TRUE, 150, 20, 4.90, 412),

  ('a0000001-0000-0000-0000-000000000004', 3, 'Farmhouse Veggie Supreme Pizza',
   'Stone-baked thin crust pizza loaded with mozzarella cheese, bell peppers, golden sweet corn, sliced black olives, and Italian herbs.',
   'Hand-tossed Dough, Mozzarella, Bell Peppers, Sweet Corn, Black Olives, Basil', '/pizza.jpg',
   199.00, 'veg', 620, 15, TRUE, FALSE, 40, 5, 4.70, 156),

  ('a0000001-0000-0000-0000-000000000005', 4, 'Peri-Peri Crusted Crispy Fries',
   'Golden crispy hand-cut fries dusted with fiery peri-peri seasoning, served with garlic mayo dip.',
   'Russet Potatoes, Peri-Peri Spices, Garlic Truffle Mayo Dip', '/fries.jpg',
   75.00, 'veg', 280, 6, TRUE, FALSE, 100, 12, 4.70, 210),

  ('a0000001-0000-0000-0000-000000000006', 4, 'Crispy Samosa Chaat Platter',
   'Two golden flaky samosas crushed and topped with spiced chole ragda, sweet tamarind chutney, mint relish, sev, and coriander.',
   'Potatoes, Chickpeas Ragda, Spices, Tamarind, Mint, Sev', '/samosa.jpg',
   55.00, 'veg', 340, 5, TRUE, FALSE, 90, 15, 4.80, 280),

  ('a0000001-0000-0000-0000-000000000007', 6, 'Chilled Cold Coffee with Scoop',
   'Slow-brewed rich espresso blended with chilled whole milk, topped with a scoop of creamy vanilla ice cream and chocolate syrup.',
   'Espresso, Whole Milk, Vanilla Ice Cream Scoop, Chocolate Drizzle', '/coffee.jpg',
   70.00, 'veg', 210, 4, TRUE, TRUE, 160, 20, 4.90, 390),

  ('a0000001-0000-0000-0000-000000000008', 7, 'Warm Fudge Chocolate Brownie',
   'Decadent warm dark chocolate walnut brownie with molten center, drizzled with chocolate ganache.',
   'Dark Cocoa, Walnuts, Butter, Chocolate Ganache', '/cake.jpg',
   80.00, 'veg', 350, 5, TRUE, FALSE, 60, 8, 4.90, 175)
ON CONFLICT (id) DO NOTHING;

-- 7. Addons
INSERT INTO addons (id, name, price, is_active) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Extra Cheddar Cheese Slice', 20.00, TRUE),
  ('b0000001-0000-0000-0000-000000000002', 'Double Patty Upgrade', 45.00, TRUE),
  ('b0000001-0000-0000-0000-000000000003', 'Fiery Peri-Peri Dip', 20.00, TRUE),
  ('b0000001-0000-0000-0000-000000000004', 'Vanilla Ice Cream Scoop', 25.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. Pickup Slots
INSERT INTO pickup_slots (id, slot_date, start_time, end_time, capacity, booked_count, is_active) VALUES
  ('c0000001-0000-0000-0000-000000000001', CURRENT_DATE, '11:30', '11:45', 25, 4, TRUE),
  ('c0000001-0000-0000-0000-000000000002', CURRENT_DATE, '11:45', '12:00', 25, 12, TRUE),
  ('c0000001-0000-0000-0000-000000000003', CURRENT_DATE, '12:00', '12:15', 25, 18, TRUE),
  ('c0000001-0000-0000-0000-000000000004', CURRENT_DATE, '12:15', '12:30', 25, 14, TRUE),
  ('c0000001-0000-0000-0000-000000000005', CURRENT_DATE, '12:30', '12:45', 25, 21, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 9. Coupons
INSERT INTO coupons (id, code, description, discount_type, discount_value, max_discount, min_order_value, usage_limit, per_user_limit, valid_from, valid_until, is_active) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'CAMPUS50', 'Flat ₹50 discount on orders above ₹150', 'flat', 50.00, 50.00, 150.00, 1000, 2, '2026-01-01', '2026-12-31', TRUE),
  ('d0000001-0000-0000-0000-000000000002', 'STUDENT10', '10% instant student discount up to ₹40', 'percent', 10.00, 40.00, 80.00, 5000, 1, '2026-01-01', '2026-12-31', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 10. Dining Wallets
INSERT INTO wallets (user_id, balance, reward_points)
VALUES ('11111111-1111-1111-1111-111111111111', 480.00, 240)
ON CONFLICT (user_id) DO UPDATE SET balance = EXCLUDED.balance, reward_points = EXCLUDED.reward_points;

-- 11. Wallet Transactions
INSERT INTO wallet_transactions (id, user_id, txn_type, amount, points_delta, balance_after, reference) VALUES
  ('e0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'topup', 500.00, 25, 500.00, 'UPI Instant Top-Up via GPay'),
  ('e0000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'payment', -147.00, 14, 353.00, 'Pre-order ORD-10044'),
  ('e0000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'topup', 127.00, 6, 480.00, 'Mess Cashback Reward')
ON CONFLICT (id) DO NOTHING;

COMMIT;
