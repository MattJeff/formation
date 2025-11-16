// ============================================
// 🛠️ API HELPERS & MIDDLEWARE
// ============================================
// Fonctions utilitaires pour les routes API Next.js
//
// FONCTIONNALITÉS:
// - Rate limiting automatique
// - Gestion erreurs standardisée
// - Validation méthodes HTTP
// - Headers sécurité
//
// DEBUGGING:
// - Logs préfixés: [API HELPER]
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getClientIP, rateLimitByIP, rateLimitByUser, RateLimitConfig } from './rate-limit';

// ============================================
// 📊 TYPES
// ============================================

export interface APIHandlerOptions {
  /**
   * Méthodes HTTP autorisées (ex: ['GET', 'POST'])
   */
  methods?: string[];

  /**
   * Rate limiting activé (défaut: true)
   */
  rateLimit?: boolean;

  /**
   * Config rate limit custom
   */
  rateLimitConfig?: RateLimitConfig;

  /**
   * Authentification requise
   */
  requireAuth?: boolean;

  /**
   * User ID pour rate limit par user (si requireAuth = true)
   */
  userId?: string;
}

// ============================================
// 🔧 API HANDLER WRAPPER
// ============================================

/**
 * Wrapper pour routes API avec rate limiting et sécurité
 *
 * @example
 * export async function GET(req: NextRequest) {
 *   return withAPIHandler(req, { methods: ['GET'] }, async () => {
 *     return NextResponse.json({ data: 'hello' });
 *   });
 * }
 */
export async function withAPIHandler(
  req: NextRequest,
  options: APIHandlerOptions,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // ============================================
    // 1️⃣ VALIDATION MÉTHODE HTTP
    // ============================================
    if (options.methods && !options.methods.includes(req.method)) {
      return NextResponse.json(
        { error: `Méthode ${req.method} non autorisée` },
        { status: 405 }
      );
    }

    // ============================================
    // 2️⃣ RATE LIMITING
    // ============================================
    if (options.rateLimit !== false) {
      let rateLimitResult;

      // Rate limit par user si authentifié
      if (options.requireAuth && options.userId) {
        rateLimitResult = await rateLimitByUser(options.userId, options.rateLimitConfig);
      } else {
        // Rate limit par IP sinon
        const ip = getClientIP(req);
        rateLimitResult = await rateLimitByIP(ip, options.rateLimitConfig);
      }

      // Ajouter headers rate limit
      const headers = new Headers();
      headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

      // Bloquer si limite atteinte
      if (!rateLimitResult.success) {
        return NextResponse.json(
          {
            error: 'Trop de requêtes. Veuillez réessayer plus tard.',
            retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers,
          }
        );
      }

      // Continuer avec headers rate limit
      const response = await handler();
      rateLimitResult && headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // ============================================
    // 3️⃣ EXÉCUTER HANDLER
    // ============================================
    return await handler();

  } catch (error: any) {
    console.error('❌ [API HELPER] Erreur non gérée:', error);

    return NextResponse.json(
      {
        error: 'Erreur serveur interne',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// ============================================
// 🎯 HELPERS SPÉCIFIQUES
// ============================================

/**
 * Wrapper pour routes publiques (rate limit par IP)
 */
export async function withPublicAPI(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  methods: string[] = ['GET']
): Promise<NextResponse> {
  return withAPIHandler(
    req,
    {
      methods,
      rateLimit: true,
      requireAuth: false,
    },
    handler
  );
}

/**
 * Wrapper pour routes authentifiées (rate limit par user)
 */
export async function withAuthAPI(
  req: NextRequest,
  userId: string,
  handler: () => Promise<NextResponse>,
  methods: string[] = ['GET', 'POST']
): Promise<NextResponse> {
  return withAPIHandler(
    req,
    {
      methods,
      rateLimit: true,
      requireAuth: true,
      userId,
    },
    handler
  );
}

/**
 * Wrapper pour actions sensibles (rate limit strict)
 */
export async function withStrictAPI(
  req: NextRequest,
  identifier: string,
  handler: () => Promise<NextResponse>,
  methods: string[] = ['POST']
): Promise<NextResponse> {
  return withAPIHandler(
    req,
    {
      methods,
      rateLimit: true,
      rateLimitConfig: {
        interval: 60 * 1000,
        uniqueTokenPerInterval: 10, // Très restrictif
      },
    },
    handler
  );
}
