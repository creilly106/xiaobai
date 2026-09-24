import 'server-only';
import raw from './generated/examples.json';

// Example sentences from Tatoeba (CC BY 2.0 FR), picked per word by
// scripts/build-examples.ts. Server-only: the JSON is ~230 KB.

export type Example = {
  zh: string;
  en: string;
  /** Tatoeba sentence ids "zh/en", for attribution links. */
  src: string;
};

const data = raw as { sentences: Example[]; words: Record<string, number[]> };

export function examplesFor(hanzi: string, limit = 3): Example[] {
  return (data.words[hanzi] ?? []).slice(0, limit).map((i) => data.sentences[i]);
}

export function allExamples(): Example[] {
  return data.sentences;
}

/** Link to the Chinese sentence on Tatoeba. */
export function tatoebaUrl(example: Example): string | null {
  const id = example.src.split('/')[0];
  return id ? `https://tatoeba.org/en/sentences/show/${id}` : null;
}
