/**
 * Writes src/lib/generated/english-words.json: every English word used in the
 * HSK meanings and extra accepted answers. The meaning grader uses it to tell
 * a typo ("restaraunt") from a different real word ("mouth" for "month"),
 * which must not count as a slip. Run after changing HSK meanings:
 *   npx tsx scripts/build-english-words.ts
 * (A unit test fails if the file is out of date.)
 */
import { writeFileSync } from 'node:fs';
import { englishWordList } from '../src/lib/english-words-source';

writeFileSync('src/lib/generated/english-words.json', `${JSON.stringify(englishWordList())}\n`);
console.log('Wrote english-words.json');
