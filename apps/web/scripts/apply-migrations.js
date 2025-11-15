const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function applyMigrations() {
  // Créer le client Supabase avec la clé SERVICE_ROLE (admin)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variables d\'environnement manquantes');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('🚀 Application des migrations...\n');

  // Lire le fichier de migration
  const migrationPath = path.join(__dirname, '../supabase/migrations/add_lesson_content_fields.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration à appliquer:');
  console.log('─'.repeat(60));
  console.log(migrationSQL);
  console.log('─'.repeat(60));
  console.log('');

  try {
    // Exécuter la migration
    console.log('⏳ Exécution de la migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('❌ Erreur lors de l\'application de la migration:', error);
      console.error('\n💡 Solutions:');
      console.error('1. Applique manuellement cette migration via le dashboard Supabase');
      console.error('   → https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
      console.error('2. Ou copie le SQL ci-dessus et exécute-le dans l\'éditeur SQL');
      process.exit(1);
    }

    console.log('✅ Migration appliquée avec succès !');
    console.log('');

    // Vérifier que les colonnes existent maintenant
    console.log('🔍 Vérification de la structure de la table lessons...');
    const { data: columns, error: columnsError } = await supabase
      .from('lessons')
      .select('*')
      .limit(0);

    if (columnsError) {
      console.error('❌ Erreur lors de la vérification:', columnsError);
    } else {
      console.log('✅ Table lessons vérifiée !');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('\n💡 La fonction RPC "exec_sql" n\'existe pas.');
    console.error('Tu dois appliquer cette migration manuellement via le dashboard Supabase:');
    console.error('');
    console.error('1. Va sur: https://supabase.com/dashboard');
    console.error('2. Sélectionne ton projet');
    console.error('3. Va dans SQL Editor');
    console.error('4. Copie-colle le SQL ci-dessus');
    console.error('5. Exécute la requête');
  }
}

applyMigrations();
