import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function applyMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes');
    console.error('SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey);
    process.exit(1);
  }

  console.log('🔗 Connexion à Supabase:', supabaseUrl);

  // Créer le client avec la clé service_role pour avoir les droits admin
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Lire le fichier SQL
  const migrationPath = join(__dirname, '../supabase/migrations/add_lesson_content_fields.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('\n📄 SQL à exécuter:');
  console.log('─'.repeat(60));
  console.log(sql);
  console.log('─'.repeat(60));
  console.log('');

  // Séparer les commandes SQL (par point-virgule)
  const commands = sql
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd && !cmd.startsWith('--'));

  console.log(`📊 ${commands.length} commande(s) SQL à exécuter\n`);

  // Exécuter chaque commande via l'API REST de Supabase
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    if (!command) continue;

    console.log(`⏳ Exécution commande ${i + 1}/${commands.length}...`);

    try {
      // Utiliser l'API REST de Supabase pour exécuter du SQL brut
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ query: command + ';' })
      });

      if (!response.ok) {
        console.log(`⚠️  L'API RPC n'est pas disponible (normal)`);
        break;
      }

      console.log(`✅ Commande ${i + 1} exécutée`);
    } catch (error) {
      console.log(`⚠️  Impossible d'exécuter via API`);
      break;
    }
  }

  console.log('\n💡 Application manuelle recommandée:');
  console.log('1. Va sur https://supabase.com/dashboard');
  console.log('2. Sélectionne ton projet');
  console.log('3. Va dans SQL Editor');
  console.log('4. Copie-colle le SQL ci-dessus');
  console.log('5. Exécute (Run)');
  console.log('');
  console.log('📋 Le SQL a été affiché ci-dessus, copie-le simplement !');
}

applyMigration().catch(console.error);
