import { useState } from 'react';
import { Trophy, Medal, Crown, Zap, TrendingUp, Calendar } from 'lucide-react';
import { leaderboard } from '@/lib/gameState';

const Leaderboard = () => {
  const [filter, setFilter] = useState<'weekly' | 'overall'>('weekly');

  const allPlayers = leaderboard;
  const hasPlayers = allPlayers.length > 0;
  const progressData = hasPlayers
    ? allPlayers.slice(0, 5).map((player, index) => ({
        name: player.name,
        change: `${player.xp} XP total`,
        trend: index % 2 === 0 ? 'up' : 'down',
      }))
    : [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
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
            See how you compare with fellow cosmic explorers
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
                  ? 'bg-neon-cyan text-background glow-cyan'
                  : 'text-muted-foreground hover:text-neon-cyan'
              }`}
            >
              Overall
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <div className="mission-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <Trophy className="w-5 h-5 text-neon-magenta mr-2" />
                {filter === 'weekly' ? 'This Week' : 'All Time'} Rankings
              </h2>

              {hasPlayers ? (
                <>
                  {/* Top 3 Podium */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {allPlayers.slice(0, 3).map((player, index) => (
                      <div
                        key={player.rank}
                        className={`text-center p-4 rounded-xl border ${
                          player.isCurrentUser
                            ? 'border-neon-cyan bg-neon-cyan/10 glow-cyan'
                            : 'border-border bg-surface/30'
                        } ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
                      >
                        <div
                          className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getRankBadgeColor(
                            player.rank,
                          )} flex items-center justify-center text-2xl mb-3`}
                        >
                          {player.avatar}
                        </div>
                        <div className="mb-2">{getRankIcon(player.rank)}</div>
                        <h3
                          className={`font-semibold mb-1 ${
                            player.isCurrentUser ? 'text-neon-cyan' : 'text-foreground'
                          }`}
                        >
                          {player.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">{player.xp} XP</p>
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
                  <div className="space-y-2">
                    {allPlayers.slice(3).map((player) => (
                      <div
                        key={player.rank}
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 ${
                          player.isCurrentUser
                            ? 'bg-neon-cyan/20 border border-neon-cyan/50 glow-cyan'
                            : 'bg-surface/30 hover:bg-surface/50'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(player.rank)}
                        </div>

                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-surface">
                          {player.avatar}
                        </div>

                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              player.isCurrentUser ? 'text-neon-cyan' : 'text-foreground'
                            }`}
                          >
                            {player.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{player.xp} XP</p>
                        </div>

                        {player.isCurrentUser && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-neon-cyan/20 text-neon-cyan">
                            You
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-6 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                  No explorers have climbed the leaderboard yet. Complete activities to be the
                  first!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Weekly Progress */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-neon-cyan mr-2" />
                Weekly Progress
              </h3>
              
              <div className="space-y-3">
                {progressData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Progress insights will appear after explorers start participating.
                  </p>
                ) : (
                  progressData.map((player, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-foreground truncate">{player.name}</span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 text-sm ${
                          player.trend === 'up' ? 'text-success' : 'text-warning'
                        }`}
                      >
                        <TrendingUp
                          className={`w-3 h-3 ${player.trend === 'down' ? 'rotate-180' : ''}`}
                        />
                        <span>{player.change}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Achievement Spotlight */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <Zap className="w-5 h-5 text-neon-magenta mr-2" />
                Achievement Spotlight
              </h3>
              
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border border-neon-cyan/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🏆</span>
                    <span className="font-medium text-neon-cyan">Most Improved</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    David Stellar gained 200 XP this week!
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-r from-warning/10 to-success/10 border border-warning/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">⚡</span>
                    <span className="font-medium text-warning">Speed Demon</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sarah Cosmic completed 5 quizzes in one day!
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mission-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-success mr-2" />
                Global Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Explorers</span>
                  <span className="font-bold text-neon-cyan">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Missions Completed</span>
                  <span className="font-bold text-neon-magenta">8,392</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">XP Earned Today</span>
                  <span className="font-bold text-success">12,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Now</span>
                  <span className="font-bold text-warning">156</span>
                </div>
              </div>
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
                Complete missions, quizzes, and challenges to earn experience points
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-neon-magenta/20 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-neon-magenta" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Weekly Reset</h3>
              <p className="text-sm text-muted-foreground">
                Weekly rankings reset every Monday to give everyone a fresh start
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-3">
                <Crown className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Special Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Top performers earn exclusive badges and cosmic honors
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
