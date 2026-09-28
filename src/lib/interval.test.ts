import { describe, expect, it } from 'vitest';
import { formatInterval } from './interval';

const M = 60_000;
const D = 86_400_000;

describe('formatInterval', () => {
  it('rounds to the largest sensible unit', () => {
    expect(formatInterval(0)).toBe('1m');
    expect(formatInterval(10 * M)).toBe('10m');
    expect(formatInterval(3 * 60 * M)).toBe('3h');
    expect(formatInterval(D)).toBe('1d');
    expect(formatInterval(12 * D)).toBe('12d');
    expect(formatInterval(61 * D)).toBe('2mo');
    expect(formatInterval(365 * D)).toBe('1y');
    expect(formatInterval(548 * D)).toBe('1.5y');
  });
});
