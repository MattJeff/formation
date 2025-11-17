# ✅ Flow de Vérification Email + Choix de Rôle

## 🎯 Nouveau Parcours Utilisateur

### 1. Inscription (`/signup`)
- L'utilisateur remplit le formulaire
- Clique sur "Créer mon compte"
- ✅ Compte créé dans Supabase
- ✅ Email de vérification envoyé

### 2. Vérification Email
- L'utilisateur reçoit un email avec un lien
- Clique sur le lien dans l'email
- ✅ Redirection vers `/auth/confirm` (route handler)

### 3. Confirmation (`/auth/confirm`)
- La route vérifie le token automatiquement
- ✅ Email vérifié avec succès
- ✅ Redirection vers `/onboarding/role`

### 4. Choix du Rôle (`/onboarding/role`)
- **Page magnifique avec 2 options** :
  
  **Option 1 : Je veux apprendre** 🎓
  - Accès aux cours
  - Projets Sandbox
  - Portfolio
  - Certificats
  - → Redirige vers `/dashboard`
  
  **Option 2 : Je veux enseigner** 👨‍🏫
  - Créer des cours
  - Projets Sandbox interactifs
  - Analytics
  - Revenus Stripe
  - → Redirige vers `/creator/dashboard`

### 5. Dashboard
- L'utilisateur arrive sur son dashboard
- Le rôle est enregistré dans son profil
- ✅ Onboarding terminé !

---

## 📁 Fichiers Créés

### 1. `/app/auth/confirm/route.ts`
**Rôle** : Route handler pour la vérification email
- Vérifie le token Supabase
- Redirige vers `/onboarding/role` si succès
- Redirige vers `/verify-email?error=...` si échec

### 2. `/app/onboarding/role/page.tsx`
**Rôle** : Page de choix de rôle
- Design magnifique avec 2 cartes
- Icônes et descriptions claires
- Animation de chargement
- Enregistre le rôle via API
- Redirige vers le bon dashboard

### 3. `/app/api/user/set-role/route.ts`
**Rôle** : API pour enregistrer le rôle
- Récupère l'utilisateur connecté
- Met à jour les métadonnées Supabase
- Prêt pour intégration Prisma

### 4. `/app/verify-email/page.tsx` (mis à jour)
**Rôle** : Page d'attente après inscription
- Affiche un message d'attente
- Gère les erreurs de vérification
- Bouton "Renvoyer l'email"

---

## 🎨 Design de la Page de Choix

```
┌─────────────────────────────────────────────┐
│         ✅ Email vérifié avec succès !      │
│   Bienvenue sur Brainow. Choisissez :   │
└─────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│   🎓 Je veux         │  │   👨‍🏫 Je veux        │
│   apprendre          │  │   enseigner          │
│                      │  │                      │
│ ✓ Accès aux cours    │  │ ✓ Créer des cours    │
│ ✓ Projets Sandbox    │  │ ✓ Projets Sandbox    │
│ ✓ Portfolio          │  │ ✓ Analytics          │
│ ✓ Certificats        │  │ ✓ Revenus Stripe     │
│                      │  │                      │
│   [Sélectionner]     │  │   [Sélectionner]     │
└──────────────────────┘  └──────────────────────┘

  Vous pourrez changer de rôle à tout moment
```

---

## 🔄 Flow Technique

```
Inscription
    ↓
Email envoyé avec lien vers:
https://dwwkjhorxfjxhzozacxe.supabase.co/auth/v1/verify?token=...&redirect_to=http://localhost:3000/auth/confirm
    ↓
Supabase vérifie le token
    ↓
Redirection vers: http://localhost:3000/auth/confirm?token_hash=...&type=signup
    ↓
Route /auth/confirm vérifie le token
    ↓
Redirection vers: http://localhost:3000/onboarding/role
    ↓
Utilisateur choisit son rôle
    ↓
API /api/user/set-role enregistre le choix
    ↓
Redirection vers:
  - /dashboard (si learner)
  - /creator/dashboard (si creator)
```

---

## ⚙️ Configuration Supabase Requise

### 1. URL de Redirection
Dans le Dashboard Supabase :
1. **Authentication** → **URL Configuration**
2. Ajoutez dans **Redirect URLs** :
   ```
   http://localhost:3000/auth/confirm
   http://localhost:3000/onboarding/role
   ```

### 2. Template Email
1. **Authentication** → **Email Templates**
2. **Confirm signup** template
3. Vérifiez que le lien contient : `{{ .ConfirmationURL }}`

---

## 🧪 Test du Flow Complet

### Étape 1 : Inscription
```bash
1. Allez sur http://localhost:3000/signup
2. Remplissez le formulaire avec un VRAI email
3. Cliquez "Créer mon compte"
4. ✅ Vous êtes redirigé vers /verify-email
```

### Étape 2 : Vérification
```bash
1. Ouvrez votre boîte email
2. Trouvez l'email de Brainow
3. Cliquez sur "Confirmer votre email"
4. ✅ Vous êtes redirigé vers /onboarding/role
```

### Étape 3 : Choix du Rôle
```bash
1. Vous voyez 2 options magnifiques
2. Cliquez sur "Je veux apprendre" ou "Je veux enseigner"
3. ✅ Animation de chargement
4. ✅ Redirection vers le dashboard approprié
```

### Étape 4 : Dashboard
```bash
1. Vous arrivez sur votre dashboard
2. ✅ Vous êtes connecté
3. ✅ Votre rôle est enregistré
4. ✅ Onboarding terminé !
```

---

## 🎯 Avantages de ce Flow

### UX Améliorée
- ✅ Parcours clair et guidé
- ✅ Choix explicite du rôle
- ✅ Design professionnel
- ✅ Messages clairs à chaque étape

### Technique
- ✅ Rôle enregistré dès le début
- ✅ Pas de confusion utilisateur
- ✅ Facile à étendre (ajout de rôles)
- ✅ Gestion d'erreurs complète

### Business
- ✅ Segmentation claire des utilisateurs
- ✅ Onboarding personnalisé
- ✅ Analytics par rôle
- ✅ Expérience adaptée

---

## 🔧 Personnalisation Possible

### Ajouter un 3ème Rôle
```typescript
// Dans /onboarding/role/page.tsx
<button onClick={() => handleRoleSelection('enterprise')}>
  <Building className="h-8 w-8" />
  <h3>Entreprise</h3>
  <p>Formez vos équipes</p>
</button>
```

### Ajouter des Questions
```typescript
// Créer /onboarding/profile/page.tsx
- Quel est votre niveau ?
- Quels sont vos objectifs ?
- Dans quel domaine ?
```

### Personnaliser le Dashboard
```typescript
// Selon le rôle, afficher différents contenus
if (user.role === 'learner') {
  // Cours recommandés
} else if (user.role === 'creator') {
  // Créer votre premier cours
}
```

---

## 📊 Données Enregistrées

### Dans Supabase Auth (user.user_metadata)
```json
{
  "full_name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "role": "learner" | "creator",
  "onboarding_completed": true
}
```

### À Ajouter dans Prisma (table users)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      UserRole @default(LEARNER)
  onboardingCompleted Boolean @default(false)
  // ...
}

enum UserRole {
  LEARNER
  CREATOR
  ADMIN
}
```

---

## 🚀 Prochaines Étapes

### Court Terme
1. ✅ Tester le flow complet
2. ✅ Vérifier les redirections
3. ✅ Tester avec un vrai email
4. ✅ Vérifier les messages d'erreur

### Moyen Terme
1. Créer la table users dans Prisma
2. Synchroniser Supabase Auth avec Prisma
3. Ajouter des questions d'onboarding
4. Personnaliser les dashboards

### Long Terme
1. Analytics par rôle
2. Onboarding multi-étapes
3. Recommandations personnalisées
4. A/B testing du flow

---

## 🎉 Résultat Final

Après ce flow, l'utilisateur :
- ✅ A un compte vérifié
- ✅ A choisi son rôle
- ✅ Est sur le bon dashboard
- ✅ Peut commencer à utiliser la plateforme
- ✅ A une expérience personnalisée

**Le flow est maintenant complet et professionnel !** 🚀
