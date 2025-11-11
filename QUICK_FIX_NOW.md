# ⚡ FIX IMMÉDIAT - 2 Minutes

## 🎯 Votre Problème

Vous cliquez sur le lien dans l'email, ça vous amène sur `/verify-email` mais **rien ne se passe**.

## ✅ Solution Rapide (2 étapes)

### Étape 1: Configuration Supabase (1 minute)

1. **Ouvrez** https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe
2. Cliquez sur **Authentication** (dans le menu gauche)
3. Cliquez sur **URL Configuration**
4. Dans **Redirect URLs**, ajoutez ces 3 lignes:
   ```
   http://localhost:3000/verify-email
   http://localhost:3000/onboarding/role
   http://localhost:3000/dashboard
   ```
5. Cliquez **Save**

### Étape 2: Testez (1 minute)

1. **Videz le cache** de votre navigateur (Cmd+Shift+R sur Mac)
2. Allez sur http://localhost:3000/verify-email
3. ✅ **Vous devriez être redirigé automatiquement vers /onboarding/role**

## 🎉 C'est Tout !

Maintenant:
- ✅ Le lien email fonctionne
- ✅ Redirection automatique vers le choix de rôle
- ✅ Puis vers le dashboard

## 🧪 Si Ça Ne Marche Toujours Pas

**Option 1**: Allez directement sur http://localhost:3000/onboarding/role
(Vous êtes déjà connecté, donc ça devrait fonctionner)

**Option 2**: Reconnectez-vous sur http://localhost:3000/login
(Votre compte est vérifié, vous pouvez vous connecter normalement)

---

**Le fix est en place, il faut juste configurer Supabase !** 🚀
