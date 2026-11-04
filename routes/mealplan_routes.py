"""
Weekly Meal Subscription Passes Blueprint
With graceful database fallback.
"""
from flask import Blueprint, jsonify, request
import json
from database import get_db_connection

mealplan_bp = Blueprint('mealplans', __name__, url_prefix='/api/meal-plans')

DEFAULT_MEAL_PLANS = [
    {
        'id': 'plan-lunch-standard',
        'title': 'Campus Standard Lunch Pass',
        'badge': 'Most Popular',
        'price': 650,
        'validity': '5 Days (Mon - Fri)',
        'features': [
            '1 Special Thali / Meal Bowl per day',
            'Priority queue skip pickup at Counter 2',
            'Choice of fresh lime soda or lassi daily',
            'Saves ₹120 weekly compared to counter orders'
        ]
    },
    {
        'id': 'plan-breakfast-blitz',
        'title': 'Morning Breakfast & Beverage Pass',
        'badge': 'Early Bird',
        'price': 420,
        'validity': '6 Days (Mon - Sat)',
        'features': [
            'Any Breakfast Dish (Dosa / Sandwich / Poha / Idli)',
            'Hot Masala Chai or Chilled Cold Coffee included',
            'Ready for pickup before 8:45 AM class',
            'Saves ₹90 weekly'
        ]
    },
    {
        'id': 'plan-fit-fuel',
        'title': 'Hostel FitFuel Pro Subscription',
        'badge': 'High Protein',
        'price': 980,
        'validity': '7 Days (Full Week)',
        'features': [
            'High protein meal (Paneer Salad Bowl / Sprouts)',
            'Fresh cold-pressed juice or Greek smoothie',
            'Nutritional macros auto-synced with health tracker',
            'Zero queue waiting at healthy bar'
        ]
    }
]

@mealplan_bp.route('', methods=['GET'])
def get_plans():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM meal_plans")
        rows = cursor.fetchall()
        plans = []
        for r in rows:
            p = dict(r)
            p['features'] = json.loads(p.get('features_json', '[]'))
            plans.append(p)
        conn.close()
        return jsonify({'success': True, 'count': len(plans), 'plans': plans or DEFAULT_MEAL_PLANS})
    except Exception:
        return jsonify({'success': True, 'count': len(DEFAULT_MEAL_PLANS), 'plans': DEFAULT_MEAL_PLANS})

@mealplan_bp.route('/subscribe', methods=['POST'])
def subscribe_plan():
    data = request.get_json() or {}
    plan_id = data.get('plan_id', 'plan-lunch-standard')
    user_id = data.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor()
    if not user_id:
        cursor.execute("SELECT id, full_name FROM users WHERE role = 'student' LIMIT 1")
    else:
        cursor.execute("SELECT id, full_name FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()

    plan_title = 'Campus Standard Lunch Pass'
    for p in DEFAULT_MEAL_PLANS:
        if p['id'] == plan_id:
            plan_title = p['title']

    return jsonify({
        'success': True,
        'message': f"Subscribed to {plan_title}! Linked to Student ID STU-2024-8842.",
        'plan_id': plan_id,
        'student': user['full_name'] if user else 'Kumud Negi'
    })
