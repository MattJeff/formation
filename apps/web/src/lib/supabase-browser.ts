/**
 * ============================================
 * SUPABASE CLIENT - VERSION SIMPLE ET STABLE
 * ============================================
 * 
 * Ce fichier crée UN SEUL client Supabase pour toute l'application.
 * Pas de complexité, juste ce qui marche.
 */

import { createBrowserClient } from '@supabase/ssr';

// Variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Variables Supabase manquantes dans .env.local');
}

console.log('✅ [SUPABASE] Initialisation du client');

// Créer le client (une seule fois)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

console.log('✅ [SUPABASE] Client créé avec succès');
