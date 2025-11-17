from django.db import models
from django.contrib.auth.models import User

# Model-model ini tidak berubah
class ProfilSiswa(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_poin = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    avatar = models.ImageField(default='default.jpg', upload_to='profile_images')
    def __str__(self): return f"Profil dari {self.user.username}"

class Modul(models.Model):
    judul = models.CharField(max_length=200)
    deskripsi = models.TextField()
    urutan = models.IntegerField(unique=True)
    def __str__(self): return self.judul

class Materi(models.Model):
    modul = models.ForeignKey(Modul, on_delete=models.CASCADE)
    judul = models.CharField(max_length=200)
    konten_narasi = models.TextField()
    urutan = models.IntegerField()
    def __str__(self): return f"{self.modul.judul} - {self.judul}"


class Aktivitas(models.Model):
    # Pilihan untuk tipe aktivitas yang akan muncul di admin
    TIPE_AKTIVITAS = [
        ('PILIHAN_GANDA', 'Pilihan Ganda'),
        ('PUZZLE_CODE', 'Puzzle Susun Kode'),
        ('DEMO_HTML', 'Demo HTML Live'),
    ]
    
    materi = models.OneToOneField(Materi, on_delete=models.CASCADE, related_name='aktivitas')
    tipe_aktivitas = models.CharField(max_length=20, choices=TIPE_AKTIVITAS)
    instruksi = models.TextField(help_text="Jelaskan apa yang harus dilakukan siswa.")
    poin = models.IntegerField(default=20)

    # Field khusus untuk Puzzle Susun Kode
    kode_jawaban = models.TextField(blank=True, null=True, help_text="Tulis kode jawaban yang benar dalam satu baris, tanpa spasi.")
    blok_kode_acak = models.TextField(blank=True, null=True, help_text="Tulis blok kode, pisahkan dengan koma. Contoh: <p>,Halo Dunia,</p>")

    # Field khusus untuk Demo HTML
    validasi_html = models.CharField(max_length=100, blank=True, null=True, help_text="Tag HTML yang harus ada di jawaban. Contoh: <b>")

    def __str__(self):
        return f"Aktivitas untuk: {self.materi.judul}"

# Model ini hanya untuk soal-soal Pilihan Ganda
class SoalPilihanGanda(models.Model):
    aktivitas = models.ForeignKey(Aktivitas, on_delete=models.CASCADE, related_name='soal_pilgan')
    pertanyaan = models.TextField()
    
    def __str__(self): return self.pertanyaan

class PilihanJawaban(models.Model):
    soal = models.ForeignKey(SoalPilihanGanda, on_delete=models.CASCADE, related_name='pilihan')
    teks_jawaban = models.CharField(max_length=255)
    apakah_benar = models.BooleanField(default=False)
    
    def __str__(self): return self.teks_jawaban

# Model ini untuk menyimpan hasil dari SEMUA jenis aktivitas
class HasilAktivitas(models.Model):
    profil_siswa = models.ForeignKey(ProfilSiswa, on_delete=models.CASCADE)
    aktivitas = models.ForeignKey(Aktivitas, on_delete=models.CASCADE)
    skor = models.IntegerField()
    tanggal_pengerjaan = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f"Hasil {self.aktivitas.materi.judul} oleh {self.profil_siswa.user.username}"

# Model Lencana dan MateriSelesai tidak berubah
class Lencana(models.Model):
    nama = models.CharField(max_length=100)
    deskripsi = models.CharField(max_length=255)
    modul_terkait = models.OneToOneField(Modul, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self): return self.nama

class LencanaSiswa(models.Model):
    profil_siswa = models.ForeignKey(ProfilSiswa, on_delete=models.CASCADE)
    lencana = models.ForeignKey(Lencana, on_delete=models.CASCADE)
    tanggal_didapat = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ('profil_siswa', 'lencana')

class MateriSelesai(models.Model):
    profil_siswa = models.ForeignKey(ProfilSiswa, on_delete=models.CASCADE)
    materi = models.ForeignKey(Materi, on_delete=models.CASCADE)
    tanggal_selesai = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ('profil_siswa', 'materi')

