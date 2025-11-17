# Inventaire des Clés d'API & Services pour Brainow

Ce document liste **toutes** les clés d'API, services externes et secrets nécessaires pour construire la plateforme Brainow de A à Z.

---

## 📊 Tableau Récapitulatif

| Catégorie | Service | Clés Principales | Coût Estimé | Priorité |
|-----------|---------|------------------|-------------|----------|
| Backend | Supabase | URL, ANON_KEY, SERVICE_ROLE_KEY | Gratuit → 25$/mois | 🔴 Critique |
| Auth | Google OAuth | CLIENT_ID, CLIENT_SECRET | Gratuit | 🟡 Important |
| Auth | GitHub OAuth | CLIENT_ID, CLIENT_SECRET | Gratuit | 🟡 Important |
| Paiements | Stripe | PUBLISHABLE_KEY, SECRET_KEY, WEBHOOK_SECRET | 2.9% + 0.25€ | 🔴 Critique |
| Vidéo | Mux | TOKEN_ID, TOKEN_SECRET | 0.005$/min | 🔴 Critique |
| IA | Anthropic | API_KEY | ~0.015$/1K tokens | 🔴 Critique |
| Cloud | AWS | ACCESS_KEY_ID, SECRET_ACCESS_KEY | Variable | 🔴 Critique |
| Emails | Resend | API_KEY | Gratuit → 20$/mois | 🟡 Important |
| Monitoring | Sentry | DSN | Gratuit → 26$/mois | 🟡 Important |

---

## 1. Backend & Base de Données

### Supabase
**Rôle**: Base de données PostgreSQL, authentification, stockage

**Clés**:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `JWT_SECRET`

**Obtention**: [supabase.com](https://supabase.com) → Settings → API

**Tarif**: Gratuit (500 MB) → Pro $25/mois (8 GB)

---

## 2. Authentification OAuth

### Google, GitHub, LinkedIn
**Clés pour chaque service**:
- `{SERVICE}_CLIENT_ID`
- `{SERVICE}_CLIENT_SECRET`

**Gratuit** pour tous

---

## 3. Paiements - Stripe

**Clés**:
- `STRIPE_PUBLISHABLE_KEY` (frontend)
- `STRIPE_SECRET_KEY` (backend)
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CONNECT_CLIENT_ID`

**Obtention**: [stripe.com](https://stripe.com) → Developers → API keys

**Tarif**: 2.9% + 0.25€ par transaction

---

## 4. Vidéo - Mux

**Clés**:
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`
- `MUX_WEBHOOK_SECRET`

**Obtention**: [mux.com](https://mux.com) → Settings → Access Tokens

**Tarif**: $0.005/minute encodée + $0.01/GB streaming

---

## 5. IA - Anthropic (Claude)

**Clés**:
- `ANTHROPIC_API_KEY`

**Alternative**: OpenAI avec `OPENAI_API_KEY`

**Obtention**: [console.anthropic.com](https://console.anthropic.com)

**Tarif**: $0.003/1K tokens input, $0.015/1K tokens output

---

## 6. Infrastructure Cloud - AWS

**Clés**:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_EKS_CLUSTER_NAME`

**Obtention**: AWS Console → IAM → Users → Security credentials

**Tarif**: Variable selon usage (EKS ~$73/mois + instances)

---

## 7. Communication - Resend

**Clés**:
- `RESEND_API_KEY`

**Obtention**: [resend.com](https://resend.com) → API Keys

**Tarif**: Gratuit (100 emails/jour) → $20/mois (50K emails)

---

## 8. Monitoring

### Sentry
**Clés**:
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`

**Tarif**: Gratuit (5K errors/mois) → $26/mois (50K errors)

### PostHog
**Clés**:
- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

**Tarif**: Gratuit (1M events/mois) → $450/mois (10M events)

---

## 9. CI/CD - GitHub

**Clés**:
- `GH_TOKEN` (Personal Access Token)

**Obtention**: GitHub → Settings → Developer settings → Personal access tokens

**Gratuit**

---

## Coût Total Estimé (Startup)

| Service | Coût Mensuel |
|---------|--------------|
| Supabase Pro | $25 |
| Stripe | Variable (2.9% + 0.25€) |
| Mux | ~$100 (100h vidéo + streaming) |
| Anthropic | ~$150 (1000 interactions/jour) |
| AWS EKS | ~$150 (cluster + 3 nodes t3.medium) |
| Resend | $20 |
| Sentry | $26 |
| **TOTAL** | **~$471/mois** |

---

**Note**: Tous les secrets doivent être stockés dans des variables d'environnement et **jamais** commités dans Git.

**Dernière mise à jour**: 2024
