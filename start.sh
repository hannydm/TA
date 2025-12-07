#!/usr/bin/env bash

# Simple helper script to build and start the whole stack with one command.
# Jalankan dari root project: ./start.sh

set -e

echo "==> Pulling latest Docker images (backend, frontend)..."
docker compose pull

echo "==> Starting Docker containers (backend, frontend, mysql)..."
docker compose up -d

echo ""
echo "==> Semua container sudah dijalankan."
echo "Backend (Django API)  : http://127.0.0.1:8000  (dalam container listen di 0.0.0.0:8000)"
echo "Frontend (React app)  : http://127.0.0.1:8080  (dalam container listen di 0.0.0.0:8080)"
echo ""
echo "Gunakan 'docker compose logs -f' untuk melihat log, dan 'docker compose down' untuk menghentikan."
