// A single-password gate for deployments. Set APP_PASSWORD to turn it on;
// without it (local dev) everything stays open. The session cookie holds an
// HMAC of a fixed message keyed by the password, so changing the password
// signs every device out.
import { createHmac, timingSafeEqual } from 'node:crypto';

export const AUTH_COOKIE = 'xiaobai-session';
/** A year: this is a personal app, re-typing the password is just friction. */
export const AUTH_MAX_AGE = 60 * 60 * 24 * 365;

export function gateEnabled(): boolean {
  return Boolean(process.env.APP_PASSWORD);
}

function tokenFor(password: string): string {
  return createHmac('sha256', password).update('xiaobai-session-v1').digest('hex');
}

function sameString(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** The cookie value to set after a correct password, or null if it's wrong. */
export function sessionFor(password: string): string | null {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return null;
  const given = tokenFor(password);
  return sameString(given, tokenFor(expected)) ? given : null;
}

export function isValidSession(cookie: string | undefined): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return true;
  return Boolean(cookie) && sameString(cookie!, tokenFor(expected));
}

/** Only same-site paths, so the login form can't be used as an open redirect. */
export function safeNext(next: unknown): string {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}
