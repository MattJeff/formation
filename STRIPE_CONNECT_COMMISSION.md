# 💰 Système de Commission - Stripe Connect

## 📋 Vue d'ensemble

Vous prenez **4% de commission** sur chaque vente de formation. Le créateur reçoit **96%** du prix.

**Exemple :**
- Formation vendue à 100€
- Vous recevez : 4€ (frais de plateforme)
- Créateur reçoit : 96€

## 🏗️ Architecture Stripe Connect

Pour gérer les paiements avec commission, il faut utiliser **Stripe Connect** qui permet de :
- Créer des comptes Stripe pour les créateurs
- Reverser automatiquement leur part
- Garder votre commission

### 2 approches possibles

#### A. **Destination Charges** (Recommandé pour vous)
```
Flow :
1. User paie 100€ → Votre compte Stripe
2. Stripe prend automatiquement votre commission (4€)
3. Stripe reverse 96€ au créateur
```

**Avantages :**
- ✅ Simple à implémenter
- ✅ Vous gérez les remboursements
- ✅ Commission automatique
- ✅ Moins de responsabilités légales

**Inconvénients :**
- ❌ Créateur doit avoir un compte Stripe Connect

#### B. **Direct Charges** (Alternative)
```
Flow :
1. User paie 100€ → Compte Stripe du créateur
2. Le créateur vous reverse 4€ (application fee)
```

**Avantages :**
- ✅ Créateur garde le contrôle

**Inconvénients :**
- ❌ Plus complexe
- ❌ Créateur gère les remboursements
- ❌ Plus de responsabilités pour le créateur

## 🎯 Solution recommandée : Destination Charges

### Étape 1 : Activer Stripe Connect

1. **Dashboard Stripe** : https://dashboard.stripe.com/connect/accounts/overview
2. **Cliquer "Get started"**
3. **Choisir "Standard" ou "Express"**
   - **Express** (recommandé) : Stripe gère l'onboarding
   - **Standard** : Le créateur gère tout

### Étape 2 : Onboarding des créateurs

Les créateurs doivent connecter leur compte Stripe :

1. **Créateur clique "Connecter Stripe"** sur votre plateforme
2. **Redirection vers Stripe** pour créer/connecter compte
3. **Stripe renvoie sur votre app** avec `stripe_account_id`
4. **Vous stockez** `stripe_account_id` dans la table `profiles`

### Étape 3 : Modification de la BDD

Ajouter une colonne à la table `profiles` :

```sql
ALTER TABLE profiles
ADD COLUMN stripe_account_id TEXT,
ADD COLUMN stripe_account_status TEXT DEFAULT 'not_connected', -- not_connected | pending | connected
ADD COLUMN stripe_onboarding_completed BOOLEAN DEFAULT FALSE;
```

### Étape 4 : Créer le lien d'onboarding

```typescript
// API route: /api/stripe/connect/onboarding
const account = await stripe.accounts.create({
  type: 'express',
  country: 'FR',
  email: creator.email,
  capabilities: {
    transfers: { requested: true },
  },
});

const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings/stripe`,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings/stripe/success`,
  type: 'account_onboarding',
});

// Stocker account.id dans profiles
await supabase
  .from('profiles')
  .update({ stripe_account_id: account.id })
  .eq('id', creatorId);

// Rediriger vers accountLink.url
```

### Étape 5 : Modifier le paiement pour inclure la destination

```typescript
// Dans create-checkout-session/route.ts

const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [...],

  // 🆕 Ajouter la destination (compte du créateur)
  payment_intent_data: {
    application_fee_amount: Math.round(course.price * 0.04 * 100), // 4% en centimes
    transfer_data: {
      destination: course.creator.stripe_account_id, // ID compte Stripe du créateur
    },
  },

  metadata: {...},
});
```

## 📊 Exemple de flow complet

```
1. Créateur s'inscrit sur la plateforme
2. Créateur clique "Connecter Stripe" dans ses paramètres
3. Onboarding Stripe (2 minutes)
4. stripe_account_id stocké dans BDD
5. Créateur crée une formation à 50€
6. User achète la formation
   → 50€ arrivent sur VOTRE compte Stripe
   → Stripe prélève 4% = 2€ (votre commission)
   → Stripe transfère automatiquement 48€ au créateur
7. Créateur voit 48€ sur son compte Stripe
8. Créateur peut retirer vers sa banque
```

## 💳 Informations bancaires du créateur

**Le créateur N'A PAS besoin de vous donner son RIB directement.**

Stripe Connect gère tout :
- Le créateur entre son RIB dans l'interface Stripe (sécurisé)
- Vous ne voyez jamais le RIB (conformité RGPD)
- Stripe transfère automatiquement sur le compte du créateur

## 🛠️ Ce qu'il faut implémenter

### Phase 1 : Configuration Stripe Connect (Backend)
1. ✅ Activer Stripe Connect dans Dashboard
2. ✅ Ajouter colonnes BDD (stripe_account_id, etc.)
3. ✅ API route pour créer lien d'onboarding
4. ✅ API route pour vérifier statut du compte
5. ✅ Modifier create-checkout-session avec destination

### Phase 2 : Interface Créateur (Frontend)
1. ✅ Page paramètres avec bouton "Connecter Stripe"
2. ✅ Indicateur de statut (Non connecté / En attente / Connecté)
3. ✅ Affichage des revenus
4. ✅ Lien vers tableau de bord Stripe Express

### Phase 3 : Webhooks Stripe Connect
1. ✅ Gérer `account.updated` (statut du compte)
2. ✅ Gérer `transfer.created` (transfert effectué)
3. ✅ Gérer `payout.paid` (retrait vers banque)

## 📝 Variables d'environnement supplémentaires

```bash
# Stripe Connect
STRIPE_CONNECT_CLIENT_ID=ca_xxx  # Récupéré dans Dashboard > Connect > Settings
```

## 🧪 Test en mode TEST

En mode TEST, vous pouvez tester le flow complet :
- Créer un compte Connect test
- Faire un paiement test
- Voir le transfert dans Dashboard

## 🚀 Déploiement en production

1. Activer Stripe Connect en LIVE
2. Vérifier les paramètres de paiement
3. Tester avec un vrai créateur
4. Monitorer les transferts

## 📞 Prochaines étapes

Voulez-vous que j'implémente :
1. ✅ **Les routes API Stripe Connect** (onboarding, vérification, etc.) ?
2. ✅ **L'interface créateur** pour connecter Stripe ?
3. ✅ **La modification du paiement** avec commission ?
4. ✅ **Les webhooks Stripe Connect** ?

Ou préférez-vous garder ça pour plus tard et rester simple pour le MVP (sans commission pour l'instant) ?

## 💡 Alternative simple pour le MVP

Si vous voulez lancer rapidement le MVP sans Stripe Connect :
- Tous les paiements arrivent sur VOTRE compte
- Vous reversez manuellement aux créateurs (1 fois par mois)
- Vous calculez les commissions dans un tableau Excel/Google Sheets

C'est moins automatique mais beaucoup plus simple à mettre en place initialement. Une fois le MVP validé, vous pouvez implémenter Stripe Connect.

**Recommandation : Commencez simple, ajoutez Stripe Connect quand vous avez plusieurs créateurs actifs.**
