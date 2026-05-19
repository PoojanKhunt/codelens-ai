import sqlite3
from pathlib import Path

# SQLite database file
DB_PATH = Path("codelens.db")


def get_db_connection():
    """
    Return a SQLite connection with dictionary-style row access.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn