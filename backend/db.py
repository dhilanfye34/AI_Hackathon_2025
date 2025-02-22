import sqlite3

DB_PATH = "gamified.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Existing 'users' table
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            points INTEGER DEFAULT 0
        );
    """)

    # New 'photos' table to track file hashes
    c.execute("""
        CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_hash TEXT UNIQUE,
            username TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    conn.close()

def photo_hash_exists(file_hash):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT 1 FROM photos WHERE file_hash=?;", (file_hash,))
    row = c.fetchone()
    conn.close()
    return row is not None

def add_photo_hash(file_hash, username):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO photos (file_hash, username) VALUES (?, ?);", (file_hash, username))
    conn.commit()
    conn.close()

def get_user(username):
    """
    Returns a tuple (id, username, points) or None if user not found.
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, username, points FROM users WHERE username=?;", (username,))
    row = c.fetchone()
    conn.close()
    return row

def create_user(username):
    """
    Creates a new user with 0 points, returns the newly created user id.
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO users (username, points) VALUES (?, 0);", (username,))
    conn.commit()
    user_id = c.lastrowid
    conn.close()
    return user_id

def add_points(username, amount):
    """
    Increments a user's points by 'amount'.
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE users SET points = points + ? WHERE username=?;", (amount, username))
    conn.commit()
    conn.close()

def get_leaderboard(limit=10):
    """
    Returns top 'limit' users, sorted by points (descending),
    as a list of (username, points).
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT username, points FROM users ORDER BY points DESC LIMIT ?;", (limit,))
    rows = c.fetchall()
    conn.close()
    return rows
