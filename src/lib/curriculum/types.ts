// The Learn path: units of short lessons, in HSK order. Static data, so it's
// versioned with the code; progress lives in the lesson_progress table.

export type PathSentence = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type DialogueLine = PathSentence & {
  /** 'you' lines become "what would you say?" questions. */
  speaker: 'you' | 'them';
};

export type Lesson = {
  /** Stable id stored in lesson_progress: "h1-u2-l3". Never rename. */
  id: string;
  title: string;
  /** New words, by hanzi. Each must be in the words table at this HSK level. */
  words: string[];
  /** A grammar point from grammar-data.ts, taught after the words. */
  grammar?: string;
  /**
   * Hand-written practice sentences, using only words reached by the end of
   * this lesson. Tatoeba sentences are added automatically once enough
   * vocabulary is known.
   */
  sentences?: PathSentence[];
};

export type Unit = {
  id: string;
  hskLevel: number;
  title: string;
  description: string;
  /** Related scenario: its phrases and dialogues round off the unit. */
  scenario?: string;
  lessons: Lesson[];
};
