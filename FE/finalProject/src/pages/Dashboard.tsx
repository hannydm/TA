import { useState, useEffect } from 'react';
import { User as UserIcon, Trophy, Zap, Lock, CheckCircle, Play, BookOpen, Clock } from 'lucide-react';
import { gameState, User } from '@/lib/gameState';
import XPToast from '@/components/XPToast';
import LevelUpModal from '@/components/LevelUpModal';
import { useAuth } from '@/hooks/useAuth';
import { buildApiUrl } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  total_explorers: number;
  missions_completed: number;
  xp_today: number;
  active_now: number;
}

interface LeaderboardItem {
  id: number;
  user: {
    username: string;
    first_name: string;
    last_name: string;
  };
  avatar: string | null;
  level: number;
  total_poin: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User>(gameState.getUser());
  const [showXPToast, setShowXPToast] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const { profile, authFetch } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    total_explorers: 0,
    missions_completed: 0,
    xp_today: 0,
    active_now: 0,
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    const unsubscribe = gameState.subscribe(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await authFetch<DashboardStats>('/api/leaderboard/stats/');
        setStats(statsData);

        const leaderboardData = await authFetch<LeaderboardItem[]>('/api/leaderboard/');
        if (Array.isArray(leaderboardData)) {
          setLeaderboard(leaderboardData.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    };

    fetchDashboardData();
  }, [authFetch]);

  const xpPercentage = (user.xp / user.maxXp) * 100;

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Sidebar - User Profile */}
        <div className="lg:col-span-1">
          <div className="mission-card p-6 space-y-6">
            {/* Avatar & Basic Info */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-3xl mb-4 glow-purple overflow-hidden">
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
              <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
              <p className="text-neon-cyan font-medium">Explorer • Level {profile?.level || user.level}</p>
            </div>

            {/* XP Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="text-neon-cyan font-medium">{profile?.total_poin || user.xp} XP</span>
              </div>
              <div className="xp-bar">
                <div
                  className="xp-fill"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-mission-completed" />
                  <span className="text-sm">Missions Completed</span>
                </div>
                <span className="font-bold text-neon-cyan">{stats.missions_completed}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-neon-magenta" />
                  <span className="text-sm">XP Today</span>
                </div>
                <span className="font-bold text-neon-magenta">{stats.xp_today}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                onClick={() => navigate('/profile')}
                className="w-full btn-cosmic py-2 text-sm"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Welcome & Stats */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
                Welcome, Explorer!
              </h1>
              <p className="text-muted-foreground">
                Your cosmic journey through the world of informatics continues...
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div
                onClick={() => navigate('/modules')}
                className="mission-card p-6 cursor-pointer hover:border-neon-cyan transition-colors group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Start Learning</h3>
                    <p className="text-sm text-muted-foreground">Access modules & materials</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dive into our curated learning modules and master new skills.
                </p>
              </div>

              <div
                onClick={() => navigate('/quiz')}
                className="mission-card p-6 cursor-pointer hover:border-neon-magenta transition-colors group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-magenta/10 flex items-center justify-center group-hover:bg-neon-magenta/20 transition-colors">
                    <Zap className="w-6 h-6 text-neon-magenta" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Take a Quiz</h3>
                    <p className="text-sm text-muted-foreground">Test your knowledge</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Challenge yourself with quizzes and earn XP rewards.
                </p>
              </div>
            </div>

            {/* Community Stats */}
            <div className="mission-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <UserIcon className="w-5 h-5 text-neon-cyan mr-2" />
                Community Stats
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-surface/50">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.total_explorers}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Explorers</div>
                </div>
                <div className="p-4 rounded-xl bg-surface/50">
                  <div className="text-2xl font-bold text-neon-cyan mb-1">{stats.active_now}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Online Now</div>
                </div>
                <div className="p-4 rounded-xl bg-surface/50">
                  <div className="text-2xl font-bold text-neon-magenta mb-1">{stats.missions_completed}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Missions Done</div>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="mission-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Trophy className="w-5 h-5 text-warning mr-2" />
                Your Badges
              </h2>
              <BadgesList />
            </div>
          </div>
        </div>



        {/* Right Sidebar - Leaderboard & Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Activity */}
          <div className="mission-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <Clock className="w-5 h-5 text-neon-cyan mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {/* We need to fetch this from API */}
              <RecentActivityList />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mission-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center">
                <Trophy className="w-5 h-5 text-neon-magenta mr-2" />
                Top Explorers
              </h3>
            </div>

            {leaderboard.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border text-center text-muted-foreground text-sm">
                No explorers yet. Be the first!
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {leaderboard.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface/50 transition-colors"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3
                          ? 'bg-gradient-to-br from-neon-cyan to-neon-magenta text-background'
                          : 'bg-surface text-muted-foreground'
                          }`}
                      >
                        {index + 1}
                      </div>

                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg bg-surface overflow-hidden">
                        {player.avatar ? (
                          <img
                            src={player.avatar.startsWith('http') ? player.avatar : buildApiUrl(player.avatar.startsWith('/') ? player.avatar : `/media/${player.avatar}`)}
                            alt={player.user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{player.user.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">
                          {player.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">{player.total_poin} XP</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/leaderboard')}
                  className="w-full mt-4 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-neon-magenta hover:border-neon-magenta transition-colors text-sm"
                >
                  View Full Ranking
                </button>
              </>
            )}
          </div>
        </div>
      </div >

      {/* XP Toast Notification */}
      {
        showXPToast && (
          <XPToast
            amount={showXPToast}
            onComplete={() => setShowXPToast(null)}
          />
        )
      }

      {/* Level Up Modal */}
      {
        showLevelUp && (
          <LevelUpModal
            newLevel={showLevelUp}
            onClose={() => setShowLevelUp(null)}
          />
        )
      }
    </div >
  );
};

// Helper component for Recent Activity
const RecentActivityList = () => {
  const { authFetch } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await authFetch<any[]>('/api/recent-activity/');
        if (Array.isArray(data)) {
          setActivities(data);
        }
      } catch (error) {
        console.error('Failed to load recent activity', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [authFetch]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;
  if (activities.length === 0) return <div className="text-sm text-muted-foreground">No recent activity.</div>;

  return (
    <div className="space-y-3">
      {activities.map((act, idx) => (
        <div key={idx} className="flex items-start space-x-3 text-sm border-b border-border/50 pb-2 last:border-0">
          <div className="mt-1">
            {act.type === 'quiz' ? <Zap className="w-4 h-4 text-neon-magenta" /> :
              act.type === 'badge' ? <Trophy className="w-4 h-4 text-warning" /> :
                <CheckCircle className="w-4 h-4 text-neon-cyan" />}
          </div>
          <div>
            <p className="text-foreground font-medium">{act.title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(act.date).toLocaleDateString()} • +{act.xp} XP
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper component for Badges
const BadgesList = () => {
  const { authFetch } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await authFetch<any[]>('/api/lencana-saya/');
        if (Array.isArray(data)) {
          setBadges(data);
        }
      } catch (error) {
        console.error('Failed to load badges', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, [authFetch]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading badges...</div>;
  if (badges.length === 0) return <div className="text-sm text-muted-foreground">No badges earned yet. Complete modules to earn them!</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((b, idx) => (
        <div key={idx} className="text-center p-3 rounded-xl bg-surface/50 border border-border hover:border-warning transition-colors">
          <div className="w-12 h-12 mx-auto rounded-full bg-warning/20 flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-warning" />
          </div>
          <p className="text-sm font-bold text-foreground">{b.lencana.nama}</p>
          <p className="text-xs text-muted-foreground truncate">{b.lencana.deskripsi}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
