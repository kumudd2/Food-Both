"""
Nutrition & Daily Macro Tracker Blueprint
"""
from flask import Blueprint, jsonify, request
from datetime import datetime
from database import get_db_connection

nutrition_bp = Blueprint('nutrition', __name__, url_prefix='/api/nutrition')

@nutrition_bp.route('', methods=['GET'])
def get_nutrition_stats():
    user_id = request.args.get('user_id', 'user-1')
    today_str = datetime.now().strftime("%Y-%m-%d")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT dish_name, calories, protein, carbs, fat
    FROM nutrition_logs
    WHERE user_id = ? AND date = ?
    """, (user_id, today_str))

    logged = [dict(r) for r in cursor.fetchall()]

    # If no logs today, provide standard seed demo items
    if not logged:
        logged = [
            {'dish_name': 'Veg Burger', 'calories': 320, 'protein': 11, 'carbs': 42, 'fat': 12},
            {'dish_name': 'Cold Coffee with Ice Cream', 'calories': 180, 'protein': 5, 'carbs': 26, 'fat': 6},
            {'dish_name': 'French Fries', 'calories': 280, 'protein': 4, 'carbs': 38, 'fat': 13},
            {'dish_name': 'Mediterranean Salad Bowl', 'calories': 210, 'protein': 14, 'carbs': 18, 'fat': 8}
        ]

    cals = sum(d['calories'] for d in logged)
    p = sum(d['protein'] for d in logged)
    c = sum(d['carbs'] for d in logged)
    f = sum(d['fat'] for d in logged)

    conn.close()

    return jsonify({
        'success': True,
        'stats': {
            'calorie_target': 2100,
            'calorie_consumed': cals,
            'protein_target': 75,
            'protein_consumed': p,
            'carbs_target': 250,
            'carbs_consumed': c,
            'fat_target': 60,
            'fat_consumed': f,
            'logged_dishes': logged
        }
    })

@nutrition_bp.route('/log', methods=['POST'])
def log_dish():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'user-1')
    dish_name = data.get('dish_name')
    calories = int(data.get('calories', 0))
    protein = float(data.get('protein', 0.0))
    carbs = float(data.get('carbs', 0.0))
    fat = float(data.get('fat', 0.0))
    today_str = datetime.now().strftime("%Y-%m-%d")

    if not dish_name:
        return jsonify({'success': False, 'message': 'Dish name required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO nutrition_logs (user_id, date, dish_name, calories, protein, carbs, fat)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, today_str, dish_name, calories, protein, carbs, fat))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'message': f'Logged {dish_name} to nutrition diary!'})
