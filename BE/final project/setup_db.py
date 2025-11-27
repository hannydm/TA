import pymysql
import getpass

def setup_database():
    print("This script will set up the 'digi_world' database and 'digi_user'.")
    print("You need to provide the MySQL 'root' password.")
    print("If you don't have a root password set, just press Enter.")
    
    root_password = getpass.getpass("Enter MySQL root password: ")
    
    try:
        # Connect as root
        connection = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password=root_password,
            port=3306,
            cursorclass=pymysql.cursors.DictCursor
        )
        print("✅ Connected to MySQL as root.")
        
        with connection.cursor() as cursor:
            # Create Database
            print("Creating database 'digi_world'...")
            cursor.execute("CREATE DATABASE IF NOT EXISTS digi_world;")
            
            # Create User
            print("Creating user 'digi_user'...")
            # Check if user exists to avoid error on some versions or just use IF NOT EXISTS if supported (MySQL 5.7+)
            cursor.execute("CREATE USER IF NOT EXISTS 'digi_user'@'localhost' IDENTIFIED BY 'aloganteng';")
            
            # Grant Privileges
            print("Granting privileges...")
            cursor.execute("GRANT ALL PRIVILEGES ON digi_world.* TO 'digi_user'@'localhost';")
            cursor.execute("FLUSH PRIVILEGES;")
            
        connection.commit()
        print("\n✅ Database and user configured successfully!")
        print("User: digi_user")
        print("Password: aloganteng")
        print("Database: digi_world")
        print("\nYou can now run 'python manage.py runserver'.")
        
    except pymysql.err.OperationalError as e:
        code, message = e.args
        print(f"\n❌ Connection failed: {message}")
        if code == 1045:
            print("Access denied. Please check your root password.")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()

if __name__ == "__main__":
    setup_database()
