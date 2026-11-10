import 'server-only';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, isValidSession } from '@/lib/auth';

/**
 * Every server action starts with this. The proxy's password gate lets
 * /login and /offline through (they must load signed out), and Next will run
 * any action that page's bundle knows about — so actions check for
 * themselves rather than trusting the URL they were posted to.
 */
export async function requireSession(): Promise<void> {
  if (!isValidSession((await cookies()).get(AUTH_COOKIE)?.value)) {
    throw new Error('Sign in first.');
  }
}
