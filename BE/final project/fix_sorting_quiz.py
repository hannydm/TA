import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digi_world.settings')
django.setup()

from api.models import Modul, Materi, Aktivitas

def fix_quiz():
    # 1. Delete the one I created "Kuis Pengurutan"
    try:
        my_quiz = Materi.objects.get(judul="Kuis Pengurutan")
        print(f"Deleting my quiz material: {my_quiz.judul}")
        my_quiz.delete()
    except Materi.DoesNotExist:
        print("My quiz 'Kuis Pengurutan' not found (already deleted?).")

    # 2. Find the user's quiz
    # Look for materials with "Sorting" or "Pengurutan" in title
    print("\nSearching for other Sorting materials...")
    materials = Materi.objects.filter(judul__icontains="Sorting") | Materi.objects.filter(judul__icontains="Pengurutan")
    
    for m in materials:
        print(f"Found Material: {m.judul} (ID: {m.id})")
        if hasattr(m, 'aktivitas'):
            akt = m.aktivitas
            print(f"  - Activity ID: {akt.id}")
            print(f"  - Type: {akt.tipe_aktivitas}")
            
            # If this is the user's quiz but not showing, maybe it's the wrong type?
            # The user said "pilihan ganda untuk materi pengurutan".
            # If the type is NOT PILIHAN_GANDA, we should probably change it?
            # BUT, wait. Earlier the user said "materi sorting yang bagian puzzle acak".
            # So there is a Puzzle activity for Sorting.
            # Does the user have a SEPARATE material for the Quiz?
            # Or did they want the Puzzle to BE the Quiz?
            # "hapus quiz yang sudah kamu buat, karna saya sudah membuat nya lebih dahulu di database"
            # "namum permasalahan nya dia tidak muncul di pages quiz"
            
            # If the user made a quiz, it should be a separate activity or material.
            # Let's check if there are any other activities that look like quizzes but aren't showing.
            
            if akt.tipe_aktivitas != 'PILIHAN_GANDA':
                 # Check if it has questions?
                 if akt.soal_pilgan.exists():
                     print("  - HAS QUESTIONS! This might be the hidden quiz.")
                     print("  - UPDATING TYPE TO PILIHAN_GANDA...")
                     akt.tipe_aktivitas = 'PILIHAN_GANDA'
                     akt.save()
                     print("  - Update success.")
        else:
            print("  - No activity linked.")

    # Also search for Activities directly that might be orphaned or named differently?
    # (Unlikely since OneToOne with Materi)

if __name__ == '__main__':
    fix_quiz()
