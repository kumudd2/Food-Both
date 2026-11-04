"""
Automated Test Suite for Smart Cafeteria Flask Backend
Verifies all REST API endpoints, business logic, billing, and database models.
"""
import unittest
import json
import os

from app import create_app
from services.billing_service import BillingService

class CafeteriaBackendTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_01_health_check(self):
        """Test API Health endpoint"""
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('Smart Cafeteria', data['platform'])

    def test_02_categories_endpoint(self):
        """Test fetching categories"""
        res = self.client.get('/api/categories')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['categories']), 5)

    def test_03_menu_items(self):
        """Test menu items catalog with prices"""
        res = self.client.get('/api/menu')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['count'], 12)

        # Check Veg Burger price is 65
        burger = next((i for i in data['items'] if 'Veg Burger' in i['name']), None)
        self.assertIsNotNone(burger)
        self.assertEqual(burger['name'], 'Veg Burger')
        self.assertEqual(burger['price'], 65.0)

    def test_04_menu_filtering_and_search(self):
        """Test menu category filter and search"""
        # Search for burger
        res = self.client.get('/api/menu?search=burger')
        data = json.loads(res.data)
        self.assertGreaterEqual(len(data['items']), 1)
        self.assertEqual(data['items'][0]['name'], 'Veg Burger')

        # Filter snacks
        res_snacks = self.client.get('/api/menu?category=snacks')
        data_snacks = json.loads(res_snacks.data)
        self.assertGreaterEqual(len(data_snacks['items']), 2)

    def test_05_billing_calculation(self):
        """Test dynamic subtotal, 5% GST, and discount rules"""
        items = [
            {'name': 'Veg Burger', 'price': 65.0, 'quantity': 1},
            {'name': 'Cold Coffee with Ice Cream', 'price': 60.0, 'quantity': 1},
            {'name': 'French Fries', 'price': 70.0, 'quantity': 1}
        ]
        bill = BillingService.calculate_bill(items)
        self.assertEqual(bill['subtotal'], 195.0)
        self.assertEqual(bill['gst'], 9.75)
        self.assertEqual(bill['total'], 204.75)

        # With CAMPUS10 coupon
        bill_discount = BillingService.calculate_bill(items, coupon_code='CAMPUS10')
        self.assertEqual(bill_discount['discount'], 10.0)
        self.assertEqual(bill_discount['total'], 194.75)

    def test_06_create_pre_order(self):
        """Test creating a pre-order with items and pickup slot"""
        payload = {
            'pickup_slot': '12:30 PM',
            'counter': 'Counter 1 (Fast Food)',
            'special_instructions': 'Extra crisp fries',
            'payment_method': 'Campus Meal Card',
            'items': [
                {'item_id': 'Veg Burger', 'quantity': 2},
                {'item_id': 'Cold Coffee with Ice Cream', 'quantity': 1}
            ]
        }
        res = self.client.post('/api/orders', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertIn('ORD-', data['order']['order_id'])
        self.assertEqual(len(data['order']['pin']), 4)

    def test_07_advance_order_status(self):
        """Test advancing order status (placed -> accepted -> preparing)"""
        res = self.client.patch('/api/orders/ORD-10045/status', data=json.dumps({'status': 'ready'}), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['order']['status'], 'ready')

    def test_08_wallet_details_and_recharge(self):
        """Test fetching wallet balance and recharging via UPI"""
        res_get = self.client.get('/api/wallet')
        self.assertEqual(res_get.status_code, 200)
        data = json.loads(res_get.data)
        self.assertTrue(data['success'])
        old_balance = data['wallet']['balance']

        # Recharge ₹200
        recharge_payload = {'amount': 200.0, 'mode': 'UPI GPay'}
        res_recharge = self.client.post('/api/wallet/recharge', data=json.dumps(recharge_payload), content_type='application/json')
        self.assertEqual(res_recharge.status_code, 200)
        data_recharge = json.loads(res_recharge.data)
        self.assertTrue(data_recharge['success'])
        self.assertEqual(data_recharge['new_balance'], old_balance + 200.0)

    def test_09_auth_login(self):
        """Test student login and profile retrieval"""
        login_payload = {'email': 'kumud.negi@college.edu', 'password': 'password123'}
        res = self.client.post('/api/auth/login', data=json.dumps(login_payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['user']['name'], 'Kumud Negi')
        self.assertEqual(data['user']['studentId'], 'STU-2024-8842')

    def test_10_admin_kds_stats(self):
        """Test Kitchen Display System stats & analytical views"""
        res = self.client.get('/api/admin/stats')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertIn('today_orders', data['stats'])
        self.assertIn('today_revenue', data['stats'])

if __name__ == '__main__':
    unittest.main()
