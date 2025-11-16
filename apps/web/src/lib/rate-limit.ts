// ============================================
// 🛡️ RATE LIMITING MIDDLEWARE
// ============================================
// Protection contre les abus API avec rate limiting
//
// VERSION MVP: In-memory (Map)
// TODO V2: Migrer vers Upstash Redis pour scaling multi-instances
//
// LIMITES PAR DÉFAUT:
// - API publiques: 60 req/min par IP
// - API auth: 120 req/min par user
// - Webhooks: 300 req/min
//
// DEBUGGING:
// - Logs préfixés: [RATE LIMIT]
// ============================================

export interface RateLimitConfig {
  interval: number; // Fenêtre temps en ms
  uniqueTokenPerInterval: number; // Nombre max de requêtes
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Timestamp reset
}

// ============================================
// 📊 STORAGE IN-MEMORY (MVP)
// ============================================
// Structure: Map<token, { count: number, resetAt: number }>
const requestCounts = new Map<string, { count: number; resetAt: number }>();

// Nettoyage auto des entrées expirées toutes les minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of requestCounts.entries()) {
    if (data.resetAt < now) {
      requestCounts.delete(token);
    }
  }
}, 60 * 1000);

// ============================================
// 🔧 FONCTION PRINCIPALE
// ============================================

export async function rateLimit(
  token: string,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 60, // 60 requêtes
  }
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - config.interval;

  // Récupérer ou créer l'entrée
  let tokenData = requestCounts.get(token);

  // Si pas d'entrée ou fenêtre expirée, reset
  if (!tokenData || tokenData.resetAt < now) {
    const resetAt = now + config.interval;
    tokenData = {
      count: 0,
      resetAt,
    };
    requestCounts.set(token, tokenData);
  }

  // Incrémenter le compteur
  tokenData.count++;

  const remaining = Math.max(0, config.uniqueTokenPerInterval - tokenData.count);
  const success = tokenData.count <= config.uniqueTokenPerInterval;

  if (!success) {
    console.warn(
      `⚠️ [RATE LIMIT] Limite atteinte pour "${token}" - ${tokenData.count}/${config.uniqueTokenPerInterval}`
    );
  }

  return {
    success,
    limit: config.uniqueTokenPerInterval,
    remaining,
    reset: tokenData.resetAt,
  };
}

// ============================================
// 🎯 HELPERS SPÉCIFIQUES
// ============================================

/**
 * Rate limit par IP (pour routes publiques)
 */
export async function rateLimitByIP(
  ip: string,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  return rateLimit(`ip:${ip}`, config);
}

/**
 * Rate limit par user ID (pour routes auth)
 */
export async function rateLimitByUser(
  userId: string,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  return rateLimit(
    `user:${userId}`,
    config || {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 120, // Plus permissif pour users auth
    }
  );
}

/**
 * Rate limit strict pour actions sensibles (paiements, emails)
 */
export async function rateLimitStrict(
  identifier: string,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  return rateLimit(
    `strict:${identifier}`,
    config || {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 10, // Très restrictif
    }
  );
}

/**
 * Récupère l'IP du client depuis les headers Next.js
 */
export function getClientIP(request: Request): string {
  // Chercher dans les headers standards
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback
  return 'unknown';
}
