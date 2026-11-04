"""
Smart Cafeteria Web Platform - Python Flask Backend Application
Serves the REST API and the Frontend Single Page Application.
"""
import os
import sys
from flask import Flask, jsonify, send_from_directory, request

# Try importing flask_cors, or implement fallback header handling
try:
    from flask_cors import CORS
    HAS_CORS = True
except ImportError:
    HAS_CORS = False

from config import Config
from database import init_db

# Import Blueprints
from routes.menu_routes import menu_bp
from routes.order_routes import order_bp
from routes.wallet_routes import wallet_bp
from routes.mealplan_routes import mealplan_bp
from routes.nutrition_routes import nutrition_bp
from routes.crowd_routes import crowd_bp
from routes.catering_routes import catering_bp
from routes.review_routes import review_bp
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp

def create_app():
    app = Flask(__name__, static_folder='.', static_url_path='')
    app.config.from_object(Config)

    # Initialize Database & seed data
    init_db()

    # Enable CORS
    if HAS_CORS:
        CORS(app, resources={r"/api/*": {"origins": "*"}})
    else:
        @app.after_request
        def add_cors_headers(response):
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            return response

    # Register Blueprints
    app.register_blueprint(menu_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(wallet_bp)
    app.register_blueprint(mealplan_bp)
    app.register_blueprint(nutrition_bp)
    app.register_blueprint(crowd_bp)
    app.register_blueprint(catering_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)

    # 1. Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'platform': 'Smart Cafeteria Pre-Order System',
            'version': '2.0.0',
            'database': 'SQLite 3 (Persistent)',
            'cors_enabled': HAS_CORS
        })

    # 2. Frontend SPA Routes
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        # If API route not found, return 404 JSON
        if path.startswith('api/'):
            return jsonify({'success': False, 'message': f'API endpoint not found: /{path}'}), 404

        # Serve static assets or fallback to index.html
        if path != "" and os.path.exists(os.path.join(Config.BASE_DIR, path)):
            return send_from_directory(Config.BASE_DIR, path)
        return send_from_directory(Config.BASE_DIR, 'index.html')

    # Global error handlers
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith('/api/'):
            return jsonify({'success': False, 'error': 'Endpoint Not Found', 'path': request.path}), 404
        return send_from_directory(Config.BASE_DIR, 'index.html')

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'success': False, 'error': 'Internal Server Error', 'details': str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    print("===================================================================")
    print(" 🍔 SMART CAFETERIA PYTHON FLASK BACKEND RUNNING")
    print(f" • Local URL:    http://127.0.0.1:{Config.PORT}")
    print(f" • REST API:     http://127.0.0.1:{Config.PORT}/api/health")
    print(f" • Database:     {Config.DATABASE_PATH}")
    print("===================================================================")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
