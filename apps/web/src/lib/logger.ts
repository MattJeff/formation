// ============================================
// 📝 LOGGER & ERROR TRACKING
// ============================================
// Système centralisé de logging
//
// PRODUCTION: Console + localStorage + Sentry
// DEV: Console uniquement
//
// NIVEAUX:
// - ERROR: Erreurs critiques → Sentry en production
// - WARN: Avertissements → Console uniquement
// - INFO: Informations → Console uniquement
// - DEBUG: Debug (dev uniquement)
//
// ============================================

import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  stack?: string;
  userId?: string;
  url?: string;
}

// ============================================
// 📊 STORAGE (localStorage pour MVP)
// ============================================
const MAX_LOGS = 100; // Garder les 100 derniers logs
const STORAGE_KEY = 'skillforge_logs';

class Logger {
  private isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
  }

  /**
   * Log une erreur critique
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, {
      ...context,
      stack: error?.stack,
      errorMessage: error?.message,
    });

    // Persister dans localStorage (MVP)
    if (!this.isDev && typeof window !== 'undefined') {
      this.persistLog(LogLevel.ERROR, message, context);
    }

    // Envoyer à Sentry en production
    if (!this.isDev) {
      if (error) {
        Sentry.captureException(error, {
          extra: context,
          tags: {
            component: context?.component || 'unknown',
          },
        });
      } else {
        Sentry.captureMessage(message, {
          level: 'error',
          extra: context,
        });
      }
    }
  }

  /**
   * Log un avertissement
   */
  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log une information
   */
  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log debug (dev uniquement)
   */
  debug(message: string, context?: Record<string, any>) {
    if (this.isDev) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Fonction interne de logging
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // Console output avec couleurs
    const color = this.getColor(level);
    const emoji = this.getEmoji(level);

    console[level === LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'log'](
      `%c${emoji} [${level.toUpperCase()}] ${message}`,
      `color: ${color}; font-weight: bold;`,
      context || ''
    );

    // Stack trace pour erreurs
    if (level === LogLevel.ERROR && context?.stack) {
      console.error('Stack trace:', context.stack);
    }
  }

  /**
   * Persister les logs en localStorage (MVP)
   */
  private persistLog(level: LogLevel, message: string, context?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    try {
      const logs = this.getLogs();
      const entry: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
        url: window.location.href,
      };

      logs.push(entry);

      // Garder seulement les N derniers
      if (logs.length > MAX_LOGS) {
        logs.shift();
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      // Si localStorage est plein, ignorer silencieusement
      console.error('Impossible de persister les logs:', error);
    }
  }

  /**
   * Récupérer les logs stockés
   */
  getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Vider les logs
   */
  clearLogs() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Exporter les logs (pour support/debug)
   */
  exportLogs(): string {
    const logs = this.getLogs();
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Couleurs par niveau
   */
  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return '#ef4444';
      case LogLevel.WARN:
        return '#f59e0b';
      case LogLevel.INFO:
        return '#3b82f6';
      case LogLevel.DEBUG:
        return '#8b5cf6';
    }
  }

  /**
   * Emoji par niveau
   */
  private getEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return '❌';
      case LogLevel.WARN:
        return '⚠️';
      case LogLevel.INFO:
        return 'ℹ️';
      case LogLevel.DEBUG:
        return '🔍';
    }
  }
}

// ============================================
// 🌐 ERROR BOUNDARY (React)
// ============================================

export function logReactError(error: Error, errorInfo: any) {
  logger.error('React Error Boundary', error, {
    componentStack: errorInfo?.componentStack,
  });
}

// ============================================
// 🚀 GLOBAL ERROR HANDLERS
// ============================================

export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  // Erreurs JavaScript non catchées
  window.addEventListener('error', (event) => {
    logger.error('Uncaught Error', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Promesses rejetées non gérées
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', new Error(event.reason), {
      reason: event.reason,
    });
  });
}

// ============================================
// 📤 EXPORT SINGLETON
// ============================================

export const logger = new Logger();

// Setup automatique en client-side
if (typeof window !== 'undefined') {
  setupGlobalErrorHandlers();
}
