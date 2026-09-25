// Scenario content: phrases (with optional versions in other time frames)
// and short dialogues. Synced into the database by scripts/seed-scenarios.ts
// so every line can be studied; the scenario page reads the structure here.
import type { DialogueLine } from './curriculum/types';

/** Chinese marks time with words like 了, 过, 在 and 要 rather than tenses. */
export type TimeLabel = 'Now' | 'Past' | 'Ongoing' | 'Future' | 'Ever' | 'Already' | 'Not yet';

export type SentenceVariant = {
  label: TimeLabel;
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type ScenarioSentence = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  difficulty?: number;
  /** What time frame the sentence itself is in, when it has variants (default Now). */
  label?: TimeLabel;
  /** The same idea in other time frames. */
  variants?: SentenceVariant[];
};

export type ScenarioDialogue = {
  title: string;
  lines: DialogueLine[];
};

export type Scenario = {
  slug: string;
  name: string;
  description: string;
  sentences: ScenarioSentence[];
  dialogues?: ScenarioDialogue[];
};

export const scenarioBySlug = (slug: string) => scenarios.find((s) => s.slug === slug);

export const scenarios: Scenario[] = [
  {
    slug: 'meeting-someone',
    name: 'Meeting someone',
    description: 'Introductions, greetings, and first hellos.',
    sentences: [
      { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Hello.', difficulty: 1 },
      { hanzi: '你好吗？', pinyin: 'nǐ hǎo ma?', meaning: 'How are you?', difficulty: 1 },
      { hanzi: '我很好，谢谢。', pinyin: 'wǒ hěn hǎo, xièxie.', meaning: "I'm fine, thanks.", difficulty: 1 },
      { hanzi: '你叫什么名字？', pinyin: 'nǐ jiào shénme míngzi?', meaning: "What's your name?", difficulty: 1 },
      { hanzi: '我叫康纳。', pinyin: 'wǒ jiào Kāngnà.', meaning: 'My name is Conor.', difficulty: 1 },
      { hanzi: '很高兴认识你。', pinyin: 'hěn gāoxìng rènshi nǐ.', meaning: 'Nice to meet you.', difficulty: 2 },
      { hanzi: '你是哪国人？', pinyin: 'nǐ shì nǎ guó rén?', meaning: 'What country are you from?', difficulty: 2 },
      { hanzi: '我是爱尔兰人。', pinyin: 'wǒ shì Ài’ěrlán rén.', meaning: 'I am Irish.', difficulty: 2 },
      { hanzi: '再见。', pinyin: 'zàijiàn.', meaning: 'Goodbye.', difficulty: 1 },
      { hanzi: '明天见！', pinyin: 'míngtiān jiàn!', meaning: 'See you tomorrow!', difficulty: 1 },
    ],
    dialogues: [
      {
        title: 'First meeting',
        lines: [
          { speaker: 'them', hanzi: '你好！我叫王明。你叫什么名字？', pinyin: 'nǐ hǎo! wǒ jiào Wáng Míng. nǐ jiào shénme míngzi?', meaning: 'Hi! I\'m Wang Ming. What\'s your name?' },
          { speaker: 'you', hanzi: '你好，我叫康纳。', pinyin: 'nǐ hǎo, wǒ jiào Kāngnà.', meaning: 'Hi, I\'m Conor.' },
          { speaker: 'them', hanzi: '很高兴认识你！你是哪国人？', pinyin: 'hěn gāoxìng rènshi nǐ! nǐ shì nǎ guó rén?', meaning: 'Nice to meet you! Where are you from?' },
          { speaker: 'you', hanzi: '我是爱尔兰人。你呢？', pinyin: 'wǒ shì Ài’ěrlán rén. nǐ ne?', meaning: 'I\'m Irish. And you?' },
          { speaker: 'them', hanzi: '我是北京人。你来中国多久了？', pinyin: 'wǒ shì Běijīng rén. nǐ lái Zhōngguó duō jiǔ le?', meaning: 'I\'m from Beijing. How long have you been in China?' },
          { speaker: 'you', hanzi: '我来了两个星期了。', pinyin: 'wǒ lái le liǎng ge xīngqī le.', meaning: 'I\'ve been here two weeks.' },
          { speaker: 'them', hanzi: '你的中文很好！', pinyin: 'nǐ de Zhōngwén hěn hǎo!', meaning: 'Your Chinese is really good!' },
          { speaker: 'you', hanzi: '哪里哪里，我还在学。', pinyin: 'nǎli nǎli, wǒ hái zài xué.', meaning: 'Not at all — I\'m still learning.' },
        ],
      },
    ],
  },
  {
    slug: 'ordering-food',
    name: 'Ordering food',
    description: 'At a restaurant, tea house, or noodle shop.',
    sentences: [
      { hanzi: '请给我菜单。', pinyin: 'qǐng gěi wǒ càidān.', meaning: 'Please give me the menu.', difficulty: 2 },
      { hanzi: '你们有什么推荐？', pinyin: 'nǐmen yǒu shénme tuījiàn?', meaning: 'What do you recommend?', difficulty: 3 },
      { hanzi: '我想要一碗面条。', pinyin: 'wǒ xiǎng yào yì wǎn miàntiáo.', meaning: "I'd like a bowl of noodles.", difficulty: 2, variants: [
        { label: 'Past', hanzi: '我要了一碗面条。', pinyin: 'wǒ yào le yì wǎn miàntiáo.', meaning: 'I ordered a bowl of noodles.' },
      ] },
      { hanzi: '我不吃辣的。', pinyin: 'wǒ bù chī là de.', meaning: "I don't eat spicy food.", difficulty: 2, variants: [
        { label: 'Past', hanzi: '我没吃辣的。', pinyin: 'wǒ méi chī là de.', meaning: 'I didn\'t eat the spicy food.' },
      ] },
      { hanzi: '这是什么？', pinyin: 'zhè shì shénme?', meaning: "What's this?", difficulty: 1 },
      { hanzi: '很好吃！', pinyin: 'hěn hǎochī!', meaning: 'Very tasty!', difficulty: 1 },
      { hanzi: '再来一杯茶。', pinyin: 'zài lái yì bēi chá.', meaning: 'Another cup of tea, please.', difficulty: 2 },
      { hanzi: '多少钱？', pinyin: 'duōshao qián?', meaning: 'How much?', difficulty: 1 },
      { hanzi: '买单，谢谢。', pinyin: 'mǎidān, xièxie.', meaning: 'The bill, thanks.', difficulty: 2 },
    ],
    dialogues: [
      {
        title: 'At a noodle restaurant',
        lines: [
          { speaker: 'them', hanzi: '你好，几位？', pinyin: 'nǐ hǎo, jǐ wèi?', meaning: 'Hello, how many of you?' },
          { speaker: 'you', hanzi: '一位。请给我菜单。', pinyin: 'yí wèi. qǐng gěi wǒ càidān.', meaning: 'Just one. Could I have the menu, please?' },
          { speaker: 'them', hanzi: '好的。你想吃什么？', pinyin: 'hǎo de. nǐ xiǎng chī shénme?', meaning: 'Sure. What would you like?' },
          { speaker: 'you', hanzi: '你们有什么推荐？', pinyin: 'nǐmen yǒu shénme tuījiàn?', meaning: 'What do you recommend?' },
          { speaker: 'them', hanzi: '我们的牛肉面很好吃。', pinyin: 'wǒmen de niúròu miàn hěn hǎochī.', meaning: 'Our beef noodles are delicious.' },
          { speaker: 'you', hanzi: '好，我要一碗牛肉面。不要太辣。', pinyin: 'hǎo, wǒ yào yì wǎn niúròu miàn. bú yào tài là.', meaning: 'OK, I\'ll have a bowl of beef noodles. Not too spicy.' },
          { speaker: 'them', hanzi: '喝点儿什么？', pinyin: 'hē diǎnr shénme?', meaning: 'Anything to drink?' },
          { speaker: 'you', hanzi: '一杯茶，谢谢。', pinyin: 'yì bēi chá, xièxie.', meaning: 'A cup of tea, thanks.' },
        ],
      },
      {
        title: 'Paying the bill',
        lines: [
          { speaker: 'you', hanzi: '买单，谢谢。', pinyin: 'mǎidān, xièxie.', meaning: 'The bill, thanks.' },
          { speaker: 'them', hanzi: '一共五十八块。', pinyin: 'yígòng wǔshíbā kuài.', meaning: 'That\'s 58 yuan altogether.' },
          { speaker: 'you', hanzi: '可以用微信付吗？', pinyin: 'kěyǐ yòng Wēixìn fù ma?', meaning: 'Can I pay with WeChat?' },
          { speaker: 'them', hanzi: '可以，请扫这里。', pinyin: 'kěyǐ, qǐng sǎo zhèlǐ.', meaning: 'Yes, please scan here.' },
          { speaker: 'you', hanzi: '好了。很好吃，谢谢！', pinyin: 'hǎo le. hěn hǎochī, xièxie!', meaning: 'Done. It was delicious, thanks!' },
          { speaker: 'them', hanzi: '不客气，欢迎再来！', pinyin: 'bú kèqi, huānyíng zài lái!', meaning: 'You\'re welcome — come again!' },
        ],
      },
    ],
  },
  {
    slug: 'getting-around',
    name: 'Getting around',
    description: 'Directions, taxis, and finding places.',
    sentences: [
      { hanzi: '请问，火车站在哪儿？', pinyin: 'qǐngwèn, huǒchēzhàn zài nǎr?', meaning: 'Excuse me, where is the train station?', difficulty: 2 },
      { hanzi: '一直走。', pinyin: 'yìzhí zǒu.', meaning: 'Go straight.', difficulty: 2 },
      { hanzi: '往左拐。', pinyin: 'wǎng zuǒ guǎi.', meaning: 'Turn left.', difficulty: 2 },
      { hanzi: '往右拐。', pinyin: 'wǎng yòu guǎi.', meaning: 'Turn right.', difficulty: 2 },
      { hanzi: '我想去这个地方。', pinyin: 'wǒ xiǎng qù zhège dìfang.', meaning: 'I want to go to this place.', difficulty: 2, variants: [
        { label: 'Ever', hanzi: '我去过这个地方。', pinyin: 'wǒ qù guo zhège dìfang.', meaning: 'I\'ve been to this place.' },
        { label: 'Future', hanzi: '我明天要去这个地方。', pinyin: 'wǒ míngtiān yào qù zhège dìfang.', meaning: 'I\'m going to this place tomorrow.' },
      ] },
      { hanzi: '请到机场。', pinyin: 'qǐng dào jīchǎng.', meaning: 'Please take me to the airport.', difficulty: 2 },
      { hanzi: '离这儿远吗？', pinyin: 'lí zhèr yuǎn ma?', meaning: 'Is it far from here?', difficulty: 2 },
      { hanzi: '要多长时间？', pinyin: 'yào duō cháng shíjiān?', meaning: 'How long will it take?', difficulty: 3, label: 'Future', variants: [
        { label: 'Past', hanzi: '用了多长时间？', pinyin: 'yòng le duō cháng shíjiān?', meaning: 'How long did it take?' },
      ] },
      { hanzi: '这里可以停车吗？', pinyin: 'zhèlǐ kěyǐ tíngchē ma?', meaning: 'Can I park here?', difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'Asking for directions',
        lines: [
          { speaker: 'you', hanzi: '请问，火车站在哪儿？', pinyin: 'qǐngwèn, huǒchēzhàn zài nǎr?', meaning: 'Excuse me, where is the train station?' },
          { speaker: 'them', hanzi: '一直走，到了路口往左拐。', pinyin: 'yìzhí zǒu, dào le lùkǒu wǎng zuǒ guǎi.', meaning: 'Go straight, and turn left at the intersection.' },
          { speaker: 'you', hanzi: '离这儿远吗？', pinyin: 'lí zhèr yuǎn ma?', meaning: 'Is it far from here?' },
          { speaker: 'them', hanzi: '不太远，走路十分钟就到了。', pinyin: 'bú tài yuǎn, zǒulù shí fēnzhōng jiù dào le.', meaning: 'Not too far — it\'s ten minutes on foot.' },
          { speaker: 'you', hanzi: '谢谢你！', pinyin: 'xièxie nǐ!', meaning: 'Thank you!' },
          { speaker: 'them', hanzi: '不客气。', pinyin: 'bú kèqi.', meaning: 'You\'re welcome.' },
        ],
      },
    ],
  },
  {
    slug: 'at-the-bar',
    name: 'At a bar',
    description: 'Drinks, toasts, and casual chat.',
    sentences: [
      { hanzi: '你想喝什么？', pinyin: 'nǐ xiǎng hē shénme?', meaning: 'What do you want to drink?', difficulty: 2, variants: [
        { label: 'Past', hanzi: '你喝了什么？', pinyin: 'nǐ hē le shénme?', meaning: 'What did you drink?' },
      ] },
      { hanzi: '我要一杯啤酒。', pinyin: 'wǒ yào yì bēi píjiǔ.', meaning: "I'd like a beer.", difficulty: 2, variants: [
        { label: 'Past', hanzi: '我喝了一杯啤酒。', pinyin: 'wǒ hē le yì bēi píjiǔ.', meaning: 'I had a beer.' },
        { label: 'Already', hanzi: '我已经喝了三杯啤酒。', pinyin: 'wǒ yǐjīng hē le sān bēi píjiǔ.', meaning: 'I\'ve already had three beers.' },
      ] },
      { hanzi: '给我一杯红酒。', pinyin: 'gěi wǒ yì bēi hóngjiǔ.', meaning: 'Give me a glass of red wine.', difficulty: 2 },
      { hanzi: '干杯！', pinyin: 'gānbēi!', meaning: 'Cheers!', difficulty: 1 },
      { hanzi: '我请客。', pinyin: 'wǒ qǐngkè.', meaning: "It's on me.", difficulty: 3, variants: [
        { label: 'Future', hanzi: '下次我请客。', pinyin: 'xià cì wǒ qǐngkè.', meaning: 'Next time it\'s on me.' },
      ] },
      { hanzi: '再来一杯。', pinyin: 'zài lái yì bēi.', meaning: 'One more, please.', difficulty: 2 },
      { hanzi: '你常来这里吗？', pinyin: 'nǐ cháng lái zhèlǐ ma?', meaning: 'Do you come here often?', difficulty: 3, variants: [
        { label: 'Ever', hanzi: '你来过这里吗？', pinyin: 'nǐ lái guo zhèlǐ ma?', meaning: 'Have you been here before?' },
      ] },
      { hanzi: '这家酒吧很不错。', pinyin: 'zhè jiā jiǔbā hěn búcuò.', meaning: 'This bar is really nice.', difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'Drinks with a friend',
        lines: [
          { speaker: 'them', hanzi: '你想喝什么？', pinyin: 'nǐ xiǎng hē shénme?', meaning: 'What do you want to drink?' },
          { speaker: 'you', hanzi: '我要一杯啤酒。你呢？', pinyin: 'wǒ yào yì bēi píjiǔ. nǐ ne?', meaning: 'I\'ll have a beer. You?' },
          { speaker: 'them', hanzi: '我也要啤酒。今天我请客！', pinyin: 'wǒ yě yào píjiǔ. jīntiān wǒ qǐngkè!', meaning: 'Beer for me too. Today it\'s on me!' },
          { speaker: 'you', hanzi: '谢谢！那下次我请客。', pinyin: 'xièxie! nà xià cì wǒ qǐngkè.', meaning: 'Thanks! Then next time\'s on me.' },
          { speaker: 'them', hanzi: '好！干杯！', pinyin: 'hǎo! gānbēi!', meaning: 'Deal! Cheers!' },
          { speaker: 'you', hanzi: '干杯！', pinyin: 'gānbēi!', meaning: 'Cheers!' },
        ],
      },
    ],
  },
  {
    slug: 'small-talk',
    name: 'Small talk',
    description: 'Weather, work, family, and everyday chat.',
    sentences: [
      { hanzi: '今天天气很好。', pinyin: 'jīntiān tiānqì hěn hǎo.', meaning: "The weather's nice today.", difficulty: 1, variants: [
        { label: 'Past', hanzi: '昨天天气很好。', pinyin: 'zuótiān tiānqì hěn hǎo.', meaning: 'The weather was nice yesterday.' },
        { label: 'Future', hanzi: '明天天气会很好。', pinyin: 'míngtiān tiānqì huì hěn hǎo.', meaning: 'The weather will be nice tomorrow.' },
      ] },
      { hanzi: '最近怎么样？', pinyin: 'zuìjìn zěnmeyàng?', meaning: 'How have things been recently?', difficulty: 2 },
      { hanzi: '还行，就是有点忙。', pinyin: 'hái xíng, jiùshì yǒudiǎn máng.', meaning: "Not bad, just a bit busy.", difficulty: 3 },
      { hanzi: '你做什么工作？', pinyin: 'nǐ zuò shénme gōngzuò?', meaning: 'What do you do for work?', difficulty: 2 },
      { hanzi: '我是软件工程师。', pinyin: 'wǒ shì ruǎnjiàn gōngchéngshī.', meaning: 'I am a software engineer.', difficulty: 3 },
      { hanzi: '你有兄弟姐妹吗？', pinyin: 'nǐ yǒu xiōngdì jiěmèi ma?', meaning: 'Do you have siblings?', difficulty: 3 },
      { hanzi: '你的爱好是什么？', pinyin: 'nǐ de àihào shì shénme?', meaning: "What's your hobby?", difficulty: 3 },
      { hanzi: '周末你做什么？', pinyin: 'zhōumò nǐ zuò shénme?', meaning: 'What do you do on weekends?', difficulty: 2, variants: [
        { label: 'Past', hanzi: '周末你做了什么？', pinyin: 'zhōumò nǐ zuò le shénme?', meaning: 'What did you do at the weekend?' },
        { label: 'Future', hanzi: '这个周末你打算做什么？', pinyin: 'zhège zhōumò nǐ dǎsuàn zuò shénme?', meaning: 'What are you planning to do this weekend?' },
      ] },
    ],
    dialogues: [
      {
        title: 'Catching up',
        lines: [
          { speaker: 'them', hanzi: '好久不见！最近怎么样？', pinyin: 'hǎo jiǔ bú jiàn! zuìjìn zěnmeyàng?', meaning: 'Long time no see! How have you been?' },
          { speaker: 'you', hanzi: '还行，就是有点忙。你呢？', pinyin: 'hái xíng, jiùshì yǒudiǎn máng. nǐ ne?', meaning: 'Not bad, just a bit busy. You?' },
          { speaker: 'them', hanzi: '我也很忙。周末你做了什么？', pinyin: 'wǒ yě hěn máng. zhōumò nǐ zuò le shénme?', meaning: 'Busy too. What did you do at the weekend?' },
          { speaker: 'you', hanzi: '我去爬山了。天气很好。', pinyin: 'wǒ qù pá shān le. tiānqì hěn hǎo.', meaning: 'I went hiking. The weather was great.' },
          { speaker: 'them', hanzi: '真不错！下次叫上我吧。', pinyin: 'zhēn búcuò! xià cì jiào shang wǒ ba.', meaning: 'Nice! Bring me along next time.' },
          { speaker: 'you', hanzi: '好啊，一起去！', pinyin: 'hǎo a, yìqǐ qù!', meaning: 'Sure, let\'s go together!' },
        ],
      },
    ],
  },
  {
    slug: 'shopping',
    name: 'Shopping',
    description: 'Markets, stores, and haggling.',
    sentences: [
      { hanzi: '这个多少钱？', pinyin: 'zhège duōshao qián?', meaning: 'How much is this?', difficulty: 1, variants: [
        { label: 'Past', hanzi: '这个花了多少钱？', pinyin: 'zhège huā le duōshao qián?', meaning: 'How much did this cost?' },
      ] },
      { hanzi: '太贵了！', pinyin: 'tài guì le!', meaning: 'Too expensive!', difficulty: 2 },
      { hanzi: '便宜一点儿吧。', pinyin: 'piányi yìdiǎnr ba.', meaning: 'A bit cheaper, please.', difficulty: 3 },
      { hanzi: '我要这个。', pinyin: 'wǒ yào zhège.', meaning: 'I want this one.', difficulty: 1, variants: [
        { label: 'Past', hanzi: '我买了这个。', pinyin: 'wǒ mǎi le zhège.', meaning: 'I bought this.' },
      ] },
      { hanzi: '有别的颜色吗？', pinyin: 'yǒu bié de yánsè ma?', meaning: 'Are there other colors?', difficulty: 2 },
      { hanzi: '可以试试吗？', pinyin: 'kěyǐ shìshi ma?', meaning: 'Can I try it on?', difficulty: 2 },
      { hanzi: '有大一号的吗？', pinyin: 'yǒu dà yí hào de ma?', meaning: 'Do you have this one size bigger?', difficulty: 3 },
      { hanzi: '可以刷卡吗？', pinyin: 'kěyǐ shuā kǎ ma?', meaning: 'Can I pay by card?', difficulty: 3 },
      { hanzi: '给我发票，谢谢。', pinyin: 'gěi wǒ fāpiào, xièxie.', meaning: 'A receipt, please.', difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'Bargaining at the market',
        lines: [
          { speaker: 'you', hanzi: '这个多少钱？', pinyin: 'zhège duōshao qián?', meaning: 'How much is this?' },
          { speaker: 'them', hanzi: '一百五十块。', pinyin: 'yìbǎi wǔshí kuài.', meaning: '150 yuan.' },
          { speaker: 'you', hanzi: '太贵了！便宜一点儿吧。', pinyin: 'tài guì le! piányi yìdiǎnr ba.', meaning: 'Too expensive! A bit cheaper?' },
          { speaker: 'them', hanzi: '那一百二十块，怎么样？', pinyin: 'nà yìbǎi èrshí kuài, zěnmeyàng?', meaning: 'Then 120 — how\'s that?' },
          { speaker: 'you', hanzi: '一百块吧。', pinyin: 'yìbǎi kuài ba.', meaning: 'How about 100?' },
          { speaker: 'them', hanzi: '好吧，一百块。', pinyin: 'hǎo ba, yìbǎi kuài.', meaning: 'Fine, 100.' },
          { speaker: 'you', hanzi: '可以刷卡吗？', pinyin: 'kěyǐ shuā kǎ ma?', meaning: 'Can I pay by card?' },
          { speaker: 'them', hanzi: '可以。', pinyin: 'kěyǐ.', meaning: 'Sure.' },
        ],
      },
    ],
  },
  {
    slug: 'relationships',
    name: 'Relationships',
    description: 'Dating, feelings, and meeting the family.',
    sentences: [
      { hanzi: '你有男朋友吗？', pinyin: 'nǐ yǒu nánpéngyǒu ma?', meaning: 'Do you have a boyfriend?', difficulty: 2 },
      { hanzi: '你有女朋友吗？', pinyin: 'nǐ yǒu nǚpéngyǒu ma?', meaning: 'Do you have a girlfriend?', difficulty: 2 },
      { hanzi: '你结婚了吗？', pinyin: 'nǐ jiéhūn le ma?', meaning: 'Are you married?', difficulty: 3 },
      { hanzi: '我喜欢你。', pinyin: 'wǒ xǐhuan nǐ.', meaning: 'I like you.', difficulty: 1, variants: [
        { label: 'Ever', hanzi: '我喜欢过你。', pinyin: 'wǒ xǐhuan guo nǐ.', meaning: 'I liked you once.' },
      ] },
      { hanzi: '我爱你。', pinyin: 'wǒ ài nǐ.', meaning: 'I love you.', difficulty: 1 },
      { hanzi: '我们出去吃饭吧。', pinyin: 'wǒmen chūqù chīfàn ba.', meaning: "Let's go out to eat.", difficulty: 3, variants: [
        { label: 'Past', hanzi: '我们出去吃饭了。', pinyin: 'wǒmen chūqù chīfàn le.', meaning: 'We went out to eat.' },
        { label: 'Future', hanzi: '我们明天出去吃饭吧。', pinyin: 'wǒmen míngtiān chūqù chīfàn ba.', meaning: 'Let\'s go out to eat tomorrow.' },
      ] },
      { hanzi: '你今天很漂亮。', pinyin: 'nǐ jīntiān hěn piàoliang.', meaning: "You look beautiful today.", difficulty: 2, variants: [
        { label: 'Past', hanzi: '你昨天很漂亮。', pinyin: 'nǐ zuótiān hěn piàoliang.', meaning: 'You looked beautiful yesterday.' },
      ] },
      { hanzi: '我想认识你的家人。', pinyin: 'wǒ xiǎng rènshi nǐ de jiārén.', meaning: 'I want to meet your family.', difficulty: 3, variants: [
        { label: 'Ever', hanzi: '我见过你的家人。', pinyin: 'wǒ jiàn guo nǐ de jiārén.', meaning: 'I\'ve met your family.' },
        { label: 'Future', hanzi: '我下个月要见你的家人。', pinyin: 'wǒ xià ge yuè yào jiàn nǐ de jiārén.', meaning: 'I\'m meeting your family next month.' },
      ] },
      { hanzi: '我们在一起吧。', pinyin: 'wǒmen zài yìqǐ ba.', meaning: "Let's be together.", difficulty: 3 },
      { hanzi: '你想我吗？', pinyin: 'nǐ xiǎng wǒ ma?', meaning: 'Do you miss me?', difficulty: 2, variants: [
        { label: 'Past', hanzi: '你想我了吗？', pinyin: 'nǐ xiǎng wǒ le ma?', meaning: 'Did you miss me?' },
        { label: 'Future', hanzi: '你会想我吗？', pinyin: 'nǐ huì xiǎng wǒ ma?', meaning: 'Will you miss me?' },
      ] },
    ],
    dialogues: [
      {
        title: 'Did you miss me?',
        lines: [
          { speaker: 'them', hanzi: '我回来了！', pinyin: 'wǒ huílái le!', meaning: 'I\'m back!' },
          { speaker: 'you', hanzi: '你终于回来了！', pinyin: 'nǐ zhōngyú huílái le!', meaning: 'You\'re finally back!' },
          { speaker: 'them', hanzi: '你想我了吗？', pinyin: 'nǐ xiǎng wǒ le ma?', meaning: 'Did you miss me?' },
          { speaker: 'you', hanzi: '当然想了！你呢？', pinyin: 'dāngrán xiǎng le! nǐ ne?', meaning: 'Of course I did! And you?' },
          { speaker: 'them', hanzi: '我每天都想你。', pinyin: 'wǒ měitiān dōu xiǎng nǐ.', meaning: 'I missed you every day.' },
          { speaker: 'you', hanzi: '今天晚上我们出去吃饭吧。', pinyin: 'jīntiān wǎnshang wǒmen chūqù chīfàn ba.', meaning: 'Let\'s go out to eat tonight.' },
        ],
      },
    ],
  },
  {
    slug: 'at-the-doctor',
    name: 'At the doctor',
    description: 'Symptoms, prescriptions, and appointments.',
    sentences: [
      { hanzi: '我不舒服。', pinyin: 'wǒ bù shūfu.', meaning: "I don't feel well.", difficulty: 3, variants: [
        { label: 'Past', hanzi: '我昨天不舒服。', pinyin: 'wǒ zuótiān bù shūfu.', meaning: 'I didn\'t feel well yesterday.' },
      ] },
      { hanzi: '我头疼。', pinyin: 'wǒ tóu téng.', meaning: 'My head hurts.', difficulty: 3, variants: [
        { label: 'Past', hanzi: '我昨天头疼。', pinyin: 'wǒ zuótiān tóu téng.', meaning: 'I had a headache yesterday.' },
      ] },
      { hanzi: '我发烧了。', pinyin: 'wǒ fāshāo le.', meaning: 'I have a fever.', difficulty: 3 },
      { hanzi: '我感冒了。', pinyin: 'wǒ gǎnmào le.', meaning: 'I have a cold.', difficulty: 3 },
      { hanzi: '我咳嗽。', pinyin: 'wǒ késou.', meaning: 'I have a cough.', difficulty: 3 },
      { hanzi: '哪里疼？', pinyin: 'nǎli téng?', meaning: 'Where does it hurt?', difficulty: 3 },
      { hanzi: '请开一些药。', pinyin: 'qǐng kāi yìxiē yào.', meaning: 'Please prescribe some medicine.', difficulty: 3 },
      { hanzi: '一天吃几次？', pinyin: 'yì tiān chī jǐ cì?', meaning: 'How many times a day should I take it?', difficulty: 3 },
      { hanzi: '我需要看医生。', pinyin: 'wǒ xūyào kàn yīshēng.', meaning: 'I need to see a doctor.', difficulty: 2, variants: [
        { label: 'Past', hanzi: '我看了医生。', pinyin: 'wǒ kàn le yīshēng.', meaning: 'I saw a doctor.' },
        { label: 'Future', hanzi: '我明天要去看医生。', pinyin: 'wǒ míngtiān yào qù kàn yīshēng.', meaning: 'I\'m going to see a doctor tomorrow.' },
      ] },
      { hanzi: '多喝水，多休息。', pinyin: 'duō hē shuǐ, duō xiūxi.', meaning: 'Drink lots of water and rest.', difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'Seeing a doctor',
        lines: [
          { speaker: 'them', hanzi: '你哪里不舒服？', pinyin: 'nǐ nǎli bù shūfu?', meaning: 'What\'s the problem?' },
          { speaker: 'you', hanzi: '我头疼，还有点发烧。', pinyin: 'wǒ tóu téng, hái yǒudiǎn fāshāo.', meaning: 'I have a headache and a bit of a fever.' },
          { speaker: 'them', hanzi: '从什么时候开始的？', pinyin: 'cóng shénme shíhou kāishǐ de?', meaning: 'When did it start?' },
          { speaker: 'you', hanzi: '昨天晚上开始的。', pinyin: 'zuótiān wǎnshang kāishǐ de.', meaning: 'Last night.' },
          { speaker: 'them', hanzi: '你感冒了。我给你开一些药。', pinyin: 'nǐ gǎnmào le. wǒ gěi nǐ kāi yìxiē yào.', meaning: 'You\'ve got a cold. I\'ll prescribe some medicine.' },
          { speaker: 'you', hanzi: '一天吃几次？', pinyin: 'yì tiān chī jǐ cì?', meaning: 'How many times a day should I take it?' },
          { speaker: 'them', hanzi: '一天三次，饭后吃。多喝水，多休息。', pinyin: 'yì tiān sān cì, fàn hòu chī. duō hē shuǐ, duō xiūxi.', meaning: 'Three times a day, after meals. Drink lots of water and rest.' },
        ],
      },
    ],
  },
  {
    slug: 'travel-hotel',
    name: 'Travel & hotels',
    description: 'Bookings, check-ins, and room requests.',
    sentences: [
      { hanzi: '我有预订。', pinyin: 'wǒ yǒu yùdìng.', meaning: 'I have a reservation.', difficulty: 3 },
      { hanzi: '我想订一个房间。', pinyin: 'wǒ xiǎng dìng yí ge fángjiān.', meaning: "I'd like to book a room.", difficulty: 3, variants: [
        { label: 'Past', hanzi: '我订了一个房间。', pinyin: 'wǒ dìng le yí ge fángjiān.', meaning: 'I booked a room.' },
        { label: 'Already', hanzi: '我已经订好房间了。', pinyin: 'wǒ yǐjīng dìng hǎo fángjiān le.', meaning: 'I\'ve already booked a room.' },
      ] },
      { hanzi: '一晚多少钱？', pinyin: 'yì wǎn duōshao qián?', meaning: 'How much per night?', difficulty: 2 },
      { hanzi: '含早餐吗？', pinyin: 'hán zǎocān ma?', meaning: 'Is breakfast included?', difficulty: 3 },
      { hanzi: '有免费Wi-Fi吗？', pinyin: 'yǒu miǎnfèi Wi-Fi ma?', meaning: 'Is there free Wi-Fi?', difficulty: 3 },
      { hanzi: '几点退房？', pinyin: 'jǐ diǎn tuìfáng?', meaning: 'What time is checkout?', difficulty: 3 },
      { hanzi: '房间的空调坏了。', pinyin: 'fángjiān de kōngtiáo huài le.', meaning: "The room's air conditioner is broken.", difficulty: 3 },
      { hanzi: '可以帮我叫出租车吗？', pinyin: 'kěyǐ bāng wǒ jiào chūzūchē ma?', meaning: 'Can you call a taxi for me?', difficulty: 3 },
      { hanzi: '请给我房卡。', pinyin: 'qǐng gěi wǒ fángkǎ.', meaning: 'Please give me the room key.', difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'Checking in',
        lines: [
          { speaker: 'you', hanzi: '你好，我有预订。', pinyin: 'nǐ hǎo, wǒ yǒu yùdìng.', meaning: 'Hello, I have a reservation.' },
          { speaker: 'them', hanzi: '请给我看一下您的护照。', pinyin: 'qǐng gěi wǒ kàn yíxià nín de hùzhào.', meaning: 'May I see your passport, please?' },
          { speaker: 'you', hanzi: '给你。', pinyin: 'gěi nǐ.', meaning: 'Here you go.' },
          { speaker: 'them', hanzi: '好的，您住三个晚上，对吗？', pinyin: 'hǎo de, nín zhù sān ge wǎnshang, duì ma?', meaning: 'OK, you\'re staying three nights, right?' },
          { speaker: 'you', hanzi: '对。含早餐吗？', pinyin: 'duì. hán zǎocān ma?', meaning: 'Yes. Is breakfast included?' },
          { speaker: 'them', hanzi: '含早餐，早上七点到十点。这是您的房卡。', pinyin: 'hán zǎocān, zǎoshang qī diǎn dào shí diǎn. zhè shì nín de fángkǎ.', meaning: 'Yes, from seven to ten in the morning. Here\'s your room key.' },
          { speaker: 'you', hanzi: '谢谢！几点退房？', pinyin: 'xièxie! jǐ diǎn tuìfáng?', meaning: 'Thanks! What time is checkout?' },
          { speaker: 'them', hanzi: '中午十二点。', pinyin: 'zhōngwǔ shí’èr diǎn.', meaning: 'Twelve noon.' },
        ],
      },
    ],
  },
  {
    slug: 'business-work',
    name: 'Business & work',
    description: 'Meetings, negotiating, and office chat.',
    sentences: [
      { hanzi: '你在哪里工作？', pinyin: 'nǐ zài nǎli gōngzuò?', meaning: 'Where do you work?', difficulty: 2 },
      { hanzi: '我在一家科技公司工作。', pinyin: 'wǒ zài yì jiā kējì gōngsī gōngzuò.', meaning: 'I work at a tech company.', difficulty: 4 },
      { hanzi: '会议几点开始？', pinyin: 'huìyì jǐ diǎn kāishǐ?', meaning: 'What time does the meeting start?', difficulty: 3, variants: [
        { label: 'Past', hanzi: '会议几点开始的？', pinyin: 'huìyì jǐ diǎn kāishǐ de?', meaning: 'What time did the meeting start?' },
        { label: 'Already', hanzi: '会议已经开始了。', pinyin: 'huìyì yǐjīng kāishǐ le.', meaning: 'The meeting has already started.' },
      ] },
      { hanzi: '请把文件发给我。', pinyin: 'qǐng bǎ wénjiàn fā gěi wǒ.', meaning: 'Please send me the documents.', difficulty: 4, variants: [
        { label: 'Past', hanzi: '我把文件发给你了。', pinyin: 'wǒ bǎ wénjiàn fā gěi nǐ le.', meaning: 'I sent you the documents.' },
      ] },
      { hanzi: '我们下周再谈吧。', pinyin: 'wǒmen xià zhōu zài tán ba.', meaning: "Let's discuss this again next week.", difficulty: 3 },
      { hanzi: '这个项目很重要。', pinyin: 'zhège xiàngmù hěn zhòngyào.', meaning: 'This project is very important.', difficulty: 4 },
      { hanzi: '我需要加班。', pinyin: 'wǒ xūyào jiābān.', meaning: 'I need to work overtime.', difficulty: 4, variants: [
        { label: 'Past', hanzi: '我昨天加班了。', pinyin: 'wǒ zuótiān jiābān le.', meaning: 'I worked overtime yesterday.' },
        { label: 'Future', hanzi: '我明天要加班。', pinyin: 'wǒ míngtiān yào jiābān.', meaning: 'I have to work overtime tomorrow.' },
      ] },
      { hanzi: '祝贺你升职！', pinyin: 'zhùhè nǐ shēngzhí!', meaning: 'Congrats on your promotion!', difficulty: 4 },
      { hanzi: '我想申请这个职位。', pinyin: 'wǒ xiǎng shēnqǐng zhège zhíwèi.', meaning: "I'd like to apply for this position.", difficulty: 4 },
      { hanzi: '预算是多少？', pinyin: 'yùsuàn shì duōshao?', meaning: "What's the budget?", difficulty: 4 },
    ],
    dialogues: [
      {
        title: 'Before the meeting',
        lines: [
          { speaker: 'them', hanzi: '会议几点开始？', pinyin: 'huìyì jǐ diǎn kāishǐ?', meaning: 'What time does the meeting start?' },
          { speaker: 'you', hanzi: '十点开始。你准备好了吗？', pinyin: 'shí diǎn kāishǐ. nǐ zhǔnbèi hǎo le ma?', meaning: 'At ten. Are you ready?' },
          { speaker: 'them', hanzi: '还没有，我还要看一下文件。', pinyin: 'hái méiyǒu, wǒ hái yào kàn yíxià wénjiàn.', meaning: 'Not yet — I still need to look over the documents.' },
          { speaker: 'you', hanzi: '我已经把文件发给你了。', pinyin: 'wǒ yǐjīng bǎ wénjiàn fā gěi nǐ le.', meaning: 'I\'ve already sent you the documents.' },
          { speaker: 'them', hanzi: '太好了，谢谢！', pinyin: 'tài hǎo le, xièxie!', meaning: 'Great, thanks!' },
          { speaker: 'you', hanzi: '不客气。这个项目很重要。', pinyin: 'bú kèqi. zhège xiàngmù hěn zhòngyào.', meaning: 'No problem. This project is really important.' },
        ],
      },
    ],
  },
  {
    slug: 'school-classroom',
    name: 'School & classroom',
    description: 'Studying, exams, and talking to teachers.',
    sentences: [
      { hanzi: '你是哪个专业的？', pinyin: 'nǐ shì nǎge zhuānyè de?', meaning: "What's your major?", difficulty: 4 },
      { hanzi: '我在学中文。', pinyin: 'wǒ zài xué Zhōngwén.', meaning: 'I am studying Chinese.', difficulty: 2, label: 'Ongoing', variants: [
        { label: 'Ever', hanzi: '我学过中文。', pinyin: 'wǒ xué guo Zhōngwén.', meaning: 'I\'ve studied Chinese before.' },
        { label: 'Future', hanzi: '我明年要去中国学中文。', pinyin: 'wǒ míngnián yào qù Zhōngguó xué Zhōngwén.', meaning: 'Next year I\'m going to China to study Chinese.' },
      ] },
      { hanzi: '这道题怎么做？', pinyin: 'zhè dào tí zěnme zuò?', meaning: 'How do I do this problem?', difficulty: 3 },
      { hanzi: '老师，请再说一遍。', pinyin: 'lǎoshī, qǐng zài shuō yí biàn.', meaning: 'Teacher, please say that again.', difficulty: 3 },
      { hanzi: '考试什么时候？', pinyin: 'kǎoshì shénme shíhou?', meaning: 'When is the exam?', difficulty: 2 },
      { hanzi: '我需要更多时间复习。', pinyin: 'wǒ xūyào gèng duō shíjiān fùxí.', meaning: 'I need more time to review.', difficulty: 3 },
      { hanzi: '我的作业做完了。', pinyin: 'wǒ de zuòyè zuò wán le.', meaning: 'I finished my homework.', difficulty: 3, label: 'Past', variants: [
        { label: 'Ongoing', hanzi: '我在做作业。', pinyin: 'wǒ zài zuò zuòyè.', meaning: 'I\'m doing my homework.' },
        { label: 'Not yet', hanzi: '我的作业还没做完。', pinyin: 'wǒ de zuòyè hái méi zuò wán.', meaning: 'I haven\'t finished my homework yet.' },
      ] },
      { hanzi: '这个词是什么意思？', pinyin: 'zhège cí shì shénme yìsi?', meaning: "What does this word mean?", difficulty: 3 },
      { hanzi: '请检查我的写作。', pinyin: 'qǐng jiǎnchá wǒ de xiězuò.', meaning: 'Please check my writing.', difficulty: 4 },
    ],
    dialogues: [
      {
        title: 'In class',
        lines: [
          { speaker: 'them', hanzi: '今天我们学第五课。', pinyin: 'jīntiān wǒmen xué dì wǔ kè.', meaning: 'Today we\'re doing lesson five.' },
          { speaker: 'you', hanzi: '老师，这个词是什么意思？', pinyin: 'lǎoshī, zhège cí shì shénme yìsi?', meaning: 'Teacher, what does this word mean?' },
          { speaker: 'them', hanzi: '意思是不要担心。', pinyin: 'yìsi shì bú yào dānxīn.', meaning: 'It means \'don\'t worry\'.' },
          { speaker: 'you', hanzi: '明白了，谢谢老师。', pinyin: 'míngbai le, xièxie lǎoshī.', meaning: 'I understand now, thank you.' },
          { speaker: 'them', hanzi: '作业做完了吗？', pinyin: 'zuòyè zuò wán le ma?', meaning: 'Have you finished the homework?' },
          { speaker: 'you', hanzi: '还没做完，明天给您可以吗？', pinyin: 'hái méi zuò wán, míngtiān gěi nín kěyǐ ma?', meaning: 'Not yet — can I give it to you tomorrow?' },
          { speaker: 'them', hanzi: '可以，明天给我吧。', pinyin: 'kěyǐ, míngtiān gěi wǒ ba.', meaning: 'Sure, give it to me tomorrow.' },
        ],
      },
    ],
  },
  {
    slug: 'sports-fitness',
    name: 'Sports & fitness',
    description: 'The gym, playing sports, and staying active.',
    sentences: [
      { hanzi: '你喜欢什么运动？', pinyin: 'nǐ xǐhuan shénme yùndòng?', meaning: 'What sports do you like?', difficulty: 3 },
      { hanzi: '我常常去健身房。', pinyin: 'wǒ chángcháng qù jiànshēnfáng.', meaning: 'I often go to the gym.', difficulty: 4 },
      { hanzi: '我们一起去跑步吧。', pinyin: 'wǒmen yìqǐ qù pǎobù ba.', meaning: "Let's go running together.", difficulty: 3, variants: [
        { label: 'Past', hanzi: '我们一起去跑步了。', pinyin: 'wǒmen yìqǐ qù pǎobù le.', meaning: 'We went running together.' },
      ] },
      { hanzi: '我每天游泳。', pinyin: 'wǒ měitiān yóuyǒng.', meaning: 'I swim every day.', difficulty: 3, variants: [
        { label: 'Past', hanzi: '我昨天游泳了。', pinyin: 'wǒ zuótiān yóuyǒng le.', meaning: 'I went swimming yesterday.' },
        { label: 'Future', hanzi: '我明天去游泳。', pinyin: 'wǒ míngtiān qù yóuyǒng.', meaning: 'I\'m going swimming tomorrow.' },
      ] },
      { hanzi: '我打网球。', pinyin: 'wǒ dǎ wǎngqiú.', meaning: 'I play tennis.', difficulty: 4 },
      { hanzi: '你踢过足球吗？', pinyin: 'nǐ tī guo zúqiú ma?', meaning: 'Have you ever played football?', difficulty: 3, label: 'Ever', variants: [
        { label: 'Now', hanzi: '你踢足球吗？', pinyin: 'nǐ tī zúqiú ma?', meaning: 'Do you play football?' },
        { label: 'Future', hanzi: '你明天去踢足球吗？', pinyin: 'nǐ míngtiān qù tī zúqiú ma?', meaning: 'Are you going to play football tomorrow?' },
      ] },
      { hanzi: '今天太累了。', pinyin: 'jīntiān tài lèi le.', meaning: "I'm too tired today.", difficulty: 3 },
      { hanzi: '要多运动，多喝水。', pinyin: 'yào duō yùndòng, duō hē shuǐ.', meaning: 'Exercise more, drink more water.', difficulty: 3 },
      { hanzi: '我的肌肉有点酸。', pinyin: 'wǒ de jīròu yǒudiǎn suān.', meaning: 'My muscles are a bit sore.', difficulty: 4 },
    ],
    dialogues: [
      {
        title: 'Going for a run',
        lines: [
          { speaker: 'them', hanzi: '你喜欢什么运动？', pinyin: 'nǐ xǐhuan shénme yùndòng?', meaning: 'What sports do you like?' },
          { speaker: 'you', hanzi: '我喜欢跑步，也常常去健身房。', pinyin: 'wǒ xǐhuan pǎobù, yě chángcháng qù jiànshēnfáng.', meaning: 'I like running, and I often go to the gym.' },
          { speaker: 'them', hanzi: '你踢过足球吗？', pinyin: 'nǐ tī guo zúqiú ma?', meaning: 'Have you ever played football?' },
          { speaker: 'you', hanzi: '踢过，但是踢得不好。', pinyin: 'tī guo, dànshì tī de bù hǎo.', meaning: 'I have, but I\'m not very good.' },
          { speaker: 'them', hanzi: '明天早上我们一起去跑步吧。', pinyin: 'míngtiān zǎoshang wǒmen yìqǐ qù pǎobù ba.', meaning: 'Let\'s go running together tomorrow morning.' },
          { speaker: 'you', hanzi: '好啊，几点？', pinyin: 'hǎo a, jǐ diǎn?', meaning: 'Sure, what time?' },
          { speaker: 'them', hanzi: '七点，公园门口见。', pinyin: 'qī diǎn, gōngyuán ménkǒu jiàn.', meaning: 'Seven — see you at the park gate.' },
        ],
      },
    ],
  },
  {
    slug: 'transportation',
    name: 'Transportation',
    description: 'Trains, buses, planes, and traffic.',
    sentences: [
      { hanzi: '下一班火车几点？', pinyin: 'xià yì bān huǒchē jǐ diǎn?', meaning: "What time is the next train?", difficulty: 3 },
      { hanzi: '一张去北京的票。', pinyin: 'yì zhāng qù Běijīng de piào.', meaning: 'One ticket to Beijing.', difficulty: 3 },
      { hanzi: '这班飞机晚点了。', pinyin: 'zhè bān fēijī wǎndiǎn le.', meaning: 'This flight is delayed.', difficulty: 4 },
      { hanzi: '我坐地铁上班。', pinyin: 'wǒ zuò dìtiě shàngbān.', meaning: 'I take the subway to work.', difficulty: 3, variants: [
        { label: 'Past', hanzi: '我今天是坐地铁来的。', pinyin: 'wǒ jīntiān shì zuò dìtiě lái de.', meaning: 'I came by subway today.' },
      ] },
      { hanzi: '公交车什么时候来？', pinyin: 'gōngjiāochē shénme shíhou lái?', meaning: 'When does the bus come?', difficulty: 3, variants: [
        { label: 'Future', hanzi: '公交车快来了。', pinyin: 'gōngjiāochē kuài lái le.', meaning: 'The bus is about to come.' },
      ] },
      { hanzi: '路上堵车。', pinyin: 'lù shàng dǔchē.', meaning: "There's traffic on the road.", difficulty: 4 },
      { hanzi: '请打表。', pinyin: 'qǐng dǎbiǎo.', meaning: 'Please use the meter. (taxi)', difficulty: 4 },
      { hanzi: '我要在这里下车。', pinyin: 'wǒ yào zài zhèli xiàchē.', meaning: 'I want to get off here.', difficulty: 3 },
      { hanzi: '停车场在哪里？', pinyin: 'tíngchēchǎng zài nǎli?', meaning: "Where's the parking lot?", difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'Taking a taxi',
        lines: [
          { speaker: 'them', hanzi: '你好，去哪儿？', pinyin: 'nǐ hǎo, qù nǎr?', meaning: 'Hello, where to?' },
          { speaker: 'you', hanzi: '请到机场。', pinyin: 'qǐng dào jīchǎng.', meaning: 'Please take me to the airport.' },
          { speaker: 'you', hanzi: '要多长时间？', pinyin: 'yào duō cháng shíjiān?', meaning: 'How long will it take?' },
          { speaker: 'them', hanzi: '路上堵车，大概四十分钟。', pinyin: 'lù shang dǔchē, dàgài sìshí fēnzhōng.', meaning: 'There\'s traffic, so about forty minutes.' },
          { speaker: 'you', hanzi: '好。请打表。', pinyin: 'hǎo. qǐng dǎbiǎo.', meaning: 'OK. Please use the meter.' },
          { speaker: 'them', hanzi: '到了，一共九十五块。', pinyin: 'dào le, yígòng jiǔshíwǔ kuài.', meaning: 'Here we are — 95 yuan altogether.' },
          { speaker: 'you', hanzi: '给你一百块，不用找了。', pinyin: 'gěi nǐ yìbǎi kuài, bú yòng zhǎo le.', meaning: 'Here\'s 100 — keep the change.' },
        ],
      },
    ],
  },
  {
    slug: 'chinese-festivals',
    name: 'Chinese festivals',
    description: 'Spring Festival, Mid-Autumn, and other holidays.',
    sentences: [
      { hanzi: '春节快乐！', pinyin: 'Chūnjié kuàilè!', meaning: 'Happy Spring Festival!', difficulty: 2 },
      { hanzi: '新年快乐！', pinyin: 'Xīnnián kuàilè!', meaning: 'Happy New Year!', difficulty: 1 },
      { hanzi: '恭喜发财！', pinyin: 'gōngxǐ fācái!', meaning: 'Wishing you prosperity!', difficulty: 3 },
      { hanzi: '中秋节吃月饼。', pinyin: 'Zhōngqiū jié chī yuèbǐng.', meaning: 'At Mid-Autumn Festival we eat mooncakes.', difficulty: 3, variants: [
        { label: 'Past', hanzi: '中秋节我们吃了月饼。', pinyin: 'Zhōngqiū jié wǒmen chī le yuèbǐng.', meaning: 'We ate mooncakes at the Mid-Autumn Festival.' },
      ] },
      { hanzi: '我们一起看烟花吧。', pinyin: 'wǒmen yìqǐ kàn yānhuā ba.', meaning: "Let's watch fireworks together.", difficulty: 3 },
      { hanzi: '给你一个红包。', pinyin: 'gěi nǐ yí ge hóngbāo.', meaning: 'Here is a red envelope for you.', difficulty: 3 },
      { hanzi: '端午节吃粽子。', pinyin: 'Duānwǔ jié chī zòngzi.', meaning: 'At the Dragon Boat Festival we eat zongzi.', difficulty: 4 },
      { hanzi: '假期你回家吗？', pinyin: 'jiàqī nǐ huíjiā ma?', meaning: 'Are you going home for the holiday?', difficulty: 3, variants: [
        { label: 'Past', hanzi: '假期你回家了吗？', pinyin: 'jiàqī nǐ huí jiā le ma?', meaning: 'Did you go home for the holiday?' },
      ] },
      { hanzi: '祝你身体健康。', pinyin: 'zhù nǐ shēntǐ jiànkāng.', meaning: 'Wishing you good health.', difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'A New Year visit',
        lines: [
          { speaker: 'you', hanzi: '新年快乐！', pinyin: 'Xīnnián kuàilè!', meaning: 'Happy New Year!' },
          { speaker: 'them', hanzi: '新年快乐！快进来坐。', pinyin: 'Xīnnián kuàilè! kuài jìnlái zuò.', meaning: 'Happy New Year! Come in and sit down.' },
          { speaker: 'you', hanzi: '祝你身体健康，万事如意！', pinyin: 'zhù nǐ shēntǐ jiànkāng, wànshì rúyì!', meaning: 'Wishing you good health and all the best!' },
          { speaker: 'them', hanzi: '谢谢！给你一个红包。', pinyin: 'xièxie! gěi nǐ yí ge hóngbāo.', meaning: 'Thank you! Here\'s a red envelope for you.' },
          { speaker: 'you', hanzi: '谢谢！恭喜发财！', pinyin: 'xièxie! gōngxǐ fācái!', meaning: 'Thank you! Wishing you prosperity!' },
          { speaker: 'them', hanzi: '晚上我们一起看烟花吧。', pinyin: 'wǎnshang wǒmen yìqǐ kàn yānhuā ba.', meaning: 'Let\'s watch the fireworks together tonight.' },
        ],
      },
    ],
  },
  {
    slug: 'emergencies',
    name: 'Emergencies',
    description: 'Help, lost items, and asking for the police.',
    sentences: [
      { hanzi: '救命！', pinyin: 'jiùmìng!', meaning: 'Help! (Save me!)', difficulty: 2 },
      { hanzi: '请帮帮我。', pinyin: 'qǐng bāng bāng wǒ.', meaning: 'Please help me.', difficulty: 2 },
      { hanzi: '快叫警察！', pinyin: 'kuài jiào jǐngchá!', meaning: 'Quick, call the police!', difficulty: 3 },
      { hanzi: '快叫救护车！', pinyin: 'kuài jiào jiùhùchē!', meaning: 'Quick, call an ambulance!', difficulty: 3 },
      { hanzi: '我丢了钱包。', pinyin: 'wǒ diū le qiánbāo.', meaning: 'I lost my wallet.', difficulty: 3 },
      { hanzi: '我的护照丢了。', pinyin: 'wǒ de hùzhào diū le.', meaning: 'My passport is lost.', difficulty: 3 },
      { hanzi: '着火了！', pinyin: 'zháohuǒ le!', meaning: "It's on fire!", difficulty: 3 },
      { hanzi: '我需要医院。', pinyin: 'wǒ xūyào yīyuàn.', meaning: 'I need a hospital.', difficulty: 2 },
      { hanzi: '我迷路了。', pinyin: 'wǒ mílù le.', meaning: "I'm lost.", difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'A lost wallet',
        lines: [
          { speaker: 'you', hanzi: '请帮帮我，我的钱包丢了。', pinyin: 'qǐng bāngbang wǒ, wǒ de qiánbāo diū le.', meaning: 'Please help me — I\'ve lost my wallet.' },
          { speaker: 'them', hanzi: '你在哪儿丢的？', pinyin: 'nǐ zài nǎr diū de?', meaning: 'Where did you lose it?' },
          { speaker: 'you', hanzi: '可能在地铁上。', pinyin: 'kěnéng zài dìtiě shang.', meaning: 'Maybe on the subway.' },
          { speaker: 'them', hanzi: '别着急，我们去找警察吧。', pinyin: 'bié zháojí, wǒmen qù zhǎo jǐngchá ba.', meaning: 'Don\'t worry, let\'s go and find the police.' },
          { speaker: 'you', hanzi: '好的，谢谢你！', pinyin: 'hǎo de, xièxie nǐ!', meaning: 'OK, thank you!' },
        ],
      },
    ],
  },
  {
    slug: 'on-the-phone',
    name: 'On the phone',
    description: 'Calls, messages, and making plans.',
    sentences: [
      { hanzi: '喂，你好！', pinyin: 'wéi, nǐ hǎo!', meaning: 'Hello? (on the phone)', difficulty: 1 },
      { hanzi: '请问，王老师在吗？', pinyin: 'qǐngwèn, Wáng lǎoshī zài ma?', meaning: 'Excuse me, is Teacher Wang there?', difficulty: 2 },
      { hanzi: '他现在不在。', pinyin: 'tā xiànzài bú zài.', meaning: 'He\'s not here right now.', difficulty: 1 },
      { hanzi: '你是哪位？', pinyin: 'nǐ shì nǎ wèi?', meaning: 'Who\'s calling?', difficulty: 2 },
      { hanzi: '我等一下再打给你。', pinyin: 'wǒ děng yíxià zài dǎ gěi nǐ.', meaning: 'I\'ll call you back in a bit.', difficulty: 3, label: 'Future', variants: [
        { label: 'Past', hanzi: '我刚才给你打电话了。', pinyin: 'wǒ gāngcái gěi nǐ dǎ diànhuà le.', meaning: 'I just called you.' },
      ] },
      { hanzi: '我听不清楚。', pinyin: 'wǒ tīng bù qīngchu.', meaning: 'I can\'t hear you clearly.', difficulty: 3 },
      { hanzi: '请说慢一点。', pinyin: 'qǐng shuō màn yìdiǎn.', meaning: 'Please speak a little slower.', difficulty: 2 },
      { hanzi: '你的电话号码是多少？', pinyin: 'nǐ de diànhuà hàomǎ shì duōshao?', meaning: 'What\'s your phone number?', difficulty: 2 },
      { hanzi: '手机没电了。', pinyin: 'shǒujī méi diàn le.', meaning: 'My phone\'s battery is dead.', difficulty: 3 },
    ],
    dialogues: [
      {
        title: 'Calling a friend',
        lines: [
          { speaker: 'them', hanzi: '喂？', pinyin: 'wéi?', meaning: 'Hello?' },
          { speaker: 'you', hanzi: '喂，是小李吗？我是康纳。', pinyin: 'wéi, shì Xiǎo Lǐ ma? wǒ shì Kāngnà.', meaning: 'Hello, is that Xiao Li? It\'s Conor.' },
          { speaker: 'them', hanzi: '康纳！你好！有什么事吗？', pinyin: 'Kāngnà! nǐ hǎo! yǒu shénme shì ma?', meaning: 'Conor! Hi! What\'s up?' },
          { speaker: 'you', hanzi: '你明天有空吗？我们一起吃饭吧。', pinyin: 'nǐ míngtiān yǒu kòng ma? wǒmen yìqǐ chīfàn ba.', meaning: 'Are you free tomorrow? Let\'s have a meal together.' },
          { speaker: 'them', hanzi: '好啊！几点？', pinyin: 'hǎo a! jǐ diǎn?', meaning: 'Sure! What time?' },
          { speaker: 'you', hanzi: '晚上七点，怎么样？', pinyin: 'wǎnshang qī diǎn, zěnmeyàng?', meaning: 'Seven in the evening — how\'s that?' },
          { speaker: 'them', hanzi: '没问题，明天见！', pinyin: 'méi wèntí, míngtiān jiàn!', meaning: 'No problem, see you tomorrow!' },
        ],
      },
    ],
  },
  {
    slug: 'renting-a-flat',
    name: 'Renting a flat',
    description: 'Viewing a place, rent, and moving in.',
    sentences: [
      { hanzi: '我想租一个房子。', pinyin: 'wǒ xiǎng zū yí ge fángzi.', meaning: 'I\'d like to rent a place.', difficulty: 3, variants: [
        { label: 'Past', hanzi: '我租了一个房子。', pinyin: 'wǒ zū le yí ge fángzi.', meaning: 'I\'ve rented a place.' },
      ] },
      { hanzi: '一个月房租多少钱？', pinyin: 'yí ge yuè fángzū duōshao qián?', meaning: 'How much is the rent per month?', difficulty: 3 },
      { hanzi: '离地铁站近吗？', pinyin: 'lí dìtiězhàn jìn ma?', meaning: 'Is it close to the subway station?', difficulty: 3 },
      { hanzi: '有几个房间？', pinyin: 'yǒu jǐ ge fángjiān?', meaning: 'How many rooms are there?', difficulty: 2 },
      { hanzi: '我可以先看看房子吗？', pinyin: 'wǒ kěyǐ xiān kànkan fángzi ma?', meaning: 'Can I see the place first?', difficulty: 3 },
      { hanzi: '可以养宠物吗？', pinyin: 'kěyǐ yǎng chǒngwù ma?', meaning: 'Can I keep pets?', difficulty: 4 },
      { hanzi: '水电费包括吗？', pinyin: 'shuǐdiànfèi bāokuò ma?', meaning: 'Are water and electricity included?', difficulty: 4 },
      { hanzi: '押金是多少？', pinyin: 'yājīn shì duōshao?', meaning: 'How much is the deposit?', difficulty: 4 },
      { hanzi: '我什么时候可以搬进来？', pinyin: 'wǒ shénme shíhou kěyǐ bān jìnlái?', meaning: 'When can I move in?', difficulty: 4, label: 'Future', variants: [
        { label: 'Past', hanzi: '我上个月搬进来了。', pinyin: 'wǒ shàng ge yuè bān jìnlái le.', meaning: 'I moved in last month.' },
      ] },
    ],
    dialogues: [
      {
        title: 'Viewing a flat',
        lines: [
          { speaker: 'you', hanzi: '你好，我想看看这个房子。', pinyin: 'nǐ hǎo, wǒ xiǎng kànkan zhège fángzi.', meaning: 'Hi, I\'d like to see this flat.' },
          { speaker: 'them', hanzi: '好的，请进。这是客厅，那边是卧室。', pinyin: 'hǎo de, qǐng jìn. zhè shì kètīng, nàbiān shì wòshì.', meaning: 'Sure, come in. This is the living room, and the bedroom\'s over there.' },
          { speaker: 'you', hanzi: '很干净！一个月房租多少钱？', pinyin: 'hěn gānjìng! yí ge yuè fángzū duōshao qián?', meaning: 'It\'s very clean! How much is the rent per month?' },
          { speaker: 'them', hanzi: '三千五百块。', pinyin: 'sānqiān wǔbǎi kuài.', meaning: '3,500 yuan.' },
          { speaker: 'you', hanzi: '离地铁站近吗？', pinyin: 'lí dìtiězhàn jìn ma?', meaning: 'Is it close to the subway station?' },
          { speaker: 'them', hanzi: '很近，走路五分钟。', pinyin: 'hěn jìn, zǒulù wǔ fēnzhōng.', meaning: 'Very close — five minutes\' walk.' },
          { speaker: 'you', hanzi: '太好了，我想租。', pinyin: 'tài hǎo le, wǒ xiǎng zū.', meaning: 'Great, I\'d like to rent it.' },
        ],
      },
    ],
  },
  {
    slug: 'weather',
    name: 'Weather',
    description: 'Sun, rain, snow, and what to wear.',
    sentences: [
      { hanzi: '今天天气怎么样？', pinyin: 'jīntiān tiānqì zěnmeyàng?', meaning: 'How\'s the weather today?', difficulty: 1 },
      { hanzi: '今天很热。', pinyin: 'jīntiān hěn rè.', meaning: 'It\'s hot today.', difficulty: 1, variants: [
        { label: 'Past', hanzi: '昨天很热。', pinyin: 'zuótiān hěn rè.', meaning: 'It was hot yesterday.' },
        { label: 'Future', hanzi: '明天会很热。', pinyin: 'míngtiān huì hěn rè.', meaning: 'It\'ll be hot tomorrow.' },
      ] },
      { hanzi: '外面下雨了。', pinyin: 'wàimiàn xià yǔ le.', meaning: 'It\'s started raining outside.', difficulty: 2, variants: [
        { label: 'Ongoing', hanzi: '外面正在下雨。', pinyin: 'wàimiàn zhèngzài xià yǔ.', meaning: 'It\'s raining outside right now.' },
        { label: 'Future', hanzi: '快下雨了。', pinyin: 'kuài xià yǔ le.', meaning: 'It\'s about to rain.' },
      ] },
      { hanzi: '明天会下雪吗？', pinyin: 'míngtiān huì xià xuě ma?', meaning: 'Will it snow tomorrow?', difficulty: 2 },
      { hanzi: '今天风很大。', pinyin: 'jīntiān fēng hěn dà.', meaning: 'It\'s very windy today.', difficulty: 2 },
      { hanzi: '别忘了带伞。', pinyin: 'bié wàng le dài sǎn.', meaning: 'Don\'t forget your umbrella.', difficulty: 3 },
      { hanzi: '我喜欢晴天。', pinyin: 'wǒ xǐhuan qíngtiān.', meaning: 'I like sunny days.', difficulty: 2 },
      { hanzi: '这里冬天很冷。', pinyin: 'zhèlǐ dōngtiān hěn lěng.', meaning: 'Winters here are cold.', difficulty: 2 },
    ],
    dialogues: [
      {
        title: 'First snow',
        lines: [
          { speaker: 'them', hanzi: '今天天气怎么样？', pinyin: 'jīntiān tiānqì zěnmeyàng?', meaning: 'How\'s the weather today?' },
          { speaker: 'you', hanzi: '很冷，外面在下雪。', pinyin: 'hěn lěng, wàimiàn zài xià xuě.', meaning: 'It\'s cold — it\'s snowing outside.' },
          { speaker: 'them', hanzi: '真的吗？我还没见过雪！', pinyin: 'zhēn de ma? wǒ hái méi jiàn guo xuě!', meaning: 'Really? I\'ve never seen snow!' },
          { speaker: 'you', hanzi: '那我们出去看看吧！', pinyin: 'nà wǒmen chūqù kànkan ba!', meaning: 'Then let\'s go out and have a look!' },
          { speaker: 'them', hanzi: '好！等一下，我去拿衣服。', pinyin: 'hǎo! děng yíxià, wǒ qù ná yīfu.', meaning: 'OK! Wait a sec, I\'ll get my coat.' },
          { speaker: 'you', hanzi: '多穿点儿衣服！', pinyin: 'duō chuān diǎnr yīfu!', meaning: 'Wrap up warm!' },
        ],
      },
    ],
  },
  {
    slug: 'hobbies',
    name: 'Hobbies',
    description: 'What you like doing, and doing it together.',
    sentences: [
      { hanzi: '你有什么爱好？', pinyin: 'nǐ yǒu shénme àihào?', meaning: 'What are your hobbies?', difficulty: 2 },
      { hanzi: '我喜欢看书。', pinyin: 'wǒ xǐhuan kàn shū.', meaning: 'I like reading.', difficulty: 1 },
      { hanzi: '我喜欢听音乐。', pinyin: 'wǒ xǐhuan tīng yīnyuè.', meaning: 'I like listening to music.', difficulty: 2 },
      { hanzi: '你会弹吉他吗？', pinyin: 'nǐ huì tán jítā ma?', meaning: 'Can you play the guitar?', difficulty: 3 },
      { hanzi: '我在学做中国菜。', pinyin: 'wǒ zài xué zuò Zhōngguó cài.', meaning: 'I\'m learning to cook Chinese food.', difficulty: 3, label: 'Ongoing' },
      { hanzi: '我周末常常去爬山。', pinyin: 'wǒ zhōumò chángcháng qù pá shān.', meaning: 'I often go hiking at weekends.', difficulty: 3, variants: [
        { label: 'Past', hanzi: '上个周末我去爬山了。', pinyin: 'shàng ge zhōumò wǒ qù pá shān le.', meaning: 'Last weekend I went hiking.' },
        { label: 'Future', hanzi: '这个周末我要去爬山。', pinyin: 'zhège zhōumò wǒ yào qù pá shān.', meaning: 'This weekend I\'m going hiking.' },
      ] },
      { hanzi: '你喜欢看什么电影？', pinyin: 'nǐ xǐhuan kàn shénme diànyǐng?', meaning: 'What films do you like?', difficulty: 2, variants: [
        { label: 'Past', hanzi: '你最近看了什么电影？', pinyin: 'nǐ zuìjìn kàn le shénme diànyǐng?', meaning: 'What films have you seen recently?' },
      ] },
      { hanzi: '我对摄影很感兴趣。', pinyin: 'wǒ duì shèyǐng hěn gǎn xìngqù.', meaning: 'I\'m really into photography.', difficulty: 4 },
      { hanzi: '我们一起去唱歌吧。', pinyin: 'wǒmen yìqǐ qù chànggē ba.', meaning: 'Let\'s go singing together.', difficulty: 2 },
    ],
    dialogues: [
      {
        title: 'Talking hobbies',
        lines: [
          { speaker: 'them', hanzi: '你有什么爱好？', pinyin: 'nǐ yǒu shénme àihào?', meaning: 'What are your hobbies?' },
          { speaker: 'you', hanzi: '我喜欢听音乐，也喜欢做饭。你呢？', pinyin: 'wǒ xǐhuan tīng yīnyuè, yě xǐhuan zuò fàn. nǐ ne?', meaning: 'I like music and cooking. You?' },
          { speaker: 'them', hanzi: '我喜欢唱歌。你会唱中文歌吗？', pinyin: 'wǒ xǐhuan chànggē. nǐ huì chàng Zhōngwén gē ma?', meaning: 'I like singing. Can you sing Chinese songs?' },
          { speaker: 'you', hanzi: '还不会，你可以教我吗？', pinyin: 'hái bú huì, nǐ kěyǐ jiāo wǒ ma?', meaning: 'Not yet — can you teach me?' },
          { speaker: 'them', hanzi: '当然可以！这个周末我们一起去唱歌吧。', pinyin: 'dāngrán kěyǐ! zhège zhōumò wǒmen yìqǐ qù chànggē ba.', meaning: 'Of course! Let\'s go singing this weekend.' },
          { speaker: 'you', hanzi: '好啊，一言为定！', pinyin: 'hǎo a, yì yán wéi dìng!', meaning: 'Great, it\'s a deal!' },
        ],
      },
    ],
  },
  {
    slug: 'messaging-friends',
    name: 'Messaging friends',
    description: 'Quick texts: where are you, running late, good night.',
    sentences: [
      { hanzi: '你在干什么？', pinyin: 'nǐ zài gàn shénme?', meaning: 'What are you up to?', difficulty: 2, label: 'Ongoing', variants: [
        { label: 'Past', hanzi: '你刚才在干什么？', pinyin: 'nǐ gāngcái zài gàn shénme?', meaning: 'What were you doing just now?' },
      ] },
      { hanzi: '我刚下班。', pinyin: 'wǒ gāng xiàbān.', meaning: 'I just finished work.', difficulty: 3 },
      { hanzi: '你到了吗？', pinyin: 'nǐ dào le ma?', meaning: 'Are you here yet?', difficulty: 2, label: 'Past', variants: [
        { label: 'Future', hanzi: '你几点到？', pinyin: 'nǐ jǐ diǎn dào?', meaning: 'What time will you get here?' },
      ] },
      { hanzi: '我马上到。', pinyin: 'wǒ mǎshàng dào.', meaning: 'I\'ll be right there.', difficulty: 3 },
      { hanzi: '不好意思，我迟到了。', pinyin: 'bù hǎoyìsi, wǒ chídào le.', meaning: 'Sorry, I\'m late.', difficulty: 3 },
      { hanzi: '加我微信吧。', pinyin: 'jiā wǒ Wēixìn ba.', meaning: 'Add me on WeChat.', difficulty: 2 },
      { hanzi: '哈哈，太好笑了！', pinyin: 'hāha, tài hǎoxiào le!', meaning: 'Haha, that\'s so funny!', difficulty: 2 },
      { hanzi: '等你回来！', pinyin: 'děng nǐ huílái!', meaning: 'Can\'t wait for you to be back!', difficulty: 2 },
      { hanzi: '晚安！', pinyin: 'wǎn’ān!', meaning: 'Good night!', difficulty: 1 },
    ],
    dialogues: [
      {
        title: 'Running late',
        lines: [
          { speaker: 'them', hanzi: '你到了吗？', pinyin: 'nǐ dào le ma?', meaning: 'Are you here yet?' },
          { speaker: 'you', hanzi: '还没有，路上堵车。', pinyin: 'hái méiyǒu, lù shang dǔchē.', meaning: 'Not yet, there\'s traffic.' },
          { speaker: 'them', hanzi: '没关系，你大概几点到？', pinyin: 'méi guānxi, nǐ dàgài jǐ diǎn dào?', meaning: 'No worries — roughly what time will you get here?' },
          { speaker: 'you', hanzi: '七点半左右。不好意思！', pinyin: 'qī diǎn bàn zuǒyòu. bù hǎoyìsi!', meaning: 'Around half seven. Sorry!' },
          { speaker: 'them', hanzi: '好，我先点菜。', pinyin: 'hǎo, wǒ xiān diǎn cài.', meaning: 'OK, I\'ll order first.' },
          { speaker: 'you', hanzi: '好的，我马上到！', pinyin: 'hǎo de, wǒ mǎshàng dào!', meaning: 'OK, I\'ll be right there!' },
        ],
      },
    ],
  },
];
