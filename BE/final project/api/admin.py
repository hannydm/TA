from django.contrib import admin
from .models import (
    ProfilSiswa, 
    Modul, 
    Materi, 
    Aktivitas, 
    Lencana, 
    LencanaSiswa, 
    HasilAktivitas, 
    MateriSelesai
)

# Daftarkan semua model Anda di sini
admin.site.register(ProfilSiswa)
admin.site.register(Modul)
admin.site.register(Materi)
admin.site.register(Aktivitas)
admin.site.register(Lencana)
admin.site.register(LencanaSiswa)
admin.site.register(HasilAktivitas)
admin.site.register(MateriSelesai)