# ⚡ Guide d'Optimisation Performance

## Objectifs MVP

| Métrique | Target | Actuel |
|----------|--------|--------|
| **First Contentful Paint** | < 1.8s | À mesurer |
| **Largest Contentful Paint** | < 2.5s | À mesurer |
| **Time to Interactive** | < 3.8s | À mesurer |
| **Cumulative Layout Shift** | < 0.1 | À mesurer |
| **Lighthouse Score** | > 90 | À mesurer |

---

## Quick Wins (Fait en 1h)

### 1. Images Next.js ✅ PRIORITÉ MAX

**Avant**:
```tsx
<img src="/course.jpg" alt="Course" />
```

**Après**:
```tsx
import Image from 'next/image';

<Image
  src="/course.jpg"
  alt="Course"
  width={800}
  height={600}
  priority  // Pour images above-the-fold
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>
```

**Gains**: -60% poids images, lazy loading auto, formats modernes (WebP)

### 2. Code Splitting

**Dynamic Imports pour composants lourds**:
```tsx
import dynamic from 'next/dynamic';

// Recharts (graphiques) - Lourd !
const AnalyticsCharts = dynamic(() => import('./AnalyticsCharts'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // Pas besoin de SSR pour charts
});

// Monaco Editor - Très lourd !
const CodeEditor = dynamic(() => import('@monaco-editor/react'), {
  loading: () => <EditorSkeleton />,
  ssr: false,
});
```

**Gains**: -40% bundle size initial

### 3. Metadata & SEO

```tsx
// app/layout.tsx
export const metadata = {
  title: 'SkillForge - Plateforme d\'apprentissage',
  description: 'Apprenez à coder avec des projets concrets',
  openGraph: {
    images: ['/og-image.jpg'],
  },
};
```

### 4. Fonts Optimization

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Afficher fallback pendant chargement
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 5. Caching Headers

```ts
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

---

## Database Optimization

### 1. Index Critiques

```sql
-- Déjà fait dans les migrations
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

-- À ajouter si lent
CREATE INDEX idx_courses_creator_status ON courses(creator_id, status);
CREATE INDEX idx_lessons_section_order ON lessons(section_id, order_number);
```

### 2. Select Optimisé

**Avant**:
```ts
const { data } = await supabase
  .from('courses')
  .select('*');  // ❌ Récupère TOUT
```

**Après**:
```ts
const { data } = await supabase
  .from('courses')
  .select('id, title, price, cover_image')  // ✅ Seulement ce qu'on utilise
  .eq('status', 'published')
  .limit(20);
```

### 3. Pagination

```ts
const ITEMS_PER_PAGE = 20;

const { data, count } = await supabase
  .from('courses')
  .select('*, count', { count: 'exact' })
  .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);
```

---

## API Routes

### 1. Response Caching

```ts
// app/api/courses/route.ts
export async function GET(req: NextRequest) {
  const courses = await getCourses();

  return NextResponse.json(courses, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### 2. Compression

```ts
// next.config.js
module.exports = {
  compress: true,  // Gzip auto
};
```

### 3. Debouncing Search

```tsx
// Recherche avec debounce
import { useDebounce } from '@/hooks/useDebounce';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);  // 500ms

useEffect(() => {
  if (debouncedSearch) {
    fetchCourses(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

## Bundle Analysis

### Analyser le bundle

```bash
# Installer
npm install -D @next/bundle-analyzer

# Configurer next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... config
});

# Analyser
ANALYZE=true npm run build
```

**Ouvre un graph interactif** montrant la taille de chaque package.

### Packages lourds à surveiller

| Package | Taille | Alternative |
|---------|--------|-------------|
| `moment.js` | 300KB | `date-fns` (20KB) |
| `lodash` | 70KB | Import spécifique `lodash/get` |
| `recharts` | 400KB | Lazy load ✅ |
| `monaco-editor` | 2MB | Lazy load ✅ |

---

## Vidéos (Mux)

### 1. Adaptive Streaming

```tsx
<video>
  <source
    src="https://stream.mux.com/{PLAYBACK_ID}.m3u8"
    type="application/x-mpegURL"
  />
</video>
```

Mux envoie automatiquement la qualité adaptée à la connexion.

### 2. Lazy Load Videos

```tsx
<video
  loading="lazy"
  preload="metadata"  // Pas "auto"
  poster="/video-thumbnail.jpg"
>
```

### 3. Mux Data Analytics

Track performance vidéo:
```tsx
import Hls from 'hls.js';
import mux from 'mux-embed';

mux.monitor('#video-element', {
  data: {
    env_key: process.env.NEXT_PUBLIC_MUX_ENV_KEY,
    video_title: 'Lesson 1',
  },
});
```

---

## Lighthouse CI

### Setup

```bash
npm install -D @lhci/cli

# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/courses'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
};

# package.json
"scripts": {
  "lighthouse": "lhci autorun"
}
```

---

## CDN

### Vercel (Recommandé pour Next.js)

✅ **Automatique**:
- Edge Network global
- Caching intelligent
- Image optimization
- Compression

### Cloudflare (Alternative)

```bash
# next.config.js
module.exports = {
  images: {
    loader: 'cloudflare',
    path: 'https://example.com/cdn-cgi/image/',
  },
};
```

---

## Monitoring Performance

### Web Vitals (Built-in Next.js)

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />  {/* Track Web Vitals */}
      </body>
    </html>
  );
}
```

### Custom Metrics

```ts
// lib/performance.ts
export function reportWebVitals(metric: any) {
  console.log(metric);

  // Envoyer à analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_label: metric.label,
    });
  }
}
```

---

## Checklist Final

### Before Deploy

- [ ] Toutes les `<img>` → `<Image>` Next.js
- [ ] Recharts/Monaco en dynamic import
- [ ] Metadata SEO sur toutes les pages
- [ ] Fonts optimisées (variable fonts)
- [ ] Cache headers configurés
- [ ] Lighthouse score > 90
- [ ] Bundle analysis fait
- [ ] No console.errors en prod
- [ ] Source maps uploadées (Sentry)

### After Deploy

- [ ] Vercel Analytics activé
- [ ] Core Web Vitals monitored
- [ ] Real User Monitoring (RUM)
- [ ] Performance budget alertes

---

## Performance Budget

| Asset Type | Budget | Actuel |
|------------|--------|--------|
| **JS (initial)** | < 200KB | ? |
| **CSS** | < 50KB | ? |
| **Images** | < 500KB/page | ? |
| **Fonts** | < 100KB | ? |
| **Total** | < 1MB | ? |

**Mesurer**:
```bash
npm run build
# Voir les stats dans le terminal
```

---

## Quick Commands

```bash
# Build production
npm run build

# Analyze bundle
ANALYZE=true npm run build

# Lighthouse audit
npm run lighthouse

# Test performance route
curl -I https://skillforge.com/courses
```

---

## Next Level (V2)

- [ ] Service Worker (PWA)
- [ ] Prefetching intelligent
- [ ] Skeleton screens partout
- [ ] Optimistic UI updates
- [ ] Redis caching (Upstash)
- [ ] Edge Functions (Vercel)
- [ ] ISR (Incremental Static Regeneration)

---

**Priorité immédiate**: Images Next.js + Code splitting = 70% des gains ! 🚀
