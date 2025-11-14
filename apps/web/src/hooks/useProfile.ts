'use client';

/**
 * ============================================
 * HOOK PROFILE - RÉCUPÉRATION DU PROFIL
 * ============================================
 *
 * Récupère le profil de l'utilisateur depuis user_metadata.
 * Simple et fiable.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

interface Profile {
  id: string;
  email: string;
  role: 'learner' | 'creator';
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
}

export function useProfile() {
  console.log('📦 [PROFILE] Hook appelé');
  const { user, loading: authLoading } = useAuth();
  console.log('👤 [PROFILE] User récupéré du contexte:', user?.email || 'null');
  console.log('👤 [PROFILE] User ID:', user?.id || 'null');
  console.log('👤 [PROFILE] User metadata:', user?.user_metadata);
  console.log('⏳ [PROFILE] Auth loading:', authLoading);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 [PROFILE] useEffect déclenché');

    // Si l'auth est en cours de chargement, on attend
    if (authLoading) {
      console.log('⏳ [PROFILE] Auth en cours de chargement, on attend...');
      return;
    }

    // Si pas d'utilisateur après le chargement
    if (!user) {
      console.log('❌ [PROFILE] Pas d\'utilisateur après chargement auth');
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('🔍 [PROFILE] Chargement du profil pour:', user.id);

    // Construire le profil depuis user_metadata
    const profileData: Profile = {
      id: user.id,
      email: user.email || '',
      role: (user.user_metadata?.role as 'learner' | 'creator') || 'learner',
      first_name: user.user_metadata?.first_name,
      last_name: user.user_metadata?.last_name,
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
    };

    console.log('✅ [PROFILE] Profil construit:', profileData);
    setProfile(profileData);
    setLoading(false);
  }, [user, authLoading]);

  return { profile, loading };
}
