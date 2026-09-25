'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, AUTH_MAX_AGE, safeNext, sessionFor } from '@/lib/auth';

export async function signIn(formData: FormData) {
  const next = safeNext(formData.get('next'));
  const password = formData.get('password');
  const session = typeof password === 'string' ? sessionFor(password) : null;
  if (!session) {
    // A short pause makes guessing slower.
    await new Promise((r) => setTimeout(r, 800));
    redirect(`/login?error=1${next !== '/' ? `&next=${encodeURIComponent(next)}` : ''}`);
  }
  (await cookies()).set(AUTH_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_MAX_AGE,
  });
  redirect(next);
}

export async function signOut() {
  (await cookies()).delete(AUTH_COOKIE);
  redirect('/login');
}
