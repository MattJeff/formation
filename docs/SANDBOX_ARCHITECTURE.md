# Architecture du Sandbox SkillForge

## Vue d'Ensemble

Le **SkillForge Sandbox** est l'innovation centrale de la plateforme. C'est un environnement de développement complet dans le navigateur où les apprenants travaillent sur des projets réels avec un **Client IA** qui simule une vraie relation professionnelle.

---

## Philosophie

> "De l'apprentissage passif à la simulation professionnelle"

L'objectif est de combler l'abîme entre la connaissance théorique (acquise via des tutoriels) et la compétence pratique (requise en entreprise). Il ne s'agit plus de suivre une recette, mais de répondre à un besoin dans un environnement qui simule les pressions, les ambiguïtés et les imprévus du monde réel.

**Nous vendons de l'expérience, pas seulement de l'information.**

---

## Parcours Utilisateur Détaillé

### Scénario: "Portfolio de Photographe Interactif"

#### 1. Initiation (10 secondes)
```
User clicks "Démarrer le Projet"
    ↓
Frontend → API: POST /sandbox/provision
    ↓
K8s: Deploy new Pod (node:18 + code-server)
    ↓
API → Frontend: { workspaceUrl, sessionId }
    ↓
Interface Sandbox s'affiche
```

#### 2. Premier Contact
Le panneau de chat affiche le message initial du Client IA:

```markdown
**Chloé (IA)**: Salut ! Je suis photographe et j'ai besoin d'un site 
portfolio simple pour exposer mon travail. Pour la V1, je veux:

- Une page d'accueil avec mon nom en grand
- Une grille de 6 photos cliquables
- Un pied de page avec mon email

J'ai déposé 6 images (photo1.jpg à photo6.jpg) dans le dossier 
`/images`. À toi de jouer ! 📸
```

#### 3. Boucle de Développement
```
User édite index.html, style.css, script.js
    ↓
Monaco Editor (auto-save toutes les 2s)
    ↓
WebSocket → Workspace Container
    ↓
Hot Reload dans l'aperçu
```

#### 4. Soumission (Click "Soumettre pour validation")
```
Frontend → API: POST /sandbox/submit
    ↓
API → Verification Service: { sessionId, code }
    ↓
Verification Service:
  1. Spin up ephemeral Docker container
  2. Clone user code
  3. Run Playwright tests
  4. Generate JSON report
    ↓
API receives report
    ↓
API → AI Service: { report, currentState }
    ↓
AI Service:
  1. State Machine determines next state
  2. Scenario Engine selects response template
  3. LLM generates human dialogue
    ↓
API → Frontend: { feedback, updatedObjectives }
    ↓
UI updates: checkmarks, new message in chat
```

#### 5. Feedback Itératif

**Si tests échouent:**
```markdown
**Chloé (IA)**: Merci, ça prend forme ! J'aime la disposition. 
[Test #1 - Structure: ✅ PASS]

Par contre, j'ai noté que lorsque je clique sur une photo, rien ne 
se passe. Je m'attendais à ce qu'elle s'affiche en grand. 
[Test #2 - Interactivité: ❌ FAIL]

**Nouveau besoin**: Ah, et j'ai oublié de préciser ! J'aimerais un 
formulaire de contact simple (Nom, Email, Message) juste au-dessus 
du pied de page. Peux-tu l'ajouter pour la V2 ?
```

#### 6. Validation Finale
```markdown
**Chloé (IA)**: Incroyable, c'est exactement ça ! 🎉 Le formulaire 
est parfait et la galerie fonctionne à merveille. 
[Tous les tests: ✅ PASS]

Excellent travail. Le projet est validé !
```

---

## Architecture Technique Détaillée

### 1. Service Workspace (L'IDE Cloud)

#### Stack
- **Orchestration**: Kubernetes
- **Runtime**: Docker containers
- **Base Image**: `node:18-bullseye` + code-server

#### Lifecycle d'un Workspace

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: workspace-user-123-proj-456
  labels:
    app: skillforge-workspace
    userId: user-123
    projectId: proj-456
spec:
  containers:
  - name: workspace
    image: skillforge/workspace:latest
    ports:
    - containerPort: 8080
    resources:
      limits:
        memory: "2Gi"
        cpu: "1000m"
      requests:
        memory: "512Mi"
        cpu: "250m"
    volumeMounts:
    - name: user-code
      mountPath: /workspace
  volumes:
  - name: user-code
    persistentVolumeClaim:
      claimName: pvc-user-123-proj-456
```

#### États du Workspace

| État | Description | Durée |
|------|-------------|-------|
| `PROVISIONING` | Pod en cours de création | ~10s |
| `ACTIVE` | Utilisateur connecté et actif | Variable |
| `SLEEPING` | Inactif > 30 min, Pod scaled to 0 | Illimité |
| `TERMINATED` | Projet terminé, ressources libérées | Permanent |

#### Sécurité

- **Network Policies**: Chaque Pod ne peut communiquer qu'avec l'API
- **Resource Quotas**: Limites CPU/RAM strictes
- **Ingress avec TLS**: Accès HTTPS uniquement
- **Timeout**: Auto-destruction après 24h d'inactivité

---

### 2. Service de Vérification ("The Judge")

#### Rôle
Exécuter les tests automatisés sur le code de l'apprenant de manière isolée et sécurisée.

#### Architecture

```
API Request
    ↓
Verification Service (NestJS)
    ↓
Docker API: Create container from test image
    ↓
Container:
  1. git clone <user-code-from-volume>
  2. npm install
  3. npx playwright test
  4. Generate report.json
    ↓
Service reads report.json
    ↓
Docker API: Remove container
    ↓
Return report to API
```

#### Exemple de Test Playwright

```typescript
// tests/portfolio.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Portfolio de Photographe', () => {
  test('grid-structure: La grille de photos existe', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const gallery = page.locator('.gallery');
    await expect(gallery).toBeVisible();
    
    const images = gallery.locator('img');
    await expect(images).toHaveCount(6);
  });

  test('image-click-event: Les images sont cliquables', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const firstImage = page.locator('.gallery img').first();
    await firstImage.click();
    
    // Vérifier qu'une modal ou lightbox s'ouvre
    const modal = page.locator('.modal, .lightbox');
    await expect(modal).toBeVisible();
  });

  test('contact-form-exists: Le formulaire de contact existe', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();
    
    await expect(form.locator('input[name="name"]')).toBeVisible();
    await expect(form.locator('input[name="email"]')).toBeVisible();
    await expect(form.locator('textarea[name="message"]')).toBeVisible();
  });
});
```

#### Format du Rapport

```typescript
interface VerificationReport {
  projectId: string;
  userId: string;
  submissionId: string;
  timestamp: Date;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number; // ms
  };
}

interface TestResult {
  testId: string;
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  error?: {
    message: string;
    stack: string;
  };
  screenshots?: string[]; // URLs
}
```

---

### 3. Service Client IA ("The Brain")

#### Architecture en 3 Couches

##### Couche 1: State Machine

Suit la progression de l'utilisateur pour un projet donné.

```typescript
enum ProjectState {
  INITIAL = 'INITIAL',
  V1_SUBMITTED = 'V1_SUBMITTED',
  V1_TESTS_FAILED = 'V1_TESTS_FAILED',
  V1_TESTS_PASSED = 'V1_TESTS_PASSED',
  V2_SUBMITTED = 'V2_SUBMITTED',
  COMPLETED = 'COMPLETED',
}

interface SessionState {
  sessionId: string;
  currentState: ProjectState;
  history: StateTransition[];
  objectivesCompleted: string[];
}
```

##### Couche 2: Scenario Engine

Contient la logique pédagogique définie par le créateur du cours.

```typescript
interface ScenarioRule {
  id: string;
  triggerCondition: {
    state: ProjectState;
    testResults: { [testId: string]: 'pass' | 'fail' };
  };
  actions: {
    nextState: ProjectState;
    aiResponseTemplate: string;
    unlockObjectives?: string[];
    updateChecklist?: { objectiveId: string; completed: boolean }[];
  };
}

// Exemple de règle
const rule: ScenarioRule = {
  id: 'v1-partial-success',
  triggerCondition: {
    state: 'V1_SUBMITTED',
    testResults: {
      'grid-structure': 'pass',
      'image-click-event': 'fail',
    },
  },
  actions: {
    nextState: 'V1_TESTS_FAILED',
    aiResponseTemplate: 'feedback_modal_missing',
    unlockObjectives: ['add_contact_form'],
    updateChecklist: [
      { objectiveId: 'grid-structure', completed: true },
    ],
  },
};
```

##### Couche 3: LLM Wrapper

Transforme les instructions logiques en dialogue humain naturel.

```typescript
async function generateAIResponse(
  template: string,
  context: SessionContext
): Promise<string> {
  const prompt = `
SYSTEM: Tu es ${context.project.clientName}, ${context.project.clientPersona}.
Ton style de communication est ${context.project.communicationStyle}.

CONTEXT:
- L'utilisateur vient de soumettre la ${context.currentVersion}
- Tests réussis: ${context.passedTests.join(', ')}
- Tests échoués: ${context.failedTests.join(', ')}

TEMPLATE: ${template}

OBJECTIF:
1. Félicite pour les réussites
2. Explique les problèmes de manière constructive
3. ${context.newObjectives ? 'Introduis le nouvel objectif naturellement' : ''}

CONTRAINTES:
- Maximum 150 mots
- Ton amical mais professionnel
- Utilise des emojis avec parcimonie (max 2)
`;

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text;
}
```

---

## Expérience Créateur: Construire un Scénario

### Interface "Scenario Builder"

Le créateur dispose d'une interface visuelle pour configurer le projet Sandbox:

#### 1. Configuration de Base

```yaml
Nom du Projet: Portfolio de Photographe Interactif
Difficulté: Intermédiaire
Durée Estimée: 2-3 heures

Client IA:
  Nom: Chloé Dubois
  Avatar: [Upload ou générer]
  Persona: Photographe professionnelle, exigeante mais bienveillante
  Style: Amical, utilise des emojis, donne des feedbacks constructifs
```

#### 2. Boilerplate & Assets

```
Dépôt Git: https://github.com/skillforge/boilerplate-portfolio
Structure:
  /images/
    photo1.jpg
    photo2.jpg
    ...
  /src/
    index.html (vide)
    style.css (vide)
    script.js (vide)
  package.json
  README.md
```

#### 3. Définition des Objectifs

```typescript
const objectives = [
  {
    id: 'obj-1',
    text: 'Mettre en place la structure HTML de base',
    testId: 'html-structure',
    order: 1,
    hints: [
      'Utilise les balises sémantiques (<header>, <main>, <footer>)',
      'N\'oublie pas le DOCTYPE et la balise <meta viewport>',
    ],
  },
  {
    id: 'obj-2',
    text: 'Créer une grille de 6 photos',
    testId: 'grid-structure',
    order: 2,
    hints: [
      'CSS Grid est parfait pour ce cas d\'usage',
      'Pense à grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))',
    ],
  },
  // ...
];
```

#### 4. Écriture des Tests

Le créateur écrit les tests Playwright qui serviront de "correction":

```typescript
// Interface guidée avec auto-complétion
test('grid-structure', async ({ page }) => {
  await page.goto('/');
  const gallery = page.locator('.gallery');
  await expect(gallery).toBeVisible();
  const images = gallery.locator('img');
  await expect(images).toHaveCount(6);
});
```

#### 5. Construction du Scénario Narratif

Interface visuelle (type arbre de décision):

```
[État Initial]
    ↓
[V1 Soumise]
    ├─→ [Tous tests PASS] → Message: "Excellent !" → [V2: Nouveau besoin]
    └─→ [Tests partiels] → Message: "Bien, mais..." → [Reste en V1]
```

Chaque nœud peut avoir:
- **Conditions**: Quels tests doivent passer/échouer
- **Template de réponse**: Texte avec variables `{passedTests}`, `{failedTests}`
- **Actions**: Débloquer objectifs, mettre à jour checklist
- **État suivant**: Transition de la state machine

---

## Performance & Scalabilité

### Métriques Cibles

| Métrique | Cible | Actuel |
|----------|-------|--------|
| Temps de provisioning | < 15s | ~10s |
| Temps de vérification | < 20s | ~15s |
| Réponse IA | < 3s | ~2s |
| Coût par session (1h) | < 0.10€ | ~0.08€ |

### Optimisations

1. **Pre-warmed Pods**: Pool de 10 Pods prêts à l'emploi
2. **Image Caching**: Layers Docker en cache sur les nodes
3. **Test Parallelization**: Tests Playwright en parallèle
4. **LLM Caching**: Réponses similaires mises en cache (Redis)

### Scaling Strategy

```
Horizontal Pod Autoscaler (HPA):
  Min Replicas: 5
  Max Replicas: 100
  Target CPU: 70%
  Target Memory: 80%

Cluster Autoscaler:
  Min Nodes: 3
  Max Nodes: 20
  Scale up: Agressif (1 min)
  Scale down: Conservateur (10 min)
```

---

## Monitoring & Observabilité

### Métriques Clés

```typescript
// Prometheus metrics
sandbox_sessions_active{project_id}
sandbox_provision_duration_seconds
sandbox_verification_duration_seconds
sandbox_ai_response_duration_seconds
sandbox_errors_total{type}
```

### Logs Structurés

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "service": "sandbox-workspace",
  "sessionId": "sess_123",
  "userId": "user_456",
  "projectId": "proj_789",
  "event": "workspace_provisioned",
  "duration_ms": 9500,
  "containerId": "k8s-pod-abc123"
}
```

### Alertes

- **Provisioning > 30s**: Alerte Slack + PagerDuty
- **Error Rate > 5%**: Alerte email
- **Active Sessions > 80% capacity**: Auto-scale trigger

---

## Sécurité du Sandbox

### Isolation

1. **Network Policies**: Chaque Pod ne peut accéder qu'à l'API
2. **Resource Limits**: CPU/RAM/Disk strictement limités
3. **No Privileged Mode**: Containers non-root
4. **Read-only Root FS**: Système de fichiers en lecture seule sauf `/workspace`

### Prévention des Abus

```typescript
// Rate limiting
@RateLimit({ points: 10, duration: 60 }) // 10 soumissions/min
async submitProject() { ... }

// Timeout global
const WORKSPACE_MAX_LIFETIME = 24 * 60 * 60 * 1000; // 24h

// Code scanning
if (detectMaliciousCode(userCode)) {
  throw new ForbiddenException('Code suspect détecté');
}
```

---

## Roadmap Future

### Phase 2: Collaboration
- **Pair Programming**: 2 utilisateurs dans le même workspace
- **Code Review**: Peer review avant soumission au client IA

### Phase 3: Équipes
- **Squad Mode**: 3-4 apprenants (Frontend, Backend, Designer)
- **Chef de Projet IA**: Coordonne l'équipe, assigne les tâches

### Phase 4: Production Simulation
- **Incidents**: Le client IA signale des bugs en production
- **Monitoring**: Intégration Sentry/Datadog simulée
- **Déploiement**: Pipeline CI/CD complet

---

**Dernière mise à jour**: 2024
**Version**: 1.0.0
