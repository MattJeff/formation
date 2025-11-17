# Brainow - Résumé du Projet

## 🎯 Vision

**Brainow** est une plateforme de formation nouvelle génération qui comble le fossé entre la connaissance théorique et la compétence professionnelle. Nous vendons de l'expérience et de l'employabilité, pas seulement de l'information.

---

## 🚀 Innovation Principale: Le Sandbox IA

Le **Brainow Sandbox** est un environnement de développement complet dans le navigateur où les apprenants travaillent sur des projets réels avec un **Client IA** qui simule une vraie relation professionnelle.

### Fonctionnalités Clés

- **IDE Cloud Intégré**: Monaco Editor (VS Code) + Terminal + Aperçu en direct
- **Client Virtuel IA**: Dialogue naturel, feedback intelligent, scope creep réaliste
- **Vérification Automatisée**: Tests Playwright pour valider le code
- **Portfolio Vérifiable**: Preuve de compétence basée sur des projets réels

---

## 📁 Structure du Projet

```
brainow/
├── apps/
│   ├── web/              # Frontend Next.js (✅ Créé)
│   ├── api/              # Backend NestJS (à créer)
│   ├── sandbox/          # Service Sandbox (à créer)
│   └── verification/     # Service de vérification (à créer)
├── packages/
│   ├── database/         # Schéma Prisma (✅ Créé)
│   ├── ui/               # Composants UI (à créer)
│   ├── config/           # Configs partagées (à créer)
│   └── types/            # Types TypeScript (à créer)
└── docs/                 # Documentation complète (✅ Créé)
```

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | Next.js 14, React, Tailwind CSS, Shadcn/ui |
| **Backend** | NestJS, GraphQL, Prisma |
| **Base de Données** | PostgreSQL (Supabase) |
| **Sandbox** | Docker, Kubernetes, Monaco Editor |
| **IA** | Anthropic (Claude) / OpenAI |
| **Vidéo** | Mux |
| **Paiements** | Stripe Connect |
| **Déploiement** | Vercel (Frontend), AWS EKS (Backend) |

---

## 💰 Modèle Économique

### Pour les Apprenants
- **Achat de cours**: 49€ - 299€ (accès à vie)
- **Premium**: 29€/mois (Sandbox illimité + certifications)

### Pour les Créateurs (SaaS)
- **Gratuit**: 0€/mois + 25% commission
- **Pro**: 19€/mois + 5% commission
- **Académie**: 99€/mois + 2% commission

### B2B
- **Entreprise**: 39-49€/siège/mois (licences annuelles)

### Projections
- **Année 1**: 1M€ CA
- **Année 2**: 5M€ CA
- **Année 3**: 15M€ CA (55% de marge)

---

## 📊 État d'Avancement

### ✅ Complété

1. **Structure du monorepo** (Turborepo)
2. **Configuration TypeScript, ESLint, Prettier**
3. **Application Frontend Next.js**
   - Page d'accueil
   - Interface Sandbox complète (3 panneaux)
   - Composants UI (FileExplorer, CodeEditor, ClientPanel, Terminal, Preview)
4. **Schéma de base de données Prisma**
   - 20+ modèles (Users, Courses, Projects, Sandbox, etc.)
   - Relations complètes
   - Script de seed
5. **Documentation exhaustive**
   - Spécifications techniques (TECHNICAL_SPECS.md)
   - Architecture Sandbox (SANDBOX_ARCHITECTURE.md)
   - Inventaire des APIs (API_KEYS_INVENTORY.md)
   - Guide de démarrage (GETTING_STARTED.md)
   - Guide de déploiement (DEPLOYMENT.md)
   - Modèle économique (BUSINESS_MODEL.md)
   - Guide de contribution (CONTRIBUTING.md)

### 🔄 À Faire

1. **Backend NestJS**
   - API GraphQL
   - Authentification (Supabase Auth)
   - Gestion des cours et inscriptions
   - Intégration Stripe

2. **Service Sandbox**
   - Provisioning de workspaces Kubernetes
   - Gestion du cycle de vie des conteneurs
   - WebSocket pour communication temps réel

3. **Service de Vérification**
   - Exécution des tests Playwright
   - Génération de rapports JSON
   - Isolation des conteneurs

4. **Service IA**
   - State machine pour la progression
   - Scenario engine
   - Intégration Anthropic/OpenAI

5. **Intégrations Externes**
   - Stripe Connect (paiements créateurs)
   - Mux (upload et streaming vidéo)
   - Resend (emails transactionnels)
   - Sentry (monitoring erreurs)

6. **Tests**
   - Tests unitaires (Vitest)
   - Tests d'intégration
   - Tests E2E (Playwright)

---

## 🔑 Variables d'Environnement Requises

### Critiques (🔴)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`
- `ANTHROPIC_API_KEY` ou `OPENAI_API_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

### Importantes (🟡)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `RESEND_API_KEY`
- `SENTRY_DSN`

Voir `.env.example` pour la liste complète.

---

## 🚦 Prochaines Étapes

### Phase 1: MVP Backend (2-3 semaines)
1. Créer l'application NestJS
2. Implémenter l'API GraphQL de base
3. Connecter à Supabase
4. Authentification OAuth

### Phase 2: Sandbox Fonctionnel (3-4 semaines)
1. Configurer Kubernetes local (Minikube)
2. Créer l'image Docker du workspace
3. Implémenter le provisioning
4. WebSocket pour hot reload

### Phase 3: IA & Vérification (2-3 semaines)
1. Service de vérification avec Playwright
2. Intégration Anthropic
3. State machine et scenario engine
4. Tests end-to-end du flow complet

### Phase 4: Paiements & Vidéo (2 semaines)
1. Intégration Stripe Connect
2. Upload vidéo vers Mux
3. Gestion des abonnements

### Phase 5: Polish & Launch (2 semaines)
1. Tests utilisateurs
2. Optimisations performance
3. Documentation utilisateur
4. Déploiement production

**Durée totale estimée**: 11-14 semaines

---

## 📚 Documentation

Toute la documentation est dans le dossier `/docs`:

- **[TECHNICAL_SPECS.md](./docs/TECHNICAL_SPECS.md)**: Architecture technique complète
- **[SANDBOX_ARCHITECTURE.md](./docs/SANDBOX_ARCHITECTURE.md)**: Détails du Sandbox
- **[API_KEYS_INVENTORY.md](./docs/API_KEYS_INVENTORY.md)**: Liste des services externes
- **[GETTING_STARTED.md](./docs/GETTING_STARTED.md)**: Guide d'installation
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)**: Guide de déploiement
- **[BUSINESS_MODEL.md](./docs/BUSINESS_MODEL.md)**: Modèle économique
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Guide de contribution

---

## 🎨 Design & UX

### Philosophie
Interface "Cockpit de Développeur" immersive avec thème sombre par défaut.

### Disposition
- **3 panneaux redimensionnables**:
  - Gauche: Explorateur de fichiers + outils
  - Centre: Éditeur de code + aperçu/terminal
  - Droite: Client IA (brief, chat, soumission)

### Feedback Visuel
- Animations fluides
- Checkmarks automatiques sur validation
- États de chargement clairs
- Messages d'erreur constructifs

---

## 🔒 Sécurité

- **Isolation Sandbox**: Chaque workspace dans un Pod Kubernetes isolé
- **Resource Limits**: CPU/RAM strictement limités
- **Network Policies**: Communication restreinte
- **Secrets Management**: AWS Secrets Manager
- **HTTPS**: Obligatoire partout (Let's Encrypt)
- **RGPD**: Conformité dès la conception

---

## 📈 Métriques de Succès

### Acquisition
- CAC < 50€
- LTV > 500€
- Ratio LTV/CAC > 10:1

### Engagement
- Taux de complétion > 60%
- NPS > 50
- Rétention (mois 3) > 70%

### Monétisation
- ARPU: 50€/an
- Conversion Premium: 5%
- GMV: 5M€/an (Année 2)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines.

---

## 📞 Contact

- **Email**: dev@brainow.com
- **Discord**: [Rejoindre la communauté](https://discord.gg/brainow)
- **GitHub**: [github.com/votre-org/brainow](https://github.com)

---

## 📄 Licence

MIT License - Voir [LICENSE](./LICENSE)

---

**Brainow - Forge Your Professional Skills** 🔥

*De la théorie à la pratique professionnelle*
