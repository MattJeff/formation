# 📧 GUIDE DE CONFIGURATION - RESEND (Emails transactionnels)

## ❌ Problème actuel

```bash
❌ [RESEND] Erreur: The skillforge.com domain is not verified.
Please, add and verify your domain on https://resend.com/domains
```

Les emails ne partent pas car `skillforge.com` n'est pas configuré dans Resend.

---

## 📋 CHECKLIST COMPLÈTE

### Prérequis
- [ ] Un nom de domaine (votre propre domaine ou acheter un nouveau)
- [ ] Accès au gestionnaire DNS de votre domaine
- [ ] Compte Resend créé

---

## ÉTAPE 1 : CHOIX DU DOMAINE

### Option A : Utiliser un domaine existant
Si vous avez déjà un domaine (ex: `votresite.com`), vous pouvez l'utiliser.

### Option B : Acheter un nouveau domaine
Registrars recommandés :
- **Namecheap** : https://www.namecheap.com (~10€/an)
- **OVH** : https://www.ovh.com (~8€/an)
- **Google Domains** : https://domains.google (~12€/an)

Exemples de noms :
- `votre-plateforme.com`
- `formations-en-ligne.fr`
- `academy.votresite.com` (sous-domaine)

---

## ÉTAPE 2 : CRÉER UN COMPTE RESEND

1. Aller sur https://resend.com/signup
2. S'inscrire (gratuit jusqu'à 3000 emails/mois)
3. Confirmer votre email
4. Activer votre compte

---

## ÉTAPE 3 : AJOUTER VOTRE DOMAINE DANS RESEND

### 3.1 Ajout du domaine

1. Se connecter à https://resend.com/domains
2. Cliquer sur **"Add Domain"**
3. Entrer votre domaine : `votredomaine.com`
4. Région : **Europe** (recommandé pour RGPD)
5. Cliquer sur **"Add"**

### 3.2 Récupérer les enregistrements DNS

Resend va vous fournir 3 types d'enregistrements DNS à configurer :

#### A) Enregistrement SPF (TXT)
```
Type:  TXT
Name:  @
Value: v=spf1 include:amazonses.com ~all
TTL:   3600
```

#### B) Enregistrements DKIM (3x CNAME)
```
Type:  CNAME
Name:  resend._domainkey.votredomaine.com
Value: xxxxxxxx.resend.com
TTL:   3600

Type:  CNAME
Name:  yyyyyyyy._domainkey.votredomaine.com
Value: yyyyyyyy.resend.com
TTL:   3600

Type:  CNAME
Name:  zzzzzzzz._domainkey.votredomaine.com
Value: zzzzzzzz.resend.com
TTL:   3600
```

#### C) Enregistrement DMARC (TXT)
```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=none;
TTL:   3600
```

**💡 Important** : Copiez ces valeurs exactement comme indiqué par Resend (elles sont uniques à votre compte).

---

## ÉTAPE 4 : CONFIGURATION DNS

Selon votre registrar, suivez les instructions ci-dessous :

### ☁️ Si vous utilisez CLOUDFLARE

1. Se connecter à https://dash.cloudflare.com
2. Sélectionner votre domaine
3. Aller dans l'onglet **"DNS"**
4. Pour chaque enregistrement :
   - Cliquer sur **"Add record"**
   - Remplir les champs (Type, Name, Value, TTL)
   - **IMPORTANT** : Désactiver le proxy (cloud orange → gris) pour les CNAME
5. Sauvegarder

### 🌐 Si vous utilisez NAMECHEAP

1. Se connecter à https://www.namecheap.com
2. Aller dans **"Domain List"** → Cliquer sur **"Manage"**
3. Onglet **"Advanced DNS"**
4. Pour chaque enregistrement :
   - Cliquer sur **"ADD NEW RECORD"**
   - Sélectionner le type (TXT ou CNAME)
   - Remplir Host et Value
5. Sauvegarder

### 🇫🇷 Si vous utilisez OVH

1. Se connecter à https://www.ovh.com/manager
2. Menu **"Noms de domaine"** → Sélectionner votre domaine
3. Onglet **"Zone DNS"**
4. Cliquer sur **"Ajouter une entrée"**
5. Pour chaque enregistrement :
   - Sélectionner le type (TXT ou CNAME)
   - Remplir le sous-domaine et la cible
6. Appliquer la configuration

### 🔧 Configuration générique (autre registrar)

1. Accéder au panneau de configuration DNS de votre domaine
2. Chercher "Gérer DNS" ou "DNS Management"
3. Ajouter les enregistrements TXT et CNAME fournis par Resend
4. Pour les CNAME : le "Name" peut nécessiter le nom complet ou juste le sous-domaine (selon le registrar)
5. Sauvegarder les modifications

---

## ÉTAPE 5 : VÉRIFICATION

### 5.1 Attendre la propagation DNS
La propagation DNS peut prendre de **5 minutes à 48 heures** selon le registrar.

Vérifier avec :
```bash
dig TXT votredomaine.com
dig CNAME resend._domainkey.votredomaine.com
```

### 5.2 Vérifier dans Resend
1. Retourner sur https://resend.com/domains
2. Cliquer sur **"Verify DNS records"**
3. Si tout est vert : ✅ **Domaine vérifié !**
4. Si certains sont rouges : attendre ou vérifier la configuration DNS

---

## ÉTAPE 6 : METTRE À JOUR LE CODE

### 6.1 Modifier l'adresse email par défaut

Editer `/apps/web/src/lib/resend.ts` ligne 33 :

**Avant :**
```typescript
export const FROM_EMAIL = 'SkillForge <noreply@skillforge.com>';
```

**Après (remplacer par VOTRE domaine) :**
```typescript
export const FROM_EMAIL = 'SkillForge <noreply@votredomaine.com>';
```

### 6.2 Créer des alias emails (optionnel mais recommandé)

Vous pouvez créer plusieurs adresses :
- `noreply@votredomaine.com` - Emails automatiques
- `support@votredomaine.com` - Support client
- `notifications@votredomaine.com` - Notifications

Dans Resend, tous les emails de `@votredomaine.com` fonctionneront automatiquement une fois le domaine vérifié.

---

## ÉTAPE 7 : TESTER L'ENVOI D'EMAIL

### Test en développement local

```bash
# 1. Lancer le serveur
npm run dev

# 2. Créer un cours gratuit et s'inscrire
# → Un email devrait être envoyé

# 3. Vérifier les logs
# Chercher : ✅ [RESEND] Email bienvenue envoyé
```

### Vérifier dans Resend Dashboard

1. Aller sur https://resend.com/emails
2. Vous devriez voir les emails envoyés
3. Statut : **Delivered** ✅

---

## ÉTAPE 8 : CONFIGURATION PRODUCTION (Vercel)

### Variables d'environnement

Vérifier que ces variables sont définies sur Vercel :

```bash
RESEND_API_KEY=re_votreclé_xxxxx
```

La clé API Resend se trouve sur https://resend.com/api-keys

---

## 🔍 DIAGNOSTIC

### Email non reçu

**Vérifier 1** : Logs du serveur
```bash
# Chercher dans les logs :
✅ [RESEND] Email envoyé: xxxxx
# ou
❌ [RESEND] Erreur envoi email
```

**Vérifier 2** : Dashboard Resend
- https://resend.com/emails
- Statut de l'email : Sent, Delivered, Bounced, Failed

**Vérifier 3** : Dossier Spam
Les emails transactionnels peuvent parfois arriver dans les spams.

### Erreur "Domain not verified"

**Solution** : Le domaine n'est pas encore vérifié.
1. Vérifier les enregistrements DNS
2. Attendre la propagation (jusqu'à 24h)
3. Cliquer sur "Verify DNS records" dans Resend

### Erreur "SPF check failed"

**Solution** : L'enregistrement SPF (TXT) n'est pas correct.
1. Vérifier avec `dig TXT votredomaine.com`
2. Doit contenir : `v=spf1 include:amazonses.com ~all`
3. Reconfigurer si nécessaire

---

## 💰 TARIFS RESEND

| Plan | Emails/mois | Prix |
|------|-------------|------|
| **Free** | 3 000 | 0€ |
| **Pro** | 50 000 | 20€/mois |
| **Business** | 100 000+ | Sur devis |

**Conseil** : Commencer avec le plan gratuit (largement suffisant pour démarrer).

---

## 📊 BONNES PRATIQUES

### 1. Taux de délivrabilité
- Ne pas envoyer trop d'emails d'un coup
- Vérifier que les destinataires veulent recevoir vos emails
- Nettoyer votre liste d'emails régulièrement

### 2. Contenu des emails
- Toujours inclure un lien de désinscription
- Utiliser un vrai nom d'expéditeur (pas "no-reply")
- Personnaliser avec le nom du destinataire

### 3. Monitoring
- Surveiller le taux de bounce (emails rejetés)
- Suivre le taux d'ouverture
- Répondre rapidement aux questions

---

## 🆘 DÉPANNAGE

### Problème : DNS propagation lente

**Solution** : Utiliser un outil de vérification
```bash
# Vérifier la propagation mondiale
https://dnschecker.org/

# Vérifier SPF
https://mxtoolbox.com/spf.aspx

# Vérifier DKIM
https://mxtoolbox.com/dkim.aspx
```

### Problème : Emails marqués comme spam

**Solutions** :
1. Configurer le DMARC policy en "quarantine" ou "reject" (au lieu de "none")
2. Ajouter un enregistrement MX (optionnel)
3. Warmer le domaine (envoyer progressivement plus d'emails)

---

## ✅ VALIDATION FINALE

Avant de passer en production :

- [ ] Domaine configuré et vérifié dans Resend
- [ ] Enregistrements DNS (SPF, DKIM, DMARC) valides
- [ ] Variable RESEND_API_KEY configurée sur Vercel
- [ ] Email `FROM_EMAIL` mis à jour avec votre domaine
- [ ] Test d'envoi réussi en développement
- [ ] Email reçu et pas dans les spams
- [ ] Dashboard Resend affiche "Delivered"

---

## 📞 RESSOURCES

- **Documentation Resend** : https://resend.com/docs
- **Vérification DNS** : https://dnschecker.org
- **Vérification Email** : https://mxtoolbox.com
- **Support Resend** : support@resend.com

---

**Date de création** : 2025-11-16
**Statut** : Guide complet pour configuration Resend
