import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Rocket, BookOpen, Trophy, LogOut, Zap, Menu, X, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { gameState, User as UserType } from '@/lib/gameState';
import { useAuth } from '@/hooks/useAuth';
import { buildApiUrl } from '@/lib/api';

const GameLayout = () => {
  const navigate = useNavigate();
  const { profile, loading, signOut } = useAuth();
  const [user, setUser] = useState<UserType>(gameState.getUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = gameState.subscribe(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/login');
    }
  }, [profile, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="starfield"></div>
        <p className="relative z-10 text-lg text-muted-foreground">
          Preparing your adventure...
        </p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const displayName = user.name || user.username;
  const avatarInitial = (
    displayName?.charAt(0) ||
    'E'
  ).toUpperCase();

  const avatarPath = profile.avatar || '';
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

  const isTeacher = !!profile.user?.is_staff;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Rocket },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/materials', label: 'Materials', icon: BookOpen },
    { path: '/quiz', label: 'Quizzes', icon: Zap },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ...(isTeacher ? [{ path: '/teacher', label: 'Teacher', icon: GraduationCap }] : []),
  ];

  return (
    <div className="min-h-screen">
      {/* Starfield Background */}
      <div className="starfield"></div>

      {/* Cosmic Navbar */}
      <nav className="relative z-50 border-b border-border/50 backdrop-blur-md bg-surface/80">
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

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive
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

            {/* User Info & Logout (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {/* XP Display */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-lg bg-surface/80 border border-border/50">
                <Zap className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm font-medium text-neon-cyan">
                  {user.xp} XP
                </span>
              </div>

              {/* User Avatar & Level */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-lg text-white overflow-hidden">
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
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Level {user.level}
                  </span>
                </div>
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

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-border/50 p-4 shadow-xl animate-in slide-in-from-top-5">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                      ? 'bg-neon-cyan/20 text-neon-cyan glow-cyan'
                      : 'text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <div className="h-px bg-border/50 my-2" />

              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-lg text-white overflow-hidden">
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
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Level {user.level} • {user.xp} XP
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default GameLayout;
