import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
      <div lang="zh-Hans" className="text-5xl" aria-hidden>
        找不到
      </div>
      <div className="mt-1 text-sm text-muted-foreground">zhǎo bu dào — can&apos;t find it</div>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That page or entry doesn&apos;t exist. Try searching the library instead.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/library" className={buttonVariants({})}>
          Search the library
        </Link>
        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          Home
        </Link>
      </div>
    </div>
  );
}
