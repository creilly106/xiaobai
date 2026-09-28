'use server';

import { breakDown, type Breakdown } from '@/lib/queries/breakdown';

/** Break pasted Chinese into words (see queries/breakdown.ts). */
export async function analyseText(text: string): Promise<Breakdown> {
  if (typeof text !== 'string' || !text.trim()) return { pieces: [], words: {} };
  return breakDown(text);
}
