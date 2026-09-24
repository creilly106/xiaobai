'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { saveNote } from '@/lib/actions/custom';

/** Your own note on a word — shown with the answer when you study it. */
export function NoteEditor({ wordId, initial }: { wordId: number; initial: string | null }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial ?? '');
  const [saved, setSaved] = useState(initial ?? '');
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return saved ? (
      <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
        <div className="flex items-start justify-between gap-2">
          <p>
            <span className="text-xs font-medium text-muted-foreground">Your note · </span>
            {saved}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </div>
      </div>
    ) : (
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setEditing(true)}>
        + Add a note
      </Button>
    );
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await saveNote({ wordId }, value);
          if (!res.ok) {
            toast.error(res.message);
            return;
          }
          setSaved(value.trim());
          setEditing(false);
          toast.success(res.message);
        });
      }}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={500}
        rows={2}
        autoFocus
        placeholder="A mnemonic, where you heard it, a usage tip…"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Your note"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Saving…' : 'Save note'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
