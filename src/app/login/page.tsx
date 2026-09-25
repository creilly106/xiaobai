import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/actions/auth';
import { gateEnabled, safeNext } from '@/lib/auth';

export const metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const params = await searchParams;
  const next = safeNext(Array.isArray(params.next) ? params.next[0] : params.next);
  if (!gateEnabled()) redirect(next);
  const failed = params.error === '1';

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col px-4 py-20">
      <div className="text-center">
        <div lang="zh-Hans" className="text-5xl font-medium">
          小白
        </div>
        <h1 className="mt-2 text-lg font-semibold">Sign in to Xiaobai</h1>
      </div>
      <Card className="mt-6">
        <CardContent className="py-5">
          <form action={signIn} className="flex flex-col gap-3">
            <input type="hidden" name="next" value={next} />
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              aria-invalid={failed || undefined}
              aria-describedby={failed ? 'password-error' : undefined}
            />
            {failed && (
              <p id="password-error" className="text-sm text-red-600 dark:text-red-400">
                That password isn&apos;t right.
              </p>
            )}
            <Button type="submit">Sign in</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
