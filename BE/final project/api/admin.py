from django.contrib import admin
from .models import (
    ProfilSiswa,
    Modul,
    Materi,
    Aktivitas,
    SoalPilihanGanda,
    PilihanJawaban,
    Lencana,
    LencanaSiswa,
    HasilAktivitas,
    MateriSelesai,
)


@admin.register(ProfilSiswa)
class ProfilSiswaAdmin(admin.ModelAdmin):
    list_display = ("user", "level", "total_poin")
    search_fields = ("user__username", "user__email")
    list_filter = ("level",)


class MateriInline(admin.StackedInline):
    model = Materi
    extra = 0
    show_change_link = True


@admin.register(Modul)
class ModulAdmin(admin.ModelAdmin):
    list_display = ("judul", "urutan", "jumlah_materi")
    search_fields = ("judul", "deskripsi")
    ordering = ("urutan",)
    inlines = [MateriInline]

    def jumlah_materi(self, obj):
        return obj.materi_set.count()

    jumlah_materi.short_description = "Total Materi"


class AktivitasInline(admin.StackedInline):
    model = Aktivitas
    extra = 0
    show_change_link = True


@admin.register(Materi)
class MateriAdmin(admin.ModelAdmin):
    list_display = ("judul", "modul", "urutan")
    list_filter = ("modul",)
    search_fields = ("judul", "konten_narasi")
    ordering = ("modul", "urutan")
    inlines = [AktivitasInline]


class PilihanJawabanInline(admin.TabularInline):
    model = PilihanJawaban
    extra = 2


@admin.register(SoalPilihanGanda)
class SoalPilihanGandaAdmin(admin.ModelAdmin):
    list_display = ("pertanyaan", "aktivitas")
    inlines = [PilihanJawabanInline]
    search_fields = ("pertanyaan",)
    list_filter = ("aktivitas__materi__modul",)


@admin.register(Aktivitas)
class AktivitasAdmin(admin.ModelAdmin):
    list_display = ("materi", "tipe_aktivitas", "poin")
    list_filter = ("tipe_aktivitas", "materi__modul")
    search_fields = ("materi__judul", "instruksi")


@admin.register(Lencana)
class LencanaAdmin(admin.ModelAdmin):
    list_display = ("nama", "modul_terkait")
    search_fields = ("nama",)
    list_filter = ("modul_terkait",)


@admin.register(LencanaSiswa)
class LencanaSiswaAdmin(admin.ModelAdmin):
    list_display = ("profil_siswa", "lencana", "tanggal_didapat")
    list_filter = ("lencana",)
    search_fields = ("profil_siswa__user__username",)


@admin.register(HasilAktivitas)
class HasilAktivitasAdmin(admin.ModelAdmin):
    list_display = ("profil_siswa", "aktivitas", "skor", "tanggal_pengerjaan")
    list_filter = ("aktivitas__materi__modul",)
    search_fields = ("profil_siswa__user__username", "aktivitas__materi__judul")


@admin.register(MateriSelesai)
class MateriSelesaiAdmin(admin.ModelAdmin):
    list_display = ("profil_siswa", "materi", "tanggal_selesai")
    list_filter = ("materi__modul",)
    search_fields = ("profil_siswa__user__username", "materi__judul")


admin.site.site_header = "Digi World Admin"
admin.site.site_title = "Digi World Admin Panel"
admin.site.index_title = "Manajemen Modul & Aktivitas"
