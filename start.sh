#!/usr/bin/env bash

# Simple helper script to build and start the whole stack with one command.
# Jalankan dari root project: ./start.sh

set -e


# Hapus container lama & network yang stuck
echo "==> Cleaning up old containers and networks..."
docker compose down --remove-orphans || true
docker network prune -f || true

echo "==> Pulling latest Docker images (backend, frontend)..."
# Gunakan flag "|| true" agar script tidak berhenti jika pull gagal (misal masalah koneksi internet)
docker compose pull || true

echo "==> Starting Docker containers (backend, frontend, mysql)..."
# PENTING: Gunakan --no-build agar Docker menggunakan image yang baru saja di-pull dari Docker Hub.
# Jika menggunakan --build, Docker akan membuat ulang image dari source code LAMA yang ada di folder ini (VPS),
# sehingga perbaikan Anda tidak akan terlihat.
docker compose up -d --no-build

echo ""
echo "==> Semua container sudah dijalankan."
echo "Backend (Django API)  : http://127.0.0.1:8000  (dalam container listen di 0.0.0.0:8000)"
echo "Frontend (React app)  : http://127.0.0.1:8080  (dalam container listen di 0.0.0.0:8080)"
echo ""
echo "Gunakan 'docker compose logs -f' untuk melihat log, dan 'docker compose down' untuk menghentikan."
