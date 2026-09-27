import Link from 'next/link';
import { CloudOff } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export const metadata = { title: 'Offline' };

/**
 * Shown by the service worker for pages that haven't been saved for offline
 * use yet. Pages you've opened before (Home, Learn, Review, your next lesson)
 * still work.
 */
export default function OfflinePage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
      <CloudOff className="mx-auto size-10 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-semibold">You&apos;re offline</h1>
      <p className="mt-2 text-muted-foreground">
        This page hasn&apos;t been saved on your phone yet. Your reviews and your next lesson work
        offline, and anything you answer is sent when you&apos;re back online.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/study" className={buttonVariants({})}>
          Review
        </Link>
        <Link href="/learn" className={buttonVariants({ variant: 'outline' })}>
          Learn
        </Link>
      </div>
    </div>
  );
}
