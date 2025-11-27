import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { gameState } from '@/lib/gameState';
import { buildApiUrl, buildApiError, parseJson } from '@/lib/api';

interface ProfileUser {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface ProfileResponse {
  id?: number;
  user: ProfileUser;
  avatar?: string | null;
  level?: number;
  total_poin?: number;
}

interface AuthContextType {
  profile: ProfileResponse | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  authFetch: <T = unknown>(path: string, options?: RequestInit) => Promise<T>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'digi_world_access_token';
const LAST_ACTIVE_KEY = 'digi_world_last_active';
const MAX_IDLE_MS = 10 * 60 * 1000; // 10 minutes

const getLastActive = (): number | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(LAST_ACTIVE_KEY);
  if (!raw) return null;
  const ts = Number(raw);
  return Number.isFinite(ts) ? ts : null;
};

const touchLastActive = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storeToken = useCallback((access: string | null) => {
    if (typeof window === 'undefined') return;
    if (access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      touchLastActive();
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(LAST_ACTIVE_KEY);
    }
    setAccessToken(access);
  }, []);

  const syncGameStateUser = useCallback((apiProfile: ProfileResponse | null) => {
    if (!apiProfile) {
      gameState.resetUserProfile();
      return;
    }

    const username =
      apiProfile.user?.username ||
      (apiProfile.user?.email ? apiProfile.user.email.split('@')[0] : 'explorer');
    const displayName =
      [apiProfile.user?.first_name, apiProfile.user?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim() || username;
    const avatarSource = (displayName || username).trim();
    const avatar =
      (avatarSource && avatarSource.charAt(0).toUpperCase()) ||
      'E';

    const level = apiProfile.level ?? 1;
    const xp = apiProfile.total_poin ?? 0;
    const maxXp = Math.max(100, level * 100);

    gameState.setUserProfile({
      id: apiProfile.id ? String(apiProfile.id) : username,
      avatar,
      name: displayName,
      username,
      level,
      xp,
      maxXp,
      badges: [],
    });
  }, []);

  const clearAuth = useCallback(() => {
    storeToken(null);
    setProfile(null);
    syncGameStateUser(null);
  }, [storeToken, syncGameStateUser]);

  const fetchProfile = useCallback(
    async (tokenOverride?: string | null) => {
      const token = tokenOverride ?? accessToken;
      if (!token) {
        setProfile(null);
        syncGameStateUser(null);
        return null;
      }

      const response = await fetch(buildApiUrl('/api/profil/'), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Anggap token tidak valid, bersihkan dan jangan loop.
        clearAuth();
        return null;
      }

      if (!response.ok) {
        throw await buildApiError(response);
      }

      const data: ProfileResponse = await response.json();
      setProfile(data);
      syncGameStateUser(data);
      return data;
    },
    [accessToken, clearAuth, syncGameStateUser]
  );

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      try {
        const response = await fetch(buildApiUrl('/api/token/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: identifier, password }),
        });

        if (!response.ok) {
          throw await buildApiError(response);
        }

        const data = await response.json();
        storeToken(data.access);

        // Setelah login, coba ambil profil nyata dari backend.
        try {
          await fetchProfile(data.access);
        } catch (e) {
          console.error('Gagal mengambil profil setelah login:', e);
          // Jika gagal, minimal set profil dasar dari username.
          const fallbackProfile: ProfileResponse = {
            user: {
              username: identifier,
              email: '',
            },
            avatar: null,
            level: 1,
            total_poin: 0,
          };
          setProfile(fallbackProfile);
          syncGameStateUser(fallbackProfile);
        }

        return { error: null };
      } catch (error: any) {
        return { error };
      }
    },
    [storeToken, fetchProfile, syncGameStateUser]
  );

  const signUp = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        const response = await fetch(buildApiUrl('/api/registrasi/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
            password2: password,
          }),
        });

        if (!response.ok) {
          throw await buildApiError(response);
        }

        // Setelah registrasi, langsung login.
        return signIn(username, password);
      } catch (error: any) {
        return { error };
      }
    },
    [signIn]
  );

  const signOut = useCallback(() => {
    clearAuth();
    navigate('/login');
  }, [clearAuth, navigate]);

  const resetPassword = useCallback(async (_email: string) => {
    return {
      error: new Error('Password reset belum tersedia.'),
    };
  }, []);

  const authFetch = useCallback(
    async <T,>(path: string, options: RequestInit = {}) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      // Cek idle timeout berdasarkan aktivitas terakhir.
      const last = getLastActive();
      // Increase timeout to 24 hours for better UX, or remove strict check if causing issues
      const EXTENDED_TIMEOUT = 24 * 60 * 60 * 1000;
      if (!last || Date.now() - last > EXTENDED_TIMEOUT) {
        clearAuth();
        throw new Error('Session expired due to inactivity');
      }

      touchLastActive();

      const headers = new Headers(options.headers || {});
      if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      headers.set('Authorization', `Bearer ${accessToken}`);

      const response = await fetch(buildApiUrl(path), { ...options, headers });
      if (response.status === 401) {
        clearAuth();
        throw await buildApiError(response);
      }
      if (!response.ok) {
        throw await buildApiError(response);
      }
      return (await parseJson(response)) as T;
    },
    [accessToken, clearAuth]
  );

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Failed to refresh profile', error);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  // Saat aplikasi pertama kali dimuat, coba pulihkan sesi
  useEffect(() => {
    if (!accessToken) return;
    const last = getLastActive();
    const EXTENDED_TIMEOUT = 24 * 60 * 60 * 1000;
    if (!last || Date.now() - last > EXTENDED_TIMEOUT) {
      clearAuth();
      return;
    }

    setLoading(true);
    fetchProfile()
      .catch((error) => {
        console.error('Failed to restore session', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken, clearAuth, fetchProfile]);

  const value: AuthContextType = {
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    authFetch,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
