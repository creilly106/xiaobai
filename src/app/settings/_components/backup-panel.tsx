'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { LocalDate } from '@/components/local-date';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type LocalBackup = { name: string; savedAt: number; bytes: number };

export function BackupPanel({ localBackups }: { localBackups: LocalBackup[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<{ name: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function restore() {
    if (!pendingFile) return;
    setBusy(true);
    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pendingFile.text,
      });
      const body = (await res.json()) as { ok: boolean; rows?: number; error?: string };
      if (!body.ok) throw new Error(body.error ?? 'Restore failed.');
      toast.success(`Restored ${body.rows} rows from ${pendingFile.name}.`);
      setPendingFile(null);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <a href="/api/backup" download className={buttonVariants({})}>
          <Download /> Download backup
        </a>
        <Button variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload /> Restore from file…
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) setPendingFile({ name: file.name, text: await file.text() });
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        A backup holds everything: your cards, review history, settings and the word lists. Keep a
        copy somewhere other than this computer (cloud drive, USB stick).
      </p>
      <div className="text-xs text-muted-foreground">
        <div className="font-medium text-foreground">Automatic backups on this computer</div>
        {localBackups.length === 0 ? (
          <p>
            None yet — one is saved in <code>data/backups</code> on your first review each day.
          </p>
        ) : (
          <ul className="mt-1 space-y-0.5">
            {localBackups.slice(0, 5).map((b) => (
              <li key={b.name}>
                <code>{b.name}</code> · <LocalDate value={b.savedAt} withTime /> ·{' '}
                {Math.round(b.bytes / 1024)} KB
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={pendingFile != null} onOpenChange={(open) => !open && setPendingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore this backup?</DialogTitle>
            <DialogDescription>
              Everything in the app will be replaced with <strong>{pendingFile?.name}</strong>. A
              safety copy of your current data is saved to <code>data/backups</code> first, so this
              can be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingFile(null)} disabled={busy}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={restore} disabled={busy}>
              {busy ? 'Restoring…' : 'Replace my data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
