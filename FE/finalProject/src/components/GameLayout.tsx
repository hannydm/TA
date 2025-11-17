import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Rocket, BookOpen, Trophy, LogOut, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { gameState, User as UserType } from '@/lib/gameState';

const GameLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType>(gameState.getUser());

  useEffect(() => {
    const unsubscribe = gameState.subscribe(setUser);
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Rocket },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/materials', label: 'Materials', icon: BookOpen },
    { path: '/quiz', label: 'Quizzes', icon: Zap },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="min-h-screen">
      {/* Starfield Background */}
      <div className="starfield"></div>
      
      {/* Cosmic Navbar */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-md bg-surface/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                <Rocket className="w-5 h-5 text-background" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                Petualangan Informatika
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-neon-cyan/20 text-neon-cyan glow-cyan'
                        : 'text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              {/* XP Display */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-lg bg-surface/80 border border-border/50">
                <Zap className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm font-medium text-neon-cyan">
                  {user.xp}/{user.maxXp} XP
                </span>
              </div>

              {/* User Avatar & Level */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  Level {user.level}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default GameLayout;