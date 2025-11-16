# 📱 Guide Mobile Responsive

## Vue d'ensemble

**Approche**: Mobile-first avec Tailwind CSS
**Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
**Target**: 100% fonctionnel sur mobile (375px+)

---

## Breakpoints Tailwind

| Prefix | Min Width | Device |
|--------|-----------|--------|
| (default) | 0px | Mobile |
| `sm:` | 640px | Large mobile / Small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Extra large |

**Utilisation**:
```tsx
// Mobile first: default = mobile, puis override pour desktop
<div className="flex-col md:flex-row">  {/* Stack mobile, row desktop */}
<div className="text-2xl lg:text-4xl">  {/* Plus petit sur mobile */}
<div className="hidden lg:block">  {/* Masqué sur mobile */}
```

---

## Audit Checklist

### ✅ Composants Critiques

#### Header (`components/layout/Header.tsx`)
- [x] Logo visible
- [x] Menu burger pour mobile (si besoin)
- [x] Dropdown utilisateur fonctionnel
- [x] Pas de débordement horizontal

#### Landing Page (`app/page.tsx`)
- [x] Hero responsive
- [x] CTAs empilés verticalement
- [x] Features cards grid adaptative
- [x] Footer organisé en colonnes

#### Catalogue (`app/courses/CoursesClient.tsx`)
- [x] Grille cours 1 col mobile, 2-3 desktop
- [x] Filtres accessibles
- [x] Barre recherche pleine largeur

#### Course Detail (`app/courses/[id]/CourseDetailClient.tsx`)
- [ ] Cover image responsive
- [ ] Sidebar prix fixe mobile
- [ ] Liste sections scrollable

#### Checkout
- [ ] Formulaire Stripe adapté
- [ ] Validation visible
- [ ] Boutons accessibles

#### Dashboard
- [ ] Cards empilées mobile
- [ ] Graphiques responsive (recharts)
- [ ] Navigation latérale → bottom

---

## Patterns Communs

### Grid Responsive

```tsx
{/* 1 col mobile, 2 tablet, 3 desktop, 4 large */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### Flex Direction

```tsx
{/* Stack mobile, row desktop */}
<div className="flex flex-col lg:flex-row gap-4">
```

### Spacing Mobile

```tsx
{/* Moins de padding mobile */}
<div className="px-4 md:px-8 lg:px-16">
<div className="py-8 md:py-12 lg:py-24">
```

### Text Sizing

```tsx
{/* Titres plus petits mobile */}
<h1 className="text-3xl md:text-4xl lg:text-6xl">
<p className="text-sm md:text-base lg:text-lg">
```

### Hide/Show

```tsx
{/* Mobile only */}
<div className="block lg:hidden">Menu burger</div>

{/* Desktop only */}
<div className="hidden lg:block">Full menu</div>
```

---

## Tests Mobile

### Devices à tester

**Priorité 1** (must work):
- iPhone SE (375x667)
- iPhone 12/13/14 (390x844)
- Samsung Galaxy S21 (360x800)

**Priorité 2** (nice to have):
- iPad Mini (744x1133)
- iPad Pro (1024x1366)

### Chrome DevTools

1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Sélectionner device
3. Tester:
   - Scroll vertical/horizontal
   - Tap targets (min 44x44px)
   - Forms input focus
   - Modals/Dropdowns
   - Navigation

### Tests réels

```bash
# Exposer localhost sur réseau local
npm run dev -- -H 0.0.0.0

# Puis sur mobile, aller à:
http://[VOTRE-IP-LOCAL]:3000
```

---

## Common Issues & Fixes

### ❌ Débordement horizontal

**Problème**: Contenu dépasse la largeur écran

**Fix**:
```tsx
// Ajouter au layout root
<body className="overflow-x-hidden">
```

### ❌ Texte trop petit

**Problème**: Text 12px illisible sur mobile

**Fix**:
```tsx
// Minimum 14px (text-sm) sur mobile
<p className="text-sm md:text-base">
```

### ❌ Boutons trop petits

**Problème**: Tap targets < 44px

**Fix**:
```tsx
// Minimum height 44px
<button className="min-h-[44px] px-4 py-3">
```

### ❌ Images trop grandes

**Problème**: Images chargent en full size

**Fix**:
```tsx
import Image from 'next/image';

<Image
  src="/course.jpg"
  alt="Course"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>
```

### ❌ Modals/Dropdowns coupés

**Problème**: Dropdown sort de l'écran

**Fix**:
```tsx
// Utiliser Radix UI avec auto-positioning
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

<DropdownMenu.Content
  align="end"
  sideOffset={5}
>
```

---

## Performance Mobile

### Lazy Loading Images

```tsx
<Image
  loading="lazy"  // Lazy load hors viewport
  placeholder="blur"  // Blur pendant chargement
/>
```

### Code Splitting

```tsx
// Dynamic import pour composants lourds
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./Chart'), {
  loading: () => <LoadingSkeleton />,
  ssr: false,  // Pas de SSR si pas nécessaire
});
```

### Reduce Motion

```tsx
// Respecter prefers-reduced-motion
<div className="transition-transform motion-reduce:transition-none">
```

---

## Accessibility Mobile

### Touch Targets

- Minimum **44x44px**
- Espacement entre boutons **8px+**

### Font Scaling

```tsx
// Utiliser rem pour respecter user font size
<p className="text-base">  {/* = 1rem = 16px */}
```

### Focus Visible

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-primary">
```

---

## Testing Checklist

Avant de déployer, vérifier:

- [ ] Toutes les pages s'affichent correctement (375px)
- [ ] Navigation fonctionne (menu, liens)
- [ ] Forms utilisables (inputs, boutons)
- [ ] Modals/Dropdowns visibles entièrement
- [ ] Images chargent vite (< 3s)
- [ ] Pas de scroll horizontal
- [ ] Tap targets >= 44px
- [ ] Texte lisible (>= 14px)
- [ ] Vidéos responsive
- [ ] Tables scrollables horizontalement

---

## Tools

### Lighthouse (Chrome DevTools)

```bash
# Audit mobile performance
1. F12 → Lighthouse tab
2. Select "Mobile"
3. Run audit
4. Target: Score > 90
```

### Responsive Design Checker

https://responsivedesignchecker.com/

### Real Device Testing

https://www.browserstack.com/ (gratuit pour open-source)

---

## Next Steps

### V1.1 - Améliorations

- [ ] PWA (install app)
- [ ] Offline mode
- [ ] Touch gestures (swipe)
- [ ] Bottom sheet native modals

### V2 - Features Mobile

- [ ] App native (React Native)
- [ ] Push notifications
- [ ] Camera upload
- [ ] Fingerprint auth

---

## Quick Wins (30 min)

1. Ajouter `overflow-x-hidden` au body
2. Vérifier que tous les boutons ont `min-h-[44px]`
3. Remplacer `<img>` par `<Image>` Next.js
4. Ajouter `viewport` meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```
5. Test sur vrai iPhone/Android

**Fait ça et 90% des problèmes sont réglés** ✅
