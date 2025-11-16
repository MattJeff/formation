# 📝 Instructions: Appliquer la Migration Reviews

## ✅ Ce qui est déjà fait

1. **Migration SQL créée**: `apps/web/supabase/migrations/20241116_add_reviews.sql`
2. **API routes créées**:
   - GET `/api/courses/[id]/reviews` - Récupérer les avis
   - POST `/api/courses/[id]/reviews` - Créer/modifier un avis
3. **Composant React créé**: `ReviewsSection.tsx`
4. **Intégration complétée**: Le composant est ajouté à `CourseDetailClient.tsx`

## 🔧 Action requise: Appliquer la migration SQL

La migration doit être appliquée manuellement dans Supabase SQL Editor.

### Étapes:

1. **Ouvrez le SQL Editor Supabase**:
   - Allez sur: https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/sql
   - Ou: Supabase Dashboard → Votre projet → SQL Editor

2. **Copiez le SQL**:
   ```bash
   cat apps/web/supabase/migrations/20241116_add_reviews.sql
   ```

3. **Collez et exécutez**:
   - Collez tout le contenu dans l'éditeur SQL
   - Cliquez sur "Run" ou Cmd+Enter

4. **Vérifiez le résultat**:
   - Toutes les commandes doivent s'exécuter sans erreur
   - Vous devriez voir "Success" pour chaque statement

## 📋 Ce que la migration fait

1. **Crée la table `reviews`**:
   - Colonnes: id, course_id, user_id, rating, comment, created_at, updated_at
   - Contrainte unique: un seul avis par utilisateur par cours

2. **Ajoute des colonnes à `courses`**:
   - `average_rating` (NUMERIC 3,2) - Moyenne des notes
   - `total_reviews` (INTEGER) - Nombre total d'avis

3. **Crée une fonction trigger** `update_course_rating_stats()`:
   - Recalcule automatiquement average_rating et total_reviews
   - Se déclenche après INSERT/UPDATE/DELETE sur reviews

4. **Configure RLS (Row Level Security)**:
   - Lecture publique des reviews
   - Seuls les étudiants inscrits peuvent créer des reviews
   - Utilisateurs peuvent modifier/supprimer leurs propres reviews

## 🧪 Tester après migration

1. **Vérifier que la table existe**:
   ```sql
   SELECT * FROM reviews LIMIT 1;
   ```

2. **Vérifier les nouvelles colonnes courses**:
   ```sql
   SELECT id, title, average_rating, total_reviews FROM courses LIMIT 5;
   ```

3. **Tester la création d'un review**:
   - Inscrivez-vous à un cours
   - Allez sur la page du cours
   - Laissez un avis avec note et commentaire
   - Vérifiez que average_rating se met à jour automatiquement

## ❓ En cas d'erreur

Si vous voyez des erreurs du type "already exists", c'est normal - cela signifie que certaines parties de la migration ont déjà été appliquées.

Si d'autres erreurs apparaissent, vérifiez:
- Que vous utilisez le service role key (pas l'anon key)
- Que les tables `courses` et `profiles` existent
- Que vous avez les droits admin sur le projet Supabase
