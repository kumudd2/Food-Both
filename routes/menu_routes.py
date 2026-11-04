"""
Menu & Catalog Blueprint
Directly integrated with cafeteria_schema.sql (categories, menu_items, pickup_slots, coupons).
"""
from flask import Blueprint, jsonify, request
from database import get_db_connection
from models import MenuModel

menu_bp = Blueprint('menu', __name__, url_prefix='/api')

@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({'success': True, 'categories': rows})

@menu_bp.route('/slots', methods=['GET'])
def get_slots():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pickup_slots WHERE is_active = 1 ORDER BY start_time ASC")
    raw_slots = [dict(r) for r in cursor.fetchall()]
    conn.close()

    # Map to frontend structure
    slots = []
    for s in raw_slots:
        slots.append({
            'id': s['id'],
            'time': f"{s['start_time']} - {s['end_time']}",
            'start_time': s['start_time'],
            'end_time': s['end_time'],
            'available': (s['capacity'] - s['booked_count']) > 0,
            'booked': s['booked_count'],
            'capacity': s['capacity']
        })

    return jsonify({'success': True, 'slots': slots})

@menu_bp.route('/coupons', methods=['GET'])
def get_coupons():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM coupons WHERE is_active = 1")
    coupons = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({'success': True, 'coupons': coupons})

@menu_bp.route('/menu', methods=['GET'])
def get_menu():
    category = request.args.get('category', 'all').lower()
    search = request.args.get('search', '').lower().strip()
    diet = request.args.get('diet', 'all').lower()
    sort_by = request.args.get('sort', 'recommended').lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT m.*, c.name as category_name
    FROM menu_items m
    JOIN categories c ON m.category_id = c.id
    WHERE m.is_available = 1
    """
    params = []

    if category != 'all':
        query += " AND LOWER(c.name) = ?"
        params.append(category)

    if search:
        query += " AND (LOWER(m.name) LIKE ? OR LOWER(m.description) LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    if diet in ('veg', 'non_veg', 'vegan', 'egg'):
        query += " AND m.diet = ?"
        params.append(diet)

    if sort_by == 'price-low':
        query += " ORDER BY m.base_price ASC"
    elif sort_by == 'price-high':
        query += " ORDER BY m.base_price DESC"
    elif sort_by == 'rating':
        query += " ORDER BY m.avg_rating DESC"
    else:
        query += " ORDER BY m.is_special DESC, m.avg_rating DESC"

    cursor.execute(query, params)
    raw_items = [dict(row) for row in cursor.fetchall()]
    conn.close()

    # Normalize fields for frontend compatibility
    items = []
    for item in raw_items:
        items.append({
            'id': item['id'],
            'name': item['name'],
            'category': item['category_name'].lower(),
            'category_name': item['category_name'],
            'price': float(item['base_price']),
            'base_price': float(item['base_price']),
            'image': item['image_url'],
            'rating': float(item['avg_rating']),
            'reviews': int(item['rating_count']),
            'isVeg': item['diet'] == 'veg',
            'diet': item['diet'],
            'calories': item['calories'] or 250,
            'prepTime': f"{item['prep_time_mins']} mins",
            'prep_time_mins': item['prep_time_mins'],
            'counter': 'Counter 1 (Fast Food)',
            'description': item['description'],
            'ingredients': item['ingredients'],
            'isSpecial': bool(item['is_special']),
            'stock': item['stock_qty']
        })

    return jsonify({
        'success': True,
        'count': len(items),
        'items': items
    })

@menu_bp.route('/menu/<item_id>', methods=['GET'])
def get_menu_item(item_id):
    item = MenuModel.get_by_id(item_id)
    if not item:
        return jsonify({'success': False, 'message': 'Dish not found'}), 404
    return jsonify({'success': True, 'item': item})
