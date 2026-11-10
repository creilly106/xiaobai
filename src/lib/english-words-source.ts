// Source for src/lib/generated/english-words.json (see
// scripts/build-english-words.ts). Kept out of the client bundle: only the
// script and a test import it.
import { hsk1 } from '../../scripts/data/hsk1';
import { hsk2 } from '../../scripts/data/hsk2';
import { hsk3 } from '../../scripts/data/hsk3';
import { hsk4 } from '../../scripts/data/hsk4';
import { hsk5 } from '../../scripts/data/hsk5';
import { alsoAcceptedAll } from './meaning-alternates';
import { normalise } from './meaning-grade';

/** Everyday words the glosses happen not to use but learners will type. */
const EXTRA = `
  laughter worry worried employer employee member hour hours four best east sheep
  tree there that this mouth night right write same live smell talk book monkey
  waiter move snow word hold call tell last lose side left
`;

export function englishWordList(): string[] {
  const texts = [
    ...[hsk1, hsk2, hsk3, hsk4, hsk5].flat().map((w) => w.meaning),
    ...alsoAcceptedAll(),
    EXTRA,
  ];
  const words = new Set<string>();
  for (const t of texts) {
    for (const w of normalise(t).split(' ')) if (/^[a-z]{3,}$/.test(w)) words.add(w);
  }
  return [...words].sort();
}
