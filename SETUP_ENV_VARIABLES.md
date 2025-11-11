# 🔧 Configuration des Variables d'Environnement

## ⚠️ ACTION REQUISE IMMÉDIATEMENT

L'authentification ne fonctionnera pas tant que vous n'aurez pas configuré les variables d'environnement.

## 📝 Étapes à Suivre

### 1. Récupérer les Clés Supabase

1. Allez sur https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe
2. Cliquez sur **Settings** (icône engrenage)
3. Allez dans **API**
4. Copiez:
   - **Project URL** (commence par https://)
   - **anon public** key (commence par eyJ...)

### 2. Créer le Fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec ce contenu:

```env
# ============================================
# SUPABASE (REQUIS POUR L'AUTHENTIFICATION)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://dwwkjhorxfjxhzozacxe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_ANON_KEY_ICI

# ============================================
# STRIPE (REQUIS POUR LES PAIEMENTS)
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QKxfNRoZfXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_live_51QKxfNRoZfXXXXXXXXXXXX

# ============================================
# MUX (POUR LES VIDÉOS)
# ============================================
MUX_TOKEN_ID=votre_mux_token_id
MUX_TOKEN_SECRET=votre_mux_token_secret

# ============================================
# RESEND (POUR LES EMAILS)
# ============================================
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# ANTHROPIC (POUR L'IA)
# ============================================
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# BASE DE DONNÉES
# ============================================
DATABASE_URL=postgresql://postgres:MoiMathis235%21@db.dwwkjhorxfjxhzozacxe.supabase.co:5432/postgres
```

### 3. Remplacer les Valeurs

Remplacez `VOTRE_ANON_KEY_ICI` par la vraie clé que vous avez copiée depuis Supabase.

### 4. Redémarrer le Serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer:
npm run dev
```

## ✅ Vérification

Une fois configuré, testez:

1. Allez sur http://localhost:3000/signup
2. Vous ne devriez plus voir l'erreur "supabaseUrl is required"
3. Essayez de créer un compte
4. Vérifiez que vous recevez un email de confirmation

## 🔍 Où Trouver les Clés

### Supabase
- Dashboard: https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe
- Settings → API → Project URL et anon key

### Stripe
- Dashboard: https://dashboard.stripe.com/test/apikeys
- Developers → API keys

### Mux
- Dashboard: https://dashboard.mux.com/
- Settings → Access Tokens

### Resend
- Dashboard: https://resend.com/api-keys
- API Keys

### Anthropic
- Console: https://console.anthropic.com/
- API Keys

## 🚨 Erreurs Courantes

### "supabaseUrl is required"
→ Le fichier `.env.local` n'existe pas ou n'est pas à la racine
→ Vérifiez que le fichier est bien nommé `.env.local` (avec le point au début)

### "Invalid API key"
→ La clé Supabase est incorrecte
→ Vérifiez que vous avez copié la clé **anon public** et pas la **service_role**

### Les changements ne sont pas pris en compte
→ Redémarrez le serveur de développement
→ Videz le cache du navigateur

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez que toutes les clés sont correctes
2. Vérifiez qu'il n'y a pas d'espaces avant/après les clés
3. Redémarrez le serveur
4. Consultez les logs dans le terminal

---

**IMPORTANT**: Ne commitez JAMAIS le fichier `.env.local` sur Git !
Il est déjà dans `.gitignore` pour votre sécurité.
