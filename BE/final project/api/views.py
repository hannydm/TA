# api/views.py

# --- IMPORTS ---
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

from .serializers import (
    RegisterSerializer,
    ModulListSerializer,
    ModulDetailSerializer,
    MateriSerializer,
    AktivitasSerializer,
    ProfilSiswaSerializer,
    SubmitSkorSerializer,
    LencanaSerializer,
    LencanaSiswaSerializer,
    EmailOrUsernameTokenSerializer,
)

from .models import (
    Modul,
    Materi,
    Aktivitas,
    ProfilSiswa,
    HasilAktivitas,
    MateriSelesai,
    Lencana,
    LencanaSiswa,
)

from .serializers import SoalPilihanGandaSerializer
from .models import SoalPilihanGanda


class EmailOrUsernameTokenView(TokenObtainPairView):
    """
    View untuk login JWT menggunakan username atau email.
    """

    serializer_class = EmailOrUsernameTokenSerializer


@api_view(['POST']) # <-- 2. Ini hanya merespon method POST
@permission_classes([AllowAny]) # <-- 3. Izinkan siapapun untuk registrasi
def registrasi_view(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        data = {} # Siapkan dictionary kosong untuk respons
        
        if serializer.is_valid():
            user = serializer.save() # Panggil fungsi .save() di serializer
            data['response'] = "Registrasi berhasil!"
            data['username'] = user.username
            data['email'] = user.email
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            # Jika tidak valid, kirim error-nya
            data = serializer.errors
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])  # Endpoint ini bisa merespon GET dan PUT
@permission_classes([IsAuthenticated])  # WAJIB punya JWT untuk akses profil
def profil_view(request):
    # request.user selalu user dari token JWT
    profil, _ = ProfilSiswa.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = ProfilSiswaSerializer(profil, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # PUT: izinkan update avatar saja (level & total_poin tetap dikontrol backend)
    elif request.method == 'PUT':
        serializer = ProfilSiswaSerializer(
            instance=profil,
            data=request.data,
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def hello_world(request):
    # DIPERBAIKI: Baris ini salah tempat. Seharusnya ada di sini,
    # di dalam fungsi hello_world.
    return Response({'message': 'Halo, API Django Anda bekerja!'})


# 1. View untuk mengambil DAFTAR SEMUA modul
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daftar_modul_view(request):
    # DIPERBAIKI: Logika try/except di sini tidak perlu.
    # .all() tidak akan error jika hasilnya kosong. Ini akan 
    # mengembalikan list kosong [ ], yang merupakan perilaku API yg benar.
    semua_modul = Modul.objects.all().order_by('urutan') 
    serializer = ModulListSerializer(semua_modul, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# 2. View untuk mengambil DETAIL SATU modul (beserta materinya)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_modul_view(request, modul_id):
    modul = get_object_or_404(Modul, id=modul_id)
    serializer = ModulDetailSerializer(modul, many=False, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# 3. View untuk mengambil DETAIL SATU materi (beserta aktivitasnya)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_materi_view(request, materi_id):
    materi = get_object_or_404(Materi, id=materi_id)
    serializer = MateriSerializer(materi, many=False, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# 4. View untuk mengambil DETAIL SATU aktivitas (untuk halaman kuis/puzzle)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_aktivitas_view(request, aktivitas_id):
    aktivitas = get_object_or_404(Aktivitas, id=aktivitas_id)
    serializer = AktivitasSerializer(aktivitas, many=False) 
    return Response(serializer.data, status=status.HTTP_200_OK)
    
    # DIPERBAIKI: Baris 'return Response' yang salah
    # (yang seharusnya untuk hello_world) sudah dihapus dari sini.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_skor_view(request):
    # 1. Validasi data yang dikirim React
    serializer = SubmitSkorSerializer(data=request.data)
    if serializer.is_valid():
        # 2. Ambil data yang sudah divalidasi
        data = serializer.validated_data
        aktivitas_id = data['aktivitas_id']
        skor = data['skor']
        
        try:
            # 3. Ambil objek yang relevan
            profil = request.user.profilsiswa
            aktivitas = Aktivitas.objects.get(id=aktivitas_id)

            # 4. Buat catatan baru di database
            HasilAktivitas.objects.create(
                profil_siswa=profil,
                aktivitas=aktivitas,
                skor=skor
            )
            
            # 5. Update poin total pengguna
            profil.total_poin += skor
            
            # --- LOGIKA LEVEL UP ---
            # Progressive Leveling: Level N requires N * 100 XP to pass.
            # Formula: Level = floor(0.5 + sqrt(0.25 + XP / 50))
            import math
            level_sekarang = profil.level
            level_baru = int(0.5 + math.sqrt(0.25 + (profil.total_poin / 50)))
            
            naik_level = False
            if level_baru > level_sekarang:
                profil.level = level_baru
                naik_level = True
            
            profil.save()
            
            # --- LOGIKA BADGES ---
            # Badge hanya diberikan jika:
            # 1) aktivitas ini adalah quiz modul (PILIHAN_GANDA)
            # 2) seluruh materi di modul tersebut telah ditandai selesai oleh user
            modul = aktivitas.materi.modul
            lencana_baru = None
            try:
                lencana = Lencana.objects.get(modul_terkait=modul)

                # Hitung progres modul
                modul_materi_qs = modul.materi_set.all()
                total_materi = modul_materi_qs.count()
                selesai_count = MateriSelesai.objects.filter(
                    profil_siswa=profil,
                    materi__in=modul_materi_qs
                ).count()

                all_materials_done = total_materi > 0 and selesai_count == total_materi
                finished_quiz = aktivitas.tipe_aktivitas == 'PILIHAN_GANDA'

                if finished_quiz and all_materials_done:
                    if not LencanaSiswa.objects.filter(profil_siswa=profil, lencana=lencana).exists():
                        LencanaSiswa.objects.create(profil_siswa=profil, lencana=lencana)
                        lencana_baru = lencana.nama
            except Lencana.DoesNotExist:
                pass
            
            # 6. Kirim respons sukses
            return Response(
                {
                    "status": "sukses", 
                    "message": f"Skor {skor} XP ditambahkan!", 
                    "total_poin_baru": profil.total_poin,
                    "level_up": naik_level,
                    "new_level": level_baru if naik_level else None,
                    "new_badge": lencana_baru
                },
                status=status.HTTP_201_CREATED
            )
            
        except Aktivitas.DoesNotExist:
            return Response({"error": "Aktivitas tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # Jika data dari React tidak valid (misal, 'skor' bukan angka)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activity_view(request):
    """
    Mengambil aktivitas terbaru user:
    - Materi yang diselesaikan (MateriSelesai)
    - Kuis yang dikerjakan (HasilAktivitas)
    - Lencana yang didapat (LencanaSiswa)
    """
    profil = request.user.profilsiswa
    activities = []
    
    # 1. Materi Selesai
    materi_selesai = MateriSelesai.objects.filter(profil_siswa=profil).select_related('materi')
    for ms in materi_selesai:
        activities.append({
            'type': 'material',
            'title': f"Completed material: {ms.materi.judul}",
            'date': ms.tanggal_selesai,
            'xp': 10 # Asumsi base XP baca materi
        })
        
    # 2. Hasil Aktivitas (Kuis)
    hasil_kuis = HasilAktivitas.objects.filter(profil_siswa=profil).select_related('aktivitas', 'aktivitas__materi')
    for hk in hasil_kuis:
        activities.append({
            'type': 'quiz',
            'title': f"Completed quiz: {hk.aktivitas.materi.judul}",
            'date': hk.tanggal_pengerjaan,
            'xp': hk.skor
        })
        
    # 3. Lencana
    lencana_siswa = LencanaSiswa.objects.filter(profil_siswa=profil).select_related('lencana')
    for ls in lencana_siswa:
        activities.append({
            'type': 'badge',
            'title': f"Earned badge: {ls.lencana.nama}",
            'date': ls.tanggal_didapat,
            'xp': 0
        })
        
    # Sort by date descending
    activities.sort(key=lambda x: x['date'], reverse=True)
    
    # Ambil 5 teratas
    return Response(activities[:5], status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tandai_selesai_view(request):
    try:
        # Ambil materi_id dari body JSON yang dikirim React
        materi_id = request.data.get('materi_id')
        if not materi_id:
            return Response({"error": "materi_id diperlukan"}, status=status.HTTP_400_BAD_REQUEST)

        profil = request.user.profilsiswa
        materi = get_object_or_404(Materi, id=materi_id)

        # Gunakan get_or_create untuk menghindari duplikat
        obj, created = MateriSelesai.objects.get_or_create(
            profil_siswa=profil,
            materi=materi
        )

        if created:
            # LOGIC BARU: Jika materi ini TIDAK punya aktivitas (cuma bacaan),
            # beri poin otomatis (misal 10 XP) sebagai reward membaca.
            # Kita cek apakah materi ini punya aktivitas?
            has_activity = hasattr(materi, 'aktivitas') and materi.aktivitas is not None
            
            poin_added = 0
            if not has_activity:
                poin_reward = 10
                profil.total_poin += poin_reward
                profil.save()
                poin_added = poin_reward

            return Response({
                "status": "sukses", 
                "message": "Materi ditandai selesai",
                "xp_gained": poin_added
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "sukses", "message": "Materi sudah pernah ditandai selesai"}, status=status.HTTP_200_OK)

    except Materi.DoesNotExist:
        return Response({"error": "Materi tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard_view(request):
    """
    Mengirimkan 10 pengguna dengan total_poin tertinggi.
    """
    try:
        # 1. Ambil data, urutkan dari poin tertinggi, ambil 10 teratas
        leaderboard_data = ProfilSiswa.objects.all().order_by('-total_poin')[:10]
        
        # 2. Serialisasi data (many=True karena ini adalah daftar)
        serializer = ProfilSiswaSerializer(leaderboard_data, many=True)
        
        # 3. Kirim respons
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        # Tangani jika ada error tak terduga
        return Response(
            {"error": f"Terjadi kesalahan: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard_weekly_view(request):
    """
    Mengirimkan 10 pengguna dengan total XP TERTINGGI dalam 7 hari terakhir.
    Nilai XP mingguan dihitung dari penjumlahan HasilAktivitas.skor.
    """
    try:
        tujuh_hari_lalu = timezone.now() - timedelta(days=7)

        # Agregasi skor mingguan per profil_siswa dari HasilAktivitas
        agregat = (
            HasilAktivitas.objects
            .filter(tanggal_pengerjaan__gte=tujuh_hari_lalu)
            .values('profil_siswa')
            .annotate(total=Sum('skor'))
            .order_by('-total')[:10]
        )

        profil_ids = [row['profil_siswa'] for row in agregat]
        total_map = {row['profil_siswa']: row['total'] for row in agregat}

        profils = list(ProfilSiswa.objects.filter(id__in=profil_ids))
        # Urutkan sesuai total skor mingguan
        profils.sort(key=lambda p: total_map.get(p.id, 0), reverse=True)

        # Override total_poin sementara dengan XP mingguan
        for p in profils:
            p.total_poin = total_map.get(p.id, 0)

        serializer = ProfilSiswaSerializer(profils, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Terjadi kesalahan: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard_stats_view(request):
    """
    Statistik global sederhana untuk leaderboard:
    - total_explorers: jumlah ProfilSiswa
    - missions_completed: jumlah MateriSelesai
    - xp_today: total skor HasilAktivitas hari ini
    - active_now: jumlah profil yang punya aktivitas dalam 15 menit terakhir
    """
    try:
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        active_window = now - timedelta(minutes=15)

        total_explorers = ProfilSiswa.objects.count()
        missions_completed = MateriSelesai.objects.count()

        xp_today = (
            HasilAktivitas.objects
            .filter(tanggal_pengerjaan__gte=today_start)
            .aggregate(total=Sum('skor'))['total'] or 0
        )

        active_now = (
            HasilAktivitas.objects
            .filter(tanggal_pengerjaan__gte=active_window)
            .values('profil_siswa')
            .distinct()
            .count()
        )

        data = {
            'total_explorers': total_explorers,
            'missions_completed': missions_completed,
            'xp_today': xp_today,
            'active_now': active_now,
        }
        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Terjadi kesalahan: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def progress_summary_view(request):
    """
    Statistik progres spesifik untuk pengguna yang sedang login.
    Memastikan data misi dan XP tidak tercampur antar akun.
    """
    try:
        profil, _ = ProfilSiswa.objects.get_or_create(user=request.user)

        missions_completed = MateriSelesai.objects.filter(profil_siswa=profil).count()
        total_missions = Materi.objects.count()
        quizzes_completed = HasilAktivitas.objects.filter(profil_siswa=profil).count()
        badges_earned = LencanaSiswa.objects.filter(profil_siswa=profil).count()

        data = {
            "missions_completed": missions_completed,
            "total_missions": total_missions,
            "quizzes_completed": quizzes_completed,
            "badges_earned": badges_earned,
            "level": profil.level,
            "total_poin": profil.total_poin,
        }

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Terjadi kesalahan: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daftar_lencana_view(request):
    try:
        # DIPERBAIKI: Urutkan berdasarkan 'nama' (field yang ada)
        semua_lencana = Lencana.objects.all().order_by('nama') 
        serializer = LencanaSerializer(semua_lencana, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 2. View untuk mengambil LENCANA YANG DIMILIKI PENGGUNA
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lencana_saya_view(request):
    """
    Mengirimkan daftar lencana yang dimiliki oleh pengguna yang sedang login.
    """
    try:
        profil = request.user.profilsiswa
        lencana_dimiliki = LencanaSiswa.objects.filter(profil_siswa=profil)
        
        serializer = LencanaSiswaSerializer(lencana_dimiliki, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except ProfilSiswa.DoesNotExist:
        return Response({"error": "Profil tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daftar_quiz_view(request):
    """
    Mengirimkan daftar aktivitas bertipe PILIHAN_GANDA
    lengkap dengan soal dan pilihan jawabannya.
    """
    aktivitas_list = Aktivitas.objects.filter(tipe_aktivitas='PILIHAN_GANDA')
    serializer = AktivitasSerializer(aktivitas_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
