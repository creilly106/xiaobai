'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import { normaliseTypedPinyin } from '@/lib/cedict';
import { shortMeaning } from '@/lib/dictionary-search';
import { lookupExact } from '@/lib/queries/lookup';
import { queueWordsFor } from '@/lib/queue-words';
import { isCjk } from '@/lib/text';

const MY_SENTENCES_TAG = 'my-sentences';

export type CustomItem = {
  kind: 'word' | 'sentence';
  hanzi: string;
  pinyin: string;
  meaning: string;
  note?: string;
};

type Result = { ok: true; message: string } | { ok: false; message: string };

function clean(item: CustomItem): CustomItem | string {
  const hanzi = String(item.hanzi ?? '').trim();
  const pinyin = normaliseTypedPinyin(String(item.pinyin ?? ''));
  const meaning = String(item.meaning ?? '').trim();
  const note = String(item.note ?? '').trim();
  if (!hanzi || !isCjk(hanzi)) return 'Enter the Chinese characters.';
  if (Array.from(hanzi).length > (item.kind === 'sentence' ? 60 : 12)) {
    return item.kind === 'sentence'
      ? 'Keep sentences under 60 characters.'
      : 'That looks like a sentence — switch to Sentence.';
  }
  if (!pinyin) return 'Enter the pinyin (tone numbers like ni3 hao3 are fine).';
  if (!meaning) return 'Enter what it means.';
  if (meaning.length > 200 || note.length > 500 || pinyin.length > 200) return 'That’s a bit long.';
  return { kind: item.kind === 'sentence' ? 'sentence' : 'word', hanzi, pinyin, meaning, note };
}

/** Pinyin and meaning from the dictionary, to pre-fill the add form. */
export async function suggestFor(
  hanzi: string,
): Promise<{ pinyin: string; meaning: string } | null> {
  const h = String(hanzi ?? '').trim();
  if (!h || !isCjk(h) || Array.from(h).length > 12) return null;
  const entry = await lookupExact(h);
  return entry ? { pinyin: entry.pinyin, meaning: shortMeaning(entry.senses.join(' / ')) } : null;
}

/** Add your own word or sentence and put it into study. */
export async function addCustomItem(input: CustomItem): Promise<Result> {
  const item = clean(input);
  if (typeof item === 'string') return { ok: false, message: item };

  if (item.kind === 'word') {
    const [existing] = await db
      .select({ id: schema.words.id })
      .from(schema.words)
      .where(eq(schema.words.hanzi, item.hanzi))
      .limit(1);
    let wordId = existing?.id;
    if (wordId) {
      if (item.note)
        await db.update(schema.words).set({ note: item.note }).where(eq(schema.words.id, wordId));
    } else {
      const [row] = await db
        .insert(schema.words)
        .values({
          hanzi: item.hanzi,
          pinyin: item.pinyin,
          meaning: item.meaning,
          source: 'custom',
          note: item.note || null,
        })
        .returning({ id: schema.words.id });
      wordId = row.id;
    }
    await db.insert(schema.cards).values({ wordId, mode: 'recognition' }).onConflictDoNothing();
    revalidatePath('/library');
    revalidatePath('/');
    return {
      ok: true,
      message: existing
        ? `${item.hanzi} was already in your library — it's in study now.`
        : `Added ${item.hanzi} to study.`,
    };
  }

  // Sentences go under a "My sentences" tag so the scenario seed never prunes them.
  const [existing] = await db
    .select({ id: schema.sentences.id })
    .from(schema.sentences)
    .where(eq(schema.sentences.hanzi, item.hanzi))
    .limit(1);
  let sentenceId = existing?.id;
  if (!sentenceId) {
    const [row] = await db
      .insert(schema.sentences)
      .values({
        hanzi: item.hanzi,
        pinyin: item.pinyin,
        meaning: item.meaning,
        note: item.note || null,
      })
      .returning({ id: schema.sentences.id });
    sentenceId = row.id;
  }
  let [tag] = await db
    .select({ id: schema.tags.id })
    .from(schema.tags)
    .where(eq(schema.tags.slug, MY_SENTENCES_TAG))
    .limit(1);
  if (!tag) {
    [tag] = await db
      .insert(schema.tags)
      .values({ slug: MY_SENTENCES_TAG, name: 'My sentences', type: 'custom' })
      .returning({ id: schema.tags.id });
  }
  await db.insert(schema.sentenceTags).values({ sentenceId, tagId: tag.id }).onConflictDoNothing();
  await db
    .insert(schema.cards)
    .values({ sentenceId, mode: 'sentence-recognition' })
    .onConflictDoNothing();
  const words = await queueWordsFor([item.hanzi]);
  revalidatePath('/library');
  revalidatePath('/');
  return {
    ok: true,
    message:
      `Added the sentence to study` +
      (words > 0 ? ` along with ${words} word${words === 1 ? '' : 's'} it uses.` : '.'),
  };
}

/** Remove one of your own sentences (and its cards and review history). */
export async function removeMySentence(sentenceId: number): Promise<Result> {
  if (!Number.isInteger(sentenceId)) return { ok: false, message: 'Unknown sentence.' };
  const [tagged] = await db
    .select({ id: schema.sentences.id })
    .from(schema.sentences)
    .innerJoin(schema.sentenceTags, eq(schema.sentenceTags.sentenceId, schema.sentences.id))
    .innerJoin(schema.tags, eq(schema.tags.id, schema.sentenceTags.tagId))
    .where(and(eq(schema.sentences.id, sentenceId), eq(schema.tags.slug, MY_SENTENCES_TAG)))
    .limit(1);
  if (!tagged) return { ok: false, message: 'Only your own sentences can be removed.' };
  await db.delete(schema.sentences).where(eq(schema.sentences.id, sentenceId));
  revalidatePath('/library');
  revalidatePath('/');
  return { ok: true, message: 'Sentence removed.' };
}

/** Save (or clear) your note on a word or sentence. */
export async function saveNote(
  target: { wordId: number } | { sentenceId: number },
  note: string,
): Promise<Result> {
  const text =
    String(note ?? '')
      .trim()
      .slice(0, 500) || null;
  if ('wordId' in target && Number.isInteger(target.wordId)) {
    const [w] = await db
      .update(schema.words)
      .set({ note: text })
      .where(eq(schema.words.id, target.wordId))
      .returning({ hanzi: schema.words.hanzi });
    if (!w) return { ok: false, message: 'Unknown word.' };
    revalidatePath(`/characters/${encodeURIComponent(w.hanzi)}`);
  } else if ('sentenceId' in target && Number.isInteger(target.sentenceId)) {
    await db
      .update(schema.sentences)
      .set({ note: text })
      .where(eq(schema.sentences.id, target.sentenceId));
  } else {
    return { ok: false, message: 'Unknown item.' };
  }
  revalidatePath('/library');
  return { ok: true, message: text ? 'Note saved.' : 'Note removed.' };
}
