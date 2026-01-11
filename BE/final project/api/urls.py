from django.urls import path
from . import views

urlpatterns = [
    # Contoh endpoint "Hello World" untuk tes
    path('hello/', views.hello_world, name='hello_world'),

    # Profil siswa (lihat & update data dasar)
    path('profil/', views.profil_view, name='profil'),
    path('profil/update/', views.profil_update_view, name='profil-update'),

    # Endpoint avatar publik (bisa dipakai langsung di <img src=\"...\"> tanpa header auth)
    path(
        'profil/avatar-public/<int:profil_id>/',
        views.profil_avatar_public_view,
        name='profil-avatar-public',
    ),
    path('profil/avatar/', views.profil_avatar_upload_view, name='profil-avatar'),

    # Registrasi & konten belajar
    path('registrasi/', views.registrasi_view, name='registrasi'),
    path('modul/', views.daftar_modul_view, name='daftar-modul'),
    path('modul/<int:modul_id>/', views.detail_modul_view, name='detail-modul'),
    path('materi/<int:materi_id>/', views.detail_materi_view, name='detail-materi'),
    path('aktivitas/<int:aktivitas_id>/', views.detail_aktivitas_view, name='detail-aktivitas'),
    path('submit-skor/', views.submit_skor_view, name='submit-skor'),
    path('tandai-selesai/', views.tandai_selesai_view, name='tandai-selesai'),

    # Leaderboard & progres
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
    path('leaderboard/weekly/', views.leaderboard_weekly_view, name='leaderboard-weekly'),
    path('leaderboard/stats/', views.leaderboard_stats_view, name='leaderboard-stats'),
    path('progress/summary/', views.progress_summary_view, name='progress-summary'),

    # Lencana & aktivitas terbaru
    path('lencana/', views.daftar_lencana_view, name='daftar-lencana'),
    path('lencana-saya/', views.lencana_saya_view, name='lencana-saya'),
    path('quiz/', views.daftar_quiz_view, name='daftar-quiz'),
    path('quiz/summary/', views.quiz_overall_summary_view, name='quiz-summary'),
    path('recent-activity/', views.recent_activity_view, name='recent-activity'),

    # Teacher / guru panel
    path('teacher/students/', views.teacher_students_overview_view, name='teacher-students'),
    path(
        'teacher/students/<int:profil_id>/detail/',
        views.teacher_student_detail_view,
        name='teacher-student-detail',
    ),
    path('teacher/modules/', views.teacher_modules_view, name='teacher-modules'),
    path(
        'teacher/modules/<int:modul_id>/',
        views.teacher_update_module_view,
        name='teacher-update-module',
    ),
    path(
        'teacher/materials/create/',
        views.teacher_create_material_view,
        name='teacher-create-material',
    ),
    path(
        'teacher/materials/<int:materi_id>/',
        views.teacher_update_material_view,
        name='teacher-update-material',
    ),
    path('teacher/quizzes/create/', views.teacher_create_quiz_view, name='teacher-create-quiz'),
    path('teacher/puzzles/create/', views.teacher_create_puzzle_view, name='teacher-create-puzzle'),
    path('teacher/livecode/create/', views.teacher_create_livecode_view, name='teacher-create-livecode'),
    path('teacher/teachers/', views.teacher_list_view, name='teacher-list'),
    path('teacher/teachers/create/', views.teacher_create_teacher_view, name='teacher-create-teacher'),
    path('teacher/update-class/<int:user_id>/', views.teacher_update_class_assignment_view, name='teacher-update-class'), # [NEW]
    path('teacher/badges/', views.teacher_badges_view, name='teacher-badges'),
    path(
        'teacher/badges/<int:badge_id>/',
        views.teacher_badge_detail_view,
        name='teacher-badge-detail',
    ),
]

