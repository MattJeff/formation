/**
 * ⚠️⚠️⚠️ DANGER - ENDPOINT TEMPORAIRE DE DEBUG ⚠️⚠️⚠️
 *
 * CET ENDPOINT AFFICHE TOUTES LES CLÉS SECRÈTES EN CLAIR !
 * À SUPPRIMER IMMÉDIATEMENT APRÈS LE DEBUG !
 *
 * Usage: https://votre-app.vercel.app/api/debug/full-env
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const env = {
    // ⚠️ TOUT EN CLAIR POUR DEBUG
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,

    // Timestamp pour vérifier si c'est un nouveau build
    BUILD_TIME: new Date().toISOString(),

    // Comparaison avec les bonnes valeurs
    IS_SUPABASE_URL_CORRECT: process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://dwwkjhorxfjxhzozacxe.supabase.co',
    IS_ANON_KEY_CORRECT: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3d2tqaG9yeGZqeGh6b3phY3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njk1MDQsImV4cCI6MjA3ODQ0NTUwNH0.r34tMNBDS4EoRK0Uhn1bUjPnaAI22ZUD0ChsHQi2OEg',
  };

  return NextResponse.json(env, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
