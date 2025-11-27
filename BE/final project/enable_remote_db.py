import pymysql

def enable_remote_access():
    print("Enabling remote access for 'digi_user'...")
    
    # Root password is now known to be 'aloganteng' (from previous reset)
    # OR user might have set it to something else. 
    # We will try 'aloganteng' first as per our previous "Reset" instructions.
    
    root_password = 'aloganteng' 
    
    try:
        connection = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password=root_password,
            port=3306,
            cursorclass=pymysql.cursors.DictCursor
        )
        print("✅ Connected to MySQL as root.")
        
        with connection.cursor() as cursor:
            # Create User for ANY host (%)
            print("Creating user 'digi_user'@'%'...")
            cursor.execute("CREATE USER IF NOT EXISTS 'digi_user'@'%' IDENTIFIED BY 'aloganteng';")
            
            # Grant Privileges
            print("Granting privileges...")
            cursor.execute("GRANT ALL PRIVILEGES ON digi_world.* TO 'digi_user'@'%';")
            cursor.execute("FLUSH PRIVILEGES;")
            
        connection.commit()
        print("\n✅ Remote access enabled for 'digi_user'!")
        
    except pymysql.err.OperationalError as e:
        print(f"\n❌ Connection failed: {e}")
        print("If the password is wrong, please edit this script with the correct root password.")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()

if __name__ == "__main__":
    enable_remote_access()
