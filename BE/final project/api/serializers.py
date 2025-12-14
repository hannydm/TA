from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import AuthenticationFailed
from django.core.cache import cache
from django.urls import reverse
from .models import (
    ProfilSiswa,
    Modul,
    Materi,
    Aktivitas,
    SoalPilihanGanda,
    PilihanJawaban,
    HasilAktivitas,
    Lencana,
    LencanaSiswa,
    MateriSelesai,
)

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer registrasi akun siswa.
    Menggunakan model User sebagai basis, dengan field ekstra:
    - password2 : konfirmasi password
    - nisn      : nomor induk siswa nasional (opsional)
    - kelas     : nama / kode kelas (opsional)
    """

    # Field tambahan untuk konfirmasi password
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    # Field tambahan yang akan disimpan ke ProfilSiswa
    nisn = serializers.CharField(max_length=20, required=False, allow_blank=True)
    kelas = serializers.CharField(max_length=50, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'nisn', 'kelas']
        extra_kwargs = {
            'password': {'write_only': True}  # 'write_only' berarti password tdk akan dikirim balik
        }

    # Fungsi 'save' ini akan dipanggil jika validasi berhasil
    def save(self):
        user = User(
            username=self.validated_data['username'],
            email=self.validated_data['email']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        # Validasi password
        if password != password2:
            raise serializers.ValidationError({'password': 'Password tidak cocok.'})

        # Hash password (JANGAN SIMPAN password mentah)
        user.set_password(password)
        user.save()

        # Ambil info profil tambahan (boleh kosong)
        nisn = self.validated_data.get('nisn', '').strip() or None
        kelas = self.validated_data.get('kelas', '').strip() or None

        # Buat ProfilSiswa yang terhubung ke User baru
        ProfilSiswa.objects.create(user=user, nisn=nisn, kelas=kelas)

        return user
    
    #membaca data User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Tambahkan is_staff supaya frontend bisa tahu akun guru/admin
        fields = ['username', 'email', 'first_name', 'last_name', 'is_staff']
        read_only_fields = fields


# Profil untuk dibaca frontend (level, poin, avatar)
class ProfilSiswaSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # Kirim URL avatar yang sudah dinormalisasi (absolute URL),
    # atau None jika masih memakai avatar default.
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = ProfilSiswa
        fields = ['id', 'user', 'avatar', 'level', 'total_poin', 'nisn', 'kelas']
        read_only_fields = ['id', 'user', 'level', 'total_poin']

    def get_avatar(self, obj: ProfilSiswa):
        """
        Kembalikan URL absolut untuk avatar jika ada file fisiknya
        dan bukan placeholder default. Kalau tidak, kembalikan None.
        """
        # Tidak ada avatar sama sekali.
        if not obj.avatar or not obj.avatar.name:
            return None

        filename = obj.avatar.name.lower().split('/')[-1]
        if filename in {'default.jpg', 'default.jpeg', 'default.png'}:
            # Jangan kirim URL untuk placeholder default.
            return None

        request = self.context.get('request')
        if request is None:
            return None

        # Gunakan endpoint API khusus untuk mengirim file avatar lewat /api/...
        # supaya selalu lewat reverse proxy yang sama dengan endpoint lainnya.
        avatar_url = reverse('profil-avatar-public', args=[obj.id])
        return request.build_absolute_uri(avatar_url)


class PilihanJawabanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PilihanJawaban
        fields = ['id', 'teks_jawaban', 'apakah_benar']


class SoalPilihanGandaSerializer(serializers.ModelSerializer):
    pilihan = PilihanJawabanSerializer(many=True, read_only=True)

    class Meta:
        model = SoalPilihanGanda
        fields = ['id', 'pertanyaan', 'pilihan']


class AktivitasSerializer(serializers.ModelSerializer):
    # Untuk kuis pilihan ganda, sertakan daftar soal+pilihan
    soal_pilgan = SoalPilihanGandaSerializer(many=True, read_only=True)

    class Meta:
        model = Aktivitas
        # Field aktivitas yang dibutuhkan frontend
        fields = [
            'id',
            'materi',
            'tipe_aktivitas',
            'instruksi',
            'poin',
            'kode_jawaban',
            'blok_kode_acak',
            'validasi_html',
            'soal_pilgan',
        ]


# 2. Serializer di tengah: Materi
class MateriSerializer(serializers.ModelSerializer):
    # Satu aktivitas terkait (OneToOneField dengan related_name='aktivitas')
    aktivitas = AktivitasSerializer(read_only=True)
    is_locked = serializers.SerializerMethodField()

    class Meta:
        model = Materi
        # Field Materi yang dikirim ke frontend
        fields = [
            'id',
            'modul',
            'judul',
            'konten_narasi',
            'urutan',
            'pdf_file',
            'aktivitas',
            'is_locked',
        ]

    def get_is_locked(self, obj):
        user = self.context.get('request').user
        if not user.is_authenticated:
            return True
        
        # Materi pertama di modul pertama selalu terbuka
        if obj.urutan == 1 and obj.modul.urutan == 1:
            return False

        # Cek materi sebelumnya
        # Asumsi: urutan materi unik secara global atau per modul?
        # Model Materi punya urutan. Mari asumsikan urutan global atau kita cek materi sebelumnya dalam modul yang sama.
        # Jika urutan per modul:
        if obj.urutan == 1:
            # Cek modul sebelumnya
            prev_modul = Modul.objects.filter(urutan=obj.modul.urutan - 1).first()
            if not prev_modul:
                return False # Modul pertama
            
            # Cek apakah semua materi di modul sebelumnya sudah selesai?
            # Atau cukup cek materi terakhir di modul sebelumnya?
            last_materi_prev_modul = Materi.objects.filter(modul=prev_modul).order_by('-urutan').first()
            if not last_materi_prev_modul:
                return False # Modul sebelumnya kosong?
            
            return not MateriSelesai.objects.filter(profil_siswa__user=user, materi=last_materi_prev_modul).exists()
        else:
            # Cek materi sebelumnya dalam modul yang sama
            prev_materi = Materi.objects.filter(modul=obj.modul, urutan=obj.urutan - 1).first()
            if not prev_materi:
                return False # Seharusnya tidak terjadi jika urutan urut
            
            return not MateriSelesai.objects.filter(profil_siswa__user=user, materi=prev_materi).exists()


# 3. Serializer paling luar: Modul
class ModulDetailSerializer(serializers.ModelSerializer):
    # Relasi balik dari Modul ke Materi
    materi_set = serializers.SerializerMethodField()

    class Meta:
        model = Modul
        fields = [
            'id',
            'judul',
            'deskripsi',
            'urutan',
            'materi_set',
        ]

    def get_materi_set(self, obj):
        # Pass context to nested serializer
        serializer = MateriSerializer(obj.materi_set.all().order_by('urutan'), many=True, context=self.context)
        return serializer.data


# Serializer ini khusus untuk daftar modul (ringkas)
class ModulListSerializer(serializers.ModelSerializer):
    is_locked = serializers.SerializerMethodField()

    class Meta:
        model = Modul
        fields = ['id', 'judul', 'deskripsi', 'urutan', 'is_locked']

    def get_is_locked(self, obj):
        user = self.context.get('request').user
        if not user.is_authenticated:
            return True
        
        if obj.urutan == 1:
            return False
            
        # Cek modul sebelumnya
        prev_modul = Modul.objects.filter(urutan=obj.urutan - 1).first()
        if not prev_modul:
            return False
            
        # Cek apakah materi terakhir dari modul sebelumnya sudah selesai
        last_materi = Materi.objects.filter(modul=prev_modul).order_by('-urutan').first()
        if not last_materi:
            return False # Modul kosong dianggap selesai?
            
        return not MateriSelesai.objects.filter(profil_siswa__user=user, materi=last_materi).exists()

class SubmitSkorSerializer(serializers.Serializer):
    # Serializer ini tidak terhubung ke model, 
    # hanya untuk memvalidasi data yang dikirim React
    aktivitas_id = serializers.IntegerField()
    skor = serializers.IntegerField()

class LencanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lencana
        # DIPERBAIKI: Gunakan field yang ADA di model Anda
        # (Berdasarkan pesan error, Anda punya 'nama' bukan 'nama_lencana')
        fields = ['id', 'nama', 'deskripsi', 'modul_terkait', 'jenis', 'syarat_quiz_count']
        # (Tambahkan 'ikon' HANYA JIKA Anda punya field itu di model Anda) 


# Serializer ini untuk Lencana yang dimiliki Siswa (kapan didapat?)
class LencanaSiswaSerializer(serializers.ModelSerializer):
    # Kita buat 'lencana' menjadi objek detail, bukan cuma ID
    lencana = LencanaSerializer(read_only=True) 

    class Meta:
        model = LencanaSiswa
        # Tentukan field dari model LencanaSiswa Anda
        fields = ['lencana', 'tanggal_didapat']


class EmailOrUsernameTokenSerializer(TokenObtainPairSerializer):
    """
    Mengizinkan login menggunakan username ATAU email + proteksi bruteforce sederhana.
    """

    def validate(self, attrs):
        request = self.context.get('request')
        raw_identifier = attrs.get(self.username_field) or ''

        # Normalisasi username/email untuk kunci cache
        identifier = str(raw_identifier).strip().lower()

        # Tentukan IP address dasar
        ip = None
        if request is not None:
            xff = request.META.get('HTTP_X_FORWARDED_FOR')
            if xff:
                ip = xff.split(',')[0].strip()
            else:
                ip = request.META.get('REMOTE_ADDR')

        user_key = f"bf_user:{identifier}" if identifier else None
        ip_key = f"bf_ip:{ip}" if ip else None

        max_attempts = 5
        lock_seconds = 10 * 60  # 10 menit

        # Cek apakah sudah melewati batas percobaan
        if user_key:
            user_count = cache.get(user_key, 0)
            if user_count >= max_attempts:
                raise AuthenticationFailed(
                    'Terlalu banyak percobaan login gagal untuk akun ini. Coba lagi nanti.'
                )
        if ip_key:
            ip_count = cache.get(ip_key, 0)
            if ip_count >= max_attempts:
                raise AuthenticationFailed(
                    'Terlalu banyak percobaan login dari alamat IP ini. Coba lagi nanti.'
                )

        # Izinkan login menggunakan email sebagai pengganti username
        username = raw_identifier
        if username and '@' in username:
            try:
                user = User.objects.get(email__iexact=username)
                attrs[self.username_field] = user.get_username()
            except User.DoesNotExist:
                # Biarkan SimpleJWT yang meng-handle error kredensial
                pass

        try:
            data = super().validate(attrs)
        except (AuthenticationFailed, TokenError) as exc:
            # Login gagal → tingkatkan hitungan gagal
            if user_key:
                count = cache.get(user_key, 0) + 1
                cache.set(user_key, count, timeout=lock_seconds)
            if ip_key:
                count = cache.get(ip_key, 0) + 1
                cache.set(ip_key, count, timeout=lock_seconds)
            raise exc

        # Login berhasil → reset hitungan gagal
        if user_key:
            cache.delete(user_key)
        if ip_key:
            cache.delete(ip_key)

        return data
