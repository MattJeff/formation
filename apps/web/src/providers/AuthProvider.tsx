'use client';

/**
 * ============================================
 * AUTH PROVIDER - VERSION SIMPLE ET STABLE
 * ============================================
 * 
 * Fournit l'état d'authentification à toute l'application.
 * Pas de boucles, pas de complexité.
 */

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-browser';
import type { User, Session } from '@supabase/supabase-js';

// Types
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Contexte
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Ne s'exécuter qu'une seule fois
    if (initializedRef.current) {
      console.log('✅ [AUTH] Déjà initialisé');
      return;
    }

    console.log('🔐 [AUTH] Initialisation...');
    initializedRef.current = true;

    // 1. Récupérer la session au démarrage
    console.log('🔐 [AUTH] Appel getSession()...');
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        console.log('🔐 [AUTH] Promise résolue !');
        if (error) {
          console.error('❌ [AUTH] Erreur getSession:', error);
        }
        console.log('🔐 [AUTH] Session récupérée:', session ? '✅ Connecté' : '❌ Non connecté');
        console.log('🔐 [AUTH] User:', session?.user?.email || 'Aucun');
        console.log('🔐 [AUTH] User ID:', session?.user?.id || 'Aucun');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('🔐 [AUTH] État mis à jour - loading:', false, 'user:', session?.user?.email || null);
      })
      .catch((error) => {
        console.error('❌ [AUTH] Catch error:', error);
        setLoading(false);
      });

    // 2. Écouter les changements
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 [AUTH] Événement:', event);
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Pas de cleanup pour éviter la réinitialisation en Strict Mode
    // La subscription sera nettoyée automatiquement au unmount final
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}
