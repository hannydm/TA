import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digi_world.settings')
django.setup()

from api.models import Modul, Materi, Aktivitas, SoalPilihanGanda, PilihanJawaban

def create_quiz():
    # 1. Get the module
    try:
        modul = Modul.objects.get(id=2) # Berpikir Komputasional
        print(f"Found module: {modul.judul}")
    except Modul.DoesNotExist:
        print("Module 2 not found!")
        return

    # 2. Create new Material for the Quiz
    # Check if it already exists to avoid duplicates
    materi_judul = "Kuis Pengurutan"
    materi, created = Materi.objects.get_or_create(
        modul=modul,
        judul=materi_judul,
        defaults={
            'konten_narasi': "Uji pemahamanmu tentang algoritma pengurutan (Sorting) dengan kuis berikut!",
            'urutan': 5, # Assuming 4 was the last one
        }
    )
    
    if created:
        print(f"Created new material: {materi.judul}")
    else:
        print(f"Material already exists: {materi.judul}")

    # 3. Create Activity
    aktivitas, created = Aktivitas.objects.get_or_create(
        materi=materi,
        defaults={
            'tipe_aktivitas': 'PILIHAN_GANDA',
            'instruksi': "Jawablah pertanyaan berikut dengan benar.",
            'poin': 50
        }
    )

    if created:
        print(f"Created new activity: {aktivitas}")
    else:
        print(f"Activity already exists: {aktivitas}")
        # If it exists but wrong type, update it? No, assume it's correct or manual fix needed.
        if aktivitas.tipe_aktivitas != 'PILIHAN_GANDA':
            print(f"WARNING: Activity type is {aktivitas.tipe_aktivitas}, expected PILIHAN_GANDA")
            return

    # 4. Create Questions (Soal)
    # Check if questions exist
    if SoalPilihanGanda.objects.filter(aktivitas=aktivitas).exists():
        print("Questions already exist.")
        return

    questions = [
        {
            "q": "Apa tujuan utama dari algoritma Sorting?",
            "a": [
                ("Mengurutkan data berdasarkan kriteria tertentu", True),
                ("Mencari data dalam sekumpulan data", False),
                ("Menghapus data ganda", False),
                ("Mengacak urutan data", False)
            ]
        },
        {
            "q": "Manakah yang TERMASUK algoritma Sorting?",
            "a": [
                ("Bubble Sort", True),
                ("Binary Search", False),
                ("Linear Search", False),
                ("Hashing", False)
            ]
        },
        {
            "q": "Pada Bubble Sort, apa yang dilakukan jika elemen sekarang lebih besar dari elemen berikutnya (ascending)?",
            "a": [
                ("Tukar posisi", True),
                ("Biarkan saja", False),
                ("Hapus elemen", False),
                ("Duplikasi elemen", False)
            ]
        },
        {
            "q": "Algoritma sorting mana yang menggunakan prinsip 'Divide and Conquer'?",
            "a": [
                ("Merge Sort", True),
                ("Bubble Sort", False),
                ("Insertion Sort", False),
                ("Selection Sort", False)
            ]
        },
        {
            "q": "Apa kompleksitas waktu rata-rata dari Quick Sort?",
            "a": [
                ("O(n log n)", True),
                ("O(n^2)", False),
                ("O(n)", False),
                ("O(log n)", False)
            ]
        }
    ]

    for item in questions:
        soal = SoalPilihanGanda.objects.create(
            aktivitas=aktivitas,
            pertanyaan=item["q"]
        )
        for text, is_correct in item["a"]:
            PilihanJawaban.objects.create(
                soal=soal,
                teks_jawaban=text,
                apakah_benar=is_correct
            )
    
    print(f"Created {len(questions)} questions.")

if __name__ == '__main__':
    create_quiz()
