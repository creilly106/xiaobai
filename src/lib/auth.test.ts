import { describe, expect, it } from 'vitest';
import { safeNext } from './auth';

describe('safeNext', () => {
  it('keeps same-site paths', () => {
    expect(safeNext('/learn')).toBe('/learn');
    expect(safeNext('/library?q=ni&tab=hsk')).toBe('/library?q=ni&tab=hsk');
  });

  it('refuses anything a browser could read as another site', () => {
    for (const bad of [
      'https://evil.example',
      '//evil.example',
      '/\\evil.example',
      '/\t/evil.example',
      '/\n/evil.example',
      'learn',
      '',
      null,
      42,
    ]) {
      expect(safeNext(bad)).toBe('/');
    }
  });
});
