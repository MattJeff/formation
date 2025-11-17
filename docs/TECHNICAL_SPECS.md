# Brainow - Spécifications Techniques Complètes

## Table des Matières

1. [Vision & Philosophie](#vision--philosophie)
2. [Architecture Globale](#architecture-globale)
3. [Stack Technique](#stack-technique)
4. [Module Sandbox - Le Cœur de l'Innovation](#module-sandbox)
5. [Base de Données](#base-de-données)
6. [Services Externes & APIs](#services-externes--apis)
7. [Sécurité](#sécurité)
8. [Déploiement](#déploiement)

---

## Vision & Philosophie

Brainow n'est pas une plateforme de formation traditionnelle. Notre mission est de **combler le fossé entre la connaissance théorique et la compétence professionnelle**.

### Les 4 Piliers Fondamentaux

1. **Portfolio-First**: L'objectif n'est pas de finir des cours, mais de construire des projets concrets
2. **IA comme Coach**: L'IA est un tuteur personnel qui aide à apprendre, pas un vendeur
3. **Communauté Intégrée**: L'apprentissage est une expérience sociale et collaborative
4. **Partenariat Créateurs**: Nous fournissons les outils pour créer des expériences pédagogiques d'exception

---

## Architecture Globale

### Structure du Monorepo

```
brainow/
├── apps/
│   ├── web/              # Frontend Next.js (Vercel)
│   ├── api/              # Backend NestJS (AWS/GCP)
│   ├── sandbox/          # Service Sandbox IDE (Kubernetes)
│   └── verification/     # Service de vérification (Docker)
├── packages/
│   ├── ui/               # Composants UI partagés (Shadcn/ui)
│   ├── database/         # Schéma Prisma & migrations
│   ├── config/           # Configurations partagées
│   └── types/            # Types TypeScript partagés
└── docs/                 # Documentation
```

### Flux de Données Principal

```
User Browser (Next.js)
    ↓
GraphQL API (NestJS)
    ↓
PostgreSQL (Supabase)
    ↓
Sandbox Service (K8s) ←→ Verification Service (Docker)
    ↓
AI Service (Anthropic/OpenAI)
```

---

## Stack Technique

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **IDE Intégré**: Monaco Editor (@monaco-editor/react)
- **Terminal**: Xterm.js
- **Communication**: Socket.io-client (WebSockets)
- **Markdown**: React-Markdown

### Backend

- **Framework**: NestJS (Node.js + TypeScript)
- **API**: GraphQL avec Apollo Server
- **ORM**: Prisma
- **Base de Données**: PostgreSQL 14+
- **Cache**: Redis
- **Queue**: Bull (pour les jobs asynchrones)
- **Validation**: Class-validator

### Infrastructure

- **Conteneurisation**: Docker
- **Orchestration**: Kubernetes (AWS EKS / GCP GKE)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + PostHog
- **Logs**: Winston + CloudWatch

### Services Externes

| Service | Usage | Clés Requises |
|---------|-------|---------------|
| Supabase | DB, Auth, Storage | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| Stripe | Paiements | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Mux | Vidéo streaming | `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET` |
| Anthropic | IA Client Virtuel | `ANTHROPIC_API_KEY` |
| Resend | Emails | `RESEND_API_KEY` |
| AWS | Infrastructure K8s | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |

---

## Module Sandbox - Le Cœur de l'Innovation

### Concept

Le **Sandbox** est un environnement de développement complet dans le navigateur où les apprenants travaillent sur des projets réels avec un **Client IA** qui simule une vraie relation professionnelle.

### Architecture du Sandbox

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACE UTILISATEUR                     │
├──────────────┬──────────────────────┬───────────────────────┤
│  Panneau     │   Panneau Central    │   Panneau Droit       │
│  Gauche      │                      │                       │
│              │   ┌──────────────┐   │   ┌───────────────┐   │
│  ┌────────┐  │   │  Éditeur de  │   │   │ Client IA     │   │
│  │Fichiers│  │   │  Code        │   │   │ (Chloé)       │   │
│  │        │  │   │  (Monaco)    │   │   │               │   │
│  │  src/  │  │   └──────────────┘   │   │ Brief         │   │
│  │  ├─html│  │                      │   │ Objectifs ☐   │   │
│  │  ├─css │  │   ┌──────────────┐   │   │ Chat          │   │
│  │  └─js  │  │   │  Aperçu      │   │   │               │   │
│  │        │  │   │  Live        │   │   │ [Soumettre]   │   │
│  └────────┘  │   └──────────────┘   │   └───────────────┘   │
│              │                      │                       │
│  Terminal    │   Terminal/Console   │                       │
└──────────────┴──────────────────────┴───────────────────────┘
```

### Composants Clés

#### 1. Service Workspace (IDE Cloud)

**Technologie**: Kubernetes + Docker

**Lifecycle**:
1. **Provisioning**: Déploiement d'un Pod K8s avec une image préconfigurée
2. **Accès**: Exposition d'un port sécurisé via Ingress
3. **Persistance**: Volume persistant pour le code utilisateur
4. **Auto-Shutdown**: Mise en veille après 30 min d'inactivité

**Image Docker de base**:
```dockerfile
FROM node:18-bullseye
RUN apt-get update && apt-get install -y git vim
RUN npm install -g code-server
WORKDIR /workspace
EXPOSE 8080
CMD ["code-server", "--bind-addr", "0.0.0.0:8080"]
```

#### 2. Service de Vérification ("The Judge")

**Rôle**: Exécuter les tests automatisés sur le code de l'apprenant

**Processus**:
1. Recevoir une requête de soumission
2. Créer un conteneur Docker éphémère
3. Cloner le code de l'utilisateur
4. Exécuter les tests Playwright
5. Générer un rapport JSON
6. Détruire le conteneur

**Exemple de rapport**:
```json
{
  "projectId": "proj_123",
  "submissionId": "sub_789",
  "results": [
    { "testId": "grid-structure", "status": "pass" },
    { "testId": "image-click-event", "status": "fail", 
      "details": "Element .grid-image not clickable" }
  ]
}
```

#### 3. Service Client IA ("The Brain")

**Architecture en 3 couches**:

1. **State Machine**: Suit la progression (V1_SUBMITTED, TESTS_FAILED, etc.)
2. **Scenario Engine**: Logique pédagogique définie par le créateur
3. **LLM Wrapper**: Transforme les instructions en dialogue humain

**Exemple de prompt structuré**:
```
SYSTEM: Tu es Chloé, cliente amicale mais précise.
CONTEXT: L'utilisateur a soumis la V1. Test "grid-structure": PASS, Test "image-click": FAIL
OBJECTIF: 
1. Féliciter pour la structure
2. Expliquer le problème d'interactivité
3. Débloquer l'objectif "formulaire de contact"
```

---

## Base de Données

### Schéma Principal (Prisma)

#### Tables Principales

**Users**
- Authentification (email/password + OAuth)
- Rôles (LEARNER, CREATOR, ADMIN)
- Abonnements (FREE, PREMIUM, CREATOR_PRO, etc.)

**Courses**
- Métadonnées (titre, description, niveau, prix)
- Relations (créateur, catégorie, modules)
- Statistiques (inscriptions, revenus, notes)

**Projects** (Sandbox)
- Configuration (boilerplate, tests)
- Scénario IA (client name, brief, objectifs)
- Relations (créateur, sessions, soumissions)

**SandboxSessions**
- Infrastructure (containerId, workspaceUrl, status)
- State machine (currentState)
- Relations (messages, soumissions)

### Relations Clés

```
User ──< Enrollment >── Course
User ──< SandboxSession >── Project
SandboxSession ──< Message
SandboxSession ──< ProjectSubmission
```

---

## Services Externes & APIs

### 1. Supabase (Backend as a Service)

**Usage**:
- Base de données PostgreSQL
- Authentification (email + OAuth)
- Stockage de fichiers (avatars, PDFs)
- Edge Functions (serverless)

**Configuration**:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
```

### 2. Stripe (Paiements)

**Fonctionnalités**:
- Paiements uniques (cours)
- Abonnements (Premium, Creator Pro)
- **Stripe Connect**: Paiements aux créateurs
- Webhooks pour les événements

**Flow de paiement**:
```
1. Frontend crée une Checkout Session
2. Utilisateur paie sur Stripe
3. Webhook "checkout.session.completed"
4. Backend crée l'Enrollment
5. Commission déduite, créateur payé via Connect
```

### 3. Mux (Vidéo)

**Avantages**:
- Encodage automatique multi-qualité
- Streaming adaptatif (HLS)
- Analytics vidéo intégrées

**Upload flow**:
```typescript
const upload = await mux.Video.Uploads.create({
  new_asset_settings: { playback_policy: 'public' }
});
// Retourne une URL de upload direct
```

### 4. Anthropic/OpenAI (IA)

**Usage**: Génération des dialogues du Client Virtuel

**Exemple d'appel**:
```typescript
const response = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 1024,
  messages: [{ role: 'user', content: prompt }]
});
```

---

## Sécurité

### Authentification

- **JWT** pour les sessions (via Supabase Auth)
- **OAuth 2.0** pour Google, GitHub, LinkedIn
- **Refresh tokens** pour les sessions longues

### Autorisation

- **Row Level Security (RLS)** sur Supabase
- **Guards NestJS** pour les routes API
- **Policies Prisma** pour les requêtes

### Sandbox Isolation

- **Network Policies K8s**: Chaque Pod isolé
- **Resource Limits**: CPU/RAM limités par conteneur
- **Timeouts**: Auto-destruction après inactivité

### Données Sensibles

- **Encryption at rest**: PostgreSQL + AWS KMS
- **Secrets management**: AWS Secrets Manager
- **API Keys**: Jamais exposées au frontend

---

## Déploiement

### Environnements

| Env | Frontend | Backend | Database |
|-----|----------|---------|----------|
| Dev | localhost:3000 | localhost:4000 | Local PostgreSQL |
| Staging | staging.brainow.com | api-staging | Supabase Staging |
| Production | brainow.com | api.brainow.com | Supabase Prod |

### CI/CD Pipeline (GitHub Actions)

```yaml
1. Lint & Type Check
2. Run Tests (Unit + Integration)
3. Build Docker Images
4. Push to Registry (ECR/GCR)
5. Deploy to K8s (Helm)
6. Run E2E Tests (Playwright)
7. Notify Sentry
```

### Monitoring

- **Sentry**: Erreurs frontend & backend
- **PostHog**: Analytics produit
- **CloudWatch**: Logs & métriques infrastructure
- **Uptime Robot**: Monitoring de disponibilité

---

## Prochaines Étapes

1. ✅ Configuration du monorepo
2. ✅ Schéma de base de données
3. ✅ Composants UI Sandbox
4. 🔄 Backend NestJS avec GraphQL
5. 🔄 Service Workspace (K8s)
6. 🔄 Service de Vérification (Playwright)
7. 🔄 Intégration IA (Anthropic)
8. 🔄 Système de paiement (Stripe)

---

**Dernière mise à jour**: 2024
**Version**: 1.0.0
