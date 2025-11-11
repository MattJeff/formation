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
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

interface Profile {
  id: string;
  email: string;
  role: 'learner' | 'creator';
  first_name?: string;
  last_name?: string;
}

export function useProfile() {
  console.log('📦 [PROFILE] Hook appelé');
  const { user } = useAuth();
  console.log('👤 [PROFILE] User récupéré du contexte:', user?.email || 'null');
  console.log('👤 [PROFILE] User ID:', user?.id || 'null');
  console.log('👤 [PROFILE] User metadata:', user?.user_metadata);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 [PROFILE] useEffect déclenché');
    console.log('👤 [PROFILE] user dans useEffect:', user?.email || 'undefined');
    console.log('👤 [PROFILE] loadedUserId:', loadedUserId);
    
    // Si pas d'utilisateur
    if (!user) {
      console.log('❌ [PROFILE] Pas d\'utilisateur');
      console.log('📊 [PROFILE] setProfile(null)');
      setProfile(null);
      console.log('📊 [PROFILE] setLoading(false)');
      setLoading(false);
      console.log('📊 [PROFILE] setLoadedUserId(null)');
      setLoadedUserId(null);
      console.log('⏸️ [PROFILE] Return early');
      return;
    }

    // Si déjà chargé pour cet utilisateur, ne pas recharger
    if (loadedUserId === user.id) {
      console.log('✅ [PROFILE] Déjà chargé pour:', user.id);
      console.log('⏸️ [PROFILE] Return early (déjà chargé)');
      return;
    }

    console.log('🚀 [PROFILE] Début chargement pour:', user.id);
    console.log('📊 [PROFILE] setLoading(true)');
    setLoading(true);
    console.log('✅ [PROFILE] Loading mis à true');

    // TIMEOUT: Si Supabase ne répond pas en 2 secondes, utiliser user_metadata
    console.log('⏱️ [PROFILE] Démarrage timeout 2s');
    const timeout = setTimeout(() => {
      console.log('⏰ [PROFILE] TIMEOUT ATTEINT (2s) !');
      console.log('⚠️ [PROFILE] Timeout Supabase, utilisation user_metadata');
      console.log('📊 [PROFILE] Création fallbackProfile...');
      console.log('📊 [PROFILE] user.user_metadata:', user.user_metadata);
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email || '',
        role: (user.user_metadata?.role as 'learner' | 'creator') || 'learner',
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
      };
      console.log('✅ [PROFILE] Fallback créé:', fallbackProfile);
      console.log('📊 [PROFILE] setProfile(fallbackProfile)');
      setProfile(fallbackProfile);
      console.log('📊 [PROFILE] setLoading(false)');
      setLoading(false);
      console.log('📊 [PROFILE] setLoadedUserId:', user.id);
      setLoadedUserId(user.id);
      console.log('✅ [PROFILE] Timeout terminé');
    }, 2000);

    console.log('📡 [PROFILE] Appel Supabase.from(profiles)...');
    console.log('📡 [PROFILE] Query: SELECT * FROM profiles WHERE id =', user.id);
    
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        console.log('📥 [PROFILE] Promise résolue !');
        console.log('📥 [PROFILE] data:', data);
        console.log('📥 [PROFILE] error:', error);
        console.log('⏱️ [PROFILE] clearTimeout');
        clearTimeout(timeout);
        
        if (error) {
          console.log('❌ [PROFILE] ERREUR DÉTECTÉE');
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
          console.log('✅ [PROFILE] Fallback après erreur:', fallbackProfile);
          console.log('📊 [PROFILE] setProfile(fallbackProfile)');
          setProfile(fallbackProfile);
          console.log('📊 [PROFILE] setError(null)');
          setError(null);
        } else {
          console.log('✅ [PROFILE] SUCCÈS DB');
          console.log('✅ [PROFILE] Data reçue:', data);
          console.log('📊 [PROFILE] setProfile(data)');
          setProfile(data);
          console.log('📊 [PROFILE] setError(null)');
          setError(null);
        }
        console.log('📊 [PROFILE] setLoading(false)');
        setLoading(false);
        console.log('📊 [PROFILE] setLoadedUserId:', user.id);
        setLoadedUserId(user.id);
        console.log('✅ [PROFILE] Then terminé');
      })
      .catch((err) => {
        console.log('🔥 [PROFILE] CATCH DÉCLENCHÉ !');
        console.log('🔥 [PROFILE] Erreur catch:', err);
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
        console.log('✅ [PROFILE] Fallback après catch:', fallbackProfile);
        console.log('📊 [PROFILE] setProfile(fallbackProfile)');
        setProfile(fallbackProfile);
        console.log('📊 [PROFILE] setLoading(false)');
        setLoading(false);
        console.log('📊 [PROFILE] setLoadedUserId:', user.id);
        setLoadedUserId(user.id);
        console.log('✅ [PROFILE] Catch terminé');
      });
    
    console.log('✅ [PROFILE] Fin du useEffect');
  }, [user?.id, loadedUserId]);

  return { profile, loading, error };
}
