/**
 * Browser tests on an emulated phone (touch, small screen), driving the
 * installed Chrome through playwright-core. Point it at a running app whose
 * database can be written to — ideally a copy:
 *
 *   cp data/app.db data/e2e.db
 *   DATABASE_URL=file:./data/e2e.db npm run build && npx next start -p 3200
 *   npm run e2e -- http://localhost:3200
 *   npm run e2e -- http://localhost:3200 --headed   (watch it in a visible window)
 *
 * Needs the password gate off (no APP_PASSWORD).
 */
import { existsSync } from 'node:fs';
import { chromium, type Page } from 'playwright-core';

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith('--')) ?? 'http://localhost:3200').replace(/\/$/, '');
/** --headed: open a visible Chrome window and slow down, to watch the run. */
const headed = args.includes('--headed');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

type Test = { name: string; run: (page: Page) => Promise<void> };

function assert(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const tests: Test[] = [
  {
    name: 'quiz: cards stay put after rating (no skipping)',
    async run(page) {
      await page.goto(`${base}/quiz/session?type=word&count=6`);
      for (let i = 0; i < 4; i++) {
        const card = page.getByTestId('card-hanzi');
        await card.waitFor();
        const before = await card.textContent();
        await card.tap();
        await wait(600);
        await page.getByRole('button', { name: /^Got it/ }).tap();
        // The card change is animated; wait for the new one rather than a fixed time.
        let next = before;
        for (let t = 0; t < 30 && next === before; t++) {
          await wait(100);
          next = await page.getByTestId('card-hanzi').textContent();
        }
        assert(next !== before, `card ${i + 1}: didn't advance (${before})`);
        await wait(2000);
        const later = await page.getByTestId('card-hanzi').textContent();
        assert(later === next, `card ${i + 1}: swapped from ${next} to ${later} after rating`);
      }
    },
  },
  {
    name: 'quiz: checking a typed meaning does not auto-advance',
    async run(page) {
      await page.goto(`${base}/quiz/session?type=word&count=3&answer=type`);
      const card = page.getByTestId('card-hanzi');
      const before = await card.textContent();
      const input = page.getByLabel('Your English answer');
      await input.tap();
      await input.fill('something');
      await input.press('Enter');
      await wait(1500);
      assert((await card.textContent()) === before, 'moved on without a rating');
      assert(await page.getByText(/you wrote/).isVisible(), 'no verdict shown');
    },
  },
  {
    name: 'learn: the current lesson can be completed on a phone, and the path moves on',
    async run(page) {
      await page.goto(`${base}/learn`);
      const start = page.getByRole('link', { name: /^(Start|Continue)/ }).first();
      const href = await start.getAttribute('href');
      assert(href && href.startsWith('/learn/'), 'no current lesson on the path');
      const lessonId = href.split('/').pop()!;
      await start.tap();
      await page.waitForURL(`**/learn/${lessonId}`);
      for (let i = 0; i < 200; i++) {
        if (await page.getByText('Lesson complete').isVisible()) break;
        const cont = page.getByRole('button', { name: 'Continue' });
        if ((await cont.count()) > 0 && (await cont.isEnabled())) {
          await cont.tap();
          await wait(350);
          continue;
        }
        const step = await page.locator('[data-step]').getAttribute('data-step');
        await answer(page, step ?? '');
        await wait(350);
        assert(i < 199, 'never reached "Lesson complete"');
      }
      await page.goto(`${base}/learn`);
      const next = await page
        .getByRole('link', { name: /^(Start|Continue)/ })
        .first()
        .getAttribute('href');
      assert(next && next !== href, `path did not move on from ${lessonId}`);
    },
  },
  {
    name: 'review: cards can be rated on a phone and the session moves on',
    async run(page) {
      await page.goto(`${base}/study`);
      if (await page.getByText("You're all caught up").isVisible()) return;
      const counter = page.getByText(/^\d+ \/ \d+$/).first();
      const done = async () => Number((await counter.textContent())?.split('/')[0].trim());
      for (let i = 0; i < 4; i++) {
        if (await page.getByText('Session complete').isVisible()) return;
        const before = await done();
        // A new card is taught first; it's rated when it comes back.
        const teach = page.getByRole('button', { name: /^Got it/ });
        if (await teach.isVisible()) {
          await teach.tap();
          await wait(800);
          continue;
        }
        await page.getByTestId('card-hanzi').tap();
        await wait(600);
        await page.getByRole('button', { name: /^Good/ }).tap();
        let after = before;
        for (let t = 0; t < 30 && after === before; t++) {
          await wait(100);
          after = await done();
        }
        assert(after > before, `card ${i + 1}: rating didn't move the session on`);
        // Let the old card animate out before touching the next one.
        await wait(900);
      }
    },
  },
  {
    name: 'learn: a unit checkpoint runs to a result',
    async run(page) {
      await page.goto(`${base}/learn/checkpoint/h1-u8`);
      for (let i = 0; i < 120; i++) {
        if (
          (await page.getByText('Not quite there yet').isVisible()) ||
          (await page.getByText(/You tested out of/).isVisible())
        ) {
          return;
        }
        const cont = page.getByRole('button', { name: 'Continue' });
        if ((await cont.count()) > 0 && (await cont.isEnabled())) {
          await cont.tap();
          await wait(350);
          continue;
        }
        const step = await page.locator('[data-step]').getAttribute('data-step');
        await answer(page, step ?? '');
        await wait(350);
      }
      throw new Error('checkpoint never showed a result');
    },
  },
  {
    name: 'audio: tapping play loads a recorded clip',
    async run(page) {
      await page.goto(`${base}/scenarios/relationships`);
      await page.waitForLoadState('networkidle'); // the clip index loads in the background
      const clip = page.waitForResponse((r) => /\/audio\/.+\.mp3$/.test(r.url()), {
        timeout: 5000,
      });
      await page
        .getByRole('button', { name: /^Play pronunciation/ })
        .first()
        .tap();
      const res = await clip;
      // Media is fetched in ranges, so 206 Partial Content is a success too.
      assert([200, 206].includes(res.status()), `clip ${res.url()} returned ${res.status()}`);
    },
  },
  {
    name: 'learn: leaving a started lesson asks first',
    async run(page) {
      await page.goto(`${base}/learn`);
      const href = await page
        .getByRole('link', { name: /^(Start|Continue)/ })
        .first()
        .getAttribute('href');
      await page.goto(`${base}${href}`);
      // Get past the first question so there's progress to lose.
      for (let i = 0; i < 10; i++) {
        const cont = page.getByRole('button', { name: 'Continue' });
        if ((await cont.count()) > 0 && (await cont.isEnabled())) {
          await cont.tap();
          await wait(350);
          continue;
        }
        const step = await page.locator('[data-step]').getAttribute('data-step');
        await answer(page, step ?? '');
        await wait(350);
        break;
      }
      await page.getByRole('button', { name: 'Leave lesson' }).tap();
      assert(await page.getByText(/Leave this lesson\?/).isVisible(), 'no confirmation shown');
      await page.getByRole('button', { name: 'Keep going' }).tap();
      assert(
        !(await page.getByText(/Leave this lesson\?/).isVisible()),
        'confirmation did not close',
      );
      assert(page.url().includes('/learn/'), 'left the lesson anyway');
    },
  },
  {
    name: 'flags: a phrase can be flagged and shows up in Settings',
    async run(page) {
      await page.goto(`${base}/scenarios/ordering-food`);
      await page.getByRole('button', { name: 'Flag a problem with this' }).first().tap();
      await page.getByRole('button', { name: 'Wrong translation' }).tap();
      await page.getByLabel('Note').fill('e2e test flag');
      await page.getByRole('button', { name: 'Send' }).tap();
      await page.getByText(/Flagged — thanks/).waitFor({ timeout: 5000 });
      await page.goto(`${base}/settings#flags`);
      const row = page.locator('li', { hasText: 'e2e test flag' });
      assert((await row.count()) === 1, 'flag not listed in Settings');
      await row.getByRole('button', { name: 'Delete flag' }).tap();
      await row.waitFor({ state: 'detached', timeout: 5000 });
    },
  },
  {
    name: 'scenarios: time chips and "Your turn"',
    async run(page) {
      await page.goto(`${base}/scenarios/relationships`);
      // Find the row by its English, which stays put while the chips change the Chinese.
      const row = page.locator('div.px-4.py-3', { hasText: 'Do you miss me?' }).first();
      await row.getByRole('tab', { name: 'Past' }).tap();
      assert(
        await page.getByText('Did you miss me?').first().isVisible(),
        'Past chip did not swap in 你想我了吗？',
      );
      await page.getByRole('tab', { name: /Dialogues/ }).tap();
      await page.getByRole('button', { name: 'Your turn' }).first().tap();
      const hidden = page.getByRole('button', { name: /tap to check/ });
      const count = await hidden.count();
      assert(count > 0, 'no hidden lines in Your turn mode');
      await hidden.first().tap();
      assert((await hidden.count()) === count - 1, 'tapping did not reveal the line');
    },
  },
  {
    name: 'scenarios: a dialogue plays through, then asks listening questions',
    async run(page) {
      await page.goto(`${base}/scenarios/relationships?view=dialogues`);
      const started = Date.now();
      await page.getByRole('button', { name: 'Listen' }).first().tap();
      const quiz = page.getByRole('button', { name: 'Check what you understood' });
      await quiz.waitFor({ timeout: 90_000 });
      const lines = await page.locator('[data-line]').count();
      assert(lines > 2, `only ${lines} lines appeared`);
      console.log(`    (played ${lines} lines in ${((Date.now() - started) / 1000).toFixed(1)}s)`);
      await quiz.tap();
      for (let i = 0; i < 6; i++) {
        const question = page.locator('[data-listening-question] button.min-h-16');
        if (!(await question.first().isVisible())) break;
        await question.first().tap();
        await page.getByRole('button', { name: /^(Next|See results)$/ }).tap();
        await wait(200);
      }
      assert(await page.getByText(/^\d \/ \d$/).isVisible(), 'no score shown');
      await page.getByRole('button', { name: 'Done' }).tap();
      assert(
        (await page.locator('[data-line]').count()) === 0,
        'Done did not go back to the dialogue',
      );
    },
  },
];

/** Give some answer to a lesson question (right or wrong — missed ones come back). */
async function answer(page: Page, step: string) {
  const area = page.locator('[data-step]');
  switch (step) {
    case 'choose':
    case 'translate':
    case 'fill':
      await area.locator('button.min-h-16').first().tap();
      return;
    case 'type-meaning': {
      const input = page.getByLabel('Your English answer');
      await input.fill('hello');
      await input.press('Enter');
      return;
    }
    case 'write':
      await area.getByRole('button', { name: 'Skip writing' }).tap();
      return;
    case 'type-pinyin':
      await page.keyboard.type('ni3');
      await page.keyboard.press('Enter');
      return;
    case 'arrange':
    case 'dictation': {
      const bank = area.locator('button[data-tile]');
      for (let n = await bank.count(); n > 0; n = await bank.count()) {
        await bank.first().tap();
        await wait(100);
      }
      await area.getByRole('button', { name: 'Check' }).tap();
      return;
    }
    case 'match': {
      const columns = area.locator('.grid-cols-2 > div');
      const left = columns.nth(0).locator('button');
      const right = columns.nth(1).locator('button');
      for (let i = 0; i < (await left.count()); i++) {
        if (await left.nth(i).isDisabled()) continue;
        await left.nth(i).tap();
        for (let j = 0; j < (await right.count()); j++) {
          if (await right.nth(j).isDisabled()) continue;
          await right.nth(j).tap();
          await wait(450);
          if (await left.nth(i).isDisabled()) break;
        }
      }
      return;
    }
    default:
      throw new Error(`don't know how to answer step "${step}"`);
  }
}

async function main() {
  const executablePath = CHROME.find((p) => existsSync(p));
  const browser = await chromium.launch({
    executablePath,
    headless: !headed,
    slowMo: headed ? 150 : 0,
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  let failed = 0;
  for (const t of tests) {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    const started = Date.now();
    try {
      await t.run(page);
      if (errors.length) throw new Error(`console errors:\n    ${errors.join('\n    ')}`);
      console.log(`✓ ${t.name} (${((Date.now() - started) / 1000).toFixed(1)}s)`);
    } catch (err) {
      failed++;
      console.log(`✗ ${t.name}\n  ${(err as Error).message}`);
      await page.screenshot({ path: `scripts/.cache/e2e-fail-${failed}.png` }).catch(() => {});
    }
    await page.close();
  }
  await browser.close();
  console.log(failed ? `${failed} failed` : 'all passed');
  process.exit(failed ? 1 : 0);
}

main();
