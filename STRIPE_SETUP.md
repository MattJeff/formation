# 🛒 GUIDE CONFIGURATION STRIPE

## 📋 Vue d'ensemble

Ce document explique comment configurer et tester le système de paiement Stripe pour la plateforme de formation.

## 🏗️ Architecture

```
FLOW COMPLET DE PAIEMENT:

1. User clique "Acheter" sur /courses/[id]
   └─> Redirection vers /courses/[id]/checkout

2. Page checkout appelle API
   └─> POST /api/stripe/create-checkout-session
       └─> Crée session Stripe + retourne sessionId

3. Frontend redirige vers Stripe Checkout
   └─> stripe.redirectToCheckout({ sessionId })

4. User paie sur Stripe

5. Stripe envoie webhook
   └─> POST /api/stripe/webhook
       └─> Vérifie signature
       └─> Crée enrollment dans Supabase

6. Stripe redirige user
   └─> Succès: /checkout/success?session_id={ID}
   └─> Annulé: /checkout/cancel
```

## 📁 Fichiers créés

### Types et utilitaires
- `src/types/stripe.ts` - Types TypeScript et instance Stripe serveur

### API Routes
- `src/app/api/stripe/create-checkout-session/route.ts` - Création de session
- `src/app/api/stripe/webhook/route.ts` - Gestion des webhooks

### Pages
- `src/app/courses/[id]/checkout/page.tsx` - Page de checkout
- `src/app/courses/[id]/checkout/CheckoutClient.tsx` - Logique checkout
- `src/app/checkout/success/page.tsx` - Succès paiement
- `src/app/checkout/success/CheckoutSuccessClient.tsx` - Logique succès
- `src/app/checkout/cancel/page.tsx` - Annulation paiement

## 🔧 Configuration

### 1. Variables d'environnement

Dans `apps/web/.env.local`:

```bash
# Clés Stripe (déjà configurées)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Webhook secret (à configurer)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Obtenir le Webhook Secret

#### A. Développement local avec Stripe CLI

1. Installer Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login:
```bash
stripe login
```

3. Écouter les webhooks:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copier le `webhook signing secret` (whsec_...) dans `.env.local`

5. Relancer le serveur Next.js pour prendre en compte la variable

#### B. Production avec Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer "Add endpoint"
3. URL: `https://votredomaine.com/api/stripe/webhook`
4. Events à sélectionner:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copier le "Signing secret" dans `.env.local` en production

## 🧪 Tests

### Test 1: Cours gratuit (déjà fonctionnel)

```bash
# Aller sur un cours gratuit
http://localhost:3000/courses/[id]

# Cliquer "S'inscrire gratuitement"
# ✅ Devrait créer enrollment et rediriger vers /learn/[id]
```

### Test 2: Cours payant (nouveau)

```bash
# 1. Créer un cours avec price > 0 dans Supabase
UPDATE courses SET price = 49.99 WHERE id = 'course-id';

# 2. Aller sur le cours
http://localhost:3000/courses/[id]

# 3. Cliquer "Acheter maintenant"
# ✅ Devrait rediriger vers /courses/[id]/checkout

# 4. La page checkout devrait:
# - Afficher le résumé du cours
# - Appeler l'API automatiquement
# - Rediriger vers Stripe Checkout

# 5. Sur Stripe Checkout:
# - Utiliser carte de test: 4242 4242 4242 4242
# - Expiration: n'importe quelle date future
# - CVC: n'importe quel 3 chiffres

# 6. Après paiement:
# ✅ Redirection vers /checkout/success
# ✅ Webhook crée enrollment dans Supabase
# ✅ Redirection automatique vers /learn/[id]
```

### Cartes de test Stripe

```
✅ Paiement réussi:
4242 4242 4242 4242

❌ Paiement refusé:
4000 0000 0000 0002

⏳ Authentification 3D Secure:
4000 0027 6000 3184
```

## 🐛 Debugging

### Chercher les logs

Tous les fichiers ont des logs préfixés pour faciliter le debugging:

```bash
# API Checkout Session
grep "[STRIPE CHECKOUT]" logs

# API Webhook
grep "[STRIPE WEBHOOK]" logs

# Page Checkout
grep "[CHECKOUT]" logs

# Page Success
grep "[CHECKOUT SUCCESS]" logs
```

### Console navigateur

Ouvrir la console du navigateur (F12) pour voir les logs frontend.

### Stripe Dashboard

- **Paiements**: https://dashboard.stripe.com/payments
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Logs**: https://dashboard.stripe.com/logs

### Vérifier Supabase

```sql
-- Vérifier les enrollments créés
SELECT
  e.id,
  e.payment_status,
  e.payment_amount,
  e.stripe_session_id,
  c.title as course_title,
  p.email as user_email,
  e.created_at
FROM enrollments e
JOIN courses c ON c.id = e.course_id
JOIN profiles p ON p.id = e.user_id
WHERE e.payment_status = 'paid'
ORDER BY e.created_at DESC;
```

## 🔒 Sécurité

### ✅ Implémenté

1. **Vérification signature webhook**: Empêche les requêtes falsifiées
2. **Service role key**: API routes utilisent la clé Supabase service role
3. **Validation côté serveur**: Toutes les vérifications importantes côté API
4. **Métadonnées Stripe**: courseId et userId stockés dans la session
5. **Vérification enrollment existant**: Pas de doublons

### ⚠️ À faire en production

1. **HTTPS obligatoire**: Les webhooks nécessitent HTTPS
2. **Rate limiting**: Limiter les appels API
3. **Monitoring**: Logs des erreurs et alertes
4. **Backup webhook**: Endpoint de secours en cas de panne

## 📊 Base de données

### Colonnes utilisées dans `enrollments`

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  payment_status TEXT, -- 'free' | 'paid' | 'refunded'
  payment_amount DECIMAL,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT, -- 'active' | 'cancelled'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🚀 Prochaines étapes

### À implémenter plus tard

1. **Emails de confirmation** (Resend)
   - Email après achat réussi
   - Email de relance si panier abandonné

2. **Codes promo**
   - Déjà activé dans Stripe Checkout (`allow_promotion_codes: true`)
   - Créer codes dans Stripe Dashboard

3. **Remboursements**
   - API route `/api/stripe/refund`
   - Mettre à jour `payment_status` dans Supabase

4. **Abonnements** (si nécessaire)
   - Plan Premium mensuel/annuel
   - Accès à tous les cours

5. **Analytics**
   - Revenue tracking
   - Conversion rate
   - Abandoned cart tracking

## 📞 Support

### En cas de problème

1. **Vérifier les logs** (console + terminal)
2. **Vérifier Stripe Dashboard** (payments + webhooks)
3. **Vérifier Supabase** (enrollments créés ?)
4. **Tester avec carte de test**
5. **Vérifier STRIPE_WEBHOOK_SECRET** est défini

### Contacts utiles

- Stripe Support: https://support.stripe.com
- Stripe Status: https://status.stripe.com
- Docs Stripe: https://stripe.com/docs

## ✅ Checklist de déploiement

Avant de déployer en production:

- [ ] Obtenir webhook secret production
- [ ] Configurer webhook endpoint dans Stripe Dashboard
- [ ] Tester avec vraie carte (montant minimum)
- [ ] Vérifier HTTPS actif
- [ ] Configurer emails de confirmation
- [ ] Activer monitoring des erreurs
- [ ] Tester flow complet end-to-end
- [ ] Documenter procédure de remboursement
