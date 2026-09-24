/** Lowercase pinyin with tone marks and spaces removed: "Nǐ hǎo" → "nihao". */
export function plainPinyin(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ü/g, 'v')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}

/** Han characters, including radical-supplement forms like ⺮ and ⻊. */
export function isCjk(s: string): boolean {
  return /[⺀-⿟㐀-鿿豈-﫿]/u.test(s);
}
