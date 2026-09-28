# 小白 Xiaobai

A Chinese-learning web app, from your first 你好 to reading short stories. It's built for daily use on a phone (installable on the iPhone home screen, and it works offline) and covers all of HSK 1–5.

## What it does

**Learn.** A guided path through the official 2012 HSK lists: all 2,520 words of HSK 1–5 in 419 short lessons across 88 units. Each lesson teaches a few words and often a grammar point, then practises them with:

- multiple choice and match-the-pairs;
- typing the meaning or the pinyin (with tones);
- building sentences from word tiles, and dictation (build what you hear);
- tracing a character's strokes;
- listening and translation.

Unit checkpoints let you test out of material you already know. Lessons added behind your progress never pull you back.

**Review.** Spaced repetition with [FSRS](https://github.com/open-spaced-repetition/ts-fsrs). Words come in from lessons. Listening and English → Chinese cards are added once a word has stuck. Each rating button shows when the card will come back.

**Practise.**

- Quizzes: flashcards, typed meanings, fill in the blank, and a Tricky words drill.
- **Problem words**: the words you keep missing, what might be tripping you up (a word that sounds the same, a shared character, missing it mostly when listening), and a place for a memory hook.
- A tone trainer and a numbers drill (prices, dates, times).
- **Read**: 32 graded stories, each written only with words you've already learned, with tap-to-look-up, pinyin over each word, read-aloud and comprehension questions.

**Explore.**

- **Scenarios**: 28 real-life situations (ordering food, the doctor, bubble tea, deliveries, the bank…). Phrases come in past, present and future versions, alongside two-voice dialogues with a "Your turn" mode, a listening mode and comprehension questions.
- **Grammar**: 57 grammar points with examples.
- **Library**: a dictionary search over CC-CEDICT, with English, pinyin and character search.
- **Radicals.**
- **Find a character**: draw an unknown character, or pick the parts you can see, to look it up. Recognition runs on the device.
- **Break it down**: paste any Chinese (a message, a menu, a paragraph) to read it word by word. Each word shows its pinyin, its meaning and how well you know it, with one tap to add it to your reviews.

**Around it.**

- A daily goal in points, with an evening push reminder.
- Weekly database snapshots, and a JSON backup you can download.
- Offline mode. Reviews and your next lessons work without a connection, and answers sync afterwards, with the time they were made, so card scheduling stays correct.

**Audio.** Native recordings for about 2,300 words. Everything else, including every sentence, uses Azure neural voices. Characters with more than one reading (了, 长, 吗…) have a recording for each reading.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Server Actions), React 19, TypeScript
- Tailwind CSS 4 and [shadcn/ui](https://ui.shadcn.com) (Base UI)
- SQLite via [Drizzle ORM](https://orm.drizzle.team) and libSQL: a local file in development, [Turso](https://turso.tech) in production
- [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) for scheduling; [Hanzi Writer](https://hanziwriter.org) for stroke animation and practice
- Web Push (VAPID) and a service worker for reminders and offline use
- Vitest for unit tests; Playwright (driving the installed Chrome) for end-to-end tests on an emulated phone

## Running it locally

Needs Node 20+.

```bash
npm install
npm run db:setup    # create data/app.db: migrations, HSK words, scenarios, dictionary
npm run dev         # http://localhost:3000
```

Other useful commands:

| Command                                  | What it does                                                                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                          | Formatting, lint, type check and unit tests (what CI runs, plus a build)                                                    |
| `npm run smoke -- http://localhost:3000` | Loads every page (every lesson, scenario, story…) and reports any that fail                                                 |
| `npm run e2e -- http://localhost:3200`   | Phone-sized end-to-end tests in Chrome (add `--headed` to watch). Run against a copy of the database: see the script header |
| `npm run db:generate` / `db:migrate`     | Create / apply database migrations after changing `src/db/schema.ts`                                                        |
| `npm run data:tts`                       | Generate missing audio with Azure (needs `.env.audio`; `-- --dry-run` to count first)                                       |
| `npm run data:find`                      | Rebuild the character-lookup data                                                                                           |

## Configuration

Locally nothing is required: the database is `data/app.db`, and the password gate is off.

For a deployment, set these environment variables:

| Variable                                  | Purpose                                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`  | The database (`DATABASE_URL` / `DATABASE_AUTH_TOKEN` also work)                              |
| `APP_PASSWORD`                            | Turns on a simple password gate for the whole app                                            |
| `VAPID_PRIVATE_KEY`                       | Signs push reminders; the public key is in `src/lib/push-config.ts`                          |
| `CRON_SECRET`                             | Protects `/api/cron/daily` (reminders and weekly snapshots), which Vercel Cron calls with it |
| `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` | Only for `npm run data:tts`, in `.env.audio`                                                 |

On Vercel, `npm run build` also brings a remote database up to date (migrations, seed data, the dictionary if it's empty) before building. See `scripts/deploy-db.ts`.

## Project layout

```
src/app/           pages (learn, study, quiz, scenarios, read, find, grammar, library, …)
src/lib/           app logic: curriculum, lesson builder, scheduling, audio, handwriting, …
src/lib/actions/   server actions (everything that writes)
src/lib/queries/   server-side reads
src/lib/curriculum/  the Learn path, HSK 1–5 (static data, tested for vocabulary order)
src/db/            Drizzle schema and client; migrations are in drizzle/
scripts/           data builders, seeding, audio generation, smoke and e2e tests
public/sw.js       service worker (reminders, offline)
```

The Learn path, grammar points, scenarios and stories are plain TypeScript data. Their tests check that every sentence uses only words taught by that point, and that pinyin matches the characters.

## Data and credits

- **HSK word lists** (2012 standard): [drkameleon/complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary), MIT, used to check HSK 1–4 and to source HSK 5
- **CC-CEDICT** dictionary: [cc-cedict.org](https://cc-cedict.org), CC BY-SA 4.0
- **Make Me a Hanzi** character data: [skishore/makemeahanzi](https://github.com/skishore/makemeahanzi), Arphic Public License / LGPL
- **Hanzi Writer data** stroke order: [chanind/hanzi-writer-data](https://github.com/chanind/hanzi-writer-data), Arphic Public License
- **Tatoeba** example sentences: [tatoeba.org](https://tatoeba.org), CC BY 2.0 FR, via ManyThings.org
- **Word recordings**: Shtooka project (speaker Yue Tan), curated in [hugolpz/audio-cmn](https://github.com/hugolpz/audio-cmn), CC BY-SA 3.0
- **Other audio**: generated with Microsoft Azure AI Speech neural voices

Full audio attribution is in [`public/audio/CREDITS.txt`](public/audio/CREDITS.txt).
