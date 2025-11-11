# Guide de Contribution - SkillForge

Merci de votre intérêt pour contribuer à SkillForge ! Ce document vous guide à travers le processus de contribution.

---

## Code de Conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite:

- Être respectueux et inclusif
- Accepter les critiques constructives
- Se concentrer sur ce qui est meilleur pour la communauté
- Faire preuve d'empathie envers les autres membres

---

## Comment Contribuer

### Signaler un Bug

1. Vérifier que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/votre-org/skillforge/issues)
2. Créer une nouvelle issue avec le template "Bug Report"
3. Inclure:
   - Description claire du problème
   - Steps to reproduce
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Environnement (OS, Node version, etc.)

### Proposer une Fonctionnalité

1. Créer une issue avec le template "Feature Request"
2. Décrire:
   - Le problème que cela résout
   - La solution proposée
   - Des alternatives considérées
   - Impact potentiel

### Soumettre du Code

#### 1. Fork & Clone

```bash
# Fork le repo sur GitHub, puis:
git clone https://github.com/votre-username/skillforge.git
cd skillforge
git remote add upstream https://github.com/skillforge/skillforge.git
```

#### 2. Créer une Branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-du-bug
```

**Convention de nommage**:
- `feature/` - Nouvelle fonctionnalité
- `fix/` - Correction de bug
- `docs/` - Documentation
- `refactor/` - Refactoring
- `test/` - Ajout de tests

#### 3. Développer

```bash
# Installer les dépendances
npm install

# Lancer en mode dev
npm run dev

# Faire vos modifications...
```

#### 4. Tester

```bash
# Linter
npm run lint

# Tests (si configurés)
npm run test

# Build pour vérifier qu'il n'y a pas d'erreurs
npm run build
```

#### 5. Commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(sandbox): ajouter support du terminal Xterm"
```

**Format**:
```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

**Types**:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage (pas de changement de code)
- `refactor`: Refactoring
- `test`: Ajout de tests
- `chore`: Maintenance

**Exemples**:
```bash
feat(auth): ajouter OAuth GitHub
fix(sandbox): corriger le hot reload
docs(readme): mettre à jour les instructions d'installation
refactor(database): optimiser les requêtes Prisma
```

#### 6. Push & Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis sur GitHub:
1. Créer une Pull Request
2. Remplir le template
3. Lier l'issue correspondante
4. Attendre la review

---

## Standards de Code

### TypeScript

- **Strict mode** activé
- Typage explicite pour les fonctions publiques
- Pas de `any` (utiliser `unknown` si nécessaire)
- Interfaces pour les objets, Types pour les unions

```typescript
// ✅ Bon
interface User {
  id: string;
  email: string;
}

function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Mauvais
function getUser(id: any): any {
  // ...
}
```

### React / Next.js

- **Composants fonctionnels** uniquement
- **Hooks** pour la logique
- **Props** typées avec TypeScript
- **'use client'** explicite pour les composants client

```typescript
// ✅ Bon
'use client';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Mauvais
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Styling

- **Tailwind CSS** pour le styling
- Classes utilitaires en priorité
- Composants Shadcn/ui pour les éléments réutilisables
- Pas de CSS inline sauf exception

```tsx
// ✅ Bon
<div className="flex items-center gap-4 rounded-lg bg-card p-4">
  <span className="text-sm font-medium">Hello</span>
</div>

// ❌ Mauvais
<div style={{ display: 'flex', padding: '16px' }}>
  <span style={{ fontSize: '14px' }}>Hello</span>
</div>
```

### Nommage

- **camelCase** pour les variables et fonctions
- **PascalCase** pour les composants et classes
- **UPPER_SNAKE_CASE** pour les constantes
- **kebab-case** pour les fichiers

```typescript
// Variables et fonctions
const userName = 'John';
function getUserById(id: string) {}

// Composants
function UserProfile() {}

// Constantes
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

// Fichiers
user-profile.tsx
api-client.ts
```

---

## Structure des Commits

### Commits Atomiques

Chaque commit doit représenter **une seule modification logique**.

```bash
# ✅ Bon
git commit -m "feat(auth): ajouter OAuth Google"
git commit -m "feat(auth): ajouter OAuth GitHub"

# ❌ Mauvais
git commit -m "ajouter OAuth Google et GitHub et corriger un bug"
```

### Messages Descriptifs

```bash
# ✅ Bon
feat(sandbox): ajouter support du hot reload pour les fichiers CSS

Le hot reload ne fonctionnait que pour les fichiers JS. Cette modification
ajoute le support pour CSS en utilisant un watcher de fichiers.

Fixes #123

# ❌ Mauvais
fix stuff
```

---

## Process de Review

### Pour les Reviewers

- Être constructif et respectueux
- Expliquer le "pourquoi" des suggestions
- Approuver si les changements sont mineurs
- Demander des modifications si nécessaire

### Pour les Contributeurs

- Répondre aux commentaires
- Faire les modifications demandées
- Re-request review après les changements
- Être patient et ouvert aux suggestions

---

## Tests

### Tests Unitaires

```typescript
// user.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail } from './user';

describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### Tests d'Intégration

```typescript
// api.test.ts
import { describe, it, expect } from 'vitest';
import { createUser } from './api';

describe('User API', () => {
  it('should create a new user', async () => {
    const user = await createUser({
      email: 'test@example.com',
      username: 'testuser',
    });
    
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
  });
});
```

---

## Documentation

### Code Comments

```typescript
// ✅ Bon - Expliquer le "pourquoi"
// Utiliser un timeout pour éviter les race conditions lors du hot reload
setTimeout(() => reload(), 100);

// ❌ Mauvais - Expliquer le "quoi" (évident)
// Créer une variable user
const user = getUser();
```

### JSDoc pour les APIs Publiques

```typescript
/**
 * Crée une nouvelle session Sandbox pour un utilisateur
 * 
 * @param userId - L'ID de l'utilisateur
 * @param projectId - L'ID du projet à charger
 * @returns La session créée avec l'URL du workspace
 * @throws {NotFoundError} Si le projet n'existe pas
 */
async function createSandboxSession(
  userId: string,
  projectId: string
): Promise<SandboxSession> {
  // ...
}
```

---

## Checklist avant de Soumettre

- [ ] Le code compile sans erreurs
- [ ] Les tests passent
- [ ] Le linter ne remonte pas d'erreurs
- [ ] La documentation est à jour
- [ ] Les commits suivent la convention
- [ ] La PR a une description claire
- [ ] Les screenshots sont inclus (si changement UI)

---

## Questions ?

- **Discord**: [Rejoindre](https://discord.gg/skillforge)
- **GitHub Discussions**: [Poser une question](https://github.com/votre-org/skillforge/discussions)
- **Email**: dev@skillforge.com

---

**Merci pour votre contribution ! 🙏**
