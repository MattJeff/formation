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
import { supabase } from '@/lib/supabase';
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
  const [loading, setLoading] = useState(true); // true au départ pour charger la session
  const initializedRef = useRef(false);

  useEffect(() => {
    // Ne s'exécuter qu'une seule fois
    if (initializedRef.current) {
      console.log('✅ [AUTH] Déjà initialisé');
      return;
    }

    console.log('🔐 [AUTH] Initialisation...');
    initializedRef.current = true;

    // 1. Récupérer la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 [AUTH] Session initiale:', session?.user?.email || 'Aucune');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 [AUTH] Événement:', event);
      console.log('🔐 [AUTH] User:', session?.user?.email || 'Aucun');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    console.log('✅ [AUTH] Listener actif');

    return () => {
      subscription.unsubscribe();
    };
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
