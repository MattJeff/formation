'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserProfile } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isCreator: boolean;
  isLearner: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const { user: currentUser, profile: currentProfile } = await authService.getCurrentUser();
      setUser(currentUser);
      setProfile(currentProfile);
    } catch (error) {
      console.error('❌ Erreur chargement user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Charger l'utilisateur au démarrage
    loadUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await loadUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isCreator: profile?.role === 'creator',
    isLearner: profile?.role === 'learner',
    signOut,
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
