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
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log('👤 [PROFILE] useEffect déclenché - user:', user?.email || 'undefined');
    
    // Si pas d'utilisateur
    if (!user) {
      console.log('👤 [PROFILE] Pas d\'utilisateur, attente...');
      setProfile(null);
      setLoading(false);
      setLoadedUserId(null);
      return;
    }

    // Si déjà chargé pour cet utilisateur, ne pas recharger
    if (loadedUserId === user.id) {
      console.log('✅ [PROFILE] Déjà chargé pour:', user.id);
      return;
    }

    console.log('👤 [PROFILE] Chargement pour:', user.id);
    setLoading(true);

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
          console.log('✅ [PROFILE] Chargé:', data?.role || 'pas de rôle');
          setProfile(data);
          setError(null);
        }
        setLoading(false);
        setLoadedUserId(user.id);
      });
  }, [user?.id, loadedUserId]);

  return { profile, loading, error };
}
