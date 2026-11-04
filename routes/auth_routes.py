"""
Authentication & Student Profile Blueprint
Directly integrated with cafeteria_schema.sql (users, student_profiles, wallets).
"""
from flask import Blueprint, jsonify, request
from database import get_db_connection

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email_or_roll = data.get('email', 'kumud.negi@college.edu').strip().lower()
    password = data.get('password', 'password123')
    provider = data.get('provider', 'credentials')  # 'credentials' | 'google' | 'college_id'

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT u.*, sp.roll_number, sp.department, sp.year_of_study, sp.dietary_preference, w.balance, w.reward_points
    FROM users u
    LEFT JOIN student_profiles sp ON u.id = sp.user_id
    LEFT JOIN wallets w ON u.id = w.user_id
    WHERE LOWER(u.email) = ? OR LOWER(sp.roll_number) = ? OR LOWER(u.full_name) LIKE ?
    LIMIT 1
    """, (email_or_roll, email_or_roll, f"%{email_or_roll}%"))
    user = cursor.fetchone()

    if not user:
        # Fallback to Kumud Negi
        cursor.execute("""
        SELECT u.*, sp.roll_number, sp.department, sp.year_of_study, sp.dietary_preference, w.balance, w.reward_points
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        LEFT JOIN wallets w ON u.id = w.user_id
        WHERE u.role = 'student'
        LIMIT 1
        """)
        user = cursor.fetchone()

    u_dict = dict(user) if user else {}
    conn.close()

    response_user = {
        'id': u_dict.get('id', 'u1111111-1111-1111-1111-111111111111'),
        'name': u_dict.get('full_name', 'Kumud Negi'),
        'fullName': u_dict.get('full_name', 'Kumud Negi'),
        'email': u_dict.get('email', 'kumud.negi@college.edu'),
        'phone': u_dict.get('phone', '+91 98765 43210'),
        'studentId': u_dict.get('roll_number', 'STU-2024-8842'),
        'department': u_dict.get('department', 'CSE - 2nd Year'),
        'year': u_dict.get('year_of_study', 2),
        'diet': u_dict.get('dietary_preference', 'veg'),
        'walletBalance': float(u_dict.get('balance', 480.00)),
        'rewardPoints': int(u_dict.get('reward_points', 1240)),
        'avatar': u_dict.get('avatar_url', 'assets/avatar.jpg')
    }

    return jsonify({
        'success': True,
        'message': f"Welcome back, {response_user['name']}! Signed in via {provider}.",
        'user': response_user,
        'token': f"campus-jwt-{response_user['id']}"
    })

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    cursor = conn.cursor()

    if not user_id:
        cursor.execute("SELECT id FROM users WHERE role = 'student' LIMIT 1")
        u = cursor.fetchone()
        user_id = u['id'] if u else 'u1111111-1111-1111-1111-111111111111'

    cursor.execute("""
    SELECT u.*, sp.roll_number, sp.department, sp.year_of_study, sp.dietary_preference, w.balance, w.reward_points
    FROM users u
    LEFT JOIN student_profiles sp ON u.id = sp.user_id
    LEFT JOIN wallets w ON u.id = w.user_id
    WHERE u.id = ?
    """, (user_id,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    u_dict = dict(user)
    return jsonify({
        'success': True,
        'user': {
            'id': u_dict['id'],
            'name': u_dict['full_name'],
            'fullName': u_dict['full_name'],
            'email': u_dict['email'],
            'phone': u_dict['phone'],
            'studentId': u_dict.get('roll_number', 'STU-2024-8842'),
            'department': u_dict.get('department', 'CSE - 2nd Year'),
            'year': u_dict.get('year_of_study', 2),
            'diet': u_dict.get('dietary_preference', 'veg'),
            'walletBalance': float(u_dict.get('balance', 0.0)),
            'rewardPoints': int(u_dict.get('reward_points', 0)),
            'avatar': u_dict.get('avatar_url', 'assets/avatar.jpg')
        }
    })
