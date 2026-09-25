/**
 * Renders src/app/icon.svg to the PNG icons phones need (iOS ignores SVG):
 * src/app/apple-icon.png (180px, iPhone home screen) and public/icon-192.png /
 * icon-512.png (the manifest). Corners are left square — the phone rounds them
 * itself, and transparent corners would show up black. Uses the installed Chrome.
 *
 *   npx tsx scripts/build-png-icons.ts
 */
import { existsSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
];

async function main() {
  const svg = readFileSync('src/app/icon.svg', 'utf8').replace(/ rx="\d+"/, '');
  const browser = await chromium.launch({
    executablePath: CHROME.find(existsSync),
    headless: true,
  });
  const page = await browser.newPage();
  for (const [size, out] of [
    [180, 'src/app/apple-icon.png'],
    [192, 'public/icon-192.png'],
    [512, 'public/icon-512.png'],
  ] as const) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
    );
    await page.screenshot({ path: out, omitBackground: false });
    console.log(`${out} (${size}px)`);
  }
  await browser.close();
}

main();
