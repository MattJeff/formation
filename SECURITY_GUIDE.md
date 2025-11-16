# 🔒 Guide de Sécurité - SkillForge

**Date:** 2024-11-16
**Statut:** Production Ready

---

## 🎯 Vue d'Ensemble

Ce guide documente toutes les mesures de sécurité implémentées dans SkillForge pour protéger contre les vulnérabilités OWASP Top 10 et autres attaques courantes.

**Fichiers créés:**
- ✅ `/src/lib/security/rateLimit.ts` - Rate limiting
- ✅ `/src/lib/security/validation.ts` - Validation & sanitization
- ✅ `/src/middleware.ts` - Security headers
- ✅ `/src/lib/security/index.ts` - Exports centralisés

---

## 🛡️ Protections Implémentées

### 1. Rate Limiting

**Prévient:** Attaques par force brute, DDoS, spam

**Utilisation:**

```typescript
import { checkRateLimit, getClientIdentifier, RateLimitPresets } from '@/lib/security';

export async function POST(req: NextRequest) {
  // Get client IP
  const identifier = getClientIdentifier(req.headers);

  // Check rate limit (10 requests per minute by default)
  const rateLimit = checkRateLimit(identifier, RateLimitPresets.DEFAULT);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Réessayez dans quelques instants.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
          'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // ... rest of your code
}
```

**Presets disponibles:**

```typescript
RateLimitPresets.STRICT    // 5 req/min
RateLimitPresets.DEFAULT   // 10 req/min
RateLimitPresets.RELAXED   // 30 req/min
RateLimitPresets.AUTH      // 5 login attempts / 15min
RateLimitPresets.API       // 100 req/min
RateLimitPresets.UPLOAD    // 3 uploads/hour
```

**Configuration personnalisée:**

```typescript
checkRateLimit(identifier, {
  limit: 20,        // 20 requests
  window: 60000,    // per minute (en millisecondes)
});
```

---

### 2. Headers de Sécurité (Middleware)

**Prévient:** XSS, Clickjacking, MIME sniffing, etc.

**Headers appliqués automatiquement:**

| Header | Valeur | Protection |
|--------|--------|------------|
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | XSS (legacy browsers) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Information leakage |
| `Strict-Transport-Security` | `max-age=31536000` | Force HTTPS |
| `Content-Security-Policy` | (voir ci-dessous) | XSS, injection |
| `Permissions-Policy` | `camera=(), microphone=()` | Browser features |

**Content Security Policy (CSP):**

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
connect-src 'self' https://*.supabase.co https://api.stripe.com;
frame-src 'self' https://js.stripe.com;
object-src 'none';
upgrade-insecure-requests;
```

**Modification de la CSP:**

Si tu dois ajouter un domaine (ex: Google Analytics), modifie `/src/middleware.ts`:

```typescript
"script-src 'self' https://www.googletagmanager.com",
"connect-src 'self' https://www.google-analytics.com",
```

---

### 3. Validation des Inputs (Zod)

**Prévient:** Injection SQL, XSS, données invalides

**Schémas prédéfinis:**

```typescript
import { ValidationSchemas } from '@/lib/security';

// Email
const email = ValidationSchemas.email.parse('user@example.com');

// Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
const password = ValidationSchemas.password.parse('SecurePass123');

// UUID
const userId = ValidationSchemas.uuid.parse('123e4567-e89b-12d3-a456-426614174000');

// URL
const website = ValidationSchemas.url.parse('https://example.com');

// Price (0-99999.99, max 2 decimals)
const price = ValidationSchemas.price.parse(19.99);
```

**Exemple complet avec validation:**

```typescript
import { z } from 'zod';
import { ValidationSchemas } from '@/lib/security';

const courseSchema = z.object({
  title: ValidationSchemas.shortText,
  description: ValidationSchemas.longText,
  price: ValidationSchemas.price,
  instructorId: ValidationSchemas.uuid,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = courseSchema.parse(body);

    // Use validatedData (type-safe!)
    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
  }
}
```

---

### 4. Sanitization HTML

**Prévient:** XSS via contenu utilisateur

**Nettoyer du HTML:**

```typescript
import { sanitizeHTML, sanitizePlainText, escapeHTML } from '@/lib/security';

// Nettoyer du HTML (garde les tags sûrs)
const courseDescription = sanitizeHTML('<script>alert("XSS")</script><p>Hello <strong>world</strong></p>');
// Résultat: '<p>Hello <strong>world</strong></p>'

// Texte brut uniquement (supprime tous les tags)
const username = sanitizePlainText('<script>alert("XSS")</script>John Doe');
// Résultat: 'John Doe'

// Échapper le HTML (affiche les tags comme texte)
const code = escapeHTML('<div>Example</div>');
// Résultat: '&lt;div&gt;Example&lt;/div&gt;'
```

**Configuration avancée:**

```typescript
// Autoriser des tags spécifiques
const cleanHTML = sanitizeHTML(dirtyHTML, {
  ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'img'],
  ALLOWED_ATTR: ['href', 'src', 'alt'],
});

// Autoriser les iframes (pour vidéos YouTube/Vimeo)
const videoHTML = sanitizeHTML(embedCode, {
  ADD_TAGS: ['iframe'],
  ALLOWED_ATTR: ['src', 'width', 'height', 'frameborder', 'allow'],
});
```

---

### 5. Validation de Fichiers

**Prévient:** Upload de malware, déni de service

**Validation basique:**

```typescript
import { validateFileUpload, FileUploadPresets } from '@/lib/security';

const file = formData.get('file') as File;

const result = validateFileUpload(file, FileUploadPresets.AVATAR);

if (!result.valid) {
  return NextResponse.json({ error: result.error }, { status: 400 });
}

// File is safe to upload
```

**Presets disponibles:**

```typescript
FileUploadPresets.IMAGES     // JPG, PNG, WebP, GIF - max 5MB
FileUploadPresets.DOCUMENTS  // PDF, DOCX - max 10MB
FileUploadPresets.VIDEOS     // MP4, WebM, MOV - max 100MB
FileUploadPresets.AVATAR     // JPG, PNG, WebP - max 2MB
```

**Configuration personnalisée:**

```typescript
const result = validateFileUpload(file, {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png'],
  allowedExtensions: ['jpg', 'jpeg', 'png'],
});
```

---

### 6. Protection SQL Injection

**IMPORTANT:** Cette protection est un filet de sécurité. **TOUJOURS** utiliser des requêtes paramétrées.

```typescript
import { sanitizeSQLInput } from '@/lib/security';

// ⚠️ NE PAS FAIRE (vulnérable):
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

// ✅ BON (Supabase utilise des requêtes paramétrées):
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userInput); // Supabase échappe automatiquement

// 🛡️ Double protection (pour les cas legacy):
const safeInput = sanitizeSQLInput(userInput);
```

---

### 7. Validation d'URL

**Prévient:** Open redirect, XSS via URL

```typescript
import { validateURL } from '@/lib/security';

const userURL = 'javascript:alert("XSS")'; // Malveillant
const safeURL = validateURL(userURL);
// Résultat: null

const validURL = 'https://example.com';
const safeValidURL = validateURL(validURL);
// Résultat: 'https://example.com'

// Usage
if (!safeURL) {
  return NextResponse.json({ error: 'URL invalide' }, { status: 400 });
}
```

---

## 🔐 Exemples d'Utilisation par Route

### Route d'Inscription (Auth)

```typescript
import { checkRateLimit, getClientIdentifier, RateLimitPresets, ValidationSchemas } from '@/lib/security';
import { z } from 'zod';

const registerSchema = z.object({
  email: ValidationSchemas.email,
  password: ValidationSchemas.password,
  firstName: ValidationSchemas.shortText,
  lastName: ValidationSchemas.shortText,
});

export async function POST(req: NextRequest) {
  // 1. Rate limiting (5 tentatives par 15min)
  const identifier = getClientIdentifier(req.headers);
  const rateLimit = checkRateLimit(identifier, RateLimitPresets.AUTH);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
      { status: 429 }
    );
  }

  // 2. Validation
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = registerSchema.parse(body);

    // 3. Création utilisateur (Supabase gère la sécurité)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) throw error;

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### Route de Création de Cours

```typescript
import { checkRateLimit, getClientIdentifier, sanitizeHTML, ValidationSchemas } from '@/lib/security';
import { z } from 'zod';

const courseSchema = z.object({
  title: ValidationSchemas.shortText,
  description: ValidationSchemas.longText,
  price: ValidationSchemas.price,
  category: z.enum(['dev', 'design', 'business', 'marketing']),
});

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const identifier = getClientIdentifier(req.headers);
  const rateLimit = checkRateLimit(identifier, RateLimitPresets.DEFAULT);

  if (!rateLimit.success) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  // 2. Auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  // 3. Validation + sanitization
  try {
    const body = await req.json();
    const validated = courseSchema.parse(body);

    // Nettoyer le HTML de la description
    const cleanDescription = sanitizeHTML(validated.description);

    // 4. Création en base
    const { data, error } = await supabase
      .from('courses')
      .insert({
        title: validated.title,
        description: cleanDescription,
        price: validated.price,
        category: validated.category,
        creator_id: session.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, course: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    throw error;
  }
}
```

### Route d'Upload de Fichier

```typescript
import { checkRateLimit, getClientIdentifier, validateFileUpload, FileUploadPresets, RateLimitPresets } from '@/lib/security';

export async function POST(req: NextRequest) {
  // 1. Rate limiting strict pour les uploads
  const identifier = getClientIdentifier(req.headers);
  const rateLimit = checkRateLimit(identifier, RateLimitPresets.UPLOAD);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Trop d\'uploads. Limite: 3 par heure' },
      { status: 429 }
    );
  }

  // 2. Auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  // 3. Validation du fichier
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
  }

  const validation = validateFileUpload(file, FileUploadPresets.AVATAR);

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // 4. Upload vers Supabase Storage
  const fileName = `${session.user.id}-${Date.now()}.${file.name.split('.').pop()}`;
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  return NextResponse.json({ success: true, path: data.path });
}
```

---

## 🚨 Checklist Sécurité par Route API

Avant de déployer une nouvelle route API, vérifie:

- [ ] **Rate limiting** appliqué (au minimum `RateLimitPresets.DEFAULT`)
- [ ] **Authentification** vérifiée si route protégée
- [ ] **Validation** des inputs avec Zod
- [ ] **Sanitization** du HTML si contenu utilisateur
- [ ] **Validation fichiers** si upload
- [ ] **Logs** des erreurs (sans exposer de données sensibles)
- [ ] **Headers de sécurité** (automatique via middleware)
- [ ] **HTTPS** en production (Vercel le fait automatiquement)

---

## 🎯 Routes à Sécuriser en Priorité

### Critique (Must Have)

1. **Auth routes**
   - `/api/auth/signin` → `RateLimitPresets.AUTH`
   - `/api/auth/signup` → `RateLimitPresets.AUTH`
   - `/api/auth/reset-password` → `RateLimitPresets.AUTH`

2. **Payment routes**
   - `/api/checkout` → `RateLimitPresets.STRICT`
   - `/api/stripe/webhook` → Validation signature Stripe

3. **Upload routes**
   - `/api/profile/upload-avatar` → `RateLimitPresets.UPLOAD`
   - `/api/courses/upload-video` → `RateLimitPresets.UPLOAD`

### Important (Should Have)

4. **Content creation**
   - `/api/courses/create` → `RateLimitPresets.DEFAULT`
   - `/api/comments/create` → `RateLimitPresets.DEFAULT`

5. **Public API**
   - `/api/courses` → `RateLimitPresets.API`
   - `/api/search` → `RateLimitPresets.RELAXED`

---

## 🔧 Configuration Avancée

### Utiliser Redis pour le Rate Limiting (Production)

Pour une app en production avec plusieurs instances, utilise Upstash Redis:

```bash
npm install @upstash/redis @upstash/ratelimit
```

```typescript
// src/lib/security/rateLimit.production.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
});

// Usage
const { success, limit, remaining } = await ratelimit.limit(identifier);
```

### Ajouter Sentry pour Monitoring

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

---

## 📊 Tests de Sécurité

### Test Rate Limiting

```bash
# Tester le rate limit (devrait bloquer après 10 requêtes)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/test \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}' \
    && echo " - Request $i"
done
```

### Test Validation

```bash
# Tester avec des données invalides
curl -X POST http://localhost:3000/api/courses/create \
  -H "Content-Type: application/json" \
  -d '{"title": "", "price": -10}' # Devrait retourner 400
```

### Test XSS

```bash
# Tester injection XSS
curl -X POST http://localhost:3000/api/courses/create \
  -H "Content-Type: application/json" \
  -d '{"description": "<script>alert(\"XSS\")</script>"}' # Script devrait être supprimé
```

---

## 🔐 Prochaines Étapes

### Améliorations Recommandées

1. **CAPTCHA** sur formulaires publics (hCaptcha, Cloudflare Turnstile)
2. **2FA** (Two-Factor Authentication) pour les comptes
3. **Audit logs** pour actions sensibles
4. **Email verification** obligatoire
5. **IP whitelist** pour dashboard admin
6. **Rate limiting par utilisateur** (en plus de l'IP)
7. **WAF** (Web Application Firewall) - Cloudflare ou Vercel Enterprise
8. **Pen testing** avant lancement public

### Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Stripe Security:** https://stripe.com/docs/security
- **Supabase Security:** https://supabase.com/docs/guides/security
- **Next.js Security:** https://nextjs.org/docs/app/building-your-application/configuring/security-headers

---

**✅ Ta plateforme est maintenant sécurisée contre les vulnérabilités courantes !**

Pense à faire un audit de sécurité professionnel avant de vendre le MVP à 10-15k€.
