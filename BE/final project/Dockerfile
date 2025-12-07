FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install backend dependencies
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copy Django project into container
COPY ["BE/final project/", "/app"]

EXPOSE 8000

# Jalankan migrasi lalu start server pengembangan.
# Untuk produksi serius, sebaiknya ganti ke gunicorn/uvicorn + reverse proxy.
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
