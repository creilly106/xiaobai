import { notInArray } from 'drizzle-orm';
import { schema } from '@/db/client';
import type { CardMode } from '@/db/schema';

// Recognition cards (see Chinese → recall meaning) are the core. Once one
// graduates, "follow-up" cards test the same item another way.

export const LISTENING_MODES = ['listening', 'sentence-listening'] as const satisfies CardMode[];
export const PRODUCTION_MODES = ['production'] as const satisfies CardMode[];

export function isListeningMode(mode: string): boolean {
  return (LISTENING_MODES as readonly string[]).includes(mode);
}

export function isProductionMode(mode: string): boolean {
  return (PRODUCTION_MODES as readonly string[]).includes(mode);
}

/** Follow-up cards skip sentence gating and the "teach" step — you already know the item. */
export function isFollowUpMode(mode: string): boolean {
  return isListeningMode(mode) || isProductionMode(mode);
}

export type FollowUpSettings = { listening: boolean; production: boolean };

/** SQL filter hiding follow-up cards whose kind is switched off in Settings. */
export function modeFilter({ listening, production }: FollowUpSettings) {
  const hidden: CardMode[] = [
    ...(listening ? [] : LISTENING_MODES),
    ...(production ? [] : PRODUCTION_MODES),
  ];
  return hidden.length > 0 ? notInArray(schema.cards.mode, hidden) : undefined;
}

export function followUpsFrom(settings: {
  listeningEnabled: boolean;
  productionEnabled: boolean;
}): FollowUpSettings {
  return { listening: settings.listeningEnabled, production: settings.productionEnabled };
}
