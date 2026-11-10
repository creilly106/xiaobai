'use server';

import { requireSession } from '@/lib/require-session';
import { breakDown, type Breakdown } from '@/lib/queries/breakdown';

/** Break pasted Chinese into words (see queries/breakdown.ts). */
export async function analyseText(text: string): Promise<Breakdown> {
  await requireSession();
  if (typeof text !== 'string' || !text.trim()) return { pieces: [], words: {} };
  return breakDown(text);
}
