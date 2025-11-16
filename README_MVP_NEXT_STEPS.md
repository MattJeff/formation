# 🚀 SkillForge MVP - Next Steps

## 📋 État Actuel

✅ **Blockers MVP résolus aujourd'hui** (2025-11-16):

1. ✅ **Features partielles masquées** - Sandbox/Community en "Coming Soon"
2. ✅ **Rate limiting implémenté** - Protection API contre abus
3. ✅ **Tests E2E setup** - Playwright avec 15 tests (auth, catalogue)
4. ✅ **Error monitoring** - Logger centralisé + Error Boundary
5. ✅ **Mobile responsive guide** - Documentation complète
6. ✅ **Performance optimization guide** - Best practices documentées

**Résultat**: MVP technique solide, prêt pour finalisation.

---

## 🎯 Prochaines Étapes (1 Semaine)

### Jour 1-2: Performance & Images

```bash
# TODO: Remplacer toutes les <img> par Next.js <Image>
# Fichiers concernés:
find apps/web/src -name "*.tsx" | xargs grep "<img"

# Quick wins:
1. apps/web/src/app/courses/CoursesClient.tsx
2. apps/web/src/app/courses/[id]/CourseDetailClient.tsx
3. apps/web/src/app/dashboard/DashboardClient.tsx
4. apps/web/src/app/creator/courses/new/NewCourseClient.tsx
```

**Pattern de remplacement**:
```tsx
// Avant
<img src={course.cover_image} alt={course.title} />

// Après
<Image
  src={course.cover_image || '/placeholder.jpg'}
  alt={course.title}
  width={400}
  height={300}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

**Lazy load composants lourds**:
```tsx
// apps/web/src/app/creator/analytics/page.tsx
import dynamic from 'next/dynamic';

const AnalyticsCharts = dynamic(() => import('./AnalyticsCharts'), {
  loading: () => <div>Chargement...</div>,
  ssr: false,
});
```

---

### Jour 3: Tests E2E Checkout

```bash
# Créer: apps/web/e2e/checkout.spec.ts
```

**Test Flow**:
```typescript
test('Flow complet achat cours', async ({ page }) => {
  // 1. Aller sur page cours
  await page.goto('/courses/[COURSE_ID]');

  // 2. Cliquer "Acheter"
  await page.click('[data-testid="buy-button"]');

  // 3. Remplir carte test Stripe
  await page.fill('[name="cardnumber"]', '4242 4242 4242 4242');
  await page.fill('[name="exp-date"]', '12/34');
  await page.fill('[name="cvc"]', '123');

  // 4. Valider
  await page.click('[type="submit"]');

  // 5. Vérifier redirection success
  await expect(page).toHaveURL(/checkout\/success/);
});
```

---

### Jour 4: Mobile Responsive Audit

```bash
# Tester chaque composant sur mobile (375px)
npm run dev

# Puis dans Chrome DevTools:
# F12 → Toggle Device (Ctrl+Shift+M) → iPhone SE
```

**Checklist**:
- [ ] Header - Menu burger fonctionnel
- [ ] Landing - Hero responsive, CTAs empilés
- [ ] Catalogue - Grille 1 col mobile, search visible
- [ ] Course detail - Cover image responsive, sidebar bottom
- [ ] Checkout - Form Stripe adapté
- [ ] Dashboard - Stats cards empilées, graphiques responsive
- [ ] Analytics - Tableaux scrollables horizontalement

**Fixes communs**:
```tsx
// Grille responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Stack mobile, row desktop
<div className="flex flex-col lg:flex-row gap-4">

// Text responsive
<h1 className="text-3xl md:text-4xl lg:text-6xl">

// Boutons min 44px tap target
<button className="min-h-[44px] px-4 py-3">
```

---

### Jour 5: SEO & Metadata

```bash
# Ajouter metadata sur chaque page
```

**Pattern**:
```tsx
// app/courses/page.tsx
export const metadata = {
  title: 'Catalogue de Cours | SkillForge',
  description: 'Découvrez nos formations en développement web, design, et plus',
  openGraph: {
    title: 'Catalogue SkillForge',
    description: 'Formations en ligne de qualité',
    images: ['/og-courses.jpg'],
  },
};
```

**Sitemap**:
```tsx
// app/sitemap.ts
export default function sitemap() {
  return [
    { url: 'https://skillforge.com', lastModified: new Date() },
    { url: 'https://skillforge.com/courses', lastModified: new Date() },
    // ... dynamique depuis DB
  ];
}
```

**robots.txt**:
```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://skillforge.com/sitemap.xml
```

---

### Jour 6: Lighthouse Audit

```bash
# Build production
npm run build
npm run start

# Puis Chrome DevTools:
# F12 → Lighthouse → Generate Report
```

**Targets**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

**Fixes communs**:
- [ ] Images alt text manquants
- [ ] Contraste couleurs insuffisant
- [ ] Meta description manquante
- [ ] HTTPS forced
- [ ] Tap targets trop petits

---

### Jour 7: Deploy & Monitoring

#### Setup Vercel

```bash
# 1. Connecter GitHub repo
vercel --prod

# 2. Variables d'environnement
# Copier toutes les vars de .env.local dans Vercel Dashboard

# 3. Domain custom (optionnel)
# Vercel Dashboard → Domains → Add

# 4. Analytics
# Vercel Dashboard → Analytics → Enable
```

#### Setup Sentry (Optionnel jour 7, peut attendre)

```bash
# Suivre: apps/web/SENTRY_SETUP.md
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 📊 Commandes Utiles

```bash
# Développement
npm run dev                # Démarrer serveur dev

# Tests
npm run test:e2e           # Tests E2E headless
npm run test:e2e:ui        # UI interactive
npm run test:e2e:debug     # Mode debug

# Production
npm run build              # Build optimisé
npm run start              # Serveur production local
ANALYZE=true npm run build # Analyser bundle

# Qualité
npm run lint               # Linter
npm run lighthouse         # Lighthouse CI (à créer)
```

---

## 📚 Documentation Créée

| Fichier | Description |
|---------|-------------|
| `RATE_LIMITING_GUIDE.md` | Setup rate limiting, migration Upstash |
| `TESTING_GUIDE.md` | Tests E2E Playwright, best practices |
| `SENTRY_SETUP.md` | Migration Sentry en 5 min |
| `MOBILE_RESPONSIVE_GUIDE.md` | Patterns responsive, checklist |
| `PERFORMANCE_OPTIMIZATION.md` | Optimisations images, bundle, DB |
| `MVP_COMPLETION_SUMMARY.md` | Récap complet features + next steps |

**Tous dans**: `apps/web/`

---

## 🔥 Quick Wins (Faire en premier)

1. **Images Next.js** (2h) - Gain massif performance
2. **Code splitting Recharts** (30min) - -40% bundle
3. **Mobile audit Header/Landing** (1h) - UX critique
4. **Test E2E checkout** (1h) - Flow le plus important
5. **Metadata SEO 5 pages principales** (30min) - Discoverability

**= 5h de travail pour 80% des gains** 🎯

---

## 🚨 Avant de Déployer

### Checklist Technique
- [ ] `npm run build` réussit sans erreurs
- [ ] Tests E2E passent (`npm run test:e2e`)
- [ ] Lighthouse score > 90 (toutes catégories)
- [ ] Mobile testé sur vrai device (iPhone/Android)
- [ ] No `console.log` / `console.error` en prod
- [ ] Rate limiting activé sur routes critiques
- [ ] Error boundary wrappé autour de l'app
- [ ] Images optimisées (Next.js `<Image>`)

### Checklist Business
- [ ] Stripe en mode LIVE (clés production)
- [ ] Emails Resend configurés (sender vérifié)
- [ ] Pages légales à jour (CGV, confidentialité)
- [ ] Support email configuré
- [ ] Politique remboursements claire
- [ ] FAQ basique

### Checklist Données
- [ ] Migrations Supabase appliquées (production)
- [ ] Backup automatique activé
- [ ] RLS policies vérifiées
- [ ] Indexes critiques créés
- [ ] Stripe webhooks endpoint configuré

---

## 🎯 Objectif Final

**Date target launch**: [À DÉFINIR]

**Milestones**:
- [ ] Jour 1-2: Performance ✅
- [ ] Jour 3: Tests checkout ✅
- [ ] Jour 4: Mobile audit ✅
- [ ] Jour 5: SEO ✅
- [ ] Jour 6: Lighthouse ✅
- [ ] Jour 7: Deploy ✅

**Success Criteria**:
- 5 beta users peuvent s'inscrire, acheter, suivre un cours
- Aucun bug bloquant
- Performance > 90 Lighthouse
- Mobile UX impeccable

---

## 💬 Besoin d'Aide ?

**Documentation**:
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- Playwright: https://playwright.dev/docs
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs

**Fichiers importants**:
- `apps/web/src/lib/rate-limit.ts` - Rate limiting
- `apps/web/src/lib/logger.ts` - Error logging
- `apps/web/src/components/ErrorBoundary.tsx` - Error handling
- `apps/web/playwright.config.ts` - Tests E2E

**Guides**:
- Tous les `*.md` dans `apps/web/`

---

**Bonne chance pour le launch ! 🚀**

*Dernière mise à jour: 2025-11-16*
