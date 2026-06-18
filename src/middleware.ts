// =============================================================================
// CARBONMIND AI — Middleware
// =============================================================================
// Route protection + security headers for all requests.
// Initialized purely with Edge-compatible authConfig to support Edge runtime.
// =============================================================================

import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const publicRoutes = ['/', '/login', '/register'];
const publicPrefixes = ['/api/auth', '/_next', '/favicon.ico'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 1. Basic CSRF check for state-changing HTTP methods
  const method = req.method;
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host') || req.nextUrl.host;
    if (origin) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF violation: origin mismatch' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        );
      }
    }
  }

  // Allow public routes and prefixes
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicPrefix = publicPrefixes.some((prefix) => pathname.startsWith(prefix));

  let response = NextResponse.next();

  if (!isPublicRoute && !isPublicPrefix) {
    // Redirect unauthenticated users to login
    if (!req.auth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      response = NextResponse.redirect(loginUrl);
    }
  }

  // 2. Security Headers injection (CSP, HSTS, X-Content-Type-Options, etc.)
  const headers = response.headers;
  
  // Strict Content Security Policy (CSP)
  // Allows self connections, images, next-specific scripts, and inline style elements
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' data: blob:; connect-src 'self' https:; font-src 'self' data:;"
  );

  // Strict-Transport-Security (HSTS)
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // Prevent MIME sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Clickjacking mitigation
  headers.set('X-Frame-Options', 'DENY');
  
  // XSS protection
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (browser icon)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
