import { useState, useEffect } from 'react';
import { Brain, Clock, CheckCircle, X, Zap, Trophy, ArrowRight } from 'lucide-react';
import { quizQuestions } from '@/lib/gameState';
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

const Quiz = () => {
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
  const { authFetch, refreshProfile } = useAuth();

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

  const quizList = apiQuizzes.length
    ? apiQuizzes.map((q, index) => ({
      id: String(q.id),
      title: `Quiz ${index + 1}`,
      description: q.instruksi || 'Quiz from admin',
      questions: q.soal_pilgan.length,
      difficulty: 'Custom',
      timeLimit: `${q.soal_pilgan.length} minutes`,
      xpReward: q.poin || 20,
    }))
    : [
      {
        id: '1',
        title: 'Introduction to Programming',
        description: 'Test your understanding of basic programming concepts',
        questions: quizQuestions['1']?.length || 0,
        difficulty: 'Beginner',
        timeLimit: `${quizQuestions['1']?.length || 5} minutes`,
        xpReward: 20,
      },
      {
        id: '2',
        title: 'Data Structures',
        description: 'Challenge yourself with data structure fundamentals',
        questions: quizQuestions['2']?.length || 0,
        difficulty: 'Intermediate',
        timeLimit: `${quizQuestions['2']?.length || 5} minutes`,
        xpReward: 30,
      },
    ];

  const currentQuiz = quizList.find((q) => q.id === selectedQuiz);

  const questions =
    selectedQuiz && apiQuizzes.length
      ? (() => {
        const apiQuiz = apiQuizzes.find((q) => String(q.id) === selectedQuiz);
        if (!apiQuiz) return [];
        return apiQuiz.soal_pilgan.map((s) => ({
          question: s.pertanyaan,
          options: s.pilihan.map((p) => p.teks_jawaban),
          correct: Math.max(
            0,
            s.pilihan.findIndex((p) => p.apakah_benar)
          ),
        }));
      })()
      : selectedQuiz
        ? quizQuestions[selectedQuiz as keyof typeof quizQuestions] || []
        : [];

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

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuiz(quizId);

    // Calculate time based on number of questions (1 minute per question)
    let questionCount = 0;
    if (apiQuizzes.length > 0) {
      const apiQuiz = apiQuizzes.find(q => String(q.id) === quizId);
      questionCount = apiQuiz ? apiQuiz.soal_pilgan.length : 0;
    } else {
      questionCount = quizQuestions[quizId as keyof typeof quizQuestions]?.length || 0;
    }

    const calculatedTime = questionCount * 60; // 60 seconds per question

    setQuizState({
      currentQuestion: 0,
      selectedAnswers: [],
      showResults: false,
      score: 0,
      timeLeft: calculatedTime > 0 ? calculatedTime : 300 // Default to 5 mins if 0 questions (shouldn't happen)
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...quizState.selectedAnswers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    setQuizState({ ...quizState, selectedAnswers: newAnswers });
  };

  const handleNext = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState({ ...quizState, currentQuestion: quizState.currentQuestion + 1 });
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    // Calculate score based on points per question
    // Total points for the quiz (e.g. 20 XP or from API)
    const totalQuizPoints = currentQuiz?.xpReward || 20;
    const pointsPerQuestion = questions.length > 0 ? totalQuizPoints / questions.length : 0;

    let calculatedScore = 0;
    let correctCount = 0;

    questions.forEach((question, index) => {
      if (quizState.selectedAnswers[index] === question.correct) {
        calculatedScore += pointsPerQuestion;
        correctCount++;
      }
      // Wrong answer = 0 points for that question (already handled by not adding)
    });

    // Round to nearest integer
    const finalScore = Math.round(calculatedScore);
    const percentage = questions.length ? (correctCount / questions.length) * 100 : 0;

    // Bonus XP for high scores (only if not 0)
    let bonusXP = 0;
    if (percentage >= 80 && finalScore > 0) {
      bonusXP = 30;
    }

    const totalXPGained = finalScore + bonusXP;

    setQuizState(prev => ({ ...prev, score: correctCount, showResults: true }));
    setShowXPToast(totalXPGained);

    // Jika quiz berasal dari backend, simpan hasil ke backend.
    if (selectedQuiz && apiQuizzes.length) {
      const apiQuiz = apiQuizzes.find((q) => String(q.id) === selectedQuiz);
      if (apiQuiz) {
        try {
          // Simpan skor sebagai XP ke HasilAktivitas
          const response = await authFetch<any>('/api/submit-skor/', {
            method: 'POST',
            body: JSON.stringify({
              aktivitas_id: apiQuiz.id,
              skor: totalXPGained,
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
    } catch (err) {
      console.error('Gagal refresh profil setelah quiz', err);
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: [],
      showResults: false,
      score: 0,
      timeLeft: 300
    });
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
                Quiz Completed!
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
                  {quizState.score} out of {questions.length} correct
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
                  {isExcellent ? 'Excellent! Space Commander Performance!' :
                    isGood ? 'Good Work! Keep Exploring!' :
                      'Keep studying to master the cosmos!'}
                </p>
              </div>

              {/* XP Rewards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                  <span className="text-muted-foreground">Quiz Participation</span>
                  <span className="text-neon-cyan font-medium">+{currentQuiz?.xpReward} XP</span>
                </div>
                {isExcellent && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neon-magenta/20">
                    <span className="text-neon-magenta">Bonus: Score 80%+</span>
                    <span className="text-neon-magenta font-medium">+30 XP</span>
                  </div>
                )}
              </div>
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
                Continue Exploring
              </button>
              <button
                onClick={() => handleStartQuiz(selectedQuiz)}
                className="w-full px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan transition-colors"
              >
                Retake Quiz
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
          />
        )}
        {badgeToast && (
          <NotificationToast
            type="badge"
            title="Badge Baru!"
            message={`Selamat, kamu mendapatkan badge ${badgeToast}.`}
            onClose={() => setBadgeToast(null)}
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
                Back to Quizzes
              </button>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(quizState.timeLeft / 60)}:{(quizState.timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">{currentQuiz?.title}</h1>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {quizState.currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-neon-cyan">{progress.toFixed(0)}% Complete</span>
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
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={quizState.selectedAnswers[quizState.currentQuestion] === undefined}
                className="btn-neon px-6 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {quizState.currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}
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
          />
        )}
        {badgeToast && (
          <NotificationToast
            type="badge"
            title="Badge Baru!"
            message={`Selamat, kamu mendapatkan badge ${badgeToast}.`}
            onClose={() => setBadgeToast(null)}
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
            Cosmic Quizzes
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge and earn XP rewards for your cosmic journey
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
                      <span>Start Quiz</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 rounded-lg bg-surface/30">
                      <div className="text-lg font-bold text-neon-cyan">{quiz.questions}</div>
                      <div className="text-xs text-muted-foreground">Questions</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-surface/30">
                      <div className="text-lg font-bold text-neon-magenta">{quiz.difficulty}</div>
                      <div className="text-xs text-muted-foreground">Difficulty</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-surface/30">
                      <div className="text-lg font-bold text-warning">{quiz.timeLimit}</div>
                      <div className="text-xs text-muted-foreground">Time Limit</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-surface/30">
                      <div className="text-lg font-bold text-success">+{quiz.xpReward} XP</div>
                      <div className="text-xs text-muted-foreground">Base Reward</div>
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
            Quiz Mastery Tips
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-neon-cyan">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Read Carefully</p>
                  <p className="text-sm text-muted-foreground">Take time to understand each question before answering</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-neon-magenta/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-neon-magenta">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Process of Elimination</p>
                  <p className="text-sm text-muted-foreground">Remove obviously wrong answers to improve your odds</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-success">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Time Management</p>
                  <p className="text-sm text-muted-foreground">Don't spend too long on any single question</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-warning">4</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Bonus XP</p>
                  <p className="text-sm text-muted-foreground">Score 80%+ to earn bonus XP rewards!</p>
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
        />
      )}
      {badgeToast && (
        <NotificationToast
          type="badge"
          title="Badge Baru!"
          message={`Selamat, kamu mendapatkan badge ${badgeToast}.`}
          onClose={() => setBadgeToast(null)}
        />
      )}
    </div>
  );
};

export default Quiz;
