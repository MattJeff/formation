# 🔭 Setup Sentry (Monitoring Erreurs)

## Pourquoi Sentry ?

- **Tracking erreurs** en temps réel (frontend + backend)
- **Performance monitoring** (temps de chargement, API calls)
- **Release tracking** (associer erreurs à des versions)
- **User context** (qui a eu l'erreur, quand, où)
- **Alertes** (email/Slack quand erreur critique)

**Plan gratuit**: 5k événements/mois (suffisant pour MVP)

---

## Installation (5 minutes)

### 1. Créer compte Sentry

1. Aller sur https://sentry.io/signup/
2. Créer un projet "Next.js"
3. Copier le `DSN` (Data Source Name)

### 2. Installer SDK

```bash
npm install --save @sentry/nextjs
```

### 3. Configuration automatique

```bash
npx @sentry/wizard@latest -i nextjs
```

Le wizard va créer:
- `sentry.client.config.ts` - Config frontend
- `sentry.server.config.ts` - Config backend
- `sentry.edge.config.ts` - Config Edge runtime
- `next.config.js` - Ajout plugin Sentry

### 4. Variables d'environnement

Ajouter dans `.env.local`:

```env
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx  # Pour upload source maps
SENTRY_ORG=votre-org
SENTRY_PROJECT=votre-projet
```

⚠️ Ne JAMAIS commit le `SENTRY_AUTH_TOKEN` !

---

## Configuration Minimale

### `sentry.client.config.ts`

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Env (production, staging, development)
  environment: process.env.NODE_ENV,

  // Sample rate pour erreurs (100% = toutes)
  tracesSampleRate: 1.0,

  // Sample rate pour performance (10% = 1 sur 10)
  replaysSessionSampleRate: 0.1,

  // Capture 100% des sessions avec erreur
  replaysOnErrorSampleRate: 1.0,

  // Intégrations
  integrations: [
    new Sentry.Replay({
      maskAllText: true, // Masquer texte sensible
      blockAllMedia: true, // Bloquer images
    }),
  ],
});
```

### `sentry.server.config.ts`

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## Utilisation

### Erreurs automatiques

✅ Déjà capturées automatiquement:
- Erreurs JavaScript non catchées
- Promesses rejetées
- Erreurs API routes
- Erreurs React (via Error Boundary)

### Erreurs manuelles

```typescript
import * as Sentry from "@sentry/nextjs";

// Capturer une erreur
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}

// Message custom
Sentry.captureMessage("Something went wrong!", "error");
```

### Contexte utilisateur

```typescript
// Associer l'utilisateur aux erreurs
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: `${user.first_name} ${user.last_name}`,
});

// Supprimer le contexte (logout)
Sentry.setUser(null);
```

### Tags & Context

```typescript
// Tags pour filtrer dans Sentry
Sentry.setTag("page", "checkout");
Sentry.setTag("payment_method", "stripe");

// Context additionnel
Sentry.setContext("payment", {
  courseId: "abc-123",
  amount: 49.99,
  currency: "EUR",
});
```

---

## Intégration avec notre logger.ts

Remplacer dans `lib/logger.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

class Logger {
  error(message: string, error?: Error, context?: Record<string, any>) {
    // Console log
    this.log(LogLevel.ERROR, message, context);

    // Envoyer à Sentry en production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error || new Error(message), {
        extra: context,
      });
    }
  }
}
```

---

## Error Boundary avec Sentry

Modifier `components/ErrorBoundary.tsx`:

```typescript
import * as Sentry from "@sentry/nextjs";

componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // Log à Sentry
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack,
      },
    },
  });

  // Notre logger
  logReactError(error, errorInfo);
}
```

---

## Performance Monitoring

```typescript
// Mesurer une opération
const transaction = Sentry.startTransaction({
  name: "Create Course",
  op: "course.create",
});

try {
  await createCourse(data);
  transaction.setStatus("ok");
} catch (error) {
  transaction.setStatus("unknown_error");
  throw error;
} finally {
  transaction.finish();
}
```

---

## Source Maps

Pour voir le code source exact de l'erreur:

```bash
# Upload automatique lors du build
npm run build

# Manuel
npx @sentry/cli sourcemaps upload \
  --org=votre-org \
  --project=votre-projet \
  .next/static/chunks
```

⚠️ Nécessite `SENTRY_AUTH_TOKEN` dans `.env.local`

---

## Alertes

1. Aller dans Sentry → Alerts
2. Créer une règle:
   - "Quand une erreur apparaît pour la première fois"
   - "Quand > 10 erreurs en 1 heure"
3. Configurer notification (email, Slack, Discord)

---

## Release Tracking

```bash
# Créer une release
export SENTRY_RELEASE=$(git rev-parse HEAD)

npx @sentry/cli releases new $SENTRY_RELEASE
npx @sentry/cli releases set-commits $SENTRY_RELEASE --auto
npx @sentry/cli releases finalize $SENTRY_RELEASE
```

Ou automatiquement dans CI/CD.

---

## Dashboard Sentry

Métriques à surveiller:
- **Error rate** par page
- **Most common errors**
- **Users affected**
- **Browser distribution**
- **Page load performance**

---

## Alternatives

| Service | Prix Gratuit | Points forts |
|---------|--------------|--------------|
| **Sentry** | 5k events/mois | Le plus complet |
| **LogRocket** | 1k sessions/mois | Replay vidéo superbe |
| **Rollbar** | 5k events/mois | Très simple |
| **Bugsnag** | Limité | Bonne intégration mobile |

---

## Checklist Go-Live

- [ ] Compte Sentry créé
- [ ] SDK installé et configuré
- [ ] DSN dans variables d'env production
- [ ] Source maps uploadés
- [ ] Alertes configurées
- [ ] Error Boundary ajouté
- [ ] User context setté après login
- [ ] Release tracking en CI/CD

---

## Migration depuis notre logger.ts

**Étape 1**: Installer Sentry (ci-dessus)

**Étape 2**: Modifier `lib/logger.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

error(message: string, error?: Error, context?: Record<string, any>) {
  // Keep console log
  this.log(LogLevel.ERROR, message, context);

  // Send to Sentry
  Sentry.captureException(error || new Error(message), {
    extra: context,
  });
}
```

**Étape 3**: Wrapper Error Boundary

**Étape 4**: Tester en production

**C'est tout !** Notre code actuel continue de fonctionner, Sentry s'ajoute en plus.
