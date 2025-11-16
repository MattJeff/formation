# 🚀 GUIDE DE MISE EN PRODUCTION - STRIPE

## Statut actuel
- ✅ Mode TEST fonctionnel
- ✅ Stripe Connect configuré
- ✅ Commission 4% opérationnelle
- ⏳ Passage en mode LIVE à faire

---

## 📋 CHECKLIST AVANT PRODUCTION

### 1. Stripe Dashboard - Vérifications
- [ ] Aller sur https://dashboard.stripe.com/settings/account
- [ ] Vérifier que votre entreprise est bien enregistrée
- [ ] Compléter les informations légales
- [ ] Activer votre compte Stripe (sortir du mode "Restricted")

### 2. Stripe Connect - Configuration plateforme
- [ ] Aller sur https://dashboard.stripe.com/settings/connect
- [ ] Activer Stripe Connect en mode LIVE
- [ ] Configurer le profil de plateforme :
  - [ ] Nom de la plateforme
  - [ ] Logo
  - [ ] URL du site
  - [ ] Support email
  - [ ] Responsabilité des pertes : "La plateforme gère les pertes"
- [ ] Accepter les conditions Stripe Connect

### 3. Webhooks - Configuration LIVE
- [ ] Aller sur https://dashboard.stripe.com/webhooks
- [ ] Basculer en mode "LIVE" (toggle en haut à droite)
- [ ] Créer un nouveau endpoint webhook :
  - URL : `https://VOTRE_DOMAINE.com/api/stripe/webhook`
  - Événements à sélectionner :
    - [x] `checkout.session.completed`
    - [x] `checkout.session.expired`
    - [x] `payment_intent.succeeded`
    - [x] `payment_intent.payment_failed`
    - [x] `account.updated`
    - [x] `account.application.deauthorized`
    - [x] `account.application.authorized`
- [ ] Copier le **signing secret** (commence par `whsec_...`)

---

## 🔑 RÉCUPÉRATION DES CLÉS LIVE

### Clés API
1. Aller sur https://dashboard.stripe.com/apikeys
2. Basculer en mode "LIVE" (toggle en haut à droite)
3. Copier :
   - **Publishable key** (commence par `pk_live_...`)
   - **Secret key** (commence par `sk_live_...`) - Révéler la clé

### Webhook secret
Après avoir créé le webhook LIVE, copier le **Signing secret**

---

## ⚙️ CONFIGURATION DES VARIABLES D'ENVIRONNEMENT

### Fichier `.env.local` (développement)
Garder les clés TEST pour le développement local :
```bash
# MODE TEST (développement local)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (TEST)

# MODE LIVE (ne pas utiliser en local)
STRIPE_LIVE_PUBLISHABLE_KEY=pk_live_...
STRIPE_LIVE_SECRET_KEY=sk_live_...
STRIPE_LIVE_WEBHOOK_SECRET=whsec_... (LIVE)
```

### Variables d'environnement VERCEL (production)
1. Aller sur votre projet Vercel
2. Settings → Environment Variables
3. Ajouter ces variables pour **Production** uniquement :

```bash
STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLISHABLE
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_LIVE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLISHABLE
```

**IMPORTANT:** Ne JAMAIS commiter ces clés LIVE dans Git !

---

## 🧪 TESTS EN PRODUCTION

### 1. Test de paiement avec montant minimum
```bash
# Utiliser une vraie carte avec un montant minimum (0.50€)
# Carte de test : 4242 4242 4242 4242 (ne marchera PAS en LIVE)
# Utilisez une vraie carte bancaire pour tester
```

### 2. Vérifications après test
- [ ] Le paiement est visible dans Stripe Dashboard (LIVE)
- [ ] L'enrollment est créé dans Supabase
- [ ] L'email de confirmation est envoyé
- [ ] La commission de 4% est calculée correctement
- [ ] Le créateur voit l'inscription dans son dashboard

### 3. Test de remboursement
- [ ] Créer un remboursement depuis Stripe Dashboard
- [ ] Vérifier que l'enrollment passe en statut "refunded"

---

## 🚨 SÉCURITÉ

### Webhook en production
```typescript
// apps/web/src/app/api/stripe/webhook/route.ts
// Vérifier que la signature est toujours validée :

const signature = request.headers.get('stripe-signature');
if (!signature) {
  return NextResponse.json({ error: 'No signature' }, { status: 400 });
}

const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET! // ← Clé LIVE en production
);
```

### HTTPS obligatoire
- ✅ Vercel fournit automatiquement HTTPS
- ✅ Les webhooks Stripe LIVE exigent HTTPS

### Rate limiting
TODO: Ajouter rate limiting sur les routes sensibles :
- `/api/stripe/create-checkout-session`
- `/api/stripe/webhook`

---

## 📊 MONITORING

### Stripe Dashboard
1. Surveiller les paiements : https://dashboard.stripe.com/payments
2. Surveiller les webhooks : https://dashboard.stripe.com/webhooks
3. Logs d'événements : https://dashboard.stripe.com/logs

### Logs Vercel
1. Surveiller les logs de l'API : https://vercel.com/logs
2. Filtrer par `/api/stripe/webhook`

---

## ⚖️ OBLIGATIONS LÉGALES

### CGV (Conditions Générales de Vente)
- [ ] Mentionner les frais de service (4%)
- [ ] Politique de remboursement
- [ ] Délai de rétractation (14 jours en UE)

### Mentions légales
- [ ] Coordonnées de l'entreprise
- [ ] Numéro SIRET
- [ ] TVA intracommunautaire

### RGPD
- [ ] Politique de confidentialité
- [ ] Traitement des données de paiement (Stripe)
- [ ] Droit de suppression des données

---

## 🔄 PROCESSUS DE DÉPLOIEMENT

### Étape 1 : Préparation
```bash
# 1. Vérifier que tout fonctionne en TEST
npm run dev

# 2. Tester un paiement complet en TEST
# → Créer un cours
# → S'inscrire avec carte test
# → Vérifier l'enrollment

# 3. Vérifier les logs webhook
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Étape 2 : Configuration Vercel
```bash
# 1. Ajouter les variables d'environnement LIVE sur Vercel

# 2. Redéployer l'application
git push origin main

# 3. Vérifier le déploiement
vercel --prod
```

### Étape 3 : Configuration Stripe Dashboard
```bash
# 1. Activer Stripe Connect en LIVE
# 2. Configurer le webhook avec l'URL de production
# 3. Récupérer le signing secret
# 4. Mettre à jour STRIPE_WEBHOOK_SECRET sur Vercel
```

### Étape 4 : Test en production
```bash
# 1. Créer un cours test à 0.50€
# 2. Acheter avec une vraie carte
# 3. Vérifier l'enrollment
# 4. Rembourser le test
```

---

## ✅ VALIDATION FINALE

Avant de lancer en production, vérifier :

- [ ] Tous les webhooks sont configurés en LIVE
- [ ] Les variables d'environnement sont configurées sur Vercel
- [ ] Un test de paiement réel a réussi
- [ ] Les emails de confirmation fonctionnent
- [ ] La commission 4% est correctement calculée
- [ ] Le créateur peut compléter l'onboarding Stripe Connect en LIVE
- [ ] Les CGV mentionnent les frais de 4%
- [ ] Le site est accessible en HTTPS
- [ ] Les logs sont surveillés

---

## 🆘 DÉPANNAGE

### Erreur "Webhook signature verification failed"
→ Vérifier que `STRIPE_WEBHOOK_SECRET` correspond au webhook LIVE

### Erreur "No such customer"
→ Les clients créés en TEST n'existent pas en LIVE, normal

### Paiement refusé
→ En LIVE, les vraies cartes peuvent être refusées (fonds insuffisants, etc.)

### Email non reçu
→ Vérifier Resend dashboard et la configuration du domaine

---

## 📞 SUPPORT

- **Stripe Support** : https://support.stripe.com/
- **Documentation Stripe Connect** : https://stripe.com/docs/connect
- **Webhooks Guide** : https://stripe.com/docs/webhooks

---

**Date de création** : 2025-11-16
**Dernière mise à jour** : 2025-11-16
