import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digi_world.settings')
django.setup()

from api.models import Modul, Materi, Aktivitas

def move_puzzle():
    try:
        # 1. Get Source (Sorting Activity)
        # We know it's ID 3 from previous check, or find via Material
        m2 = Modul.objects.get(id=2)
        sorting_mat = m2.materi_set.filter(judul__icontains='sorting').first()
        source_act = sorting_mat.aktivitas
        
        print(f"Source Activity: {source_act} (Type: {source_act.tipe_aktivitas})")
        
        # 2. Get Target (Searching Material)
        target_mat = m2.materi_set.filter(urutan=2).first()
        print(f"Target Material: {target_mat.judul}")
        
        if hasattr(target_mat, 'aktivitas'):
            print("Target already has an activity! Aborting.")
            return

        # 3. Create New Activity
        new_act = Aktivitas.objects.create(
            materi=target_mat,
            tipe_aktivitas='PUZZLE_CODE',
            instruksi=source_act.instruksi or "Urutkan langkah-langkah berikut dengan benar.",
            poin=source_act.poin,
            blok_kode_acak=source_act.blok_kode_acak,
            kode_jawaban=source_act.kode_jawaban
        )
        
        print(f"Created new Puzzle activity for {target_mat.judul}!")
        print(f"Puzzle Blocks: {new_act.blok_kode_acak}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    move_puzzle()
