import { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Lock, Clock, Zap } from 'lucide-react';
import XPToast from '@/components/XPToast';
import { useAuth } from '@/hooks/useAuth';

type MaterialStatus = 'locked' | 'active' | 'completed';

interface ApiAktivitas {
  id: number;
  tipe_aktivitas: string;
  instruksi: string;
  poin: number;
}

interface ApiMateri {
  id: number;
  judul: string;
  konten_narasi: string;
  urutan: number;
  aktivitas: ApiAktivitas | null;
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

interface MaterialItem {
  id: string;
  backendId: number;
  title: string;
  status: MaterialStatus;
  duration: string;
  content: string;
  aktivitasId: number | null;
  xpReward: number;
}

const Materials = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [showXPToast, setShowXPToast] = useState<number | null>(null);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modules, setModules] = useState<ApiModulSummary[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const { authFetch, refreshProfile } = useAuth();

  const mapModuleDetailToMaterials = (modulDetail: ApiModulDetail) => {
    const mapped: MaterialItem[] = modulDetail.materi_set
      .sort((a, b) => a.urutan - b.urutan)
      .map((m) => ({
        id: String(m.id),
        backendId: m.id,
        title: m.judul,
        status: m.aktivitas ? 'active' as MaterialStatus : 'locked',
        duration: '~10 min read',
        content: m.konten_narasi,
        aktivitasId: m.aktivitas ? m.aktivitas.id : null,
        xpReward: m.aktivitas ? m.aktivitas.poin : 0,
      }));

    setMaterials(mapped);
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialModuleAndMaterials = async () => {
      try {
        // Ambil daftar modul terlebih dahulu
        const modulList = await authFetch<ApiModulSummary[] | any>('/api/modul/');
        if (!Array.isArray(modulList) || modulList.length === 0) {
          if (!cancelled) {
            setModules([]);
            setMaterials([]);
            setLoading(false);
          }
          return;
        }

        // Urutkan modul berdasarkan urutan
        modulList.sort((a, b) => a.urutan - b.urutan);

        const firstModuleId = modulList[0].id;
        const modulDetail = await authFetch<ApiModulDetail>(`/api/modul/${firstModuleId}/`);

        if (cancelled) return;

        setModules(modulList);
        setSelectedModuleId(firstModuleId);
        mapModuleDetailToMaterials(modulDetail);
      } catch (error) {
        console.error('Gagal memuat modul/materi dari API', error);
        setMaterials([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialModuleAndMaterials();

    return () => {
      cancelled = true;
    };
  }, [authFetch]);

  const handleChangeModule = async (moduleId: number) => {
    if (moduleId === selectedModuleId) return;
    setSelectedMaterial(null);
    setSelectedModuleId(moduleId);
    setLoading(true);
    try {
      const modulDetail = await authFetch<ApiModulDetail>(`/api/modul/${moduleId}/`);
      mapModuleDetailToMaterials(modulDetail);
    } catch (error) {
      console.error('Gagal memuat materi untuk modul', moduleId, error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    if (!material || material.status === 'completed') return;

    // Jika tidak terhubung ke aktivitas backend, tandai selesai lokal saja.
    if (!material.aktivitasId || material.xpReward <= 0) {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === materialId ? { ...m, status: 'completed' } : m
        )
      );
      setSelectedMaterial(null);
      return;
    }

    try {
      // Kirim skor ke backend
      await authFetch('/api/submit-skor/', {
        method: 'POST',
        body: JSON.stringify({
          aktivitas_id: material.aktivitasId,
          skor: material.xpReward,
        }),
      });

      // Tandai materi selesai di backend
      await authFetch('/api/tandai-selesai/', {
        method: 'POST',
        body: JSON.stringify({
          materi_id: material.backendId,
        }),
      });

      // Update status lokal
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === materialId ? { ...m, status: 'completed' } : m
        )
      );

      setShowXPToast(material.xpReward);
      setSelectedMaterial(null);
      await refreshProfile();
    } catch (error) {
      console.error('Gagal menandai materi selesai', error);
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center text-muted-foreground">
          Loading materials...
        </div>
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
              className="btn-cosmic px-4 py-2"
            >
              ← Back to Materials
            </button>
            
            {material.status !== 'completed' && (
              <button
                onClick={() => handleMarkComplete(material.id)}
                className="btn-neon px-6 py-2 flex items-center space-x-2"
                disabled={material.status === 'locked'}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Completed (+10 XP)</span>
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
            <div className="prose prose-invert max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {material.content}
              </div>
            </div>

            {/* Bottom Action */}
            {material.status !== 'completed' && (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border border-neon-cyan/30">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Continue Your Journey?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Mark this material as completed to gain XP and unlock new adventures!
                  </p>
                  <button
                    onClick={() => handleMarkComplete(material.id)}
                    className="btn-neon px-8 py-3 flex items-center space-x-2 mx-auto"
                    disabled={material.status === 'locked'}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Complete & Gain 10 XP</span>
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
            Learning Materials
          </h1>
          <p className="text-muted-foreground">
            Explore the cosmic knowledge base and advance your programming skills
          </p>
        </div>

        {/* Module Selector */}
        {modules.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            {modules.map((modul) => (
              <button
                key={modul.id}
                type="button"
                onClick={() => handleChangeModule(modul.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  modul.id === selectedModuleId
                    ? 'bg-neon-cyan text-background border-neon-cyan'
                    : 'bg-surface/50 text-muted-foreground border-border hover:border-neon-cyan hover:text-neon-cyan'
                }`}
              >
                {modul.judul}
              </button>
            ))}
          </div>
        )}

        {/* Materials Grid */}
        <div className="grid gap-6">
          {materials.map((material) => (
            <div
              key={material.id}
              className={`mission-card cursor-pointer ${material.status}`}
              onClick={() => material.status !== 'locked' && setSelectedMaterial(material.id)}
            >
              <div className="flex items-center space-x-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  material.status === 'completed' ? 'bg-mission-completed/20' :
                  material.status === 'active' ? 'bg-mission-active/20' :
                  'bg-mission-locked/20'
                }`}>
                  <BookOpen className={`w-8 h-8 ${
                    material.status === 'completed' ? 'text-mission-completed' :
                    material.status === 'active' ? 'text-mission-active' :
                    'text-mission-locked'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {material.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(material.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{material.duration}</span>
                    </div>
                    {material.xpReward > 0 && (
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-neon-cyan" />
                        <span className="text-neon-cyan">
                          +{material.xpReward} XP on completion
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      material.status === 'completed' ? 'bg-mission-completed/20 text-mission-completed' :
                      material.status === 'active' ? 'bg-mission-active/20 text-mission-active' :
                      'bg-mission-locked/20 text-mission-locked'
                    }`}>
                      {material.status === 'completed' ? 'Completed' :
                       material.status === 'active' ? 'Available' :
                       'Locked'}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                {material.status !== 'locked' && (
                  <div className="text-muted-foreground">
                    <Play className="w-5 h-5 rotate-0" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Study Tips */}
        <div className="mt-12 mission-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Zap className="w-5 h-5 text-neon-cyan mr-2" />
            Study Tips for Space Explorers
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-foreground font-medium">📚 Active Reading</p>
              <p className="text-muted-foreground">Take notes and ask questions while reading</p>
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">🔄 Practice Regularly</p>
              <p className="text-muted-foreground">Apply concepts through coding exercises</p>
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">🤝 Join Discussions</p>
              <p className="text-muted-foreground">Share knowledge with fellow explorers</p>
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">🎯 Set Goals</p>
              <p className="text-muted-foreground">Complete one material per day for consistency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
