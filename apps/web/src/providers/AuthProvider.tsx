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
  const [loading, setLoading] = useState(false); // false au départ
  const initializedRef = useRef(false);

  useEffect(() => {
    // Ne s'exécuter qu'une seule fois
    if (initializedRef.current) {
      console.log('✅ [AUTH] Déjà initialisé');
      return;
    }

    console.log('🔐 [AUTH] Initialisation (onAuthStateChange uniquement)...');
    initializedRef.current = true;

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 [AUTH] Événement:', event);
      console.log('🔐 [AUTH] User:', session?.user?.email || 'Aucun');
      setSession(session);
      setUser(session?.user ?? null);
    });

    console.log('✅ [AUTH] Listener actif, en attente d\'authentification...');
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
