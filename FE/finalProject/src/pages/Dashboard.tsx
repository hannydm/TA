import { useState, useEffect } from 'react';
import { User as UserIcon, Trophy, Zap, Lock, CheckCircle, Play } from 'lucide-react';
import { gameState, User, missions, leaderboard } from '@/lib/gameState';
import XPToast from '@/components/XPToast';
import LevelUpModal from '@/components/LevelUpModal';

const Dashboard = () => {
  const [user, setUser] = useState<User>(gameState.getUser());
  const [showXPToast, setShowXPToast] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = gameState.subscribe(setUser);
    return unsubscribe;
  }, []);

  const handleMissionClick = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission?.status === 'active') {
      // Simulate mission completion
      gameState.completeMission(missionId);
      setShowXPToast(mission.xpReward);
      
      // Check if leveled up
      const newUser = gameState.getUser();
      if (newUser.level > user.level) {
        setTimeout(() => setShowLevelUp(newUser.level), 2000);
      }
    }
  };

  const getMissionIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-mission-completed" />;
      case 'active':
        return <Play className="w-6 h-6 text-mission-active pulse-cosmic" />;
      default:
        return <Lock className="w-6 h-6 text-mission-locked" />;
    }
  };

  const xpPercentage = (user.xp / user.maxXp) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar - User Profile */}
        <div className="lg:col-span-1">
          <div className="mission-card p-6 space-y-6">
            {/* Avatar & Basic Info */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-3xl mb-4 glow-purple">
                {user.avatar}
              </div>
              <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
              <p className="text-neon-cyan font-medium">Explorer • Level {user.level}</p>
            </div>

            {/* XP Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="text-neon-cyan font-medium">{user.xp}/{user.maxXp} XP</span>
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
                <span className="font-bold text-neon-cyan">{missions.filter(m => m.status === 'completed').length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-neon-magenta" />
                  <span className="text-sm">Badges Earned</span>
                </div>
                <span className="font-bold text-neon-magenta">{user.badges.length}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full btn-cosmic py-2 text-sm">
                View Profile
              </button>
              <button className="w-full px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan transition-colors text-sm">
                Badge Gallery
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Mission Map */}
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

            {/* Galaxy Mission Map */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <Zap className="w-6 h-6 text-neon-cyan mr-2" />
                Galaxy Mission Map
              </h2>
              
              <div className="grid gap-4">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`mission-card cursor-pointer ${mission.status}`}
                    onClick={() => handleMissionClick(mission.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getMissionIcon(mission.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {mission.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm">
                            <Zap className="w-4 h-4 text-neon-cyan" />
                            <span className="text-neon-cyan font-medium">+{mission.xpReward} XP</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3">
                          {mission.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className={`font-medium ${
                              mission.status === 'completed' ? 'text-mission-completed' :
                              mission.status === 'active' ? 'text-mission-active' :
                              'text-mission-locked'
                            }`}>
                              {mission.progress}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-surface">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                mission.status === 'completed' ? 'bg-mission-completed' :
                                mission.status === 'active' ? 'bg-gradient-to-r from-mission-active to-neon-cyan' :
                                'bg-mission-locked'
                              }`}
                              style={{ width: `${mission.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Status Label */}
                        <div className="mt-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            mission.status === 'completed' ? 'bg-mission-completed/20 text-mission-completed' :
                            mission.status === 'active' ? 'bg-mission-active/20 text-mission-active' :
                            'bg-mission-locked/20 text-mission-locked'
                          }`}>
                            {mission.status === 'completed' ? 'Mission Completed' :
                             mission.status === 'active' ? 'Mission Active' :
                             'Mission Locked'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Leaderboard */}
        <div className="lg:col-span-1">
          <div className="mission-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center">
                <Trophy className="w-5 h-5 text-neon-magenta mr-2" />
                Explorer Ranking
              </h3>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-1 mb-4">
              <button className="px-3 py-1 rounded-lg bg-neon-cyan/20 text-neon-cyan text-sm font-medium">
                Weekly
              </button>
              <button className="px-3 py-1 rounded-lg text-muted-foreground hover:text-neon-cyan text-sm">
                Overall
              </button>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-2">
              {leaderboard.slice(0, 6).map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    player.isCurrentUser 
                      ? 'bg-neon-cyan/20 border border-neon-cyan/50 glow-cyan' 
                      : 'hover:bg-surface/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    player.rank <= 3 ? 'bg-gradient-to-br from-neon-cyan to-neon-magenta text-background' : 'bg-surface text-muted-foreground'
                  }`}>
                    {player.rank}
                  </div>
                  
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg bg-surface">
                    {player.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      player.isCurrentUser ? 'text-neon-cyan' : 'text-foreground'
                    }`}>
                      {player.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{player.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>

            {/* View Full Leaderboard */}
            <button className="w-full mt-4 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-neon-magenta hover:border-neon-magenta transition-colors text-sm">
              View Full Ranking
            </button>
          </div>
        </div>
      </div>

      {/* XP Toast Notification */}
      {showXPToast && (
        <XPToast
          amount={showXPToast}
          onComplete={() => setShowXPToast(null)}
        />
      )}

      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal
          newLevel={showLevelUp}
          onClose={() => setShowLevelUp(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;