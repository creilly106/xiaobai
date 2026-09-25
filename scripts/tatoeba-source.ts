// Tatoeba's Chinese–English sentence pairs (https://tatoeba.org, CC BY 2.0 FR)
// via ManyThings.org, cached under scripts/.cache. Used for example sentences
// and for word-frequency ranking in the dictionary.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ZIP_URL = 'https://www.manythings.org/anki/cmn-eng.zip';
const CACHE_DIR = path.join('scripts', '.cache');
const ZIP = path.join(CACHE_DIR, 'cmn-eng.zip');
export const TATOEBA_TXT = path.join(CACHE_DIR, 'cmn-eng', 'cmn.txt');

/** Download and unpack the file if it isn't cached yet. Returns its path. */
export function ensureTatoeba(): string {
  if (existsSync(TATOEBA_TXT)) return TATOEBA_TXT;
  mkdirSync(CACHE_DIR, { recursive: true });
  if (!existsSync(ZIP)) {
    console.log(`Downloading ${ZIP_URL} …`);
    // The site rejects Node's default fetch headers; curl works.
    execFileSync('curl', ['-sSL', '-A', 'curl/8.0', '-o', ZIP, ZIP_URL]);
  }
  execFileSync('tar', ['-xf', ZIP, '-C', CACHE_DIR, '--one-top-level=cmn-eng']);
  return TATOEBA_TXT;
}
