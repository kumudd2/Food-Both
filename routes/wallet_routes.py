"""
Campus Digital Wallet Blueprint
Directly integrated with cafeteria_schema.sql (wallets, wallet_transactions, users, student_profiles).
"""
import uuid
import secrets
from flask import Blueprint, jsonify, request
from database import get_db_connection

wallet_bp = Blueprint('wallet', __name__, url_prefix='/api/wallet')

@wallet_bp.route('', methods=['GET'])
def get_wallet():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    cursor = conn.cursor()

    if not user_id:
        cursor.execute("SELECT id FROM users WHERE role = 'student' LIMIT 1")
        u = cursor.fetchone()
        user_id = u['id'] if u else 'u1111111-1111-1111-1111-111111111111'

    cursor.execute("""
    SELECT u.id, u.full_name, sp.roll_number, w.balance, w.reward_points
    FROM users u
    LEFT JOIN student_profiles sp ON u.id = sp.user_id
    LEFT JOIN wallets w ON u.id = w.user_id
    WHERE u.id = ?
    """, (user_id,))
    row = cursor.fetchone()

    cursor.execute("""
    SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    """, (user_id,))
    raw_txns = cursor.fetchall()
    conn.close()

    if not row:
        return jsonify({'success': False, 'message': 'Wallet not found'}), 404

    txns = []
    for t in raw_txns:
        txns.append({
            'id': t['id'],
            'type': t['txn_type'],
            'amount': abs(float(t['amount'])),
            'isCredit': float(t['amount']) > 0,
            'title': t['reference'] or ('Wallet Recharge' if float(t['amount']) > 0 else 'Cafeteria Order'),
            'date': t['created_at'],
            'points_delta': t['points_delta']
        })

    return jsonify({
        'success': True,
        'wallet': {
            'student_id': row['roll_number'] or 'STU-2024-8842',
            'cardholder': row['full_name'],
            'balance': float(row['balance'] or 0.0),
            'reward_points': int(row['reward_points'] or 0),
            'status': 'ACTIVE',
            'transactions': txns
        }
    })

@wallet_bp.route('/recharge', methods=['POST'])
def recharge_wallet():
    data = request.get_json() or {}
    user_id = data.get('user_id')
    amount = float(data.get('amount', 0.0))
    mode = data.get('mode', 'UPI Gateway (GPay)')

    if amount <= 0:
        return jsonify({'success': False, 'message': 'Amount must be greater than zero'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    if not user_id:
        cursor.execute("SELECT id FROM users WHERE role = 'student' LIMIT 1")
        u = cursor.fetchone()
        user_id = u['id'] if u else 'u1111111-1111-1111-1111-111111111111'

    # Update wallet balance and earn 10% bonus points on recharge
    bonus_points = int(amount * 0.10)
    cursor.execute("""
    UPDATE wallets SET balance = balance + ?, reward_points = reward_points + ? WHERE user_id = ?
    """, (amount, bonus_points, user_id))

    cursor.execute("SELECT balance, reward_points FROM wallets WHERE user_id = ?", (user_id,))
    w = cursor.fetchone()
    new_bal = float(w['balance'])

    # Record wallet transaction
    txn_id = f"wtx-{secrets.token_hex(4)}"
    cursor.execute("""
    INSERT INTO wallet_transactions (id, user_id, txn_type, amount, points_delta, balance_after, reference)
    VALUES (?, ?, 'topup', ?, ?, ?, ?)
    """, (txn_id, user_id, amount, bonus_points, new_bal, f"Instant Topup via {mode}"))

    conn.commit()
    conn.close()

    return jsonify({
        'success': True,
        'new_balance': new_bal,
        'reward_points': w['reward_points'],
        'transaction_id': txn_id,
        'message': f"Successfully recharged ₹{amount:.2f}"
    })
