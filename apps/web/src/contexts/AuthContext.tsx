'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  const [initialized, setInitialized] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const { user: currentUser, profile: currentProfile } = await authService.getCurrentUser();
      setUser(currentUser);
      setProfile(currentProfile);
    } catch (error) {
      console.error('❌ Erreur chargement user:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Charger l'utilisateur au démarrage (une seule fois)
    if (!initialized) {
      loadUser();
    }

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth event:', event);
      
      if (event === 'SIGNED_IN') {
        // Utilisateur vient de se connecter
        await loadUser();
      } else if (event === 'SIGNED_OUT') {
        // Utilisateur vient de se déconnecter
        setUser(null);
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED') {
        // Token rafraîchi, ne rien faire (évite les rechargements)
        console.log('🔄 Token rafraîchi');
      } else if (event === 'USER_UPDATED') {
        // Profil mis à jour
        await loadUser();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [initialized, loadUser]);

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
