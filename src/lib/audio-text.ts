// What to hand the speech engine so it says the right thing.
//
// Speech engines read a lone character with its most common reading, so a
// character with several readings can come out wrong on its own: 了 as liǎo
// instead of le, 干 as gān instead of gàn. For those we play a short word that
// forces the intended reading (干 gàn → 干什么) and tell the learner why.

/** "char|reading" → a short word or phrase that pins that reading down. */
const CONTEXT: Record<string, string> = {
  // Particles have a light (neutral) tone that engines can't produce alone.
  '了|le': '好了',
  '的|de': '我的',
  '着|zhe': '看着',
  '得|de': '跑得快',
  '地|de': '慢慢地',
  '呢|ne': '你呢',
  '吗|ma': '好吗',
  '吧|ba': '走吧',
  '啊|a': '好啊',
  '呀|ya': '好呀',
  '过|guo': '去过',
  // Characters with two everyday readings.
  '还|hái': '还是',
  '还|huán': '还钱',
  '长|cháng': '很长',
  '长|zhǎng': '长大',
  '重|zhòng': '很重',
  '重|chóng': '重新',
  '种|zhǒng': '这种',
  '种|zhòng': '种树',
  '干|gàn': '干什么',
  '干|gān': '干净',
  '空|kòng': '有空',
  '空|kōng': '天空',
  '差|chà': '差不多',
  '差|chā': '差别',
  '只|zhǐ': '只有',
  '只|zhī': '一只',
  '教|jiāo': '教书',
  '教|jiào': '教室',
  '为|wèi': '因为',
  '为|wéi': '认为',
  '倒|dào': '倒茶',
  '倒|dǎo': '摔倒',
  '行|xíng': '不行',
  '行|háng': '银行',
  '觉|jué': '觉得',
  '觉|jiào': '睡觉',
  '乐|lè': '快乐',
  '乐|yuè': '音乐',
  '发|fā': '发现',
  '发|fà': '头发',
  '数|shù': '数学',
  '数|shǔ': '数一数',
  '便|biàn': '方便',
  '便|pián': '便宜',
  '调|tiáo': '空调',
  '调|diào': '调查',
  '都|dōu': '都是',
  '都|dū': '首都',
  '好|hào': '爱好',
  '得|dé': '得到',
  '得|děi': '得去',
  '当|dàng': '上当',
  '少|shào': '少年',
  '要|yāo': '要求',
  '相|xiàng': '照相',
  '中|zhòng': '中奖',
  '看|kān': '看家',
  '量|liáng': '量一量',
  '背|bēi': '背包',
};

export type AudioText = {
  /** What to speak. */
  text: string;
  /** Set when a longer word is spoken so the reading comes out right. */
  via: string | null;
};

export function audioFor(hanzi: string, pinyin?: string | null): AudioText {
  if (!pinyin || Array.from(hanzi).length !== 1) return { text: hanzi, via: null };
  const reading = pinyin.normalize('NFC').toLowerCase().trim();
  const via = CONTEXT[`${hanzi}|${reading}`] ?? null;
  return via ? { text: via, via } : { text: hanzi, via: null };
}
