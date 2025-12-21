# api/views.py

# --- IMPORTS ---
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Max
from django.urls import reverse
import mimetypes

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
from .models import SoalPilihanGanda, PilihanJawaban


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

@api_view(['GET'])  # Endpoint ini sekarang hanya untuk baca profil
@permission_classes([IsAuthenticated])  # WAJIB punya JWT untuk akses profil
def profil_view(request):
    # request.user selalu user dari token JWT
    profil, _ = ProfilSiswa.objects.get_or_create(user=request.user)
    serializer = ProfilSiswaSerializer(profil, many=False, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def profil_update_view(request):
    """
    Update field sederhana pada profil siswa yang bisa diedit sendiri,
    saat ini: NISN dan kelas.

    Body (JSON):
      - nisn  : string (opsional)
      - kelas : string (opsional)

    Jika dikirim string kosong, nilai akan di-set ke NULL.
    """
    profil, _ = ProfilSiswa.objects.get_or_create(user=request.user)

    nisn = request.data.get('nisn', None)
    kelas = request.data.get('kelas', None)

    changed = False

    if nisn is not None:
        profil.nisn = (str(nisn).strip() or None)
        changed = True

    if kelas is not None:
        profil.kelas = (str(kelas).strip() or None)
        changed = True

    if changed:
        profil.save()

    serializer = ProfilSiswaSerializer(profil, many=False, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profil_avatar_upload_view(request):
    """
    Endpoint khusus untuk mengunggah / mengganti avatar profil.
    Diharapkan menerima FormData dengan field 'avatar'.
    """
    profil, _ = ProfilSiswa.objects.get_or_create(user=request.user)

    avatar_file = request.FILES.get('avatar')
    if avatar_file is None:
        return Response(
            {'avatar': ['File avatar tidak ditemukan dalam request.']},
            status=status.HTTP_400_BAD_REQUEST,
        )

    profil.avatar = avatar_file
    profil.save()

    serializer = ProfilSiswaSerializer(profil, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def profil_avatar_public_view(request, profil_id: int):
    """
    Endpoint publik untuk mengambil file avatar siswa.
    Tidak memakai autentikasi supaya bisa dipakai langsung di <img src="...">.
    """
    profil = get_object_or_404(ProfilSiswa, id=profil_id)

    if not profil.avatar or not profil.avatar.name:
        raise Http404("Avatar tidak ditemukan")

    filename = profil.avatar.name.lower().split('/')[-1]
    if filename in {'default.jpg', 'default.jpeg', 'default.png'}:
        # Placeholder default tidak mempunyai file fisik yang perlu dikirim.
        raise Http404("Avatar tidak ditemukan")

    try:
        file_handle = profil.avatar.open('rb')
    except Exception:
        raise Http404("Avatar tidak dapat dibuka")

    mime_type, _ = mimetypes.guess_type(profil.avatar.name)
    response = FileResponse(file_handle, content_type=mime_type or 'image/jpeg')
    response['Content-Length'] = profil.avatar.size
    return response

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

            # 4. Hitung XP yang benar-benar perlu ditambahkan.
            #    - Setiap aktivitas punya batas maksimum XP (aktivitas.poin).
            #    - Jika siswa mengulang quiz, XP hanya bertambah
            #      jika skor barunya LEBIH BAIK dari skor terbaik sebelumnya.
            #      (top-up sampai maksimum, tidak dobel setiap retake).
            max_poin = aktivitas.poin or skor

            # Cari skor terbaik sebelumnya untuk aktivitas ini
            best_before = (
                HasilAktivitas.objects
                .filter(profil_siswa=profil, aktivitas=aktivitas)
                .aggregate(best=Max('skor'))['best']
                or 0
            )

            # Batasi skor agar tidak melebihi max_poin
            best_before_capped = min(best_before, max_poin)
            new_score_capped = min(skor, max_poin)

            # XP tambahan hanya selisih dari skor terbaik sebelumnya
            xp_to_add = max(0, new_score_capped - best_before_capped)

            # Simpan hasil percobaan terbaru (skor yang sudah di-cap)
            HasilAktivitas.objects.create(
                profil_siswa=profil,
                aktivitas=aktivitas,
                skor=new_score_capped,
            )
            
            # 5. Update poin total pengguna (hanya delta, bukan skor penuh lagi)
            profil.total_poin += xp_to_add
            
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
            lencana_baru = None

            # 1) Badge MODULE_COMPLETE: semua materi modul selesai + quiz modul
            modul = aktivitas.materi.modul
            modul_materi_qs = modul.materi_set.all()
            total_materi = modul_materi_qs.count()
            selesai_count = MateriSelesai.objects.filter(
                profil_siswa=profil,
                materi__in=modul_materi_qs
            ).count()

            all_materials_done = total_materi > 0 and selesai_count == total_materi
            finished_quiz = aktivitas.tipe_aktivitas == 'PILIHAN_GANDA'

            if finished_quiz and all_materials_done:
                modul_badges = Lencana.objects.filter(
                    modul_terkait=modul,
                    jenis='MODULE_COMPLETE',
                )
                for lencana in modul_badges:
                    if not LencanaSiswa.objects.filter(
                        profil_siswa=profil,
                        lencana=lencana
                    ).exists():
                        LencanaSiswa.objects.create(
                            profil_siswa=profil,
                            lencana=lencana
                        )
                        lencana_baru = lencana.nama

            # 2) Badge QUIZ_COUNT: total quiz selesai >= syarat_quiz_count
            total_quiz = HasilAktivitas.objects.filter(profil_siswa=profil).count()
            quiz_badges = Lencana.objects.filter(
                jenis='QUIZ_COUNT'
            ).exclude(syarat_quiz_count__isnull=True)
            for lencana in quiz_badges:
                threshold = lencana.syarat_quiz_count or 0
                if total_quiz >= threshold and not LencanaSiswa.objects.filter(
                    profil_siswa=profil,
                    lencana=lencana
                ).exists():
                    LencanaSiswa.objects.create(profil_siswa=profil, lencana=lencana)
                    if not lencana_baru:
                        lencana_baru = lencana.nama

            # 6. Kirim respons sukses
            return Response(
                {
                    "status": "sukses", 
                    "message": f"Skor {xp_to_add} XP ditambahkan!", 
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
        activities.append(
            {
                "type": "material",
                "title": f"Completed material: {ms.materi.judul}",
                "date": ms.tanggal_selesai,
                "xp": 10,  # Asumsi base XP baca materi
            }
        )

    # 2. Hasil Aktivitas (Kuis) - hanya ambil percobaan terbaru per aktivitas
    hasil_kuis = (
        HasilAktivitas.objects.filter(profil_siswa=profil)
        .select_related("aktivitas", "aktivitas__materi")
        .order_by("-tanggal_pengerjaan")
    )
    seen_activities = set()
    for hk in hasil_kuis:
        if hk.aktivitas_id in seen_activities:
            continue
        seen_activities.add(hk.aktivitas_id)
        activities.append(
            {
                "type": "quiz",
                "title": f"Completed quiz: {hk.aktivitas.materi.judul}",
                "date": hk.tanggal_pengerjaan,
                "xp": hk.skor,
            }
        )

    # 3. Lencana
    lencana_siswa = LencanaSiswa.objects.filter(profil_siswa=profil).select_related('lencana')
    for ls in lencana_siswa:
        activities.append(
            {
                "type": "badge",
                "title": f"Earned badge: {ls.lencana.nama}",
                "date": ls.tanggal_didapat,
                "xp": 0,
            }
        )

    # Sort by date descending
    activities.sort(key=lambda x: x["date"], reverse=True)

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
        leaderboard_data = (
            ProfilSiswa.objects
            .filter(user__is_staff=False)
            .order_by('-total_poin')[:10]
        )
        
        # 2. Serialisasi data (many=True karena ini adalah daftar)
        serializer = ProfilSiswaSerializer(leaderboard_data, many=True, context={'request': request})
        
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
    Nilai XP mingguan dihitung dari HasilAktivitas dalam 7 hari terakhir.
    Untuk menjaga query tetap ringan dan aman di semua database,
    di sini kita cukup menjumlahkan seluruh skor yang tercatat
    (retake akan menambah kontribusi di papan peringkat, tetapi
    tidak mempengaruhi total_poin sebenarnya di profil siswa).
    """
    try:
        tujuh_hari_lalu = timezone.now() - timedelta(days=7)

        # Agregasi skor mingguan per profil_siswa dari HasilAktivitas.
        # Catatan: di sini kita menjumlahkan semua skor retake.
        # Ini hanya dipakai untuk tampilan leaderboard mingguan,
        # bukan untuk menambah total_poin di profil.
        agregat = (
            HasilAktivitas.objects
            .filter(
                tanggal_pengerjaan__gte=tujuh_hari_lalu,
                profil_siswa__user__is_staff=False,
            )
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

        serializer = ProfilSiswaSerializer(profils, many=True, context={'request': request})
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

        total_explorers = ProfilSiswa.objects.filter(user__is_staff=False).count()
        missions_completed = MateriSelesai.objects.filter(profil_siswa__user__is_staff=False).count()

        # XP hari ini: jumlah skor TERBAIK per aktivitas yang dikerjakan hari ini.
        agregat_today_per_activity = (
            HasilAktivitas.objects
            .filter(
                tanggal_pengerjaan__gte=today_start,
                profil_siswa__user__is_staff=False,
            )
            .values('profil_siswa', 'aktivitas')
            .annotate(best=Max('skor'))
        )
        xp_today = agregat_today_per_activity.aggregate(total=Sum('best'))['total'] or 0

        active_now = (
            HasilAktivitas.objects
            .filter(
                tanggal_pengerjaan__gte=active_window,
                profil_siswa__user__is_staff=False,
            )
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

        # XP yang didapat HARI INI untuk user ini saja.
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        agregat_today_per_activity = (
            HasilAktivitas.objects
            .filter(
                profil_siswa=profil,
                tanggal_pengerjaan__gte=today_start,
            )
            .values('aktivitas')
            .annotate(best=Max('skor'))
        )
        xp_today = agregat_today_per_activity.aggregate(total=Sum('best'))['total'] or 0

        data = {
            "missions_completed": missions_completed,
            "total_missions": total_missions,
            "quizzes_completed": quizzes_completed,
            "badges_earned": badges_earned,
            "level": profil.level,
            "total_poin": profil.total_poin,
            "xp_today": xp_today,
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quiz_overall_summary_view(request):
    """
    Rangkuman hasil belajar dari SEMUA kuis pilihan ganda
    untuk siswa yang sedang login.

    Menggunakan HasilAktivitas:
      - total_quiz_attempts : berapa kali kuis dikerjakan (termasuk retake)
      - distinct_quizzes    : berapa aktivitas kuis yang sudah pernah dicoba
      - total_score         : total skor/XP yang pernah dicatat dari semua kuis
      - average_score       : rata‑rata skor per attempt
    """
    profil = request.user.profilsiswa

    hasil_qs = (
        HasilAktivitas.objects
        .filter(
            profil_siswa=profil,
            aktivitas__tipe_aktivitas='PILIHAN_GANDA',
        )
    )

    total_attempts = hasil_qs.count()
    total_score = hasil_qs.aggregate(total=Sum('skor'))['total'] or 0
    avg_score = total_score / total_attempts if total_attempts > 0 else 0

    distinct_quizzes = (
        hasil_qs.values('aktivitas')
        .distinct()
        .count()
    )

    data = {
        "total_attempts": total_attempts,
        "distinct_quizzes": distinct_quizzes,
        "total_score": total_score,
        "average_score": avg_score,
    }
    return Response(data, status=status.HTTP_200_OK)


# =========================
#  TEACHER / GURU ENDPOINTS
# =========================


@api_view(['GET'])
@permission_classes([IsAdminUser])
def teacher_students_overview_view(request):
  """
  Panel guru: ringkasan semua siswa beserta level, XP, dan jumlah misi/quiz.
  Hanya bisa diakses oleh user yang is_staff = True (guru/admin).
  """
  profils = (
      ProfilSiswa.objects.select_related('user')
      .filter(user__is_staff=False)
      .order_by('-total_poin')
  )

  data = []
  for profil in profils:
      missions_completed = MateriSelesai.objects.filter(profil_siswa=profil).count()
      quizzes_completed = HasilAktivitas.objects.filter(profil_siswa=profil).count()

      user = profil.user
      full_name = f"{user.first_name} {user.last_name}".strip() or user.username

      avatar_url = None
      # Untuk panel guru kita gunakan endpoint avatar publik yang sama
      # seperti halaman profil siswa, sehingga URL selalu berupa /api/...
      # dan tidak tergantung pada konfigurasi /media di nginx.
      if profil.avatar and profil.avatar.name:
          filename = profil.avatar.name.lower().split("/")[-1]
          if filename not in {"default.jpg", "default.jpeg", "default.png"}:
              try:
                  avatar_url = request.build_absolute_uri(
                      reverse("profil-avatar-public", args=[profil.id])
                  )
              except Exception:
                  avatar_url = None

      data.append(
          {
              "id": profil.id,
              "username": user.username,
              "full_name": full_name,
              "email": user.email,
              "nisn": profil.nisn,
              "kelas": profil.kelas,
              "level": profil.level,
              "total_poin": profil.total_poin,
              "missions_completed": missions_completed,
              "quizzes_completed": quizzes_completed,
              "avatar": avatar_url,
          }
      )

  return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def teacher_student_detail_view(request, profil_id: int):
  """
  Detail progres satu siswa:
  - profil (nama, level, XP)
  - progres per modul (jumlah materi & selesai)
  - ringkasan quiz (total, rata-rata skor, riwayat terakhir)
  """
  profil = get_object_or_404(ProfilSiswa, id=profil_id)

  # Modul progress
  modules_data = []
  modules = Modul.objects.all().order_by('urutan')
  for modul in modules:
      materi_qs = Materi.objects.filter(modul=modul)
      total_materi = materi_qs.count()
      selesai = MateriSelesai.objects.filter(
          profil_siswa=profil, materi__in=materi_qs
      ).count()

      modules_data.append(
          {
              "id": modul.id,
              "judul": modul.judul,
              "total_materi": total_materi,
              "materi_selesai": selesai,
          }
      )

  # Quiz history
  hasil_qs = (
      HasilAktivitas.objects.filter(profil_siswa=profil)
      .select_related('aktivitas__materi')
      .order_by('-tanggal_pengerjaan')
  )
  total_quiz = hasil_qs.count()
  total_skor = hasil_qs.aggregate(total=Sum('skor'))['total'] or 0
  avg_skor = total_skor / total_quiz if total_quiz > 0 else 0

  recent_quizzes = []
  for h in hasil_qs[:10]:
      recent_quizzes.append(
          {
              "id": h.id,
              "aktivitas_id": h.aktivitas_id,
              "materi_judul": getattr(h.aktivitas.materi, "judul", ""),
              "skor": h.skor,
              "tanggal": h.tanggal_pengerjaan,
          }
      )

  user = profil.user
  full_name = f"{user.first_name} {user.last_name}".strip() or user.username

  avatar_url = None
  if profil.avatar and profil.avatar.name:
      filename = profil.avatar.name.lower().split("/")[-1]
      if filename not in {"default.jpg", "default.jpeg", "default.png"}:
          try:
              avatar_url = request.build_absolute_uri(
                  reverse("profil-avatar-public", args=[profil.id])
              )
          except Exception:
              avatar_url = None

  badges_qs = (
      LencanaSiswa.objects.filter(profil_siswa=profil)
      .select_related('lencana')
      .order_by('-tanggal_didapat')
  )
  badges_data = []
  for ls in badges_qs:
      badges_data.append(
          {
              "id": ls.lencana.id,
              "nama": ls.lencana.nama,
              "deskripsi": ls.lencana.deskripsi,
              "tanggal_didapat": ls.tanggal_didapat,
          }
      )

  data = {
      "id": profil.id,
      "username": user.username,
      "full_name": full_name,
      "email": user.email,
      "nisn": profil.nisn,
      "kelas": profil.kelas,
      "level": profil.level,
      "total_poin": profil.total_poin,
      "modules": modules_data,
      "quizzes_total": total_quiz,
      "quizzes_avg_score": avg_skor,
      "recent_quizzes": recent_quizzes,
      "avatar": avatar_url,
      "badges": badges_data,
  }

  return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def teacher_list_view(request):
  """
  Daftar semua akun guru (is_staff=True) untuk ditampilkan di panel.
  """
  from django.contrib.auth.models import User

  teachers = User.objects.filter(is_staff=True).order_by('username')
  data = []
  for u in teachers:
      full_name = f"{u.first_name} {u.last_name}".strip() or u.username
      data.append(
          {
              "username": u.username,
              "full_name": full_name,
              "email": u.email,
          }
      )
  return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def teacher_create_teacher_view(request):
  """
  Guru/admin membuat akun guru baru.

  Body minimal:
    - username (str)
    - email (str)
    - password (str)

  Opsional:
    - first_name (str)
    - last_name (str)
  """
  from django.contrib.auth.models import User
  from .models import ProfilSiswa

  username = (request.data.get('username') or '').strip()
  email = (request.data.get('email') or '').strip()
  password = request.data.get('password') or ''
  first_name = (request.data.get('first_name') or '').strip()
  last_name = (request.data.get('last_name') or '').strip()

  if not username or not email or not password:
      return Response(
          {"error": "Field 'username', 'email', dan 'password' wajib diisi."},
          status=status.HTTP_400_BAD_REQUEST,
      )

  if User.objects.filter(username=username).exists():
      return Response(
          {"error": "Username sudah digunakan."},
          status=status.HTTP_400_BAD_REQUEST,
      )

  if User.objects.filter(email__iexact=email).exists():
      return Response(
          {"error": "Email sudah terdaftar."},
          status=status.HTTP_400_BAD_REQUEST,
      )

  # Buat user baru dengan is_staff=True
  user = User.objects.create_user(
      username=username,
      email=email,
      password=password,
      first_name=first_name,
      last_name=last_name,
      is_staff=True
  )
  
  # Pastikan ProfilSiswa dibuatkan
  ProfilSiswa.objects.get_or_create(user=user)

  return Response(
      {
          "username": user.username,
          "email": user.email,
          "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
      },
      status=status.HTTP_201_CREATED,
  )


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def teacher_badges_view(request):
  """
  Guru melihat / menambah lencana (badge).

  GET : list semua badge.
  POST: buat badge baru.
    Body:
      - nama (str)
      - deskripsi (str)
      - jenis: 'MODULE_COMPLETE' atau 'QUIZ_COUNT'
      - modul_id (int, optional, untuk MODULE_COMPLETE)
      - syarat_quiz_count (int, optional, untuk QUIZ_COUNT)
  """
  if request.method == 'POST':
      nama = request.data.get('nama')
      deskripsi = request.data.get('deskripsi', '')
      jenis = request.data.get('jenis', 'MODULE_COMPLETE')
      modul_id = request.data.get('modul_id')
      syarat_quiz_count = request.data.get('syarat_quiz_count')

      if not nama:
          return Response({"error": "Field 'nama' wajib diisi."}, status=status.HTTP_400_BAD_REQUEST)

      badge_kwargs = {
          "nama": nama,
          "deskripsi": deskripsi,
          "jenis": jenis,
      }

      if jenis == 'MODULE_COMPLETE':
          if not modul_id:
              return Response(
                  {"error": "modul_id wajib diisi untuk badge MODULE_COMPLETE."},
                  status=status.HTTP_400_BAD_REQUEST,
              )
          modul = get_object_or_404(Modul, id=modul_id)
          badge_kwargs["modul_terkait"] = modul
      elif jenis == 'QUIZ_COUNT':
          try:
              count = int(syarat_quiz_count or 0)
          except ValueError:
              return Response(
                  {"error": "syarat_quiz_count harus berupa angka."},
                  status=status.HTTP_400_BAD_REQUEST,
              )
          badge_kwargs["syarat_quiz_count"] = count

      lencana = Lencana.objects.create(**badge_kwargs)
      serializer = LencanaSerializer(lencana)
      return Response(serializer.data, status=status.HTTP_201_CREATED)

  # GET
  semua = Lencana.objects.all().order_by('nama')
  serializer = LencanaSerializer(semua, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'DELETE', 'POST'])
@permission_classes([IsAdminUser])
def teacher_badge_detail_view(request, badge_id: int):
  """
  Update atau hapus badge tertentu.
  """
  lencana = get_object_or_404(Lencana, id=badge_id)

  if request.method == 'DELETE':
      lencana.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)

  # PUT
  nama = request.data.get('nama', lencana.nama)
  deskripsi = request.data.get('deskripsi', lencana.deskripsi)
  jenis = request.data.get('jenis', lencana.jenis)
  modul_id = request.data.get('modul_id')
  syarat_quiz_count = request.data.get('syarat_quiz_count')

  lencana.nama = nama
  lencana.deskripsi = deskripsi
  lencana.jenis = jenis

  if jenis == 'MODULE_COMPLETE':
      if modul_id:
          modul = get_object_or_404(Modul, id=modul_id)
          lencana.modul_terkait = modul
      lencana.syarat_quiz_count = None
  elif jenis == 'QUIZ_COUNT':
      lencana.modul_terkait = None
      try:
          count = int(syarat_quiz_count or 0)
      except ValueError:
          return Response(
              {"error": "syarat_quiz_count harus berupa angka."},
              status=status.HTTP_400_BAD_REQUEST,
          )
      lencana.syarat_quiz_count = count

  lencana.save()
  serializer = LencanaSerializer(lencana)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def teacher_modules_view(request):
    """
    GET  : daftar modul + ringkasan jumlah materi & aktivitas.
    POST : membuat modul baru.
    """
    if request.method == 'POST':
        judul = request.data.get('judul')
        deskripsi = request.data.get('deskripsi', '')
        urutan = request.data.get('urutan')

        if not judul:
            return Response(
                {"error": "Field 'judul' wajib diisi."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            if urutan is None:
                # Jika urutan tidak diberikan, ambil urutan TERBESAR lalu +1
                # agar tidak melanggar unique constraint pada field urutan.
                max_order = Modul.objects.aggregate(m=Max("urutan"))["m"] or 0
                urutan = max_order + 1
            modul = Modul.objects.create(
                judul=judul,
                deskripsi=deskripsi,
                urutan=urutan,
            )
            serializer = ModulDetailSerializer(modul, context={"request": request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # GET
    modul_list = Modul.objects.all().order_by("urutan")
    data = []
    for modul in modul_list:
        materi_qs = Materi.objects.filter(modul=modul)
        materi_count = materi_qs.count()
        aktivitas_count = Aktivitas.objects.filter(materi__in=materi_qs).count()
        data.append(
            {
                "id": modul.id,
                "judul": modul.judul,
                "deskripsi": modul.deskripsi,
                "urutan": modul.urutan,
                "materi_count": materi_count,
                "aktivitas_count": aktivitas_count,
            }
        )
    return Response(data, status=status.HTTP_200_OK)


@api_view(['PUT', 'POST'])
@permission_classes([IsAdminUser])
def teacher_update_module_view(request, modul_id: int):
    """
    Update data modul (judul, deskripsi, urutan).

    Catatan:
    - Secara ideal HTTP method yang dipakai adalah PUT.
    - Namun beberapa environment / proxy membatasi method PUT dari browser.
      Karena itu view ini juga mengizinkan POST ke URL yang sama sebagai
      fallback, selama user tetap is_staff.
    """
    modul = get_object_or_404(Modul, id=modul_id)

    judul = request.data.get('judul', modul.judul)
    deskripsi = request.data.get('deskripsi', modul.deskripsi)
    urutan = request.data.get('urutan', modul.urutan)

    modul.judul = judul
    modul.deskripsi = deskripsi
    try:
        if urutan is not None:
            modul.urutan = int(urutan)
    except (TypeError, ValueError):
        # Jika parsing urutan gagal, biarkan nilai lama agar tidak error.
        pass

    modul.save()
    serializer = ModulDetailSerializer(modul, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def teacher_create_material_view(request):
  """
  Guru membuat materi baru di dalam modul.
  Body (multipart/form-data atau JSON):
    - modul_id     (int, wajib)
    - judul        (str, wajib)
    - konten_narasi(str, optional)
    - urutan       (int, optional)
    - pdf_file     (file PDF, optional)
  """
  modul_id_raw = request.data.get('modul_id')
  judul = request.data.get('judul')
  konten_narasi = request.data.get('konten_narasi', '')
  pdf_file = request.FILES.get('pdf_file')

  # Validasi modul_id
  try:
      modul_id = int(modul_id_raw)
  except (TypeError, ValueError):
      return Response(
          {"error": "Field 'modul_id' wajib diisi dan harus berupa angka."},
          status=status.HTTP_400_BAD_REQUEST,
      )

  if not judul:
      return Response(
          {"error": "Field 'judul' wajib diisi."},
          status=status.HTTP_400_BAD_REQUEST,
      )

  modul = get_object_or_404(Modul, id=modul_id)

  # Urutan bisa dikirim dari frontend atau dihitung otomatis
  urutan_raw = request.data.get('urutan')

  try:
      if urutan_raw in (None, '', 'null'):
          # Urutan berikutnya setelah materi terakhir di modul ini
          max_urutan = (
              Materi.objects.filter(modul=modul).aggregate(m=Max('urutan'))['m']
              or 0
          )
          urutan = max_urutan + 1
      else:
          urutan = int(urutan_raw)

      materi = Materi.objects.create(
          modul=modul,
          judul=judul,
          konten_narasi=konten_narasi,
          urutan=urutan,
          pdf_file=pdf_file,
      )
      serializer = MateriSerializer(materi, context={'request': request})
      return Response(serializer.data, status=status.HTTP_201_CREATED)
  except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'POST'])
@permission_classes([IsAdminUser])
def teacher_update_material_view(request, materi_id: int):
  """
  Update judul, konten_narasi, atau file PDF sebuah materi.
  Menerima multipart/form-data maupun JSON.
  """
  materi = get_object_or_404(Materi, id=materi_id)

  judul = request.data.get('judul') or materi.judul
  konten_narasi = request.data.get('konten_narasi') or materi.konten_narasi
  pdf_file = request.FILES.get('pdf_file')

  materi.judul = judul
  materi.konten_narasi = konten_narasi
  if pdf_file is not None:
      materi.pdf_file = pdf_file
  materi.save()

  serializer = MateriSerializer(materi, context={'request': request})
  return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def teacher_create_quiz_view(request):
  """
  Guru membuat / memperbarui aktivitas quiz (PILIHAN_GANDA) untuk satu materi.

  Body minimal:
    - materi_id (int)
    - instruksi (str)
    - poin (int, optional, default 20)

  Opsional:
    - questions: [
        {
          "pertanyaan": "...",
          "pilihan": [
            {"teks": "...", "apakah_benar": true},
            {"teks": "...", "apakah_benar": false},
          ]
        }, ...
      ]
  """
  materi_id = request.data.get('materi_id')
  instruksi = request.data.get('instruksi', '')
  poin = int(request.data.get('poin', 20))

  if not materi_id:
      return Response({"error": "Field 'materi_id' wajib diisi."}, status=status.HTTP_400_BAD_REQUEST)

  materi = get_object_or_404(Materi, id=materi_id)

  try:
      # Cek apakah materi sudah punya aktivitas lain (puzzle / live code)
      try:
          aktivitas = materi.aktivitas
          created = False
      except Aktivitas.DoesNotExist:
          aktivitas = None
          created = True

      if aktivitas and aktivitas.tipe_aktivitas != "PILIHAN_GANDA":
          return Response(
              {
                  "error": (
                      f"Materi ini sudah memiliki aktivitas tipe "
                      f"{aktivitas.get_tipe_aktivitas_display()}. "
                      "Hapus atau ubah aktivitas tersebut terlebih dahulu sebelum membuat quiz pilihan ganda."
                  )
              },
              status=status.HTTP_400_BAD_REQUEST,
          )

      # Jika belum ada aktivitas, buat baru sebagai quiz.
      if created:
          aktivitas = Aktivitas.objects.create(
              materi=materi,
              tipe_aktivitas="PILIHAN_GANDA",
              instruksi=instruksi or f"Jawab quiz untuk materi {materi.judul}",
              poin=poin,
          )
      else:
          aktivitas.tipe_aktivitas = "PILIHAN_GANDA"
          aktivitas.instruksi = instruksi or f"Jawab quiz untuk materi {materi.judul}"
          aktivitas.poin = poin
          aktivitas.save()

          # Hapus soal & pilihan lama agar tidak dobel saat edit
          SoalPilihanGanda.objects.filter(aktivitas=aktivitas).delete()

      # Opsional: buat soal + pilihan dari payload
      questions = request.data.get('questions') or []
      if isinstance(questions, list):
          for q in questions:
              pertanyaan = q.get('pertanyaan')
              if not pertanyaan:
                  continue
              soal = SoalPilihanGanda.objects.create(
                  aktivitas=aktivitas,
                  pertanyaan=pertanyaan,
              )
              for p in q.get('pilihan') or []:
                  teks = p.get('teks') or ''
                  if not teks:
                      continue
                  PilihanJawaban.objects.create(
                      soal=soal,
                      teks_jawaban=teks,
                      apakah_benar=bool(p.get('apakah_benar')),
                  )

      serializer = AktivitasSerializer(aktivitas)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
  except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def teacher_create_puzzle_view(request):
  """
  Guru membuat / memperbarui aktivitas puzzle susun kode (PUZZLE_CODE) untuk satu materi.

  Body minimal:
    - materi_id (int)
    - kode_jawaban (str)  -> kode lengkap dalam satu baris

  Opsional:
    - instruksi (str)
    - poin (int, default 20)
    - blocks: ["<p>", "Halo Dunia", "</p>"]  (array)
      ATAU blok_kode_acak: "<p>,Halo Dunia,</p>" (string)
  """
  materi_id = request.data.get("materi_id")
  instruksi = request.data.get("instruksi", "")
  poin = int(request.data.get("poin", 20))
  kode_jawaban = (request.data.get("kode_jawaban") or "").strip()

  if not materi_id or not kode_jawaban:
      return Response(
          {"error": "Field 'materi_id' dan 'kode_jawaban' wajib diisi."},
          status=status.HTTP_400_BAD_REQUEST,
      )

  materi = get_object_or_404(Materi, id=materi_id)

  # Siapkan blok kode acak
  blocks = request.data.get("blocks")
  blok_kode_acak = request.data.get("blok_kode_acak")

  if isinstance(blocks, list):
      blok_kode_acak = ",".join(str(b) for b in blocks)
  blok_kode_acak = (blok_kode_acak or "").strip()

  try:
      # Cek aktivitas yang sudah ada
      try:
          aktivitas = materi.aktivitas
          created = False
      except Aktivitas.DoesNotExist:
          aktivitas = None
          created = True

      if aktivitas and aktivitas.tipe_aktivitas != "PUZZLE_CODE":
          return Response(
              {
                  "error": (
                      f"Materi ini sudah memiliki aktivitas tipe "
                      f"{aktivitas.get_tipe_aktivitas_display()}. "
                      "Hapus atau ubah aktivitas tersebut terlebih dahulu sebelum membuat puzzle kode."
                  )
              },
              status=status.HTTP_400_BAD_REQUEST,
          )

      if created:
          aktivitas = Aktivitas.objects.create(
              materi=materi,
              tipe_aktivitas="PUZZLE_CODE",
              instruksi=instruksi or f"Susun potongan kode untuk materi {materi.judul}",
              poin=poin,
              kode_jawaban=kode_jawaban,
              blok_kode_acak=blok_kode_acak,
          )
      else:
          aktivitas.tipe_aktivitas = "PUZZLE_CODE"
          aktivitas.instruksi = instruksi or f"Susun potongan kode untuk materi {materi.judul}"
          aktivitas.poin = poin
          aktivitas.kode_jawaban = kode_jawaban
          aktivitas.blok_kode_acak = blok_kode_acak
          # Puzzle tidak butuh validasi_html atau soal pilihan ganda
          aktivitas.validasi_html = None
          aktivitas.save()

          # Bersihkan soal pilgan lama bila sebelumnya aktivitas adalah quiz
          SoalPilihanGanda.objects.filter(aktivitas=aktivitas).delete()

      serializer = AktivitasSerializer(aktivitas)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
  except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def teacher_create_livecode_view(request):
  """
  Guru membuat / memperbarui aktivitas live code HTML (DEMO_HTML) untuk satu materi.

  Body minimal:
    - materi_id (int)
    - validasi_html (str) -> teks/tag yang harus ada di jawaban

  Opsional:
    - instruksi (str)
    - poin (int, default 20)
  """
  materi_id = request.data.get("materi_id")
  instruksi = request.data.get("instruksi", "")
  poin = int(request.data.get("poin", 20))
  validasi_html = (request.data.get("validasi_html") or "").strip()

  if not materi_id or not validasi_html:
      return Response(
          {"error": "Field 'materi_id' dan 'validasi_html' wajib diisi."},
          status=status.HTTP_400_BAD_REQUEST,
      )

  materi = get_object_or_404(Materi, id=materi_id)

  try:
      try:
          aktivitas = materi.aktivitas
          created = False
      except Aktivitas.DoesNotExist:
          aktivitas = None
          created = True

      if aktivitas and aktivitas.tipe_aktivitas != "DEMO_HTML":
          return Response(
              {
                  "error": (
                      f"Materi ini sudah memiliki aktivitas tipe "
                      f"{aktivitas.get_tipe_aktivitas_display()}. "
                      "Hapus atau ubah aktivitas tersebut terlebih dahulu sebelum membuat aktivitas live code."
                  )
              },
              status=status.HTTP_400_BAD_REQUEST,
          )

      if created:
          aktivitas = Aktivitas.objects.create(
              materi=materi,
              tipe_aktivitas="DEMO_HTML",
              instruksi=instruksi
              or f"Buat kode HTML sesuai instruksi untuk materi {materi.judul}",
              poin=poin,
              validasi_html=validasi_html,
          )
      else:
          aktivitas.tipe_aktivitas = "DEMO_HTML"
          aktivitas.instruksi = instruksi or f"Buat kode HTML sesuai instruksi untuk materi {materi.judul}"
          aktivitas.poin = poin
          aktivitas.validasi_html = validasi_html
          # Live code tidak butuh puzzle atau soal pilgan
          aktivitas.kode_jawaban = None
          aktivitas.blok_kode_acak = None
          aktivitas.save()

          SoalPilihanGanda.objects.filter(aktivitas=aktivitas).delete()

      serializer = AktivitasSerializer(aktivitas)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
  except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
