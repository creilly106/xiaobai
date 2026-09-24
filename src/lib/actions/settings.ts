'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import { backfillListeningCards } from '@/lib/listening-backfill';

// Mirrors the input bounds in settings/_components/pref-form.tsx.
const SETTINGS_LIMITS = {
  dailyNewLimit: { min: 0, max: 200 },
  dailyReviewLimit: { min: 0, max: 2000 },
  retentionTarget: { min: 0.7, max: 0.99 },
} as const;

function clampInt(v: unknown, { min, max }: { min: number; max: number }): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
  return Math.min(max, Math.max(min, Math.round(v)));
}

function clampFloat(v: unknown, { min, max }: { min: number; max: number }): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
  return Math.min(max, Math.max(min, Math.round(v * 100) / 100));
}

export async function updateSettings(patch: {
  dailyNewLimit?: number;
  dailyReviewLimit?: number;
  retentionTarget?: number;
  listeningEnabled?: boolean;
}) {
  const clean = {
    dailyNewLimit: clampInt(patch.dailyNewLimit, SETTINGS_LIMITS.dailyNewLimit),
    dailyReviewLimit: clampInt(patch.dailyReviewLimit, SETTINGS_LIMITS.dailyReviewLimit),
    retentionTarget: clampFloat(patch.retentionTarget, SETTINGS_LIMITS.retentionTarget),
    listeningEnabled:
      typeof patch.listeningEnabled === 'boolean' ? patch.listeningEnabled : undefined,
  };

  const [settings] = await db.select().from(schema.settings).limit(1);
  if (!settings) {
    await db.insert(schema.settings).values({
      id: 1,
      dailyNewLimit: clean.dailyNewLimit ?? 15,
      dailyReviewLimit: clean.dailyReviewLimit ?? 200,
      retentionTarget: clean.retentionTarget ?? 0.9,
      listeningEnabled: clean.listeningEnabled ?? true,
    });
  } else {
    await db
      .update(schema.settings)
      .set({
        ...(clean.dailyNewLimit != null && { dailyNewLimit: clean.dailyNewLimit }),
        ...(clean.dailyReviewLimit != null && { dailyReviewLimit: clean.dailyReviewLimit }),
        ...(clean.retentionTarget != null && { retentionTarget: clean.retentionTarget }),
        ...(clean.listeningEnabled != null && { listeningEnabled: clean.listeningEnabled }),
        updatedAt: new Date(),
      })
      .where(eq(schema.settings.id, settings.id));
  }
  if (clean.listeningEnabled) await backfillListeningCards(db);
  // Limits and retention affect the queue, dashboard and study pages.
  revalidatePath('/', 'layout');
  return { ok: true, saved: clean };
}
