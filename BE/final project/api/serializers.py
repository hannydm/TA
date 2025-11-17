# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ProfilSiswa, Modul, Materi, Aktivitas, SoalPilihanGanda, PilihanJawaban, PilihanJawaban, HasilAktivitas, Lencana, LencanaSiswa, MateriSelesai

class RegisterSerializer(serializers.ModelSerializer):
    # Field tambahan untuk konfirmasi password
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True} # 'write_only' berarti password tdk akan dikirim balik
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

        # Buat ProfilSiswa yang terhubung ke User baru
        ProfilSiswa.objects.create(user=user)

        return user
    
    #membaca data User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Tentukan field User yang boleh dibaca
        fields = ['username', 'email', 'first_name', 'last_name']

#membaca DAN mengubah ProfilSiswa
class ProfilSiswaSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) 

    class Meta:
        model = ProfilSiswa
        # Tentukan field ProfilSiswa yang boleh dibaca/diubah
        fields = ['user', 'avatar'] 
        # (Tambahkan field lain dari model ProfilSiswa Anda, misal 'bio', dll.)

class AktivitasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aktivitas
        # Tentukan field Aktivitas yang boleh dilihat React
        fields = ['id', 'nama_aktivitas', 'tipe_aktivitas', 'poin']
        # (Tambahkan field lain dari model Aktivitas Anda jika perlu)


# 2. Serializer di tengah: Materi
class MateriSerializer(serializers.ModelSerializer):
    # 'aktivitas_set' adalah nama relasi baliknya (reverse relation)
    # Ini akan mengambil SEMUA aktivitas yang terhubung ke materi ini
    aktivitas_set = AktivitasSerializer(many=True, read_only=True)

    class Meta:
        model = Materi
        # Tentukan field Materi yang boleh dilihat React
        fields = [
            'id', 
            'nama_materi', 
            'konten_teks', 
            'video_embed_url', 
            'urutan',
            'aktivitas_set' # <-- Sertakan serializer bersarang
        ]
        # (Tambahkan field lain dari model Materi Anda jika perlu)


# 3. Serializer paling luar: Modul
class ModulDetailSerializer(serializers.ModelSerializer):
    # 'materi_set' adalah relasi balik dari Modul ke Materi
    # Ini akan mengambil SEMUA materi yang terhubung ke modul ini
    materi_set = MateriSerializer(many=True, read_only=True)

    class Meta:
        model = Modul
        fields = [
            'id', 
            'nama_modul', 
            'deskripsi', 
            'thumbnail', 
            'materi_set' # <-- Sertakan serializer bersarang
        ]

# Serializer ini khusus untuk daftar modul (tidak perlu detail materi)
class ModulListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modul
        fields = ['id', 'nama_modul', 'deskripsi', 'thumbnail', 'urutan']
        # (Tambahkan 'urutan' jika ada di model Modul Anda)

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
        fields = ['id', 'nama', 'deskripsi', 'modul_terkait']
        # (Tambahkan 'ikon' HANYA JIKA Anda punya field itu di model Anda) 


# Serializer ini untuk Lencana yang dimiliki Siswa (kapan didapat?)
class LencanaSiswaSerializer(serializers.ModelSerializer):
    # Kita buat 'lencana' menjadi objek detail, bukan cuma ID
    lencana = LencanaSerializer(read_only=True) 

    class Meta:
        model = LencanaSiswa
        # Tentukan field dari model LencanaSiswa Anda
        fields = ['lencana', 'tanggal_didapat']