"""
Smart Cafeteria Backend Configuration
"""
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'smart-cafeteria-secret-key-2026')
    DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(BASE_DIR, 'cafeteria.db'))
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() in ['true', '1', 'yes']
    HOST = os.environ.get('FLASK_HOST', '0.0.0.0')
    PORT = int(os.environ.get('FLASK_PORT', 5000))
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*')
    GST_RATE = 0.05  # 5% GST
