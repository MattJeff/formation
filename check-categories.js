// Script pour vérifier les catégories réelles dans la base de données
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  console.log('📊 [CHECK] Récupération des cours...\n');

  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, category, status')
    .eq('status', 'published');

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log(`✅ ${courses.length} cours publiés trouvés\n`);

  // Grouper par catégorie
  const categoriesMap = {};
  courses.forEach(course => {
    const cat = course.category || 'null';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(course.title);
  });

  console.log('📁 CATÉGORIES UTILISÉES:\n');
  Object.keys(categoriesMap).sort().forEach(cat => {
    console.log(`  ${cat}: ${categoriesMap[cat].length} cours`);
    categoriesMap[cat].forEach(title => {
      console.log(`    - ${title}`);
    });
    console.log('');
  });

  console.log('\n📋 VALEURS À METTRE DANS LE SELECT:');
  Object.keys(categoriesMap).sort().forEach(cat => {
    if (cat !== 'null') {
      console.log(`  <option value="${cat}">${cat}</option>`);
    }
  });
}

checkCategories();
