# Tutorial Deploy dengan Docker (Bahasa Indonesia)

Dokumen ini menjelaskan cara menjalankan aplikasi **Petualangan Informatika** menggunakan Docker dan Docker Compose. Aplikasi terdiri dari:

- Backend: Django + REST API (port 8000)
- Frontend: React + Vite build (port 8080)
- Database: MySQL 8

## 1. Prasyarat

- Docker Engine sudah terpasang di server (Linux) atau Docker Desktop (Windows/Mac).
- Docker Compose v2 tersedia (`docker compose` bisa dijalankan).
- Port yang akan dipakai tidak diblok firewall:
  - 8000 (backend)
  - 8080 (frontend)
  - 3306 (MySQL – opsional jika hanya akses dari dalam server).

## 2. Struktur File Docker

Di dalam repo ini sudah ada beberapa file penting:

- `BE/final project/Dockerfile`  
  Image untuk backend Django. Yang dilakukan:
  - Install dependensi dari `requirements.txt` (Django, DRF, dll).
  - Copy source backend ke `/app` di dalam container.
  - Saat container start, menjalankan:
    - `python manage.py migrate` lalu
    - `python manage.py runserver 0.0.0.0:8000`.

- `FE/finalProject/Dockerfile`  
  Image untuk frontend React/Vite. Dua tahap:
  - Stage build: `npm install` lalu `npm run build` → output ke `dist/`.
  - Stage runtime: install `serve`, copy `dist/`, dan menjalankan `serve -s dist -l 8080`.

- `docker-compose.yml`  
  File orkestrasi yang mendefinisikan 3 service:
  - `mysql` – MySQL 8 sebagai database utama.
  - `backend` – Django API, menghubungkan ke service `mysql`.
  - `frontend` – aplikasi React yang sudah dibuild.

## 3. Konfigurasi Environment

### 3.1 Backend (.env)

File: `BE/final project/.env` (sudah ada di repo, sesuaikan jika perlu):

```env
DJANGO_SECRET_KEY=django-insecure-qxxgffbqo3rwih*%tqs%-3=e&fyu)8yqb8ojwb5xvv4vk4r=^&
MYSQL_DATABASE=digi_world
MYSQL_USER=digi_user
MYSQL_PASSWORD=aloganteng
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
```

Saat berjalan di Docker Compose, `MYSQL_HOST` dan `MYSQL_PORT` akan dioverride menjadi:

- `MYSQL_HOST=mysql`
- `MYSQL_PORT=3306`

Jadi kamu **tidak perlu** mengubah nilai ini khusus untuk Docker, cukup pastikan `MYSQL_DATABASE`, `MYSQL_USER`, dan `MYSQL_PASSWORD` sesuai dengan yang kamu inginkan.

### 3.2 Frontend (.env)

File: `FE/finalProject/.env` (buat jika belum ada):

```env
VITE_API_BASE_URL=http://localhost:8000
```

Untuk deploy di server publik, ganti `localhost` dengan IP atau domain server, misalnya:

```env
VITE_API_BASE_URL=http://123.45.67.89:8000
```

Setiap kali mengubah nilai ini, image frontend perlu di‑build ulang (`docker compose up --build`).

## 4. Menjalankan dengan Docker Compose

Semua perintah berikut dijalankan dari folder root repo (`TA/`).

### 4.1 Build dan Start

```bash
docker compose up --build -d
```

Perintah ini akan:

- Membangun image backend dari `BE/final project/Dockerfile`.
- Membangun image frontend dari `FE/finalProject/Dockerfile`.
- Menjalankan tiga container:
  - `digi_mysql` (MySQL 8)
  - `digi_backend` (Django di port 8000)
  - `digi_frontend` (React build di port 8080)

### 4.2 Mengecek Status Container

```bash
docker compose ps
```

### 4.3 Melihat Log

- Semua service:

```bash
docker compose logs -f
```

- Hanya backend (Django):

```bash
docker compose logs -f backend
```

- Hanya frontend:

```bash
docker compose logs -f frontend
```

- Hanya MySQL:

```bash
docker compose logs -f mysql
```

### 4.4 Menghentikan Container

```bash
docker compose down
```

Perintah ini **tidak** menghapus data database maupun file upload, karena sudah disimpan di volume.

## 5. Data Persisten (Database & Media)

Dalam `docker-compose.yml`:

- Service `mysql` memakai volume bernama `mysql_data` yang dipetakan ke `/var/lib/mysql`. Di sinilah seluruh data MySQL disimpan.
- Service `backend` me‑mount direktori `BE/final project/media` dari host ke `/app/media` di container. Semua avatar/foto/upload akan muncul di folder ini di server.

Artinya:

- `docker compose down` aman untuk dilakukan — data tidak hilang.
- Untuk benar‑benar mengosongkan database, kamu harus menghapus volume `mysql_data` secara manual, misalnya:

```bash
docker compose down
docker volume rm ta_mysql_data   # nama volume bisa sedikit berbeda, cek dengan `docker volume ls`
```

## 6. Mengakses Aplikasi

Setelah `docker compose up -d` sukses:

- Frontend: buka `http://SERVER_IP:8080` di browser.
- Backend API cepat untuk tes: `http://SERVER_IP:8000/api/hello/`.

Jika kamu menjalankan di komputer lokal, ganti `SERVER_IP` dengan `localhost`.

## 7. Start dengan Satu Perintah (`start.sh`)

Untuk mempermudah, di root repo ada skrip `start.sh` yang menjalankan:

```bash
./start.sh
```

Skrip ini akan:

- Menjalankan `docker compose up --build -d`.
- Mengangkat ketiga container (`mysql`, `backend`, `frontend`).
- Backend di dalam container listen pada `0.0.0.0:8000`, yang dipetakan ke host sehingga bisa diakses melalui `127.0.0.1:8000` atau IP server.
- Frontend listen pada `0.0.0.0:8080`, dipetakan ke `127.0.0.1:8080` di host.

Untuk menghentikan layanan, gunakan:

```bash
docker compose down
```

## 8. Tips Deployment Produksi

Beberapa langkah lanjutan yang disarankan untuk server produksi:

- Pasang reverse proxy (misalnya nginx) di depan container:
  - Mengarahkan domain (misalnya `petualangan.example.com`) ke frontend di port 8080.
  - Mengatur HTTPS (Let's Encrypt).
  - Meneruskan request ke backend `/api/` ke port 8000.
- Ganti `DEBUG=True` ke `DEBUG=False` di `settings.py` dan atur `ALLOWED_HOSTS` sesuai domain/server.
- Pertimbangkan mengganti `runserver` menjadi `gunicorn` + `nginx` jika beban pengguna semakin besar.

  Untuk awal, konfigurasi Docker Compose di repo ini sudah cukup untuk demo dan deploy di server kecil yang diakses oleh satu sekolah/kampus.

## 9. CI/CD Otomatis dengan GitHub Actions

Repo ini sudah dilengkapi dengan workflow GitHub Actions di `.github/workflows/docker-publish.yml`.
Setiap kali ada push ke branch `master` atau `main`, GitHub akan otomatis:

1.  Membangun image backend dan frontend.
2.  Push image ke Docker Hub dengan tag `:latest`.

### Konfigurasi Secrets

Agar workflow berjalan, kamu WAJIB menambahkan secrets di repository GitHub (Settings > Secrets and variables > Actions):

- `DOCKERHUB_USERNAME`: Username Docker Hub kamu.
- `DOCKERHUB_TOKEN`: Access Token Docker Hub (bukan password).

Setelah image baru ter-push, di server produksi cukup jalankan:

```bash
docker compose pull
docker compose up -d
```

## 10. Manual Build & Push (CLI)

Jika kamu ingin melakukan build dan push secara manual (tanpa GitHub Actions/CI), ikuti langkah berikut:

### 1. Login ke Docker Hub
```bash
docker login -u carlomuzaqi
# Masukkan password/token saat diminta
```

### 2. Build Image

**Backend** (Jalankan dari root folder `TA`):
Penting: Jangan lupa tanda titik `.` di akhir perintah sebagai build context.
```bash
docker build -f "BE/final project/Dockerfile" -t carlomuzaqi/ta-backend:latest .
docker build -t carlomuzaqi/ta-frontend:latest FE/finalProject
```

**Frontend**:
```bash
docker build -t carlomuzaqi/ta-frontend:latest FE/finalProject
```

### 3. Push Image
```bash
docker push carlomuzaqi/ta-backend:latest
docker push carlomuzaqi/ta-frontend:latest
```
