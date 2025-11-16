/**
 * Simple in-memory rate limiter
 * Pour production, utilisez Redis avec @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store rate limit data in memory
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Number of requests allowed in the time window
   * @default 10
   */
  limit?: number;

  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  window?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if a request is rate limited
 *
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 *
 * @example
 * ```ts
 * const result = checkRateLimit(req.headers.get('x-forwarded-for') || 'unknown', {
 *   limit: 10,
 *   window: 60000 // 1 minute
 * });
 *
 * if (!result.success) {
 *   return NextResponse.json(
 *     { error: 'Too many requests' },
 *     {
 *       status: 429,
 *       headers: {
 *         'X-RateLimit-Limit': result.limit.toString(),
 *         'X-RateLimit-Remaining': result.remaining.toString(),
 *         'X-RateLimit-Reset': result.reset.toString()
 *       }
 *     }
 *   );
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const limit = config.limit || 10;
  const window = config.window || 60000; // 1 minute by default
  const now = Date.now();

  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // New window or expired
    const resetTime = now + window;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    };
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Get client identifier from request
 * Tries to get real IP from headers (Vercel, Cloudflare, etc.)
 */
export function getClientIdentifier(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') || // Cloudflare
    'unknown'
  );
}

/**
 * Rate limit presets for common use cases
 */
export const RateLimitPresets = {
  /** Strict: 5 requests per minute */
  STRICT: { limit: 5, window: 60000 },

  /** Default: 10 requests per minute */
  DEFAULT: { limit: 10, window: 60000 },

  /** Relaxed: 30 requests per minute */
  RELAXED: { limit: 30, window: 60000 },

  /** Auth: 5 login attempts per 15 minutes */
  AUTH: { limit: 5, window: 15 * 60000 },

  /** API: 100 requests per minute */
  API: { limit: 100, window: 60000 },

  /** Upload: 3 uploads per hour */
  UPLOAD: { limit: 3, window: 60 * 60000 },
} as const;
