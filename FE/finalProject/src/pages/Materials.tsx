import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Play, CheckCircle, Lock, Clock, Zap, ArrowLeft, Menu, Code } from 'lucide-react';
import XPToast from '@/components/XPToast';
import NotificationToast from '@/components/NotificationToast';
import { useAuth } from '@/hooks/useAuth';

type MaterialStatus = 'locked' | 'active' | 'completed';

interface ApiAktivitas {
  id: number;
  tipe_aktivitas: string;
  instruksi: string;
  poin: number;
  kode_jawaban?: string;
  blok_kode_acak?: string;
  validasi_html?: string;
}

interface ApiMateri {
  id: number;
  judul: string;
  konten_narasi: string;
  urutan: number;
  aktivitas: ApiAktivitas | null;
  is_locked: boolean;
}

interface ApiModulSummary {
  id: number;
  judul: string;
  deskripsi: string;
  urutan: number;
}

interface ApiModulDetail {
  id: number;
  judul: string;
  deskripsi: string;
  urutan: number;
  materi_set: ApiMateri[];
}

interface Material {
  id: string;
  backendId: number;
  title: string;
  duration: string;
  status: MaterialStatus;
  content: string;
  xpReward: number;
  aktivitasId?: number;
  activityType?: string;
  activityInstruction?: string;
  activityValidation?: string;
  puzzleBlocks?: string; // Comma separated blocks
  puzzleAnswer?: string;
  isLastInModule?: boolean;
}

const PuzzleActivity = ({ material, onComplete }: { material: Material; onComplete: () => void }) => {
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (material.puzzleBlocks) {
      // Split and shuffle slightly or just use as is (assuming backend sends them shuffled or we shuffle)
      const blocks = material.puzzleBlocks.split(',').map(b => b.trim()).filter(b => b);
      setAvailableBlocks(blocks);
      setUserSequence([]);
      setMessage(null);
    }
  }, [material.puzzleBlocks]);

  const handleAddToSequence = (block: string, index: number) => {
    const newAvailable = [...availableBlocks];
    newAvailable.splice(index, 1);
    setAvailableBlocks(newAvailable);
    setUserSequence([...userSequence, block]);
    setMessage(null);
  };

  const handleRemoveFromSequence = (block: string, index: number) => {
    const newSequence = [...userSequence];
    newSequence.splice(index, 1);
    setUserSequence(newSequence);
    setAvailableBlocks([...availableBlocks, block]);
    setMessage(null);
  };

  const checkAnswer = () => {
    const userAnswer = userSequence.join('');
    // Remove spaces for looser comparison if needed, or strict
    // The backend model says: "Tulis kode jawaban yang benar dalam satu baris, tanpa spasi."
    // So we should probably strip spaces from both for comparison or follow strict rules.
    // Let's try strict first, then loose.

    const correct = material.puzzleAnswer?.replace(/\s+/g, '') === userAnswer.replace(/\s+/g, '');

    if (correct) {
      setMessage({ text: 'Correct! Great job.', type: 'success' });
      onComplete();
    } else {
      setMessage({ text: 'Incorrect sequence. Try again.', type: 'error' });
    }
  };

  return (
    <div className="mb-8 p-6 rounded-xl border border-border bg-surface/30">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
        <Code className="w-5 h-5 text-neon-magenta mr-2" />
        Puzzle Code Challenge
      </h3>
      <p className="text-muted-foreground mb-6">{material.activityInstruction || "Arrange the blocks to form the correct code."}</p>

      {/* Drop Zone */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-2 block">Your Solution:</label>
        <div className="min-h-[60px] p-4 rounded-lg bg-black/50 border-2 border-dashed border-border flex flex-wrap gap-2 items-center">
          {userSequence.length === 0 && <span className="text-muted-foreground text-sm italic">Click blocks below to add them here...</span>}
          {userSequence.map((block, idx) => (
            <button
              key={`${block}-${idx}`}
              onClick={() => handleRemoveFromSequence(block, idx)}
              className="px-3 py-1.5 rounded bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 hover:bg-destructive/20 hover:text-destructive hover:border-destructive transition-colors text-sm font-mono"
            >
              {block}
            </button>
          ))}
        </div>
      </div>

      {/* Available Blocks */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-2 block">Available Blocks:</label>
        <div className="flex flex-wrap gap-2">
          {availableBlocks.map((block, idx) => (
            <button
              key={`${block}-${idx}`}
              onClick={() => handleAddToSequence(block, idx)}
              className="px-3 py-1.5 rounded bg-surface border border-border hover:border-neon-magenta hover:text-neon-magenta transition-colors text-sm font-mono"
            >
              {block}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          {message && (
            <span className={`text-sm font-bold ${message.type === 'success' ? 'text-success' : 'text-destructive'}`}>
              {message.text}
            </span>
          )}
        </div>
        <button
          onClick={checkAnswer}
          className="btn-neon px-6 py-2"
          disabled={userSequence.length === 0}
        >
          Check Answer
        </button>
      </div>
    </div>
  );
};

const Materials = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authFetch, refreshProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<ApiModulSummary[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [showXPToast, setShowXPToast] = useState<number | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [levelUpToast, setLevelUpToast] = useState<number | null>(null);
  const [badgeToast, setBadgeToast] = useState<string | null>(null);

  // State for Live Code
  const [userCode, setUserCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');

  const mapModuleDetailToMaterials = (detail: ApiModulDetail) => {
    setModuleTitle(detail.judul);
    const maxOrder =
      detail.materi_set.reduce((max, m) => Math.max(max, m.urutan), 0) || 0;

    const mappedMaterials: Material[] = detail.materi_set.map((m) => {
      let status: MaterialStatus = 'locked';
      if (!m.is_locked) {
        status = 'active';
      }
      const isLastInModule = maxOrder > 0 && m.urutan === maxOrder;

      return {
        id: String(m.id),
        backendId: m.id,
        title: m.judul,
        duration: '10 min',
        status: status,
        content: m.konten_narasi,
        xpReward: m.aktivitas ? m.aktivitas.poin : 10,
        aktivitasId: m.aktivitas?.id,
        activityType: m.aktivitas?.tipe_aktivitas,
        activityInstruction: m.aktivitas?.instruksi,
        activityValidation: m.aktivitas?.validasi_html,
        puzzleBlocks: m.aktivitas?.blok_kode_acak,
        puzzleAnswer: m.aktivitas?.kode_jawaban,
        isLastInModule,
      };
    });

    setMaterials(mappedMaterials);
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Load all modules for the list
        const modulesData = await authFetch<ApiModulSummary[]>('/api/modul/');
        if (!cancelled && Array.isArray(modulesData)) {
          setModules(modulesData.sort((a, b) => a.urutan - b.urutan));
        }

        // 2. Load specific module details
        let targetId = id;
        if (!targetId && Array.isArray(modulesData) && modulesData.length > 0) {
          targetId = String(modulesData[0].id);
        }

        if (targetId) {
          const modulDetail = await authFetch<ApiModulDetail>(`/api/modul/${targetId}/`);
          if (!cancelled) {
            mapModuleDetailToMaterials(modulDetail);
          }
        }
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Reset code when material changes
  useEffect(() => {
    setUserCode('');
    setCodeOutput('');
  }, [selectedMaterial]);

  const handleMarkComplete = async (materialId: string, stayOnPage: boolean = false) => {
    const material = materials.find((m) => m.id === materialId);
    if (!material || material.status === 'completed') return;

    try {
      let submitResult: any = null;
      // If it has an activity, submit score
      if (material.aktivitasId && material.xpReward > 0) {
        submitResult = await authFetch('/api/submit-skor/', {
          method: 'POST',
          body: JSON.stringify({
            aktivitas_id: material.aktivitasId,
            skor: material.xpReward,
          }),
        });

        if (submitResult?.level_up && submitResult?.new_level) {
          setLevelUpToast(submitResult.new_level);
        }
        if (submitResult?.new_badge) {
          setBadgeToast(submitResult.new_badge);
        }
      }

      // Always mark as done
      const response = await authFetch<any>('/api/tandai-selesai/', {
        method: 'POST',
        body: JSON.stringify({
          materi_id: material.backendId,
        }),
      });

      // Update local state
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === materialId ? { ...m, status: 'completed' } : m
        )
      );

      // Show toast with actual XP gained
      const xpGained = response?.xp_gained ?? material.xpReward;
      setShowXPToast(xpGained);

      if (!stayOnPage) {
        setSelectedMaterial(null);
      }

      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (error) {
      console.error('Failed to mark complete', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-mission-completed" />;
      case 'active':
        return <Play className="w-5 h-5 text-mission-active" />;
      default:
        return <Lock className="w-5 h-5 text-mission-locked" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse text-neon-cyan">Loading materials...</div>
      </div>
    );
  }

  if (selectedMaterial) {
    const material = materials.find(m => m.id === selectedMaterial);
    if (!material) return null;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedMaterial(null)}
              className="btn-cosmic px-4 py-2 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </button>

            {material.status !== 'completed' && material.activityType !== 'DEMO_HTML' && material.activityType !== 'PUZZLE_CODE' && (
              <button
                onClick={() => handleMarkComplete(material.id)}
                className="btn-neon px-6 py-2 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Completed (+{material.xpReward} XP)</span>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="mission-card p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{material.title}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{material.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(material.status)}
                  <span className="capitalize">{material.status}</span>
                </div>
              </div>
            </div>

            {/* Material Content */}
            <div className="prose prose-invert max-w-none mb-8">
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {material.content}
              </div>
            </div>

            {/* Last material CTA to quiz */}
            {material.isLastInModule && (
              <div className="mb-8 p-4 rounded-xl border border-neon-cyan/40 bg-neon-cyan/5">
                <h3 className="text-lg font-bold text-foreground mb-1">Saatnya ke Quiz Modul</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Setelah membaca materi terakhir, lanjutkan dengan mengerjakan quiz modul untuk mendapatkan XP dan berpeluang meraih badge.
                </p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && material.aktivitasId) {
                      window.localStorage.setItem(
                        'digi_world_next_quiz',
                        String(material.aktivitasId)
                      );
                    }
                    navigate('/quiz');
                  }}
                  disabled={material.status !== 'completed'}
                  className="btn-neon px-6 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Pergi ke Halaman Quiz
                </button>
                {material.status !== 'completed' && (
                  <p className="text-xs text-warning mt-2">
                    Tandai materi ini selesai terlebih dahulu untuk membuka quiz.
                  </p>
                )}
              </div>
            )}

            {/* Live Code Activity */}
            {material.activityType === 'DEMO_HTML' && (
              <div className="mb-8 p-6 rounded-xl border border-border bg-surface/30">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-neon-cyan mr-2" />
                  Live Code Challenge (C Language)
                </h3>
                <p className="text-muted-foreground mb-4">{material.activityInstruction}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground mb-2 block">Code Editor (C)</label>
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-64 p-4 rounded-lg bg-black/80 border border-border font-mono text-sm text-green-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan mb-2 resize-none"
                      placeholder={`#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}`}
                      spellCheck={false}
                    />
                    <button
                      onClick={() => {
                        // Simple C Simulation
                        let output = "";
                        const validation = material.activityValidation || "";

                        // Check if code seems to be C
                        if (!userCode.includes("main") || !userCode.includes("{") || !userCode.includes("}")) {
                          output = "Error: Invalid C code structure. Ensure you have a main function.";
                        }
                        // Check validation string
                        else if (validation && !userCode.includes(validation)) {
                          output = `Error: Code must contain "${validation}"`;
                        } else {
                          // Simulate success output
                          // Extract what's inside printf if possible, or just show success message
                          const printfMatch = userCode.match(/printf\s*\\(\\s*"([^"]+)"\\s*\\)/);
                          if (printfMatch) {
                            output = printfMatch[1];
                          } else {
                            output = "Program executed successfully.";
                          }
                          output += "\n\n[Process completed with exit code 0]";

                          // Success: biarkan pengguna tetap di halaman,
                          // mereka bisa menandai selesai secara manual.
                        }
                        setCodeOutput(output);
                      }}
                      className="btn-neon px-4 py-2 self-end text-sm"
                    >
                      Run Code
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Terminal Output</label>
                    <div
                      className="w-full h-64 p-4 rounded-lg bg-black text-green-500 font-mono text-sm overflow-auto border border-border/50 shadow-inner"
                    >
                      <pre className="whitespace-pre-wrap">{codeOutput || "// Output will appear here..."}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Puzzle Code Activity */}
            {material.activityType === 'PUZZLE_CODE' && (
              <PuzzleActivity
                material={material}
                onComplete={() => {
                  // Tampilkan status benar, tapi biarkan pengguna
                  // menandai selesai sendiri agar tetap di halaman.
                }}
              />
            )}

            {/* Bottom Action for marking completion (all non-quiz materials) */}
            {material.status !== 'completed' && material.activityType !== 'PILIHAN_GANDA' && (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border border-neon-cyan/30">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Selesai dengan materi dan aktivitas?
                  </h3>
                  <button
                    onClick={() => handleMarkComplete(material.id)}
                    className="btn-neon px-8 py-3 flex items-center space-x-2 mx-auto"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Complete & Gain {material.xpReward} XP</span>
                  </button>
                </div>
              </div>
            )}
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
            message={`Kamu naik ke level ${levelUpToast}. Lanjutkan petualangan!`}
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="mission-card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <BookOpen className="w-5 h-5 text-neon-cyan mr-2" />
              Modules
            </h2>
            <div className="space-y-2">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => {
                    navigate(`/modules/${mod.id}`);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${String(mod.id) === id
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                    : 'hover:bg-surface/50 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <div className="font-medium text-sm">
                    {mod.urutan}. {mod.judul}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => navigate('/modules')}
                className="w-full btn-outline py-2 text-sm"
              >
                View All Modules
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Materials List */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
              {moduleTitle}
            </h1>
            <p className="text-muted-foreground">
              Complete the materials below to master this module.
            </p>
          </div>

          <div className="space-y-4">
            {materials.map((material) => (
              <div
                key={material.id}
                onClick={() => {
                  if (material.status !== 'locked') {
                    setSelectedMaterial(material.id);
                  }
                }}
                className={`mission-card p-6 transition-all duration-300 ${material.status !== 'locked'
                  ? 'cursor-pointer hover:border-neon-cyan/50 hover:-translate-y-1'
                  : 'opacity-75 cursor-not-allowed bg-surface/30'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${material.status === 'completed' ? 'bg-mission-completed/20' :
                      material.status === 'active' ? 'bg-mission-active/20' :
                        'bg-mission-locked/20'
                      }`}>
                      {getStatusIcon(material.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        {material.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{material.duration}</span>
                        </div>
                        {material.xpReward > 0 && (
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-neon-cyan" />
                            <span className="text-neon-cyan">
                              +{material.xpReward} XP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-muted-foreground">
                    <Play className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
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
          message={`Kamu naik ke level ${levelUpToast}. Lanjutkan petualangan!`}
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

export default Materials;
