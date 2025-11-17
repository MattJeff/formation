# Guide de Démarrage - Brainow

Ce guide vous accompagne pas à pas pour mettre en place l'environnement de développement Brainow.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé:

- **Node.js** >= 18.0.0 ([nodejs.org](https://nodejs.org))
- **npm** >= 9.0.0 (inclus avec Node.js)
- **Git** ([git-scm.com](https://git-scm.com))
- **Docker Desktop** ([docker.com](https://docker.com)) - Pour le Sandbox
- **PostgreSQL** 14+ ([postgresql.org](https://postgresql.org)) - Ou utiliser Supabase

---

## Installation Rapide

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-org/brainow.git
cd brainow
```

### 2. Installer les Dépendances

```bash
npm install
```

Cette commande installe toutes les dépendances pour tous les packages du monorepo.

### 3. Configurer les Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Éditer le fichier avec vos clés
nano .env.local  # ou code .env.local
```

**Variables minimales pour démarrer**:

```bash
# Base de données (Supabase ou local)
DATABASE_URL="postgresql://postgres:password@localhost:5432/brainow"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
```

### 4. Initialiser la Base de Données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables
npm run db:push

# (Optionnel) Peupler avec des données de test
npm run db:seed
```

### 5. Lancer le Mode Développement

```bash
# Lancer tous les services
npm run dev
```

Cela démarre:
- **Frontend** (Next.js): http://localhost:3000
- **Backend** (NestJS): http://localhost:4000
- **Prisma Studio**: http://localhost:5555 (si lancé séparément)

---

## Structure du Projet

```
brainow/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/           # Pages (App Router)
│   │   │   ├── components/    # Composants React
│   │   │   └── lib/           # Utilitaires
│   │   ├── public/            # Assets statiques
│   │   └── package.json
│   │
│   ├── api/                    # Backend NestJS (à créer)
│   ├── sandbox/                # Service Sandbox (à créer)
│   └── verification/           # Service de vérification (à créer)
│
├── packages/
│   ├── database/              # Schéma Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── index.ts
│   │
│   ├── ui/                    # Composants UI partagés (à créer)
│   ├── config/                # Configs partagées (à créer)
│   └── types/                 # Types TypeScript (à créer)
│
├── docs/                      # Documentation
│   ├── TECHNICAL_SPECS.md
│   ├── SANDBOX_ARCHITECTURE.md
│   ├── API_KEYS_INVENTORY.md
│   └── GETTING_STARTED.md (ce fichier)
│
├── package.json               # Root package.json
├── turbo.json                 # Configuration Turborepo
├── tsconfig.json              # Configuration TypeScript
└── .env.example               # Template des variables d'env
```

---

## Commandes Utiles

### Développement

```bash
# Lancer tous les services en mode dev
npm run dev

# Lancer uniquement le frontend
npm run dev --filter=@brainow/web

# Lancer uniquement le backend
npm run dev --filter=@brainow/api
```

### Base de Données

```bash
# Générer le client Prisma après modification du schema
npm run db:generate

# Créer une migration
npm run db:migrate

# Pousser le schéma sans créer de migration (dev uniquement)
npm run db:push

# Ouvrir Prisma Studio (interface visuelle)
npm run db:studio

# Réinitialiser et peupler la DB
npm run db:seed
```

### Build & Production

```bash
# Build tous les packages
npm run build

# Lancer en mode production
npm run start

# Nettoyer les builds
npm run clean
```

### Qualité du Code

```bash
# Linter
npm run lint

# Formatter (Prettier)
npm run format

# Tests (quand configurés)
npm run test
```

---

## Configuration des Services Externes

### Supabase (Recommandé pour débuter)

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier les clés depuis Settings → API
4. Mettre à jour `.env.local`:

```bash
SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### OAuth (Google, GitHub)

#### Google OAuth

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créer un projet
3. Activer "Google+ API"
4. Créer des identifiants OAuth 2.0
5. Ajouter `http://localhost:3000/auth/callback/google` comme URI de redirection
6. Copier Client ID et Client Secret dans `.env.local`

#### GitHub OAuth

1. Aller sur [github.com/settings/developers](https://github.com/settings/developers)
2. "New OAuth App"
3. Authorization callback URL: `http://localhost:3000/auth/callback/github`
4. Copier les clés dans `.env.local`

---

## Développement du Sandbox

Le Sandbox nécessite Docker et Kubernetes. Pour le développement local:

### Option 1: Minikube (Recommandé)

```bash
# Installer Minikube
brew install minikube  # macOS
# ou suivre https://minikube.sigs.k8s.io/docs/start/

# Démarrer Minikube
minikube start

# Vérifier
kubectl get nodes
```

### Option 2: Docker Desktop avec Kubernetes

1. Ouvrir Docker Desktop
2. Settings → Kubernetes → Enable Kubernetes
3. Attendre que le cluster démarre

### Tester le Sandbox Localement

```bash
# Build l'image Docker du workspace
cd apps/sandbox
docker build -t brainow/workspace:dev .

# Déployer sur Kubernetes
kubectl apply -f k8s/workspace-deployment.yaml

# Vérifier le déploiement
kubectl get pods
```

---

## Troubleshooting

### Erreur: "Cannot find module '@brainow/database'"

```bash
# Régénérer le client Prisma
cd packages/database
npm run db:generate
cd ../..
npm install
```

### Erreur: "Port 3000 already in use"

```bash
# Trouver et tuer le processus
lsof -ti:3000 | xargs kill -9

# Ou utiliser un autre port
PORT=3001 npm run dev
```

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est lancé
pg_isready

# Ou utiliser Supabase à la place
# Mettre à jour DATABASE_URL dans .env.local
```

### Les changements CSS ne s'appliquent pas

```bash
# Nettoyer le cache Next.js
rm -rf apps/web/.next
npm run dev
```

---

## Prochaines Étapes

Maintenant que votre environnement est configuré:

1. **Explorer l'interface**: Ouvrir http://localhost:3000
2. **Tester le Sandbox**: Aller sur http://localhost:3000/sandbox
3. **Consulter la DB**: Lancer `npm run db:studio`
4. **Lire la doc technique**: Voir `docs/TECHNICAL_SPECS.md`
5. **Contribuer**: Voir `CONTRIBUTING.md` (à créer)

---

## Ressources

- **Documentation complète**: `/docs`
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **NestJS Docs**: [docs.nestjs.com](https://docs.nestjs.com)
- **Kubernetes Docs**: [kubernetes.io/docs](https://kubernetes.io/docs)

---

## Support

- **Issues GitHub**: [github.com/votre-org/brainow/issues](https://github.com)
- **Discord**: [Rejoindre la communauté](https://discord.gg/brainow)
- **Email**: dev@brainow.com

---

**Bonne chance et bon développement ! 🚀**
