import { describe, expect, it } from 'vitest';
import { alsoAccepted } from './meaning-alternates';
import { gradeSentence, gradeWord, normalise, sensesOf, stem } from './meaning-grade';
import { hsk1 } from '../../scripts/data/hsk1';
import { hsk2 } from '../../scripts/data/hsk2';
import { hsk3 } from '../../scripts/data/hsk3';
import { hsk4 } from '../../scripts/data/hsk4';
import { hsk5 } from '../../scripts/data/hsk5';

const word = (answer: string, accepted: string[]) => gradeWord(answer, accepted).verdict;
const sentence = (answer: string, reference: string) => gradeSentence(answer, reference).verdict;

describe('normalise', () => {
  it('drops case, punctuation, brackets and expands contractions', () => {
    expect(normalise("I'm fine, thanks!")).toBe('i am fine thanks');
    expect(normalise('to eat (a meal)')).toBe('to eat');
    expect(normalise('Thank you')).toBe('thanks');
  });
});

describe('stem', () => {
  it('matches common endings', () => {
    expect(stem('eating')).toBe(stem('eat'));
    expect(stem('cities')).toBe(stem('city'));
    expect(stem('running')).toBe(stem('run'));
    expect(stem('dishes')).toBe(stem('dish'));
  });
});

describe('sensesOf', () => {
  it('splits on ; / and commas', () => {
    expect(sensesOf('safe, safety')).toEqual(['safe', 'safety']);
    expect(sensesOf('to eat / to consume; CL:個|个[ge4]')).toEqual(['to eat', 'to consume']);
  });
});

describe('gradeWord', () => {
  const eat = ['to eat', 'to consume', 'to have one’s meal'];
  it('accepts any sense, with or without "to"', () => {
    expect(word('eat', eat)).toBe('right');
    expect(word('to consume', eat)).toBe('right');
    expect(word('Eating', eat)).toBe('right');
  });
  it('allows small typos on longer words', () => {
    expect(word('restaraunt', ['restaurant'])).toBe('right');
    expect(word('car', ['cat'])).toBe('wrong');
  });
  it('calls part of a longer sense close', () => {
    expect(word('noodles', ['bowl of noodles'])).toBe('close');
  });
  it('ignores articles and placeholders like one’s and sb', () => {
    expect(word('go on business trip', ['to go on a business trip'])).toBe('right');
    expect(word('strive hardest', ["to strive one's hardest"])).toBe('right');
    expect(word('help up', ['to help sb up'])).toBe('right');
  });
  it('keeps prepositions and numbers meaningful', () => {
    expect(word('look at', ['to look for'])).not.toBe('right');
    expect(word('two hundred', ['one hundred'])).not.toBe('right');
    expect(sentence('I have two daughters', 'I have one daughter.')).not.toBe('right');
  });
  it('accepts "measure word" or "classifier" for a measure word', () => {
    const ben = ['measure word for books'];
    expect(word('measure word', ben)).toBe('right');
    expect(word('classifier', ben)).toBe('right');
    expect(word('classifier for books', ben)).toBe('right');
  });
  it('reads a gloss that is all brackets as the meaning', () => {
    const ge = sensesOf('(general measure word)');
    expect(word('general measure word', ge)).toBe('right');
    expect(word('measure word', ge)).toBe('right');
    const ma = sensesOf('(yes/no question particle)');
    expect(ma).toEqual(['(yes/no question particle)']);
    expect(word('yes', ma)).toBe('wrong');
    expect(word('measure word', sensesOf('(measure word for clothing/items)'))).toBe('right');
  });
  it('rejects unrelated answers', () => {
    expect(word('drink', eat)).toBe('wrong');
    expect(word('', eat)).toBe('wrong');
  });
});

describe('gradeSentence', () => {
  it('passes paraphrases that keep the key words', () => {
    expect(sentence("I'd like a bowl of noodles", "I'd like a bowl of noodles.")).toBe('right');
    expect(sentence('I want one bowl of noodles', "I'd like a bowl of noodles.")).toBe('right');
    expect(sentence('Please give me the menu', 'Please give me the menu.')).toBe('right');
    expect(sentence("i'm fine thank you", "I'm fine, thanks.")).toBe('right');
  });
  it('calls a partial answer close', () => {
    expect(sentence('give me menu', 'Please give me the menu.')).toBe('right');
    expect(sentence('the menu', 'Please give me the menu.')).toBe('wrong');
    expect(sentence('I want noodles', "I'd like a bowl of noodles.")).toBe('close');
  });
  it('fails a wrong answer', () => {
    expect(sentence('Where is the toilet?', 'Please give me the menu.')).toBe('wrong');
  });
});

describe('alsoAccepted', () => {
  const vocab = new Map([...hsk1, ...hsk2, ...hsk3, ...hsk4, ...hsk5].map((w) => [w.hanzi, w]));
  it('lets long glosses be answered briefly', () => {
    const accepts = (hanzi: string, answer: string) =>
      gradeWord(answer, [...sensesOf(vocab.get(hanzi)!.meaning), ...alsoAccepted(hanzi)]).verdict;
    expect(accepts('打电话', 'call')).toBe('right');
    expect(accepts('打工', 'part-time job')).toBe('right');
    expect(accepts('失眠', 'insomnia')).toBe('right');
    expect(accepts('不得不', 'have to')).toBe('right');
  });
  it('only lists HSK words', () => {
    for (const hanzi of ['打电话', '出差', '抓紧']) expect(vocab.has(hanzi)).toBe(true);
  });
});

describe('not fooled by look-alike answers', () => {
  const v = (answer: string, meaning: string) => gradeWord(answer, sensesOf(meaning)).verdict;
  it('a different real word is not a typo', () => {
    for (const [answer, meaning] of [
      ['mouth', 'month'],
      ['night', 'eight'],
      ['fine', 'five'],
      ['tree', 'three'],
      ['there', 'where'],
      ['talk', 'to walk'],
      ['waiter', 'water'],
      ['sheep', 'to sleep'],
      ['laughter', 'daughter'],
      ['impossible', 'possible'],
      ['unimportant', 'important'],
    ]) {
      expect(v(answer, meaning), `${answer} for ${meaning}`).toBe('wrong');
    }
  });
  it('still forgives real typos', () => {
    expect(v('restaraunt', 'restaurant')).toBe('right');
    expect(v('beautifull', 'beautiful')).toBe('right');
    expect(v('ice cream', 'icecream')).toBe('right');
  });
  it('an added wrong word or a lone short word is not close', () => {
    expect(v('left side', 'right side')).toBe('wrong');
    expect(v('go home', 'to go to work')).toBe('wrong');
    expect(v('me', 'excuse me')).toBe('wrong');
    expect(v('that year', 'this year')).toBe('wrong');
  });
  it('accepts digits for small numbers', () => {
    expect(v('10', 'ten')).toBe('right');
  });
});

describe('gradeSentence negation', () => {
  it('a negated answer is wrong', () => {
    expect(sentence('I am not a student', 'I am a student.')).toBe('wrong');
    expect(sentence("I don't like tea", 'I like tea.')).toBe('wrong');
    expect(sentence('I like tea', "I don't like tea.")).toBe('wrong');
    expect(sentence("I don't like tea", 'I do not like tea.')).toBe('right');
  });
});

describe('english word list', () => {
  it('is up to date (run npx tsx scripts/build-english-words.ts)', async () => {
    const { englishWordList } = await import('./english-words-source');
    const file = (await import('./generated/english-words.json')).default;
    expect(file).toEqual(englishWordList());
  });
});
