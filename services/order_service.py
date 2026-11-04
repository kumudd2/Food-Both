"""
Order Lifecycle & QR Token Management Service
Directly integrated with cafeteria_schema.sql (orders, order_items, order_status_history, wallets).
"""
import uuid
import secrets
from datetime import datetime, date
from database import get_db_connection
from services.billing_service import BillingService

class OrderService:
    @staticmethod
    def generate_order_number():
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT count(*) as cnt FROM orders")
        count = cursor.fetchone()['cnt']
        conn.close()
        return f"ORD-{10045 + count + 1}"

    @staticmethod
    def generate_pin():
        return f"{secrets.randbelow(9000) + 1000}"

    @staticmethod
    def create_order(user_id=None, items=None, pickup_slot=None, counter='Counter 1 (Fast Food)',
                     special_instructions='', payment_method='Campus Meal Card', coupon_code=None):
        """
        Creates and persists a new pre-order into the SQLite database.
        """
        conn = get_db_connection()
        cursor = conn.cursor()

        # Resolve User ID
        if not user_id or user_id in ('user-1', 'default'):
            cursor.execute("SELECT id FROM users WHERE role = 'student' LIMIT 1")
            u_row = cursor.fetchone()
            user_id = u_row['id'] if u_row else 'u1111111-1111-1111-1111-111111111111'

        # Fetch verified item details from menu_items table
        order_items_data = []
        for it in (items or []):
            item_id = it.get('itemId') or it.get('item_id') or it.get('id')
            cursor.execute("SELECT * FROM menu_items WHERE id = ? OR LOWER(name) = ?", (item_id, str(item_id).lower()))
            row = cursor.fetchone()
            if not row:
                # Try finding by name substring
                cursor.execute("SELECT * FROM menu_items WHERE LOWER(name) LIKE ? LIMIT 1", (f"%{str(item_id).lower()}%",))
                row = cursor.fetchone()

            if row:
                qty = int(it.get('quantity') or it.get('qty') or 1)
                order_items_data.append({
                    'id': row['id'],
                    'name': row['name'],
                    'price': float(row['base_price']),
                    'quantity': qty
                })

        if not order_items_data:
            conn.close()
            raise ValueError("No valid menu items found in order payload.")

        # Calculate bill (subtotal, GST 5%, coupon discount)
        bill = BillingService.calculate_bill(order_items_data, coupon_code)

        # Resolve or match pickup slot ID
        pickup_slot_id = 'slot-4'
        if pickup_slot:
            cursor.execute("SELECT id FROM pickup_slots WHERE start_time LIKE ? OR end_time LIKE ? LIMIT 1",
                           (f"%{pickup_slot}%", f"%{pickup_slot}%"))
            ps_row = cursor.fetchone()
            if ps_row:
                pickup_slot_id = ps_row['id']

        # Generate IDs and tokens
        order_uuid = str(uuid.uuid4())
        order_number = OrderService.generate_order_number()
        qr_token = secrets.token_hex(8)
        invoice_number = f"INV-2026-{secrets.randbelow(90000) + 10000}"
        pin = OrderService.generate_pin()

        # 1. Insert into orders table
        cursor.execute("""
        INSERT INTO orders (
            id, order_number, user_id, pickup_slot_id, status, subtotal, discount_amount,
            tax_amount, total_amount, coupon_id, pickup_qr_token, invoice_number, notes
        ) VALUES (?, ?, ?, ?, 'placed', ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            order_uuid, order_number, user_id, pickup_slot_id, bill['subtotal'], bill['discount'],
            bill['gst'], bill['total'], coupon_code, qr_token, invoice_number, special_instructions
        ))

        # 2. Insert into order_items table
        for it in order_items_data:
            oi_id = str(uuid.uuid4())
            line_total = round(it['price'] * it['quantity'], 2)
            cursor.execute("""
            INSERT INTO order_items (
                id, order_id, item_id, item_name, variant_label, addons, unit_price, quantity, line_total, instructions
            ) VALUES (?, ?, ?, ?, 'Regular', '[]', ?, ?, ?, ?)
            """, (oi_id, order_uuid, it['id'], it['name'], it['price'], it['quantity'], line_total, special_instructions))

            # Decrement stock in menu_items
            cursor.execute("""
            UPDATE menu_items SET stock_qty = MAX(0, stock_qty - ?) WHERE id = ?
            """, (it['quantity'], it['id']))

        # 3. Insert into order_status_history
        cursor.execute("""
        INSERT INTO order_status_history (id, order_id, status, changed_by, note)
        VALUES (?, ?, 'placed', ?, 'Customer placed pre-order via app')
        """, (str(uuid.uuid4()), order_uuid, user_id))

        # 4. Handle Wallet payment deduction
        if 'meal' in payment_method.lower() or 'wallet' in payment_method.lower():
            cursor.execute("SELECT balance, reward_points FROM wallets WHERE user_id = ?", (user_id,))
            w_row = cursor.fetchone()
            if w_row:
                cur_bal = float(w_row['balance'])
                new_bal = max(0.0, cur_bal - bill['total'])
                points_earned = int(bill['subtotal'] * 0.1)  # 10% loyalty reward points

                cursor.execute("""
                UPDATE wallets SET balance = ?, reward_points = reward_points + ? WHERE user_id = ?
                """, (new_bal, points_earned, user_id))

                # Insert wallet transaction
                cursor.execute("""
                INSERT INTO wallet_transactions (id, user_id, txn_type, amount, points_delta, balance_after, reference)
                VALUES (?, ?, 'payment', ?, ?, ?, ?)
                """, (str(uuid.uuid4()), user_id, -bill['total'], points_earned, new_bal, f"Pre-order {order_number}"))

        # 5. Insert payment record
        cursor.execute("""
        INSERT INTO payments (id, order_id, method, status, amount, gateway_txn_id)
        VALUES (?, ?, ?, 'success', ?, ?)
        """, (str(uuid.uuid4()), order_uuid, 'wallet' if 'meal' in payment_method.lower() else 'upi',
              bill['total'], f"PAY-{secrets.token_hex(4).upper()}"))

        # 6. Insert notification
        cursor.execute("""
        INSERT INTO notifications (id, user_id, type, title, body, order_id, is_read)
        VALUES (?, ?, 'order', ?, ?, ?, 0)
        """, (str(uuid.uuid4()), user_id, f"Order {order_number} Placed",
              f"Pre-order confirmed for slot {pickup_slot or '12:15 PM'} at {counter}.", order_uuid))

        conn.commit()
        conn.close()

        # Build timeline for UI
        now_time = datetime.now().strftime("%I:%M %p")
        timeline = [
            {'title': 'Order Placed & Confirmed', 'time': now_time, 'done': True, 'current': True},
            {'title': 'Accepted by Counter Chef', 'time': 'Pending', 'done': False},
            {'title': 'Cooking in Kitchen', 'time': 'Pending', 'done': False},
            {'title': f'Ready at {counter}', 'time': f"Est. {pickup_slot or '12:15 PM'}", 'done': False},
            {'title': 'Collected by Student', 'time': 'Pending', 'done': False}
        ]

        return {
            'id': order_number,
            'order_id': order_number,
            'uuid': order_uuid,
            'pickup_slot': pickup_slot or '12:15 PM',
            'counter': counter,
            'items': order_items_data,
            'items_count': sum(i['quantity'] for i in order_items_data),
            'subtotal': bill['subtotal'],
            'gst': bill['gst'],
            'packaging': bill['packaging'],
            'discount': bill['discount'],
            'total': bill['total'],
            'status': 'placed',
            'pin': pin,
            'verificationPin': pin,
            'qr_token': qr_token,
            'qr_payload': f"SMART-CAFETERIA|ID:{order_number}|TOKEN:{qr_token}|SLOT:{pickup_slot or '12:15 PM'}|PIN:{pin}",
            'timeline': timeline,
            'date': f"Today, {now_time}",
            'invoice_number': invoice_number
        }

    @staticmethod
    def update_order_status(order_id_or_number, target_status):
        """
        Updates the stage of an order (Kitchen KDS advancement).
        """
        valid_statuses = ['placed', 'accepted', 'preparing', 'ready', 'collected', 'completed', 'cancelled']
        target_status = target_status.lower()
        if target_status == 'cooking':
            target_status = 'preparing'

        if target_status not in valid_statuses:
            raise ValueError(f"Invalid status: {target_status}")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE id = ? OR order_number = ?", (order_id_or_number, order_id_or_number))
        order = cursor.fetchone()
        if not order:
            conn.close()
            raise KeyError(f"Order {order_id_or_number} not found.")

        # Update order status
        cursor.execute("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (target_status, order['id']))

        # Add to order_status_history
        cursor.execute("""
        INSERT INTO order_status_history (id, order_id, status, changed_by, note)
        VALUES (?, ?, ?, 'staff', ?)
        """, (str(uuid.uuid4()), order['id'], target_status, f"Status updated to {target_status} by kitchen"))

        # If order is ready, add notification
        if target_status == 'ready':
            cursor.execute("""
            INSERT INTO notifications (id, user_id, type, title, body, order_id, is_read)
            VALUES (?, ?, 'order', ?, ?, ?, 0)
            """, (str(uuid.uuid4()), order['user_id'], f"Order {order['order_number']} is Ready! 🎉",
                  "Your pre-order is hot and packed at Counter 1. Please scan your QR code to collect.", order['id']))

        conn.commit()
        conn.close()

        return {
            'order_id': order['order_number'],
            'status': target_status,
            'updated': True
        }
