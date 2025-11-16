import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions (reduce to 0.1 in high-traffic production)

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  // release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Server-specific configuration
  integrations: [
    // Prisma integration if using Prisma
    // new Sentry.Integrations.Prisma({ client: prisma }),
  ],

  // Before send hook
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry server event (dev):', event);
      return null;
    }

    // Sanitize PII from server events
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;

      // Remove query parameters that might contain sensitive data
      if (event.request.query_string) {
        event.request.query_string = '[REDACTED]';
      }
    }

    // Sanitize database queries
    if (event.contexts?.trace?.data) {
      const data = event.contexts.trace.data;
      if (data['db.statement']) {
        data['db.statement'] = '[REDACTED]';
      }
    }

    return event;
  },
});
