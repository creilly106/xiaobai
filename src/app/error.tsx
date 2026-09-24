'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
      <div lang="zh-Hans" className="text-5xl" aria-hidden>
        哎呀
      </div>
      <h1 className="mt-4 text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This page hit an error while loading. Your progress is saved — try
        again, or head back home.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Ref: {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          Home
        </Link>
      </div>
    </div>
  );
}
