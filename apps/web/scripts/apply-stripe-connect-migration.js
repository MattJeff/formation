// ============================================
// 🔧 Script pour appliquer la migration Stripe Connect
// ============================================

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  console.log('📋 Application de la migration Stripe Connect...\n');

  try {
    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, '../migrations/add_stripe_connect_columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('SQL à exécuter:');
    console.log('='.repeat(50));
    console.log(sql);
    console.log('='.repeat(50) + '\n');

    // Exécuter via l'API Supabase Management
    // Note: Supabase client ne supporte pas les ALTER TABLE directement
    // Il faut utiliser le SQL Editor dans le dashboard ou psql
    console.log('⚠️  Pour appliquer cette migration:');
    console.log('1. Aller sur https://supabase.com/dashboard');
    console.log('2. Sélectionner votre projet');
    console.log('3. Aller dans SQL Editor');
    console.log('4. Copier/coller le SQL ci-dessus');
    console.log('5. Cliquer "Run"\n');

    console.log('Ou utiliser psql:');
    console.log(`psql "${process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', 'postgresql://')}"`);
    console.log(`Et exécuter: \\i ${sqlPath}\n`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

applyMigration();
