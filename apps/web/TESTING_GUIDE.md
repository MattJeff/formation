# 🧪 Guide de Tests E2E

## Vue d'ensemble

Tests End-to-End avec Playwright pour garantir que les flows critiques fonctionnent correctement.

**Stack**: Playwright + TypeScript
**Navigateurs**: Chromium (Chrome/Edge)

---

## Commandes

### Lancer les tests

```bash
# Tous les tests en mode headless
npm run test:e2e

# Tests avec interface UI interactive
npm run test:e2e:ui

# Tests en mode visible (headed)
npm run test:e2e:headed

# Tests en mode debug
npm run test:e2e:debug

# Voir le dernier rapport HTML
npm run test:e2e:report
```

### Lancer un test spécifique

```bash
# Un seul fichier
npx playwright test e2e/auth.spec.ts

# Un seul test
npx playwright test -g "devrait afficher la page de connexion"
```

---

## Structure des Tests

```
apps/web/
├── e2e/
│   ├── auth.spec.ts          # Tests d'authentification
│   ├── landing.spec.ts       # Tests page d'accueil
│   ├── courses.spec.ts       # Tests catalogue cours
│   └── (à venir)
│       ├── checkout.spec.ts  # Tests paiement Stripe
│       ├── creator.spec.ts   # Tests création de cours
│       └── learning.spec.ts  # Tests suivi de cours
├── playwright.config.ts      # Configuration Playwright
└── package.json
```

---

## Tests Actuels

### ✅ Implémentés

#### `auth.spec.ts` - Authentification
- [x] Affichage page connexion
- [x] Affichage page inscription
- [x] Redirection signup → login
- [x] Erreur login invalide

#### `landing.spec.ts` - Page d'accueil
- [x] Chargement page
- [x] Navigation vers catalogue
- [x] Navigation vers login
- [x] Affichage features
- [x] Responsive mobile (375px)

#### `courses.spec.ts` - Catalogue
- [x] Affichage catalogue
- [x] Recherche de cours
- [x] Filtres catégories
- [x] Ouverture détail cours
- [x] Bouton d'inscription visible

### ⬜ À implémenter (Priorités)

#### `checkout.spec.ts` - Paiement
- [ ] Flow complet d'achat
- [ ] Test mode Stripe (test card)
- [ ] Redirection success/cancel
- [ ] Vérification enrollment créé

#### `creator.spec.ts` - Créateur
- [ ] Création de cours
- [ ] Ajout sections/leçons
- [ ] Upload vidéo (Mux)
- [ ] Publication cours

#### `learning.spec.ts` - Apprentissage
- [ ] Accès au cours après achat
- [ ] Lecture vidéo
- [ ] Marquer leçon complétée
- [ ] Progression actualisée

---

## Best Practices

### 🎯 Tests stables

```typescript
// ✅ BON - Sélection par rôle/label
await page.getByRole('button', { name: /connexion/i });
await page.getByLabel(/email/i);

// ❌ MAUVAIS - Sélection par classe CSS
await page.locator('.btn-primary');
```

### ⏱️ Attentes explicites

```typescript
// ✅ BON - Attente explicite
await expect(page.getByText(/bienvenue/i)).toBeVisible({ timeout: 5000 });

// ❌ MAUVAIS - Timeout arbitraire
await page.waitForTimeout(3000);
```

### 🔒 Tests isolés

```typescript
// Chaque test est indépendant
test('test 1', async ({ page }) => {
  // Setup propre à ce test
  await page.goto('/');
  // ...
});

test('test 2', async ({ page }) => {
  // Ne dépend PAS du test 1
  await page.goto('/login');
  // ...
});
```

---

## CI/CD

### GitHub Actions (exemple)

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          NEXT_PUBLIC_APP_URL: http://localhost:3000
          # Autres variables d'env...
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Debug

### Visual Debugging

```bash
# Ouvre l'UI de débogage
npm run test:e2e:debug

# Mode trace viewer (après un run)
npx playwright show-trace trace.zip
```

### Screenshots/Vidéos

Les screenshots et vidéos sont automatiquement capturés en cas d'échec et sauvegardés dans `test-results/`.

### Console Logs

```typescript
test('debug test', async ({ page }) => {
  // Écouter les console.log du navigateur
  page.on('console', msg => console.log('Browser:', msg.text()));

  await page.goto('/');
});
```

---

## Configuration Avancée

### Ajouter Firefox/Safari

Décommenter dans `playwright.config.ts`:

```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
],
```

### Tests parallèles

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4, // 2 en CI, 4 en local
});
```

---

## FAQ

**Q: Les tests sont lents, comment accélérer ?**
R:
- Réduire le nombre de workers (`workers: 1`)
- Désactiver les vidéos (`video: 'off'`)
- Utiliser le cache navigateur

**Q: Un test est flaky (échoue aléatoirement) ?**
R:
- Augmenter les timeouts (`timeout: 60000`)
- Ajouter des `await expect().toBeVisible()` explicites
- Vérifier les animations/transitions CSS

**Q: Comment tester avec un vrai compte ?**
R: Créer un fixture avec credentials de test:
```typescript
// e2e/fixtures.ts
export const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
};
```

**Q: Comment tester Stripe en mode test ?**
R: Utiliser les cartes de test Stripe:
```typescript
await page.fill('[name="cardnumber"]', '4242 4242 4242 4242');
await page.fill('[name="exp-date"]', '12/34');
await page.fill('[name="cvc"]', '123');
```

---

## Métriques

**Objectifs MVP**:
- ✅ Coverage: 80% des flows critiques
- ✅ Temps exécution: < 5 min pour suite complète
- ✅ Flakiness: < 5% échecs aléatoires

**Flows critiques à couvrir**:
1. Auth (signup/login) - ✅ Fait
2. Parcours achat cours - ⬜ TODO
3. Création cours créateur - ⬜ TODO
4. Suivi progression étudiant - ⬜ TODO
5. Analytics créateur - ⬜ TODO
