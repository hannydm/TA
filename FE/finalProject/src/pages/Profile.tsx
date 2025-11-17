import { useState, useEffect } from 'react';
import { User as UserIcon, Trophy, Zap, Star, Calendar, Award } from 'lucide-react';
import { gameState, User, missions } from '@/lib/gameState';

const Profile = () => {
  const [user, setUser] = useState<User>(gameState.getUser());

  useEffect(() => {
    const unsubscribe = gameState.subscribe(setUser);
    return unsubscribe;
  }, []);

  const completedMissions = missions.filter(m => m.status === 'completed');
  const totalXpEarned = completedMissions.reduce((sum, m) => sum + m.xpReward, 0);
  const xpPercentage = (user.xp / user.maxXp) * 100;

  const badges = [
    { id: 'first_mission', name: 'First Steps', description: 'Complete your first mission', icon: '🎯', earned: true },
    { id: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on any quiz', icon: '🧠', earned: true },
    { id: 'speed_learner', name: 'Speed Learner', description: 'Complete 3 missions in one day', icon: '⚡', earned: false },
    { id: 'persistent', name: 'Persistent Explorer', description: 'Study for 7 days straight', icon: '🔥', earned: false },
    { id: 'top_performer', name: 'Top Performer', description: 'Reach top 3 in leaderboard', icon: '👑', earned: false },
    { id: 'knowledge_seeker', name: 'Knowledge Seeker', description: 'Complete all materials', icon: '📚', earned: false },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="mission-card p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-6xl glow-purple">
                {user.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center text-sm font-bold text-background">
                {user.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
              <p className="text-xl text-neon-cyan font-medium mb-4">@{user.username}</p>
              
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
                  <div className="text-2xl font-bold text-warning">{user.badges.length}</div>
                  <div className="text-sm text-muted-foreground">Badges</div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to Level {user.level + 1}</span>
                  <span className="text-neon-cyan font-medium">{user.xp}/{user.maxXp} XP</span>
                </div>
                <div className="xp-bar">
                  <div 
                    className="xp-fill" 
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="mission-card p-6 text-center">
            <Trophy className="w-8 h-8 text-neon-magenta mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Achievements</h3>
            <p className="text-3xl font-bold text-neon-magenta mb-1">{user.badges.length}/6</p>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </div>
          
          <div className="mission-card p-6 text-center">
            <Star className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Excellence</h3>
            <p className="text-3xl font-bold text-neon-cyan mb-1">92%</p>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>
          
          <div className="mission-card p-6 text-center">
            <Calendar className="w-8 h-8 text-success mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Consistency</h3>
            <p className="text-3xl font-bold text-success mb-1">5</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
        </div>

        {/* Badge Collection */}
        <div className="mission-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-neon-magenta" />
            <h2 className="text-2xl font-bold text-foreground">Badge Collection</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 border-neon-cyan/50 glow-cyan' 
                    : 'bg-surface/30 border-border/50 opacity-50 grayscale'
                }`}
              >
                <div className="text-center">
                  <div className={`text-4xl mb-3 ${badge.earned ? '' : 'opacity-50'}`}>
                    {badge.icon}
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    badge.earned ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {badge.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                  {badge.earned && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                        Earned
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mission-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Zap className="w-6 h-6 text-neon-cyan mr-3" />
            Recent Activity
          </h2>
          
          <div className="space-y-4">
            {[
              { action: 'Completed "Object-Oriented Programming" mission', xp: 100, time: '2 hours ago', type: 'mission' },
              { action: 'Earned "Quiz Master" badge', xp: 50, time: '1 day ago', type: 'badge' },
              { action: 'Completed "Data Structures" quiz with 95% score', xp: 50, time: '2 days ago', type: 'quiz' },
              { action: 'Leveled up to Level 3', xp: 0, time: '3 days ago', type: 'level' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-surface/30 border border-border/50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'mission' ? 'bg-mission-completed/20 text-mission-completed' :
                  activity.type === 'badge' ? 'bg-warning/20 text-warning' :
                  activity.type === 'quiz' ? 'bg-neon-cyan/20 text-neon-cyan' :
                  'bg-neon-magenta/20 text-neon-magenta'
                }`}>
                  {activity.type === 'mission' ? <Star className="w-5 h-5" /> :
                   activity.type === 'badge' ? <Award className="w-5 h-5" /> :
                   activity.type === 'quiz' ? <UserIcon className="w-5 h-5" /> :
                   <Trophy className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <p className="text-foreground font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                
                {activity.xp > 0 && (
                  <div className="flex items-center space-x-1 text-neon-cyan font-medium">
                    <Zap className="w-4 h-4" />
                    <span>+{activity.xp}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;