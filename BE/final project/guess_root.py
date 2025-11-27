import pymysql

common_passwords = [
    'root',
    '123456',
    '12345678',
    'password',
    'admin',
    'mysql',
    '1234'
]

print("Attempting to guess root password...")

found_password = None

for pwd in common_passwords:
    try:
        print(f"Trying: '{pwd}' ...", end=" ")
        connection = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password=pwd,
            port=3306
        )
        print("✅ SUCCESS!")
        found_password = pwd
        connection.close()
        break
    except pymysql.err.OperationalError:
        print("❌ Failed")

if found_password is not None:
    print(f"\n🎉 FOUND ROOT PASSWORD: '{found_password}'")
    print("Please run 'python setup_db.py' and enter this password.")
else:
    print("\n❌ Could not guess the password. You will need to remember what you set during installation.")
