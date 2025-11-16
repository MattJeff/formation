# 🔧 Fix: Ajouter les champs Stripe manquants à enrollments

## Problème détecté

Les colonnes `stripe_session_id` et `stripe_payment_intent_id` manquent dans la table `enrollments`.

**Symptômes:**
- ❌ Montants incorrects (0.01€ au lieu de 10€) → **CORRIGÉ dans le code**
- ❌ Bouton "Rembourser" affiche "N/A" pour les paiements valides
- ❌ Impossibilité de tracker les paiements Stripe
- ❌ Remboursements impossibles

## Solution

Appliquer la migration SQL pour ajouter les colonnes manquantes.

---

## Méthode 1: Via Supabase Dashboard (Recommandé)

### Étape 1: Ouvrir SQL Editor

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Cliquer sur **SQL Editor** dans le menu de gauche

### Étape 2: Exécuter la migration

1. Cliquer sur **"New query"**
2. Copier-coller le contenu du fichier:
   ```
   apps/web/supabase/migrations/20241116_add_stripe_fields_to_enrollments.sql
   ```
3. Cliquer sur **"Run"**

### Étape 3: Vérifier

Vous devriez voir les messages:
```
NOTICE: Colonne stripe_session_id ajoutée
NOTICE: Colonne stripe_payment_intent_id ajoutée
NOTICE: ✅ Migration terminée avec succès
```

---

## Méthode 2: Via le script Node.js

```bash
cd apps/web
node scripts/apply-stripe-enrollments-migration.js
```

**Note:** Cette méthode peut ne pas fonctionner car Supabase ne permet pas toujours les requêtes DDL (ALTER TABLE) via l'API. Si ça échoue, utilisez la Méthode 1.

---

## Vérification après migration

### 1. Vérifier les colonnes

Dans SQL Editor, exécutez:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'enrollments'
AND column_name IN ('stripe_session_id', 'stripe_payment_intent_id');
```

Résultat attendu:
```
column_name                 | data_type
----------------------------|----------
stripe_session_id           | text
stripe_payment_intent_id    | text
```

### 2. Tester un nouveau paiement

1. Créer un cours payant
2. L'acheter avec une carte test Stripe: `4242 4242 4242 4242`
3. Vérifier dans Supabase que l'enrollment a bien les champs remplis:
   ```sql
   SELECT id, payment_status, payment_amount, stripe_session_id, stripe_payment_intent_id
   FROM enrollments
   ORDER BY created_at DESC
   LIMIT 5;
   ```

### 3. Vérifier l'affichage

1. Aller sur `/creator/analytics`
2. Vérifier que les montants sont corrects (10€, pas 0.10€)
3. Vérifier que le bouton "Rembourser" apparaît pour les paiements valides

---

## Corrections déjà appliquées dans le code

### ✅ Fix 1: Montants incorrects

**Avant:**
```typescript
amount: enrollment.payment_amount ? enrollment.payment_amount / 100 : 0
// 10€ en DB → 10 / 100 = 0.10€ ❌
```

**Après:**
```typescript
amount: enrollment.payment_amount || 0
// 10€ en DB → 10€ ✅
```

### ✅ Fix 2: Bouton "N/A"

**Avant:**
```typescript
stripePaymentIntentId: enrollment.stripe_payment_intent_id
// undefined si colonne manquante → bouton N/A ❌
```

**Après:**
```typescript
stripePaymentIntentId: enrollment.stripe_payment_intent_id || enrollment.payment_id
// Fallback sur payment_id si stripe_payment_intent_id manque ✅
```

---

## Que se passe-t-il après la migration ?

### Pour les nouveaux paiements
- ✅ Les champs `stripe_session_id` et `stripe_payment_intent_id` seront remplis automatiquement
- ✅ Le bouton "Rembourser" apparaîtra correctement
- ✅ Les montants s'afficheront correctement

### Pour les anciens paiements
- ⚠️ Les enrollments existants n'auront PAS ces champs
- ⚠️ Le bouton "Rembourser" affichera "N/A" (normal, pas de payment_intent)
- ✅ Les montants s'afficheront correctement (fix dans le code)

Si vous avez besoin de rembourser un ancien paiement, deux options:
1. Faire le remboursement manuellement depuis Stripe Dashboard
2. Mettre à jour l'enrollment avec le `stripe_payment_intent_id` depuis Stripe Dashboard

---

## Commandes SQL utiles

### Compter les enrollments sans payment_intent

```sql
SELECT COUNT(*)
FROM enrollments
WHERE payment_status = 'paid'
AND stripe_payment_intent_id IS NULL;
```

### Voir tous les enrollments payants

```sql
SELECT
  id,
  payment_status,
  payment_amount,
  stripe_session_id,
  stripe_payment_intent_id,
  created_at
FROM enrollments
WHERE payment_status = 'paid'
ORDER BY created_at DESC;
```

### Mettre à jour manuellement un enrollment (si nécessaire)

```sql
UPDATE enrollments
SET
  stripe_session_id = 'cs_test_xxxxx',
  stripe_payment_intent_id = 'pi_xxxxx'
WHERE id = 'enrollment-uuid-here';
```

---

## Résumé

**Avant:**
- ❌ Table incomplete
- ❌ Montants incorrects (0.10€)
- ❌ Bouton "Rembourser" affiche "N/A"
- ❌ Impossibilité de rembourser

**Après migration + fixes:**
- ✅ Table complète avec colonnes Stripe
- ✅ Montants corrects (10.00€)
- ✅ Bouton "Rembourser" pour nouveaux paiements
- ✅ Système de remboursement fonctionnel

---

**Date:** 2024-11-16
**Fichiers modifiés:**
- `/api/creator/analytics/route.ts` - Fix montants
- `/creator/analytics/page.tsx` - Fix UI + fallback payment_id
- `/supabase/migrations/20241116_add_stripe_fields_to_enrollments.sql` - Migration

**Migration à appliquer:**
- `20241116_add_stripe_fields_to_enrollments.sql`
