// Short passages used only in promotion exams, so you can't have read them
// before. Each uses only words up to its HSK level (checked by
// exam-passages.test.ts). The answer is written first; exams shuffle options.

import type { PathSentence } from '@/lib/curriculum/types';

export type ExamPassage = {
  level: number;
  title: string;
  lines: PathSentence[];
  questions: { question: string; options: string[]; answer: string }[];
};

const s = (hanzi: string, pinyin: string, meaning: string): PathSentence => ({
  hanzi,
  pinyin,
  meaning,
});

export const EXAM_PASSAGES: ExamPassage[] = [
  {
    level: 1,
    title: 'My friend',
    lines: [
      s(
        '我有一个中国朋友，他是医生。',
        'wǒ yǒu yí gè Zhōngguó péngyou, tā shì yīshēng.',
        'I have a Chinese friend who is a doctor.',
      ),
      s(
        '他住在北京，他家有四个人。',
        'tā zhù zài Běijīng, tā jiā yǒu sì gè rén.',
        'He lives in Beijing, and there are four people in his family.',
      ),
      s(
        '他很喜欢看电影，他的儿子喜欢看书。',
        'tā hěn xǐhuan kàn diànyǐng, tā de érzi xǐhuan kàn shū.',
        'He loves watching films, and his son likes reading.',
      ),
      s(
        '昨天下午，我和他去饭店吃米饭。',
        'zuótiān xiàwǔ, wǒ hé tā qù fàndiàn chī mǐfàn.',
        'Yesterday afternoon, he and I went to a restaurant to eat.',
      ),
      s(
        '我们吃了很多菜，喝了很多茶。',
        'wǒmen chī le hěn duō cài, hē le hěn duō chá.',
        'We ate lots of dishes and drank lots of tea.',
      ),
    ],
    questions: [
      {
        question: 'What does the friend do?',
        options: ["He's a doctor", "He's a teacher", "He's a student"],
        answer: "He's a doctor",
      },
      {
        question: 'How many people are in his family?',
        options: ['Four', 'Three', 'Five'],
        answer: 'Four',
      },
      {
        question: 'What does his son like?',
        options: ['Reading', 'Watching films', 'Drinking tea'],
        answer: 'Reading',
      },
    ],
  },
  {
    level: 2,
    title: 'A busy Saturday',
    lines: [
      s(
        '上个星期六，我六点就起床了。',
        'shàng gè xīngqīliù, wǒ liù diǎn jiù qǐchuáng le.',
        'Last Saturday I was up at six.',
      ),
      s(
        '跑步回来，我吃了两个鸡蛋，喝了牛奶。',
        'pǎobù huílái, wǒ chī le liǎng gè jīdàn, hē le niúnǎi.',
        'After a run I had two eggs and some milk.',
      ),
      s(
        '上午我和妹妹去商店买衣服。',
        'shàngwǔ wǒ hé mèimei qù shāngdiàn mǎi yīfu.',
        'In the morning my little sister and I went shopping for clothes.',
      ),
      s(
        '妹妹看见一件红衣服，非常喜欢。',
        'mèimei kànjiàn yí jiàn hóng yīfu, fēicháng xǐhuan.',
        'My sister saw a red top and loved it.',
      ),
      s(
        '但是那件衣服太贵了，要八百块。',
        'dànshì nà jiàn yīfu tài guì le, yào bābǎi kuài.',
        'But it was too expensive: eight hundred yuan.',
      ),
      s(
        '下午，她在旁边的商店买了一件便宜的红衣服，一百块钱。',
        'xiàwǔ, tā zài pángbiān de shāngdiàn mǎi le yí jiàn piányi de hóng yīfu, yìbǎi kuài qián.',
        'In the afternoon she bought a cheap red top in the shop next door for a hundred yuan.',
      ),
    ],
    questions: [
      {
        question: 'What did the writer do first that morning?',
        options: ['Went running', 'Went swimming', 'Went shopping'],
        answer: 'Went running',
      },
      {
        question: "Why didn't they buy the first red top?",
        options: ['It was too expensive', 'It was too small', "Her sister didn't like it"],
        answer: 'It was too expensive',
      },
      {
        question: 'How much was the top she bought?',
        options: ['A hundred yuan', 'Eight hundred yuan', 'Two hundred yuan'],
        answer: 'A hundred yuan',
      },
    ],
  },
  {
    level: 3,
    title: 'My neighbour',
    lines: [
      s(
        '我的邻居是一位八十多岁的老奶奶。',
        'wǒ de línjū shì yí wèi bāshí duō suì de lǎo nǎinai.',
        'My neighbour is an old lady in her eighties.',
      ),
      s(
        '她的腿不太好，所以很少出门。',
        'tā de tuǐ bú tài hǎo, suǒyǐ hěn shǎo chū mén.',
        "Her legs aren't good, so she rarely goes out.",
      ),
      s(
        '每个星期六，我都去超市给她买东西。',
        'měi gè xīngqīliù, wǒ dōu qù chāoshì gěi tā mǎi dōngxi.',
        'Every Saturday I go to the supermarket to shop for her.',
      ),
      s(
        '她总是给我讲她年轻时候的故事。',
        'tā zǒngshì gěi wǒ jiǎng tā niánqīng shíhou de gùshi.',
        'She always tells me stories from when she was young.',
      ),
      s(
        '上个月，她的儿子从别的城市回来看她。',
        'shàng gè yuè, tā de érzi cóng bié de chéngshì huílái kàn tā.',
        'Last month her son came back from another city to see her.',
      ),
      s(
        '她特别高兴，还做了一个很大的蛋糕。',
        'tā tèbié gāoxìng, hái zuò le yí gè hěn dà de dàngāo.',
        'She was overjoyed, and even made a huge cake.',
      ),
    ],
    questions: [
      {
        question: 'Why does the neighbour rarely go out?',
        options: ["Her legs aren't good", "She doesn't like people", "She's always busy"],
        answer: "Her legs aren't good",
      },
      {
        question: 'What does the writer do every Saturday?',
        options: ['Shops for her', 'Cooks for her', 'Takes her to hospital'],
        answer: 'Shops for her',
      },
      {
        question: 'Who came to visit last month?',
        options: ['Her son', 'Her daughter', 'A doctor'],
        answer: 'Her son',
      },
    ],
  },
  {
    level: 4,
    title: 'Big city or home town?',
    lines: [
      s(
        '很多年轻人毕业以后，都要做一个选择：留在大城市，还是回到自己出生的城市。',
        'hěn duō niánqīngrén bìyè yǐhòu, dōu yào zuò yí gè xuǎnzé: liú zài dà chéngshì, háishi huí dào zìjǐ chūshēng de chéngshì.',
        'After graduating, lots of young people face a choice: stay in a big city, or go back to the city they were born in.',
      ),
      s(
        '大城市的工资比较高，机会也多。',
        'dà chéngshì de gōngzī bǐjiào gāo, jīhuì yě duō.',
        'Big cities pay better and have more opportunities.',
      ),
      s(
        '但是生活压力很大，而且经常堵车。',
        'dànshì shēnghuó yālì hěn dà, érqiě jīngcháng dǔchē.',
        "But life there is stressful, and the traffic's always bad.",
      ),
      s(
        '我的一个朋友选择了回到出生的城市。',
        'wǒ de yí gè péngyou xuǎnzé le huí dào chūshēng de chéngshì.',
        'One of my friends chose to go back to the city he was born in.',
      ),
      s(
        '他说，那里的收入虽然少一些，但是离家近，有更多时间陪爸爸妈妈。',
        'tā shuō, nàlǐ de shōurù suīrán shǎo yìxiē, dànshì lí jiā jìn, yǒu gèng duō shíjiān péi bàba māma.',
        "He says he earns a bit less there, but he's close to home and has more time with his parents.",
      ),
      s(
        '其实，这个问题没有正确答案，关键是知道自己真正想要什么。',
        "qíshí, zhège wèntí méiyǒu zhèngquè dá'àn, guānjiàn shì zhīdào zìjǐ zhēnzhèng xiǎng yào shénme.",
        "Really, there's no right answer: the key is knowing what you actually want.",
      ),
    ],
    questions: [
      {
        question: 'What is good about big cities?',
        options: ['Better pay and more opportunities', 'Less traffic', 'Cheaper living'],
        answer: 'Better pay and more opportunities',
      },
      {
        question: 'Why did the friend go back?',
        options: ['To have more time with his parents', 'He lost his job', 'It pays better'],
        answer: 'To have more time with his parents',
      },
      {
        question: 'What does the writer conclude?',
        options: [
          "There's no right answer",
          'Everyone should stay in big cities',
          'Everyone should go home',
        ],
        answer: "There's no right answer",
      },
    ],
  },
  {
    level: 5,
    title: 'Slow living',
    lines: [
      s(
        '最近，越来越多的人开始追求“慢生活”。',
        'zuìjìn, yuè lái yuè duō de rén kāishǐ zhuīqiú "màn shēnghuó".',
        'Lately, more and more people are chasing "slow living".',
      ),
      s(
        '这些人认为，现代人太忙了，压力也太大。',
        'zhèxiē rén rènwéi, xiàndài rén tài máng le, yālì yě tài dà.',
        'They feel that people today are too busy and under too much pressure.',
      ),
      s(
        '有的人甚至辞职离开大城市，搬到农村去生活。',
        'yǒu de rén shènzhì cízhí líkāi dà chéngshì, bān dào nóngcūn qù shēnghuó.',
        'Some even quit their jobs and leave the big cities to live in the countryside.',
      ),
      s(
        '这种生活虽然简单，却让人更加幸福。',
        'zhè zhǒng shēnghuó suīrán jiǎndān, què ràng rén gèngjiā xìngfú.',
        'That kind of life is simple, but it makes people happier.',
      ),
      s('不过，也有人不同意。', 'búguò, yě yǒu rén bù tóngyì.', 'Not everyone agrees, though.'),
      s(
        '有的人说，不是每个人都有条件放弃稳定的工作。',
        'yǒu de rén shuō, bú shì měi gè rén dōu yǒu tiáojiàn fàngqì wěndìng de gōngzuò.',
        'They point out that not everyone can afford to give up a steady job.',
      ),
      s(
        '在这些人看来，关键不是住在哪里，而是能不能安排好自己的时间。',
        'zài zhèxiē rén kànlái, guānjiàn bú shì zhù zài nǎlǐ, ér shì néng bu néng ānpái hǎo zìjǐ de shíjiān.',
        "In their view, the key isn't where you live but whether you can manage your own time.",
      ),
    ],
    questions: [
      {
        question: 'Why are people drawn to "slow living"?',
        options: [
          'Life is too busy and stressful',
          'Cities are too expensive',
          'They want to travel',
        ],
        answer: 'Life is too busy and stressful',
      },
      {
        question: 'What have some people done?',
        options: ['Moved to the countryside', 'Moved abroad', 'Started their own companies'],
        answer: 'Moved to the countryside',
      },
      {
        question: 'What do the critics say matters most?',
        options: ['Managing your own time', 'Where you live', 'How much you earn'],
        answer: 'Managing your own time',
      },
    ],
  },
];

export const passageFor = (level: number) => EXAM_PASSAGES.find((p) => p.level === level);
