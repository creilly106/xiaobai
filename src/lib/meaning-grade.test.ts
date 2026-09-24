import { describe, expect, it } from 'vitest';
import { gradeSentence, gradeWord, normalise, sensesOf, stem } from './meaning-grade';

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
