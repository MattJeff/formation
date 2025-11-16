import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,

  // Adjust performance monitoring for edge
  tracesSampleRate: 0.1, // Lower sample rate for edge due to higher volume

  // Environment
  environment: process.env.NODE_ENV,

  // Before send hook
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    return event;
  },
});
