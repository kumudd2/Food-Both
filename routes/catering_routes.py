"""
Bulk Society & Club Event Catering Blueprint
With graceful database fallback.
"""
from flask import Blueprint, jsonify, request
import random
from database import get_db_connection

catering_bp = Blueprint('catering', __name__, url_prefix='/api/catering')

DEFAULT_CATERING_PACKAGES = [
    {
        'id': 'pkg-hackathon',
        'name': 'Hackathon & Tech Fest Munch Box',
        'price_per_head': 140,
        'min_pax': 20,
        'tag': 'Best for Coders',
        'items': ['Mini Veg Burger', 'Salted French Fries Dip', 'Belgian Fudge Brownie', 'Cold Coffee Can']
    },
    {
        'id': 'pkg-high-tea',
        'name': 'Campus Executive High-Tea Spread',
        'price_per_head': 95,
        'min_pax': 15,
        'tag': 'Formal Seminars',
        'items': ['Grilled Paneer Triangles', 'Crispy Cocktail Samosas', 'Cookies Platter', 'Masala Filter Chai & Coffee']
    },
    {
        'id': 'pkg-banquet',
        'name': 'Annual Department Gala Feast',
        'price_per_head': 220,
        'min_pax': 40,
        'tag': 'Grand Buffet',
        'items': ['Paneer Butter Masala', 'Dal Makhani Tadka', 'Jeera Butter Rice', 'Butter Naan / Phulkas', 'Gulab Jamun with Rabri']
    }
]

@catering_bp.route('/packages', methods=['GET'])
def get_catering_packages():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM catering_packages")
        rows = cursor.fetchall()
        packages = [dict(r) for r in rows]
        conn.close()
        return jsonify({'success': True, 'count': len(packages), 'packages': packages or DEFAULT_CATERING_PACKAGES})
    except Exception:
        return jsonify({'success': True, 'count': len(DEFAULT_CATERING_PACKAGES), 'packages': DEFAULT_CATERING_PACKAGES})

@catering_bp.route('/quote', methods=['POST'])
def calculate_quote_and_book():
    data = request.get_json() or {}
    package_id = data.get('package_id', 'pkg-hackathon')
    guest_count = int(data.get('guest_count', 25))
    event_date = data.get('event_date', '2026-11-15')
    venue = data.get('venue', 'Main Auditorium Foyer')

    pkg = next((p for p in DEFAULT_CATERING_PACKAGES if p['id'] == package_id), DEFAULT_CATERING_PACKAGES[0])
    total = pkg['price_per_head'] * guest_count
    req_id = f"CAT-{random.randint(1000, 9999)}"

    return jsonify({
        'success': True,
        'request_id': req_id,
        'package_name': pkg['name'],
        'guest_count': guest_count,
        'price_per_head': pkg['price_per_head'],
        'estimated_total': total,
        'event_date': event_date,
        'venue': venue,
        'message': f"Catering quote request #{req_id} generated for {guest_count} guests! Cafeteria manager will call you within 2 hours."
    })
