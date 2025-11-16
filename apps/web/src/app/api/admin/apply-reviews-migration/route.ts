// ============================================
// 🔧 ADMIN: Apply Reviews Migration
// ============================================
// Route temporaire pour appliquer la migration
// Accès: GET /api/admin/apply-reviews-migration
// ============================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('📝 [MIGRATION] Début application migration reviews...');

    // Lire le fichier de migration
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20241116_add_reviews.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Séparer le SQL en statements individuels
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const results = [];

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\n[${i + 1}/${statements.length}] Exécution...`);

      try {
        // Pour les CREATE/ALTER, on peut les exécuter via raw query
        const { error } = await supabase.rpc('exec_sql', { query: statement });

        if (error) {
          console.error(`❌ Erreur statement ${i + 1}:`, error);
          results.push({ statement: i + 1, error: error.message });
        } else {
          console.log(`✅ Statement ${i + 1} OK`);
          results.push({ statement: i + 1, success: true });
        }
      } catch (err: any) {
        console.error(`❌ Exception statement ${i + 1}:`, err);
        results.push({ statement: i + 1, error: err.message });
      }
    }

    return NextResponse.json({
      message: 'Migration terminée',
      results,
      sql: migrationSQL
    });

  } catch (error: any) {
    console.error('❌ [MIGRATION] Erreur globale:', error);

    return NextResponse.json({
      error: 'Erreur lors de l\'application de la migration',
      details: error.message,
      instructions: [
        '1. Ouvrez Supabase SQL Editor:',
        '   https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/sql',
        '',
        '2. Copiez le contenu du fichier:',
        '   apps/web/supabase/migrations/20241116_add_reviews.sql',
        '',
        '3. Collez-le dans l\'éditeur SQL et exécutez'
      ].join('\n')
    }, { status: 500 });
  }
}
