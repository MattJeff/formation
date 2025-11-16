'use client';

/**
 * ============================================
 * 🛡️ ERROR BOUNDARY
 * ============================================
 * Attrape les erreurs React et affiche un fallback UI
 * Intégré avec Sentry pour le monitoring production
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { logReactError } from '@/lib/logger';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur dans notre système custom
    logReactError(error, errorInfo);

    // Envoyer à Sentry si en production
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

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center shadow-lg">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-500/10 p-6">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
            </div>

            <h1 className="mb-4 text-2xl font-bold">Oups, une erreur est survenue</h1>

            <p className="mb-6 text-muted-foreground">
              Nous sommes désolés, quelque chose s'est mal passé. Notre équipe a été notifiée et travaille à résoudre le problème.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-700">
                  Détails de l'erreur (dev)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-red-50 p-4 text-xs text-red-900">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </button>

              <a
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 font-semibold hover:bg-accent transition-colors"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
