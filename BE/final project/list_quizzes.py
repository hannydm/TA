import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digi_world.settings')
django.setup()

from api.models import Aktivitas

def list_quizzes():
    quizzes = Aktivitas.objects.filter(tipe_aktivitas='PILIHAN_GANDA').order_by('id')
    print(f"{'ID':<5} | {'Materi':<30}")
    print("-" * 40)
    for q in quizzes:
        materi_title = q.materi.judul if hasattr(q, 'materi') else "ORPHAN"
        print(f"{q.id:<5} | {materi_title:<30}")

if __name__ == '__main__':
    list_quizzes()
