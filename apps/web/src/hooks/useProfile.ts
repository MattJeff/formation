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

    // TIMEOUT: Si Supabase ne répond pas en 2 secondes, utiliser user_metadata
    const timeout = setTimeout(() => {
      console.log('⚠️ [PROFILE] Timeout Supabase, utilisation user_metadata');
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email || '',
        role: (user.user_metadata?.role as 'learner' | 'creator') || 'learner',
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
      };
      console.log('✅ [PROFILE] Fallback:', fallbackProfile.role);
      setProfile(fallbackProfile);
      setLoading(false);
      setLoadedUserId(user.id);
    }, 2000);

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        clearTimeout(timeout);
        if (error) {
          console.error('❌ [PROFILE] Erreur:', error);
          console.error('❌ [PROFILE] Code:', error.code);
          console.error('❌ [PROFILE] Message:', error.message);
          // Utiliser user_metadata en fallback
          const fallbackProfile: Profile = {
            id: user.id,
            email: user.email || '',
            role: (user.user_metadata?.role as 'learner' | 'creator') || 'learner',
            first_name: user.user_metadata?.first_name,
            last_name: user.user_metadata?.last_name,
          };
          console.log('✅ [PROFILE] Fallback après erreur:', fallbackProfile.role);
          setProfile(fallbackProfile);
          setError(null);
        } else {
          console.log('✅ [PROFILE] Chargé depuis DB:', data?.role || 'pas de rôle');
          setProfile(data);
          setError(null);
        }
        setLoading(false);
        setLoadedUserId(user.id);
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.error('❌ [PROFILE] Catch error:', err);
        // Utiliser user_metadata en fallback
        const fallbackProfile: Profile = {
          id: user.id,
          email: user.email || '',
          role: (user.user_metadata?.role as 'learner' | 'creator') || 'learner',
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
        };
        console.log('✅ [PROFILE] Fallback après catch:', fallbackProfile.role);
        setProfile(fallbackProfile);
        setLoading(false);
        setLoadedUserId(user.id);
      });
  }, [user?.id, loadedUserId]);

  return { profile, loading, error };
}
