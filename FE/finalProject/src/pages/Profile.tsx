import { useState, useEffect } from 'react';
import { User as UserIcon, Trophy, Zap, Star, Calendar, Award, Camera } from 'lucide-react';
import { gameState, User, missions } from '@/lib/gameState';
import { useAuth } from '@/hooks/useAuth';
import { buildApiUrl } from '@/lib/api';

const Profile = () => {
  const [user, setUser] = useState<User>(gameState.getUser());
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { profile, authFetch, refreshProfile } = useAuth();

  const [badges, setBadges] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = gameState.subscribe(setUser);
    return unsubscribe;
  }, []);

  const completedMissions = missions.filter(m => m.status === 'completed');
  const totalXpEarned = completedMissions.reduce((sum, m) => sum + m.xpReward, 0);
  const completionRate = Math.round((badges.filter(b => b.earned).length / (badges.length || 1)) * 100) || 0;

  // Calculate streak (simplified: count distinct days in recent activity)
  const uniqueDays = new Set(recentActivity.map(a => a.time));
  const streakDays = uniqueDays.size;

  const displayName = user.name || profile?.user?.username || user.username;
  const avatarInitial = (
    displayName?.charAt(0) ||
    'E'
  ).toUpperCase();

  const avatarPath = profile?.avatar || '';
  let avatarSrc: string | null = null;

  if (avatarPath) {
    const lower = avatarPath.toLowerCase();
    const isDefault = lower.includes('default');
    if (!isDefault) {
      if (avatarPath.startsWith('http')) {
        avatarSrc = avatarPath;
      } else if (avatarPath.startsWith('/')) {
        avatarSrc = buildApiUrl(avatarPath);
      } else {
        avatarSrc = buildApiUrl(`/media/${avatarPath}`);
      }
    }
  }

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    if (!file) {
      setAvatarFile(null);
      return;
    }
    // Optional: simple client-side size/type guard
    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar (JPEG/PNG/WebP, dll).');
      setAvatarFile(null);
      return;
    }
    setAvatarFile(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      await authFetch('/api/profil/', {
        method: 'PUT',
        body: formData,
      });
      await refreshProfile();
      setAvatarFile(null);
    } catch (error) {
      console.error('Gagal mengunggah avatar', error);
      setUploadError('Gagal mengunggah foto profil. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // 1. Fetch All Badges
        const allBadges = await authFetch<any[]>('/api/lencana/');

        // 2. Fetch My Badges
        const myBadges = await authFetch<any[]>('/api/lencana-saya/');

        // 3. Fetch Recent Activity
        const activityData = await authFetch<any[]>('/api/recent-activity/');

        // Process Badges
        if (Array.isArray(allBadges) && Array.isArray(myBadges)) {
          const processedBadges = allBadges.map(b => ({
            id: b.id,
            name: b.nama,
            description: b.deskripsi,
            icon: '🏆', // Default icon since backend might not send one, or map based on name
            earned: myBadges.some(mb => mb.lencana.id === b.id)
          }));
          setBadges(processedBadges);
        }

        // Process Activity
        if (Array.isArray(activityData)) {
          const mappedActivity = activityData.map(act => ({
            action: act.title,
            xp: act.xp,
            time: new Date(act.date).toLocaleDateString(),
            type: act.type
          }));
          setRecentActivity(mappedActivity);
        }

      } catch (error) {
        console.error('Failed to load profile data', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [authFetch]);

  // Progressive Leveling Logic
  const totalXP = profile?.total_poin || user.xp;
  const currentLevel = Math.floor(0.5 + Math.sqrt(0.25 + (totalXP / 50)));
  const xpForCurrentLevel = 50 * (currentLevel - 1) * currentLevel;
  const xpForNextLevel = 50 * currentLevel * (currentLevel + 1);
  const levelProgress = totalXP - xpForCurrentLevel;
  const levelRange = xpForNextLevel - xpForCurrentLevel;
  const percentage = Math.min(100, Math.max(0, (levelProgress / levelRange) * 100));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Profile Header */}
        <div className="mission-card p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-6xl glow-purple">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={displayName || 'User avatar'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  avatarInitial
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center text-sm font-bold text-background">
                {user.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
              <p className="text-xl text-neon-cyan font-medium mb-4">@{user.username}</p>

              {/* Level Progress Bar (New) */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
                  <span className="text-neon-cyan font-medium">{levelProgress}/{levelRange} XP</span>
                </div>
                <div className="xp-bar h-3">
                  <div
                    className="xp-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  {levelRange - levelProgress} XP needed for next level
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan">{user.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-magenta">{totalXpEarned}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mission-completed">{completedMissions.length}</div>
                  <div className="text-sm text-muted-foreground">Missions</div>
                </div>
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                      className="text-sm text-muted-foreground w-full"
                    />
                    <button
                      type="button"
                      onClick={handleAvatarUpload}
                      disabled={!avatarFile || isUploading}
                      className="btn-neon px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isUploading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                  {uploadError && (
                    <p className="text-xs text-destructive mt-1">
                      {uploadError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="mission-card p-6 text-center hover:border-neon-magenta transition-colors">
            <Trophy className="w-10 h-10 text-neon-magenta mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Achievements</h3>
            <p className="text-4xl font-bold text-neon-magenta mb-1">{badges.filter(b => b.earned).length}/{badges.length}</p>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </div>

          <div className="mission-card p-6 text-center hover:border-neon-cyan transition-colors">
            <Star className="w-10 h-10 text-neon-cyan mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Excellence</h3>
            <p className="text-4xl font-bold text-neon-cyan mb-1">{completionRate}%</p>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </div>

          <div className="mission-card p-6 text-center hover:border-success transition-colors">
            <Calendar className="w-10 h-10 text-success mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Consistency</h3>
            <p className="text-4xl font-bold text-success mb-1">{streakDays}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
        </div>

        {/* Badge Collection */}
        <div className="mission-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-neon-magenta" />
            <h2 className="text-2xl font-bold text-foreground">Badge Collection</h2>
          </div>

          {badges.filter(b => b.earned).length === 0 ? (
            <div className="p-8 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No badges earned yet</p>
              <p>Complete missions and quizzes to grow your collection!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges
                .filter((badge) => badge.earned)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-xl border bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 border-neon-cyan/50 glow-cyan flex items-start space-x-4"
                  >
                    <div className="text-3xl">
                      {badge.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/20 text-success uppercase tracking-wide">
                        Earned
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mission-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Zap className="w-6 h-6 text-neon-cyan mr-3" />
            Recent Activity
          </h2>

          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No recent activity</p>
                <p>Start your first mission to see your journey here!</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-surface/30 border border-border/50 hover:bg-surface/50 transition-colors">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activity.type === 'mission' ? 'bg-mission-completed/20 text-mission-completed' :
                    activity.type === 'badge' ? 'bg-warning/20 text-warning' :
                      activity.type === 'quiz' ? 'bg-neon-cyan/20 text-neon-cyan' :
                        'bg-neon-magenta/20 text-neon-magenta'
                    }`}>
                    {activity.type === 'mission' ? <Star className="w-6 h-6" /> :
                      activity.type === 'badge' ? <Award className="w-6 h-6" /> :
                        activity.type === 'quiz' ? <UserIcon className="w-6 h-6" /> :
                          <Trophy className="w-6 h-6" />}
                  </div>

                  <div className="flex-1">
                    <p className="text-foreground font-bold text-lg">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>

                  {activity.xp > 0 && (
                    <div className="flex items-center space-x-1 text-neon-cyan font-bold text-lg">
                      <Zap className="w-5 h-5" />
                      <span>+{activity.xp}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
