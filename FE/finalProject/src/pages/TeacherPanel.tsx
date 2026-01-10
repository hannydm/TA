import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, PlusCircle, Users, CheckCircle, ClipboardList, AlertTriangle } from 'lucide-react';
import { resolveAvatarUrl } from '@/lib/api';

interface TeacherStudent {
  id: number;
  username: string;
  full_name: string;
  email: string;
  nisn?: string | null;
  kelas?: string | null;
  level: number;
  total_poin: number;
  missions_completed: number;
  quizzes_completed: number;
  avatar?: string | null;
}

interface NewModuleForm {
  judul: string;
  deskripsi: string;
  urutan?: number;
}

interface NewMaterialForm {
  modul_id: string;
  judul: string;
  konten_narasi: string;
  urutan?: number;
  pdfFile?: File | null;
}

interface QuizChoice {
  text: string;
  correct: boolean;
}

interface QuizQuestion {
  pertanyaan: string;
  pilihan: QuizChoice[];
}

interface NewQuizForm {
  materi_id: string;
  instruksi: string;
  poin: number;
  questions: QuizQuestion[];
}

interface TeacherModule {
  id: number;
  judul: string;
  deskripsi: string;
  urutan: number;
  materi_count: number;
  aktivitas_count: number;
}

interface ModulDetailForTeacher {
  id: number;
  judul: string;
  deskripsi: string;
  urutan: number;
  materi_set: {
    id: number;
    judul: string;
    konten_narasi: string;
    urutan: number;
  }[];
}

interface MateriDetailForTeacher {
  id: number;
  judul: string;
  konten_narasi: string;
  aktivitas?: {
    id: number;
    tipe_aktivitas: string;
    instruksi: string;
    poin: number;
    soal_pilgan?: {
      id: number;
      pertanyaan: string;
      pilihan: {
        id: number;
        teks_jawaban: string;
        apakah_benar: boolean;
      }[];
    }[];
  } | null;
}

interface TeacherInfo {
  username: string;
  full_name: string;
  email: string;
}

interface StudentModuleProgress {
  id: number;
  judul: string;
  total_materi: number;
  materi_selesai: number;
}

interface StudentQuizHistory {
  id: number;
  aktivitas_id: number;
  materi_judul: string;
  skor: number;
  tanggal: string;
}

interface StudentBadgeInfo {
  id: number;
  nama: string;
  deskripsi: string;
  tanggal_didapat: string;
}

interface StudentDetail {
  id: number;
  username: string;
  full_name: string;
  email: string;
  nisn?: string | null;
  kelas?: string | null;
  level: number;
  total_poin: number;
  modules: StudentModuleProgress[];
  quizzes_total: number;
  quizzes_avg_score: number;
  recent_quizzes: StudentQuizHistory[];
  avatar?: string | null;
  badges?: StudentBadgeInfo[];
}

interface TeacherBadge {
  id: number;
  nama: string;
  deskripsi: string;
  jenis: 'MODULE_COMPLETE' | 'QUIZ_COUNT';
  modul_terkait: number | null;
  syarat_quiz_count: number | null;
}

interface PuzzleForm {
  modul_id: string;
  materi_id: string;
  instruksi: string;
  poin: number;
  kode_jawaban: string;
  blok_kode_acak: string;
}

interface LiveCodeForm {
  modul_id: string;
  materi_id: string;
  instruksi: string;
  poin: number;
  validasi_html: string;
}

interface NewTeacherForm {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

const TeacherPanel = () => {
  const { authFetch, profile } = useAuth();
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<TeacherModule[]>([]);
  const [materialsForSelectedModule, setMaterialsForSelectedModule] = useState<
    { id: number; judul: string }[]
  >([]);
  const [materialsForPuzzleModule, setMaterialsForPuzzleModule] = useState<
    { id: number; judul: string }[]
  >([]);
  const [materialsForLiveModule, setMaterialsForLiveModule] = useState<
    { id: number; judul: string }[]
  >([]);
  const [materialsForModule, setMaterialsForModule] = useState<
    { id: number; judul: string; konten_narasi: string }[]
  >([]);
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState<string>('');
  const [selectedModuleForPuzzle, setSelectedModuleForPuzzle] = useState<string>('');
  const [selectedModuleForLive, setSelectedModuleForLive] = useState<string>('');
  const [teachers, setTeachers] = useState<TeacherInfo[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<TeacherStudent | null>(null);
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [badges, setBadges] = useState<TeacherBadge[]>([]);
  const [badgeEditingId, setBadgeEditingId] = useState<number | null>(null);
  const [badgeForm, setBadgeForm] = useState({
    nama: '',
    deskripsi: '',
    jenis: 'MODULE_COMPLETE' as 'MODULE_COMPLETE' | 'QUIZ_COUNT',
    modul_id: '',
    syarat_quiz_count: '',
  });

  const [newModule, setNewModule] = useState<NewModuleForm>({
    judul: '',
    deskripsi: '',
  });
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);

  const [newMaterial, setNewMaterial] = useState<NewMaterialForm>({
    modul_id: '',
    judul: '',
    konten_narasi: '',
    pdfFile: null,
  });
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);

  const createEmptyQuestion = (): QuizQuestion => ({
    pertanyaan: '',
    pilihan: [
      { text: '', correct: true },
      { text: '', correct: false },
    ],
  });

  const [newQuiz, setNewQuiz] = useState<NewQuizForm>({
    materi_id: '',
    instruksi: '',
    poin: 20,
    questions: [createEmptyQuestion()],
  });

  const [puzzleForm, setPuzzleForm] = useState<PuzzleForm>({
    modul_id: '',
    materi_id: '',
    instruksi: '',
    poin: 20,
    kode_jawaban: '',
    blok_kode_acak: '',
  });

  const [liveCodeForm, setLiveCodeForm] = useState<LiveCodeForm>({
    modul_id: '',
    materi_id: '',
    instruksi: '',
    poin: 20,
    validasi_html: '',
  });

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('SEMUA');

  const [newTeacher, setNewTeacher] = useState<NewTeacherForm>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [creatingTeacher, setCreatingTeacher] = useState(false);

  // Digunakan untuk meng-scroll ke kartu detail siswa ketika baris tabel diklik
  const detailRef = useRef<HTMLDivElement | null>(null);

  const isTeacher = !!profile?.user?.is_staff;

  // Ringkasan progres global untuk dashboard guru
  // Hitung berdasarkan data yang difilter atau semua? 
  // Biasanya ringkasan global tetap semua siswa, tapi tabelnya yang difilter.
  // Kita biarkan ringkasan global tetap dari `students` (semua).

  const totalStudents = students.length;
  const totalXP = students.reduce((sum, s) => sum + (s.total_poin || 0), 0);
  const totalMissions = students.reduce(
    (sum, s) => sum + (s.missions_completed || 0),
    0,
  );
  const totalQuizzes = students.reduce(
    (sum, s) => sum + (s.quizzes_completed || 0),
    0,
  );
  const avgXPPerStudent =
    totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;

  // Daftar kelas yang tersedia untuk filter
  const availableClasses = ['XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK'];

  const filteredStudents =
    selectedClassFilter === 'SEMUA'
      ? students
      : students.filter((s) => (s.kelas || '').trim() === selectedClassFilter);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [studentsData, modulesData, teachersData, badgesData] = await Promise.all([
          authFetch<TeacherStudent[]>('/api/teacher/students/'),
          authFetch<TeacherModule[]>('/api/teacher/modules/'),
          authFetch<TeacherInfo[]>('/api/teacher/teachers/'),
          authFetch<TeacherBadge[]>('/api/teacher/badges/'),
        ]);

        if (Array.isArray(studentsData)) {
          setStudents(studentsData);
        }
        if (Array.isArray(modulesData)) {
          setModules(modulesData);
        }
        if (Array.isArray(teachersData)) {
          setTeachers(teachersData);
        }
        if (Array.isArray(badgesData)) {
          setBadges(badgesData);
        }
      } catch (e: any) {
        console.error('Failed to load teacher students overview', e);
        setError('Gagal memuat data siswa. Pastikan akun Anda memiliki hak guru/admin.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authFetch]);

  const refreshBadges = async () => {
    try {
      const badgesData = await authFetch<TeacherBadge[]>('/api/teacher/badges/');
      if (Array.isArray(badgesData)) {
        setBadges(badgesData);
      }
    } catch (e) {
      console.error('Failed to refresh badges', e);
    }
  };

  const handleUpdateClass = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    try {
      // Panggil endpoint update profil
      await authFetch('/api/profil/update/', {
        method: 'POST',
        body: JSON.stringify({ kelas: newClass }),
      });
      // Refresh profile di context biar UI update
      window.location.reload(); // Reload simple agar context fresh
    } catch (err) {
      console.error('Failed to update class', err);
      alert('Gagal mengupdate kelas.');
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: NewModuleForm = {
        judul: newModule.judul,
        deskripsi: newModule.deskripsi,
      };
      if (newModule.urutan != null) {
        payload.urutan = newModule.urutan;
      }

      if (editingModuleId) {
        // Gunakan POST ke endpoint update modul.
        // Backend (`teacher_update_module_view`) sekarang menerima
        // POST maupun PUT, sehingga kita tidak bergantung pada
        // dukungan method PUT di server / proxy.
        await authFetch(`/api/teacher/modules/${editingModuleId}/`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        alert('Modul berhasil diperbarui.');
      } else {
        await authFetch('/api/teacher/modules/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        alert('Modul berhasil dibuat.');
      }
      setNewModule({ judul: '', deskripsi: '' });
      setEditingModuleId(null);

      // refresh modules
      const modulesData = await authFetch<TeacherModule[]>('/api/teacher/modules/');
      if (Array.isArray(modulesData)) setModules(modulesData);
    } catch (e: any) {
      console.error('Failed to create/update module', e);
      const backendMessage =
        typeof e?.payload === 'object' && e?.payload !== null && 'error' in e.payload
          ? (e.payload as any).error
          : e?.message;
      setError(
        backendMessage
          ? `Gagal menyimpan modul: ${backendMessage}`
          : 'Gagal menyimpan modul. Periksa input dan coba lagi.'
      );
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const selectedModuleId = newMaterial.modul_id;

      const buildFormData = () => {
        const formData = new FormData();
        if (selectedModuleId) {
          formData.append('modul_id', selectedModuleId);
        }
        formData.append('judul', newMaterial.judul);
        formData.append('konten_narasi', newMaterial.konten_narasi || '');
        if (newMaterial.pdfFile) {
          formData.append('pdf_file', newMaterial.pdfFile);
        }
        return formData;
      };

      if (editingMaterialId) {
        // Sama seperti modul, kita gunakan POST untuk update materi
        // agar tidak bergantung pada dukungan HTTP PUT di proxy.
        const formData = buildFormData();
        await authFetch(`/api/teacher/materials/${editingMaterialId}/`, {
          method: 'POST',
          body: formData,
        });
        alert('Materi berhasil diperbarui.');
      } else {
        const formData = buildFormData();
        await authFetch('/api/teacher/materials/create/', {
          method: 'POST',
          body: formData,
        });
        alert('Materi berhasil dibuat.');
      }
      setNewMaterial({ modul_id: '', judul: '', konten_narasi: '', pdfFile: null });
      setEditingMaterialId(null);

      if (selectedModuleId) {
        handleMaterialModuleChange(selectedModuleId);
      }
    } catch (e: any) {
      console.error('Failed to create/update material', e);
      const backendMessage =
        typeof e?.payload === 'object' && e?.payload !== null && 'error' in e.payload
          ? (e.payload as any).error
          : e?.message;
      setError(
        backendMessage
          ? `Gagal menyimpan materi: ${backendMessage}`
          : 'Gagal menyimpan materi. Periksa input dan coba lagi.'
      );
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const formattedQuestions = newQuiz.questions
        .map((q) => ({
          pertanyaan: q.pertanyaan.trim(),
          pilihan: q.pilihan
            .filter((c) => c.text.trim())
            .map((c) => ({ teks: c.text.trim(), apakah_benar: c.correct })),
        }))
        .filter((q) => q.pertanyaan && q.pilihan.length > 0);

      await authFetch('/api/teacher/quizzes/create/', {
        method: 'POST',
        body: JSON.stringify({
          ...newQuiz,
          materi_id: parseInt(newQuiz.materi_id, 10),
          questions: formattedQuestions,
        }),
      });
      setNewQuiz({
        materi_id: '',
        instruksi: '',
        poin: 20,
        questions: [createEmptyQuestion()],
      });
      alert('Quiz / aktivitas berhasil dibuat.');
    } catch (e: any) {
      console.error('Failed to create quiz', e);
      const detail = e?.detail || e?.message;
      if (detail) {
        setError(`Gagal membuat quiz: ${detail}`);
      } else {
        setError('Gagal membuat quiz. Periksa input dan coba lagi.');
      }
    }
  };

  const fetchMaterialsForModule = async (moduleId: string) => {
    const detail = await authFetch<ModulDetailForTeacher>(`/api/modul/${moduleId}/`);
    return (
      detail.materi_set?.map((m) => ({
        id: m.id,
        judul: m.judul,
      })) ?? []
    );
  };

  const handleSelectModuleForQuiz = async (moduleId: string) => {
    setSelectedModuleForQuiz(moduleId);
    setMaterialsForSelectedModule([]);
    setNewQuiz((prev) => ({ ...prev, materi_id: '' }));

    if (!moduleId) return;

    try {
      const materials = await fetchMaterialsForModule(moduleId);
      setMaterialsForSelectedModule(materials);
    } catch (e) {
      console.error('Failed to load materials for module', e);
    }
  };

  const handleSelectModuleForPuzzle = async (moduleId: string) => {
    setSelectedModuleForPuzzle(moduleId);
    setMaterialsForPuzzleModule([]);
    setPuzzleForm((prev) => ({ ...prev, modul_id: moduleId, materi_id: '' }));

    if (!moduleId) return;
    try {
      const materials = await fetchMaterialsForModule(moduleId);
      setMaterialsForPuzzleModule(materials);
    } catch (e) {
      console.error('Failed to load materials for module (puzzle)', e);
    }
  };

  const handleSelectModuleForLive = async (moduleId: string) => {
    setSelectedModuleForLive(moduleId);
    setMaterialsForLiveModule([]);
    setLiveCodeForm((prev) => ({ ...prev, modul_id: moduleId, materi_id: '' }));

    if (!moduleId) return;
    try {
      const materials = await fetchMaterialsForModule(moduleId);
      setMaterialsForLiveModule(materials);
    } catch (e) {
      console.error('Failed to load materials for module (live code)', e);
    }
  };

  const handleSelectMateriForQuiz = async (materiId: string) => {
    setNewQuiz({
      materi_id: materiId,
      instruksi: '',
      poin: 20,
      questions: [createEmptyQuestion()],
    });

    if (!materiId) return;

    try {
      const detail = await authFetch<MateriDetailForTeacher>(`/api/materi/${materiId}/`);
      const aktivitas = detail.aktivitas;
      if (aktivitas && aktivitas.tipe_aktivitas === 'PILIHAN_GANDA') {
        const questions =
          aktivitas.soal_pilgan?.map((soal) => ({
            pertanyaan: soal.pertanyaan,
            pilihan:
              soal.pilihan?.map((p) => ({
                text: p.teks_jawaban,
                correct: !!p.apakah_benar,
              })) ?? [],
          })) ?? [];

        setNewQuiz({
          materi_id: materiId,
          instruksi: aktivitas.instruksi || '',
          poin: aktivitas.poin ?? 20,
          questions: questions.length > 0 ? questions : [createEmptyQuestion()],
        });
      }
    } catch (e) {
      console.error('Failed to load existing quiz for materi', e);
    }
  };

  const handleCreatePuzzle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authFetch('/api/teacher/puzzles/create/', {
        method: 'POST',
        body: JSON.stringify({
          materi_id: parseInt(puzzleForm.materi_id, 10),
          instruksi: puzzleForm.instruksi,
          poin: puzzleForm.poin,
          kode_jawaban: puzzleForm.kode_jawaban,
          blok_kode_acak: puzzleForm.blok_kode_acak,
        }),
      });
      alert('Puzzle kode berhasil disimpan.');
      setPuzzleForm({
        modul_id: '',
        materi_id: '',
        instruksi: '',
        poin: 20,
        kode_jawaban: '',
        blok_kode_acak: '',
      });
      setSelectedModuleForPuzzle('');
      setMaterialsForPuzzleModule([]);
    } catch (e: any) {
      console.error('Failed to create puzzle activity', e);
      const detail = e?.detail || e?.message;
      if (detail) {
        setError(`Gagal membuat puzzle kode: ${detail}`);
      } else {
        setError('Gagal membuat puzzle kode. Periksa input dan coba lagi.');
      }
    }
  };

  const handleCreateLiveCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authFetch('/api/teacher/livecode/create/', {
        method: 'POST',
        body: JSON.stringify({
          materi_id: parseInt(liveCodeForm.materi_id, 10),
          instruksi: liveCodeForm.instruksi,
          poin: liveCodeForm.poin,
          validasi_html: liveCodeForm.validasi_html,
        }),
      });
      alert('Aktivitas live code berhasil disimpan.');
      setLiveCodeForm({
        modul_id: '',
        materi_id: '',
        instruksi: '',
        poin: 20,
        validasi_html: '',
      });
      setSelectedModuleForLive('');
      setMaterialsForLiveModule([]);
    } catch (e: any) {
      console.error('Failed to create live code activity', e);
      const detail = e?.detail || e?.message;
      if (detail) {
        setError(`Gagal membuat aktivitas live code: ${detail}`);
      } else {
        setError('Gagal membuat aktivitas live code. Periksa input dan coba lagi.');
      }
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreatingTeacher(true);
    try {
      await authFetch('/api/teacher/teachers/create/', {
        method: 'POST',
        body: JSON.stringify(newTeacher),
      });
      alert('Guru baru berhasil ditambahkan.');
      setNewTeacher({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
      });

      // Refresh teacher list
      const teachersData = await authFetch<TeacherInfo[]>('/api/teacher/teachers/');
      if (Array.isArray(teachersData)) {
        setTeachers(teachersData);
      }
    } catch (e: any) {
      console.error('Failed to create teacher', e);
      let detail = e?.detail || e?.message;
      if (typeof e?.payload === 'object' && e?.payload !== null && 'error' in e.payload) {
        detail = (e.payload as any).error;
      } else if (!detail) {
        detail = JSON.stringify(e);
      }
      setError(`Gagal menambahkan guru: ${detail}`);
    } finally {
      setCreatingTeacher(false);
    }
  };

  const handleQuestionTextChange = (index: number, value: string) => {
    setNewQuiz((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], pertanyaan: value };
      return { ...prev, questions };
    });
  };

  const handleChoiceTextChange = (
    qIndex: number,
    cIndex: number,
    value: string
  ) => {
    setNewQuiz((prev) => {
      const questions = [...prev.questions];
      const choices = [...questions[qIndex].pilihan];
      choices[cIndex] = { ...choices[cIndex], text: value };
      questions[qIndex] = { ...questions[qIndex], pilihan: choices };
      return { ...prev, questions };
    });
  };

  const handleChoiceCorrectChange = (qIndex: number, cIndex: number) => {
    setNewQuiz((prev) => {
      const questions = [...prev.questions];
      const choices = questions[qIndex].pilihan.map((choice, idx) => ({
        ...choice,
        correct: idx === cIndex,
      }));
      questions[qIndex] = { ...questions[qIndex], pilihan: choices };
      return { ...prev, questions };
    });
  };

  const handleAddChoice = (qIndex: number) => {
    setNewQuiz((prev) => {
      const questions = [...prev.questions];
      const choices = [...questions[qIndex].pilihan];
      if (choices.length >= 5) return prev;
      choices.push({ text: '', correct: false });
      questions[qIndex] = { ...questions[qIndex], pilihan: choices };
      return { ...prev, questions };
    });
  };

  const handleAddQuestion = () => {
    setNewQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion()],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setNewQuiz((prev) => {
      if (prev.questions.length === 1) return prev;
      const questions = prev.questions.filter((_, i) => i !== index);
      return { ...prev, questions };
    });
  };

  const handleMaterialModuleChange = (modulId: string) => {
    setNewMaterial((prev) => ({ ...prev, modul_id: modulId }));
    setEditingMaterialId(null);
    setMaterialsForModule([]);

    if (!modulId) return;

    (async () => {
      try {
        const detail = await authFetch<ModulDetailForTeacher>(`/api/modul/${modulId}/`);
        const list =
          detail.materi_set?.map((m) => ({
            id: m.id,
            judul: m.judul,
            konten_narasi: m.konten_narasi,
          })) ?? [];
        setMaterialsForModule(list);
      } catch (e) {
        console.error('Failed to load materials for module (material form)', e);
      }
    })();
  };

  const loadStudentDetail = async (student: TeacherStudent) => {
    setSelectedStudent(student);
    setLoadingDetail(true);
    setStudentDetail(null);
    setError(null);
    try {
      const detail = await authFetch<StudentDetail>(
        `/api/teacher/students/${student.id}/detail/`,
      );
      setStudentDetail(detail);

      // Setelah detail berhasil dimuat, scroll ke bagian detail siswa
      if (detailRef.current) {
        detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e: any) {
      console.error('Failed to load student detail', e);
      setError('Gagal memuat detail siswa.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const resetBadgeForm = () => {
    setBadgeForm({
      nama: '',
      deskripsi: '',
      jenis: 'MODULE_COMPLETE',
      modul_id: '',
      syarat_quiz_count: '',
    });
    setBadgeEditingId(null);
  };

  const handleSubmitBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: any = {
        nama: badgeForm.nama,
        deskripsi: badgeForm.deskripsi,
        jenis: badgeForm.jenis,
      };

      if (badgeForm.jenis === 'MODULE_COMPLETE') {
        if (badgeForm.modul_id) {
          payload.modul_id = parseInt(badgeForm.modul_id, 10);
        }
      } else if (badgeForm.jenis === 'QUIZ_COUNT') {
        if (badgeForm.syarat_quiz_count) {
          payload.syarat_quiz_count = parseInt(badgeForm.syarat_quiz_count, 10);
        }
      }

      if (badgeEditingId) {
        // Gunakan POST untuk update badge agar aman di belakang proxy.
        await authFetch(`/api/teacher/badges/${badgeEditingId}/`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        alert('Badge berhasil diperbarui.');
      } else {
        await authFetch('/api/teacher/badges/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        alert('Badge baru berhasil dibuat.');
      }

      resetBadgeForm();
      await refreshBadges();
    } catch (e: any) {
      console.error('Failed to save badge', e);
      setError('Gagal menyimpan badge. Periksa input dan coba lagi.');
    }
  };

  const handleEditBadge = (badge: TeacherBadge) => {
    setBadgeEditingId(badge.id);
    setBadgeForm({
      nama: badge.nama,
      deskripsi: badge.deskripsi,
      jenis: badge.jenis,
      modul_id: badge.modul_terkait ? String(badge.modul_terkait) : '',
      syarat_quiz_count:
        badge.syarat_quiz_count !== null && badge.syarat_quiz_count !== undefined
          ? String(badge.syarat_quiz_count)
          : '',
    });
  };

  const handleDeleteBadge = async (badgeId: number) => {
    if (!window.confirm('Hapus badge ini?')) return;
    setError(null);
    try {
      await authFetch(`/api/teacher/badges/${badgeId}/`, {
        method: 'DELETE',
      });
      await refreshBadges();
    } catch (e: any) {
      console.error('Failed to delete badge', e);
      setError('Gagal menghapus badge.');
    }
  };

  if (!isTeacher) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto mission-card p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-warning mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Teacher Panel</h1>
          <p className="text-muted-foreground">
            Halaman ini hanya dapat diakses oleh akun guru / admin (is_staff).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
            Teacher Control Panel
          </h1>
          <p className="text-muted-foreground">
            Pantau progres siswa dan kelola modul, materi, serta quiz dari satu tempat.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Langkah cepat: 1) Tambah Modul → 2) Pilih modul dan tambah Materi → 3) Pilih modul & materi dan tambah Quiz.
          </p>
        </div>

        {/* Class Selection for Teacher */}
        <div className="max-w-md mx-auto mission-card p-4 flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground mr-2">Kelas Mengajar:</label>
          <select
            className="input-cosmic py-1 px-3 w-auto text-sm"
            value={profile?.kelas || ''}
            onChange={handleUpdateClass}
          >
            <option value="">Pilih Kelas...</option>
            {availableClasses.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mission-card p-4 border border-destructive/50 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Grid: Students overview + Content forms */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Teachers list (Moved from bottom) */}
          <div className="xl:col-span-2 mission-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <Users className="w-5 h-5 text-neon-cyan mr-2" />
              Data Guru
            </h2>
            {teachers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada guru yang terdaftar (is_staff).
              </p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-auto pr-2">
                {teachers.map((t) => (
                  <div
                    key={t.username}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface/40 border border-border/40"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center text-sm font-bold">
                        {t.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {t.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t.email || t.username}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column: content forms + teacher list */}
          <div className="space-y-6">
            {/* Create module */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <BookOpen className="w-5 h-5 text-neon-cyan mr-2" />
                {editingModuleId ? 'Edit Modul' : 'Tambah Modul'}
              </h3>
              <form className="space-y-3" onSubmit={handleCreateModule}>
                <input
                  type="text"
                  className="input-cosmic"
                  placeholder="Judul modul"
                  value={newModule.judul}
                  onChange={(e) =>
                    setNewModule((prev) => ({ ...prev, judul: e.target.value }))
                  }
                  required
                />
                <textarea
                  className="input-cosmic min-h-[80px]"
                  placeholder="Deskripsi modul"
                  value={newModule.deskripsi}
                  onChange={(e) =>
                    setNewModule((prev) => ({ ...prev, deskripsi: e.target.value }))
                  }
                />
                <button
                  type="submit"
                  className="btn-neon w-full flex items-center justify-center space-x-2 py-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{editingModuleId ? 'Update Modul' : 'Simpan Modul'}</span>
                </button>
                {editingModuleId && (
                  <button
                    type="button"
                    className="w-full mt-2 text-xs text-muted-foreground hover:text-neon-cyan"
                    onClick={() => {
                      setEditingModuleId(null);
                      setNewModule({ judul: '', deskripsi: '' });
                    }}
                  >
                    Batal edit
                  </button>
                )}
              </form>

              {/* Quick list of modules to edit */}
              {modules.length > 0 && (
                <div className="mt-4 space-y-1 max-h-40 overflow-auto pr-1">
                  {modules.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="w-full flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-surface/40 hover:bg-surface/60 text-foreground"
                      onClick={() => {
                        setEditingModuleId(m.id);
                        setNewModule({ judul: m.judul, deskripsi: m.deskripsi });
                      }}
                    >
                      <span className="truncate">
                        {m.urutan}. {m.judul}
                      </span>
                      <span className="text-muted-foreground ml-2">Edit</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create material */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 text-neon-magenta mr-2" />
                {editingMaterialId ? 'Edit Materi' : 'Tambah Materi'}
              </h3>
              <form className="space-y-3" onSubmit={handleCreateMaterial}>
                <select
                  className="input-cosmic"
                  value={newMaterial.modul_id}
                  onChange={(e) => handleMaterialModuleChange(e.target.value)}
                  required
                >
                  <option value="">Pilih modul...</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.urutan}. {m.judul}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="input-cosmic"
                  placeholder="Judul materi"
                  value={newMaterial.judul}
                  onChange={(e) =>
                    setNewMaterial((prev) => ({ ...prev, judul: e.target.value }))
                  }
                  required
                />
                <textarea
                  className="input-cosmic min-h-[80px]"
                  placeholder="Konten / narasi materi"
                  value={newMaterial.konten_narasi}
                  onChange={(e) =>
                    setNewMaterial((prev) => ({
                      ...prev,
                      konten_narasi: e.target.value,
                    }))
                  }
                />
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    File PDF (opsional)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="input-cosmic cursor-pointer"
                    onChange={(e) =>
                      setNewMaterial((prev) => ({
                        ...prev,
                        pdfFile: e.target.files && e.target.files[0] ? e.target.files[0] : null,
                      }))
                    }
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Kamu bisa menulis narasi, mengunggah PDF, atau keduanya sekaligus.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pilih modul terlebih dahulu, lalu isi judul dan konten materi atau unggah PDF.
                </p>
                <button
                  type="submit"
                  className="btn-neon w-full flex items-center justify-center space-x-2 py-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{editingMaterialId ? 'Update Materi' : 'Simpan Materi'}</span>
                </button>
                {editingMaterialId && (
                  <button
                    type="button"
                    className="w-full mt-2 text-xs text-muted-foreground hover:text-neon-cyan"
                    onClick={() => {
                      setEditingMaterialId(null);
                      setNewMaterial({ modul_id: '', judul: '', konten_narasi: '', pdfFile: null });
                    }}
                  >
                    Batal edit materi
                  </button>
                )}
              </form>

              {newMaterial.modul_id && materialsForModule.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Materi di modul ini
                  </p>
                  <div className="space-y-1 max-h-40 overflow-auto pr-1">
                    {materialsForModule.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className="w-full flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-surface/40 hover:bg-surface/60 text-foreground"
                        onClick={() => {
                          setEditingMaterialId(m.id);
                          setNewMaterial({
                            modul_id: newMaterial.modul_id,
                            judul: m.judul,
                            konten_narasi: m.konten_narasi,
                            pdfFile: null,
                          });
                        }}
                      >
                        <span className="truncate">{m.judul}</span>
                        <span className="text-muted-foreground ml-2">Edit</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Create quiz */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-success mr-2" />
                Tambah Quiz Pilihan Ganda
              </h3>
              <form className="space-y-3" onSubmit={handleCreateQuiz}>
                <select
                  className="input-cosmic"
                  value={selectedModuleForQuiz}
                  onChange={(e) => handleSelectModuleForQuiz(e.target.value)}
                >
                  <option value="">Pilih modul...</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.urutan}. {m.judul}
                    </option>
                  ))}
                </select>
                <select
                  className="input-cosmic"
                  value={newQuiz.materi_id}
                  onChange={(e) => handleSelectMateriForQuiz(e.target.value)}
                  required
                  disabled={!selectedModuleForQuiz}
                >
                  <option value="">Pilih materi...</option>
                  {materialsForSelectedModule.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.judul}
                    </option>
                  ))}
                </select>
                <textarea
                  className="input-cosmic min-h-[60px]"
                  placeholder="Instruksi quiz"
                  value={newQuiz.instruksi}
                  onChange={(e) =>
                    setNewQuiz((prev) => ({ ...prev, instruksi: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="input-cosmic"
                  placeholder="Poin (XP)"
                  value={newQuiz.poin}
                  onChange={(e) =>
                    setNewQuiz((prev) => ({
                      ...prev,
                      poin: Number(e.target.value) || 0,
                    }))
                  }
                />

                {/* Questions Builder */}
                <div className="space-y-4 mt-4">
                  {newQuiz.questions.map((q, qIndex) => (
                    <div
                      key={qIndex}
                      className="p-3 rounded-lg border border-border/60 bg-surface/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          Soal {qIndex + 1}
                        </span>
                        {newQuiz.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="text-xs text-destructive hover:underline"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        className="input-cosmic text-sm"
                        placeholder="Tulis pertanyaan"
                        value={q.pertanyaan}
                        onChange={(e) =>
                          handleQuestionTextChange(qIndex, e.target.value)
                        }
                      />
                      <div className="space-y-2">
                        {q.pilihan.map((c, cIndex) => (
                          <div
                            key={cIndex}
                            className="flex items-center space-x-2 text-xs"
                          >
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={c.correct}
                              onChange={() =>
                                handleChoiceCorrectChange(qIndex, cIndex)
                              }
                            />
                            <input
                              type="text"
                              className="flex-1 input-cosmic text-xs"
                              placeholder={`Pilihan ${cIndex + 1}`}
                              value={c.text}
                              onChange={(e) =>
                                handleChoiceTextChange(
                                  qIndex,
                                  cIndex,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                        {q.pilihan.length < 5 && (
                          <button
                            type="button"
                            onClick={() => handleAddChoice(qIndex)}
                            className="text-[11px] text-neon-cyan hover:underline"
                          >
                            + Tambah pilihan
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-xs text-neon-magenta hover:underline"
                  >
                    + Tambah soal lagi
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Pilih modul dan materi terlebih dahulu, lalu tulis pertanyaan dan pilihan jawaban.
                  Pilih satu jawaban yang benar untuk setiap soal.
                </p>
                <button
                  type="submit"
                  className="btn-neon w-full flex items-center justify-center space-x-2 py-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Quiz</span>
                </button>
              </form>
            </div>

            {/* Create puzzle code activity */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-neon-magenta mr-2" />
                Tambah Puzzle Kode
              </h3>
              <form className="space-y-3" onSubmit={handleCreatePuzzle}>
                <select
                  className="input-cosmic"
                  value={selectedModuleForPuzzle}
                  onChange={(e) => handleSelectModuleForPuzzle(e.target.value)}
                >
                  <option value="">Pilih modul...</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.urutan}. {m.judul}
                    </option>
                  ))}
                </select>
                <select
                  className="input-cosmic"
                  value={puzzleForm.materi_id}
                  onChange={(e) =>
                    setPuzzleForm((prev) => ({ ...prev, materi_id: e.target.value }))
                  }
                  required
                  disabled={!selectedModuleForPuzzle}
                >
                  <option value="">Pilih materi...</option>
                  {materialsForPuzzleModule.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.judul}
                    </option>
                  ))}
                </select>
                <textarea
                  className="input-cosmic min-h-[60px]"
                  placeholder="Instruksi puzzle (apa yang harus disusun siswa)"
                  value={puzzleForm.instruksi}
                  onChange={(e) =>
                    setPuzzleForm((prev) => ({ ...prev, instruksi: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="input-cosmic"
                  placeholder="Poin (XP)"
                  value={puzzleForm.poin}
                  onChange={(e) =>
                    setPuzzleForm((prev) => ({
                      ...prev,
                      poin: Number(e.target.value) || 0,
                    }))
                  }
                />
                <textarea
                  className="input-cosmic min-h-[60px] font-mono text-sm"
                  placeholder="Kode jawaban benar (satu baris, misal: printf(&quot;Halo&quot;);)"
                  value={puzzleForm.kode_jawaban}
                  onChange={(e) =>
                    setPuzzleForm((prev) => ({ ...prev, kode_jawaban: e.target.value }))
                  }
                  required
                />
                <textarea
                  className="input-cosmic min-h-[60px] font-mono text-sm"
                  placeholder="Blok kode dipisah koma, contoh: printf(&quot;Halo&quot;),;"
                  value={puzzleForm.blok_kode_acak}
                  onChange={(e) =>
                    setPuzzleForm((prev) => ({ ...prev, blok_kode_acak: e.target.value }))
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Blok kode akan diacak di sisi siswa. Siswa harus menyusun ulang blok
                  tersebut agar sama dengan kode jawaban.
                </p>
                <button
                  type="submit"
                  className="btn-neon w-full flex items-center justify-center space-x-2 py-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Puzzle</span>
                </button>
              </form>
            </div>

            {/* Create live code activity */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-success mr-2" />
                Tambah Live Code (HTML)
              </h3>
              <form className="space-y-3" onSubmit={handleCreateLiveCode}>
                <select
                  className="input-cosmic"
                  value={selectedModuleForLive}
                  onChange={(e) => handleSelectModuleForLive(e.target.value)}
                >
                  <option value="">Pilih modul...</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.urutan}. {m.judul}
                    </option>
                  ))}
                </select>
                <select
                  className="input-cosmic"
                  value={liveCodeForm.materi_id}
                  onChange={(e) =>
                    setLiveCodeForm((prev) => ({ ...prev, materi_id: e.target.value }))
                  }
                  required
                  disabled={!selectedModuleForLive}
                >
                  <option value="">Pilih materi...</option>
                  {materialsForLiveModule.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.judul}
                    </option>
                  ))}
                </select>
                <textarea
                  className="input-cosmic min-h-[60px]"
                  placeholder="Instruksi live code (misalnya: Buat halaman dengan judul &lt;h1&gt;Halo Dunia&lt;/h1&gt;)"
                  value={liveCodeForm.instruksi}
                  onChange={(e) =>
                    setLiveCodeForm((prev) => ({ ...prev, instruksi: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="input-cosmic"
                  placeholder="Poin (XP)"
                  value={liveCodeForm.poin}
                  onChange={(e) =>
                    setLiveCodeForm((prev) => ({
                      ...prev,
                      poin: Number(e.target.value) || 0,
                    }))
                  }
                />
                <input
                  type="text"
                  className="input-cosmic font-mono text-sm"
                  placeholder='Teks/tag yang harus ada, contoh: &lt;h1&gt; atau "Halo Dunia"'
                  value={liveCodeForm.validasi_html}
                  onChange={(e) =>
                    setLiveCodeForm((prev) => ({
                      ...prev,
                      validasi_html: e.target.value,
                    }))
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Kode siswa dianggap benar jika mengandung teks/tag yang kamu tulis di
                  kolom validasi (contoh: &lt;h1&gt; atau kata tertentu).
                </p>
                <button
                  type="submit"
                  className="btn-neon w-full flex items-center justify-center space-x-2 py-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Live Code</span>
                </button>
              </form>
            </div>

            {/* Badges management */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 text-neon-cyan mr-2" />
                {badgeEditingId ? 'Edit Badge' : 'Tambah Badge'}
              </h3>
              <form className="space-y-3" onSubmit={handleSubmitBadge}>
                <input
                  type="text"
                  className="input-cosmic"
                  placeholder="Nama badge"
                  value={badgeForm.nama}
                  onChange={(e) =>
                    setBadgeForm((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  required
                />
                <textarea
                  className="input-cosmic min-h-[60px]"
                  placeholder="Deskripsi singkat badge"
                  value={badgeForm.deskripsi}
                  onChange={(e) =>
                    setBadgeForm((prev) => ({ ...prev, deskripsi: e.target.value }))
                  }
                />
                <select
                  className="input-cosmic"
                  value={badgeForm.jenis}
                  onChange={(e) => {
                    const value = e.target.value as 'MODULE_COMPLETE' | 'QUIZ_COUNT';
                    setBadgeForm((prev) => ({
                      ...prev,
                      jenis: value,
                    }));
                  }}
                >
                  <option value="MODULE_COMPLETE">Selesaikan Modul</option>
                  <option value="QUIZ_COUNT">Jumlah Quiz Selesai</option>
                </select>

                {badgeForm.jenis === 'MODULE_COMPLETE' && (
                  <select
                    className="input-cosmic"
                    value={badgeForm.modul_id}
                    onChange={(e) =>
                      setBadgeForm((prev) => ({ ...prev, modul_id: e.target.value }))
                    }
                    required
                  >
                    <option value="">Pilih modul terkait...</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.urutan}. {m.judul}
                      </option>
                    ))}
                  </select>
                )}

                {badgeForm.jenis === 'QUIZ_COUNT' && (
                  <input
                    type="number"
                    className="input-cosmic"
                    placeholder="Minimal jumlah quiz yang harus selesai"
                    value={badgeForm.syarat_quiz_count}
                    onChange={(e) =>
                      setBadgeForm((prev) => ({
                        ...prev,
                        syarat_quiz_count: e.target.value,
                      }))
                    }
                    required
                  />
                )}

                <p className="text-xs text-muted-foreground">
                  MODULE_COMPLETE: badge diberikan jika siswa menyelesaikan semua materi dan
                  quiz di modul terpilih. QUIZ_COUNT: badge diberikan jika jumlah quiz selesai
                  mencapai angka tertentu.
                </p>

                <button
                  type="submit"
                  className="btn-neon w-full flex items-center justify-center space-x-2 py-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{badgeEditingId ? 'Update Badge' : 'Simpan Badge'}</span>
                </button>

                {badgeEditingId && (
                  <button
                    type="button"
                    className="w-full mt-2 text-xs text-muted-foreground hover:text-neon-cyan"
                    onClick={resetBadgeForm}
                  >
                    Batal edit badge
                  </button>
                )}
              </form>

              <div className="mt-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                  Daftar Badge
                </h4>
                {badges.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Belum ada badge yang dibuat.
                  </p>
                ) : (
                  <div className="space-y-1 max-h-40 overflow-auto pr-1">
                    {badges.map((b) => {
                      const modulName =
                        b.modul_terkait != null
                          ? modules.find((m) => m.id === b.modul_terkait)?.judul || '-'
                          : null;
                      return (
                        <div
                          key={b.id}
                          className="flex items-center justify-between px-2 py-1 rounded-lg bg-surface/40 border border-border/40 text-xs"
                        >
                          <div className="flex-1 pr-2">
                            <p className="font-semibold text-foreground truncate">
                              {b.nama}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {b.jenis === 'MODULE_COMPLETE'
                                ? modulName
                                  ? `Selesaikan semua materi + quiz di modul "${modulName}"`
                                  : 'Selesaikan satu modul tertentu.'
                                : `Selesaikan minimal ${b.syarat_quiz_count ?? 0} quiz`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              className="text-[11px] text-neon-cyan hover:underline"
                              onClick={() => handleEditBadge(b)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-[11px] text-destructive hover:underline"
                              onClick={() => handleDeleteBadge(b.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>



            {/* Add Teacher Form */}
            {/* Add Teacher Form - ONLY FOR SUPERUSERS */}
            {profile?.user?.is_superuser && (
              <div className="mission-card p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                  <Users className="w-5 h-5 text-neon-magenta mr-2" />
                  Tambah Guru Baru
                </h3>
                <form className="space-y-3" onSubmit={handleCreateTeacher}>
                  <input
                    type="text"
                    className="input-cosmic"
                    placeholder="Username"
                    value={newTeacher.username}
                    onChange={(e) =>
                      setNewTeacher((prev) => ({ ...prev, username: e.target.value }))
                    }
                    required
                  />
                  <input
                    type="email"
                    className="input-cosmic"
                    placeholder="Email"
                    value={newTeacher.email}
                    onChange={(e) =>
                      setNewTeacher((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                  <input
                    type="text"
                    className="input-cosmic"
                    placeholder="Nama Depan"
                    value={newTeacher.first_name}
                    onChange={(e) =>
                      setNewTeacher((prev) => ({ ...prev, first_name: e.target.value }))
                    }
                    required
                  />
                  <input
                    type="text"
                    className="input-cosmic"
                    placeholder="Nama Belakang"
                    value={newTeacher.last_name}
                    onChange={(e) =>
                      setNewTeacher((prev) => ({ ...prev, last_name: e.target.value }))
                    }
                  />
                  <input
                    type="password"
                    className="input-cosmic"
                    placeholder="Password"
                    value={newTeacher.password}
                    onChange={(e) =>
                      setNewTeacher((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                  <button
                    type="submit"
                    disabled={creatingTeacher}
                    className="btn-neon w-full flex items-center justify-center space-x-2 py-2 disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{creatingTeacher ? 'Menambahkan...' : 'Tambah Guru'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Teachers list moved to main area */}
          </div>
        </div>

        {/* Detail siswa terpilih */}

      </div>
    </div >
  );
};

export default TeacherPanel;
