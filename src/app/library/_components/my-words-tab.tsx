import Link from 'next/link';
import { getMyItems } from '@/lib/queries/my-words';
import { AddOwnForm } from './add-own-form';
import { MyItemRow } from './my-item-row';

/** Words you added from the dictionary or by hand, and your own sentences. */
export async function MyWordsTab() {
  const items = await getMyItems();
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Anything you&apos;ve added beyond the HSK lists — from the{' '}
        <Link href="/library?tab=dictionary" className="underline hover:text-foreground">
          dictionary
        </Link>{' '}
        or typed in yourself.
      </p>
      <div className="mt-6">
        <AddOwnForm />
      </div>
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Nothing here yet. Look a word up in the dictionary and press “Add to study”, or add one
          above.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border/60 rounded-lg border border-border/60 bg-card">
          {items.map((item) => (
            <MyItemRow key={`${item.kind}-${item.id}`} item={item} />
          ))}
        </ul>
      )}
    </>
  );
}
