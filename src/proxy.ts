import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE, gateEnabled, isValidSession } from '@/lib/auth';

/**
 * Password gate (see lib/auth.ts). Covers pages, server actions (they POST
 * to page routes) and API routes; static assets are excluded by the matcher.
 */
export function proxy(request: NextRequest) {
  if (!gateEnabled() || request.nextUrl.pathname === '/login') return NextResponse.next();
  if (isValidSession(request.cookies.get(AUTH_COOKIE)?.value)) return NextResponse.next();

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new NextResponse('Sign in first.', { status: 401 });
  }
  const login = new URL('/login', request.url);
  const next = request.nextUrl.pathname + request.nextUrl.search;
  if (next !== '/') login.searchParams.set('next', next);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|strokes/|audio/|icon\\.svg|manifest\\.webmanifest|favicon\\.ico).*)',
  ],
};
