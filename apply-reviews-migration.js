// Script temporaire pour appliquer la migration Reviews
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('📝 [MIGRATION] Lecture du fichier...');

  const migrationPath = path.join(__dirname, 'apps/web/supabase/migrations/20241116_add_reviews.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('🚀 [MIGRATION] Application de la migration reviews...');

  try {
    // Supabase client ne supporte pas l'exécution SQL directe
    // On doit utiliser l'API REST directement
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log('✅ [MIGRATION] Migration appliquée avec succès!');
  } catch (error) {
    console.error('❌ [MIGRATION] Erreur:', error.message);
    console.log('\n📋 [MIGRATION] Copiez ce SQL et exécutez-le dans le SQL Editor de Supabase:');
    console.log('\n' + sql);
  }
}

applyMigration();
