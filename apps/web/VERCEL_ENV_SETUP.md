# Configuration des Variables d'Environnement Vercel

## 🚀 Pour que les emails de vérification fonctionnent en production

### 1. Ajouter NEXT_PUBLIC_APP_URL dans Vercel

1. Allez sur **Vercel Dashboard**
2. Sélectionnez votre projet **formation-web**
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez une nouvelle variable:
   - **Name**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://votredomaine.vercel.app` (remplacez par votre URL Vercel)
   - **Environment**: Cochez **Production**, **Preview**, et **Development**
5. Cliquez sur **Save**

### 2. Redéployer l'application

Après avoir ajouté la variable:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

Ou depuis Vercel Dashboard: **Deployments** > **Redeploy**

### 3. Vérifier dans Supabase

Assurez-vous que dans **Supabase Dashboard** > **Authentication** > **URL Configuration**:
- **Site URL**: `https://votredomaine.vercel.app`
- **Redirect URLs**: 
  - `https://votredomaine.vercel.app/verify-email`
  - `https://votredomaine.vercel.app/auth/callback`
  - `http://localhost:3000/**` (pour le développement local)

## ✅ Test

1. Créez un nouveau compte sur votre site en production
2. Vérifiez l'email reçu
3. Le lien de vérification devrait pointer vers `https://votredomaine.vercel.app/verify-email` et non `localhost`

## 📋 Toutes les variables d'environnement nécessaires

Voir `.env.example` pour la liste complète.

Variables critiques pour Vercel:
- `NEXT_PUBLIC_APP_URL` ← **IMPORTANT pour les redirections email**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
