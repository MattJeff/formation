# 🔍 Sentry Setup - Complete Guide

## 📅 Date: 2025-11-16
## ✅ Status: CONFIGURED - Needs DSN

---

## 🎯 Ce qui a été fait

### 1. **Installation** ✅
```bash
npm install @sentry/nextjs
```
- Package: `@sentry/nextjs` (dernière version)
- Bundle size: ~50KB gzipped

### 2. **Configuration Files** ✅

#### **Client Configuration** (`sentry.client.config.ts`)
```typescript
- Performance monitoring: 100% transactions
- Session replay: 100% errors, 10% sessions
- PII sanitization (cookies, headers removed)
- Disabled in development
```

#### **Server Configuration** (`sentry.server.config.ts`)
```typescript
- Server-side error tracking
- Database query sanitization
- PII removal (cookies, headers, query params)
- Disabled in development
```

#### **Edge Configuration** (`sentry.edge.config.ts`)
```typescript
- Optimized for edge runtime
- Lower sample rate (10% for performance)
- Disabled in development
```

### 3. **Next.js Integration** ✅

#### **next.config.js**
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
});
```

**Features:**
- Automatic source map upload
- Tunnel route pour bypass ad-blockers
- Source maps cachés en production
- Logs Sentry désactivés dans build

### 4. **Error Boundary Integration** ✅

#### **ErrorBoundary.tsx**
```typescript
import * as Sentry from '@sentry/nextjs';

componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // Custom logger
  logReactError(error, errorInfo);

  // Sentry (production only)
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }
}
```

**Benefits:**
- Dual logging (custom + Sentry)
- React component stack included
- Production-only sending

### 5. **Logger Integration** ✅

#### **lib/logger.ts**
```typescript
error(message: string, error?: Error, context?: Record<string, any>) {
  // Console logging
  this.log(LogLevel.ERROR, message, { ...context, stack: error?.stack });

  // localStorage persistence (MVP)
  if (!this.isDev && typeof window !== 'undefined') {
    this.persistLog(LogLevel.ERROR, message, context);
  }

  // Sentry (production only)
  if (!this.isDev) {
    if (error) {
      Sentry.captureException(error, {
        extra: context,
        tags: { component: context?.component || 'unknown' },
      });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: context,
      });
    }
  }
}
```

**Triple logging:**
1. Console (always)
2. localStorage (production)
3. Sentry (production)

---

## 🚀 Setup Instructions

### Step 1: Create Sentry Account
1. Go to https://sentry.io
2. Sign up (free tier: 5,000 errors/month)
3. Create a new project
   - Platform: **Next.js**
   - Project name: `skillforge-web` (ou votre choix)
   - Team: Default

### Step 2: Get Your DSN
After project creation, you'll see:
```
https://[KEY]@[ORG].ingest.sentry.io/[PROJECT_ID]
```

**Copy this!** C'est votre DSN.

### Step 3: Create Auth Token
1. Go to https://sentry.io/settings/account/api/auth-tokens/
2. Click "Create New Token"
3. Scopes needed:
   - ✅ `project:releases`
   - ✅ `org:read`
4. Name: `SkillForge CI/CD`
5. Copy the token (shown once!)

### Step 4: Configure Environment Variables

#### **Local Development** (`.env.local`)
```bash
# Sentry DSN (same for client and server in most cases)
NEXT_PUBLIC_SENTRY_DSN=https://[KEY]@[ORG].ingest.sentry.io/[PROJECT_ID]
SENTRY_DSN=https://[KEY]@[ORG].ingest.sentry.io/[PROJECT_ID]

# Sentry Project Info
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=skillforge-web

# Auth Token (for source maps upload)
SENTRY_AUTH_TOKEN=your_token_here
```

#### **Production** (Vercel/Other)
Add these same variables to your deployment platform:
- Vercel: Project Settings → Environment Variables
- Railway: Variables tab
- Others: Platform-specific config

### Step 5: Test Sentry

#### **Test in Development**
```typescript
// In any component
import * as Sentry from '@sentry/nextjs';

// This will NOT send (dev mode disabled)
Sentry.captureMessage('Test from dev');
```

#### **Test in Production Build**
```bash
npm run build
npm run start

# Then trigger an error in the app
# Check Sentry dashboard at https://sentry.io
```

---

## 📊 Features Enabled

### ✅ Error Tracking
- JavaScript errors (client)
- API errors (server)
- React component errors (ErrorBoundary)
- Unhandled promise rejections
- Network failures

### ✅ Performance Monitoring
- Page load times
- API response times
- Database query times (if configured)
- Core Web Vitals (LCP, FID, CLS)

### ✅ Session Replay
- **On errors**: 100% (replay 30s before error)
- **Random sessions**: 10% (for UX insights)
- **Privacy**: All text masked, media blocked

### ✅ Breadcrumbs
- Console logs
- Network requests
- DOM events
- Navigation changes
- User interactions

---

## 🔒 Privacy & Security

### Data Sanitized

#### **Removed Automatically**:
- Cookies
- Authorization headers
- Query parameters with sensitive data
- Database queries (shown as `[REDACTED]`)
- Request bodies (passwords, tokens)

#### **Custom Sanitization** (in `beforeSend`):
```typescript
beforeSend(event) {
  // Remove cookies
  if (event.request) {
    delete event.request.cookies;
    delete event.request.headers;
  }

  // Sanitize DB queries
  if (event.contexts?.trace?.data?.['db.statement']) {
    event.contexts.trace.data['db.statement'] = '[REDACTED]';
  }

  return event;
}
```

### Session Replay Privacy
```typescript
Sentry.replayIntegration({
  maskAllText: true,      // Mask all text content
  blockAllMedia: true,    // Block images/videos
})
```

---

## 📈 Monitoring Dashboard

### Sentry Dashboard Sections

#### **Issues**
- Real-time errors grouped by type
- Stack traces with source maps
- Breadcrumb trail before error
- User impact (how many users affected)

#### **Performance**
- Transaction summaries
- Slow endpoints
- Database query performance
- Frontend vitals

#### **Replays**
- Video replay of user sessions
- Error replays (30s before crash)
- Console logs during session

#### **Releases**
- Track errors by release version
- Regression detection
- Deploy notifications

---

## 🚨 Alerts Configuration

### Recommended Alerts

1. **High Error Rate**
   - Trigger: >10 errors in 1 minute
   - Notification: Email + Slack

2. **New Issue**
   - Trigger: First time error appears
   - Notification: Email

3. **Performance Degradation**
   - Trigger: Page load >3s for >50 users
   - Notification: Email

### Setup Alerts
1. Go to Sentry → Alerts
2. Click "Create Alert Rule"
3. Choose conditions
4. Add notification channel (Email/Slack/Discord)

---

## 🔧 Advanced Configuration

### Custom Context

Add user context:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});
```

### Custom Tags
```typescript
Sentry.setTag('page', 'checkout');
Sentry.setTag('environment', 'production');
```

### Transactions (Performance)
```typescript
const transaction = Sentry.startTransaction({
  name: 'Checkout Flow',
  op: 'payment',
});

// ... code ...

transaction.finish();
```

---

## 📊 Quota Management

### Free Tier (Default)
- **Events**: 5,000 errors/month
- **Performance**: 10,000 transactions/month
- **Replays**: 50 replays/month
- **Retention**: 30 days

### Optimization Tips

1. **Reduce Sample Rates** (if quota exceeded)
```typescript
// In sentry.client.config.ts
tracesSampleRate: 0.1,  // Only 10% transactions
replaysSessionSampleRate: 0.01,  // Only 1% sessions
```

2. **Filter Noisy Errors**
```typescript
ignoreErrors: [
  'ResizeObserver loop limit exceeded',
  'Non-Error promise rejection captured',
],
```

3. **Use Environments**
```typescript
// Only production events count towards quota
environment: process.env.NODE_ENV,
```

---

## ✅ Checklist

### Configuration
- [x] Sentry package installed
- [x] Client config created
- [x] Server config created
- [x] Edge config created
- [x] next.config.js updated
- [x] ErrorBoundary integrated
- [x] Logger integrated
- [x] Privacy measures implemented

### Account Setup (TO DO)
- [ ] Create Sentry account
- [ ] Create project
- [ ] Get DSN
- [ ] Create auth token
- [ ] Add env variables (local)
- [ ] Add env variables (production)
- [ ] Test error tracking
- [ ] Configure alerts

---

## 🎯 Next Steps

### Immediate (Before Production)
1. **Create Sentry account** → Get DSN
2. **Add env variables** → .env.local + Vercel
3. **Test error tracking** → Trigger test error
4. **Configure alerts** → Email notifications

### Post-Launch
1. Monitor error rates daily
2. Set up Slack integration
3. Create custom dashboards
4. Add performance budgets
5. Review session replays

---

## 📝 Environment Variables Template

Copy this to your `.env.local`:

```bash
# ============================================
# SENTRY MONITORING
# ============================================

# DSN (get from https://sentry.io)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=

# Project info
SENTRY_ORG=
SENTRY_PROJECT=

# Auth token (for source maps)
SENTRY_AUTH_TOKEN=
```

---

## 🚀 Quick Start Commands

```bash
# Test build with Sentry
npm run build

# Start production server
npm run start

# Verify Sentry in browser console
# Should see: [Sentry] SDK initialized
```

---

## ✨ Summary

**Sentry est configuré et prêt !** 🎉

Il ne manque que:
1. Créer compte Sentry (5 min)
2. Copier DSN dans .env (1 min)
3. Deploy et tester (5 min)

**Total setup time: 10 minutes** pour un monitoring production-grade !

**Impact:**
- 🔍 Visibilité complète des erreurs
- 📊 Performance monitoring
- 🎥 Session replays sur erreurs
- 🚨 Alertes automatiques
- 📈 Tracking des déploiements

**MVP Production-Ready avec Sentry** 🚀
