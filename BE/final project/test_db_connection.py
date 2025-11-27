import os
import pymysql
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

DB_NAME = os.getenv('MYSQL_DATABASE', 'digi_world')
DB_USER = os.getenv('MYSQL_USER', 'root')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
DB_HOST = os.getenv('MYSQL_HOST', '127.0.0.1')
DB_PORT = int(os.getenv('MYSQL_PORT', '3306'))

print(f"Attempting to connect to database '{DB_NAME}' at {DB_HOST}:{DB_PORT} as user '{DB_USER}'...")

try:
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        cursorclass=pymysql.cursors.DictCursor
    )
    print("✅ Connection successful!")
    connection.close()
except pymysql.err.OperationalError as e:
    code, message = e.args
    print(f"❌ Connection failed: {message}")
    if code == 1045:
        print("\nPossible causes:")
        print(f"1. User '{DB_USER}' does not exist.")
        print(f"2. Password for '{DB_USER}' is incorrect.")
        print("\nTo fix this, you may need to run the following SQL commands as root:")
        print(f"CREATE DATABASE IF NOT EXISTS {DB_NAME};")
        print(f"CREATE USER IF NOT EXISTS '{DB_USER}'@'localhost' IDENTIFIED BY '{DB_PASSWORD}';")
        print(f"GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{DB_USER}'@'localhost';")
        print("FLUSH PRIVILEGES;")
    elif code == 1049:
        print(f"\nDatabase '{DB_NAME}' does not exist.")
        print(f"Run: CREATE DATABASE {DB_NAME};")
except Exception as e:
    print(f"❌ An unexpected error occurred: {e}")
