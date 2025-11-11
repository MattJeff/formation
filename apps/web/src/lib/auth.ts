import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  role: 'learner' | 'creator';
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

/**
 * Service d'authentification centralisé
 */
export const authService = {
  /**
   * Récupérer l'utilisateur connecté avec son profil
   */
  async getCurrentUser(): Promise<{ user: any; profile: UserProfile | null; error: any }> {
    try {
      // Récupérer l'utilisateur
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        return { user: null, profile: null, error: userError };
      }

      // Récupérer le profil depuis la table profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // Fallback sur les métadonnées si le profil n'existe pas
        const fallbackProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          role: (user.user_metadata?.role as 'learner' | 'creator') || 'learner',
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
          avatar_url: user.user_metadata?.avatar_url,
        };
        return { user, profile: fallbackProfile, error: null };
      }

      return { user, profile: profile as UserProfile, error: null };
    } catch (error) {
      console.error('❌ Erreur getCurrentUser:', error);
      return { user: null, profile: null, error };
    }
  },

  /**
   * Récupérer la session active
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      console.error('❌ Erreur getSession:', error);
      return { session: null, error };
    }
  },

  /**
   * Vérifier si l'utilisateur est un créateur
   */
  async isCreator(): Promise<boolean> {
    const { profile } = await this.getCurrentUser();
    return profile?.role === 'creator';
  },

  /**
   * Se déconnecter
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
};
