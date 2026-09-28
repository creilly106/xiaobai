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
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium, type Page } from 'playwright-core';

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith('--')) ?? 'http://localhost:3200').replace(/\/$/, '');
/** --headed: open a visible Chrome window and slow down, to watch the run. */
const headed = args.includes('--headed');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

type Test = {
  name: string;
  run: (page: Page) => Promise<void>;
  /** Going offline on purpose makes failed requests expected, not errors. */
  offline?: boolean;
};

const NETWORK_ERROR = /ERR_INTERNET_DISCONNECTED|status of 504|HTTP 504|Failed to fetch/;

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
    name: 'learn: HSK 4 lessons stay locked until reached, and an HSK 4 checkpoint runs',
    async run(page) {
      await page.goto(`${base}/learn/h4-u15-l3`);
      assert(await page.getByText('Not unlocked yet').isVisible(), 'a far-off lesson was open');
      await page.goto(`${base}/learn/checkpoint/h4-u15`);
      const kinds = new Set<string>();
      for (let i = 0; i < 150; i++) {
        if (
          (await page.getByText('Not quite there yet').isVisible()) ||
          (await page.getByText(/You tested out of/).isVisible())
        ) {
          assert(kinds.size >= 3, `only ${[...kinds].join(', ')} steps`);
          return;
        }
        const cont = page.getByRole('button', { name: 'Continue' });
        if ((await cont.count()) > 0 && (await cont.isEnabled())) {
          await cont.tap();
          await wait(350);
          continue;
        }
        const step = (await page.locator('[data-step]').getAttribute('data-step')) ?? '';
        kinds.add(step);
        await answer(page, step);
        await wait(350);
      }
      throw new Error('the HSK 4 checkpoint never showed a result');
    },
  },
  {
    name: 'offline: reviews and the next lesson work offline, and sync when back online',
    offline: true,
    async run(page) {
      const context = page.context();
      // Online first: the home page saves Learn, Review and the next lesson.
      await page.goto(`${base}/`);
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.goto(`${base}/`); // now controlled by the service worker
      const href = (await page
        .getByRole('link', { name: /^(Start learning|Continue)/ })
        .first()
        .getAttribute('href'))!;
      await wait(9000); // warm-up starts after 3s, then fetches pages and audio
      await context.setOffline(true);
      try {
        await page.goto(`${base}/study`);
        const counter = page.getByText(/^\d+ \/ \d+$/).first();
        let rated = 0;
        for (let i = 0; i < 6 && rated < 2; i++) {
          if (await page.getByText('Session complete').isVisible()) break;
          const teach = page.getByRole('button', { name: /^Got it/ });
          if (await teach.isVisible()) {
            await teach.tap();
            await wait(800);
            continue;
          }
          await counter.waitFor();
          await page.getByTestId('card-hanzi').tap();
          await wait(600);
          await page.getByRole('button', { name: /^Good/ }).tap();
          rated++;
          await wait(900);
        }
        assert(rated > 0, 'could not rate any cards offline');
        await page
          .getByRole('status')
          .getByText(/Offline — \d+ answer/)
          .waitFor({ timeout: 5000 });

        // The next lesson was saved ahead, so it opens and finishes offline.
        await page.goto(`${base}${href}`);
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
          assert(i < 199, 'never reached "Lesson complete" offline');
        }
      } finally {
        await context.setOffline(false);
      }
      // Back online: everything saved on the device is sent.
      await page.getByText(/^Saved .* from this device\.$/).waitFor({ timeout: 15000 });
      await page.goto(`${base}/learn`);
      const next = await page
        .getByRole('link', { name: /^(Start|Continue)/ })
        .first()
        .getAttribute('href');
      assert(next !== href, `the offline lesson (${href}) didn't sync`);
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
    name: 'scenarios: a phrase can be added to study and removed again',
    async run(page) {
      await page.goto(`${base}/scenarios/weather`);
      const row = page
        .locator('div.px-4.py-3')
        .filter({ has: page.getByRole('button', { name: /^Add “/ }) })
        .first();
      const addButton = row.getByRole('button', { name: /^Add “/ });
      const label = (await addButton.getAttribute('aria-label'))!;
      const hanzi = label.slice('Add “'.length, label.indexOf('”'));
      await addButton.tap();
      await page.getByText(`Added “${hanzi}” to your study queue.`).waitFor({ timeout: 5000 });
      await page.getByRole('button', { name: `In your study queue — remove “${hanzi}”` }).tap();
      await page.getByRole('button', { name: /^Remove “.*” from study/ }).tap();
      await page.getByText(`Removed “${hanzi}” from study.`).waitFor({ timeout: 5000 });
      await page.reload();
      assert(
        await page.getByRole('button', { name: `Add “${hanzi}” to study` }).isVisible(),
        `${hanzi} still in the queue after removing it`,
      );
    },
  },
  {
    name: 'level: a Level check runs to the end and updates your level',
    async run(page) {
      await page.goto(`${base}/level/check`);
      let asked = 0;
      for (; asked < 30; asked++) {
        const step = page.locator('[data-level-step]');
        const done = page.getByText('Level check done');
        await Promise.race([step.waitFor(), done.waitFor()]);
        if (await done.isVisible()) break;
        const kind = await step.getAttribute('data-level-step');
        if (asked === 2) {
          await page.getByRole('button', { name: "I don't know" }).tap();
          await page.getByText("Here's the answer").waitFor();
        } else if (kind === 'type-pinyin') {
          for (const k of ['m', 'a', '1']) await page.keyboard.press(k);
          await page.getByRole('button', { name: 'Check' }).last().tap();
        } else {
          await step.locator('button.min-h-16').first().tap();
        }
        await page.getByRole('button', { name: 'Continue' }).tap();
        await wait(350); // the answered question slides away first
      }
      await page.getByText('Level check done').waitFor({ timeout: 15000 });
      assert(asked >= 15, `only ${asked} questions`);
      assert(
        await page
          .getByText(/≈ HSK \d\.\d/)
          .first()
          .isVisible(),
        'no skill levels shown',
      );
      await page.goto(`${base}/level`);
      assert(await page.getByText('Your rank').isVisible(), 'no rank on the Level page');
    },
  },
  {
    name: 'touch: tapping a word shows its meaning without leaving the page',
    async run(page) {
      // Headless Chrome reports a mouse; a phone has no hover, so taps must do the work.
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', {
        features: [
          { name: 'pointer', value: 'coarse' },
          { name: 'hover', value: 'none' },
        ],
      });
      await page.goto(`${base}/scenarios/ordering-food`, { waitUntil: 'networkidle' });
      const url = page.url();
      await page.getByRole('button', { name: '菜单' }).first().tap();
      const popover = page.locator('[data-slot=popover-content]');
      await popover.waitFor();
      assert(/menu/.test((await popover.textContent()) ?? ''), 'no meaning in the popover');
      assert(page.url() === url, `navigated to ${page.url()}`);
    },
  },
  {
    name: 'break it down: pasted Chinese is split into words you can look up',
    async run(page) {
      await page.goto(`${base}/breakdown`);
      await page.getByLabel('Chinese text').fill('我喜欢吃苹果，你呢？');
      await page.getByRole('button', { name: 'Break it down' }).tap();
      const apple = page.locator('button[data-word="苹果"]');
      await apple.waitFor({ timeout: 10_000 });
      assert((await page.locator('[data-word]').count()) >= 5, 'too few words found');
      await apple.tap();
      await page.getByRole('dialog').getByText(/apple/i).waitFor({ timeout: 5000 });
      assert(
        await page.getByText(/^You know \d+ of \d+ words$/).isVisible(),
        'no known-words summary',
      );
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
  {
    name: 'read: a story can be read, words looked up, and questions answered',
    async run(page) {
      await page.goto(`${base}/read/my-family`);
      await page.locator('button[data-word="猫"]').first().tap();
      const panel = page.getByRole('dialog');
      await panel.waitFor();
      assert((await panel.textContent())?.includes('cat'), 'word panel does not show the meaning');
      await panel.getByRole('button', { name: /Study this sentence/ }).tap();
      await panel.getByText('Sentence saved').waitFor({ timeout: 5000 });
      await panel.getByRole('button', { name: 'Close' }).tap();
      const questions = page.locator('[data-question]');
      const count = await questions.count();
      assert(count >= 3, `only ${count} questions`);
      for (let i = 0; i < count; i++) {
        await questions.nth(i).locator('button.min-h-16').first().tap();
      }
      await page.getByText(new RegExp(`^\\d / ${count}$`)).waitFor({ timeout: 5000 });
      await wait(500); // the result is logged in the background
      await page.goto(`${base}/read`);
      const card = page.locator('a[href="/read/my-family"]');
      assert((await card.textContent())?.includes('Read'), 'story not marked as read');
    },
  },
  {
    name: 'find: drawing 好 offers it, and picking 氵 + 可 finds 河',
    async run(page) {
      await page.goto(`${base}/find`);
      await page.getByText('Ready').waitFor({ timeout: 15_000 });
      const pad = page.getByLabel('Drawing pad');
      const box = (await pad.boundingBox())!;
      // Trace 好's strokes (hanzi-writer's 1024 box, y up) across the pad.
      const { medians } = JSON.parse(
        readFileSync(path.join('node_modules', 'hanzi-writer-data', '好.json'), 'utf8'),
      ) as { medians: [number, number][][] };
      const at = ([x, y]: [number, number]) => ({
        x: box.x + (x / 1024) * box.width,
        y: box.y + ((900 - y) / 1024) * box.height,
      });
      for (const stroke of medians) {
        const start = at(stroke[0]);
        await page.mouse.move(start.x, start.y);
        await page.mouse.down();
        for (const p of stroke.slice(1)) {
          const { x, y } = at(p);
          await page.mouse.move(x, y, { steps: 4 });
        }
        await page.mouse.up();
      }
      const first = page.locator('[data-results] button').first();
      await first.waitFor({ timeout: 5000 });
      assert((await first.getAttribute('data-char')) === '好', 'drawing 好 did not put it first');
      await first.tap();
      await page.getByRole('dialog').getByText(/good/).waitFor({ timeout: 5000 });
      await page.getByRole('dialog').getByRole('button', { name: 'Close' }).tap();

      await page.getByRole('tab', { name: 'Pick its parts' }).tap();
      await page.getByRole('button', { name: '氵', exact: true }).first().tap();
      await page.getByRole('button', { name: '可', exact: true }).first().tap();
      await page.locator('[data-results] button[data-char="河"]').waitFor({ timeout: 5000 });
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
      const real = t.offline ? errors.filter((e) => !NETWORK_ERROR.test(e)) : errors;
      if (real.length) throw new Error(`console errors:\n    ${real.join('\n    ')}`);
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
