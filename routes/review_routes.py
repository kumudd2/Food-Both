"""
Reviews & Student Dish Suggestion Voting Box Blueprint
Directly integrated with cafeteria_schema.sql (reviews, users, menu_items).
"""
import uuid
from flask import Blueprint, jsonify, request
from database import get_db_connection

review_bp = Blueprint('reviews', __name__, url_prefix='/api')

@review_bp.route('/reviews', methods=['GET'])
def get_reviews():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT r.*, u.full_name as student_name, sp.department, m.name as dish
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN student_profiles sp ON u.id = sp.user_id
    LEFT JOIN menu_items m ON r.item_id = m.id
    ORDER BY r.created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    reviews = []
    for r in rows:
        reviews.append({
            'id': r['id'],
            'studentName': r['student_name'] or 'Student',
            'department': r['department'] or 'Campus',
            'dish': r['dish'] or 'Cafeteria Special',
            'rating': float(r['food_rating'] or 5.0),
            'comment': r['comment'] or '',
            'date': r['created_at'],
            'avatar': 'assets/avatar.jpg'
        })

    return jsonify({'success': True, 'count': len(reviews), 'reviews': reviews})

@review_bp.route('/reviews', methods=['POST'])
def add_review():
    data = request.get_json() or {}
    user_id = data.get('user_id')
    dish_id = data.get('dish_id') or data.get('item_id')
    comment = data.get('comment', '').strip()
    rating = int(data.get('rating', 5))

    if not comment:
        return jsonify({'success': False, 'message': 'Comment is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    if not user_id:
        cursor.execute("SELECT id FROM users WHERE role = 'student' LIMIT 1")
        u = cursor.fetchone()
        user_id = u['id'] if u else 'u1111111-1111-1111-1111-111111111111'

    rev_id = str(uuid.uuid4())
    cursor.execute("""
    INSERT INTO reviews (id, order_id, user_id, item_id, food_rating, service_rating, comment)
    VALUES (?, NULL, ?, ?, ?, ?, ?)
    """, (rev_id, user_id, dish_id, rating, rating, comment))

    conn.commit()
    conn.close()

    return jsonify({'success': True, 'message': 'Thank you for your dining review!', 'review_id': rev_id}), 201

# In-memory student dish suggestion poll
MOCK_SUGGESTIONS = [
    {'id': 'sug-1', 'name': 'Schezwan Fried Rice & Manchurian Combo', 'author': 'Rohit V. (IT 3rd Year)', 'votes': 142, 'status': 'Under Chef Review'},
    {'id': 'sug-2', 'name': 'Poha with Sev & Masala Tea', 'author': 'Ananya P. (Design)', 'votes': 118, 'status': 'Approved for Next Week'},
    {'id': 'sug-3', 'name': 'Oats & Dark Berry Smoothie Bowl', 'author': 'Vikram S. (Sports Club)', 'votes': 87, 'status': 'Testing Recipe'}
]

@review_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    return jsonify({'success': True, 'suggestions': MOCK_SUGGESTIONS})

@review_bp.route('/suggestions/<sug_id>/vote', methods=['POST'])
def vote_suggestion(sug_id):
    for s in MOCK_SUGGESTIONS:
        if s['id'] == sug_id:
            s['votes'] += 1
            return jsonify({'success': True, 'votes': s['votes']})
    return jsonify({'success': False, 'message': 'Suggestion not found'}), 404
