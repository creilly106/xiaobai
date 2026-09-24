import { notInArray } from 'drizzle-orm';
import { schema } from '@/db/client';
import type { CardMode } from '@/db/schema';

export const LISTENING_MODES = ['listening', 'sentence-listening'] as const satisfies CardMode[];

export function isListeningMode(mode: string): boolean {
  return (LISTENING_MODES as readonly string[]).includes(mode);
}

/** Recognition card mode → the listening mode created once it graduates. */
export const LISTENING_FOR: Partial<Record<CardMode, CardMode>> = {
  recognition: 'listening',
  'sentence-recognition': 'sentence-listening',
};

/** SQL filter hiding listening cards while they're switched off in Settings. */
export function modeFilter(listeningEnabled: boolean) {
  return listeningEnabled ? undefined : notInArray(schema.cards.mode, [...LISTENING_MODES]);
}
