---
name: xiaobai-ship
description: How to ship a Xiaobai change to production — checks, commit message, push to master (which auto-deploys to Vercel), then confirm CI and the deploy went green; plus how to build big features on a branch that can't deploy. Use this at the end of every piece of work on the Xiaobai app, whenever asked to "ship", "push", "deploy", "commit", or "put it live", and when starting any feature too large to finish in one go.
---

# Shipping Xiaobai

Conor uses the live app (https://xiaobai-blue.vercel.app) every day, and master deploys straight
to it. Shipping is part of finishing work: once checks pass, commit, push and verify — don't stop
to ask whether to ship. Do still confirm anything destructive to his live data, anything costing
money, or anything published outside the repo and site.

## Steps

1. **Test first.** Run `npm run check`; for behaviour or UI changes, also follow the xiaobai-test
   skill (build, e2e, smoke). If a tool hiccups (a command check erroring, a server killed for low
   memory), retry and carry on rather than handing back.
2. **Commit** on master with a message that says what changed for the learner, not just the code:
   a short summary line, then plain-English bullets of what's different and why. End with the
   co-author line the harness provides. Example:
   ```
   Lessons: missed questions come back until they're right

   A wrong answer used to come back at most twice, so the last question of a
   lesson could end it still wrong. Now every missed question returns at the end
   until it's answered correctly; after three misses a "Skip this one" link appears.
   ```
3. **Push**: `git push -q`
4. **Verify**: `bash .claude/skills/xiaobai-ship/scripts/watch-deploy.sh` — waits for GitHub
   Actions CI and the Vercel status on the commit and prints both. Only call it done when both are
   green. On a CI failure it prints the failing lines: fix, commit, push, watch again.

## Things that have bitten before

- **CI builds with no database.** A page that queries the database before Next knows it's dynamic
  gets pre-rendered at build time and fails in CI (Vercel, which can reach the database, passes —
  so the deploy can look fine while CI is red). Make the first await in such a page, or in the
  query it calls first, `await connection()` from `next/server`.
- **Migrations**: `npm run db:generate` after schema changes; rename the generated file to say what
  it does (and its tag in `drizzle/meta/_journal.json`). Production migrates itself at deploy
  (prebuild → `scripts/deploy-db.ts`); local databases don't — run `npm run db:migrate` for
  `data/app.db` and `data/e2e.db` yourself.
- **Server actions that call `revalidatePath`** re-render the page you're on. Fine for most pages;
  wrong for a page that redirects once its job is done (the promotion exam did this).
- **Audio** is committed under `public/audio` (~140 MB, fine for now; GitHub is happy to ~1 GB).

## Big features: build on a branch that can't deploy

Conor doesn't want half-built features in his live app. For anything bigger than one sitting:

1. `git checkout -b <feature>`, then add to `vercel.json`:
   `"git": { "deploymentEnabled": { "<feature>": false } }` and commit that first.
2. Push the branch as you go (`git push -u origin <feature>`) so work survives a session ending;
   confirm with watch-deploy that no Vercel deploy appears for the branch.
3. Note the branch and its state in memory, so the next session can resume it.
4. When it's complete and tested end to end: remove the `git` entry from `vercel.json`, merge with
   `git merge --no-ff`, run migrations locally, check, push master, watch, then delete the branch
   (`git branch -d` and `git push origin --delete`).
