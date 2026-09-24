export type GrammarExample = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type GrammarPoint = {
  slug: string;
  name: string;
  englishTitle: string;
  hskLevel: number;
  formula?: string;
  description: string;
  examples: GrammarExample[];
  notes?: string;
};

export const grammarPoints: GrammarPoint[] = [
  {
    slug: 'basic-svo',
    name: '主语 + 动词 + 宾语',
    englishTitle: 'Basic sentence order (S + V + O)',
    hskLevel: 1,
    formula: 'Subject + Verb + Object',
    description:
      'Mandarin uses the same subject-verb-object order as English. Word endings do not change; word order does most of the work.',
    examples: [
      { hanzi: '我喝茶。', pinyin: 'wǒ hē chá.', meaning: 'I drink tea.' },
      { hanzi: '他看书。', pinyin: 'tā kàn shū.', meaning: 'He reads a book.' },
      { hanzi: '我们学中文。', pinyin: 'wǒmen xué Zhōngwén.', meaning: 'We study Chinese.' },
    ],
  },
  {
    slug: 'ma-yes-no',
    name: '吗 questions',
    englishTitle: 'Yes/no questions with 吗',
    hskLevel: 1,
    formula: 'Statement + 吗?',
    description:
      'Add 吗 to the end of any statement to make it a yes/no question. Nothing else changes.',
    examples: [
      { hanzi: '你好吗？', pinyin: 'nǐ hǎo ma?', meaning: 'How are you?' },
      { hanzi: '你去吗？', pinyin: 'nǐ qù ma?', meaning: 'Are you going?' },
      { hanzi: '你是学生吗？', pinyin: 'nǐ shì xuésheng ma?', meaning: 'Are you a student?' },
    ],
  },
  {
    slug: 'a-not-a',
    name: 'A-不-A questions',
    englishTitle: 'A-not-A yes/no questions',
    hskLevel: 2,
    formula: 'Verb/Adjective + 不 + Verb/Adjective',
    description:
      'Repeat the verb or adjective with 不 (or 没 for 有) between them. Equivalent to a 吗 question but a bit more colloquial.',
    examples: [
      { hanzi: '你去不去？', pinyin: 'nǐ qù bú qù?', meaning: 'Are you going or not?' },
      { hanzi: '好不好？', pinyin: 'hǎo bù hǎo?', meaning: 'Is it good?' },
      { hanzi: '你有没有钱？', pinyin: 'nǐ yǒu méi yǒu qián?', meaning: 'Do you have money?' },
    ],
  },
  {
    slug: 'wh-questions',
    name: 'WH questions',
    englishTitle: 'Question words in place',
    hskLevel: 1,
    formula: 'Statement with question word left in place',
    description:
      'Unlike English, question words (什么/谁/哪儿/什么时候/怎么/为什么) stay in the same slot as the answer would.',
    examples: [
      { hanzi: '你叫什么名字？', pinyin: 'nǐ jiào shénme míngzi?', meaning: "What's your name?" },
      { hanzi: '他是谁？', pinyin: 'tā shì shéi?', meaning: 'Who is he?' },
      { hanzi: '你在哪儿？', pinyin: 'nǐ zài nǎr?', meaning: 'Where are you?' },
      { hanzi: '你为什么不来？', pinyin: 'nǐ wèishénme bù lái?', meaning: "Why aren't you coming?" },
    ],
  },
  {
    slug: 'possessive-de',
    name: '的 possessive',
    englishTitle: '的 to show possession or description',
    hskLevel: 1,
    formula: 'Noun/Pronoun + 的 + Noun',
    description:
      '的 connects a modifier to what it describes. Roughly like English ’s or "of".',
    examples: [
      { hanzi: '我的书', pinyin: 'wǒ de shū', meaning: 'my book' },
      { hanzi: '老师的名字', pinyin: 'lǎoshī de míngzi', meaning: "the teacher's name" },
      { hanzi: '红色的车', pinyin: 'hóngsè de chē', meaning: 'the red car' },
    ],
    notes: 'For close family or body parts, 的 is often dropped: 我妈妈, 他眼睛.',
  },
  {
    slug: 'shi-de',
    name: '是...的 emphasis',
    englishTitle: 'Emphasize when / where / how of a past event',
    hskLevel: 3,
    formula: '是 + [time / place / manner] + Verb + 的',
    description:
      "Use 是...的 to focus on details (time, place, means, agent) of an already-known past event. It's not a general past marker.",
    examples: [
      { hanzi: '我是昨天来的。', pinyin: 'wǒ shì zuótiān lái de.', meaning: 'I came yesterday.' },
      { hanzi: '他是坐飞机来的。', pinyin: 'tā shì zuò fēijī lái de.', meaning: 'He came by plane.' },
      { hanzi: '你是从哪里来的？', pinyin: 'nǐ shì cóng nǎli lái de?', meaning: 'Where did you come from?' },
    ],
  },
  {
    slug: 'adj-predicate',
    name: 'Adjectival predicate',
    englishTitle: 'Adjectives as verbs',
    hskLevel: 1,
    formula: 'Subject + 很 + Adjective',
    description:
      "Chinese adjectives act like verbs — no 是 is needed. 很 (very) is usually inserted even without meaning 'very'.",
    examples: [
      { hanzi: '我很高。', pinyin: 'wǒ hěn gāo.', meaning: 'I am tall.' },
      { hanzi: '天气很好。', pinyin: 'tiānqì hěn hǎo.', meaning: 'The weather is good.' },
      { hanzi: '他不忙。', pinyin: 'tā bù máng.', meaning: 'He is not busy.' },
    ],
  },
  {
    slug: 'zai-location',
    name: '在 location',
    englishTitle: 'Say where something is or happens',
    hskLevel: 1,
    formula: 'Subject + 在 + Location (+ Verb)',
    description:
      '在 is used both as the main verb (to be at) and as a preposition before other verbs (at / in).',
    examples: [
      { hanzi: '我在学校。', pinyin: 'wǒ zài xuéxiào.', meaning: 'I am at school.' },
      { hanzi: '他在家吃饭。', pinyin: 'tā zài jiā chīfàn.', meaning: 'He eats at home.' },
    ],
  },
  {
    slug: 'time-when',
    name: 'Time-when placement',
    englishTitle: 'When to say when',
    hskLevel: 1,
    formula: 'Subject + Time + Verb + Object',
    description:
      'Specific times (今天, 明天, 8 点) go BEFORE the verb, unlike English where they may go at the end.',
    examples: [
      { hanzi: '我明天去。', pinyin: 'wǒ míngtiān qù.', meaning: 'I am going tomorrow.' },
      { hanzi: '他八点起床。', pinyin: 'tā bā diǎn qǐchuáng.', meaning: 'He gets up at 8.' },
    ],
  },
  {
    slug: 'time-duration',
    name: 'Time-duration placement',
    englishTitle: 'How long you did something',
    hskLevel: 2,
    formula: 'Subject + Verb + (Object) + Duration',
    description:
      'Duration expressions come AFTER the verb. If there is an object, either repeat the verb or place the duration between verb and object.',
    examples: [
      { hanzi: '我睡了八个小时。', pinyin: 'wǒ shuì le bā ge xiǎoshí.', meaning: 'I slept for 8 hours.' },
      { hanzi: '他学中文学了两年。', pinyin: 'tā xué Zhōngwén xué le liǎng nián.', meaning: 'He studied Chinese for 2 years.' },
    ],
  },
  {
    slug: 'you-possession',
    name: '有 possession / existence',
    englishTitle: 'Have / there is',
    hskLevel: 1,
    formula: 'Subject + 有 + Object',
    description:
      '有 covers both "to have" and "there is/are". Its negative is 没有, never 不有.',
    examples: [
      { hanzi: '我有一个哥哥。', pinyin: 'wǒ yǒu yí ge gēge.', meaning: 'I have an older brother.' },
      { hanzi: '桌子上有书。', pinyin: 'zhuōzi shàng yǒu shū.', meaning: 'There are books on the desk.' },
      { hanzi: '我没有钱。', pinyin: 'wǒ méi yǒu qián.', meaning: "I don't have money." },
    ],
  },
  {
    slug: 'bu-vs-mei',
    name: '不 vs 没',
    englishTitle: 'Two ways to negate',
    hskLevel: 1,
    description:
      '不 negates general or future actions and adjectives. 没 negates completed actions and 有. 不 + 是 = am/are not; 没 + 去 = did not go.',
    examples: [
      { hanzi: '我不去。', pinyin: 'wǒ bú qù.', meaning: "I'm not going." },
      { hanzi: '我没去。', pinyin: 'wǒ méi qù.', meaning: "I didn't go." },
      { hanzi: '我没有时间。', pinyin: 'wǒ méi yǒu shíjiān.', meaning: "I don't have time." },
    ],
  },
  {
    slug: 'le-completion',
    name: '了 (verb-了) completion',
    englishTitle: 'Marking a completed action',
    hskLevel: 2,
    formula: 'Verb + 了',
    description:
      "Verb-了 marks that an action has been completed. Don't over-use it — many past events don't need 了.",
    examples: [
      { hanzi: '我吃了两碗饭。', pinyin: 'wǒ chī le liǎng wǎn fàn.', meaning: 'I ate two bowls of rice.' },
      { hanzi: '他买了一本书。', pinyin: 'tā mǎi le yì běn shū.', meaning: 'He bought a book.' },
    ],
    notes:
      'If the object is a bare noun (我吃了饭), the sentence sounds unfinished — add a quantity (两碗饭), a follow-up clause (吃了饭就走), or use sentence-final 了 instead (我吃饭了).',
  },
  {
    slug: 'le-change-of-state',
    name: '了 (sentence-了) change of state',
    englishTitle: 'Marking a new situation',
    hskLevel: 2,
    formula: 'Statement + 了',
    description:
      'Sentence-final 了 marks that a new state has been reached — something is different now compared to before.',
    examples: [
      { hanzi: '我饿了。', pinyin: 'wǒ è le.', meaning: "I'm hungry now." },
      { hanzi: '下雨了。', pinyin: 'xià yǔ le.', meaning: "It's raining now." },
      { hanzi: '他不去了。', pinyin: 'tā bú qù le.', meaning: "He's not going anymore." },
    ],
  },
  {
    slug: 'zhe-ongoing-state',
    name: '着 ongoing state',
    englishTitle: 'Verb-着 for an ongoing state',
    hskLevel: 3,
    formula: 'Verb + 着',
    description:
      '着 attaches to a verb to describe an ongoing, static state — how someone is doing something, or a lingering result.',
    examples: [
      { hanzi: '他站着。', pinyin: 'tā zhàn zhe.', meaning: 'He is standing.' },
      { hanzi: '门开着。', pinyin: 'mén kāi zhe.', meaning: 'The door is open.' },
      { hanzi: '她笑着说。', pinyin: 'tā xiào zhe shuō.', meaning: "She said it smiling." },
    ],
  },
  {
    slug: 'guo-experience',
    name: '过 experience',
    englishTitle: 'Have you ever...?',
    hskLevel: 2,
    formula: 'Verb + 过',
    description:
      '过 marks that you have (or have not) experienced something at some point. Not tied to a specific time.',
    examples: [
      { hanzi: '我去过北京。', pinyin: 'wǒ qù guo Běijīng.', meaning: 'I have been to Beijing.' },
      { hanzi: '你吃过饺子吗？', pinyin: 'nǐ chī guo jiǎozi ma?', meaning: 'Have you ever had dumplings?' },
    ],
  },
  {
    slug: 'hui-neng-keyi',
    name: '会 / 能 / 可以',
    englishTitle: 'Three flavors of "can"',
    hskLevel: 2,
    description:
      '会 = learned skill. 能 = physical ability or circumstantial can. 可以 = permission or possibility.',
    examples: [
      { hanzi: '我会说中文。', pinyin: 'wǒ huì shuō Zhōngwén.', meaning: 'I can speak Chinese (I learned).' },
      { hanzi: '我不能来。', pinyin: 'wǒ bù néng lái.', meaning: "I can't come (something prevents it)." },
      { hanzi: '我可以走了吗？', pinyin: 'wǒ kěyǐ zǒu le ma?', meaning: 'May I leave now?' },
    ],
  },
  {
    slug: 'xiang-yao-yao',
    name: '想 vs 要',
    englishTitle: 'Want to (soft) vs need to (firm)',
    hskLevel: 2,
    description:
      '想 = would like to (softer, sometimes hypothetical). 要 = want to / need to / will (firmer, more assertive).',
    examples: [
      { hanzi: '我想去中国。', pinyin: 'wǒ xiǎng qù Zhōngguó.', meaning: "I'd like to go to China." },
      { hanzi: '我要走了。', pinyin: 'wǒ yào zǒu le.', meaning: 'I need to leave now.' },
    ],
  },
  {
    slug: 'bi-comparison',
    name: '比 comparison',
    englishTitle: 'A is more X than B',
    hskLevel: 3,
    formula: 'A + 比 + B + Adjective',
    description:
      'To compare A and B, use 比. Don\'t put 很 or 非常 before the adjective (✗ 他比我很高); 更 or 还 are fine (他比我更高 — "even taller"). For how much, add 一点儿, 多了 or 得多 after the adjective.',
    examples: [
      { hanzi: '他比我高。', pinyin: 'tā bǐ wǒ gāo.', meaning: 'He is taller than me.' },
      { hanzi: '今天比昨天冷一点。', pinyin: 'jīntiān bǐ zuótiān lěng yìdiǎn.', meaning: 'Today is a bit colder than yesterday.' },
    ],
  },
  {
    slug: 'yi-jiu',
    name: '一...就...',
    englishTitle: 'As soon as ..., then ...',
    hskLevel: 3,
    formula: 'Subject + 一 + Verb1, Subject + 就 + Verb2',
    description:
      'Immediate sequence — as soon as A happens, B follows.',
    examples: [
      { hanzi: '我一到家就睡觉。', pinyin: 'wǒ yí dào jiā jiù shuìjiào.', meaning: 'As soon as I get home I sleep.' },
      { hanzi: '他一喝酒就脸红。', pinyin: 'tā yì hē jiǔ jiù liǎn hóng.', meaning: 'His face turns red as soon as he drinks.' },
    ],
  },
  {
    slug: 'ba-disposal',
    name: '把 disposal construction',
    englishTitle: 'Rearrange to focus on what you did to something',
    hskLevel: 3,
    formula: 'Subject + 把 + Object + Verb + Complement',
    description:
      "Uses 把 to move the object before the verb. Focuses on what happened TO the object. Almost always needs a complement (了 alone doesn't count — usually a result, direction, or place).",
    examples: [
      { hanzi: '我把书放在桌子上。', pinyin: 'wǒ bǎ shū fàng zài zhuōzi shàng.', meaning: 'I put the book on the table.' },
      { hanzi: '请把门关上。', pinyin: 'qǐng bǎ mén guānshàng.', meaning: 'Please close the door.' },
    ],
  },
  {
    slug: 'bei-passive',
    name: '被 passive',
    englishTitle: 'Passive voice',
    hskLevel: 3,
    formula: 'Subject + 被 + (Agent) + Verb + Complement',
    description:
      'Passive marker. Usually reserved for negative or unfortunate outcomes.',
    examples: [
      { hanzi: '我的手机被偷了。', pinyin: 'wǒ de shǒujī bèi tōu le.', meaning: 'My phone was stolen.' },
      { hanzi: '他被老板批评了。', pinyin: 'tā bèi lǎobǎn pīpíng le.', meaning: 'He was criticized by the boss.' },
    ],
  },
  {
    slug: 'reduplication',
    name: 'Verb reduplication',
    englishTitle: '"To have a quick look" style',
    hskLevel: 2,
    formula: 'Verb + Verb  /  Verb + 一 + Verb',
    description:
      'Reduplicating a verb softens the action — "have a quick / brief try". Casual and friendly.',
    examples: [
      { hanzi: '你看看。', pinyin: 'nǐ kàn kan.', meaning: 'Take a look.' },
      { hanzi: '我想试一试。', pinyin: 'wǒ xiǎng shì yi shì.', meaning: "I'd like to have a try." },
    ],
  },
  {
    slug: 'de-complement',
    name: '得 degree complement',
    englishTitle: 'How well / how much did you do it?',
    hskLevel: 3,
    formula: 'Verb + 得 + Adjective',
    description:
      "Add 得 after a verb to describe how the action was done. Different 得 from 的.",
    examples: [
      { hanzi: '他跑得很快。', pinyin: 'tā pǎo de hěn kuài.', meaning: 'He runs fast.' },
      { hanzi: '你说得很好。', pinyin: 'nǐ shuō de hěn hǎo.', meaning: 'You speak very well.' },
    ],
  },
  {
    slug: 'yin-suo',
    name: '因为...所以...',
    englishTitle: 'Because ..., therefore ...',
    hskLevel: 2,
    formula: '因为 + Cause, 所以 + Result',
    description:
      'Standard cause-and-result pair. Often either half can be dropped in casual speech.',
    examples: [
      { hanzi: '因为下雨，所以我不去了。', pinyin: 'yīnwèi xià yǔ, suǒyǐ wǒ bú qù le.', meaning: 'Because it’s raining, I’m not going.' },
    ],
  },
  {
    slug: 'suiran-danshi',
    name: '虽然...但是...',
    englishTitle: 'Although ..., but ...',
    hskLevel: 2,
    formula: '虽然 + Clause1, 但是 + Clause2',
    description:
      'Although X, still Y. Chinese usually keeps both 虽然 and 但是, unlike English.',
    examples: [
      { hanzi: '虽然很累，但是我很开心。', pinyin: 'suīrán hěn lèi, dànshì wǒ hěn kāixīn.', meaning: "Although I'm tired, I'm happy." },
    ],
  },
  {
    slug: 'budan-erqie',
    name: '不但...而且...',
    englishTitle: 'Not only ..., but also ...',
    hskLevel: 3,
    formula: '不但 + Clause1, 而且 + Clause2',
    description:
      'Add-on construction — the second clause reinforces the first.',
    examples: [
      { hanzi: '他不但会中文，而且会日文。', pinyin: 'tā búdàn huì Zhōngwén, érqiě huì Rìwén.', meaning: 'He speaks not only Chinese but also Japanese.' },
    ],
  },
  {
    slug: 'measure-words',
    name: 'Measure words',
    englishTitle: 'Counting with the right classifier',
    hskLevel: 1,
    formula: 'Number + Measure Word + Noun',
    description:
      "Every counted noun needs a measure word. 个 is the default; specific ones exist for many kinds of things (本 for books, 张 for flat things, 只 for animals, 辆 for vehicles).",
    examples: [
      { hanzi: '一个人', pinyin: 'yí ge rén', meaning: 'one person' },
      { hanzi: '两本书', pinyin: 'liǎng běn shū', meaning: 'two books' },
      { hanzi: '三张桌子', pinyin: 'sān zhāng zhuōzi', meaning: 'three tables' },
    ],
  },
  {
    slug: 'directional-complements',
    name: 'Directional complements',
    englishTitle: '上/下/进/出/回/过 + 来/去',
    hskLevel: 3,
    description:
      'Verbs of motion pair with a direction (上 up, 下 down, 进 in, 出 out, 回 back, 过 across) and 来 (toward speaker) or 去 (away).',
    examples: [
      { hanzi: '请进来！', pinyin: 'qǐng jìn lái!', meaning: 'Please come in!' },
      { hanzi: '他跑出去了。', pinyin: 'tā pǎo chū qù le.', meaning: 'He ran out.' },
    ],
  },
];
