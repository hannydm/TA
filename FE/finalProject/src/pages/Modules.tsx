import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ApiModulSummary {
  id: number;
  judul: string;
  deskripsi: string;
  urutan: number;
}

const Modules = () => {
  const [modules, setModules] = useState<ApiModulSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await authFetch<ApiModulSummary[]>('/api/modul/');
        if (Array.isArray(data)) {
          setModules(data.sort((a, b) => a.urutan - b.urutan));
        }
      } catch (error) {
        console.error('Failed to load modules', error);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [authFetch]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse text-neon-cyan text-xl">
          Memuat modul...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-4">
            Modul Pembelajaran
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pilih salah satu modul untuk memulai perjalananmu. Setiap modul
            berisi materi dan aktivitas yang dirancang untuk meningkatkan
            keterampilanmu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((modul) => (
            <div
              key={modul.id}
              onClick={() => navigate(`/modules/${modul.id}`)}
              className="mission-card group cursor-pointer hover:border-neon-cyan/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-neon-cyan" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-neon-cyan transition-colors">
                    {modul.judul}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {modul.deskripsi}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border/50">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface text-muted-foreground">
                    Modul {modul.urutan}
                  </span>
                  <div className="flex items-center text-neon-cyan text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Mulai Belajar <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12 mission-card">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">
              Belum ada modul
            </h3>
            <p className="text-muted-foreground">
              Silakan kembali lagi nanti untuk konten baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modules;
