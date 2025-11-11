import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Persister la session dans localStorage
    autoRefreshToken: true, // Rafraîchir automatiquement le token
    detectSessionInUrl: true, // Détecter la session dans l'URL (OAuth)
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Types pour l'authentification
export type User = {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
};

// Fonctions d'authentification
export const auth = {
  // Inscription avec email/password
  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });
    return { data, error };
  },

  // Connexion avec email/password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Connexion avec OAuth (Google, GitHub, LinkedIn)
  signInWithOAuth: async (provider: 'google' | 'github' | 'linkedin') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  // Déconnexion
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Récupérer l'utilisateur connecté
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Réinitialisation du mot de passe
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  // Mettre à jour le mot de passe
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  // Écouter les changements d'état d'authentification
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as User | null);
    });
  },
};
