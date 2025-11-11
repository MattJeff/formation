'use client';

/**
 * ============================================
 * HOOK PROFILE - RÉCUPÉRATION DU PROFIL
 * ============================================
 * 
 * Récupère le profil de l'utilisateur depuis la table profiles.
 * Séparé de l'auth pour éviter les boucles.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { useAuth } from '@/providers/AuthProvider';

interface Profile {
  id: string;
  email: string;
  role: 'learner' | 'creator';
  first_name?: string;
  last_name?: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      console.log('👤 [PROFILE] Pas d\'utilisateur');
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('👤 [PROFILE] Chargement pour:', user.id);

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ [PROFILE] Erreur:', error);
          setError(error.message);
          setProfile(null);
        } else {
          console.log('✅ [PROFILE] Chargé:', data.role);
          setProfile(data);
          setError(null);
        }
        setLoading(false);
      });
  }, [user]);

  return { profile, loading, error };
}
