"""
Order Lifecycle Blueprint
Directly integrated with cafeteria_schema.sql (orders, order_items, order_status_history).
"""
from flask import Blueprint, jsonify, request
from database import get_db_connection
from services.order_service import OrderService
from services.billing_service import BillingService
from models import OrderModel

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@order_bp.route('', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    items = data.get('items', [])
    pickup_slot = data.get('pickup_slot', '12:15 PM')
    counter = data.get('counter', 'Counter 1 (Fast Food)')
    special_instructions = data.get('special_instructions', '')
    payment_method = data.get('payment_method', 'Campus Meal Card')
    coupon_code = data.get('coupon_code')
    user_id = data.get('user_id')

    if not items:
        return jsonify({'success': False, 'message': 'Cart items cannot be empty'}), 400

    try:
        result = OrderService.create_order(
            user_id=user_id,
            items=items,
            pickup_slot=pickup_slot,
            counter=counter,
            special_instructions=special_instructions,
            payment_method=payment_method,
            coupon_code=coupon_code
        )
        return jsonify({'success': True, 'order': result}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@order_bp.route('', methods=['GET'])
def get_orders():
    user_id = request.args.get('user_id')
    status_filter = request.args.get('status', 'all').lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    if not user_id:
        cursor.execute("SELECT id FROM users WHERE role = 'student' LIMIT 1")
        u = cursor.fetchone()
        user_id = u['id'] if u else 'u1111111-1111-1111-1111-111111111111'

    query = """
    SELECT o.*, ps.start_time, ps.end_time
    FROM orders o
    LEFT JOIN pickup_slots ps ON o.pickup_slot_id = ps.id
    WHERE o.user_id = ?
    """
    params = [user_id]

    if status_filter == 'ongoing':
        query += " AND o.status NOT IN ('collected', 'completed', 'cancelled')"
    elif status_filter == 'completed':
        query += " AND o.status IN ('collected', 'completed')"
    elif status_filter == 'cancelled':
        query += " AND o.status = 'cancelled'"

    query += " ORDER BY o.created_at DESC"
    cursor.execute(query, params)
    raw_orders = cursor.fetchall()

    orders = []
    for r in raw_orders:
        ord_dict = dict(r)
        cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (ord_dict['id'],))
        raw_items = cursor.fetchall()
        items = [{'name': it['item_name'], 'qty': it['quantity'], 'price': it['unit_price']} for it in raw_items]

        # Format timeline
        flow = ['placed', 'accepted', 'preparing', 'ready', 'collected']
        curr_idx = flow.index(ord_dict['status']) if ord_dict['status'] in flow else 0
        timeline = [
            {'title': 'Order Placed & Confirmed', 'time': '11:45 AM', 'done': curr_idx >= 0, 'current': curr_idx == 0},
            {'title': 'Accepted by Counter Chef', 'time': '11:46 AM', 'done': curr_idx >= 1, 'current': curr_idx == 1},
            {'title': 'Cooking in Kitchen', 'time': '11:55 AM', 'done': curr_idx >= 2, 'current': curr_idx == 2},
            {'title': 'Ready at Counter 1', 'time': f"Est. {ord_dict.get('start_time', '12:15 PM')}", 'done': curr_idx >= 3, 'current': curr_idx == 3},
            {'title': 'Collected by Student', 'time': 'Pending', 'done': curr_idx >= 4, 'current': curr_idx == 4}
        ]

        orders.append({
            'id': ord_dict['order_number'],
            'order_id': ord_dict['order_number'],
            'uuid': ord_dict['id'],
            'date': f"Today, {ord_dict.get('start_time', '11:45 AM')}",
            'pickupSlot': f"{ord_dict.get('start_time', '12:15 PM')} - {ord_dict.get('end_time', '12:30 PM')}",
            'counter': 'Counter 1 (Fast Food)',
            'items': items,
            'items_count': sum(i['qty'] for i in items),
            'subtotal': float(ord_dict['subtotal']),
            'gst': float(ord_dict['tax_amount']),
            'total': float(ord_dict['total_amount']),
            'status': ord_dict['status'],
            'qr_token': ord_dict['pickup_qr_token'],
            'pin': '4829',
            'verificationPin': '4829',
            'timeline': timeline
        })

    conn.close()
    return jsonify({'success': True, 'orders': orders})

@order_bp.route('/<order_id_or_number>', methods=['GET'])
def get_single_order(order_id_or_number):
    order = OrderModel.get_by_id(order_id_or_number)
    if not order:
        return jsonify({'success': False, 'message': 'Order not found'}), 404
    return jsonify({'success': True, 'order': order})

@order_bp.route('/<order_id_or_number>/status', methods=['PATCH'])
def update_status(order_id_or_number):
    data = request.get_json() or {}
    new_status = data.get('status')
    if not new_status:
        return jsonify({'success': False, 'message': 'Target status required'}), 400

    try:
        updated = OrderService.update_order_status(order_id_or_number, new_status)
        return jsonify({'success': True, 'order': updated})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@order_bp.route('/calculate-bill', methods=['POST'])
def calculate_bill():
    data = request.get_json() or {}
    items = data.get('items', [])
    coupon_code = data.get('coupon_code')
    tip = float(data.get('tip', 0.0))

    bill = BillingService.calculate_bill(items, coupon_code, tip)
    return jsonify({'success': True, 'bill': bill})
