# Database Content: Normalized Tables Analysis

This document presents the actual content of the `digi_world` database, extracted from the VPS dump. The data is organized by functional groups to demonstrate the **3rd Normal Form (3NF)** structure.

## User Management (Authentication & Profile)

### Table: `auth_user`
**Rows**: 39 | **Columns**: 11

| id | password | last_login | is_superuser | username | first_name | last_name | email | is_staff | is_active | date_joined |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | pbkdf2_sha256$1000000$ApoGtGXBzcbVVuroS0p1kK$vK... | _(NULL)_ | 0 | AloDeAlfonsoo |  |  | testinggmail@gmail.com | 0 | 1 | 2025-12-03 16:25:50.881393 |
| 2 | pbkdf2_sha256$1000000$XerkVajgTiJI0Hjw3srEY4$xg... | 2026-01-11 13:09:10.762150 | 1 | Hanny |  |  | destianmarzuliyanti@gmail.com | 1 | 1 | 2025-12-03 17:12:17.739749 |
| 3 | pbkdf2_sha256$1000000$FdeMqhlhl7P0l0H1EncSEb$7b... | _(NULL)_ | 0 | testing |  |  | hanndmz@gmail.com | 0 | 1 | 2025-12-03 19:11:07.552405 |
| 4 | pbkdf2_sha256$1000000$yjEtOjWKzWz8EocQxby1DT$nj... | _(NULL)_ | 0 | Hanny21 |  |  | 3337220057@untirta.ac.id | 0 | 1 | 2025-12-09 17:03:39.015981 |
| 5 | pbkdf2_sha256$1000000$0IGBUpfvDoqUEzqstoz4rR$0B... | _(NULL)_ | 0 | user_testing |  |  | hanndmz@gmail.com | 0 | 1 | 2025-12-12 02:39:08.460372 |
| 7 | pbkdf2_sha256$1000000$FAM0ysp6FXJNaKzngZ9yOm$T2... | _(NULL)_ | 0 | Fathan |  |  | fathankomar28@gmail.com | 0 | 1 | 2025-12-15 03:29:50.957139 |
| 8 | pbkdf2_sha256$1000000$X3WZ9kq4zzns42WA9qlGxh$B5... | _(NULL)_ | 0 | Zh4fir4 |  |  | zhafiratsalisaalviena@gmail.com | 0 | 1 | 2025-12-15 03:30:03.899729 |
| 9 | pbkdf2_sha256$1000000$e0vQW7YPMJmAWShmIIi3uf$MD... | _(NULL)_ | 0 | Rivald00 |  |  | namzgaming443@gmail.com | 0 | 1 | 2025-12-15 03:32:00.000000 |
| 10 | pbkdf2_sha256$1000000$R1SPWQNpWyubFxCwUWFzDW$M/... | _(NULL)_ | 0 | soni22 |  |  | yogihrdiynsyhh@gmail.com | 0 | 1 | 2025-12-15 03:32:14.727627 |
| 11 | pbkdf2_sha256$1000000$wm5DHmgg7BeFLcLzQC1Vdr$oH... | _(NULL)_ | 0 | Epankausep23 |  |  | eevanhermawanto@gmail.com | 0 | 1 | 2025-12-15 03:32:17.148203 |
| 12 | pbkdf2_sha256$1000000$jDVr8X6QoXF0mlsgdbXryJ$7S... | _(NULL)_ | 0 | lutfi |  |  | liliserem88@gmail.com | 0 | 1 | 2025-12-15 03:32:51.765847 |
| 13 | pbkdf2_sha256$1000000$DBdLvqnktQcEx9w3qEiio7$8I... | _(NULL)_ | 0 | Ratna_puspitasari |  |  | sr0481024@gmail.com | 0 | 1 | 2025-12-15 03:34:17.000000 |
| 14 | pbkdf2_sha256$1000000$ZH6pMxAhD3nISjyqMx9yLP$/k... | _(NULL)_ | 0 | Syafa_Ayu_Fitriana |  |  | syafaayufitriana@gmail.com | 0 | 1 | 2025-12-15 03:34:31.875877 |
| 15 | pbkdf2_sha256$1000000$ck6qbAM0nr5YNDVsTXZUQA$1V... | _(NULL)_ | 0 | Rahmawati |  |  | sr0481024@gmail.com | 0 | 1 | 2025-12-15 03:34:39.096509 |
| 16 | pbkdf2_sha256$1000000$ZnkuyISEMkScaVIqhLkfTZ$+K... | _(NULL)_ | 0 | aldojumhana |  |  | muhammadutomo770@gmail.com | 0 | 1 | 2025-12-15 03:34:48.096135 |
| 17 | pbkdf2_sha256$1000000$ABGLnEZdMxoj7yYkL2A7q8$10... | _(NULL)_ | 0 | Rahmaliya03 |  |  | sr0481024@gmail.com | 0 | 1 | 2025-12-15 03:34:55.000000 |
| 18 | pbkdf2_sha256$1000000$fuIRstr5NWN4DD4kCzJkAw$Cc... | _(NULL)_ | 0 | intan_nuraeni_15 |  |  | intannuraeni201209@gmail.com | 0 | 1 | 2025-12-15 03:35:08.314401 |
| 19 | pbkdf2_sha256$1000000$Ij3hI73pVVrnZorCokEB9D$X/... | _(NULL)_ | 0 | Nazwa_F4tmaliiaa |  |  | nazwatuljannah01@gmail.com | 0 | 1 | 2025-12-15 03:35:54.000000 |
| 20 | pbkdf2_sha256$1000000$OwACBok34j6n8kL3kMtV3Z$nj... | _(NULL)_ | 0 | restaan |  |  | sr0481024@gmail.com | 0 | 1 | 2025-12-15 03:36:03.000000 |
| 21 | pbkdf2_sha256$1000000$TpmVWIBG5EwnaxRakbDGiu$qh... | _(NULL)_ | 0 | Raden_Saepulloh |  |  | rifkicute09@gmail.com | 0 | 1 | 2025-12-15 03:36:14.000000 |
| 22 | pbkdf2_sha256$1000000$ycTTUpf3LhHH16wmOXii7G$ca... | _(NULL)_ | 0 | ChikaMaharani |  |  | chikamaharani101@gmail.com | 0 | 1 | 2025-12-15 03:36:18.285519 |
| 23 | pbkdf2_sha256$1000000$J89Us2kleoFVZ8X9the5uv$lA... | _(NULL)_ | 0 | Nazwatul_Janah |  |  | nazwatuljannah01@gmail.com | 0 | 1 | 2025-12-15 03:36:19.325006 |
| 24 | pbkdf2_sha256$1000000$VXScy0CKradJNG1RaRAJZ4$tX... | _(NULL)_ | 0 | Tinta_permatasari |  |  | tintapermatasari00@gmail.com | 0 | 1 | 2025-12-15 03:36:23.928157 |
| 25 | pbkdf2_sha256$1000000$EqoHDvnoTnpB2aw4aMWE8a$Z9... | _(NULL)_ | 0 | Andini |  |  | diniajah4121@gmail.com | 0 | 1 | 2025-12-15 03:36:32.003750 |
| 26 | pbkdf2_sha256$1000000$OvNU5VSWoKaO38SoWDZuFB$/P... | _(NULL)_ | 0 | sitinurholifah |  |  | ocolcepele@gmail.com | 0 | 1 | 2025-12-15 03:36:36.227201 |
| 27 | pbkdf2_sha256$1000000$NeuSFQecnUxpjVhdkRpbid$vK... | _(NULL)_ | 0 | tasya |  |  | natasyaputry1910@gmail.com | 0 | 1 | 2025-12-15 03:37:13.061052 |
| 28 | pbkdf2_sha256$1000000$YdzPeqWjFV70lsSDMPtPdB$RX... | _(NULL)_ | 0 | sandi01 |  |  | shintarusmawatiputri@gmail.com | 0 | 1 | 2025-12-15 03:37:20.000000 |
| 29 | pbkdf2_sha256$1000000$RUTAoFTwLDby75fhwcTn6n$Bq... | _(NULL)_ | 0 | erdi |  |  | erdhiganteng01@gmail.com | 0 | 1 | 2025-12-15 03:38:06.759512 |
| 30 | pbkdf2_sha256$1000000$IItD1dL7NemY3obeQNFbND$U6... | _(NULL)_ | 0 | salwaamalia |  |  | amaliasalwa956@gmail.com | 0 | 1 | 2025-12-15 03:38:20.720917 |
| 31 | pbkdf2_sha256$1000000$5dKPy5JojvAa8i7iZKj3Xh$5h... | _(NULL)_ | 0 | sitimutiya |  |  | sitimutiya773@gmail.com | 0 | 1 | 2025-12-15 03:38:29.362570 |
| 32 | pbkdf2_sha256$1000000$t2ZEFaAfybw6IXj7VpsLlG$sH... | _(NULL)_ | 0 | sitinurhol1l4h |  |  | ocolcepele@gmail.com | 0 | 1 | 2025-12-15 03:39:11.000000 |
| 33 | pbkdf2_sha256$1000000$zfGVffuB29a36s4bR4WPlX$su... | _(NULL)_ | 0 | BayuNugraha |  |  | nugraha3345598@gmail.com | 0 | 1 | 2025-12-15 03:39:40.962760 |
| 34 | pbkdf2_sha256$1000000$ir0lr4NBGEO93yCnOvU12X$WZ... | _(NULL)_ | 0 | shinta25_ |  |  | shintarusmawatiputri@gmail.com | 0 | 1 | 2025-12-15 03:41:22.211365 |
| 35 | pbkdf2_sha256$1000000$BNKgaWtulBB1LM8wI76yqt$6O... | _(NULL)_ | 0 | Naswa_Ramdhani09 |  |  | nazwatuljannah01@gmail.com | 0 | 1 | 2025-12-15 03:41:55.000000 |
| 36 | pbkdf2_sha256$1000000$cUTRrGRwdc3vCJiXylEjFH$6x... | _(NULL)_ | 0 | RahayuAJ |  |  | sr0481024@gmail.com | 0 | 1 | 2025-12-15 03:45:44.000000 |
| 37 | pbkdf2_sha256$1000000$53jsIfJPEyLPkdHw3omuVK$+Q... | _(NULL)_ | 0 | guru1 | guru | mencoba | twingkerbellkurus@gmail.com | 1 | 1 | 2025-12-21 17:26:49.312809 |
| 38 | pbkdf2_sha256$1000000$2Gh1B1vhIHS6kkdF56HidF$US... | _(NULL)_ | 0 | destian |  |  | hanndmz@gmail.com | 0 | 1 | 2025-12-22 13:41:52.176390 |
| 40 | pbkdf2_sha256$1000000$UdwUlVKSMMZCJNjcYzKd29$X+... | _(NULL)_ | 0 | chk_restr_user | Test | Restriction | chk_restr@test.com | 1 | 1 | 2026-01-07 21:47:54.941861 |
| 41 | pbkdf2_sha256$1000000$20P5AizLL0pn513gFvu2AS$zJ... | _(NULL)_ | 1 | superadmin01 |  |  |  | 1 | 1 | 2026-01-10 22:31:33.899486 |

---

### Table: `api_profilsiswa`
**Rows**: 38 | **Columns**: 7

| id | total_poin | level | avatar | user_id | kelas | nisn |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | 112 | 2 | profile_images/ADDIE.drawio.png | 2 | XB | 1234567 |
| 3 | 89 | 1 | default.jpg | 3 | XA | _(NULL)_ |
| 4 | 40 | 1 | default.jpg | 4 | XA | 3337220057 |
| 5 | 0 | 1 | default.jpg | 5 | XA | _(NULL)_ |
| 7 | 382 | 3 | default.jpg | 7 | XD | 0098693955 |
| 8 | 377 | 3 | default.jpg | 8 | XD | 0101406350 |
| 9 | 381 | 3 | default.jpg | 9 | XD | 00007 |
| 10 | 375 | 3 | default.jpg | 10 | XD | 10277 |
| 11 | 369 | 3 | default.jpg | 11 | XD | 21111 |
| 12 | 388 | 3 | default.jpg | 12 | XD | 0106557824 |
| 13 | 368 | 3 | default.jpg | 13 | XD | 0109104713 |
| 14 | 373 | 3 | default.jpg | 14 | XD | 373737 |
| 15 | 370 | 3 | default.jpg | 15 | XD | 0109104713 |
| 16 | 375 | 3 | default.jpg | 16 | XD | 12345 |
| 17 | 384 | 3 | default.jpg | 17 | XD | 0109104713 |
| 18 | 386 | 3 | default.jpg | 18 | XD | 12121212 |
| 19 | 379 | 3 | default.jpg | 19 | XD | 211111 |
| 20 | 382 | 3 | default.jpg | 20 | XD | 0109104713 |
| 21 | 374 | 3 | default.jpg | 21 | XD | 827262637 |
| 22 | 370 | 3 | default.jpg | 22 | XD | 00011 |
| 23 | 389 | 3 | default.jpg | 23 | XD | 211111 |
| 24 | 379 | 3 | default.jpg | 24 | XD | 00035 |
| 25 | 368 | 3 | default.jpg | 25 | XD | 00006 |
| 26 | 372 | 3 | default.jpg | 26 | XD | 00032 |
| 27 | 390 | 3 | default.jpg | 27 | XD | 00024 |
| 28 | 376 | 3 | default.jpg | 28 | XD | 31111 |
| 29 | 384 | 3 | default.jpg | 29 | XD | 0094032692 |
| 30 | 378 | 3 | default.jpg | 30 | XD | 00031 |
| 31 | 380 | 3 | default.jpg | 31 | XD | 00034 |
| 32 | 383 | 3 | default.jpg | 32 | XD | 00032 |
| 33 | 371 | 3 | default.jpg | 33 | XD | 21467 |
| 34 | 387 | 3 | default.jpg | 34 | XD | 31111 |
| 35 | 381 | 3 | default.jpg | 35 | XD | 211111 |
| 36 | 385 | 3 | default.jpg | 36 | XD | 0109104713 |
| 37 | 21 | 1 | default.jpg | 37 | XD | _(NULL)_ |
| 38 | 30 | 1 | profile_images/Universal_Recycling_Symbol_U2672... | 38 | XA | 3337220057 |
| 40 | 0 | 1 | default.jpg | 40 | _(NULL)_ | _(NULL)_ |
| 41 | 0 | 1 | default.jpg | 41 | XD | _(NULL)_ |

---

### Table: `auth_group`
**Rows**: 0 | **Columns**: 2

| id | name |
| --- | --- |
| (No Data) | (No Data) |

---

### Table: `auth_permission`
**Rows**: 64 | **Columns**: 4

| id | name | content_type_id | codename |
| --- | --- | --- | --- |
| 1 | Can add log entry | 1 | add_logentry |
| 2 | Can change log entry | 1 | change_logentry |
| 3 | Can delete log entry | 1 | delete_logentry |
| 4 | Can view log entry | 1 | view_logentry |
| 5 | Can add permission | 2 | add_permission |
| 6 | Can change permission | 2 | change_permission |
| 7 | Can delete permission | 2 | delete_permission |
| 8 | Can view permission | 2 | view_permission |
| 9 | Can add group | 3 | add_group |
| 10 | Can change group | 3 | change_group |
| 11 | Can delete group | 3 | delete_group |
| 12 | Can view group | 3 | view_group |
| 13 | Can add user | 4 | add_user |
| 14 | Can change user | 4 | change_user |
| 15 | Can delete user | 4 | delete_user |
| 16 | Can view user | 4 | view_user |
| 17 | Can add content type | 5 | add_contenttype |
| 18 | Can change content type | 5 | change_contenttype |
| 19 | Can delete content type | 5 | delete_contenttype |
| 20 | Can view content type | 5 | view_contenttype |
| 21 | Can add session | 6 | add_session |
| 22 | Can change session | 6 | change_session |
| 23 | Can delete session | 6 | delete_session |
| 24 | Can view session | 6 | view_session |
| 25 | Can add materi | 7 | add_materi |
| 26 | Can change materi | 7 | change_materi |
| 27 | Can delete materi | 7 | delete_materi |
| 28 | Can view materi | 7 | view_materi |
| 29 | Can add modul | 8 | add_modul |
| 30 | Can change modul | 8 | change_modul |
| 31 | Can delete modul | 8 | delete_modul |
| 32 | Can view modul | 8 | view_modul |
| 33 | Can add aktivitas | 9 | add_aktivitas |
| 34 | Can change aktivitas | 9 | change_aktivitas |
| 35 | Can delete aktivitas | 9 | delete_aktivitas |
| 36 | Can view aktivitas | 9 | view_aktivitas |
| 37 | Can add lencana | 10 | add_lencana |
| 38 | Can change lencana | 10 | change_lencana |
| 39 | Can delete lencana | 10 | delete_lencana |
| 40 | Can view lencana | 10 | view_lencana |
| 41 | Can add profil siswa | 11 | add_profilsiswa |
| 42 | Can change profil siswa | 11 | change_profilsiswa |
| 43 | Can delete profil siswa | 11 | delete_profilsiswa |
| 44 | Can view profil siswa | 11 | view_profilsiswa |
| 45 | Can add hasil aktivitas | 12 | add_hasilaktivitas |
| 46 | Can change hasil aktivitas | 12 | change_hasilaktivitas |
| 47 | Can delete hasil aktivitas | 12 | delete_hasilaktivitas |
| 48 | Can view hasil aktivitas | 12 | view_hasilaktivitas |
| 49 | Can add soal pilihan ganda | 13 | add_soalpilihanganda |
| 50 | Can change soal pilihan ganda | 13 | change_soalpilihanganda |
| 51 | Can delete soal pilihan ganda | 13 | delete_soalpilihanganda |
| 52 | Can view soal pilihan ganda | 13 | view_soalpilihanganda |
| 53 | Can add pilihan jawaban | 14 | add_pilihanjawaban |
| 54 | Can change pilihan jawaban | 14 | change_pilihanjawaban |
| 55 | Can delete pilihan jawaban | 14 | delete_pilihanjawaban |
| 56 | Can view pilihan jawaban | 14 | view_pilihanjawaban |
| 57 | Can add materi selesai | 15 | add_materiselesai |
| 58 | Can change materi selesai | 15 | change_materiselesai |
| 59 | Can delete materi selesai | 15 | delete_materiselesai |
| 60 | Can view materi selesai | 15 | view_materiselesai |
| 61 | Can add lencana siswa | 16 | add_lencanasiswa |
| 62 | Can change lencana siswa | 16 | change_lencanasiswa |
| 63 | Can delete lencana siswa | 16 | delete_lencanasiswa |
| 64 | Can view lencana siswa | 16 | view_lencanasiswa |

---

### Table: `auth_group_permissions`
**Rows**: 0 | **Columns**: 3

| id | group_id | permission_id |
| --- | --- | --- |
| (No Data) | (No Data) | (No Data) |

---

### Table: `auth_user_groups`
**Rows**: 0 | **Columns**: 3

| id | user_id | group_id |
| --- | --- | --- |
| (No Data) | (No Data) | (No Data) |

---

### Table: `auth_user_user_permissions`
**Rows**: 0 | **Columns**: 3

| id | user_id | permission_id |
| --- | --- | --- |
| (No Data) | (No Data) | (No Data) |

---

## Learning Content (Modules, Materials, Activities)

### Table: `api_modul`
**Rows**: 8 | **Columns**: 4

| id | judul | deskripsi | urutan |
| --- | --- | --- | --- |
| 3 | Pengantar Informatika & Keterampilan Generik | Selamat datang di Informatika! Modul ini adalah... | 1 |
| 4 | Berpikir Komputasional (BK) | Asah otakmu! Modul ini adalah inti dari cara be... | 2 |
| 5 | Teknologi Informasi dan Komunikasi (TIK) | Saatnya jadi power user! Modul ini membawamu me... | 3 |
| 6 | Jaringan Komputer dan Internet (JKI) | Dunia ini terhubung, tapi bagaimana caranya? Mo... | 5 |
| 7 | Analisis Data (AD) | Ubah data mentah jadi wawasan berharga! Modul i... | 6 |
| 8 | Algoritma dan Pemrograman (AP) | Saatnya kamu yang 'menyuruh' komputer! Modul in... | 7 |
| 9 | Sistem Komputer (SK) | Mari kita 'bongkar' isi komputer! Modul ini men... | 4 |
| 10 | Dampak Sosial Informatika (DSI) | Teknologi mengubah dunia, tapi apa dampaknya ba... | 8 |

---

### Table: `api_materi`
**Rows**: 25 | **Columns**: 6

| id | judul | konten_narasi | urutan | modul_id | pdf_file |
| --- | --- | --- | --- | --- | --- |
| 3 | Apa itu Informatika? | a.	Detail: Informatika bukan cuma soal main kom... | 1 | 3 | _(NULL)_ |
| 4 | Pilar Pengetahuan Informatika | a.	Ini adalah 'mata pelajaran' utama dalam Info... | 2 | 3 | _(NULL)_ |
| 5 | Keterampilan Generik | a.	Keterampilan ini penting di bidang apa saja:... | 3 | 3 | _(NULL)_ |
| 7 | Konsep dasar BK | a.	BK itu seni memecahkan masalah agar solusiny... | 1 | 4 | _(NULL)_ |
| 8 | Pencarian | a.	Konsep: Mencari item spesifik di dalam kumpu... | 2 | 4 | _(NULL)_ |
| 9 | Pengurutan (Sorting) | a.	Konsep: Menyusun ulang item sesuai aturan ur... | 3 | 4 | _(NULL)_ |
| 10 | Struktur Data Dasar | a.	Tumpukan (Stack - LIFO): Data ditumpuk, yang... | 4 | 4 | _(NULL)_ |
| 11 | Aplikasi Perkantoran Utama | a.	Pengolah Kata (Word):n	Contoh Kasus: Membua... | 1 | 5 | _(NULL)_ |
| 12 | Integrasi Konten Aplikasi | Menggabungkan 'potongan' dari satu aplikasi ke ... | 2 | 5 | _(NULL)_ |
| 13 | Fitur Lanjut | a.	Mail Merge:rn	Contoh Kasus: Panitia Pensi m... | 3 | 5 | _(NULL)_ |
| 14 | Komponen Sistem Komputer | a.	Detail: Komputer bukan cuma satu benda, tapi... | 1 | 9 | _(NULL)_ |
| 15 | Jenis Komputer | a.	Komputer ada banyak ukuran dan kegunaan:n	M... | 2 | 9 | _(NULL)_ |
| 16 | Interaksi Manusia & Komputer | a.	Cara kita 'berkomunikasi' dengan komputer:n... | 4 | 9 | _(NULL)_ |
| 17 | Sistem Operasi (OS) | a.	Definisi: Software paling penting yang jadi ... | 8 | 9 | _(NULL)_ |
| 18 | Cara Kerja Komputer | a.	CPU (Central Processing Unit): Otak komputer... | 16 | 9 | _(NULL)_ |
| 19 | Konsep Jaringan | a.	Jaringan Lokal (LAN - Local Area Network): M... | 1 | 6 | _(NULL)_ |
| 20 | Konektivitas Internet | Cara perangkat kita nyambung ke Internet:na.	Be... | 2 | 6 | _(NULL)_ |
| 21 | Komunikasi Data Ponsel | a.	Mekanisme: Saat kirim SMS, pesanmu gak langs... | 3 | 6 | _(NULL)_ |
| 22 | Keamanan Data di Internet | a.	Kenapa penting? Data kita (chat, password, n... | 8 | 6 | _(NULL)_ |
| 23 | Pengantar dan Perkakas | a.	Kenapa Analisis Data?: Dunia penuh data! Ana... | 1 | 7 | _(NULL)_ |
| 24 | Dasar Python untuk Analisis Data | a.	Ini beberapa perintah dasarnya:n	print(): M... | 2 | 7 | _(NULL)_ |
| 25 | Proses Analisis Data | a.	Langkah umumnya:n1.	Koleksi Data: Mendapatka... | 4 | 7 | _(NULL)_ |
| 26 | Konsep Algoritma | a.	Definisi: Algoritma itu seperti resep atau p... | 1 | 8 | _(NULL)_ |
| 27 | Pengantar Pemrograman | a.	Bahasa Pemrograman: Alat komunikasi kita den... | 2 | 8 | _(NULL)_ |
| 28 | Dasar Bahasa C | a.	Struktur Program MinimalnCn#include <stdio.h... |  |  |  |

---

### Table: `api_aktivitas`
**Rows**: 10 | **Columns**: 8

| id | tipe_aktivitas | instruksi | poin | kode_jawaban | blok_kode_acak | validasi_html | materi_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | PILIHAN_GANDA | Jawablah quiz berikut ini, sebagai bukti bahwa ... | 10 | _(NULL)_ | _(NULL)_ | _(NULL)_ | 5 |
| 6 | PILIHAN_GANDA | Jawablah quiz berikut ini, sebagai bukti bahwa ... | 10 | _(NULL)_ | _(NULL)_ | _(NULL)_ | 10 |
| 7 | PILIHAN_GANDA | Jawablah quiz berikut ini, sebagai bukti bahwa ... | 10 | _(NULL)_ | _(NULL)_ | _(NULL)_ | 13 |
| 8 | PILIHAN_GANDA | Jawablah quiz berikut ini, sebagai bukti bahwa ... | 10 | _(NULL)_ | _(NULL)_ | _(NULL)_ | 18 |
| 9 | PILIHAN_GANDA | Jawablah quiz berikut ini, sebagai bukti bahwa ... | 10 | _(NULL)_ | _(NULL)_ | _(NULL)_ | 22 |
| 10 | PILIHAN_GANDA | Jawablah quiz berikut ini, sebagai bukti bahwa ... | 10 |  |  | _(NULL)_ | 25 |
| 11 | PILIHAN_GANDA | Jawablah quiz berikut ini, sebagai bukti bahwa ... | 10 |  |  | _(NULL)_ | 27 |
| 12 | PILIHAN_GANDA | Jawablah quiz berikut ini, sebagai bukti bahwa ... | 10 | _(NULL)_ | _(NULL)_ | _(NULL)_ | 32 |
| 13 | PUZZLE_CODE | Urutkan pembuatan teh secara benar | 20 | Panaskan air hingga mendidih.Masukkan teh ke da... | Masukkan teh ke dalam gelas., Aduk hingga gula ... | _(NULL)_ | 9 |
| 14 | DEMO_HTML | Tampilkan "Hello World!" | 20 |  |  | #include <stdio.h>  int main() { printf("Hello ... |  |

---

### Table: `api_soalpilihanganda`
**Rows**: 124 | **Columns**: 3

| id | pertanyaan | aktivitas_id |
| --- | --- | --- |
| 152 | Berdasarkan materi, manakah definisi yang palin... | 4 |
| 153 | Landasan berpikir utama dalam Informatika untuk... | 4 |
| 154 | Pilar pengetahuan Informatika yang mempelajari ... | 4 |
| 155 | Dalam contoh aplikasi pesan makanan online, not... | 4 |
| 156 | Pilar yang fokus pada pengolahan data mentah me... | 4 |
| 157 | Membagi tugas dalam kepanitiaan OSIS (misal: ti... | 4 |
| 158 | Membuat infografis rincian dana agar mudah dili... | 4 |
| 159 | Pilar Informatika yang mempelajari cara 'menyur... | 4 |
| 160 | Istilah 'Society 5.0' dalam konteks relevansi I... | 4 |
| 161 | Penggunaan internet hanya untuk hiburan. | 4 |
| 162 | Revolusi industri 4.0 ditandai dengan gabungan ... | 4 |
| 163 | Mengapa belajar Informatika berbeda dengan seka... | 4 |
| 164 | Salah satu profil Pelajar Pancasila yang sangat... | 4 |
| 165 | Dalam pilar Informatika, JKI adalah singkatan d... | 4 |
| 166 | Metode pembelajaran STEM yang sering dipakai di... | 4 |
| 167 | Aplikasi yang sering digunakan untuk membuat in... | 4 |
| 168 | Salah satu etika penting saat bekerja dalam kel... | 4 |
| 169 | Struktur presentasi yang baik biasanya terdiri ... | 4 |
| 170 | Mengapa siswa informatika perlu belajar membuat... | 4 |
| 171 | Bidang ilmu yang mempelajari bagaimana komputer... | 4 |
| 172 | Seorang siswa ingin membuat peta perjalanan dar... | 6 |
| 173 | Memecah masalah pembuatan website menjadi bagia... | 6 |
| 174 | Dalam permainan tebak angka 1-100, strategi men... | 6 |
| 175 | Kamu memiliki tumpukan kartu acak. Kamu mengamb... | 6 |
| 176 | Algoritma pengurutan yang bekerja dengan cara m... | 6 |
| 177 | Fitur 'Undo' pada aplikasi pengolah kata yang m... | 6 |
| 178 | Antrean cetak pada printer, di mana dokumen yan... | 6 |
| 179 | Menyadari bahwa perkalian 5 x 3 sama dengan pen... | 6 |
| 180 | Tombol 'Back' pada browser yang membawamu kemba... | 6 |
| 181 | Resep membuat mie instan yang berisi langkah-la... | 6 |
| 182 | Ketika kamu melihat jadwal pelajaran dan menyad... | 6 |
| 183 | Saat menggunakan Google Maps, kita melihat gari... | 6 |
| 184 | Jika data diurutkan dari nilai terbesar ke terk... | 6 |
| 185 | Tumpukan buku di atas meja adalah analogi palin... | 6 |
| 186 | Manakah di bawah ini yang BUKAN ciri-ciri algor... | 6 |
| 187 | Dalam pencarian data, metode 'Binary Search' (P... | 6 |
| 188 | Saat lampu lalu lintas merah menyala, semua ken... | 6 |
| 189 | Manakah yang merupakan operator logika 'ATAU' (... | 6 |
| 190 | Proses mencari solusi yang 'paling baik' atau '... | 6 |
| 191 | Jika kamu menyusun buku di rak berdasarkan kete... | 6 |
| 192 | Aplikasi yang paling tepat digunakan untuk meng... | 7 |
| 193 | Fitur 'Mail Merge' pada Microsoft Word berfungs... | 7 |
| 194 | Jika kita ingin menyisipkan tabel Excel ke Word... | 7 |
| 195 | Perintah 'Cut' pada komputer berfungsi untuk... | 7 |
| 196 | Untuk membuat Daftar Isi secara otomatis di Wor... | 7 |
| 197 | Aplikasi Microsoft PowerPoint memiliki fitur 'R... | 7 |
| 198 | Perintah keyboard (shortcut) untuk melakukan 'C... | 7 |
| 199 | Apa fungsi utama dari integrasi antar aplikasi ... | 7 |
| 200 | Menu yang digunakan untuk memasukkan grafik (ch... | 7 |
| 201 | Tempat penyimpanan sementara saat melakukan ope... | 7 |
| 202 | Ekstensi file standar untuk dokumen yang dibuat... | 7 |
| 203 | Fitur di PowerPoint untuk mengatur efek pergera... | 7 |
| 204 | Tombol keyboard (shortcut) universal untuk memb... | 7 |
| 205 | Jika kamu ingin menyimpan dokumen Word menjadi ... | 7 |
| 206 | Fitur 'Screenshot' atau 'Snipping Tool' digunak... | 7 |
| 207 | Shortcut keyboard untuk menyimpan (Save) dokume... | 7 |
| 208 | Layanan penyimpanan file di internet (Cloud Sto... | 7 |
| 209 | Aplikasi peramban (Browser) yang digunakan untu... | 7 |
| 210 | Mesin pencari (Search Engine) paling populer un... | 7 |
| 211 | Ekstensi file .pdf adalah singkatan dari... | 7 |
| 212 | Komponen sistem komputer yang merupakan instruk... | 8 |
| 213 | Jenis komputer yang memiliki ukuran paling keci... | 8 |
| 214 | Cara berinteraksi dengan komputer yang mengguna... | 8 |
| 215 | Manakah fungsi Sistem Operasi (OS) berikut yang... | 8 |
| 216 | Bagian dari CPU yang bertugas melakukan perhitu... | 8 |
| 217 | Apa perbedaan utama antara RAM (Memori Primer) ... | 8 |
| 218 | Langkah pertama dalam Siklus Ambil-Jalankan (Fe... | 8 |
| 219 | Agar perangkat keras baru (misalnya printer) da... | 8 |
| 220 | Komputer besar yang biasa digunakan oleh perusa... | 8 |
| 221 | Dalam contoh mesin konseptual, instruksi SALIN ... | 8 |
| 222 | Manakah di bawah ini yang termasuk perangkat IN... | 8 |
| 223 | Manakah di bawah ini yang termasuk perangkat OU... | 8 |
| 224 | Sistem bilangan yang hanya menggunakan angka 0 ... | 8 |
| 225 | Urutan satuan kapasitas memori dari yang terkec... | 8 |
| 226 | Papan sirkuit utama tempat menempelnya CPU, RAM... | 8 |
| 227 | Jenis penyimpanan data yang lebih modern, lebih... | 8 |
| 228 | Komponen komputer yang bertugas menyuplai daya ... | 8 |
| 229 | Komponen yang bertanggung jawab untuk memproses... | 8 |
| 230 | Satuan kecepatan prosesor (CPU) biasanya diukur... | 8 |
| 231 | Sistem operasi (OS) yang bersifat Open Source d... | 8 |
| 232 | Jaringan yang menghubungkan komputer dalam area... | 9 |
| 233 | Identitas unik berupa angka yang dimiliki setia... | 9 |
| 234 | Teknologi koneksi internet tanpa kabel yang men... | 9 |
| 235 | Protokol keamanan web yang ditandai dengan ikon... | 9 |
| 236 | Penyedia jasa layanan internet seperti IndiHome... | 9 |
| 237 | Teknologi nirkabel jarak sangat dekat yang seri... | 9 |
| 238 | Mengapa kita tidak boleh sembarangan memasukkan... | 9 |
| 239 | Jaringan seluler generasi ke-4 yang menawarkan ... | 9 |
| 240 | Proses mengubah data menjadi kode rahasia agar ... | 9 |
| 241 | IP Address yang hanya berlaku di dalam jaringan... | 9 |
| 242 | Fitur di HP yang memungkinkan kita berbagi kone... | 9 |
| 243 | Perangkat keras yang berfungsi mengubah sinyal ... | 9 |
| 244 | Proses mengambil data dari internet ke komputer... | 9 |
| 245 | Apa yang terjadi jika kita mengaktifkan 'Airpla... | 9 |
| 246 | Domain '.go.id' pada sebuah alamat website mena... | 9 |
| 247 | Kecepatan transfer data internet biasanya diuku... | 9 |
| 248 | Teknik penipuan online dengan membuat website p... | 9 |
| 249 | Perintah jaringan untuk mengecek apakah kompute... | 9 |
| 250 | Manakah yang merupakan contoh password yang KUAT? | 9 |
| 251 | Kapasitas maksimum data yang dapat dikirimkan m... | 9 |
| ... (24 more rows hidden) | |  | 

---

### Table: `api_pilihanjawaban`
**Rows**: 557 | **Columns**: 4

| id | teks_jawaban | apakah_benar | soal_id |
| --- | --- | --- | --- |
| 569 | Ilmu tentang studi, perancangan, dan pengembang... | 1 | 152 |
| 570 | Teknik memperbaiki telepon pintar yang rusak. | 0 | 152 |
| 571 | Ilmu yang hanya mempelajari cara merakit perang... | 0 | 152 |
| 572 | Kemampuan menggunakan aplikasi perkantoran saja. | 0 | 152 |
| 573 | Berpikir Abstrak | 0 | 153 |
| 574 | Berpikir Kreatif | 0 | 153 |
| 575 | Berpikir Komputasional | 1 | 153 |
| 576 | Berpikir Kritis | 0 | 153 |
| 577 | Sistem Komputer (SK) | 1 | 154 |
| 578 | Dampak Sosial Informatika (DSI) | 0 | 154 |
| 579 | Jaringan Komputer dan Internet (JKI) | 0 | 154 |
| 580 | Analisis Data (AD) | 0 | 154 |
| 581 | Input | 0 | 155 |
| 582 | Output | 1 | 155 |
| 583 | Penyimpanan | 0 | 155 |
| 584 | Pemrosesan | 0 | 155 |
| 585 | AD (Analisis Data) | 1 | 156 |
| 586 | TIK (Teknologi Informasi dan Komunikasi) | 0 | 156 |
| 587 | AP (Algoritma dan Pemrograman) | 0 | 156 |
| 588 | PLB (Praktik Lintas Bidang) | 0 | 156 |
| 589 | Presentasi | 0 | 157 |
| 590 | Komunikasi | 0 | 157 |
| 591 | Komputasi | 0 | 157 |
| 592 | Kolaborasi | 1 | 157 |
| 593 | Komunikasi | 1 | 158 |
| 594 | Berpikir Komputasional | 0 | 158 |
| 595 | Kolaborasi | 0 | 158 |
| 596 | Algoritma | 0 | 158 |
| 597 | AP (Algoritma dan Pemrograman) | 1 | 159 |
| 598 | DSI (Dampak Sosial Informatika) | 0 | 159 |
| 599 | JKI (Jaringan Komputer dan Internet) | 0 | 159 |
| 600 | SK (Sistem Komputer) | 0 | 159 |
| 601 | Era di mana manusia tidak lagi menggunakan tekn... | 0 | 160 |
| 602 | Zaman industri yang hanya mengandalkan mesin uap. | 0 | 160 |
| 603 | Dunia di mana ruang fisik (nyata) dan ruang sib... | 1 | 160 |
| 604 | Penggunaan internet hanya untuk hiburan. | 0 | 160 |
| 605 | Belajar satu topik informatika saja secara mend... | 0 | 161 |
| 606 | Hanya belajar teori tanpa praktik. | 0 | 161 |
| 607 | Menghindari penggunaan komputer dalam belajar. | 0 | 161 |
| 608 | Membuat proyek dengan menggabungkan berbagai il... | 1 | 161 |
| 609 | Siber (Cyber) dan Internet | 1 | 162 |
| 610 | Mesin Uap | 0 | 162 |
| 611 | Listrik | 0 | 162 |
| 612 | Percetakan | 0 | 162 |
| 613 | Tidak ada bedanya. | 0 | 163 |
| 614 | Informatika lebih banyak menghafal tombol. | 0 | 163 |
| 615 | Informatika mengajarkan logika penciptaan dan p... | 1 | 163 |
| 616 | TIK belajar mencipta alat, Informatika hanya me... | 0 | 163 |
| 617 | Mandiri | 0 | 164 |
| 618 | Gotong Royong | 1 | 164 |
| 619 | Berkebinekaan Global | 0 | 164 |
| 620 | Beriman | 0 | 164 |
| 621 | Jaringan Komputer dan Internet | 1 | 165 |
| 622 | Jaringan Komunikasi Indonesia | 0 | 165 |
| 623 | Jasa Komputer Internasional | 0 | 165 |
| 624 | Jalur Koneksi Instan | 0 | 165 |
| 625 | Mathematics | 1 | 166 |
| 626 | Money | 0 | 166 |
| 627 | Management | 0 | 166 |
| 628 | Music | 0 | 166 |
| 629 | Command Prompt | 0 | 167 |
| 630 | Notepad | 0 | 167 |
| 631 | Calculator | 0 | 167 |
| 632 | Canva / Piktochart | 1 | 167 |
| 633 | Menyembunyikan informasi dari teman. | 0 | 168 |
| 634 | Tidak mau mengerjakan tugas. | 0 | 168 |
| 635 | Menghargai pendapat teman meskipun berbeda. | 1 | 168 |
| 636 | Memaksakan kehendak sendiri. | 0 | 168 |
| 637 | Gambar, Video, Audio | 0 | 169 |
| 638 | Input, Proses, Output | 0 | 169 |
| 639 | Judul, Nama, Tanggal | 0 | 169 |
| 640 | Pembukaan, Isi, Penutup | 1 | 169 |
| 641 | Untuk menghabiskan kertas. | 0 | 170 |
| 642 | Agar terlihat sibuk. | 0 | 170 |
| 643 | Karena komputer tidak bisa menyimpan data. | 0 | 170 |
| 644 | Untuk mendokumentasikan hasil kerja agar bisa d... | 1 | 170 |
| 645 | Jaringan Komputer | 0 | 171 |
| 646 | Sistem Operasi | 0 | 171 |
| 647 | Analisis Data | 0 | 171 |
| 648 | Kecerdasan Buatan (Artificial Intelligence) | 1 | 171 |
| 649 | Algoritma | 0 | 172 |
| 650 | Dekomposisi | 0 | 172 |
| 651 | Pengenalan Pola | 0 | 172 |
| 652 | Abstraksi | 1 | 172 |
| 653 | Abstraksi | 0 | 173 |
| 654 | Algoritma | 0 | 173 |
| 655 | Pengenalan Pola | 0 | 173 |
| 656 | Dekomposisi | 1 | 173 |
| 657 | Stack (Tumpukan) | 0 | 174 |
| 658 | Queue (Antrean) | 0 | 174 |
| 659 | Sorting (Pengurutan) | 0 | 174 |
| 660 | Searching (Pencarian) | 1 | 174 |
| 661 | Quick Sort | 0 | 175 |
| 662 | Quick Sort | 0 | 175 |
| 663 | Selection Sort | 0 | 175 |
| 664 | Insertion Sort | 1 | 175 |
| 665 | Selection Sort | 1 | 176 |
| 666 | Merge Sort | 0 | 176 |
| 667 | Insertion Sort | 0 | 176 |
| 668 | Linear Search | 0 | 176 |
| ... (457 more rows hidden) | |  |  | 

---

## Student Progress (Results, Badges, Completion)

### Table: `api_hasilaktivitas`
**Rows**: 251 | **Columns**: 5

| id | skor | tanggal_pengerjaan | aktivitas_id | profil_siswa_id |
| --- | --- | --- | --- | --- |
| 30 | 20 | 2025-12-07 19:40:29.389825 | 13 | 2 |
| 31 | 10 | 2025-12-08 02:18:49.855696 | 4 | 2 |
| 32 | 10 | 2025-12-09 17:04:15.836954 | 4 | 4 |
| 33 | 1 | 2025-12-09 17:04:45.841611 | 4 | 4 |
| 34 | 10 | 2025-12-14 16:21:21.183456 | 4 | 3 |
| 35 | 2 | 2025-12-14 16:21:59.006627 | 4 | 3 |
| 36 | 10 | 2025-12-15 03:34:17.851816 | 4 | 12 |
| 37 | 9 | 2025-12-15 03:37:51.553858 | 4 | 7 |
| 38 | 8 | 2025-12-15 03:39:06.100018 | 4 | 9 |
| 39 | 8 | 2025-12-15 03:39:24.296973 | 4 | 10 |
| 40 | 8 | 2025-12-15 03:39:40.781773 | 4 | 8 |
| 41 | 7 | 2025-12-15 03:40:23.517748 | 4 | 11 |
| 42 | 9 | 2025-12-15 03:40:46.035674 | 4 | 18 |
| 43 | 8 | 2025-12-15 03:41:12.672865 | 4 | 14 |
| 44 | 9 | 2025-12-15 03:44:24.715228 | 6 | 7 |
| 45 | 10 | 2025-12-15 03:44:54.009463 | 4 | 12 |
| 46 | 7 | 2025-12-15 03:46:04.300579 | 4 | 22 |
| 47 | 9 | 2025-12-15 03:46:32.357237 | 4 | 29 |
| 48 | 9 | 2025-12-15 03:46:56.309306 | 4 | 24 |
| 51 | 4 | 2025-12-21 08:34:18.002245 | 4 | 3 |
| 52 | 9 | 2025-12-21 08:36:31.103876 | 7 | 3 |
| 53 | 8 | 2025-12-21 09:18:09.197895 | 6 | 7 |
| 54 | 10 | 2025-12-21 09:21:02.948335 | 7 | 7 |
| 55 | 10 | 2025-12-21 09:21:38.569482 | 9 | 7 |
| 56 | 9 | 2025-12-21 09:21:46.629394 | 10 | 7 |
| 57 | 8 | 2025-12-21 09:21:56.886305 | 11 | 7 |
| 58 | 9 | 2025-12-21 09:22:08.366088 | 12 | 7 |
| 60 | 8 | 2025-12-21 09:27:33.992617 | 6 | 10 |
| 61 | 8 | 2025-12-21 09:27:45.945480 | 7 | 10 |
| 62 | 8 | 2025-12-21 09:27:57.199984 | 8 | 10 |
| 63 | 8 | 2025-12-21 09:28:05.843657 | 9 | 10 |
| 64 | 8 | 2025-12-21 09:28:14.633605 | 11 | 10 |
| 65 | 9 | 2025-12-21 09:28:27.862269 | 11 | 10 |
| 66 | 8 | 2025-12-21 09:28:42.372188 | 12 | 10 |
| 67 | 10 | 2025-12-21 09:39:31.342419 | 7 | 12 |
| 68 | 9 | 2025-12-21 09:39:41.111828 | 8 | 12 |
| 69 | 10 | 2025-12-21 09:39:50.280020 | 9 | 12 |
| 70 | 9 | 2025-12-21 09:39:58.908432 | 9 | 12 |
| 71 | 10 | 2025-12-21 09:40:07.570401 | 9 | 12 |
| 72 | 10 | 2025-12-21 09:40:38.217667 | 12 | 12 |
| 73 | 7 | 2025-12-21 10:16:01.045171 | 7 | 22 |
| 74 | 8 | 2025-12-21 10:16:26.406492 | 8 | 22 |
| 75 | 8 | 2025-12-21 10:16:42.645785 | 9 | 22 |
| 76 | 7 | 2025-12-21 10:17:07.303225 | 10 | 22 |
| 77 | 8 | 2025-12-21 10:17:19.852535 | 11 | 22 |
| 78 | 8 | 2025-12-21 10:17:58.414689 | 11 | 22 |
| 79 | 7 | 2025-12-21 10:18:38.380354 | 12 | 22 |
| 80 | 8 | 2025-12-21 13:39:39.438274 | 6 | 24 |
| 81 | 9 | 2025-12-21 13:40:03.770495 | 7 | 24 |
| 82 | 9 | 2025-12-21 13:40:25.626875 | 8 | 24 |
| 83 | 8 | 2025-12-21 13:40:48.036720 | 9 | 24 |
| 84 | 9 | 2025-12-21 13:41:27.569846 | 11 | 24 |
| 85 | 9 | 2025-12-21 13:42:06.618263 | 11 | 24 |
| 86 | 8 | 2025-12-21 13:42:48.423988 | 12 | 24 |
| 87 | 9 | 2025-12-21 13:59:07.034841 | 6 | 29 |
| 88 | 9 | 2025-12-21 13:59:20.167321 | 7 | 29 |
| 89 | 10 | 2025-12-21 13:59:38.108312 | 8 | 29 |
| 90 | 9 | 2025-12-21 13:59:58.481031 | 9 | 29 |
| 91 | 9 | 2025-12-21 14:00:13.096292 | 10 | 29 |
| 92 | 10 | 2025-12-21 14:00:34.883800 | 11 | 29 |
| 93 | 9 | 2025-12-21 14:01:13.692544 | 12 | 29 |
| 94 | 7 | 2025-12-21 14:19:13.712800 | 4 | 25 |
| 95 | 7 | 2025-12-21 14:19:25.709931 | 6 | 25 |
| 96 | 7 | 2025-12-21 14:19:36.921423 | 7 | 25 |
| 97 | 7 | 2025-12-21 14:19:48.028034 | 8 | 25 |
| 98 | 8 | 2025-12-21 14:20:20.882532 | 9 | 25 |
| 99 | 7 | 2025-12-21 14:20:45.362996 | 10 | 25 |
| 100 | 7 | 2025-12-21 14:21:01.746307 | 11 | 25 |
| 101 | 8 | 2025-12-21 14:21:17.476708 | 12 | 25 |
| 102 | 10 | 2025-12-21 14:31:46.442449 | 4 | 27 |
| 103 | 10 | 2025-12-21 14:31:59.701813 | 6 | 27 |
| 104 | 10 | 2025-12-21 14:32:10.127579 | 7 | 27 |
| 105 | 10 | 2025-12-21 14:32:23.993234 | 8 | 27 |
| 106 | 10 | 2025-12-21 14:32:36.734056 | 9 | 27 |
| 107 | 10 | 2025-12-21 14:33:26.805530 | 10 | 27 |
| 108 | 10 | 2025-12-21 14:33:39.033185 | 11 | 27 |
| 109 | 10 | 2025-12-21 14:33:52.168550 | 12 | 27 |
| 110 | 9 | 2025-12-21 15:00:24.860467 | 6 | 9 |
| 111 | 8 | 2025-12-21 15:00:56.270391 | 7 | 9 |
| 112 | 9 | 2025-12-21 15:01:39.579692 | 8 | 9 |
| 113 | 8 | 2025-12-21 15:02:01.055294 | 9 | 9 |
| 114 | 8 | 2025-12-21 15:02:20.354854 | 10 | 9 |
| 115 | 9 | 2025-12-21 15:02:57.121841 | 11 | 9 |
| 116 | 8 | 2025-12-21 15:03:16.261252 | 12 | 9 |
| 117 | 8 | 2025-12-21 15:16:25.132406 | 6 | 14 |
| 118 | 7 | 2025-12-21 15:16:45.851414 | 7 | 14 |
| 119 | 8 | 2025-12-21 15:17:07.238253 | 8 | 14 |
| 120 | 8 | 2025-12-21 15:17:23.340626 | 9 | 14 |
| 121 | 8 | 2025-12-21 15:17:54.337056 | 10 | 14 |
| 122 | 8 | 2025-12-21 15:18:12.733110 | 11 | 14 |
| 123 | 8 | 2025-12-21 15:19:00.194706 | 12 | 14 |
| 124 | 9 | 2025-12-21 15:41:34.197334 | 6 | 8 |
| 125 | 8 | 2025-12-21 15:41:59.815157 | 7 | 8 |
| 126 | 9 | 2025-12-21 15:42:12.320412 | 8 | 8 |
| 127 | 8 | 2025-12-21 15:42:34.513530 | 9 | 8 |
| 128 | 8 | 2025-12-21 15:42:53.101346 | 10 | 8 |
| 129 | 9 | 2025-12-21 15:43:07.893128 | 11 | 8 |
| 130 | 8 | 2025-12-21 15:43:22.672222 | 12 | 8 |
| 131 | 10 | 2025-12-21 15:58:49.156344 | 6 | 18 |
| 132 | 9 | 2025-12-21 15:59:21.431101 | 7 | 18 |
| ... (151 more rows hidden) | |  |  |  | 

---

### Table: `api_materiselesai`
**Rows**: 892 | **Columns**: 4

| id | tanggal_selesai | materi_id | profil_siswa_id |
| --- | --- | --- | --- |
| 6 | 2025-12-04 09:43:08.918299 | 3 | 2 |
| 7 | 2025-12-04 09:47:54.854789 | 4 | 2 |
| 8 | 2025-12-05 16:00:44.894292 | 5 | 2 |
| 10 | 2025-12-07 19:39:34.914834 | 7 | 2 |
| 11 | 2025-12-07 19:39:37.642588 | 8 | 2 |
| 12 | 2025-12-07 19:40:29.537020 | 9 | 2 |
| 13 | 2025-12-09 17:03:58.131345 | 3 | 4 |
| 14 | 2025-12-09 17:04:02.601480 | 4 | 4 |
| 15 | 2025-12-09 17:04:15.932664 | 5 | 4 |
| 16 | 2025-12-14 16:21:12.778440 | 3 | 3 |
| 17 | 2025-12-14 16:21:16.142722 | 4 | 3 |
| 18 | 2025-12-14 16:21:21.282103 | 5 | 3 |
| 19 | 2025-12-14 16:24:20.131401 | 7 | 3 |
| 20 | 2025-12-15 03:31:55.551662 | 3 | 7 |
| 21 | 2025-12-15 03:33:40.421948 | 4 | 7 |
| 22 | 2025-12-15 03:33:56.839588 | 3 | 12 |
| 23 | 2025-12-15 03:34:09.024640 | 3 | 10 |
| 24 | 2025-12-15 03:34:13.312972 | 4 | 12 |
| 25 | 2025-12-15 03:34:17.960431 | 5 | 12 |
| 26 | 2025-12-15 03:34:48.357299 | 4 | 10 |
| 27 | 2025-12-15 03:37:52.336823 | 5 | 7 |
| 28 | 2025-12-15 03:37:55.061028 | 3 | 22 |
| 29 | 2025-12-15 03:38:33.965924 | 3 | 24 |
| 30 | 2025-12-15 03:38:53.361607 | 4 | 22 |
| 31 | 2025-12-15 03:39:06.465843 | 5 | 9 |
| 32 | 2025-12-15 03:39:12.609681 | 3 | 25 |
| 33 | 2025-12-15 03:39:24.610424 | 5 | 10 |
| 34 | 2025-12-15 03:39:27.069883 | 4 | 24 |
| 35 | 2025-12-15 03:39:40.899061 | 5 | 8 |
| 36 | 2025-12-15 03:40:00.815156 | 3 | 29 |
| 37 | 2025-12-15 03:40:22.607411 | 4 | 25 |
| 38 | 2025-12-15 03:40:24.959574 | 5 | 11 |
| 39 | 2025-12-15 03:40:47.319198 | 5 | 18 |
| 40 | 2025-12-15 03:40:56.755594 | 4 | 29 |
| 41 | 2025-12-15 03:41:05.606834 | 3 | 27 |
| 42 | 2025-12-15 03:41:13.108343 | 5 | 14 |
| 43 | 2025-12-15 03:44:25.690001 | 10 | 7 |
| 44 | 2025-12-15 03:46:04.695418 | 5 | 22 |
| 45 | 2025-12-15 03:46:32.708345 | 5 | 29 |
| 46 | 2025-12-15 03:46:57.420530 | 5 | 24 |
| 48 | 2025-12-21 08:12:19.730571 | 8 | 3 |
| 49 | 2025-12-21 08:36:31.188579 | 13 | 3 |
| 50 | 2025-12-21 09:07:27.342193 | 8 | 7 |
| 51 | 2025-12-21 09:09:25.202911 | 9 | 7 |
| 52 | 2025-12-21 09:09:53.852954 | 11 | 7 |
| 53 | 2025-12-21 09:10:03.561483 | 12 | 7 |
| 54 | 2025-12-21 09:10:15.976244 | 13 | 7 |
| 55 | 2025-12-21 09:10:29.699733 | 19 | 7 |
| 56 | 2025-12-21 09:10:37.118786 | 20 | 7 |
| 57 | 2025-12-21 09:10:48.029720 | 21 | 7 |
| 58 | 2025-12-21 09:11:06.935587 | 22 | 7 |
| 59 | 2025-12-21 09:11:16.676361 | 23 | 7 |
| 60 | 2025-12-21 09:11:33.830489 | 24 | 7 |
| 61 | 2025-12-21 09:11:44.153735 | 25 | 7 |
| 62 | 2025-12-21 09:11:54.353134 | 26 | 7 |
| 63 | 2025-12-21 09:12:04.723653 | 27 | 7 |
| 64 | 2025-12-21 09:12:12.326003 | 28 | 7 |
| 65 | 2025-12-21 09:12:30.525704 | 14 | 7 |
| 66 | 2025-12-21 09:12:39.058449 | 15 | 7 |
| 67 | 2025-12-21 09:12:47.660113 | 16 | 7 |
| 68 | 2025-12-21 09:13:04.128262 | 17 | 7 |
| 69 | 2025-12-21 09:13:13.049387 | 18 | 7 |
| 70 | 2025-12-21 09:13:25.343804 | 29 | 7 |
| 71 | 2025-12-21 09:13:35.324655 | 30 | 7 |
| 72 | 2025-12-21 09:13:46.777588 | 31 | 7 |
| 73 | 2025-12-21 09:14:00.170083 | 32 | 7 |
| 74 | 2025-12-21 09:29:24.995085 | 7 | 10 |
| 75 | 2025-12-21 09:29:34.368356 | 8 | 10 |
| 76 | 2025-12-21 09:29:43.623428 | 9 | 10 |
| 77 | 2025-12-21 09:29:57.279082 | 10 | 10 |
| 78 | 2025-12-21 09:30:52.616296 | 11 | 10 |
| 79 | 2025-12-21 09:31:06.440969 | 12 | 10 |
| 80 | 2025-12-21 09:31:15.426603 | 13 | 10 |
| 81 | 2025-12-21 09:31:33.155938 | 19 | 10 |
| 82 | 2025-12-21 09:31:40.331261 | 20 | 10 |
| 83 | 2025-12-21 09:31:47.507570 | 21 | 10 |
| 84 | 2025-12-21 09:32:00.623137 | 22 | 10 |
| 85 | 2025-12-21 09:32:21.950472 | 23 | 10 |
| 86 | 2025-12-21 09:32:29.231845 | 24 | 10 |
| 87 | 2025-12-21 09:33:21.218055 | 25 | 10 |
| 88 | 2025-12-21 09:33:30.074197 | 26 | 10 |
| 89 | 2025-12-21 09:33:38.585544 | 27 | 10 |
| 90 | 2025-12-21 09:33:46.451265 | 28 | 10 |
| 91 | 2025-12-21 09:34:07.759171 | 14 | 10 |
| 92 | 2025-12-21 09:34:14.182770 | 15 | 10 |
| 93 | 2025-12-21 09:34:23.222348 | 16 | 10 |
| 94 | 2025-12-21 09:34:29.645356 | 17 | 10 |
| 95 | 2025-12-21 09:34:39.356816 | 18 | 10 |
| 96 | 2025-12-21 09:34:51.893894 | 29 | 10 |
| 97 | 2025-12-21 09:34:58.043153 | 30 | 10 |
| 98 | 2025-12-21 09:35:04.053736 | 31 | 10 |
| 99 | 2025-12-21 09:35:08.959303 | 32 | 10 |
| 100 | 2025-12-21 10:08:13.849057 | 7 | 12 |
| 101 | 2025-12-21 10:08:23.338400 | 8 | 12 |
| 102 | 2025-12-21 10:08:30.438708 | 9 | 12 |
| 103 | 2025-12-21 10:08:42.013587 | 10 | 12 |
| 104 | 2025-12-21 10:08:48.156287 | 11 | 12 |
| 105 | 2025-12-21 10:08:54.699875 | 12 | 12 |
| 106 | 2025-12-21 10:09:11.611129 | 13 | 12 |
| 107 | 2025-12-21 10:09:22.072874 | 19 | 12 |
| ... (792 more rows hidden) | |  |  | 

---

### Table: `api_lencana`
**Rows**: 8 | **Columns**: 6

| id | nama | deskripsi | modul_terkait_id | jenis | syarat_quiz_count |
| --- | --- | --- | --- | --- | --- |
| 2 | Informatics Explorer | Kamu resmi memulai petualangan di dunia Informa... | 3 | MODULE_COMPLETE | _(NULL)_ |
| 3 | Computational Thinker | Selamat! Kamu sudah mahir memakai cara berpikir... | 4 | MODULE_COMPLETE | _(NULL)_ |
| 4 | Productivity Pro (TIK Master) | Badge ini membuktikan kamu bukan sekadar penggu... | 5 | MODULE_COMPLETE | _(NULL)_ |
| 5 | System Insider | Kamu sudah paham “jeroan” komputer: hardware, s... | 9 | MODULE_COMPLETE | _(NULL)_ |
| 6 | Network Navigator | Kamu berhasil memahami bagaimana perangkat terh... | 6 | MODULE_COMPLETE | _(NULL)_ |
| 7 | Data Analyzer | Kamu bisa mengubah data mentah menjadi insight!... | 7 | MODULE_COMPLETE | _(NULL)_ |
| 8 | Algorithm Architect | Kamu sudah bisa merancang solusi dengan algorit... | 8 | MODULE_COMPLETE | _(NULL)_ |
| 9 | Digital Society Observer | Badge ini menandakan kamu paham hubungan teknol... | 10 | MODULE_COMPLETE | _(NULL)_ |

---

### Table: `api_lencanasiswa`
**Rows**: 236 | **Columns**: 4

| id | tanggal_didapat | lencana_id | profil_siswa_id |
| --- | --- | --- | --- |
| 3 | 2025-12-05 16:01:24.786408 | 2 | 2 |
| 4 | 2025-12-09 17:04:45.859603 | 2 | 4 |
| 5 | 2025-12-14 16:21:59.028723 | 2 | 3 |
| 6 | 2025-12-15 03:44:54.028186 | 2 | 12 |
| 7 | 2025-12-21 09:15:44.891601 | 2 | 7 |
| 8 | 2025-12-21 09:15:51.327767 | 3 | 7 |
| 9 | 2025-12-21 09:15:57.365038 | 4 | 7 |
| 10 | 2025-12-21 09:16:04.883596 | 5 | 7 |
| 11 | 2025-12-21 09:16:14.672061 | 6 | 7 |
| 12 | 2025-12-21 09:16:21.099453 | 7 | 7 |
| 13 | 2025-12-21 09:16:35.575098 | 8 | 7 |
| 14 | 2025-12-21 09:16:42.106339 | 9 | 7 |
| 15 | 2025-12-21 09:40:57.168497 | 3 | 12 |
| 16 | 2025-12-21 09:41:04.159709 | 4 | 11 |
| 17 | 2025-12-21 09:41:10.926868 | 4 | 12 |
| 18 | 2025-12-21 09:41:18.478763 | 5 | 12 |
| 19 | 2025-12-21 09:41:24.487180 | 6 | 12 |
| 20 | 2025-12-21 09:41:31.265869 | 7 | 12 |
| 21 | 2025-12-21 09:41:37.863204 | 8 | 12 |
| 22 | 2025-12-21 09:41:42.958432 | 9 | 12 |
| 23 | 2025-12-21 10:20:24.414272 | 2 | 22 |
| 24 | 2025-12-21 10:20:34.272225 | 3 | 22 |
| 25 | 2025-12-21 10:20:39.551945 | 4 | 22 |
| 26 | 2025-12-21 10:20:47.174528 | 5 | 22 |
| 27 | 2025-12-21 10:20:53.383502 | 6 | 22 |
| 28 | 2025-12-21 10:20:59.826002 | 7 | 22 |
| 29 | 2025-12-21 10:21:05.503444 | 8 | 22 |
| 30 | 2025-12-21 10:21:13.775357 | 9 | 22 |
| 31 | 2025-12-21 13:43:31.717321 | 2 | 24 |
| 32 | 2025-12-21 13:43:39.269499 | 3 | 24 |
| 33 | 2025-12-21 13:43:48.392059 | 4 | 24 |
| 34 | 2025-12-21 13:45:40.605409 | 5 | 24 |
| 35 | 2025-12-21 13:45:48.980903 | 6 | 24 |
| 36 | 2025-12-21 13:45:58.040027 | 7 | 24 |
| 37 | 2025-12-21 13:46:12.222358 | 8 | 24 |
| 38 | 2025-12-21 13:46:23.164906 | 9 | 24 |
| 39 | 2025-12-21 14:01:49.507799 | 2 | 29 |
| 40 | 2025-12-21 14:01:57.732192 | 3 | 29 |
| 41 | 2025-12-21 14:06:49.293184 | 4 | 29 |
| 42 | 2025-12-21 14:07:10.875070 | 5 | 29 |
| 43 | 2025-12-21 14:07:18.645888 | 6 | 29 |
| 44 | 2025-12-21 14:07:25.529629 | 7 | 29 |
| 45 | 2025-12-21 14:07:33.453123 | 8 | 29 |
| 46 | 2025-12-21 14:07:43.673462 | 9 | 29 |
| 47 | 2025-12-21 14:22:03.591266 | 2 | 25 |
| 48 | 2025-12-21 14:22:12.068480 | 3 | 25 |
| 49 | 2025-12-21 14:22:17.620451 | 4 | 25 |
| 50 | 2025-12-21 14:22:22.987441 | 5 | 25 |
| 51 | 2025-12-21 14:22:30.202740 | 6 | 25 |
| 52 | 2025-12-21 14:22:36.086071 | 7 | 25 |
| 53 | 2025-12-21 14:22:46.981732 | 8 | 25 |
| 54 | 2025-12-21 14:22:56.573686 | 9 | 25 |
| 55 | 2025-12-21 14:34:03.353521 | 2 | 27 |
| 56 | 2025-12-21 14:34:08.211282 | 3 | 27 |
| 57 | 2025-12-21 14:34:14.912476 | 4 | 27 |
| 58 | 2025-12-21 14:34:20.196318 | 5 | 27 |
| 59 | 2025-12-21 14:34:26.571102 | 6 | 27 |
| 60 | 2025-12-21 14:34:36.151504 | 7 | 27 |
| 61 | 2025-12-21 14:34:48.470588 | 8 | 27 |
| 62 | 2025-12-21 14:34:54.064647 | 9 | 27 |
| 63 | 2025-12-21 15:03:39.627602 | 2 | 9 |
| 64 | 2025-12-21 15:03:46.241312 | 3 | 9 |
| 65 | 2025-12-21 15:03:59.471700 | 4 | 9 |
| 66 | 2025-12-21 15:04:09.494287 | 5 | 9 |
| 67 | 2025-12-21 15:04:17.219758 | 6 | 9 |
| 68 | 2025-12-21 15:04:23.788610 | 7 | 9 |
| 69 | 2025-12-21 15:04:30.808690 | 8 | 9 |
| 70 | 2025-12-21 15:04:40.037515 | 9 | 9 |
| 71 | 2025-12-21 15:19:28.082415 | 2 | 14 |
| 72 | 2025-12-21 15:19:33.772212 | 3 | 14 |
| 73 | 2025-12-21 15:19:38.927751 | 4 | 14 |
| 74 | 2025-12-21 15:19:44.177942 | 5 | 14 |
| 75 | 2025-12-21 15:19:55.651493 | 6 | 14 |
| 76 | 2025-12-21 15:20:06.081757 | 8 | 14 |
| 77 | 2025-12-21 15:20:17.002055 | 9 | 14 |
| 78 | 2025-12-21 15:21:15.606326 | 7 | 14 |
| 79 | 2025-12-21 15:43:56.396675 | 2 | 8 |
| 80 | 2025-12-21 15:44:06.181752 | 3 | 8 |
| 81 | 2025-12-21 15:44:14.117236 | 5 | 8 |
| 82 | 2025-12-21 15:44:20.520646 | 6 | 8 |
| 83 | 2025-12-21 15:44:27.256141 | 7 | 8 |
| 84 | 2025-12-21 15:44:35.596497 | 8 | 8 |
| 85 | 2025-12-21 15:44:42.106028 | 9 | 8 |
| 86 | 2025-12-21 15:45:13.080704 | 4 | 8 |
| 87 | 2025-12-21 16:01:44.926619 | 2 | 18 |
| 88 | 2025-12-21 16:01:52.088966 | 3 | 18 |
| 89 | 2025-12-21 16:02:01.745160 | 4 | 18 |
| 90 | 2025-12-21 16:02:09.289076 | 5 | 18 |
| 91 | 2025-12-21 16:02:18.060420 | 6 | 18 |
| 92 | 2025-12-21 16:02:26.468760 | 7 | 18 |
| 93 | 2025-12-21 16:02:33.405327 | 8 | 18 |
| 94 | 2025-12-21 16:02:41.015312 | 9 | 18 |
| 95 | 2025-12-21 16:23:12.898398 | 2 | 11 |
| 96 | 2025-12-21 16:23:19.248049 | 3 | 11 |
| 97 | 2025-12-21 16:23:37.598364 | 5 | 11 |
| 98 | 2025-12-21 16:23:46.076164 | 6 | 11 |
| 99 | 2025-12-21 16:23:51.775016 | 7 | 11 |
| 100 | 2025-12-21 16:24:01.977603 | 8 | 11 |
| 101 | 2025-12-21 16:24:11.195539 | 9 | 11 |
| 102 | 2025-12-22 05:59:59.990882 | 2 | 31 |
| ... (136 more rows hidden) | |  |  | 

---

## System Framework (Django Internals)

### Table: `django_migrations`
**Rows**: 21 | **Columns**: 4

| id | app | name | applied |
| --- | --- | --- | --- |
| 1 | contenttypes | 0001_initial | 2025-12-03 15:31:05.644831 |
| 2 | auth | 0001_initial | 2025-12-03 15:31:07.147291 |
| 3 | admin | 0001_initial | 2025-12-03 15:31:07.518092 |
| 4 | admin | 0002_logentry_remove_auto_add | 2025-12-03 15:31:07.533943 |
| 5 | admin | 0003_logentry_add_action_flag_choices | 2025-12-03 15:31:07.548449 |
| 6 | api | 0001_initial | 2025-12-03 15:31:10.058756 |
| 7 | api | 0002_lencana_jenis_lencana_syarat_quiz_count | 2025-12-03 15:31:10.293277 |
| 8 | contenttypes | 0002_remove_content_type_name | 2025-12-03 15:31:10.547099 |
| 9 | auth | 0002_alter_permission_name_max_length | 2025-12-03 15:31:10.693504 |
| 10 | auth | 0003_alter_user_email_max_length | 2025-12-03 15:31:10.732974 |
| 11 | auth | 0004_alter_user_username_opts | 2025-12-03 15:31:10.747237 |
| 12 | auth | 0005_alter_user_last_login_null | 2025-12-03 15:31:10.879274 |
| 13 | auth | 0006_require_contenttypes_0002 | 2025-12-03 15:31:10.887042 |
| 14 | auth | 0007_alter_validators_add_error_messages | 2025-12-03 15:31:10.900770 |
| 15 | auth | 0008_alter_user_username_max_length | 2025-12-03 15:31:11.049982 |
| 16 | auth | 0009_alter_user_last_name_max_length | 2025-12-03 15:31:11.217685 |
| 17 | auth | 0010_alter_group_name_max_length | 2025-12-03 15:31:11.264312 |
| 18 | auth | 0011_update_proxy_permissions | 2025-12-03 15:31:11.285619 |
| 19 | auth | 0012_alter_user_first_name_max_length | 2025-12-03 15:31:11.431455 |
| 20 | sessions | 0001_initial | 2025-12-03 15:31:11.525454 |
| 21 | api | 0003_materi_pdf_file_profilsiswa_kelas_profilsi... | 2025-12-13 16:52:29.817226 |

---

### Table: `django_content_type`
**Rows**: 16 | **Columns**: 3

| id | app_label | model |
| --- | --- | --- |
| 1 | admin | logentry |
| 9 | api | aktivitas |
| 12 | api | hasilaktivitas |
| 10 | api | lencana |
| 16 | api | lencanasiswa |
| 7 | api | materi |
| 15 | api | materiselesai |
| 8 | api | modul |
| 14 | api | pilihanjawaban |
| 11 | api | profilsiswa |
| 13 | api | soalpilihanganda |
| 3 | auth | group |
| 2 | auth | permission |
| 4 | auth | user |
| 5 | contenttypes | contenttype |
| 6 | sessions | session |

---

### Table: `django_admin_log`
**Rows**: 1505 | **Columns**: 8

| id | action_time | object_id | object_repr | action_flag | change_message | content_type_id | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2025-12-04 09:12:33.740908 | 1 | tes | 3 |  | 8 | 2 |
| 2 | 2025-12-04 09:13:00.814258 | 2 | tes | 2 | [{"changed": {"fields": ["Judul", "Deskripsi"]}}] | 8 | 2 |
| 3 | 2025-12-04 09:13:18.039121 | 2 | tes | 3 |  | 8 | 2 |
| 4 | 2025-12-04 09:14:09.235989 | 1 | pacar terkeren | 3 |  | 10 | 2 |
| 5 | 2025-12-04 09:19:53.026169 | 6 | Jaringan Komputer dan Internet (JKI) | 2 | [{"changed": {"fields": ["Urutan"]}}] | 8 | 2 |
| 6 | 2025-12-04 09:21:29.615252 | 5 | Teknologi Informasi dan Komunikasi (TIK) | 2 | [{"changed": {"fields": ["Urutan"]}}] | 8 | 2 |
| 7 | 2025-12-04 09:21:54.079043 | 7 | Analisis Data (AD) | 2 | [{"changed": {"fields": ["Urutan"]}}] | 8 | 2 |
| 8 | 2025-12-04 09:22:23.390171 | 8 | Algoritma dan Pemrograman (AP) | 2 | [{"changed": {"fields": ["Urutan"]}}] | 8 | 2 |
| 9 | 2025-12-04 09:22:52.123713 | 9 | Sistem Komputer (SK) | 1 | [{"added": {}}] | 8 | 2 |
| 10 | 2025-12-04 09:36:14.210463 | 9 | Digital Society Observer | 1 | [{"added": {}}] | 10 | 2 |
| 11 | 2025-12-04 09:37:03.592510 | 10 | Dampak Sosial Informatika (DSI) | 2 | [{"changed": {"fields": ["Urutan"]}}] | 8 | 2 |
| 12 | 2025-12-07 13:09:44.344721 | 11 | sdfgh | 3 |  | 8 | 2 |
| 13 | 2025-12-07 13:09:52.544963 | 12 | erty | 3 |  | 8 | 2 |
| 14 | 2025-12-07 13:11:31.958245 | 6 | Berpikir Komputasional (BK) - zxcv | 3 |  | 7 | 2 |
| 15 | 2025-12-07 13:12:02.225563 | 5 | Pengantar Informatika & Keterampilan Generik - ... | 2 | [{"changed": {"fields": ["Konten narasi", "Urut... | 7 | 2 |
| 16 | 2025-12-07 13:12:54.497882 | 5 | erthjk | 3 |  | 13 | 2 |
| 17 | 2025-12-07 13:13:04.200499 | 4 | asdfghjkl | 3 |  | 13 | 2 |
| 18 | 2025-12-07 13:13:13.287869 | 3 | Aktivitas untuk: Keterampilan Generik | 3 |  | 9 | 2 |
| 19 | 2025-12-07 16:48:19.429142 | 9 | Berpikir Komputasional (BK) - Pengurutan (Sorting) | 2 | [{"changed": {"fields": ["Konten narasi", "Urut... | 7 | 2 |
| 20 | 2025-12-07 16:48:30.675448 | 10 | Berpikir Komputasional (BK) - Struktur Data Dasar | 2 | [{"changed": {"fields": ["Konten narasi", "Urut... | 7 | 2 |
| 21 | 2025-12-07 16:48:40.092008 | 13 | Teknologi Informasi dan Komunikasi (TIK) - Fitu... | 2 | [{"changed": {"fields": ["Konten narasi", "Urut... | 7 | 2 |
| 22 | 2025-12-07 16:48:48.682670 | 21 | Jaringan Komputer dan Internet (JKI) - Komunika... | 2 | [{"changed": {"fields": ["Konten narasi", "Urut... | 7 | 2 |
| 23 | 2025-12-07 17:30:20.135084 | 5 | Aktivitas untuk: Struktur Data Dasar | 3 |  | 9 | 2 |
| 24 | 2025-12-07 18:50:41.786508 | 80 | Alat bantu (IDE) online dari Google yang memung... | 1 | [{"added": {}}, {"added": {"name": "pilihan jaw... | 13 | 2 |
| 25 | 2025-12-07 18:52:34.024333 | 81 | Bahasa pemrograman yang populer untuk analisis ... | 1 | [{"added": {}}, {"added": {"name": "pilihan jaw... | 13 | 2 |
| 26 | 2025-12-07 18:53:43.866572 | 80 | Alat bantu (IDE) online dari Google yang memung... | 2 | [] | 13 | 2 |
| 27 | 2025-12-07 18:53:50.989392 | 81 | Bahasa pemrograman yang populer untuk analisis ... | 2 | [] | 13 | 2 |
| 28 | 2025-12-07 19:27:17.958464 | 11 | Aktivitas untuk: Pengantar Pemrograman | 2 | [{"changed": {"fields": ["Materi"]}}] | 9 | 2 |
| 29 | 2025-12-07 19:31:41.293811 | 14 | Aktivitas untuk: Dasar Bahasa C | 2 | [{"changed": {"fields": ["Validasi html"]}}] | 9 | 2 |
| 30 | 2025-12-07 19:34:07.036455 | 14 | Aktivitas untuk: Dasar Bahasa C | 2 | [{"changed": {"fields": ["Validasi html"]}}] | 9 | 2 |
| 31 | 2025-12-07 19:36:14.754097 | 14 | Aktivitas untuk: Dasar Bahasa C | 2 | [{"changed": {"fields": ["Validasi html"]}}] | 9 | 2 |
| 32 | 2025-12-07 19:37:03.484506 | 14 | Aktivitas untuk: Dasar Bahasa C | 2 | [{"changed": {"fields": ["Validasi html"]}}] | 9 | 2 |
| 33 | 2025-12-07 20:20:50.846898 | 10 | Aktivitas untuk: Dasar Python untuk Analisis Data | 2 | [{"changed": {"fields": ["Materi", "Instruksi"]}}] | 9 | 2 |
| 34 | 2025-12-07 20:22:40.291706 | 10 | Aktivitas untuk: Proses Analisis Data | 2 | [{"changed": {"fields": ["Materi"]}}] | 9 | 2 |
| 35 | 2025-12-15 14:32:35.751180 | 7 | Profil dari Fathan | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 36 | 2025-12-15 14:32:44.335226 | 7 | Profil dari Fathan | 2 | [] | 11 | 2 |
| 37 | 2025-12-15 14:33:13.185146 | 10 | Profil dari soni22 | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 38 | 2025-12-15 14:33:23.242681 | 12 | Profil dari lutfi | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 39 | 2025-12-15 14:33:34.956649 | 13 | Profil dari R4hma | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 40 | 2025-12-15 14:33:45.019582 | 14 | Profil dari Syafa_Ayu_Fitriana | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 41 | 2025-12-15 14:33:59.136128 | 15 | Profil dari Rahmawati | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 42 | 2025-12-15 14:34:16.552939 | 16 | Profil dari aldojumhana | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 43 | 2025-12-15 14:34:33.809114 | 17 | Profil dari R4hm4w4ti | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 44 | 2025-12-15 14:36:43.532455 | 18 | Profil dari intan_nuraeni_15 | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 45 | 2025-12-15 14:36:57.023074 | 19 | Profil dari NazwatulJanah | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 46 | 2025-12-15 14:37:06.056344 | 23 | Profil dari Nazwatul_Janah | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 47 | 2025-12-15 14:37:14.483869 | 23 | Profil dari Nazwatul_Janah | 2 | [] | 11 | 2 |
| 48 | 2025-12-15 14:37:23.884117 | 22 | Profil dari ChikaMaharani | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 49 | 2025-12-15 14:37:33.499643 | 19 | Profil dari NazwatulJanah | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 50 | 2025-12-15 14:37:52.721850 | 20 | Profil dari rahma | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 51 | 2025-12-15 14:38:15.091818 | 21 | Profil dari ucok | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 52 | 2025-12-15 14:38:45.548605 | 22 | Profil dari ChikaMaharani | 2 | [] | 11 | 2 |
| 53 | 2025-12-15 14:38:54.812133 | 23 | Profil dari Nazwatul_Janah | 2 | [] | 11 | 2 |
| 54 | 2025-12-15 14:40:18.617407 | 24 | Profil dari Tinta_permatasari | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 55 | 2025-12-15 14:40:28.031240 | 25 | Profil dari Andini | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 56 | 2025-12-15 14:40:47.559964 | 26 | Profil dari sitinurholifah | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 57 | 2025-12-15 14:41:17.976612 | 27 | Profil dari tasya | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 58 | 2025-12-15 14:41:34.109401 | 28 | Profil dari shinta25 | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 59 | 2025-12-15 14:41:41.907020 | 29 | Profil dari erdi | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 60 | 2025-12-15 14:41:54.423150 | 30 | Profil dari salwaamalia | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 61 | 2025-12-15 14:42:04.018685 | 31 | Profil dari sitimutiya | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 62 | 2025-12-15 14:42:11.426978 | 32 | Profil dari sitinurhol1f4h | 2 | [] | 11 | 2 |
| 63 | 2025-12-15 14:42:19.579581 | 33 | Profil dari BayuNugraha | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 64 | 2025-12-15 14:42:23.358553 | 34 | Profil dari shinta25_ | 2 | [] | 11 | 2 |
| 65 | 2025-12-15 14:42:36.673098 | 35 | Profil dari NazwatulJanah_ | 2 | [] | 11 | 2 |
| 66 | 2025-12-15 14:42:42.649055 | 36 | Profil dari Rahma123 | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 67 | 2025-12-15 14:43:12.315586 | 11 | Profil dari Epankausep23 | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 68 | 2025-12-21 08:10:37.172765 | 50 | Hasil Keamanan Data di Internet oleh testing | 1 | [{"added": {}}] | 12 | 2 |
| 69 | 2025-12-21 08:11:21.435093 | 50 | Hasil Keamanan Data di Internet oleh testing | 3 |  | 12 | 2 |
| 70 | 2025-12-21 08:12:19.731314 | 48 | MateriSelesai object (48) | 1 | [{"added": {}}] | 15 | 2 |
| 71 | 2025-12-21 08:31:50.006561 | 13 | mencoba | 3 |  | 8 | 2 |
| 72 | 2025-12-21 08:31:56.383086 | 14 | testing | 3 |  | 8 | 2 |
| 73 | 2025-12-21 08:55:20.177043 | 35 | Naswa_Ramdhani09 | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 74 | 2025-12-21 08:56:10.481404 | 19 | Nazwa_F4tmaliiaa | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 75 | 2025-12-21 08:56:12.722471 | 19 | Profil dari Nazwa_F4tmaliiaa | 2 | [] | 11 | 2 |
| 76 | 2025-12-21 08:56:42.567366 | 17 | Rahmaliya03 | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 77 | 2025-12-21 08:57:33.832106 | 13 | Ratna_puspitasari | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 78 | 2025-12-21 08:58:01.157233 | 20 | restaan | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 79 | 2025-12-21 08:58:20.743076 | 36 | RahayuAJ | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 80 | 2025-12-21 08:59:20.178573 | 21 | Raden_Saepulloh | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 81 | 2025-12-21 08:59:43.574231 | 32 | sitinurhol1l4h | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 82 | 2025-12-21 09:00:47.525786 | 9 | Trisna_rivald00 | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 83 | 2025-12-21 09:01:06.352306 | 9 | Trisna_rivald0 | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 84 | 2025-12-21 09:02:13.555975 | 9 | Triasna_rivald0 | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 85 | 2025-12-21 09:02:34.086920 | 9 | Rivald00 | 2 | [{"changed": {"fields": ["Username"]}}] | 4 | 2 |
| 86 | 2025-12-21 09:03:01.023987 | 1 | Profil dari AloDeAlfonsoo | 3 |  | 11 | 2 |
| 87 | 2025-12-21 09:03:17.870273 | 6 | Profil dari Carlo | 3 |  | 11 | 2 |
| 88 | 2025-12-21 09:05:03.628877 | 5 | Profil dari user_testing | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 89 | 2025-12-21 09:05:21.133007 | 3 | Profil dari testing | 2 | [{"changed": {"fields": ["Kelas"]}}] | 11 | 2 |
| 90 | 2025-12-21 09:07:27.343046 | 50 | MateriSelesai object (50) | 1 | [{"added": {}}] | 15 | 2 |
| 91 | 2025-12-21 09:09:25.203854 | 51 | MateriSelesai object (51) | 1 | [{"added": {}}] | 15 | 2 |
| 92 | 2025-12-21 09:09:53.853815 | 52 | MateriSelesai object (52) | 1 | [{"added": {}}] | 15 | 2 |
| 93 | 2025-12-21 09:10:03.562441 | 53 | MateriSelesai object (53) | 1 | [{"added": {}}] | 15 | 2 |
| 94 | 2025-12-21 09:10:15.976892 | 54 | MateriSelesai object (54) | 1 | [{"added": {}}] | 15 | 2 |
| 95 | 2025-12-21 09:10:29.700256 | 55 | MateriSelesai object (55) | 1 | [{"added": {}}] | 15 | 2 |
| 96 | 2025-12-21 09:10:37.119436 | 56 | MateriSelesai object (56) | 1 | [{"added": {}}] | 15 | 2 |
| 97 | 2025-12-21 09:10:48.030542 | 57 | MateriSelesai object (57) | 1 | [{"added": {}}] | 15 | 2 |
| 98 | 2025-12-21 09:11:06.936357 | 58 | MateriSelesai object (58) | 1 | [{"added": {}}] | 15 | 2 |
| 99 | 2025-12-21 09:11:16.676938 | 59 | MateriSelesai object (59) | 1 | [{"added": {}}] | 15 | 2 |
| 100 | 2025-12-21 09:11:33.831050 | 60 | MateriSelesai object (60) | 1 | [{"added": {}}] | 15 | 2 |
| ... (1405 more rows hidden) | |  |  |  |  |  |  | 

---

### Table: `django_session`
**Rows**: 5 | **Columns**: 3

| session_key | session_data | expire_date |
| --- | --- | --- |
| 7yaa9f6mrs86a2kj8jqplxiugsck0rjj | .eJxVjMEOwiAQRP-FsyHsQi169N5vIMsCUjWQlPZk_HdL0o... | 2026-01-25 13:09:10.784451 |
| abzzxtv5ng7hpknv4phzzkernwvf5y49 | .eJxVjMEOwiAQRP-FsyHsQi169N5vIMsCUjWQlPZk_HdL0o... | 2025-12-17 17:12:28.015126 |
| olpqxj9soull3j189zuoyom9t43tjxjp | .eJxVjMEOwiAQRP-FsyHsQi169N5vIMsCUjWQlPZk_HdL0o... | 2026-01-04 08:08:09.078083 |
| p1v3sbypdvru3p9ti5n8f2le4zw7lijv | .eJxVjMEOwiAQRP-FsyHsQi169N5vIMsCUjWQlPZk_HdL0o... | 2025-12-18 09:12:04.495567 |
| wtyllark4qunsjwlhttgtbrs66i1gsge | .eJxVjMEOwiAQRP-FsyHsQi169N5vIMsCUjWQlPZk_HdL0o... | 2025-12-18 09:11:16.318710 |

---

