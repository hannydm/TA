import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digi_world.settings')
django.setup()

from api.models import Modul, Materi, Aktivitas

def check_mapping():
    modules = Modul.objects.all().order_by('urutan')
    print(f"{'Modul':<30} | {'Materi':<30} | {'Activity ID':<10} | {'Type':<15}")
    print("-" * 95)
    
    for modul in modules:
        materis = modul.materi_set.all().order_by('urutan')
        for materi in materis:
            try:
                aktivitas = materi.aktivitas
                if aktivitas and aktivitas.tipe_aktivitas == 'PILIHAN_GANDA':
                    print(f"{modul.judul:<30} | {materi.judul:<30} | {aktivitas.id:<10} | {aktivitas.tipe_aktivitas:<15}")
            except Exception:
                continue

if __name__ == '__main__':
    check_mapping()
