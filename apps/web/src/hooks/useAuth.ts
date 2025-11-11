'use client';

import { useState, useEffect } from 'react';
import { authService, UserProfile } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

/**
 * Hook personnalisé pour gérer l'authentification
 */
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'utilisateur initial
    const initAuth = async () => {
      const { user: currentUser, profile: currentProfile } = await authService.getCurrentUser();
      setUser(currentUser);
      setProfile(currentProfile);
      setLoading(false);
    };

    initAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { user: currentUser, profile: currentProfile } = await authService.getCurrentUser();
        setUser(currentUser);
        setProfile(currentProfile);
      } else {
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

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isCreator: profile?.role === 'creator',
    isLearner: profile?.role === 'learner',
    signOut,
  };
}
