// Converts between Arabic numerals and Mandarin number words.
//
// Chinese groups digits in fours, not threes: 万 (10⁴) and 亿 (10⁸) are the
// big units, so 1,000,000 is 一百万 ("one hundred ten-thousands").

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const PLACES = ['', '十', '百', '千'];
const GROUPS = ['', '万', '亿'];

export const MAX_NUMBER = 999_999_999_999;

const PINYIN: Record<string, string> = {
  零: 'líng',
  〇: 'líng',
  一: 'yī',
  幺: 'yāo',
  二: 'èr',
  两: 'liǎng',
  三: 'sān',
  四: 'sì',
  五: 'wǔ',
  六: 'liù',
  七: 'qī',
  八: 'bā',
  九: 'jiǔ',
  十: 'shí',
  百: 'bǎi',
  千: 'qiān',
  万: 'wàn',
  亿: 'yì',
};

/** 0–9999 without leading zeros; `liang` uses 两 for a leading 2 before 百/千. */
function groupToChinese(n: number, liang: boolean): string {
  const digits = String(n).padStart(4, '0').split('').map(Number);
  let out = '';
  let pendingZero = false;
  let started = false;
  digits.forEach((d, i) => {
    const place = 3 - i;
    if (d === 0) {
      if (started) pendingZero = true;
      return;
    }
    if (pendingZero) out += '零';
    pendingZero = false;
    const leading = !started;
    started = true;
    const word = d === 2 && liang && leading && place >= 2 ? '两' : DIGITS[d];
    out += word + PLACES[place];
  });
  return out;
}

export type ChineseNumberOptions = {
  /** Use 两 where speakers normally do (两百, 两千, 两万). Default true. */
  liang?: boolean;
};

/** 12345 → 一万两千三百四十五. Integers from 0 to MAX_NUMBER. */
export function toChinese(n: number, { liang = true }: ChineseNumberOptions = {}): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_NUMBER) {
    throw new RangeError(`Expected an integer 0–${MAX_NUMBER}`);
  }
  if (n === 0) return '零';

  const groups: number[] = [];
  for (let rest = n; rest > 0; rest = Math.floor(rest / 10_000)) groups.push(rest % 10_000);

  let out = '';
  let needZero = false;
  for (let g = groups.length - 1; g >= 0; g--) {
    const value = groups[g];
    if (value === 0) {
      if (out) needZero = true;
      continue;
    }
    // A gap inside the number (10005 → 一万零五) is read as a single 零.
    if (out && (needZero || value < 1000)) out += '零';
    needZero = false;
    const text = value === 2 && g > 0 && liang ? '两' : groupToChinese(value, liang);
    out += text + GROUPS[g];
  }
  // 10–19 at the very start drop the 一: 十五, 十万 (but 一百一十五).
  return out.startsWith('一十') ? out.slice(1) : out;
}

/** Reads each digit separately, as for years and phone numbers. */
export function digitsToChinese(s: string, { phone = false } = {}): string {
  return Array.from(s.replace(/\D/g, ''))
    .map((d) => (d === '0' ? '〇' : phone && d === '1' ? '幺' : DIGITS[Number(d)]))
    .join('');
}

/** Syllable-by-syllable pinyin (citation tones; 一 and 不 tone changes aren't applied). */
export function numberPinyin(chinese: string): string {
  return Array.from(chinese)
    .map((c) => PINYIN[c] ?? c)
    .join(' ');
}

/** Treat 两/二 and 〇/零 as the same when checking an answer. */
export function sameChineseNumber(a: string, b: string): boolean {
  const norm = (s: string) => s.replace(/两/g, '二').replace(/〇/g, '零').replace(/\s/g, '');
  return norm(a) === norm(b);
}
