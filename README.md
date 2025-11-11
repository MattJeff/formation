# SkillForge - Plateforme de Formation Nouvelle Génération

## 🎯 Vision

SkillForge est une plateforme d'apprentissage révolutionnaire qui comble le fossé entre la connaissance théorique et la compétence professionnelle. Nous vendons de l'expérience et de l'employabilité, pas seulement de l'information.

## 🚀 Fonctionnalités Principales

### Le SkillForge Sandbox
- **Client Virtuel IA** : Simulation de relations client réalistes avec feedback intelligent
- **IDE Cloud Intégré** : Environnement de développement complet dans le navigateur
- **Moteur de Vérification Automatisé** : Tests automatiques avec Playwright
- **Travail en Équipe Simulé** : Collaboration avec d'autres apprenants

### Pour les Apprenants
- Portfolio de compétences vérifiables
- Coach IA personnalisé
- Communauté intégrée
- Certifications basées sur des projets réels

### Pour les Créateurs
- Studio de création assisté par IA
- Analytiques avancées
- Outils marketing intégrés
- Rémunération automatisée via Stripe Connect

## 🏗️ Architecture Technique

### Stack Principal
- **Frontend**: Next.js 14+ (React), Tailwind CSS, Shadcn/ui
- **Backend**: NestJS (Node.js), GraphQL (Apollo)
- **Base de Données**: PostgreSQL avec Prisma ORM
- **Plateforme**: Supabase (Auth, Storage, Edge Functions)
- **Sandbox**: Docker + Kubernetes
- **IA**: Anthropic (Claude) / OpenAI API
- **Vidéo**: Mux
- **Paiements**: Stripe Connect

### Structure du Monorepo
```
skillforge/
├── apps/
│   ├── web/              # Application frontend Next.js
│   ├── api/              # Backend NestJS
│   ├── sandbox/          # Service Sandbox IDE
│   └── verification/     # Service de vérification
├── packages/
│   ├── ui/               # Composants UI partagés
│   ├── database/         # Schéma Prisma
│   ├── config/           # Configurations partagées
│   └── types/            # Types TypeScript partagés
└── docs/                 # Documentation complète
```

## 📋 Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Kubernetes (pour le Sandbox)
- PostgreSQL 14+

## 🔧 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-org/skillforge.git
cd skillforge

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer les migrations de base de données
npm run db:migrate

# Démarrer le mode développement
npm run dev
```

## 🔑 Variables d'Environnement Requises

### Backend & Base de Données
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `JWT_SECRET`

### Authentification OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET`

### Paiements
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CONNECT_CLIENT_ID`

### Vidéo
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`
- `MUX_WEBHOOK_SECRET`

### IA (Client Virtuel)
- `ANTHROPIC_API_KEY` ou `OPENAI_API_KEY`

### Infrastructure Cloud
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

### Communication
- `RESEND_API_KEY`

### Monitoring
- `SENTRY_DSN`
- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

## 📚 Documentation Complète

Consultez le dossier `/docs` pour la documentation détaillée :
- [Spécifications Techniques](./docs/TECHNICAL_SPECS.md)
- [Architecture du Sandbox](./docs/SANDBOX_ARCHITECTURE.md)
- [Guide UI/UX](./docs/UI_UX_GUIDE.md)
- [API Documentation](./docs/API_REFERENCE.md)
- [Guide des Créateurs](./docs/CREATOR_GUIDE.md)

## 🎨 Philosophie de Design

Interface "Cockpit de Développeur" avec :
- Thème sombre par défaut
- Disposition en 3 panneaux redimensionnables
- Feedback visuel immédiat
- Expérience immersive sans friction

## 💰 Modèle Économique

### Pour les Créateurs (SaaS)
- **Gratuit**: 0€/mois + 15% commission
- **Pro**: 19€/mois + 5% commission
- **Académie**: 99€/mois + 2% commission

### Pour les Apprenants
- Achat de cours à l'unité
- **Premium**: 29€/mois (accès Sandbox illimité)

### B2B
- Licences entreprise par siège
- Tableau de bord manager
- Contenu privé

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines.

## 📄 Licence

Copyright © 2024 SkillForge. Tous droits réservés.

## 📞 Support

- Email: support@skillforge.com
- Discord: [Rejoindre la communauté](https://discord.gg/skillforge)
- Documentation: [docs.skillforge.com](https://docs.skillforge.com)
