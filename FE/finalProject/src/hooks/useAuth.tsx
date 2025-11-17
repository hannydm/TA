import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { gameState } from '@/lib/gameState';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const syncGameStateUser = (authUser: SupabaseUser | null) => {
    if (!authUser) {
      gameState.resetUserProfile();
      return;
    }

    const metadata = authUser.user_metadata || {};
    const username =
      (metadata.username as string) ||
      (authUser.email ? authUser.email.split('@')[0] : 'explorer');
    const displayName =
      (metadata.display_name as string) ||
      (metadata.full_name as string) ||
      username;
    const avatarSource = displayName.trim() || username;
    const avatar =
      (metadata.avatar as string) ||
      (avatarSource.charAt(0) || 'E').toUpperCase();

    gameState.resetUserProfile();
    gameState.setUserProfile({
      id: authUser.id,
      username,
      name: displayName,
      avatar,
    });
  };

  useEffect(() => {
    // Set up auth state listener
    const handleAuthChange = (nextSession: Session | null) => {
      setSession(nextSession);
      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);
      syncGameStateUser(nextUser);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => handleAuthChange(session)
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
            display_name: username,
          }
        }
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    gameState.resetUserProfile();
    navigate('/login');
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
