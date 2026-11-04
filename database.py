"""
Database Module for Smart Cafeteria System
Wraps connection management and schema builder.
"""
import sqlite3
from config import Config
from init_database import build_database, get_connection

def get_db_connection():
    return get_connection()

def init_db():
    build_database()
