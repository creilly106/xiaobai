const CJK = /[㐀-鿿]/;

/** Every Chinese `hanzi` (and tile `text`) value in a lesson or study session, for its audio. */
export function collectHanzi(value: unknown, out = new Set<string>()): string[] {
  if (Array.isArray(value)) value.forEach((v) => collectHanzi(v, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if ((k === 'hanzi' || k === 'text') && typeof v === 'string' && CJK.test(v)) out.add(v);
      else collectHanzi(v, out);
    }
  }
  return [...out];
}
