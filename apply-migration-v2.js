// Script pour appliquer la migration via l'API Management de Supabase
require('dotenv').config({ path: 'apps/web/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('📝 [MIGRATION] Application de la migration reviews...\n');

  try {
    // 1. Créer la table reviews
    console.log('1️⃣ Création de la table reviews...');
    const { error: createTableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(course_id, user_id)
        );
      `
    });

    if (createTableError && !createTableError.message.includes('already exists')) {
      throw createTableError;
    }

    console.log('✅ Table reviews créée\n');

    // 2. Créer les index
    console.log('2️⃣ Création des index...');
    await supabase.rpc('exec', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews(course_id);
        CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
        CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
      `
    });
    console.log('✅ Index créés\n');

    // 3. Ajouter colonnes à courses
    console.log('3️⃣ Ajout des colonnes rating dans courses...');
    await supabase.rpc('exec', {
      sql: `
        ALTER TABLE courses
          ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0,
          ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
      `
    });
    console.log('✅ Colonnes ajoutées\n');

    console.log('🎉 Migration appliquée avec succès!\n');
    console.log('⚠️  IMPORTANT: Vous devez encore appliquer manuellement:');
    console.log('   - La fonction trigger update_course_rating_stats()');
    console.log('   - Le trigger trigger_update_course_rating');
    console.log('   - Les RLS policies\n');
    console.log('📋 Allez sur https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/sql');
    console.log('   et exécutez le reste du fichier apps/web/supabase/migrations/20241116_add_reviews.sql');

  } catch (error) {
    console.error('❌ Erreur:', error);
    console.log('\n📋 Appliquez manuellement le SQL depuis:');
    console.log('   apps/web/supabase/migrations/20241116_add_reviews.sql');
  }
}

runMigration();
