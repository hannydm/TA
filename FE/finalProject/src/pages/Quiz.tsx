import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Brain, Clock, CheckCircle, X, Zap, Trophy, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import XPToast from '@/components/XPToast';
import NotificationToast from '@/components/NotificationToast';
import { useAuth } from '@/hooks/useAuth';

interface QuizState {
  currentQuestion: number;
  selectedAnswers: number[];
  showResults: boolean;
  score: number;
  timeLeft: number;
}

interface ApiPilihanJawaban {
  id: number;
  teks_jawaban: string;
  apakah_benar: boolean;
}

interface ApiSoalPilgan {
  id: number;
  pertanyaan: string;
  pilihan: ApiPilihanJawaban[];
}

interface ApiAktivitasQuiz {
  id: number;
  materi: number;
  instruksi: string;
  poin: number;
  soal_pilgan: ApiSoalPilgan[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface QuizHistory {
  selectedAnswers: number[];
  score: number;
  questionIds?: number[];
}

interface QuizOverallSummary {
  total_attempts: number;
  distinct_quizzes: number;
  total_score: number;
  average_score: number;
}

const Quiz = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: [],
    showResults: false,
    score: 0,
    timeLeft: 300 // 5 minutes
  });
  const [showXPToast, setShowXPToast] = useState<number | null>(null);
  const [levelUpToast, setLevelUpToast] = useState<number | null>(null);
  const [badgeToast, setBadgeToast] = useState<string | null>(null);
  const [apiQuizzes, setApiQuizzes] = useState<ApiAktivitasQuiz[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [overallSummary, setOverallSummary] = useState<QuizOverallSummary | null>(null);
  const { authFetch, refreshProfile, profile } = useAuth();
  const [isMuted, setIsMuted] = useState(false);

  // Audio State
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const quizSfxRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background music
  useEffect(() => {
    bgmRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=background-music-for-video-blog-low-fi-hip-hop-10675.mp3');
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.3;

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
      if (quizSfxRef.current) {
        quizSfxRef.current.pause();
        quizSfxRef.current = null;
      }
    };
  }, []);

  // Initialize quiz SFX (short click / confirm sound)
  useEffect(() => {
    quizSfxRef.current = new Audio(
      'https://cdn.pixabay.com/download/audio/2022/03/15/audio_ae9b2c2727.mp3?filename=click-soft-124467.mp3',
    );
    if (quizSfxRef.current) {
      quizSfxRef.current.volume = 0.4;
    }
  }, []);

  const playQuizSfx = () => {
    if (isMuted || !quizSfxRef.current) return;
    try {
      const clone = quizSfxRef.current.cloneNode(true) as HTMLAudioElement;
      clone.volume = quizSfxRef.current.volume;
      clone.play().catch(() => { });
    } catch {
      // ignore audio errors
    }
  };

  // Control background music based on quiz state
  useEffect(() => {
    if (selectedQuiz && !quizState.showResults && !isMuted && bgmRef.current) {
      bgmRef.current.play().catch(e => console.log("Audio play failed (user interaction needed):", e));
    } else if (bgmRef.current) {
      bgmRef.current.pause();
    }
  }, [selectedQuiz, quizState.showResults, isMuted]);

  useEffect(() => {
    let cancelled = false;

    const loadQuizzes = async () => {
      try {
        const data = await authFetch<ApiAktivitasQuiz[] | any>('/api/quiz/');
        if (!Array.isArray(data) || cancelled) return;
        setApiQuizzes(data);
      } catch (error) {
        console.error('Gagal memuat quiz dari API, menggunakan data lokal.', error);
      }
    };

    loadQuizzes();

    return () => {
      cancelled = true;
    };
  }, [authFetch]);

  // Auto-start quiz from URL parameter
  useEffect(() => {
    const quizIdParam = searchParams.get('id');
    if (quizIdParam && apiQuizzes.length > 0 && !selectedQuiz) {
      const targetQuiz = apiQuizzes.find(q => String(q.id) === quizIdParam);
      if (targetQuiz) {
        handleStartQuiz(String(targetQuiz.id));
      }
    }
  }, [searchParams, apiQuizzes, selectedQuiz]);

  const quizList = apiQuizzes.map((q, index) => ({
    id: String(q.id),
    title: `Kuis ${index + 1}`,
    description: q.instruksi || 'Kuis dari admin',
    questions: Math.min(10, q.soal_pilgan.length),
    difficulty: 'Kustom',
    timeLimit: `${Math.min(10, q.soal_pilgan.length || 1)} menit`,
    xpReward: q.poin || 20,
  }));

  const currentQuiz = quizList.find((q) => q.id === selectedQuiz);

  // Pertanyaan yang sedang digunakan pada attempt saat ini
  const questions = currentQuestions;

  // Timer Logic
  useEffect(() => {
    if (!selectedQuiz || quizState.showResults) return;

    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(); // Auto submit
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedQuiz, quizState.showResults]);

  const userKey =
    profile?.user?.username ||
    (profile?.user?.email ? profile.user.email.split('@')[0] : 'guest');
  const QUIZ_HISTORY_PREFIX = `digi_world_quiz_history_${userKey}_`;
  const NEXT_QUIZ_KEY = 'digi_world_next_quiz';

  const loadQuizHistory = (quizId: string): QuizHistory | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(
        `${QUIZ_HISTORY_PREFIX}${quizId}`,
      );
      if (!raw) return null;
      return JSON.parse(raw) as QuizHistory;
    } catch {
      return null;
    }
  };

  const saveQuizHistory = (quizId: string, data: QuizHistory) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(`${QUIZ_HISTORY_PREFIX}${quizId}`, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  };

  const handleStartQuiz = (quizId: string, forceNew: boolean = false) => {
    setSelectedQuiz(quizId);

    const apiQuiz = apiQuizzes.find((q) => String(q.id) === quizId);
    const allQuestions: Question[] =
      apiQuiz?.soal_pilgan.map((s) => ({
        id: s.id,
        question: s.pertanyaan,
        options: s.pilihan.map((p) => p.teks_jawaban),
        correct: Math.max(
          0,
          s.pilihan.findIndex((p) => p.apakah_benar),
        ),
      })) ?? [];

    // Jika tidak ada soal, pastikan state kosong tapi tetap aman
    if (!allQuestions.length) {
      setCurrentQuestions([]);
    }

    if (!forceNew) {
      const history = loadQuizHistory(quizId);
      if (history && history.questionIds && history.questionIds.length) {
        // Rekonstruksi urutan soal yang dipakai sebelumnya
        const questionMap = new Map<number, Question>();
        allQuestions.forEach((q) => questionMap.set(q.id, q));
        const restoredQuestions: Question[] = [];
        history.questionIds.forEach((qid) => {
          const found = questionMap.get(qid);
          if (found) restoredQuestions.push(found);
        });

        if (restoredQuestions.length) {
          setCurrentQuestions(restoredQuestions);
          const calculatedTime = restoredQuestions.length * 60;

          setQuizState({
            currentQuestion: 0,
            selectedAnswers: history.selectedAnswers || [],
            showResults: true,
            score: history.score || 0,
            timeLeft: calculatedTime > 0 ? calculatedTime : 300,
          });
          return;
        }
      }
    }

    // Pilih 10 soal secara acak (atau kurang jika total soal < 10)
    if (allQuestions.length) {
      const shuffled = [...allQuestions].sort(
        () => Math.random() - 0.5,
      );
      const subset = shuffled.slice(0, Math.min(10, shuffled.length));
      setCurrentQuestions(subset);
      const timeForSubset = subset.length * 60;

      setQuizState({
        currentQuestion: 0,
        selectedAnswers: [],
        showResults: false,
        score: 0,
        timeLeft: timeForSubset > 0 ? timeForSubset : 300,
      });
      return;
    }

    // Fallback jika tidak ada soal (seharusnya tidak terjadi)
    setCurrentQuestions([]);
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: [],
      showResults: false,
      score: 0,
      timeLeft: 300,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...quizState.selectedAnswers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    setQuizState({ ...quizState, selectedAnswers: newAnswers });
    playQuizSfx();
  };

  const handleNext = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState({ ...quizState, currentQuestion: quizState.currentQuestion + 1 });
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    // Hitung XP berdasarkan jumlah jawaban benar.
    // Contoh: 10 pertanyaan, 20 XP -> 1 soal = 2 XP.
    const totalQuizPoints = currentQuiz?.xpReward || 20;
    const pointsPerQuestion =
      questions.length > 0 ? totalQuizPoints / questions.length : 0;

    let calculatedScore = 0;
    let correctCount = 0;

    questions.forEach((question, index) => {
      if (quizState.selectedAnswers[index] === question.correct) {
        calculatedScore += pointsPerQuestion;
        correctCount++;
      }
    });

    // Bulatkan ke integer terdekat dan batasi maksimum ke totalQuizPoints.
    const finalScore = Math.min(
      totalQuizPoints,
      Math.max(0, Math.round(calculatedScore)),
    );

    setQuizState((prev) => ({
      ...prev,
      score: correctCount,
      showResults: true,
    }));

    if (selectedQuiz) {
      saveQuizHistory(selectedQuiz, {
        selectedAnswers: quizState.selectedAnswers,
        score: correctCount,
        questionIds: questions.map((q) => q.id),
      });
    }

    // Tampilkan jumlah XP yang benar‑benar didapat dari quiz ini.
    setShowXPToast(finalScore);

    // Jika quiz berasal dari backend, simpan hasil ke backend.
    if (selectedQuiz && apiQuizzes.length) {
      const apiQuiz = apiQuizzes.find((q) => String(q.id) === selectedQuiz);
      if (apiQuiz) {
        try {
          // Kirim skor ke backend; backend hanya menambah selisih
          // dibanding skor terbaik sebelumnya untuk aktivitas ini.
          const response = await authFetch<any>('/api/submit-skor/', {
            method: 'POST',
            body: JSON.stringify({
              aktivitas_id: apiQuiz.id,
              skor: finalScore,
            }),
          });

          if (response?.level_up && response?.new_level) {
            setLevelUpToast(response.new_level);
          }
          if (response?.new_badge) {
            setBadgeToast(response.new_badge);
          }

          // Tandai materi terkait sebagai selesai
          await authFetch('/api/tandai-selesai/', {
            method: 'POST',
            body: JSON.stringify({
              materi_id: apiQuiz.materi,
            }),
          });
        } catch (error) {
          console.error('Gagal menyimpan hasil quiz ke backend', error);
        }
      }
    }

    // Sinkronkan XP dengan backend setelah quiz selesai
    try {
      await refreshProfile();
      // Setelah XP tersinkron, ambil rangkuman nilai kuis dari backend
      try {
        const summary = await authFetch<QuizOverallSummary>('/api/quiz/summary/');
        if (summary) {
          setOverallSummary(summary);
        }
      } catch (summaryErr) {
        console.error('Gagal memuat rangkuman kuis', summaryErr);
      }
    } catch (err) {
      console.error('Gagal refresh profil setelah quiz', err);
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setCurrentQuestions([]);
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: [],
      showResults: false,
      score: 0,
      timeLeft: 300
    });
    // Hapus query ?id=... supaya quiz tidak otomatis terbuka lagi
    setSearchParams({});
  };

  // Quiz Results View
  if (quizState.showResults && selectedQuiz) {
    const percentage = (quizState.score / questions.length) * 100;
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mission-card p-8 text-center">
            {/* Results Header */}
            <div className="mb-8">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isExcellent ? 'bg-gradient-to-br from-neon-cyan to-neon-magenta glow-cyan' :
                isGood ? 'bg-success/20' : 'bg-warning/20'
                }`}>
                <Trophy className={`w-10 h-10 ${isExcellent ? 'text-background' :
                  isGood ? 'text-success' : 'text-warning'
                  }`} />
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-2">
                Kuis Selesai!
              </h2>
              <p className="text-muted-foreground">
                {currentQuiz?.title}
              </p>
            </div>

            {/* Score Display */}
            <div className="space-y-6 mb-8">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${isExcellent ? 'text-neon-cyan' :
                  isGood ? 'text-success' : 'text-warning'
                  }`}>
                  {percentage.toFixed(0)}%
                </div>
                <p className="text-xl text-foreground">
                  {quizState.score} dari {questions.length} soal benar
                </p>
              </div>

              {/* Performance Message */}
              <div className={`p-4 rounded-xl ${isExcellent ? 'bg-neon-cyan/20 border border-neon-cyan/50' :
                isGood ? 'bg-success/20 border border-success/50' :
                  'bg-warning/20 border border-warning/50'
                }`}>
                <p className={`font-medium ${isExcellent ? 'text-neon-cyan' :
                  isGood ? 'text-success' : 'text-warning'
                  }`}>
                  {isExcellent
                    ? 'Luar biasa! Performa setara komandan luar angkasa!'
                    : isGood
                      ? 'Kerja bagus! Terus jelajahi materi!'
                      : 'Terus belajar untuk menaklukkan jagat raya!'}
                </p>
              </div>

              {/* XP Rewards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                  <span className="text-muted-foreground">Partisipasi kuis</span>
                  <span className="text-neon-cyan font-medium">+{currentQuiz?.xpReward} XP</span>
                </div>
                {isExcellent && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neon-magenta/20">
                    <span className="text-neon-magenta">Bonus: Nilai 80%+</span>
                    <span className="text-neon-magenta font-medium">+30 XP</span>
                  </div>
                )}
              </div>

              {/* Overall Quiz Summary */}
              {overallSummary && (
                <div className="mission-card p-4 mt-4 text-left bg-surface/40">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Rangkuman Nilai Kuis Kamu
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Kuis berbeda yang sudah kamu coba:{" "}
                    <span className="font-semibold text-foreground">
                      {overallSummary.distinct_quizzes}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total percobaan kuis:{" "}
                    <span className="font-semibold text-foreground">
                      {overallSummary.total_attempts}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total skor/XP dari semua kuis:{" "}
                    <span className="font-semibold text-foreground">
                      {overallSummary.total_score}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rata-rata skor per percobaan:{" "}
                    <span className="font-semibold text-foreground">
                      {overallSummary.average_score.toFixed(1)}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Answer Summary */}
            <div className="mission-card p-6 text-left">
              <h3 className="text-lg font-bold text-foreground mb-4">Rangkuman Jawaban</h3>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const chosenIdx = quizState.selectedAnswers[idx];
                  const isCorrect = chosenIdx === q.correct;
                  const chosenText = chosenIdx === undefined ? 'Tidak ada jawaban' : q.options[chosenIdx] || 'Tidak ada jawaban';
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border bg-surface/30"
                    >
                      <p className="font-semibold text-foreground mb-1">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                        <span className={isCorrect ? 'text-success font-semibold' : 'text-destructive font-semibold'}>
                          {isCorrect ? 'Benar' : 'Salah'}
                        </span>
                        <span className="text-muted-foreground">
                          Jawaban kamu: {chosenText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleBackToQuizzes}
                className="btn-neon w-full py-3"
              >
                Kembali ke daftar kuis
              </button>
              <button
                onClick={() => selectedQuiz && handleStartQuiz(selectedQuiz, true)}
                className="w-full px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan transition-colors"
              >
                Ulangi kuis
              </button>
            </div>
          </div>
        </div>

        {/* XP Toast */}
        {showXPToast && (
          <XPToast
            amount={showXPToast}
            onComplete={() => setShowXPToast(null)}
          />
        )}
        {levelUpToast && (
          <NotificationToast
            type="levelup"
            title="Level Up!"
            message={`Kamu naik ke level ${levelUpToast}. Hebat!`}
            onClose={() => setLevelUpToast(null)}
            duration={5000}
          />
        )}
        {badgeToast && (
          <NotificationToast
            type="badge"
            title="Badge Baru!"
            message={`Selamat, kamu mendapatkan badge ${badgeToast}.`}
            onClose={() => setBadgeToast(null)}
            duration={5000}
          />
        )}
      </div>
    );
  }

  // Quiz Taking View
  if (selectedQuiz && questions.length > 0) {
    const currentQuestion = questions[quizState.currentQuestion];
    const progress = ((quizState.currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Quiz Header */}
          <div className="mission-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackToQuizzes}
                className="text-muted-foreground hover:text-neon-cyan transition-colors"
              >
                Kembali ke daftar kuis
              </button>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-neon-cyan transition-colors"
                  title={isMuted ? 'Nyalakan musik' : 'Matikan musik'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(quizState.timeLeft / 60)}:{(quizState.timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">{currentQuiz?.title}</h1>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Pertanyaan {quizState.currentQuestion + 1} dari {questions.length}
                </span>
                <span className="text-neon-cyan">{progress.toFixed(0)}% Selesai</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="mission-card p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${quizState.selectedAnswers[quizState.currentQuestion] === index
                    ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan'
                    : 'border-border bg-surface/30 text-foreground hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${quizState.selectedAnswers[quizState.currentQuestion] === index
                      ? 'border-neon-cyan bg-neon-cyan'
                      : 'border-muted-foreground'
                      }`}>
                      {quizState.selectedAnswers[quizState.currentQuestion] === index && (
                        <CheckCircle className="w-4 h-4 text-background" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setQuizState({ ...quizState, currentQuestion: quizState.currentQuestion - 1 })}
                disabled={quizState.currentQuestion === 0}
                className="px-6 py-2 rounded-lg border border-border text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>

              <button
                onClick={handleNext}
                disabled={quizState.selectedAnswers[quizState.currentQuestion] === undefined}
                className="btn-neon px-6 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {quizState.currentQuestion === questions.length - 1 ? 'Kirim jawaban' : 'Berikutnya'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {levelUpToast && (
          <NotificationToast
            type="levelup"
            title="Level Up!"
            message={`Kamu naik ke level ${levelUpToast}. Hebat!`}
            onClose={() => setLevelUpToast(null)}
            duration={5000}
          />
        )}
        {badgeToast && (
          <NotificationToast
            type="badge"
            title="Badge Baru!"
            message={`Selamat, kamu mendapatkan badge ${badgeToast}.`}
            onClose={() => setBadgeToast(null)}
            duration={5000}
          />
        )}
      </div>
    );
  }

  // Quiz Selection View
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
            Kuis Kosmik
          </h1>
          <p className="text-muted-foreground">
            Uji pemahamanmu dan dapatkan XP untuk perjalanan kosmikmu
          </p>
        </div>

        {/* Quiz Cards */}
        <div className="grid gap-6 mb-8">
          {quizList.map((quiz) => (
            <div key={quiz.id} className="mission-card p-6">
              <div className="flex items-start space-x-6">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-neon-cyan" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {quiz.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="btn-neon px-6 py-2 flex items-center space-x-2"
                    >
                      <span>Mulai kuis</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 rounded-lg bg-surface/30">
                      <div className="text-lg font-bold text-neon-cyan">{quiz.questions}</div>
                      <div className="text-xs text-muted-foreground">Jumlah soal</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-surface/30">
                      <div className="text-lg font-bold text-neon-magenta">{quiz.difficulty}</div>
                      <div className="text-xs text-muted-foreground">Tingkat kesulitan</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-surface/30">
                      <div className="text-lg font-bold text-warning">{quiz.timeLimit}</div>
                      <div className="text-xs text-muted-foreground">Batas waktu</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-surface/30">
                      <div className="text-lg font-bold text-success">+{quiz.xpReward} XP</div>
                      <div className="text-xs text-muted-foreground">Hadiah dasar</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Card */}
        <div className="mission-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Zap className="w-5 h-5 text-neon-cyan mr-2" />
            Tips Menguasai Kuis
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-neon-cyan">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Baca dengan saksama</p>
                  <p className="text-sm text-muted-foreground">Luangkan waktu untuk memahami setiap soal sebelum menjawab</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-neon-magenta/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-neon-magenta">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Metode eliminasi</p>
                  <p className="text-sm text-muted-foreground">Singkirkan jawaban yang jelas salah untuk memperbesar peluang benar</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-success">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Manajemen waktu</p>
                  <p className="text-sm text-muted-foreground">Jangan terlalu lama pada satu soal saja</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-warning">4</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Bonus XP</p>
                  <p className="text-sm text-muted-foreground">Raih nilai 80%+ untuk mendapatkan bonus XP!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {levelUpToast && (
        <NotificationToast
          type="levelup"
          title="Level Up!"
          message={`Kamu naik ke level ${levelUpToast}. Hebat!`}
          onClose={() => setLevelUpToast(null)}
          duration={5000}
        />
      )}
      {badgeToast && (
        <NotificationToast
          type="badge"
          title="Badge Baru!"
          message={`Selamat, kamu mendapatkan badge ${badgeToast}.`}
          onClose={() => setBadgeToast(null)}
          duration={5000}
        />
      )}
    </div>
  );
}

export default Quiz;
