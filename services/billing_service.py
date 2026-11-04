"""
Billing & Invoice Calculation Service
Handles dynamic subtotal, GST (5%), discount validation, and grand total.
"""
from config import Config

VALID_COUPONS = {
    'CAMPUS10': {'type': 'flat', 'value': 10.0, 'min_order': 50.0},
    'STUDENT50': {'type': 'flat', 'value': 50.0, 'min_order': 200.0},
    'WELCOME20': {'type': 'percent', 'value': 0.20, 'max_discount': 40.0, 'min_order': 100.0}
}

class BillingService:
    @staticmethod
    def calculate_bill(items, coupon_code=None, staff_tip=0.0):
        """
        items: list of dicts [{'name': '...', 'price': float, 'quantity': int}]
        """
        subtotal = sum(item['price'] * item['quantity'] for item in items)
        gst = round(subtotal * Config.GST_RATE, 2)
        packaging = 0.0  # Campus packing is FREE

        discount = 0.0
        applied_coupon = None

        if coupon_code:
            code = coupon_code.strip().upper()
            if code in VALID_COUPONS:
                rule = VALID_COUPONS[code]
                if subtotal >= rule['min_order']:
                    if rule['type'] == 'flat':
                        discount = rule['value']
                    elif rule['type'] == 'percent':
                        discount = min(rule['max_discount'], subtotal * rule['value'])
                    applied_coupon = code

        total = max(0.0, round(subtotal + gst + packaging + staff_tip - discount, 2))

        return {
            'subtotal': round(subtotal, 2),
            'gst': gst,
            'gst_rate': f"{int(Config.GST_RATE * 100)}%",
            'packaging': packaging,
            'discount': round(discount, 2),
            'applied_coupon': applied_coupon,
            'staff_tip': round(staff_tip, 2),
            'total': total
        }
