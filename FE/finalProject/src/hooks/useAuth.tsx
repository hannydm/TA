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
  is_staff?: boolean;
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
const REFRESH_TOKEN_KEY = 'digi_world_refresh_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : localStorage.getItem(REFRESH_TOKEN_KEY)
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storeTokens = useCallback(
    (tokens: { access?: string | null; refresh?: string | null }) => {
      if (typeof window === 'undefined') return;

      if (tokens.access !== undefined) {
        if (tokens.access) {
          localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
        } else {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
        setAccessToken(tokens.access ?? null);
      }

      if (tokens.refresh !== undefined) {
        if (tokens.refresh) {
          localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
        } else {
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
        setRefreshToken(tokens.refresh ?? null);
      }
    },
    []
  );

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
    storeTokens({ access: null, refresh: null });
    setProfile(null);
    syncGameStateUser(null);
  }, [storeTokens, syncGameStateUser]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return null;

    try {
      const response = await fetch(buildApiUrl('/api/token/refresh/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        clearAuth();
        return null;
      }

      const data = await response.json();
      if (data?.access) {
        storeTokens({ access: data.access });
        return data.access as string;
      }

      clearAuth();
      return null;
    } catch (error) {
      console.error('Failed to refresh access token', error);
      clearAuth();
      return null;
    }
  }, [refreshToken, clearAuth, storeTokens]);

  const fetchProfile = useCallback(
    async (tokenOverride?: string | null) => {
      const token = tokenOverride ?? accessToken;
      if (!token) {
        setProfile(null);
        syncGameStateUser(null);
        return null;
      }

      const requestProfile = async (rawToken: string) => {
        const response = await fetch(buildApiUrl('/api/profil/'), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rawToken}`,
          },
        });

        if (response.status === 401) {
          throw await buildApiError(response);
        }

        if (!response.ok) {
          throw await buildApiError(response);
        }

        const data: ProfileResponse = await response.json();
        setProfile(data);
        syncGameStateUser(data);
        return data;
      };

      try {
        return await requestProfile(token);
      } catch (error: any) {
        if (!tokenOverride && error?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return requestProfile(newToken);
          }
          clearAuth();
          return null;
        }
        throw error;
      }
    },
    [accessToken, clearAuth, refreshAccessToken, syncGameStateUser]
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
        // Reset local profile to avoid progress leak when switching accounts.
        setProfile(null);
        syncGameStateUser(null);
        storeTokens({ access: data.access, refresh: data.refresh });

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
    [storeTokens, fetchProfile, syncGameStateUser]
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
      const performRequest = async (token: string) => {
        const headers = new Headers(options.headers || {});
        if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }
        headers.set('Authorization', `Bearer ${token}`);

        const response = await fetch(buildApiUrl(path), { ...options, headers });
        if (response.status === 401) {
          throw await buildApiError(response);
        }
        if (!response.ok) {
          throw await buildApiError(response);
        }
        return (await parseJson(response)) as T;
      };

      let token = accessToken;

      if (!token && refreshToken) {
        token = await refreshAccessToken();
      }

      if (!token) {
        throw new Error('Not authenticated');
      }

      try {
        return await performRequest(token);
      } catch (error: any) {
        if (error?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return performRequest(newToken);
          }
          clearAuth();
        }
        throw error;
      }
    },
    [accessToken, refreshToken, clearAuth, refreshAccessToken]
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
    if (!accessToken && !refreshToken) return;

    const restoreSession = async () => {
      setLoading(true);
      try {
        if (!accessToken && refreshToken) {
          await refreshAccessToken();
        }
        await fetchProfile();
      } catch (error) {
        console.error('Failed to restore session', error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [accessToken, refreshToken, fetchProfile, refreshAccessToken]);

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
