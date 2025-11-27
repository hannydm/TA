import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digi_world.settings')
django.setup()

from django.contrib.auth.models import User

def create_superuser():
    username = 'admin'
    email = 'admin@example.com'
    password = 'admin'

    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists.")
    else:
        print(f"Creating superuser '{username}'...")
        User.objects.create_superuser(username, email, password)
        print(f"✅ Superuser created successfully!")
        print(f"Username: {username}")
        print(f"Password: {password}")
        print(f"Email:    {email}")

if __name__ == '__main__':
    create_superuser()
