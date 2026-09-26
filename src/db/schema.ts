import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

/** Where a word came from: the HSK lists, the full dictionary, or typed in by you. */
export type WordSource = 'hsk' | 'dictionary' | 'custom';

export const words = sqliteTable(
  'words',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hanzi: text('hanzi').notNull(),
    pinyin: text('pinyin').notNull(),
    meaning: text('meaning').notNull(),
    hskLevel: integer('hsk_level'),
    frequency: integer('frequency'),
    source: text('source').$type<WordSource>().notNull().default('hsk'),
    /** Your own note, shown with the answer in study. */
    note: text('note'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    hanziUnique: uniqueIndex('words_hanzi_unique').on(t.hanzi),
  }),
);

export const sentences = sqliteTable(
  'sentences',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hanzi: text('hanzi').notNull(),
    pinyin: text('pinyin').notNull(),
    meaning: text('meaning').notNull(),
    difficulty: integer('difficulty'),
    /** Your own note, shown with the answer in study. */
    note: text('note'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    hanziUnique: uniqueIndex('sentences_hanzi_unique').on(t.hanzi),
  }),
);

export type TagType = 'scenario' | 'topic' | 'grammar' | 'custom';

export const tags = sqliteTable(
  'tags',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    type: text('type').$type<TagType>().notNull().default('custom'),
    description: text('description'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    slugUnique: uniqueIndex('tags_slug_unique').on(t.slug),
  }),
);

/** How a sentence belongs to a scenario: a main phrase, a time variant of one, or a dialogue line. */
export type SentenceRole = 'phrase' | 'variant' | 'dialogue';

export const sentenceTags = sqliteTable(
  'sentence_tags',
  {
    sentenceId: integer('sentence_id')
      .notNull()
      .references(() => sentences.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    role: text('role').$type<SentenceRole>().notNull().default('phrase'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.sentenceId, t.tagId] }),
  }),
);

export const wordTags = sqliteTable(
  'word_tags',
  {
    wordId: integer('word_id')
      .notNull()
      .references(() => words.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.wordId, t.tagId] }),
  }),
);

export const decks = sqliteTable('decks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type CardMode =
  | 'recognition'
  | 'production'
  | 'listening'
  | 'writing'
  | 'cloze'
  | 'sentence-recognition'
  | 'sentence-listening';
export type CardState = 'new' | 'learning' | 'review' | 'relearning';

export const cards = sqliteTable(
  'cards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    wordId: integer('word_id').references(() => words.id, { onDelete: 'cascade' }),
    sentenceId: integer('sentence_id').references(() => sentences.id, {
      onDelete: 'cascade',
    }),
    deckId: integer('deck_id').references(() => decks.id, { onDelete: 'set null' }),
    mode: text('mode').$type<CardMode>().notNull(),
    // FSRS state
    state: text('state').$type<CardState>().notNull().default('new'),
    stability: real('stability').notNull().default(0),
    difficulty: real('difficulty').notNull().default(0),
    due: integer('due', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    lastReview: integer('last_review', { mode: 'timestamp_ms' }),
    elapsedDays: real('elapsed_days').notNull().default(0),
    scheduledDays: real('scheduled_days').notNull().default(0),
    learningSteps: integer('learning_steps').notNull().default(0),
    reps: integer('reps').notNull().default(0),
    lapses: integer('lapses').notNull().default(0),
    suspended: integer('suspended', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    wordModeUnique: uniqueIndex('cards_word_mode_unique').on(t.wordId, t.mode),
    sentenceModeUnique: uniqueIndex('cards_sentence_mode_unique').on(t.sentenceId, t.mode),
  }),
);

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cardId: integer('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  reviewedAt: integer('reviewed_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  durationMs: integer('duration_ms').notNull().default(0),
  prevState: text('prev_state'),
  nextDue: integer('next_due', { mode: 'timestamp_ms' }).notNull(),
});

export type NewWordsFrom = 'path' | 'queue';

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey(),
  dailyNewLimit: integer('daily_new_limit').notNull().default(15),
  dailyReviewLimit: integer('daily_review_limit').notNull().default(200),
  retentionTarget: real('retention_target').notNull().default(0.9),
  /** Create listening cards for words and sentences once they graduate. */
  listeningEnabled: integer('listening_enabled', { mode: 'boolean' }).notNull().default(true),
  /** Create English → Chinese cards for words once they graduate. */
  productionEnabled: integer('production_enabled', { mode: 'boolean' }).notNull().default(true),
  /** Cards to review each day to hit your goal (0 = no goal). */
  dailyGoal: integer('daily_goal').notNull().default(20),
  /**
   * Where Study gets new HSK words: 'path' leaves them to lessons in Learn;
   * 'queue' introduces any new card up to the daily limit.
   */
  newWordsFrom: text('new_words_from').$type<NewWordsFrom>().notNull().default('path'),
  streakDays: integer('streak_days').notNull().default(0),
  lastStudyDate: text('last_study_date'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

/**
 * CC-CEDICT (https://cc-cedict.org, CC BY-SA 4.0), imported by
 * scripts/import-cedict.ts. Reference data: not included in backups.
 */
export const dictionary = sqliteTable(
  'dictionary',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    simplified: text('simplified').notNull(),
    traditional: text('traditional').notNull(),
    /** Tone marks, syllables separated by spaces: "nǐ hǎo". */
    pinyin: text('pinyin').notNull(),
    /** Letters only, for tone-insensitive search: "nihao". */
    pinyinPlain: text('pinyin_plain').notNull(),
    /** Letters with tone numbers, for tone-aware search: "ni3hao3". */
    pinyinTones: text('pinyin_tones').notNull(),
    /** Senses separated by " / ". */
    definitions: text('definitions').notNull(),
    /** Names and places (capitalised pinyin in CC-CEDICT) rank below common words. */
    proper: integer('proper', { mode: 'boolean' }).notNull().default(false),
    /**
     * Rough commonness for ranking: occurrences in the Tatoeba sentence corpus,
     * plus a large boost for HSK vocabulary. Set by the import script.
     */
    frequency: integer('frequency').notNull().default(0),
  },
  (t) => ({
    simplifiedIdx: index('dictionary_simplified').on(t.simplified),
    plainIdx: index('dictionary_pinyin_plain').on(t.pinyinPlain),
    tonesIdx: index('dictionary_pinyin_tones').on(t.pinyinTones),
  }),
);

export type DictionaryEntry = typeof dictionary.$inferSelect;

export type LessonStatus = 'done' | 'tested';

/** Lessons finished on the Learn path ('tested' = skipped by passing a unit checkpoint). */
export const lessonProgress = sqliteTable('lesson_progress', {
  /** Curriculum lesson id, e.g. "h1-u2-l3". */
  lessonId: text('lesson_id').primaryKey(),
  status: text('status').$type<LessonStatus>().notNull(),
  /** Best first-try accuracy, 0–100. */
  bestScore: integer('best_score').notNull().default(0),
  attempts: integer('attempts').notNull().default(0),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type FlagReason = 'translation' | 'pinyin' | 'audio' | 'too-hard' | 'too-easy' | 'other';

/** Something you flagged while studying (bad translation, odd audio…), to be fixed. */
export const flags = sqliteTable('flags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  /** What was flagged: the Chinese text, or a lesson id. */
  subject: text('subject').notNull(),
  /** The English/pinyin shown at the time, to recognise it later. */
  detail: text('detail'),
  reason: text('reason').$type<FlagReason>().notNull(),
  note: text('note'),
  /** Where you were: a page path or lesson id. */
  context: text('context'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
});

export type Flag = typeof flags.$inferSelect;

/** A phone/browser that asked for daily reminders (Web Push). */
export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  /** The device's IANA timezone, so "have you studied today?" uses your day. */
  timeZone: text('time_zone'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  lastSentAt: integer('last_sent_at', { mode: 'timestamp_ms' }),
});

/** Weekly copies of your data (the same JSON as a Settings backup), kept in the database. */
export const dbSnapshots = sqliteTable('db_snapshots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  data: text('data').notNull(),
});

export type PracticeKind = 'tone' | 'number' | 'cloze' | 'quiz' | 'listening';

/** One answer in a practice drill (tone trainer, numbers, fill in the blank, quiz). */
export const practiceLog = sqliteTable(
  'practice_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    kind: text('kind').$type<PracticeKind>().notNull(),
    /** What was asked: a word, a number, a syllable… */
    item: text('item').notNull(),
    correct: integer('correct', { mode: 'boolean' }).notNull(),
    /** Drill-specific JSON, e.g. {"heard":[2],"answered":[3]} for tones. */
    detail: text('detail'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    kindTime: index('practice_log_kind_time').on(t.kind, t.createdAt),
  }),
);

export type Word = typeof words.$inferSelect;
export type NewWord = typeof words.$inferInsert;
export type Sentence = typeof sentences.$inferSelect;
export type NewSentence = typeof sentences.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type Deck = typeof decks.$inferSelect;
export type Settings = typeof settings.$inferSelect;
