import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Zap, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { ProfileResponse } from '@/hooks/useAuth';

type LeaderboardPlayer = {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser: boolean;
};

type LeaderboardStats = {
  total_explorers: number;
  missions_completed: number;
  xp_today: number;
  active_now: number;
};

const Leaderboard = () => {
  const [filter, setFilter] = useState<'weekly' | 'overall'>('weekly');
  const [weeklyPlayers, setWeeklyPlayers] = useState<LeaderboardPlayer[]>([]);
  const [overallPlayers, setOverallPlayers] = useState<LeaderboardPlayer[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const { authFetch, profile } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const mapEntries = (data: ProfileResponse[]): LeaderboardPlayer[] =>
      data.map((entry, index) => {
        const username =
          entry.user?.username ||
          (entry.user?.email ? entry.user.email.split('@')[0] : 'Explorer');
        const displayName =
          [entry.user?.first_name, entry.user?.last_name]
            .filter(Boolean)
            .join(' ')
            .trim() || username;
        const avatarInitial =
          (displayName || username).trim().charAt(0).toUpperCase() || 'E';

        const isCurrentUser =
          !!profile && profile.user?.username === entry.user?.username;

        return {
          rank: index + 1,
          name: displayName,
          xp: entry.total_poin ?? 0,
          avatar: avatarInitial,
          isCurrentUser,
        };
      });

    const loadLeaderboard = async () => {
      try {
        const [overallData, weeklyData, statsData] = await Promise.all([
          authFetch<ProfileResponse[]>('/api/leaderboard/'),
          authFetch<ProfileResponse[]>('/api/leaderboard/weekly/'),
          authFetch<LeaderboardStats>('/api/leaderboard/stats/'),
        ]);

        if (!cancelled && Array.isArray(overallData)) {
          setOverallPlayers(mapEntries(overallData));
        }
        if (!cancelled && Array.isArray(weeklyData)) {
          setWeeklyPlayers(mapEntries(weeklyData));
        }
        if (!cancelled && statsData) {
          setStats(statsData);
        }
      } catch (error) {
        console.error('Failed to load leaderboard', error);
      }
    };

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [authFetch, profile]);

  const allPlayers =
    filter === 'weekly'
      ? weeklyPlayers.length
        ? weeklyPlayers
        : overallPlayers
      : overallPlayers;

  const hasPlayers = allPlayers.length > 0;

  const progressData = hasPlayers
    ? allPlayers.slice(0, 5).map((player, index) => ({
        name: player.name,
        change: `${player.xp} XP total`,
        trend: index % 2 === 0 ? 'up' : 'down',
      }))
    : [];

  // Achievement spotlight: gunakan data nyata (prioritaskan weekly)
  const achievementSource =
    weeklyPlayers.length > 0 ? weeklyPlayers : overallPlayers;
  const mostImproved = achievementSource[0];
  const speedDemon = achievementSource[1];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return 'from-neon-cyan to-neon-magenta';
    if (rank <= 10) return 'from-primary to-primary-glow';
    return 'from-muted to-muted-foreground';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
            Explorer Ranking
          </h1>
          <p className="text-muted-foreground">
            Lihat posisi kamu di antara para penjelajah kosmik lainnya.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center">
          <div className="mission-card p-1 flex space-x-1">
            <button
              onClick={() => setFilter('weekly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'weekly'
                  ? 'bg-neon-cyan text-background glow-cyan'
                  : 'text-muted-foreground hover:text-neon-cyan'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setFilter('overall')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'overall'
                  ? 'bg-neon-magenta text-background'
                  : 'text-muted-foreground hover:text-neon-magenta'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Leaderboard - 2 kolom */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mission-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <Trophy className="w-5 h-5 text-neon-magenta mr-2" />
                {filter === 'weekly' ? 'This Week' : 'All Time'} Rankings
              </h2>

              {hasPlayers ? (
                <>
                  {/* Top 3 Podium */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {allPlayers.slice(0, 3).map((player, index) => (
                      <div
                        key={player.rank}
                        className={`text-center p-4 rounded-xl border transition-all duration-300 ${
                          player.isCurrentUser
                            ? 'border-neon-cyan bg-neon-cyan/10 glow-cyan scale-105'
                            : 'border-border bg-surface/30 hover:border-neon-cyan/30'
                        } ${
                          index === 0
                            ? 'order-2'
                            : index === 1
                            ? 'order-1'
                            : 'order-3'
                        }`}
                      >
                        <div
                          className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${getRankBadgeColor(
                            player.rank,
                          )} flex items-center justify-center text-xl font-bold mb-3 shadow-lg`}
                        >
                          {player.avatar}
                        </div>
                        <div className="mb-2 flex justify-center">
                          {getRankIcon(player.rank)}
                        </div>
                        <h3
                          className={`font-semibold text-sm mb-1 truncate ${
                            player.isCurrentUser ? 'text-neon-cyan' : 'text-foreground'
                          }`}
                        >
                          {player.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {player.xp} XP
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            index === 0
                              ? 'bg-yellow-400/20 text-yellow-400'
                              : index === 1
                              ? 'bg-gray-300/20 text-gray-300'
                              : 'bg-amber-600/20 text-amber-600'
                          }`}
                        >
                          #{player.rank}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rest of Rankings */}
                  <div className="space-y-2 max-h-80 overflow-auto pr-1">
                    {allPlayers.slice(3).map((player) => (
                      <div
                        key={player.rank}
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
                          player.isCurrentUser
                            ? 'bg-neon-cyan/20 border border-neon-cyan/50 glow-cyan'
                            : 'bg-surface/30 hover:bg-surface/50 border border-transparent hover:border-border'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(player.rank)}
                        </div>

                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 border border-border">
                          {player.avatar}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium truncate ${
                              player.isCurrentUser ? 'text-neon-cyan' : 'text-foreground'
                            }`}
                          >
                            {player.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {player.xp} XP
                          </p>
                        </div>

                        {player.isCurrentUser && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-neon-cyan/20 text-neon-cyan">
                            You
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 border border-dashed border-border rounded-xl text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Belum ada explorer yang naik ke leaderboard. Selesaikan misi dan quiz
                    untuk menjadi yang pertama!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-success mr-2" />
                Global Stats
              </h3>

              {stats ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface/30">
                    <span className="text-sm text-muted-foreground">
                      Total Explorers
                    </span>
                    <span className="font-bold text-lg text-neon-cyan">
                      {stats.total_explorers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface/30">
                    <span className="text-sm text-muted-foreground">
                      Missions Completed
                    </span>
                    <span className="font-bold text-lg text-neon-magenta">
                      {stats.missions_completed}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface/30">
                    <span className="text-sm text-muted-foreground">
                      XP Earned Today
                    </span>
                    <span className="font-bold text-lg text-success">
                      {stats.xp_today}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface/30">
                    <span className="text-sm text-muted-foreground">
                      Active Now
                    </span>
                    <span className="font-bold text-lg text-warning">
                      {stats.active_now}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Statistik akan muncul setelah ada aktivitas di dalam game.
                </p>
              )}
            </div>

            {/* Weekly Progress Card */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-neon-cyan mr-2" />
                Top Performers
              </h3>

              <div className="space-y-3">
                {progressData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Performance insights akan muncul setelah explorer mulai aktif.
                  </p>
                ) : (
                  progressData.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-surface/30 hover:bg-surface/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center text-xs font-bold border border-border">
                          {index + 1}
                        </div>
                        <span className="text-sm text-foreground font-medium truncate">
                          {player.name}
                        </span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 text-xs font-medium ${
                          player.trend === 'up' ? 'text-success' : 'text-warning'
                        }`}
                      >
                        <TrendingUp
                          className={`w-3 h-3 ${
                            player.trend === 'down' ? 'rotate-180' : ''
                          }`}
                        />
                        <span>{player.change}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Achievement Spotlight Card */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <Zap className="w-5 h-5 text-neon-magenta mr-2" />
                Achievement Spotlight
              </h3>

              {achievementSource.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Pencapaian khusus akan muncul setelah ada aktivitas dari para explorer.
                </p>
              ) : (
                <div className="space-y-3">
                  {mostImproved && (
                    <div className="p-4 rounded-lg bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border border-neon-cyan/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">🏆</span>
                        <span className="font-medium text-neon-cyan">
                          Most Improved
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {mostImproved.name} meraih {mostImproved.xp} XP{' '}
                        {weeklyPlayers.length ? 'minggu ini' : 'secara total'}.
                      </p>
                    </div>
                  )}

                  {speedDemon && (
                    <div className="p-4 rounded-lg bg-gradient-to-r from-warning/10 to-success/10 border border-warning/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">⚡</span>
                        <span className="font-medium text-warning">Speed Demon</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {speedDemon.name} tampil sangat aktif dengan{' '}
                        {speedDemon.xp} XP{' '}
                        {weeklyPlayers.length ? 'minggu ini' : 'secara total'}.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Competition Info */}
        <div className="mission-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-neon-cyan mr-2" />
            Cosmic Competition Rules
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-neon-cyan/20 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Earn XP</h3>
              <p className="text-sm text-muted-foreground">
                Selesaikan misi, quiz, dan tantangan untuk mengumpulkan XP.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-neon-magenta/20 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-neon-magenta" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Weekly Reset</h3>
              <p className="text-sm text-muted-foreground">
                Peringkat mingguan di-reset setiap Senin agar semua punya peluang baru.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-3">
                <Crown className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Special Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Top performer bisa mendapatkan badge eksklusif dan gelar kehormatan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

