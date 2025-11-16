# Migrations à appliquer en production

## Problème
Les erreurs 406 et 500 que tu rencontres en production viennent de migrations SQL qui ne sont pas appliquées sur la base de données Supabase de production.

## Migrations à exécuter

### 1. Table Reviews (PRIORITAIRE)
**Fichier**: `apps/web/supabase/migrations/20241116_add_reviews.sql`
**Ce qu'elle fait**:
- Crée la table `reviews` pour les avis sur les cours
- Ajoute les colonnes `average_rating` et `total_reviews` aux cours
- Configure les triggers pour calculer automatiquement les moyennes
- Configure les policies RLS

**Comment l'appliquer**:
1. Va sur https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/editor
2. Clique sur "SQL Editor"
3. Copie le contenu du fichier `apps/web/supabase/migrations/20241116_add_reviews.sql`
4. Exécute la requête

### 2. Champs Stripe pour Enrollments (PRIORITAIRE)
**Fichier**: `apps/web/supabase/migrations/20241116_add_stripe_fields_to_enrollments.sql`
**Ce qu'elle fait**:
- Ajoute `stripe_session_id` à la table `enrollments`
- Ajoute `stripe_payment_intent_id` à la table `enrollments`
- Nécessaire pour les paiements et remboursements

**Comment l'appliquer**:
1. Va sur https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/editor
2. Clique sur "SQL Editor"
3. Copie le contenu du fichier `apps/web/supabase/migrations/20241116_add_stripe_fields_to_enrollments.sql`
4. Exécute la requête

### 3. Stripe Connect Columns (PRIORITAIRE)
**Fichier**: `apps/web/migrations/add_stripe_connect_columns.sql`
**Ce qu'elle fait**:
- Ajoute les colonnes Stripe Connect au profil (stripe_account_id, etc.)

**Comment l'appliquer**:
1. Va sur https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/editor
2. Clique sur "SQL Editor"
3. Copie le contenu du fichier `apps/web/migrations/add_stripe_connect_columns.sql`
4. Exécute la requête

### 4. Vérifier les autres migrations
**Fichiers à vérifier**:
- `apps/web/supabase/migrations/add_enrollments.sql` (devrait déjà être appliquée)
- `apps/web/supabase/migrations/add_lesson_progress.sql` (devrait déjà être appliquée)
- `apps/web/supabase/migrations/add_lesson_comments.sql` (devrait déjà être appliquée)
- `apps/web/supabase/migrations/add_lesson_content_fields.sql` (devrait déjà être appliquée)

## Vérification après application

### Test 1: Vérifier que la table reviews existe
```sql
SELECT * FROM reviews LIMIT 1;
```
Devrait retourner une table vide (0 rows) mais pas d'erreur.

### Test 2: Vérifier les colonnes enrollments
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'enrollments'
AND column_name IN ('stripe_session_id', 'stripe_payment_intent_id', 'progress_percentage');
```
Devrait retourner 3 lignes.

### Test 3: Vérifier les colonnes Stripe Connect
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name LIKE 'stripe%';
```
Devrait retourner plusieurs lignes (stripe_account_id, stripe_account_status, etc.)

## Ordre d'application recommandé

1. **D'abord**: `add_stripe_connect_columns.sql` (pour Stripe Connect)
2. **Ensuite**: `20241116_add_stripe_fields_to_enrollments.sql` (pour les paiements)
3. **Enfin**: `20241116_add_reviews.sql` (pour les avis)

## Erreurs à surveiller

### Erreur: "Table already exists"
C'est normal, les scripts utilisent `CREATE TABLE IF NOT EXISTS`. Continue.

### Erreur: "Column already exists"
C'est normal, les scripts vérifient l'existence avant d'ajouter. Continue.

### Erreur: "Foreign key violation"
Assure-toi que la table `profiles` existe et contient des données.

## Après application

Une fois toutes les migrations appliquées:
1. Rafraîchis ton app en production
2. Teste la création d'un avis sur un cours
3. Teste un paiement
4. Vérifie qu'il n'y a plus d'erreurs 406 ou 500

Les erreurs devraient disparaître une fois les migrations appliquées.
