// ============================================
// 🔧 ADMIN: Run SQL Migration
// ============================================
// Exécute la migration SQL pour le système de reviews
// GET /api/admin/run-migration
// ============================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('📝 [MIGRATION] Début migration reviews...');

    const steps: any[] = [];

    // 1. Créer la table reviews
    console.log('1️⃣ Création table reviews...');
    try {
      const { error } = await supabase.from('reviews').select('id').limit(1);
      if (!error) {
        steps.push({ step: 1, status: 'skip', message: 'Table reviews existe déjà' });
      }
    } catch (e) {
      // Table n'existe pas, on doit la créer manuellement
      steps.push({
        step: 1,
        status: 'manual',
        message: 'Table reviews doit être créée manuellement via SQL Editor'
      });
    }

    // 2. Ajouter colonnes à courses (si elles n'existent pas)
    console.log('2️⃣ Ajout colonnes rating...');
    try {
      const { error } = await supabase
        .from('courses')
        .select('average_rating, total_reviews')
        .limit(1);

      if (error) {
        steps.push({
          step: 2,
          status: 'manual',
          message: 'Colonnes rating doivent être ajoutées manuellement via SQL Editor'
        });
      } else {
        steps.push({ step: 2, status: 'ok', message: 'Colonnes rating existent' });
      }
    } catch (e: any) {
      steps.push({ step: 2, status: 'error', message: e.message });
    }

    console.log('✅ [MIGRATION] Vérification terminée');

    return NextResponse.json({
      message: 'Vérification de la migration',
      steps,
      instructions: {
        title: 'Migration manuelle requise',
        url: 'https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/sql',
        steps: [
          '1. Ouvrez le SQL Editor Supabase (lien ci-dessus)',
          '2. Copiez le contenu du fichier: apps/web/supabase/migrations/20241116_add_reviews.sql',
          '3. Collez-le dans l\'éditeur et cliquez sur "Run"',
          '4. Vérifiez que tout s\'exécute sans erreur'
        ]
      }
    });

  } catch (error: any) {
    console.error('❌ [MIGRATION] Erreur:', error);
    return NextResponse.json({
      error: 'Erreur migration',
      details: error.message
    }, { status: 500 });
  }
}
