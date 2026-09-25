'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import type { FlagReason } from '@/db/schema';

const REASONS: FlagReason[] = ['translation', 'pinyin', 'audio', 'too-hard', 'too-easy', 'other'];
const clip = (s: unknown, max: number) =>
  typeof s === 'string' && s.trim() ? s.trim().slice(0, max) : null;

/** Flag something to fix later. No revalidation: it mustn't refresh the page you're studying on. */
export async function flagItem(input: {
  subject: string;
  detail?: string;
  reason: FlagReason;
  note?: string;
  context?: string;
}) {
  const subject = clip(input.subject, 300);
  if (!subject || !REASONS.includes(input.reason)) throw new Error('Invalid flag.');
  await db.insert(schema.flags).values({
    subject,
    detail: clip(input.detail, 300),
    reason: input.reason,
    note: clip(input.note, 1000),
    context: clip(input.context, 200),
  });
}

export async function resolveFlag(id: number) {
  await db.update(schema.flags).set({ resolvedAt: new Date() }).where(eq(schema.flags.id, id));
  revalidatePath('/settings');
}

export async function deleteFlag(id: number) {
  await db.delete(schema.flags).where(eq(schema.flags.id, id));
  revalidatePath('/settings');
}
