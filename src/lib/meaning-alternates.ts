// Short, everyday answers for words whose glosses are long ("to go on a
// business trip", "to work a temporary or casual job"). Typed meanings accept
// these as well as the word's own senses. Pure, so it can be tested.

const ALSO: Record<string, string[]> = {
  // Grammar words, glossed by what they do.
  的: ['possessive particle', 'possessive', "'s", 'of'],
  了: ['completed action', 'past tense', 'completion particle'],
  吗: ['question particle', 'yes no question'],
  呢: ['question particle', 'what about'],
  得: ['particle'],
  着: ['continuous particle', 'ing', 'continuous'],
  啊: ['exclamation', 'particle'],
  呀: ['exclamation', 'particle'],
  把: ['object marker'],
  被: ['passive', 'by'],
  正在: ['currently', 'right now', 'ing'],
  难道: ['could it be', 'is it possible'],
  之: ['possessive', 'of'],
  本: ['classifier for books'],
  打电话: ['make a call', 'phone call', 'call', 'phone', 'ring', 'call someone', 'phone someone'],
  吧: ['particle', "let's", 'right', 'suggestion', 'suggestion particle'],
  请假: ['ask for time off', 'take time off', 'take leave', 'day off', 'leave'],
  地: ['adverb particle', 'particle', 'ly'],
  不得不: ['have to', 'must', 'no choice', 'forced to', 'have no choice'],
  出差: ['business trip', 'work trip', 'travel for work', 'go on a work trip'],
  来不及: ['too late', 'no time', "can't make it", 'not in time'],
  来得及: ['in time', 'can make it', 'still time', 'enough time'],
  千万: ['must', 'be sure to', 'make sure', 'ten million'],
  是否: ['whether', 'if'],
  受不了: ["can't bear", 'unbearable', "can't take it", "can't stand it"],
  填空: ['fill in the blank', 'fill the blanks', 'fill blanks'],
  同时: ['simultaneously', 'meanwhile', 'same time'],
  以及: ['and', 'along with', 'as well'],
  应聘: ['apply for a job', 'apply', 'job application'],
  班主任: ['class teacher', 'homeroom teacher', 'form teacher', 'head teacher'],
  除夕: ["new year's eve", "chinese new year's eve"],
  打工: ['part-time job', 'work part time', 'part time job', 'side job', 'temporary job', 'work'],
  钓: ['fish', 'go fishing', 'fishing', 'angle'],
  扶: ['support', 'help up', 'hold up', 'steady', 'prop up'],
  华裔: ['chinese descent', 'overseas chinese', 'ethnic chinese'],
  及格: ['pass', 'pass an exam', 'pass a test'],
  戒烟: ['quit smoking', 'stop smoking', 'give up smoking'],
  届: ['session', 'term', 'graduating class'],
  尽力: ['try your best', 'do your best', 'try hard', 'best effort', 'do all you can'],
  敬爱: ['respect', 'revere', 'esteem', 'respect and love'],
  轻视: ['despise', 'belittle', 'underestimate', 'look down on'],
  日用品: ['daily necessities', 'everyday items', 'household items', 'daily items'],
  失眠: ['insomnia', "can't sleep", 'sleepless', 'sleeplessness'],
  使劲儿: ['use force', 'push hard', 'try hard', 'exert yourself', 'make an effort'],
  随时: ['any time', 'anytime', 'whenever'],
  碎: ['broken', 'shattered', 'smashed', 'in pieces'],
  体会: ['experience', 'understand', 'realise', 'realize', 'appreciate'],
  体验: ['experience', 'try out', 'experience firsthand'],
  业余: ['spare time', 'free time', 'amateur', 'part time', 'leisure'],
  元旦: ["new year's day", 'new year'],
  再三: ['repeatedly', 'again and again', 'over and over'],
  中旬: ['mid month', 'middle of the month', 'mid-month'],
  抓紧: ['hurry', 'hurry up', 'firm grip', 'grasp firmly', 'make the most of', 'waste no time'],
};

/** Extra answers accepted for a word, beyond its own senses. */
export function alsoAccepted(hanzi: string): string[] {
  return ALSO[hanzi] ?? [];
}

/** Every extra answer, for building the English word list. */
export function alsoAcceptedAll(): string[] {
  return Object.values(ALSO).flat();
}
