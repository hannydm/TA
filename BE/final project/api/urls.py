from django.urls import path
from . import views 

urlpatterns = [
    # Contoh endpoint "Hello World" untuk tes
    path('hello/', views.hello_world, name='hello_world'),
    path('profil/', views.profil_view, name='profil'),
    path('registrasi/', views.registrasi_view, name='registrasi'),
    path('modul/', views.daftar_modul_view, name='daftar-modul'),
    path('modul/<int:modul_id>/', views.detail_modul_view, name='detail-modul'),
    path('materi/<int:materi_id>/', views.detail_materi_view, name='detail-materi'),
    path('aktivitas/<int:aktivitas_id>/', views.detail_aktivitas_view, name='detail-aktivitas'),
    path('aktivitas/<int:aktivitas_id>/', views.detail_aktivitas_view, name='detail-aktivitas'),
    path('submit-skor/', views.submit_skor_view, name='submit-skor'),
    path('tandai-selesai/', views.tandai_selesai_view, name='tandai-selesai'),
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
    path('leaderboard/weekly/', views.leaderboard_weekly_view, name='leaderboard-weekly'),
    path('leaderboard/stats/', views.leaderboard_stats_view, name='leaderboard-stats'),
    path('lencana/', views.daftar_lencana_view, name='daftar-lencana'),
    path('lencana-saya/', views.lencana_saya_view, name='lencana-saya'),
    path('quiz/', views.daftar_quiz_view, name='daftar-quiz'),
    path('recent-activity/', views.recent_activity_view, name='recent-activity'),
]
