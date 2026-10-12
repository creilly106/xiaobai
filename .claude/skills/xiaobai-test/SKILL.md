---
name: xiaobai-test
description: How to test the Xiaobai app properly before shipping — unit checks, a production build against the throwaway test database, the phone-sized browser tests (e2e), the every-page smoke test, and phone screenshots for visual review. Use this whenever a change touches pages, lessons, reviews, the Level check, offline sync, the service worker or the database, whenever asked to "test it", "check it works", "screenshot" or "look at how it looks", and before every push that changes app behaviour — even small UI tweaks.
---

# Testing Xiaobai

Three layers, cheapest first. Unit checks alone miss real bugs here (pages that only break in a
production build, phone-only behaviour, animation timing), so behaviour changes need all three.

All commands run from the repo root (`C:\Users\Conor Reilly\Documents\Projects\chinese-app`) on
Windows with Git Bash; the build step uses PowerShell.

## 1. Unit checks

```bash
npm run check        # prettier check, eslint, tsc, vitest
```

Run `npx prettier --write <changed files>` first; Windows line endings make format:check fail on
files edited by scripts. `npm run lint` also scans `scripts/.cache/` (gitignored scratch), so delete
scratch scripts there that lint complains about.

## 2. Build and serve against the test database

`data/e2e.db` is a copy of real data that the browser tests are allowed to change. Never point
tests at `data/app.db`.

1. **Migrate it** if there's a new migration — local builds do _not_ migrate (only Vercel's
   prebuild does, for the remote database):
   `DATABASE_URL=file:./data/e2e.db npm run db:migrate`
   (and `npm run db:seed-scenarios` with the same variable if scenarios changed)
2. **Free port 3200 and build** (PowerShell tool):
   ```powershell
   Get-NetTCPConnection -LocalPort 3200 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   $env:DATABASE_URL='file:./data/e2e.db'; npm run build 2>&1 | Select-String -Pattern "rror|Compiled" | Select-Object -First 5
   ```
3. **Start the server** in the background (Bash, `run_in_background: true`):
   `TZ=UTC DATABASE_URL=file:./data/e2e.db npx next start -p 3200`
4. **Wait for it**: `for i in $(seq 1 30); do curl -s -o /dev/null -w "%{http_code}" http://localhost:3200/api/version | grep -q 200 && break; sleep 1; done`

If the background server gets stopped for low memory, just start it again when it's next needed.

## 3. Browser tests

```bash
npm run e2e -- http://localhost:3200      # ~8 minutes; give it a 15-minute timeout
npm run smoke -- http://localhost:3200    # every page (≈700) loads without an error screen
```

`scripts/e2e.ts` drives system Chrome as an iPhone-sized touch screen. When adding a feature, add a
test there. What these tests have taught:

- Headless Chrome reports a mouse, so `pointer-coarse:` styles and hover-vs-tap code don't run.
  For touch behaviour, emulate it in the test with a CDP session:
  `Emulation.setEmulatedMedia` with `pointer: coarse` and `hover: none` (see the "touch:" test).
- Steps slide in and out (framer-motion). After tapping Continue, wait ~350ms before touching the
  next question, or you'll tap the previous one on its way out.
- Wait for `networkidle` before tapping things whose behaviour changes after hydration.
- Lesson helpers must cope with retries: missed questions return until right, and a
  "Skip this one" link appears after three misses (the `answer()` helper taps it).
- A test that loops "until done" needs an escape; a hang usually means the flow changed.

For the Level/rank system, `data/e2e.db` state can be set directly (skill_ratings,
assessments, milestones tables) to open an exam; reset it afterwards.

## 4. Looking at it

For visual changes, take phone screenshots and actually look at them (Read the PNGs):

```bash
npx tsx .claude/skills/xiaobai-test/scripts/screens.ts "$TEMP/shots" /level /grammar --full
npx tsx .claude/skills/xiaobai-test/scripts/screens.ts "$TEMP/shots" --dark          # main pages, dark mode
npx tsx .claude/skills/xiaobai-test/scripts/screens.ts "$TEMP/shots" /scenarios/ordering-food --touch
```

It prints status, height, horizontal overflow and console errors per page. Save screenshots to the
session scratchpad, not the repo. For flows (finishing a lesson or check), write a short
playwright-core script in the scratchpad modelled on `scripts/e2e.ts`.

Afterwards, stop the server (the PowerShell port command above) so it doesn't hold memory.
