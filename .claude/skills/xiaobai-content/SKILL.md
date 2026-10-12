---
name: xiaobai-content
description: How to write Chinese learning content for Xiaobai (graded stories, scenario phrases and dialogues, exam passages, lesson sentences, grammar examples) so it only uses words the Learn path has taught, passes the content tests, and gets audio. Use this whenever adding or editing anything in story-data.ts, scenario-data.ts, curriculum/hsk*.ts, grammar-data.ts or level/exam-passages.ts, or when asked for "more stories", "new scenarios", "another HSK level", example sentences, or reading passages — even if the request doesn't mention vocabulary checks.
---

# Writing content for Xiaobai

Xiaobai teaches HSK 2012 vocabulary through a fixed Learn path (`src/lib/curriculum`). Almost
everything learners read is checked by tests against what that path has taught by a given lesson,
so content written from general knowledge of Chinese usually fails. Write _against the word list_,
check, fix, then generate audio.

## Where content lives

| What                    | File                                                                    | Checked by                                                           |
| ----------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Graded stories          | `src/lib/story-data.ts` (each has `after`: the lesson it unlocks after) | `story-data.test.ts` — words taught by `after`, plus ≤3 `extras`     |
| Scenarios               | `src/lib/scenario-data.ts`                                              | `scenario-data.test.ts` — pinyin syllables, repeated lines identical |
| Promotion-exam passages | `src/lib/level/exam-passages.ts`                                        | `exam-passages.test.ts` — words up to the end of that HSK level      |
| Lessons                 | `src/lib/curriculum/hsk*.ts`                                            | `curriculum.test.ts` — sentences use words reached so far            |
| Grammar points          | `src/lib/grammar-data.ts`                                               | `grammar-data.test.ts`                                               |

## The vocabulary trap (read this first)

The path contains the HSK lists' exact entries. Many everyday compositional words are **not** words
on their own, so the segmenter can't cover them:

- Not taught alone: 饭 (only 米饭, 饭店, 饭馆), 天 (only 今天/明天/天气…), 们 (only 我们 — **他们 and 你们 are never taught**), 学 (use 学习), 帮 (use 帮助/帮忙), 杯 (only 杯子), 见 (only 看见/见面), 车 (only 出租车/自行车…), 山 (only 爬山), 心 (only 心情…), 每天, 今年, 夏天, 第二, 一点儿, 回家 is fine (回 + 家).
- Later than you'd think: 可是 (HSK 4), 以后 (end of HSK 3), 一定/更/自己 (late HSK 3), 常常 never (use 经常).
- Greedy longest-match segmentation (max 5 characters) can mis-split: 二十分钟 → 二 / 十分 (very) / 钟 once 十分 is taught. Rephrase (半个小时).
- Extras (names, a glossed compound) are capped at 3 per story and must be ≤5 characters.

Before writing for a given unlock point, print what's available:

```bash
npx tsx .claude/skills/xiaobai-content/scripts/words.ts list h3-u4-l4     # everything taught by that lesson
npx tsx .claude/skills/xiaobai-content/scripts/words.ts new hsk:4 h5-u5-l7  # what one stretch adds
npx tsx .claude/skills/xiaobai-content/scripts/words.ts has h3-u4-l4 可是 饭 他们
```

## Workflow

1. **Pick placement.** Stories should fill gaps in the path (list units and where stories sit before choosing `after`). Exam passages use the whole level.
2. **Draft into a JSON file** of `{ hanzi, pinyin, meaning }` lines (scratchpad, not the repo) and check it:
   ```bash
   npx tsx .claude/skills/xiaobai-content/scripts/check-lines.ts h3-u4-l4 drafts.json 安娜 王朋
   ```
   Fix every ✗ by rephrasing with listed words, not by adding extras. Iterate until clean.
3. **Write it in** following the file's existing style. Notes:
   - Stories: Anna (安娜) and Wang Peng (王朋) recur; use the shared `ANNA` / `WANG_PENG` constants. Keep the array in path order (by `after`), since the Read page and "Next story" follow it.
   - Questions: write the right answer first in `options` — the UI shuffles. Three plausible options.
   - Pinyin: one syllable per character (erhua 儿 may merge), tone marks, sentence punctuation kept.
   - Scenario lines: the same hanzi must have the same pinyin and meaning everywhere (they're stored once); `difficulty` ≈ HSK level; variants need distinct time labels.
4. **Run the tests**: `npx vitest run src/lib/story-data.test.ts` (or the relevant one), then `npm run check`.
5. **Database**: scenario changes must be seeded locally — `npm run db:seed-scenarios` and again with `DATABASE_URL=file:./data/e2e.db`. Production seeds itself at deploy.
6. **Audio**: `npm run data:tts -- --dry-run` to see the count, then `npm run data:tts`. Azure's free tier (F0) allows 500k characters a month and can't bill; a typical batch is a few thousand characters. Clips land in `public/audio` and are committed.
7. Update counts in `README.md` if they changed (stories, scenarios), then ship (see the xiaobai-ship skill).

## Quality bar

Natural, useful Chinese a learner would actually meet; short sentences at the level; recurring
characters for warmth; questions that need the text to answer. Avoid death/violence in examples.
If a line can't be written naturally with the taught words, pick a different line rather than
forcing awkward Chinese.
