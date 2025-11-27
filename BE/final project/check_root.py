import pymysql

print("Checking if root has empty password...")
try:
    connection = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        port=3306
    )
    print("✅ Success! Root has NO password.")
    connection.close()
except pymysql.err.OperationalError as e:
    print(f"❌ Failed with empty password: {e}")
