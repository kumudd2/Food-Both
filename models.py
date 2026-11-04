"""
Data Access Models for Cafeteria Schema
Direct SQL mapping to the 28 tables and views defined in cafeteria_schema.sql.
"""
import json
import uuid
from datetime import datetime
from database import get_db_connection

class UserModel:
    @staticmethod
    def get_by_identifier(identifier):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT u.*, sp.roll_number, sp.department, sp.year_of_study, sp.dietary_preference
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE LOWER(u.email) = ? OR LOWER(sp.roll_number) = ?
        """, (identifier.lower(), identifier.lower()))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def get_by_id(user_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT u.*, sp.roll_number, sp.department, sp.year_of_study, sp.dietary_preference, w.balance as wallet_balance
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        LEFT JOIN wallets w ON u.id = w.user_id
        WHERE u.id = ?
        """, (user_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

class MenuModel:
    @staticmethod
    def get_categories():
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC")
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return rows

    @staticmethod
    def get_items(category_id=None, diet=None, search=None, sort=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
        SELECT m.*, c.name as category_name
        FROM menu_items m
        JOIN categories c ON m.category_id = c.id
        WHERE m.deleted_at IS NULL AND m.is_available = 1
        """
        params = []
        if category_id:
            query += " AND m.category_id = ?"
            params.append(category_id)
        if diet and diet != 'all':
            query += " AND m.diet = ?"
            params.append(diet)
        if search:
            query += " AND (LOWER(m.name) LIKE ? OR LOWER(m.description) LIKE ?)"
            params.extend([f"%{search.lower()}%", f"%{search.lower()}%"])

        if sort == 'price-low':
            query += " ORDER BY m.base_price ASC"
        elif sort == 'price-high':
            query += " ORDER BY m.base_price DESC"
        elif sort == 'rating':
            query += " ORDER BY m.avg_rating DESC"
        else:
            query += " ORDER BY m.is_special DESC, m.avg_rating DESC"

        cursor.execute(query, params)
        items = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return items

    @staticmethod
    def get_by_id(item_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT m.*, c.name as category_name
        FROM menu_items m
        JOIN categories c ON m.category_id = c.id
        WHERE m.id = ?
        """, (item_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return None
        item = dict(row)

        # Fetch variants
        cursor.execute("SELECT * FROM item_variants WHERE item_id = ?", (item_id,))
        item['variants'] = [dict(r) for r in cursor.fetchall()]

        # Fetch addons
        cursor.execute("""
        SELECT a.*
        FROM addons a
        JOIN menu_item_addons ma ON a.id = ma.addon_id
        WHERE ma.item_id = ? AND a.is_active = 1
        """, (item_id,))
        item['addons'] = [dict(r) for r in cursor.fetchall()]

        conn.close()
        return item

class OrderModel:
    @staticmethod
    def get_by_id(order_id_or_number):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT o.*, ps.slot_date, ps.start_time, ps.end_time, u.full_name as customer_name
        FROM orders o
        JOIN pickup_slots ps ON o.pickup_slot_id = ps.id
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ? OR o.order_number = ?
        """, (order_id_or_number, order_id_or_number))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return None
        order = dict(row)

        # Fetch order items
        cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order['id'],))
        order['items'] = [dict(r) for r in cursor.fetchall()]

        # Fetch status history
        cursor.execute("SELECT * FROM order_status_history WHERE order_id = ? ORDER BY changed_at ASC", (order['id'],))
        order['history'] = [dict(r) for r in cursor.fetchall()]

        conn.close()
        return order

    @staticmethod
    def get_user_orders(user_id, status_filter=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
        SELECT o.*, ps.slot_date, ps.start_time, ps.end_time
        FROM orders o
        JOIN pickup_slots ps ON o.pickup_slot_id = ps.id
        WHERE o.user_id = ?
        """
        params = [user_id]
        if status_filter == 'ongoing':
            query += " AND o.status NOT IN ('collected', 'rejected', 'cancelled')"
        elif status_filter == 'completed':
            query += " AND o.status IN ('collected', 'completed')"

        query += " ORDER BY o.created_at DESC"
        cursor.execute(query, params)
        orders = [dict(r) for r in cursor.fetchall()]

        for ord in orders:
            cursor.execute("SELECT item_name, quantity, line_total FROM order_items WHERE order_id = ?", (ord['id'],))
            ord['items'] = [dict(r) for r in cursor.fetchall()]

        conn.close()
        return orders

class WalletModel:
    @staticmethod
    def get_wallet(user_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM wallets WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def get_transactions(user_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return rows
