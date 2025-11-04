import sqlite3

DATABASE = "jj.vv.sqlite"

def get_connection():
    conn = sqlite3.connect(DATABASE)
    return conn
