// =============================================================================
// CARBONMIND AI — Rate Limiter (Token Bucket)
// =============================================================================
// In-memory rate limiter for API routes. For production at scale,
// replace with Redis-backed implementation (e.g., @upstash/ratelimit).
// =============================================================================

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimiterConfig {
  /** Maximum tokens in the bucket */
  maxTokens: number;
  /** Tokens added per interval */
  refillRate: number;
  /** Refill interval in milliseconds */
  refillInterval: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxTokens: 100,
  refillRate: 100,
  refillInterval: 60_000, // 1 minute
};

const AI_CONFIG: RateLimiterConfig = {
  maxTokens: 10,
  refillRate: 10,
  refillInterval: 60_000, // 1 minute
};

// In-memory store — cleared on server restart
const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
const STALE_THRESHOLD = 10 * 60 * 1000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.lastRefill > STALE_THRESHOLD) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
  // Don't prevent process exit
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

/**
 * Check rate limit for a given identifier (e.g., IP address or user ID).
 * Returns true if the request is allowed, false if rate limited.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimiterConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetAt: number } {
  startCleanup();

  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry) {
    // First request — create bucket with max tokens minus 1
    store.set(identifier, { tokens: config.maxTokens - 1, lastRefill: now });
    return { allowed: true, remaining: config.maxTokens - 1, resetAt: now + config.refillInterval };
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const tokensToAdd = Math.floor(elapsed / config.refillInterval) * config.refillRate;
  entry.tokens = Math.min(config.maxTokens, entry.tokens + tokensToAdd);

  if (tokensToAdd > 0) {
    entry.lastRefill = now;
  }

  if (entry.tokens <= 0) {
    const resetAt = entry.lastRefill + config.refillInterval;
    return { allowed: false, remaining: 0, resetAt };
  }

  entry.tokens -= 1;
  store.set(identifier, entry);

  return {
    allowed: true,
    remaining: entry.tokens,
    resetAt: entry.lastRefill + config.refillInterval,
  };
}

/**
 * Rate limit check for standard API routes.
 * 100 requests per minute per identifier.
 */
export function checkApiRateLimit(identifier: string) {
  return checkRateLimit(identifier, DEFAULT_CONFIG);
}

/**
 * Rate limit check for AI-powered endpoints.
 * 10 requests per minute per identifier (more expensive).
 */
export function checkAiRateLimit(identifier: string) {
  return checkRateLimit(identifier, AI_CONFIG);
}

/**
 * Extract client IP from request headers.
 * Handles Vercel's x-forwarded-for and x-real-ip.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') ?? 'unknown';
}
