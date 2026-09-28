// Graded reading: short stories written with only the words the Learn path
// has taught by the lesson in `after` (checked by story-data.test.ts), plus a
// few glossed extras — names, and everyday compounds that aren't HSK words.
// The same people recur: Anna, a student in Beijing, and her friend Wang Peng.

import type { PathSentence } from './curriculum/types';

export type StoryQuestion = { question: string; options: string[]; answer: string };

export type Story = {
  /** Stable slug, used in URLs and reading history. Never rename. */
  id: string;
  title: PathSentence;
  hskLevel: number;
  /** Lesson id: the story opens up once this lesson is finished. */
  after: string;
  /** Glossed words outside the path so far (names, compounds). */
  extras: PathSentence[];
  paragraphs: PathSentence[][];
  questions: StoryQuestion[];
};

const s = (hanzi: string, pinyin: string, meaning: string): PathSentence => ({
  hanzi,
  pinyin,
  meaning,
});

const ANNA = s('安娜', 'Ānnà', 'Anna (a name)');
const WANG_PENG = s('王朋', 'Wáng Péng', 'Wang Peng (a name)');

export const stories: Story[] = [
  // ——— HSK 1 ———
  {
    id: 'my-family',
    title: s('我的家', 'wǒ de jiā', 'My family'),
    hskLevel: 1,
    after: 'h1-u3-l3',
    extras: [ANNA, WANG_PENG],
    paragraphs: [
      [
        s('你好！我叫安娜。', 'nǐ hǎo! wǒ jiào Ānnà.', 'Hello! My name is Anna.'),
        s('我是学生。', 'wǒ shì xuésheng.', "I'm a student."),
        s(
          '我家有三个人：爸爸、妈妈和我。',
          'wǒ jiā yǒu sān gè rén: bàba, māma hé wǒ.',
          'There are three people in my family: Dad, Mum and me.',
        ),
        s(
          '我爸爸和我妈妈都是老师。',
          'wǒ bàba hé wǒ māma dōu shì lǎoshī.',
          'My dad and my mum are both teachers.',
        ),
      ],
      [
        s(
          '我们家没有狗，有猫。',
          'wǒmen jiā méiyǒu gǒu, yǒu māo.',
          "We don't have a dog at home; we have a cat.",
        ),
        s('我很喜欢我的猫。', 'wǒ hěn xǐhuan wǒ de māo.', 'I really like my cat.'),
        s(
          '我妈妈不喜欢猫，她喜欢狗。',
          'wǒ māma bù xǐhuan māo, tā xǐhuan gǒu.',
          "My mum doesn't like cats; she likes dogs.",
        ),
      ],
      [
        s(
          '我有一个中国朋友，他叫王朋。',
          'wǒ yǒu yí gè Zhōngguó péngyou, tā jiào Wáng Péng.',
          'I have a Chinese friend called Wang Peng.',
        ),
        s('他是我的同学。', 'tā shì wǒ de tóngxué.', "He's my classmate."),
        s(
          '他十九岁，我十八岁。',
          'tā shíjiǔ suì, wǒ shíbā suì.',
          "He's nineteen and I'm eighteen.",
        ),
        s('王朋家有狗。', 'Wáng Péng jiā yǒu gǒu.', "Wang Peng's family has a dog."),
        s(
          '我妈妈很想认识他的狗！',
          'wǒ māma hěn xiǎng rènshi tā de gǒu!',
          'My mum really wants to meet his dog!',
        ),
      ],
    ],
    questions: [
      {
        question: "How many people are in Anna's family?",
        options: ['Two', 'Three', 'Four'],
        answer: 'Three',
      },
      {
        question: "What do Anna's parents do?",
        options: [
          "They're both teachers",
          "They're both students",
          'Her dad is a teacher and her mum is a doctor',
        ],
        answer: "They're both teachers",
      },
      {
        question: 'Who in the story likes dogs?',
        options: ["Anna's mum", 'Anna', 'Nobody'],
        answer: "Anna's mum",
      },
      {
        question: 'How old is Wang Peng?',
        options: ['Eighteen', 'Nineteen', 'Ten'],
        answer: 'Nineteen',
      },
    ],
  },
  {
    id: 'saturday',
    title: s('星期六', 'xīngqīliù', 'Saturday'),
    hskLevel: 1,
    after: 'h1-u6-l3',
    extras: [],
    paragraphs: [
      [
        s(
          '今天是星期六，我不去学校。',
          'jīntiān shì xīngqīliù, wǒ bú qù xuéxiào.',
          "Today is Saturday, so I'm not going to school.",
        ),
        s(
          '上午十点，我和妈妈坐出租车去商店。',
          'shàngwǔ shí diǎn, wǒ hé māma zuò chūzūchē qù shāngdiàn.',
          'At ten in the morning, Mum and I took a taxi to the shops.',
        ),
        s(
          '妈妈买了一些水果和菜。',
          'māma mǎi le yìxiē shuǐguǒ hé cài.',
          'Mum bought some fruit and vegetables.',
        ),
        s('我买了一个杯子。', 'wǒ mǎi le yí gè bēizi.', 'I bought a cup.'),
        s(
          '杯子很漂亮，不太大。',
          'bēizi hěn piàoliang, bú tài dà.',
          "The cup is pretty, and it isn't too big.",
        ),
      ],
      [
        s(
          '中午我们在饭店吃了米饭和菜。',
          'zhōngwǔ wǒmen zài fàndiàn chī le mǐfàn hé cài.',
          'At noon we had rice and some dishes at a restaurant.',
        ),
        s('妈妈喝茶，我喝水。', 'māma hē chá, wǒ hē shuǐ.', 'Mum drank tea and I drank water.'),
        s(
          '下午三点，我们坐出租车回家。',
          'xiàwǔ sān diǎn, wǒmen zuò chūzūchē huí jiā.',
          'At three in the afternoon we took a taxi home.',
        ),
        s('我睡觉了，妈妈做菜。', 'wǒ shuìjiào le, māma zuò cài.', 'I had a sleep and Mum cooked.'),
        s(
          '明天我想和同学去学校后面的饭店。',
          'míngtiān wǒ xiǎng hé tóngxué qù xuéxiào hòumiàn de fàndiàn.',
          'Tomorrow I want to go with my classmates to the restaurant behind the school.',
        ),
      ],
    ],
    questions: [
      {
        question: 'How did the writer and her mum get to the shops?',
        options: ['By taxi', 'By plane', 'They walked'],
        answer: 'By taxi',
      },
      {
        question: 'What did the writer buy?',
        options: ['A cup', 'Some clothes', 'Some fruit'],
        answer: 'A cup',
      },
      {
        question: 'What did the writer drink at the restaurant?',
        options: ['Tea', 'Water', 'Nothing'],
        answer: 'Water',
      },
      {
        question: 'Where does she want to go tomorrow?',
        options: ['A restaurant behind the school', 'Beijing', 'The hospital'],
        answer: 'A restaurant behind the school',
      },
    ],
  },
  {
    id: 'learning-chinese',
    title: s('学习汉语', 'xuéxí Hànyǔ', 'Learning Chinese'),
    hskLevel: 1,
    after: 'h1-u7-l4',
    extras: [],
    paragraphs: [
      [
        s('我在北京学习汉语。', 'wǒ zài Běijīng xuéxí Hànyǔ.', "I'm studying Chinese in Beijing."),
        s('我住在学校里。', 'wǒ zhù zài xuéxiào lǐ.', 'I live at the school.'),
        s(
          '我们的老师是北京人，她很好。',
          'wǒmen de lǎoshī shì Běijīng rén, tā hěn hǎo.',
          'Our teacher is from Beijing; she is very nice.',
        ),
        s(
          '上午我们听老师说话，下午我们读书、写字。',
          'shàngwǔ wǒmen tīng lǎoshī shuōhuà, xiàwǔ wǒmen dú shū, xiě zì.',
          'In the morning we listen to the teacher; in the afternoon we read and write characters.',
        ),
        s(
          '我现在能写八十多个字。',
          'wǒ xiànzài néng xiě bāshí duō gè zì.',
          'I can now write more than eighty characters.',
        ),
      ],
      [
        s(
          '我们怎么学习汉语？看中国电影！',
          'wǒmen zěnme xuéxí Hànyǔ? kàn Zhōngguó diànyǐng!',
          'How do we study Chinese? We watch Chinese films!',
        ),
        s(
          '星期五下午，我们在学校看中国电影。',
          'xīngqīwǔ xiàwǔ, wǒmen zài xuéxiào kàn Zhōngguó diànyǐng.',
          'On Friday afternoons we watch Chinese films at school.',
        ),
        s(
          '我很喜欢看中国电影。',
          'wǒ hěn xǐhuan kàn Zhōngguó diànyǐng.',
          'I really like watching Chinese films.',
        ),
        s('我爱学习汉语！', 'wǒ ài xuéxí Hànyǔ!', 'I love learning Chinese!'),
      ],
    ],
    questions: [
      {
        question: 'Where does the writer live?',
        options: ['At the school', 'With a Chinese family', 'In a hotel'],
        answer: 'At the school',
      },
      {
        question: 'What do they do in the afternoons?',
        options: ['Read and write characters', 'Watch TV', 'Go shopping'],
        answer: 'Read and write characters',
      },
      {
        question: 'How many characters can the writer write?',
        options: ['More than eighty', 'More than eight hundred', 'Eighteen'],
        answer: 'More than eighty',
      },
      {
        question: 'What happens on Friday afternoons?',
        options: ['They watch Chinese films', 'They have a test', 'They make phone calls'],
        answer: 'They watch Chinese films',
      },
    ],
  },
  {
    id: 'rain',
    title: s('下雨了', 'xià yǔ le', "It's raining"),
    hskLevel: 1,
    after: 'h1-u8-l1',
    extras: [ANNA, WANG_PENG],
    paragraphs: [
      [
        s('今天天气怎么样？', 'jīntiān tiānqì zěnmeyàng?', "What's the weather like today?"),
        s(
          '上午很热，下午下雨了。',
          'shàngwǔ hěn rè, xiàwǔ xià yǔ le.',
          'It was hot in the morning, and in the afternoon it rained.',
        ),
        s(
          '下午四点，我想回家。',
          'xiàwǔ sì diǎn, wǒ xiǎng huí jiā.',
          'At four in the afternoon, I wanted to go home.',
        ),
        s(
          '学校前面没有出租车。',
          'xuéxiào qiánmiàn méiyǒu chūzūchē.',
          'There were no taxis in front of the school.',
        ),
      ],
      [
        s(
          '我打电话：“喂，王朋，你在哪儿？”',
          'wǒ dǎ diànhuà: "wèi, Wáng Péng, nǐ zài nǎr?"',
          'I made a call: "Hello, Wang Peng, where are you?"',
        ),
      ],
      [s('“我在家。你怎么了？”', '"wǒ zài jiā. nǐ zěnme le?"', '"I\'m at home. What\'s up?"')],
      [
        s(
          '“下雨了，你能来学校吗？”',
          '"xià yǔ le, nǐ néng lái xuéxiào ma?"',
          '"It\'s raining. Could you come to the school?"',
        ),
      ],
      [s('“好！我坐出租车来。”', '"hǎo! wǒ zuò chūzūchē lái."', '"OK! I\'ll come by taxi."')],
      [
        s(
          '四点二十，王朋坐出租车来了。',
          'sì diǎn èrshí, Wáng Péng zuò chūzūchē lái le.',
          'At twenty past four, Wang Peng arrived in a taxi.',
        ),
        s('我们坐出租车回家了。', 'wǒmen zuò chūzūchē huí jiā le.', 'We took the taxi home.'),
        s('谢谢你，王朋！', 'xièxie nǐ, Wáng Péng!', 'Thank you, Wang Peng!'),
      ],
    ],
    questions: [
      {
        question: 'What was the weather like in the morning?',
        options: ['Hot', 'Cold', 'Rainy'],
        answer: 'Hot',
      },
      {
        question: "Why couldn't the writer get a taxi?",
        options: [
          'There were none in front of the school',
          'She had no money',
          'She wanted to walk',
        ],
        answer: 'There were none in front of the school',
      },
      {
        question: 'When did Wang Peng arrive?',
        options: ['At 4:20', 'At 4:00', 'At 2:40'],
        answer: 'At 4:20',
      },
    ],
  },

  // ——— HSK 2 ———
  {
    id: 'busy-monday',
    title: s('忙的星期一', 'máng de xīngqīyī', 'A busy Monday'),
    hskLevel: 2,
    after: 'h2-u2-l3',
    extras: [WANG_PENG, s('王', 'Wáng', 'Wang (a surname)'), s('每天', 'měi tiān', 'every day')],
    paragraphs: [
      [
        s(
          '我姓王，叫王朋。',
          'wǒ xìng Wáng, jiào Wáng Péng.',
          'My surname is Wang; I’m Wang Peng.',
        ),
        s(
          '我家有五个人：爸爸、妈妈、姐姐、弟弟和我。',
          'wǒ jiā yǒu wǔ gè rén: bàba, māma, jiějie, dìdi hé wǒ.',
          'There are five of us: Dad, Mum, my older sister, my younger brother and me.',
        ),
        s(
          '我姐姐在一个大公司上班，她每天都很忙。',
          'wǒ jiějie zài yí gè dà gōngsī shàngbān, tā měi tiān dōu hěn máng.',
          'My sister works at a big company. She is busy every day.',
        ),
      ],
      [
        s(
          '星期一早上，姐姐六点起床。',
          'xīngqīyī zǎoshang, jiějie liù diǎn qǐchuáng.',
          'On Monday morning, my sister got up at six.',
        ),
        s('她七点去公司上班。', 'tā qī diǎn qù gōngsī shàngbān.', 'At seven she went to work.'),
        s(
          '七点，我弟弟正在睡觉。',
          'qī diǎn, wǒ dìdi zhèngzài shuìjiào.',
          'At seven, my little brother was still asleep.',
        ),
        s(
          '妈妈进他的房间：“起床了！”',
          'māma jìn tā de fángjiān: "qǐchuáng le!"',
          'Mum went into his room: "Time to get up!"',
        ),
      ],
      [
        s(
          '晚上七点，姐姐回家了。',
          'wǎnshang qī diǎn, jiějie huí jiā le.',
          'At seven in the evening, my sister came home.',
        ),
        s('她很累，想休息。', 'tā hěn lèi, xiǎng xiūxi.', 'She was tired and wanted to rest.'),
        s(
          '弟弟在等她：“姐姐，你有时间吗？”',
          'dìdi zài děng tā: "jiějie, nǐ yǒu shíjiān ma?"',
          'My brother was waiting for her: "Sis, do you have time?"',
        ),
      ],
      [s('“没有，我太累了。”', '"méiyǒu, wǒ tài lèi le."', '"No, I\'m too tired."')],
    ],
    questions: [
      {
        question: "How many people are in Wang Peng's family?",
        options: ['Three', 'Four', 'Five'],
        answer: 'Five',
      },
      {
        question: 'When does his sister go to work?',
        options: ['At six', 'At seven', 'At eight'],
        answer: 'At seven',
      },
      {
        question: 'What was his brother doing at seven?',
        options: ['Sleeping', 'Eating breakfast', 'Getting ready for school'],
        answer: 'Sleeping',
      },
      {
        question: "Why doesn't the sister have time in the evening?",
        options: ["She's too tired", 'She has to work', "She's going out"],
        answer: "She's too tired",
      },
    ],
  },
  {
    id: 'shanghai-trip',
    title: s('去上海旅游', 'qù Shànghǎi lǚyóu', 'A trip to Shanghai'),
    hskLevel: 2,
    after: 'h2-u4-l3',
    extras: [s('上海', 'Shànghǎi', 'Shanghai')],
    paragraphs: [
      [
        s(
          '上个月，我和朋友去上海旅游了。',
          'shàng gè yuè, wǒ hé péngyou qù Shànghǎi lǚyóu le.',
          'Last month my friend and I went on a trip to Shanghai.',
        ),
        s(
          '我们从北京坐飞机去，飞机票很贵。',
          'wǒmen cóng Běijīng zuò fēijī qù, fēijī piào hěn guì.',
          'We flew from Beijing, and the plane tickets were expensive.',
        ),
        s(
          '我们的宾馆离火车站很近。',
          'wǒmen de bīnguǎn lí huǒchēzhàn hěn jìn.',
          'Our hotel was close to the railway station.',
        ),
        s(
          '宾馆旁边有一个饭店，饭店的面条很好吃。',
          'bīnguǎn pángbiān yǒu yí gè fàndiàn, fàndiàn de miàntiáo hěn hǎochī.',
          'There was a restaurant next to the hotel, and its noodles were delicious.',
        ),
      ],
      [
        s(
          '星期六，我们去商店买东西。',
          'xīngqīliù, wǒmen qù shāngdiàn mǎi dōngxi.',
          'On Saturday we went shopping.',
        ),
        s('我买了一件红衣服。', 'wǒ mǎi le yí jiàn hóng yīfu.', 'I bought a red top.'),
        s(
          '我朋友买了一件白的，很便宜。',
          'wǒ péngyou mǎi le yí jiàn bái de, hěn piányi.',
          'My friend bought a white one. It was cheap.',
        ),
        s(
          '晚上我们找不到宾馆了。',
          'wǎnshang wǒmen zhǎo bú dào bīnguǎn le.',
          "In the evening we couldn't find our hotel.",
        ),
        s(
          '我们坐出租车回宾馆了。',
          'wǒmen zuò chūzūchē huí bīnguǎn le.',
          'We took a taxi back to the hotel.',
        ),
        s(
          '上海很漂亮，我们都很喜欢。',
          'Shànghǎi hěn piàoliang, wǒmen dōu hěn xǐhuan.',
          'Shanghai is beautiful. We both loved it.',
        ),
      ],
    ],
    questions: [
      {
        question: 'How did they get to Shanghai?',
        options: ['By plane', 'By train', 'By boat'],
        answer: 'By plane',
      },
      {
        question: 'Where was their hotel?',
        options: ['Near the railway station', 'Next to the airport', 'A long way from anything'],
        answer: 'Near the railway station',
      },
      {
        question: 'What did the writer buy?',
        options: ['A red top', 'A white top', 'Plane tickets'],
        answer: 'A red top',
      },
      {
        question: 'What went wrong in the evening?',
        options: ["They couldn't find their hotel", 'They lost their tickets', 'It snowed'],
        answer: "They couldn't find their hotel",
      },
    ],
  },
  {
    id: 'the-exam',
    title: s('考试', 'kǎoshì', 'The exam'),
    hskLevel: 2,
    after: 'h2-u7-l3',
    extras: [WANG_PENG],
    paragraphs: [
      [
        s(
          '明天我们有汉语考试。',
          'míngtiān wǒmen yǒu Hànyǔ kǎoshì.',
          'Tomorrow we have a Chinese exam.',
        ),
        s(
          '今天晚上我在房间里准备考试。',
          'jīntiān wǎnshang wǒ zài fángjiān lǐ zhǔnbèi kǎoshì.',
          "This evening I'm in my room getting ready for it.",
        ),
        s(
          '有一个题我不懂。',
          'yǒu yí gè tí wǒ bù dǒng.',
          "There's one question I don't understand.",
        ),
        s(
          '我给王朋打电话，问他这个题是什么意思。',
          'wǒ gěi Wáng Péng dǎ diànhuà, wèn tā zhège tí shì shénme yìsi.',
          'I call Wang Peng and ask him what the question means.',
        ),
        s(
          '王朋说：“我来帮助你。”',
          'Wáng Péng shuō: "wǒ lái bāngzhù nǐ."',
          'Wang Peng says, "I\'ll come and help you."',
        ),
        s(
          '他来我的房间，给我介绍了这个题的意思。',
          'tā lái wǒ de fángjiān, gěi wǒ jièshào le zhège tí de yìsi.',
          'He comes to my room and explains the question to me.',
        ),
        s('现在我懂了！', 'xiànzài wǒ dǒng le!', 'Now I get it!'),
      ],
      [
        s(
          '考试的时候，那个题我做对了。',
          'kǎoshì de shíhou, nàge tí wǒ zuò duì le.',
          'In the exam, I got that question right.',
        ),
        s(
          '老师说我的汉语非常好。',
          'lǎoshī shuō wǒ de Hànyǔ fēicháng hǎo.',
          'The teacher said my Chinese is very good.',
        ),
        s(
          '晚上我请王朋吃羊肉。',
          'wǎnshang wǒ qǐng Wáng Péng chī yángròu.',
          'That evening I treated Wang Peng to lamb.',
        ),
      ],
    ],
    questions: [
      {
        question: 'What is the writer doing this evening?',
        options: ['Getting ready for an exam', 'Watching TV', 'Working late'],
        answer: 'Getting ready for an exam',
      },
      {
        question: 'Who helps?',
        options: ['Wang Peng', 'Her teacher', 'Her mum'],
        answer: 'Wang Peng',
      },
      {
        question: 'How did the writer do on that question?',
        options: ['She got it right', 'She got it wrong', 'She skipped it'],
        answer: 'She got it right',
      },
      {
        question: 'What did the writer treat Wang Peng to?',
        options: ['Lamb', 'Noodles', 'Coffee'],
        answer: 'Lamb',
      },
    ],
  },
  {
    id: 'new-phone',
    title: s('新手机', 'xīn shǒujī', 'A new phone'),
    hskLevel: 2,
    after: 'h2-u8-l3',
    extras: [],
    paragraphs: [
      [
        s('我想买一个新手机。', 'wǒ xiǎng mǎi yí gè xīn shǒujī.', 'I want to buy a new phone.'),
        s('因为我的手机太慢了。', 'yīnwèi wǒ de shǒujī tài màn le.', 'Because mine is too slow.'),
        s(
          '星期六，我和姐姐一起去商店。',
          'xīngqīliù, wǒ hé jiějie yìqǐ qù shāngdiàn.',
          'On Saturday my sister and I went to the shop together.',
        ),
        s(
          '商店里有很多手机，有的很贵，有的很便宜。',
          'shāngdiàn lǐ yǒu hěn duō shǒujī, yǒu de hěn guì, yǒu de hěn piányi.',
          'The shop had lots of phones: some expensive, some cheap.',
        ),
        s('我最喜欢这个黑的。', 'wǒ zuì xǐhuan zhège hēi de.', 'I liked this black one best.'),
        s(
          '但是它比别的手机贵五百块。',
          'dànshì tā bǐ bié de shǒujī guì wǔbǎi kuài.',
          'But it cost five hundred kuai more than the others.',
        ),
      ],
      [
        s(
          '姐姐说：“虽然它很贵，但是非常好。”',
          'jiějie shuō: "suīrán tā hěn guì, dànshì fēicháng hǎo."',
          'My sister said, "It\'s expensive, but it\'s really good."',
        ),
        s('我的钱不多。', 'wǒ de qián bù duō.', "I don't have much money."),
        s(
          '姐姐笑着说：“我给你一些钱，你的生日快到了！”',
          'jiějie xiào zhe shuō: "wǒ gěi nǐ yìxiē qián, nǐ de shēngrì kuài dào le!"',
          'My sister smiled and said, "I\'ll give you some money. It\'s nearly your birthday!"',
        ),
        s('我非常高兴。', 'wǒ fēicháng gāoxìng.', 'I was really happy.'),
      ],
    ],
    questions: [
      {
        question: 'Why does the writer want a new phone?',
        options: ['His phone is too slow', 'He lost his phone', 'His sister told him to'],
        answer: 'His phone is too slow',
      },
      {
        question: 'Which phone did the writer like best?',
        options: ['The black one', 'The white one', 'The cheapest one'],
        answer: 'The black one',
      },
      {
        question: 'How much more did it cost than the others?',
        options: ['50 kuai', '500 kuai', '5,000 kuai'],
        answer: '500 kuai',
      },
      {
        question: "Why does the writer's sister give them money?",
        options: [
          "It's nearly his birthday",
          'He did well in an exam',
          'He paid for her phone before',
        ],
        answer: "It's nearly his birthday",
      },
    ],
  },

  // ——— HSK 3 ———
  {
    id: 'homesick',
    title: s('想家', 'xiǎng jiā', 'Homesick'),
    hskLevel: 3,
    after: 'h3-u2-l3',
    extras: [ANNA, WANG_PENG],
    paragraphs: [
      [
        s(
          '安娜来北京已经三个月了。',
          'Ānnà lái Běijīng yǐjīng sān gè yuè le.',
          'Anna has been in Beijing for three months.',
        ),
        s(
          '她很喜欢北京，但是这几个星期她不太高兴。',
          'tā hěn xǐhuan Běijīng, dànshì zhè jǐ gè xīngqī tā bú tài gāoxìng.',
          "She loves Beijing, but for the past few weeks she hasn't been very happy.",
        ),
        s(
          '她很想爸爸妈妈，也想她的猫。',
          'tā hěn xiǎng bàba māma, yě xiǎng tā de māo.',
          'She misses her mum and dad a lot, and her cat too.',
        ),
      ],
      [
        s(
          '星期六晚上，王朋给她打电话。',
          'xīngqīliù wǎnshang, Wáng Péng gěi tā dǎ diànhuà.',
          'On Saturday evening, Wang Peng phoned her.',
        ),
        s(
          '“你怎么了？你生病了吗？”',
          '"nǐ zěnme le? nǐ shēngbìng le ma?"',
          '"What\'s wrong? Are you ill?"',
        ),
        s(
          '安娜说：“我没生病，我就是想家了。”',
          'Ānnà shuō: "wǒ méi shēngbìng, wǒ jiù shì xiǎng jiā le."',
          'Anna said, "I\'m not ill. I\'m just homesick."',
        ),
        s(
          '王朋说：“别难过！明天我们一起去饭馆吃羊肉吧。”',
          'Wáng Péng shuō: "bié nánguò! míngtiān wǒmen yìqǐ qù fànguǎn chī yángròu ba."',
          'Wang Peng said, "Don\'t be sad! Let\'s go to a restaurant for lamb tomorrow."',
        ),
      ],
      [
        s(
          '星期日中午，王朋还叫了几个同学。',
          'xīngqīrì zhōngwǔ, Wáng Péng hái jiào le jǐ gè tóngxué.',
          'At lunchtime on Sunday, Wang Peng brought along a few classmates too.',
        ),
        s(
          '大家一起吃东西、说话，非常快乐。',
          'dàjiā yìqǐ chī dōngxi, shuōhuà, fēicháng kuàilè.',
          'They all ate and chatted together, and had a great time.',
        ),
        s(
          '回家的时候，安娜笑着说：“谢谢大家，我现在不想家了！”',
          'huí jiā de shíhou, Ānnà xiào zhe shuō: "xièxie dàjiā, wǒ xiànzài bù xiǎng jiā le!"',
          'On the way home Anna said with a smile, "Thanks, everyone — I\'m not homesick any more!"',
        ),
      ],
    ],
    questions: [
      {
        question: 'How long has Anna been in Beijing?',
        options: ['Three months', 'Three weeks', 'A year'],
        answer: 'Three months',
      },
      {
        question: 'What does Anna miss?',
        options: ['Her parents and her cat', 'Her school', 'Her dog'],
        answer: 'Her parents and her cat',
      },
      {
        question: 'What did Wang Peng suggest?',
        options: ['Eating out together', 'Going to the cinema', 'Phoning her parents'],
        answer: 'Eating out together',
      },
      {
        question: 'How did Anna feel at the end?',
        options: ['Much happier', 'Still homesick', 'Very tired'],
        answer: 'Much happier',
      },
    ],
  },
  {
    id: 'new-neighbour',
    title: s('新邻居', 'xīn línjū', 'The new neighbour'),
    hskLevel: 3,
    after: 'h3-u3-l4',
    extras: [],
    paragraphs: [
      [
        s(
          '上个星期，我们楼里来了一个新邻居。',
          'shàng gè xīngqī, wǒmen lóu lǐ lái le yí gè xīn línjū.',
          'Last week a new neighbour moved into our building.',
        ),
        s(
          '她是一个年轻的女孩子，个子很高，头发很长。',
          'tā shì yí gè niánqīng de nǚ háizi, gèzi hěn gāo, tóufa hěn cháng.',
          "She's a young woman: tall, with long hair.",
        ),
        s(
          '她住在我们家楼上，六层。',
          'tā zhù zài wǒmen jiā lóu shàng, liù céng.',
          'She lives upstairs from us, on the sixth floor.',
        ),
      ],
      [
        s(
          '星期六她搬家，东西很多，她很着急。',
          'xīngqīliù tā bān jiā, dōngxi hěn duō, tā hěn zháojí.',
          'On Saturday she moved in. She had lots of things and was stressed.',
        ),
        s(
          '我妈妈很热情，让我去帮忙。',
          'wǒ māma hěn rèqíng, ràng wǒ qù bāngmáng.',
          'My mum is very warm-hearted, and she sent me to help.',
        ),
        s(
          '我帮忙搬了很多包和盘子。',
          'wǒ bāngmáng bān le hěn duō bāo hé pánzi.',
          'I helped carry lots of bags and plates.',
        ),
        s(
          '她说：“太谢谢你了！欢迎你来我家玩。”',
          'tā shuō: "tài xièxie nǐ le! huānyíng nǐ lái wǒ jiā wán."',
          'She said, "Thank you so much! Come round any time."',
        ),
      ],
      [
        s(
          '晚上，她来我家送了我们一些水果。',
          'wǎnshang, tā lái wǒ jiā sòng le wǒmen yìxiē shuǐguǒ.',
          'In the evening she came over and gave us some fruit.',
        ),
        s(
          '妈妈很满意：“她真是一个好邻居！”',
          'māma hěn mǎnyì: "tā zhēn shì yí gè hǎo línjū!"',
          'Mum was delighted: "She really is a good neighbour!"',
        ),
      ],
    ],
    questions: [
      {
        question: 'What does the new neighbour look like?',
        options: ['Tall, with long hair', 'Short, with short hair', 'Old and thin'],
        answer: 'Tall, with long hair',
      },
      {
        question: 'Which floor does she live on?',
        options: ['The sixth', 'The first', 'The tenth'],
        answer: 'The sixth',
      },
      {
        question: 'How did the writer help?',
        options: ['Carried bags and plates', 'Cleaned her flat', 'Cooked her dinner'],
        answer: 'Carried bags and plates',
      },
      {
        question: 'What did the neighbour give them?',
        options: ['Some fruit', 'A cake', 'Some flowers'],
        answer: 'Some fruit',
      },
    ],
  },
  {
    id: 'cooking-for-friends',
    title: s('做菜', 'zuò cài', 'Cooking for friends'),
    hskLevel: 3,
    after: 'h3-u4-l4',
    extras: [ANNA, WANG_PENG],
    paragraphs: [
      [
        s(
          '这个星期六，安娜想请朋友来她家吃中国菜。',
          'zhège xīngqīliù, Ānnà xiǎng qǐng péngyou lái tā jiā chī Zhōngguó cài.',
          'This Saturday, Anna wants to have friends over for Chinese food.',
        ),
        s('但是她不太会做。', 'dànshì tā bú tài huì zuò.', "But she can't really cook it."),
        s(
          '她给王朋打电话，王朋说：“别担心，我来帮忙。”',
          'tā gěi Wáng Péng dǎ diànhuà, Wáng Péng shuō: "bié dānxīn, wǒ lái bāngmáng."',
          'She phoned Wang Peng, and he said, "Don\'t worry, I\'ll help."',
        ),
      ],
      [
        s(
          '星期六上午，两个人一起去超市买东西。',
          'xīngqīliù shàngwǔ, liǎng gè rén yìqǐ qù chāoshì mǎi dōngxi.',
          'On Saturday morning the two of them went shopping at the supermarket.',
        ),
        s(
          '安娜买了鸡蛋、羊肉、面条和很多新鲜水果。',
          'Ānnà mǎi le jīdàn, yángròu, miàntiáo hé hěn duō xīnxiān shuǐguǒ.',
          'Anna bought eggs, lamb, noodles and lots of fresh fruit.',
        ),
        s(
          '一共花了两百多块钱。',
          'yígòng huā le liǎngbǎi duō kuài qián.',
          'It came to over two hundred yuan altogether.',
        ),
      ],
      [
        s(
          '回到家，王朋告诉安娜怎么做菜。',
          'huí dào jiā, Wáng Péng gàosu Ānnà zěnme zuò cài.',
          'Back home, Wang Peng showed Anna how to cook.',
        ),
        s(
          '安娜做得很认真，但是第一个菜不太好吃。',
          'Ānnà zuò de hěn rènzhēn, dànshì dì-yī gè cài bú tài hǎochī.',
          "Anna worked hard at it, but the first dish wasn't very nice.",
        ),
        s(
          '王朋笑了：“没关系，再做一个！”',
          'Wáng Péng xiào le: "méi guānxi, zài zuò yí gè!"',
          'Wang Peng laughed. "Never mind — make another one!"',
        ),
      ],
      [
        s(
          '晚上七点，朋友都来了。',
          'wǎnshang qī diǎn, péngyou dōu lái le.',
          'At seven that evening, all her friends arrived.',
        ),
        s(
          '大家都说菜很好吃。',
          'dàjiā dōu shuō cài hěn hǎochī.',
          'Everyone said the food was delicious.',
        ),
        s(
          '安娜非常高兴：“下次我一个人做！”',
          'Ānnà fēicháng gāoxìng: "xià cì wǒ yí gè rén zuò!"',
          'Anna was delighted. "Next time I\'ll do it on my own!"',
        ),
      ],
    ],
    questions: [
      {
        question: 'Why did Anna phone Wang Peng?',
        options: ["She couldn't cook Chinese food well", 'She needed money', 'She was lost'],
        answer: "She couldn't cook Chinese food well",
      },
      {
        question: 'Where did they go shopping?',
        options: ['The supermarket', 'A market', 'Online'],
        answer: 'The supermarket',
      },
      {
        question: 'What went wrong?',
        options: [
          "The first dish wasn't very good",
          'They forgot the eggs',
          'The friends were late',
        ],
        answer: "The first dish wasn't very good",
      },
      {
        question: 'What does Anna say at the end?',
        options: [
          "Next time she'll cook on her own",
          "She'll never cook again",
          'She wants to go to a restaurant',
        ],
        answer: "Next time she'll cook on her own",
      },
    ],
  },
  {
    id: 'the-park',
    title: s('去公园', 'qù gōngyuán', 'To the park'),
    hskLevel: 3,
    after: 'h3-u6-l3',
    extras: [s('秋天', 'qiūtiān', 'autumn')],
    paragraphs: [
      [
        s(
          '北京的秋天非常漂亮。',
          'Běijīng de qiūtiān fēicháng piàoliang.',
          'Autumn in Beijing is beautiful.',
        ),
        s(
          '天气不冷也不热，很少下雨。',
          'tiānqì bù lěng yě bú rè, hěn shǎo xià yǔ.',
          "It's neither cold nor hot, and it hardly ever rains.",
        ),
        s(
          '星期六上午，我和爷爷坐地铁去公园。',
          'xīngqīliù shàngwǔ, wǒ hé yéye zuò dìtiě qù gōngyuán.',
          'On Saturday morning, Grandpa and I took the subway to the park.',
        ),
        s('公园在我们家附近。', 'gōngyuán zài wǒmen jiā fùjìn.', 'The park is near our home.'),
      ],
      [
        s(
          '公园里有很多树，树上有很多鸟。',
          'gōngyuán lǐ yǒu hěn duō shù, shù shàng yǒu hěn duō niǎo.',
          'There are lots of trees in the park, full of birds.',
        ),
        s(
          '爷爷喜欢听鸟唱歌。',
          'yéye xǐhuan tīng niǎo chàng gē.',
          'Grandpa loves listening to the birds sing.',
        ),
        s(
          '我们坐在草上，看太阳和云。',
          'wǒmen zuò zài cǎo shàng, kàn tàiyáng hé yún.',
          'We sat on the grass watching the sun and the clouds.',
        ),
        s(
          '下午开始刮风，我们就回家了。',
          'xiàwǔ kāishǐ guā fēng, wǒmen jiù huí jiā le.',
          'In the afternoon the wind picked up, so we went home.',
        ),
        s(
          '爷爷说：“下个星期，我们去看熊猫！”',
          'yéye shuō: "xià gè xīngqī, wǒmen qù kàn xióngmāo!"',
          'Grandpa said, "Next week, we\'ll go and see the pandas!"',
        ),
      ],
    ],
    questions: [
      {
        question: 'Why is autumn nice in Beijing?',
        options: ["It's neither hot nor cold, and rarely rains", 'It snows a lot', "It's very hot"],
        answer: "It's neither hot nor cold, and rarely rains",
      },
      {
        question: 'How did they get to the park?',
        options: ['By subway', 'By bus', 'By bike'],
        answer: 'By subway',
      },
      {
        question: 'Why did they go home?',
        options: ['It got windy', 'It rained', 'Grandpa was tired'],
        answer: 'It got windy',
      },
      {
        question: 'What will they do next week?',
        options: ['Go and see the pandas', 'Go back to the park', 'Climb a mountain'],
        answer: 'Go and see the pandas',
      },
    ],
  },
  {
    id: 'restaurant-job',
    title: s('饭店的工作', 'fàndiàn de gōngzuò', 'A restaurant job'),
    hskLevel: 3,
    after: 'h3-u8-l3',
    extras: [WANG_PENG, s('李', 'Lǐ', 'Li (a surname)')],
    paragraphs: [
      [
        s(
          '去年七月和八月，王朋在一家饭店工作。',
          'qùnián qī yuè hé bā yuè, Wáng Péng zài yì jiā fàndiàn gōngzuò.',
          'Last July and August, Wang Peng worked in a restaurant.',
        ),
        s(
          '他早上八点上班，晚上六点回家。',
          'tā zǎoshang bā diǎn shàngbān, wǎnshang liù diǎn huí jiā.',
          'He started work at eight in the morning and got home at six in the evening.',
        ),
        s(
          '工作很累，但是他觉得很有意思。',
          'gōngzuò hěn lèi, dànshì tā juéde hěn yǒu yìsi.',
          'The work was tiring, but he found it interesting.',
        ),
      ],
      [
        s(
          '饭店的经理姓李，四十多岁。',
          'fàndiàn de jīnglǐ xìng Lǐ, sìshí duō suì.',
          'The restaurant manager was called Li, and was in her forties.',
        ),
        s(
          '李经理对王朋很好，也很关心他。',
          'Lǐ jīnglǐ duì Wáng Péng hěn hǎo, yě hěn guānxīn tā.',
          'Manager Li was good to Wang Peng and looked out for him.',
        ),
        s(
          '有一次，一个客人生气了，因为他的菜等了很长时间。',
          'yǒu yí cì, yí gè kèrén shēngqì le, yīnwèi tā de cài děng le hěn cháng shíjiān.',
          'Once, a customer got angry because he had waited a long time for his food.',
        ),
        s(
          '王朋不知道怎么解决。',
          'Wáng Péng bù zhīdào zěnme jiějué.',
          "Wang Peng didn't know how to sort it out.",
        ),
      ],
      [
        s(
          '李经理走过来，笑着对客人说：“对不起，今天的菜不要钱。”',
          'Lǐ jīnglǐ zǒu guòlái, xiào zhe duì kèrén shuō: "duìbuqǐ, jīntiān de cài bú yào qián."',
          'Manager Li came over and said to him with a smile, "I\'m sorry — today\'s meal is free."',
        ),
        s(
          '客人很快就不生气了。',
          'kèrén hěn kuài jiù bù shēngqì le.',
          'The customer soon calmed down.',
        ),
        s(
          '王朋明白了：做这个工作，要让客人满意。',
          'Wáng Péng míngbai le: zuò zhège gōngzuò, yào ràng kèrén mǎnyì.',
          'Wang Peng understood: in this job, you have to keep the customers happy.',
        ),
      ],
    ],
    questions: [
      {
        question: 'Where did Wang Peng work last summer?',
        options: ['A restaurant', 'A shop', 'A school'],
        answer: 'A restaurant',
      },
      {
        question: 'Why was the customer angry?',
        options: ['He had waited a long time', 'His food was cold', 'The bill was wrong'],
        answer: 'He had waited a long time',
      },
      {
        question: 'What did Manager Li do?',
        options: ['Told him the meal was free', 'Asked him to leave', 'Blamed Wang Peng'],
        answer: 'Told him the meal was free',
      },
      {
        question: 'What did Wang Peng learn?',
        options: ['Keeping customers happy matters', 'Cooking is hard', 'Managers are strict'],
        answer: 'Keeping customers happy matters',
      },
    ],
  },
  {
    id: 'hobbies',
    title: s('我的爱好', 'wǒ de àihào', 'My hobbies'),
    hskLevel: 3,
    after: 'h3-u9-l3',
    extras: [WANG_PENG],
    paragraphs: [
      [
        s(
          '我叫王朋，我的爱好是爬山和画画。',
          'wǒ jiào Wáng Péng, wǒ de àihào shì pá shān hé huà huà.',
          "I'm Wang Peng. My hobbies are hiking and painting.",
        ),
        s(
          '每个星期六，我都和几个朋友一起去爬山。',
          'měi gè xīngqīliù, wǒ dōu hé jǐ gè péngyou yìqǐ qù pá shān.',
          'Every Saturday I go hiking with a few friends.',
        ),
        s(
          '爬山可以锻炼身体，对健康很好。',
          'pá shān kěyǐ duànliàn shēntǐ, duì jiànkāng hěn hǎo.',
          "Hiking is good exercise, and it's good for your health.",
        ),
        s(
          '我们一边爬山，一边聊天。',
          'wǒmen yìbiān pá shān, yìbiān liáotiān.',
          'We chat as we climb.',
        ),
        s(
          '累了我们就休息，吃一些面包和香蕉。',
          'lèi le wǒmen jiù xiūxi, chī yìxiē miànbāo hé xiāngjiāo.',
          'When we get tired we rest and eat some bread and bananas.',
        ),
      ],
      [
        s(
          '我的照相机里有很多照片。',
          'wǒ de zhàoxiàngjī lǐ yǒu hěn duō zhàopiàn.',
          'My camera is full of photos.',
        ),
        s(
          '晚上，我喜欢画这些照片里的地方。',
          'wǎnshang, wǒ xǐhuan huà zhèxiē zhàopiàn lǐ de dìfang.',
          'In the evenings I like to paint the places in them.',
        ),
        s(
          '上个月，我参加了一个画画比赛。',
          'shàng gè yuè, wǒ cānjiā le yí gè huà huà bǐsài.',
          'Last month I entered a painting competition.',
        ),
        s(
          '我画了一个很有名的地方，得了第一。',
          'wǒ huà le yí gè hěn yǒumíng de dìfang, dé le dì yī.',
          'I painted a famous place and came first.',
        ),
        s('我非常高兴！', 'wǒ fēicháng gāoxìng!', 'I was thrilled!'),
      ],
    ],
    questions: [
      {
        question: "What are Wang Peng's hobbies?",
        options: ['Hiking and painting', 'Swimming and singing', 'Films and music'],
        answer: 'Hiking and painting',
      },
      {
        question: 'What do they eat when they get tired?',
        options: ['Bread and bananas', 'Cake', 'Noodles'],
        answer: 'Bread and bananas',
      },
      {
        question: 'What does he paint in the evenings?',
        options: ['Places from his photos', 'His friends', 'Animals'],
        answer: 'Places from his photos',
      },
      {
        question: 'How did he do in the competition?',
        options: ['He came first', 'He came second', "He didn't finish"],
        answer: 'He came first',
      },
    ],
  },
  {
    id: 'late',
    title: s('迟到了', 'chídào le', 'Late!'),
    hskLevel: 3,
    after: 'h3-u10-l4',
    extras: [ANNA],
    paragraphs: [
      [
        s(
          '昨天晚上，安娜看电视看到十二点。',
          "zuótiān wǎnshang, Ānnà kàn diànshì kàn dào shí'èr diǎn.",
          'Last night Anna watched TV until midnight.',
        ),
        s(
          '今天早上她起床的时候，已经八点半了。',
          'jīntiān zǎoshang tā qǐchuáng de shíhou, yǐjīng bā diǎn bàn le.',
          'When she got up this morning, it was already half past eight.',
        ),
        s('她九点有考试！', 'tā jiǔ diǎn yǒu kǎoshì!', 'She had an exam at nine!'),
      ],
      [
        s(
          '她马上穿好衣服，什么也没吃就走了。',
          'tā mǎshàng chuān hǎo yīfu, shénme yě méi chī jiù zǒu le.',
          'She got dressed at once and left without eating anything.',
        ),
        s(
          '但是等公共汽车的人太多了，她等了二十分钟。',
          'dànshì děng gōnggòng qìchē de rén tài duō le, tā děng le èrshí fēnzhōng.',
          'But there were too many people waiting for the bus, and she waited twenty minutes.',
        ),
        s(
          '最后她决定走路去学校。',
          'zuìhòu tā juédìng zǒu lù qù xuéxiào.',
          'In the end she decided to walk to school.',
        ),
      ],
      [
        s(
          '她到教室的时候，已经九点十分了。',
          'tā dào jiàoshì de shíhou, yǐjīng jiǔ diǎn shí fēn le.',
          'By the time she reached the classroom, it was ten past nine.',
        ),
        s(
          '老师看了看她，说：“别着急，考试十点才开始。”',
          'lǎoshī kàn le kàn tā, shuō: "bié zháojí, kǎoshì shí diǎn cái kāishǐ."',
          'The teacher looked at her and said, "Don\'t panic, the exam doesn\'t start until ten."',
        ),
        s(
          '安娜这才明白，是她看错了时间。',
          'Ānnà zhè cái míngbai, shì tā kàn cuò le shíjiān.',
          'Only then did Anna realise she had got the time wrong.',
        ),
        s(
          '她笑了：“下次我十点就睡觉！”',
          'tā xiào le: "xià cì wǒ shí diǎn jiù shuìjiào!"',
          'She laughed. "Next time I\'m going to bed at ten!"',
        ),
      ],
    ],
    questions: [
      {
        question: 'Why did Anna get up late?',
        options: ['She watched TV until midnight', 'Her alarm broke', 'She was ill'],
        answer: 'She watched TV until midnight',
      },
      {
        question: 'How did she get to school in the end?',
        options: ['She walked', 'By taxi', 'By bus'],
        answer: 'She walked',
      },
      {
        question: 'When did the exam really start?',
        options: ['At ten', 'At nine', 'At half past eight'],
        answer: 'At ten',
      },
      {
        question: 'What will she do next time?',
        options: ['Go to bed earlier', 'Take a taxi', 'Skip breakfast'],
        answer: 'Go to bed earlier',
      },
    ],
  },
  {
    id: 'a-year-in-china',
    title: s('在中国的一年', 'zài Zhōngguó de yì nián', 'A year in China'),
    hskLevel: 3,
    after: 'h3-u12-l8',
    extras: [WANG_PENG],
    paragraphs: [
      [
        s(
          '我来中国留学已经一年了。',
          'wǒ lái Zhōngguó liúxué yǐjīng yì nián le.',
          "I've been studying in China for a year now.",
        ),
        s(
          '以前我的汉语水平很差。',
          'yǐqián wǒ de Hànyǔ shuǐpíng hěn chà.',
          'My Chinese used to be poor.',
        ),
        s(
          '我听不懂别人说话，也不习惯这里的环境。',
          'wǒ tīng bu dǒng biérén shuōhuà, yě bù xíguàn zhèlǐ de huánjìng.',
          "I couldn't understand people, and I wasn't used to life here.",
        ),
        s(
          '第一个月，我感冒发烧了，还很想家。',
          'dì yī gè yuè, wǒ gǎnmào fāshāo le, hái hěn xiǎng jiā.',
          'In my first month I caught a cold and a fever, and I was very homesick.',
        ),
      ],
      [
        s(
          '我的邻居王朋很关心我，他带我去医院检查身体。',
          'wǒ de línjū Wáng Péng hěn guānxīn wǒ, tā dài wǒ qù yīyuàn jiǎnchá shēntǐ.',
          'My neighbour Wang Peng looked out for me and took me to the hospital for a check-up.',
        ),
        s(
          '然后，他经常跟我聊天，帮助我练习汉语。',
          'ránhòu, tā jīngcháng gēn wǒ liáotiān, bāngzhù wǒ liànxí Hànyǔ.',
          'After that he often chatted with me, helping me practise my Chinese.',
        ),
        s(
          '我也经常看中文新闻和电视节目。',
          'wǒ yě jīngcháng kàn Zhōngwén xīnwén hé diànshì jiémù.',
          'I also often watched the news and TV programmes in Chinese.',
        ),
        s(
          '现在，我的汉语提高了很多。',
          'xiànzài, wǒ de Hànyǔ tígāo le hěn duō.',
          'Now my Chinese has improved a lot.',
        ),
      ],
      [
        s(
          '我发现，了解一个国家的文化和历史，对学习汉语很有帮助。',
          'wǒ fāxiàn, liǎojiě yí gè guójiā de wénhuà hé lìshǐ, duì xuéxí Hànyǔ hěn yǒu bāngzhù.',
          "I've found that understanding a country's culture and history really helps with learning Chinese.",
        ),
        s(
          '我觉得来中国是我最重要的决定。',
          'wǒ juéde lái Zhōngguó shì wǒ zuì zhòngyào de juédìng.',
          'I think coming to China was the most important decision I have made.',
        ),
      ],
    ],
    questions: [
      {
        question: 'How long has the writer been in China?',
        options: ['A year', 'A month', 'Three years'],
        answer: 'A year',
      },
      {
        question: "What happened in the writer's first month?",
        options: ['She caught a cold and a fever', 'She lost her passport', 'She moved house'],
        answer: 'She caught a cold and a fever',
      },
      {
        question: 'How did Wang Peng help?',
        options: [
          'He took her to hospital and practised Chinese with her',
          'He paid for her flat',
          'He taught at her school',
        ],
        answer: 'He took her to hospital and practised Chinese with her',
      },
      {
        question: 'What has the writer found helps with learning Chinese?',
        options: [
          "Understanding the country's culture and history",
          'Only studying grammar',
          'Staying at home',
        ],
        answer: "Understanding the country's culture and history",
      },
    ],
  },

  // ——— HSK 4 ———
  {
    id: 'moving-house',
    title: s('搬家', 'bān jiā', 'Moving house'),
    hskLevel: 4,
    after: 'h4-u3-l5',
    extras: [WANG_PENG],
    paragraphs: [
      [
        s('上个月我搬家了。', 'shàng gè yuè wǒ bān jiā le.', 'Last month I moved house.'),
        s(
          '我在郊区租了一个房间，房东是一个很热情的阿姨。',
          'wǒ zài jiāoqū zū le yí gè fángjiān, fángdōng shì yí gè hěn rèqíng de āyí.',
          'I rented a room in the suburbs. The landlady is a very warm older woman.',
        ),
        s(
          '她的性格很活泼，也很幽默。',
          'tā de xìnggé hěn huópō, yě hěn yōumò.',
          'She is lively and funny.',
        ),
        s(
          '房间不大，但是很干净。',
          'fángjiān bú dà, dànshì hěn gānjìng.',
          "The room isn't big, but it's clean.",
        ),
        s(
          '客厅里有一个沙发，厨房的窗户很大。',
          'kètīng lǐ yǒu yí gè shāfā, chúfáng de chuānghu hěn dà.',
          "There's a sofa in the living room, and the kitchen has a big window.",
        ),
      ],
      [
        s(
          '搬家的时候，我的朋友王朋来帮忙。',
          'bān jiā de shíhou, wǒ de péngyou Wáng Péng lái bāngmáng.',
          'My friend Wang Peng came to help with the move.',
        ),
        s(
          '我们一起抬桌子，推椅子，非常累。',
          'wǒmen yìqǐ tái zhuōzi, tuī yǐzi, fēicháng lèi.',
          'We carried tables and pushed chairs together. It was exhausting.',
        ),
        s(
          '我找不到钥匙了，心情很不好。',
          'wǒ zhǎo bú dào yàoshi le, xīnqíng hěn bù hǎo.',
          "I couldn't find my keys and got into a bad mood.",
        ),
        s(
          '王朋笑着说：“你看，钥匙在盒子里！”',
          'Wáng Péng xiào zhe shuō: "nǐ kàn, yàoshi zài hézi lǐ!"',
          'Wang Peng laughed: "Look, the keys are in the box!"',
        ),
      ],
      [
        s(
          '晚上，我们收拾好了房间。',
          'wǎnshang, wǒmen shōushi hǎo le fángjiān.',
          'In the evening we finished tidying the room.',
        ),
        s(
          '我们都很累，躺在沙发上休息。',
          'wǒmen dōu hěn lèi, tǎng zài shāfā shàng xiūxi.',
          'We were both tired and lay on the sofa to rest.',
        ),
        s(
          '周围很安静，我觉得很幸福。',
          'zhōuwéi hěn ānjìng, wǒ juéde hěn xìngfú.',
          'It was quiet all around, and I felt very happy.',
        ),
      ],
    ],
    questions: [
      {
        question: 'Where did the writer rent a room?',
        options: ['In the suburbs', 'In the city centre', 'Next to the school'],
        answer: 'In the suburbs',
      },
      {
        question: 'What is the landlady like?',
        options: ['Lively and funny', 'Strict and serious', 'Shy and quiet'],
        answer: 'Lively and funny',
      },
      {
        question: 'Where were the keys?',
        options: ['In a box', 'In the kitchen', 'On the sofa'],
        answer: 'In a box',
      },
      {
        question: 'How did the writer feel at the end?',
        options: ['Happy', 'Lonely', 'Annoyed'],
        answer: 'Happy',
      },
    ],
  },
  {
    id: 'lost-at-the-wall',
    title: s('迷路', 'mílù', 'Lost'),
    hskLevel: 4,
    after: 'h4-u6-l6',
    extras: [],
    paragraphs: [
      [
        s(
          '上个星期，我和朋友去长城旅行。',
          'shàng gè xīngqī, wǒ hé péngyou qù Chángchéng lǚxíng.',
          'Last week my friend and I took a trip to the Great Wall.',
        ),
        s(
          '我们早上七点出发，路上一直堵车。',
          'wǒmen zǎoshang qī diǎn chūfā, lù shàng yìzhí dǔchē.',
          'We set off at seven in the morning and were stuck in traffic the whole way.',
        ),
        s(
          '到了长城，导游带我们参观。',
          'dào le Chángchéng, dǎoyóu dài wǒmen cānguān.',
          'At the Wall, a guide showed us around.',
        ),
        s(
          '长城非常著名，人也非常多。',
          'Chángchéng fēicháng zhùmíng, rén yě fēicháng duō.',
          'The Great Wall is very famous, and it was very crowded.',
        ),
      ],
      [
        s(
          '下午，我去买水，顺便上厕所。',
          'xiàwǔ, wǒ qù mǎi shuǐ, shùnbiàn shàng cèsuǒ.',
          'In the afternoon I went to buy water and use the toilet.',
        ),
        s(
          '回来的时候，我找不到朋友和导游了。',
          'huí lái de shíhou, wǒ zhǎo bú dào péngyou hé dǎoyóu le.',
          "When I came back, I couldn't find my friend or the guide.",
        ),
        s(
          '我迷路了，也不知道方向。',
          'wǒ mílù le, yě bù zhīdào fāngxiàng.',
          "I was lost and didn't know which way to go.",
        ),
        s(
          '我很紧张，给朋友打电话，但是他没有接。',
          'wǒ hěn jǐnzhāng, gěi péngyou dǎ diànhuà, dànshì tā méiyǒu jiē.',
          "I was nervous and called my friend, but he didn't answer.",
        ),
      ],
      [
        s(
          '这时候，一个小伙子问我：“你迷路了吗？”',
          'zhè shíhou, yí gè xiǎohuǒzi wèn wǒ: "nǐ mílù le ma?"',
          'Just then, a young man asked me, "Are you lost?"',
        ),
        s(
          '他很友好，带我走到了入口。',
          'tā hěn yǒuhǎo, dài wǒ zǒu dào le rùkǒu.',
          'He was friendly and walked me to the entrance.',
        ),
        s(
          '我的朋友正在入口等我。',
          'wǒ de péngyou zhèngzài rùkǒu děng wǒ.',
          'My friend was waiting for me at the entrance.',
        ),
        s(
          '我非常感动，说了很多次“谢谢”。',
          'wǒ fēicháng gǎndòng, shuō le hěn duō cì "xièxie".',
          'I was really touched and said "thank you" many times.',
        ),
      ],
    ],
    questions: [
      {
        question: 'Where did they go?',
        options: ['The Great Wall', 'The Yangtze River', 'The embassy'],
        answer: 'The Great Wall',
      },
      {
        question: 'Why did the writer leave the group?',
        options: ['To buy water and use the toilet', 'To take photos', 'To find a taxi'],
        answer: 'To buy water and use the toilet',
      },
      {
        question: 'Who helped the writer?',
        options: ['A young man', 'The tour guide', 'A police officer'],
        answer: 'A young man',
      },
      {
        question: 'Where was the friend waiting?',
        options: ['At the entrance', 'In the car park', 'At the hotel'],
        answer: 'At the entrance',
      },
    ],
  },
  {
    id: 'learning-to-swim',
    title: s('游泳课', 'yóuyǒng kè', 'Swimming lessons'),
    hskLevel: 4,
    after: 'h4-u9-l5',
    extras: [WANG_PENG, ANNA],
    paragraphs: [
      [
        s(
          '王朋有一个小问题：他不会游泳。',
          'Wáng Péng yǒu yí gè xiǎo wèntí: tā bú huì yóuyǒng.',
          "Wang Peng had a little problem: he couldn't swim.",
        ),
        s(
          '他没告诉过别人，因为他觉得很害羞。',
          'tā méi gàosu guo biérén, yīnwèi tā juéde hěn hàixiū.',
          "He'd never told anyone, because he was embarrassed.",
        ),
        s(
          '上个月，他终于决定去学习游泳。',
          'shàng gè yuè, tā zhōngyú juédìng qù xuéxí yóuyǒng.',
          'Last month, he finally decided to learn.',
        ),
        s(
          '他在学校附近找了一个游泳班，每个星期上两次课。',
          'tā zài xuéxiào fùjìn zhǎo le yí gè yóuyǒng bān, měi gè xīngqī shàng liǎng cì kè.',
          'He found a swimming class near his university, with lessons twice a week.',
        ),
      ],
      [
        s(
          '第一次上课的时候，他紧张极了。',
          'dì-yī cì shàng kè de shíhou, tā jǐnzhāng jí le.',
          'At his first lesson he was incredibly nervous.',
        ),
        s(
          '老师是一个很有耐心的人。',
          'lǎoshī shì yí gè hěn yǒu nàixīn de rén.',
          'The teacher was very patient.',
        ),
        s(
          '她对王朋说：“别害怕，先放松身体。”',
          'tā duì Wáng Péng shuō: "bié hàipà, xiān fàngsōng shēntǐ."',
          'She told Wang Peng, "Don\'t be scared. First, relax your body."',
        ),
        s(
          '但是王朋一到水里就喝了好几口水。',
          'dànshì Wáng Péng yí dào shuǐ lǐ jiù hē le hǎo jǐ kǒu shuǐ.',
          'But the moment Wang Peng got into the water, he swallowed several mouthfuls.',
        ),
        s(
          '大家都笑了，王朋也笑了。',
          'dàjiā dōu xiào le, Wáng Péng yě xiào le.',
          'Everyone laughed, and so did Wang Peng.',
        ),
      ],
      [
        s(
          '一个月以后，王朋已经会游泳了，他很得意。',
          'yí gè yuè yǐhòu, Wáng Péng yǐjīng huì yóuyǒng le, tā hěn déyì.',
          'A month later Wang Peng could swim, and he was very pleased with himself.',
        ),
        s(
          '他发现游泳其实不太难，最重要的是坚持练习。',
          'tā fāxiàn yóuyǒng qíshí bú tài nán, zuì zhòngyào de shì jiānchí liànxí.',
          "He found that swimming isn't really that hard; the key is to keep practising.",
        ),
        s(
          '现在他每个周末都去游泳，还叫安娜跟他一起去。',
          'xiànzài tā měi gè zhōumò dōu qù yóuyǒng, hái jiào Ānnà gēn tā yìqǐ qù.',
          'Now he goes swimming every weekend, and he gets Anna to come along too.',
        ),
      ],
    ],
    questions: [
      {
        question: "What was Wang Peng's little problem?",
        options: ["He couldn't swim", 'He was afraid of dogs', 'He was often late'],
        answer: "He couldn't swim",
      },
      {
        question: 'How did he feel at his first lesson?',
        options: ['Very nervous', 'Bored', 'Angry'],
        answer: 'Very nervous',
      },
      {
        question: 'What happened when he got into the water?',
        options: ['He swallowed a lot of water', 'He swam fifty metres', 'He lost his glasses'],
        answer: 'He swallowed a lot of water',
      },
      {
        question: 'What did he find out?',
        options: [
          'Swimming is fine if you keep practising',
          'Swimming is too hard for him',
          'The teacher was strict',
        ],
        answer: 'Swimming is fine if you keep practising',
      },
    ],
  },
  {
    id: 'the-misunderstanding',
    title: s('误会', 'wùhuì', 'A misunderstanding'),
    hskLevel: 4,
    after: 'h4-u12-l6',
    extras: [WANG_PENG],
    paragraphs: [
      [
        s(
          '上个礼拜天是我的生日。',
          'shàng gè lǐbàitiān shì wǒ de shēngrì.',
          'Last Sunday was my birthday.',
        ),
        s(
          '早上我收到了很多短信，但是王朋一直没有联系我。',
          'zǎoshang wǒ shōu dào le hěn duō duǎnxìn, dànshì Wáng Péng yìzhí méiyǒu liánxì wǒ.',
          "I got lots of messages in the morning, but Wang Peng didn't get in touch.",
        ),
        s(
          '我给他打电话，他的手机一直占线。',
          'wǒ gěi tā dǎ diànhuà, tā de shǒujī yìzhí zhànxiàn.',
          'I called him, but his phone was engaged the whole time.',
        ),
        s(
          '我很失望，觉得他忘记了我的生日。',
          'wǒ hěn shīwàng, juéde tā wàngjì le wǒ de shēngrì.',
          'I was disappointed. I thought he had forgotten my birthday.',
        ),
      ],
      [
        s(
          '晚上七点，有人敲门。',
          'wǎnshang qī diǎn, yǒu rén qiāo mén.',
          'At seven that evening, someone knocked at the door.',
        ),
        s(
          '我开门一看，是王朋！',
          'wǒ kāi mén yí kàn, shì Wáng Péng!',
          'I opened the door, and it was Wang Peng!',
        ),
        s(
          '他后面还有很多朋友，大家都在笑。',
          'tā hòumiàn hái yǒu hěn duō péngyou, dàjiā dōu zài xiào.',
          'Behind him were lots of friends, all laughing.',
        ),
        s(
          '王朋解释说：“对不起，我们一直在准备你的生日聚会。”',
          'Wáng Péng jiěshì shuō: "duìbuqǐ, wǒmen yìzhí zài zhǔnbèi nǐ de shēngrì jùhuì."',
          'Wang Peng explained: "Sorry, we\'ve been getting your birthday party ready."',
        ),
        s(
          '“我的手机占线，是因为我在跟大家商量。”',
          '"wǒ de shǒujī zhànxiàn, shì yīnwèi wǒ zài gēn dàjiā shāngliang."',
          '"My phone was engaged because I was planning it with everyone."',
        ),
      ],
      [
        s(
          '我这才知道是我误会了。',
          'wǒ zhè cái zhīdào shì wǒ wùhuì le.',
          'Only then did I realise I had misunderstood.',
        ),
        s(
          '我向他道歉，他笑着说：“没关系！”',
          'wǒ xiàng tā dàoqiàn, tā xiào zhe shuō: "méi guānxi!"',
          'I apologised, and he laughed: "Don\'t worry about it!"',
        ),
        s(
          '那个晚上，我们玩得非常开心。',
          'nàge wǎnshang, wǒmen wán de fēicháng kāixīn.',
          'We had a brilliant time that evening.',
        ),
      ],
    ],
    questions: [
      {
        question: 'What day was it?',
        options: ["The writer's birthday", "Wang Peng's birthday", 'A public holiday'],
        answer: "The writer's birthday",
      },
      {
        question: "Why was Wang Peng's phone engaged?",
        options: ['He was planning a party with friends', 'He was at work', 'His phone was broken'],
        answer: 'He was planning a party with friends',
      },
      {
        question: 'How did the writer feel before the party?',
        options: ['Disappointed', 'Excited', 'Nervous'],
        answer: 'Disappointed',
      },
      {
        question: 'What did the writer do after finding out?',
        options: ['Apologised', 'Went to bed', 'Called Wang Peng back'],
        answer: 'Apologised',
      },
    ],
  },
  {
    id: 'rubbish-in-the-park',
    title: s('公园里的垃圾', 'gōngyuán lǐ de lājī', 'Rubbish in the park'),
    hskLevel: 4,
    after: 'h4-u14-l4',
    extras: [ANNA, s('垃圾', 'lājī', 'rubbish')],
    paragraphs: [
      [
        s(
          '安娜早上经常去公园跑步。',
          'Ānnà zǎoshang jīngcháng qù gōngyuán pǎobù.',
          'Anna often goes running in the park in the morning.',
        ),
        s(
          '最近她发现，公园里的垃圾越来越多了。',
          'zuìjìn tā fāxiàn, gōngyuán lǐ de lājī yuè lái yuè duō le.',
          'Lately she has noticed more and more rubbish in the park.',
        ),
        s(
          '塑料袋、瓶子，哪儿都有。',
          'sùliàodài, píngzi, nǎr dōu yǒu.',
          'Plastic bags and bottles were everywhere.',
        ),
      ],
      [
        s(
          '她很难过，就上网写了一条消息：',
          'tā hěn nánguò, jiù shàngwǎng xiě le yì tiáo xiāoxi:',
          'It upset her, so she went online and wrote a post:',
        ),
        s(
          '“这个星期六，谁愿意跟我一起打扫公园？”',
          '"zhège xīngqīliù, shéi yuànyì gēn wǒ yìqǐ dǎsǎo gōngyuán?"',
          '"Who\'ll help me clean up the park this Saturday?"',
        ),
        s('她以为没有人会来。', 'tā yǐwéi méiyǒu rén huì lái.', 'She thought nobody would come.'),
      ],
      [
        s(
          '没想到，星期六早上来了三十多个人！',
          'méi xiǎngdào, xīngqīliù zǎoshang lái le sānshí duō gè rén!',
          'To her surprise, over thirty people turned up on Saturday morning!',
        ),
        s(
          '有学生，有老人，还有带着孩子的爸爸妈妈。',
          'yǒu xuésheng, yǒu lǎorén, hái yǒu dài zhe háizi de bàba māma.',
          'There were students, old people, and parents with their children.',
        ),
        s(
          '大家打扫了三个小时，把公园打扫得非常干净。',
          'dàjiā dǎsǎo le sān gè xiǎoshí, bǎ gōngyuán dǎsǎo de fēicháng gānjìng.',
          'They cleaned for three hours and left the park spotless.',
        ),
        s(
          '一位老人说：“保护环境是每个人的责任。”',
          'yí wèi lǎorén shuō: "bǎohù huánjìng shì měi gè rén de zérèn."',
          'One old man said, "Looking after the environment is everyone\'s responsibility."',
        ),
      ],
      [
        s(
          '现在，大家每个月都会一起打扫一次公园。',
          'xiànzài, dàjiā měi gè yuè dōu huì yìqǐ dǎsǎo yí cì gōngyuán.',
          'Now they all clean the park together once a month.',
        ),
      ],
    ],
    questions: [
      {
        question: 'What did Anna notice in the park?',
        options: ['More and more rubbish', 'Fewer runners', 'New trees'],
        answer: 'More and more rubbish',
      },
      {
        question: 'What did she do about it?',
        options: [
          'Asked people online to help clean up',
          'Complained to the police',
          'Stopped running there',
        ],
        answer: 'Asked people online to help clean up',
      },
      {
        question: 'How many people came?',
        options: ['Over thirty', 'Three', 'Nobody'],
        answer: 'Over thirty',
      },
      {
        question: 'What happens now?',
        options: [
          'They clean the park together every month',
          'The park is closed',
          'Anna cleans it alone',
        ],
        answer: 'They clean the park together every month',
      },
    ],
  },
  {
    id: 'the-lost-bag',
    title: s('包丢了', 'bāo diū le', 'The lost bag'),
    hskLevel: 4,
    after: 'h4-u17-l7',
    extras: [WANG_PENG],
    paragraphs: [
      [
        s(
          '上个星期五，王朋坐出租车去机场。',
          'shàng gè xīngqīwǔ, Wáng Péng zuò chūzūchē qù jīchǎng.',
          'Last Friday, Wang Peng took a taxi to the airport.',
        ),
        s(
          '到了机场，他突然发现自己的包丢了。',
          'dào le jīchǎng, tā tūrán fāxiàn zìjǐ de bāo diū le.',
          'When he got there, he suddenly realised he had lost his bag.',
        ),
        s(
          '包里有他的护照、信用卡和一千多块钱。',
          'bāo lǐ yǒu tā de hùzhào, xìnyòngkǎ hé yìqiān duō kuài qián.',
          'It had his passport, his credit card and over a thousand yuan in it.',
        ),
        s(
          '他着急极了，不知道应该怎么做。',
          'tā zháojí jí le, bù zhīdào yīnggāi zěnme zuò.',
          "He was frantic and didn't know what to do.",
        ),
      ],
      [
        s(
          '他马上给出租车公司打电话，但是一直占线。',
          'tā mǎshàng gěi chūzūchē gōngsī dǎ diànhuà, dànshì yìzhí zhànxiàn.',
          'He rang the taxi company straight away, but the line was always busy.',
        ),
        s(
          '飞机还有一个小时就要起飞了。',
          'fēijī hái yǒu yí gè xiǎoshí jiù yào qǐfēi le.',
          'His plane was leaving in an hour.',
        ),
        s(
          '正在他准备放弃的时候，手机响了。',
          'zhèng zài tā zhǔnbèi fàngqì de shíhou, shǒujī xiǎng le.',
          'Just as he was about to give up, his phone rang.',
        ),
      ],
      [
        s('是那个出租车司机！', 'shì nàge chūzūchē sījī!', 'It was the taxi driver!'),
        s(
          '“你的包在我的出租车里，我现在就给你送过来。”',
          '"nǐ de bāo zài wǒ de chūzūchē lǐ, wǒ xiànzài jiù gěi nǐ sòng guòlái."',
          '"Your bag\'s in my taxi. I\'ll bring it over right now."',
        ),
        s(
          '半个小时以后，司机把包送到了机场。',
          'bàn gè xiǎoshí yǐhòu, sījī bǎ bāo sòng dào le jīchǎng.',
          'Half an hour later, the driver brought the bag to the airport.',
        ),
        s(
          '王朋想给他一些钱表示感谢，但是司机说什么也不要。',
          'Wáng Péng xiǎng gěi tā yìxiē qián biǎoshì gǎnxiè, dànshì sījī shuō shénme yě bú yào.',
          'Wang Peng wanted to give him some money to say thank you, but the driver flatly refused.',
        ),
        s(
          '他笑着说：“这是我应该做的。”',
          'tā xiào zhe shuō: "zhè shì wǒ yīnggāi zuò de."',
          'He smiled and said, "I was only doing what anyone should."',
        ),
      ],
    ],
    questions: [
      {
        question: 'Where was Wang Peng going?',
        options: ['To the airport', 'To the station', 'Home'],
        answer: 'To the airport',
      },
      {
        question: 'What was in the bag?',
        options: ['His passport, credit card and cash', 'His laptop', 'Only clothes'],
        answer: 'His passport, credit card and cash',
      },
      {
        question: 'Who phoned him?',
        options: ['The taxi driver', 'The police', 'The airline'],
        answer: 'The taxi driver',
      },
      {
        question: 'What did the driver do when offered money?',
        options: ["He wouldn't take it", 'He asked for more', 'He took it'],
        answer: "He wouldn't take it",
      },
    ],
  },
  {
    id: 'my-dream',
    title: s('我的理想', 'wǒ de lǐxiǎng', 'My dream'),
    hskLevel: 4,
    after: 'h4-u18-l4',
    extras: [],
    paragraphs: [
      [
        s(
          '我小的时候，理想是当一个演员。',
          'wǒ xiǎo de shíhou, lǐxiǎng shì dāng yí gè yǎnyuán.',
          'When I was little, my dream was to be an actor.',
        ),
        s(
          '我不仅喜欢表演，也喜欢唱歌跳舞。',
          'wǒ bùjǐn xǐhuan biǎoyǎn, yě xǐhuan chàng gē tiàowǔ.',
          'I loved acting, and singing and dancing too.',
        ),
        s(
          '可是我很害羞，一到台上就紧张。',
          'kěshì wǒ hěn hàixiū, yí dào tái shàng jiù jǐnzhāng.',
          'But I was shy, and got nervous as soon as I was on stage.',
        ),
      ],
      [
        s(
          '十八岁的时候，我开始学习汉语。',
          'shíbā suì de shíhou, wǒ kāishǐ xuéxí Hànyǔ.',
          'At eighteen, I started learning Chinese.',
        ),
        s(
          '刚开始的时候，汉语对我来说非常难。',
          'gāng kāishǐ de shíhou, Hànyǔ duì wǒ lái shuō fēicháng nán.',
          'At first, Chinese was really hard for me.',
        ),
        s(
          '但是我一直坚持，从来没有放弃。',
          'dànshì wǒ yìzhí jiānchí, cónglái méiyǒu fàngqì.',
          'But I kept at it and never gave up.',
        ),
        s(
          '我经常看中国电影，积累了很多词语。',
          'wǒ jīngcháng kàn Zhōngguó diànyǐng, jīlěi le hěn duō cíyǔ.',
          'I often watched Chinese films and built up lots of vocabulary.',
        ),
      ],
      [
        s(
          '现在我的普通话说得挺流利的。',
          'xiànzài wǒ de pǔtōnghuà shuō de tǐng liúlì de.',
          'Now my Mandarin is pretty fluent.',
        ),
        s(
          '我的新理想是成为一个翻译。',
          'wǒ de xīn lǐxiǎng shì chéngwéi yí gè fānyì.',
          'My new dream is to become a translator.',
        ),
        s(
          '我觉得语言可以帮助各个国家的人互相理解。',
          'wǒ juéde yǔyán kěyǐ bāngzhù gè gè guójiā de rén hùxiāng lǐjiě.',
          'I think language can help people from every country understand each other.',
        ),
        s(
          '这个理想值得我努力。',
          'zhège lǐxiǎng zhíde wǒ nǔlì.',
          'This dream is worth working for.',
        ),
      ],
    ],
    questions: [
      {
        question: 'What did the writer want to be as a child?',
        options: ['An actor', 'A doctor', 'A teacher'],
        answer: 'An actor',
      },
      {
        question: 'What held the writer back?',
        options: ['Being shy and nervous on stage', 'Not being able to sing', 'Having no time'],
        answer: 'Being shy and nervous on stage',
      },
      {
        question: 'How did the writer build up vocabulary?',
        options: ['By watching Chinese films', 'By reading novels', 'By working in China'],
        answer: 'By watching Chinese films',
      },
      {
        question: "What is the writer's new dream?",
        options: ['To become a translator', 'To become a tour guide', 'To become an actor again'],
        answer: 'To become a translator',
      },
    ],
  },

  {
    id: 'home-for-new-year',
    title: s('回家过年', 'huí jiā guò nián', 'Home for Spring Festival'),
    hskLevel: 4,
    after: 'h4-u20-l6',
    extras: [WANG_PENG],
    paragraphs: [
      [
        s(
          '春节快到了，王朋打算回家过年。',
          'Chūnjié kuài dào le, Wáng Péng dǎsuàn huí jiā guò nián.',
          'Spring Festival was coming, and Wang Peng planned to go home for New Year.',
        ),
        s(
          '春节以前，回家的票特别难买。',
          'Chūnjié yǐqián, huí jiā de piào tèbié nán mǎi.',
          'Before the festival, tickets home are really hard to get.',
        ),
        s(
          '他试了好几次，终于买到了一张。',
          'tā shì le hǎo jǐ cì, zhōngyú mǎi dào le yì zhāng.',
          'He tried several times and finally managed to buy one.',
        ),
      ],
      [
        s(
          '路上人非常多，很多人只能站着。',
          'lù shang rén fēicháng duō, hěn duō rén zhǐ néng zhàn zhe.',
          'The journey was packed, and lots of people had to stand.',
        ),
        s(
          '王朋坐了十二个小时，才到家。',
          "Wáng Péng zuò le shí'èr gè xiǎoshí, cái dào jiā.",
          'It took Wang Peng twelve hours to get home.',
        ),
        s(
          '虽然很累，但是看到爸爸妈妈的时候，他觉得一切都值得。',
          'suīrán hěn lèi, dànshì kàn dào bàba māma de shíhou, tā juéde yíqiè dōu zhíde.',
          'He was exhausted, but when he saw his mum and dad, it all felt worth it.',
        ),
      ],
      [
        s(
          '晚上，一家人一起包饺子、看电视。',
          'wǎnshang, yì jiā rén yìqǐ bāo jiǎozi, kàn diànshì.',
          'That evening, the whole family made dumplings and watched TV together.',
        ),
        s(
          '奶奶问他：“在北京工作辛苦吗？有女朋友了吗？”',
          'nǎinai wèn tā: "zài Běijīng gōngzuò xīnkǔ ma? yǒu nǚ péngyou le ma?"',
          'His grandma asked, "Is work in Beijing hard? Have you got a girlfriend yet?"',
        ),
        s('大家都笑了。', 'dàjiā dōu xiào le.', 'Everyone laughed.'),
        s(
          '十二点的时候，大家互相说“新年快乐”。',
          'shí\'èr diǎn de shíhou, dàjiā hùxiāng shuō "xīnnián kuàilè".',
          'At midnight, everyone wished each other a happy New Year.',
        ),
        s(
          '王朋想：“有家真好。”',
          'Wáng Péng xiǎng: "yǒu jiā zhēn hǎo."',
          'Wang Peng thought, "It\'s good to have a home to come back to."',
        ),
      ],
    ],
    questions: [
      {
        question: 'What was hard before Spring Festival?',
        options: ['Getting a ticket home', 'Finding a hotel', 'Buying presents'],
        answer: 'Getting a ticket home',
      },
      {
        question: 'How long did the journey take?',
        options: ['Twelve hours', 'Two hours', 'Two days'],
        answer: 'Twelve hours',
      },
      {
        question: 'What did the family do that evening?',
        options: ['Made dumplings and watched TV', 'Went to a restaurant', 'Went to bed early'],
        answer: 'Made dumplings and watched TV',
      },
      {
        question: 'What did his grandma ask about?',
        options: [
          'His work and whether he had a girlfriend',
          'How much he earned',
          'When he would leave',
        ],
        answer: 'His work and whether he had a girlfriend',
      },
    ],
  },
  // ——— HSK 5 ———
  {
    id: 'the-old-lady-downstairs',
    title: s('楼下的老奶奶', 'lóu xià de lǎo nǎinai', 'The old lady downstairs'),
    hskLevel: 5,
    after: 'h5-u5-l7',
    extras: [],
    paragraphs: [
      [
        s(
          '我住的公寓楼里有一位老奶奶，已经八十岁了。',
          'wǒ zhù de gōngyù lóu lǐ yǒu yí wèi lǎo nǎinai, yǐjīng bāshí suì le.',
          "There's an old lady in my block of flats who is eighty.",
        ),
        s(
          '她一个人住，儿子和女儿都在别的城市工作。',
          "tā yí gè rén zhù, érzi hé nǚ'ér dōu zài bié de chéngshì gōngzuò.",
          'She lives alone; her son and daughter both work in other cities.',
        ),
        s(
          '每次在楼下遇到她，她都会笑着跟我打招呼。',
          'měi cì zài lóu xià yùdào tā, tā dōu huì xiào zhe gēn wǒ dǎ zhāohu.',
          'Whenever I bump into her downstairs, she greets me with a smile.',
        ),
      ],
      [
        s(
          '有一个星期，我一直没有看见她，有点担心。',
          'yǒu yí gè xīngqī, wǒ yìzhí méiyǒu kànjiàn tā, yǒudiǎn dānxīn.',
          "One week I didn't see her at all, and I got a bit worried.",
        ),
        s(
          '我去敲她的门，过了很久她才开门。',
          'wǒ qù qiāo tā de mén, guò le hěn jiǔ tā cái kāi mén.',
          'I knocked on her door, and it was a long time before she opened it.',
        ),
        s(
          '原来她感冒了，一个人在家里躺了好久。',
          'yuánlái tā gǎnmào le, yí gè rén zài jiā lǐ tǎng le hǎo jiǔ.',
          'It turned out she had a cold and had been lying at home on her own for ages.',
        ),
      ],
      [
        s(
          '从那以后，我每个晚上都去看看她，给她买菜、做菜。',
          'cóng nà yǐhòu, wǒ měi gè wǎnshang dōu qù kànkan tā, gěi tā mǎi cài, zuò cài.',
          'After that I went to see her every evening, and did her shopping and cooking.',
        ),
        s(
          '她说她有时候很寂寞，很想念自己的孩子。',
          'tā shuō tā yǒu shíhou hěn jìmò, hěn xiǎngniàn zìjǐ de háizi.',
          'She told me she was sometimes lonely and missed her children.',
        ),
        s(
          '她还给我讲了很多她年轻时候的故事。',
          'tā hái gěi wǒ jiǎng le hěn duō tā niánqīng shíhou de gùshi.',
          'She also told me lots of stories from when she was young.',
        ),
        s(
          '她的身体慢慢好了，我们也成为了好朋友。',
          'tā de shēntǐ mànman hǎo le, wǒmen yě chéngwéi le hǎo péngyou.',
          'She slowly got better, and we became good friends.',
        ),
        s(
          '她总是说：“有时候，邻居比家人还重要。”',
          'tā zǒngshì shuō: "yǒu shíhou, línjū bǐ jiārén hái zhòngyào."',
          'She always says, "Sometimes a neighbour matters even more than family."',
        ),
        s(
          '我现在终于明白这个意思了。',
          'wǒ xiànzài zhōngyú míngbai zhège yìsi le.',
          'Now I finally understand what that means.',
        ),
      ],
    ],
    questions: [
      {
        question: 'Who does the old lady live with?',
        options: ['Nobody — she lives alone', 'Her son', 'Her daughter'],
        answer: 'Nobody — she lives alone',
      },
      {
        question: "Why hadn't the writer seen her for a week?",
        options: ['She had a cold', 'She was travelling', 'She had moved away'],
        answer: 'She had a cold',
      },
      {
        question: 'What does the writer do now?',
        options: ['Visits her every evening', 'Phones her children', 'Takes her to hospital'],
        answer: 'Visits her every evening',
      },
      {
        question: 'What does she always say?',
        options: [
          'Sometimes a neighbour matters more than family',
          'Family always comes first',
          'Old people should live with their children',
        ],
        answer: 'Sometimes a neighbour matters more than family',
      },
    ],
  },
  {
    id: 'grandmas-new-phone',
    title: s('奶奶的新手机', 'nǎinai de xīn shǒujī', "Grandma's new phone"),
    hskLevel: 5,
    after: 'h5-u10-l5',
    extras: [],
    paragraphs: [
      [
        s(
          '奶奶七十岁生日的时候，我送了她一个新手机。',
          'nǎinai qīshí suì shēngrì de shíhou, wǒ sòng le tā yí gè xīn shǒujī.',
          "For Grandma's seventieth birthday, I gave her a new phone.",
        ),
        s(
          '她以前从来没用过这种手机。',
          'tā yǐqián cónglái méi yòng guo zhè zhǒng shǒujī.',
          'She had never used a phone like this before.',
        ),
        s(
          '“太复杂了，我肯定不会用。”她说。',
          '"tài fùzá le, wǒ kěndìng bú huì yòng." tā shuō.',
          '"It\'s far too complicated. I\'ll never manage it," she said.',
        ),
      ],
      [
        s(
          '我很有耐心地教她怎么打电话、怎么发短信。',
          'wǒ hěn yǒu nàixīn de jiāo tā zěnme dǎ diànhuà, zěnme fā duǎnxìn.',
          'I patiently showed her how to make calls and send messages.',
        ),
        s(
          '然后又教她怎么上网看新闻。',
          'ránhòu yòu jiāo tā zěnme shàngwǎng kàn xīnwén.',
          'Then I showed her how to read the news online.',
        ),
        s(
          '开始的时候她总是忘记，一个问题要问好几次。',
          'kāishǐ de shíhou tā zǒngshì wàngjì, yí gè wèntí yào wèn hǎo jǐ cì.',
          'At first she kept forgetting, and asked the same question several times.',
        ),
        s(
          '但是她不着急，每个晚上都认真练习。',
          'dànshì tā bù zháojí, měi gè wǎnshang dōu rènzhēn liànxí.',
          'But she took her time and practised carefully every evening.',
        ),
      ],
      [
        s(
          '一个月以后，奶奶已经能自己上网买东西了。',
          'yí gè yuè yǐhòu, nǎinai yǐjīng néng zìjǐ shàngwǎng mǎi dōngxi le.',
          'A month later, Grandma could shop online by herself.',
        ),
        s(
          '她发现这个手机有很多有用的功能。',
          'tā fāxiàn zhège shǒujī yǒu hěn duō yǒu yòng de gōngnéng.',
          'She discovered the phone had lots of useful features.',
        ),
        s(
          '她还会拍照了，经常给我发花园里的照片。',
          'tā hái huì pāizhào le, jīngcháng gěi wǒ fā huāyuán lǐ de zhàopiàn.',
          'She can take pictures now too, and often sends me photos from her garden.',
        ),
        s(
          '她得意地说：“你看，老人也能跟上时代！”',
          'tā déyì de shuō: "nǐ kàn, lǎorén yě néng gēn shàng shídài!"',
          'She says proudly, "See? Old people can keep up with the times too!"',
        ),
      ],
    ],
    questions: [
      {
        question: 'What did the writer give Grandma?',
        options: ['A new phone', 'A computer', 'A camera'],
        answer: 'A new phone',
      },
      {
        question: 'What did Grandma think at first?',
        options: ['It was too complicated', 'It was too expensive', 'It was too small'],
        answer: 'It was too complicated',
      },
      {
        question: 'What could she do by herself a month later?',
        options: ['Shop online', 'Drive a car', 'Fix the phone'],
        answer: 'Shop online',
      },
      {
        question: 'What does she often send the writer?',
        options: ['Photos from her garden', 'Recipes', 'News articles'],
        answer: 'Photos from her garden',
      },
    ],
  },
  {
    id: 'uncles-restaurant',
    title: s('叔叔的饭馆', 'shūshu de fànguǎn', "Uncle's restaurant"),
    hskLevel: 5,
    after: 'h5-u14-l7',
    extras: [WANG_PENG],
    paragraphs: [
      [
        s(
          '王朋的叔叔以前在一家公司工作，去年他辞职了。',
          'Wáng Péng de shūshu yǐqián zài yì jiā gōngsī gōngzuò, qùnián tā cízhí le.',
          "Wang Peng's uncle used to work for a company, but last year he quit.",
        ),
        s(
          '他一直有一个愿望：开一家自己的饭馆。',
          'tā yìzhí yǒu yí gè yuànwàng: kāi yì jiā zìjǐ de fànguǎn.',
          'He had always had one dream: to open his own restaurant.',
        ),
        s(
          '他在学校附近开了一家小饭馆，专门卖面条。',
          'tā zài xuéxiào fùjìn kāi le yì jiā xiǎo fànguǎn, zhuānmén mài miàntiáo.',
          'He opened a little place near the university that only sold noodles.',
        ),
      ],
      [
        s(
          '刚开始的时候，饭馆的生意很糟糕。',
          'gāng kāishǐ de shíhou, fànguǎn de shēngyi hěn zāogāo.',
          'At first, business was terrible.',
        ),
        s(
          '每个中午只有十几个客人。',
          'měi gè zhōngwǔ zhǐ yǒu shí jǐ gè kèrén.',
          'There were only a dozen or so customers each lunchtime.',
        ),
        s(
          '叔叔很着急，甚至开始怀疑自己的决定。',
          'shūshu hěn zháojí, shènzhì kāishǐ huáiyí zìjǐ de juédìng.',
          'His uncle was worried, and even began to doubt his decision.',
        ),
      ],
      [
        s(
          '王朋和叔叔一起分析原因。',
          'Wáng Péng hé shūshu yìqǐ fēnxī yuányīn.',
          'Wang Peng and his uncle worked out together what was wrong.',
        ),
        s(
          '两个人发现，附近的学生喜欢便宜又好吃的东西，而且没有太多时间。',
          'liǎng gè rén fāxiàn, fùjìn de xuésheng xǐhuan piányi yòu hǎochī de dōngxi, érqiě méiyǒu tài duō shíjiān.',
          "They realised the students nearby wanted food that was cheap and tasty, and they didn't have much time.",
        ),
        s(
          '于是叔叔降低了价格，还保证面条五分钟就能做好。',
          'yúshì shūshu jiàngdī le jiàgé, hái bǎozhèng miàntiáo wǔ fēnzhōng jiù néng zuò hǎo.',
          'So his uncle lowered his prices and promised the noodles would be ready in five minutes.',
        ),
        s(
          '王朋还在学校的网站上给他做了广告。',
          'Wáng Péng hái zài xuéxiào de wǎngzhàn shang gěi tā zuò le guǎnggào.',
          "Wang Peng also advertised it on the university's website.",
        ),
      ],
      [
        s(
          '一个月以后，饭馆里的学生越来越多。',
          'yí gè yuè yǐhòu, fànguǎn lǐ de xuésheng yuè lái yuè duō.',
          'A month later, more and more students were coming in.',
        ),
        s(
          '现在每个中午，门口都要排队。',
          'xiànzài měi gè zhōngwǔ, ménkǒu dōu yào páiduì.',
          'Now there is a queue at the door every lunchtime.',
        ),
        s(
          '叔叔感激地说：“没有你，就没有这家饭馆的今天。”',
          'shūshu gǎnjī de shuō: "méiyǒu nǐ, jiù méiyǒu zhè jiā fànguǎn de jīntiān."',
          'His uncle said gratefully, "Without you, this restaurant wouldn\'t be where it is today."',
        ),
      ],
    ],
    questions: [
      {
        question: 'What did the uncle do after quitting his job?',
        options: ['Opened a noodle restaurant', 'Went travelling', 'Went back to university'],
        answer: 'Opened a noodle restaurant',
      },
      {
        question: 'How was business at first?',
        options: ['Terrible', 'Very busy', 'About what he expected'],
        answer: 'Terrible',
      },
      {
        question: 'What did they change?',
        options: ['Lower prices and faster food', 'A bigger menu', 'Longer opening hours'],
        answer: 'Lower prices and faster food',
      },
      {
        question: 'How is the restaurant doing now?',
        options: ['There is a queue every lunchtime', 'It has closed', 'It is still quiet'],
        answer: 'There is a queue every lunchtime',
      },
    ],
  },
  {
    id: 'job-hunting',
    title: s('找工作', 'zhǎo gōngzuò', 'Job hunting'),
    hskLevel: 5,
    after: 'h5-u18-l4',
    extras: [],
    paragraphs: [
      [
        s(
          '去年我毕业了，开始寻找工作。',
          'qùnián wǒ bìyè le, kāishǐ xúnzhǎo gōngzuò.',
          'I graduated last year and started looking for work.',
        ),
        s(
          '刚开始的时候，我对未来充满了希望。',
          'gāng kāishǐ de shíhou, wǒ duì wèilái chōngmǎn le xīwàng.',
          'At first I was full of hope for the future.',
        ),
        s(
          '可是找工作比我想象的难多了。',
          'kěshì zhǎo gōngzuò bǐ wǒ xiǎngxiàng de nán duō le.',
          'But finding a job was much harder than I had imagined.',
        ),
        s(
          '我应聘了十几家公司，都没有成功。',
          'wǒ yìngpìn le shí jǐ jiā gōngsī, dōu méiyǒu chénggōng.',
          'I applied to a dozen companies without success.',
        ),
      ],
      [
        s(
          '我开始怀疑自己的能力，情绪也很不好。',
          'wǒ kāishǐ huáiyí zìjǐ de nénglì, qíngxù yě hěn bù hǎo.',
          'I started to doubt my own ability, and my mood was low.',
        ),
        s(
          '我的老师知道以后，亲自给我打电话。',
          'wǒ de lǎoshī zhīdào yǐhòu, qīnzì gěi wǒ dǎ diànhuà.',
          'When my teacher found out, she phoned me herself.',
        ),
        s(
          '她说：“失败是正常的，关键是要总结经验。”',
          'tā shuō: "shībài shì zhèngcháng de, guānjiàn shì yào zǒngjié jīngyàn."',
          'She said, "Failing is normal. What matters is learning from it."',
        ),
        s(
          '她还给我推荐了一家公司。',
          'tā hái gěi wǒ tuījiàn le yì jiā gōngsī.',
          'She also recommended a company to me.',
        ),
      ],
      [
        s(
          '这家公司的老板很年轻，也很有魅力。',
          'zhè jiā gōngsī de lǎobǎn hěn niánqīng, yě hěn yǒu mèilì.',
          "The company's boss was young and very charismatic.",
        ),
        s(
          '他问了我很多具体的问题，我都认真地回答了。',
          'tā wèn le wǒ hěn duō jùtǐ de wèntí, wǒ dōu rènzhēn de huídá le.',
          'He asked me lots of detailed questions, and I answered them all carefully.',
        ),
        s(
          '一个星期以后，公司通知我去上班。',
          'yí gè xīngqī yǐhòu, gōngsī tōngzhī wǒ qù shàngbān.',
          'A week later, the company told me to start work.',
        ),
        s(
          '我终于实现了自己的目标。',
          'wǒ zhōngyú shíxiàn le zìjǐ de mùbiāo.',
          'I had finally reached my goal.',
        ),
      ],
    ],
    questions: [
      {
        question: 'What did the writer do after graduating?',
        options: ['Looked for a job', 'Went travelling', 'Went back to study'],
        answer: 'Looked for a job',
      },
      {
        question: 'How did the first applications go?',
        options: ['None of them worked out', 'Two of them worked out', 'There were several offers'],
        answer: 'None of them worked out',
      },
      {
        question: "What did the writer's teacher do?",
        options: ['Phoned and recommended a company', 'Wrote the CV for them', 'Lent them money'],
        answer: 'Phoned and recommended a company',
      },
      {
        question: 'How did it end?',
        options: ['The company offered a job', 'They started their own business', 'They gave up'],
        answer: 'The company offered a job',
      },
    ],
  },
  {
    id: 'huangshan',
    title: s('去黄山', 'qù Huángshān', 'A trip to Huangshan'),
    hskLevel: 5,
    after: 'h5-u24-l5',
    extras: [ANNA, WANG_PENG, s('黄山', 'Huángshān', 'Huangshan, the Yellow Mountains')],
    paragraphs: [
      [
        s(
          '十月的一个周末，安娜和王朋去了黄山。',
          'shí yuè de yí gè zhōumò, Ānnà hé Wáng Péng qù le Huángshān.',
          'One weekend in October, Anna and Wang Peng went to Huangshan.',
        ),
        s(
          '黄山是中国非常有名的名胜。',
          'Huángshān shì Zhōngguó fēicháng yǒumíng de míngshèng.',
          "Huangshan is one of China's most famous sights.",
        ),
        s(
          '两个人打算在黄山上住一个晚上，早上五点起床看日出。',
          'liǎng gè rén dǎsuàn zài Huángshān shang zhù yí gè wǎnshang, zǎoshang wǔ diǎn qǐchuáng kàn rì chū.',
          'They planned to spend a night on the mountain and get up at five to watch the sunrise.',
        ),
      ],
      [
        s(
          '爬山比想象的累多了。',
          'páshān bǐ xiǎngxiàng de lèi duō le.',
          'The climb was much harder than they had imagined.',
        ),
        s(
          '台阶一个接一个，好像永远也走不完。',
          'táijiē yí gè jiē yí gè, hǎoxiàng yǒngyuǎn yě zǒu bù wán.',
          'The steps went on and on, as if they would never end.',
        ),
        s(
          '安娜的腿疼极了，好几次想放弃。',
          'Ānnà de tuǐ téng jí le, hǎo jǐ cì xiǎng fàngqì.',
          "Anna's legs hurt terribly, and several times she wanted to give up.",
        ),
        s(
          '王朋一直鼓励她：“坚持一下，前面的景色一定非常美丽。”',
          'Wáng Péng yìzhí gǔlì tā: "jiānchí yíxià, qiánmiàn de jǐngsè yídìng fēicháng měilì."',
          'Wang Peng kept encouraging her: "Keep going — the view ahead is sure to be beautiful."',
        ),
      ],
      [
        s(
          '下午四点，两个人终于到了。',
          'xiàwǔ sì diǎn, liǎng gè rén zhōngyú dào le.',
          'At four in the afternoon, they finally made it.',
        ),
        s(
          '早上五点，很多人已经在等日出了。',
          'zǎoshang wǔ diǎn, hěn duō rén yǐjīng zài děng rì chū le.',
          'At five the next morning, lots of people were already waiting for the sunrise.',
        ),
        s(
          '可是雾太大了，什么也看不清楚。',
          'kěshì wù tài dà le, shénme yě kàn bù qīngchu.',
          'But the fog was so thick they could hardly see a thing.',
        ),
        s('安娜非常失望。', 'Ānnà fēicháng shīwàng.', 'Anna was really disappointed.'),
      ],
      [
        s(
          '就在两个人准备离开的时候，雾忽然没有了。',
          'jiù zài liǎng gè rén zhǔnbèi líkāi de shíhou, wù hūrán méiyǒu le.',
          'Just as they were about to leave, the fog suddenly cleared.',
        ),
        s(
          '太阳从云里出来，景色雄伟极了。',
          'tàiyáng cóng yún lǐ chūlái, jǐngsè xióngwěi jí le.',
          'The sun came out from the clouds, and the view was magnificent.',
        ),
        s(
          '安娜拿出照相机，拍了很多照片。',
          'Ānnà ná chū zhàoxiàngjī, pāi le hěn duō zhàopiàn.',
          'Anna took out her camera and took lots of photos.',
        ),
        s(
          '她说：“这是我看过的最美丽的景色，一切都值得！”',
          'tā shuō: "zhè shì wǒ kàn guo de zuì měilì de jǐngsè, yíqiè dōu zhíde!"',
          'She said, "That\'s the most beautiful view I\'ve ever seen. It was all worth it!"',
        ),
      ],
    ],
    questions: [
      {
        question: 'What did they plan to see?',
        options: ['The sunrise', 'A temple', 'The sunset'],
        answer: 'The sunrise',
      },
      {
        question: 'How did Anna find the climb?',
        options: ['Her legs hurt and she wanted to give up', 'Easy', 'She took a cable car'],
        answer: 'Her legs hurt and she wanted to give up',
      },
      {
        question: 'What happened at five in the morning?',
        options: ['It was too foggy to see', 'They overslept', 'It rained'],
        answer: 'It was too foggy to see',
      },
      {
        question: 'What happened as they were about to leave?',
        options: [
          'The fog cleared and the view was magnificent',
          'It started to snow',
          'They got lost',
        ],
        answer: 'The fog cleared and the view was magnificent',
      },
    ],
  },
  {
    id: 'a-new-city',
    title: s('新的城市', 'xīn de chéngshì', 'A new city'),
    hskLevel: 5,
    after: 'h5-u27-l5',
    extras: [],
    paragraphs: [
      [
        s(
          '为了工作，我搬到了一个新的城市。',
          'wèile gōngzuò, wǒ bān dào le yí gè xīn de chéngshì.',
          'I moved to a new city for work.',
        ),
        s(
          '我通过中介在公司附近租了一个公寓。',
          'wǒ tōngguò zhōngjiè zài gōngsī fùjìn zū le yí gè gōngyù.',
          'I rented a flat near the office through an agent.',
        ),
        s(
          '公寓不大，但是有一个阳台，还有一个小卧室。',
          'gōngyù bú dà, dànshì yǒu yí gè yángtái, hái yǒu yí gè xiǎo wòshì.',
          "The flat isn't big, but it has a balcony and a small bedroom.",
        ),
        s(
          '刚搬来的时候，我一个人都不认识，经常觉得很寂寞。',
          'gāng bān lái de shíhou, wǒ yí gè rén dōu bú rènshi, jīngcháng juéde hěn jìmò.',
          "When I first moved, I didn't know a soul and often felt lonely.",
        ),
      ],
      [
        s(
          '一个周末，隔壁的邻居敲我的门。',
          'yí gè zhōumò, gébì de línjū qiāo wǒ de mén.',
          'One weekend, the neighbour next door knocked on my door.',
        ),
        s(
          '她是一个热情的阿姨，送给我一些饺子。',
          'tā shì yí gè rèqíng de āyí, sòng gěi wǒ yìxiē jiǎozi.',
          'She was a warm-hearted older woman, and she brought me some dumplings.',
        ),
        s(
          '后来，我们经常一起包饺子。',
          'hòulái, wǒmen jīngcháng yìqǐ bāo jiǎozi.',
          'After that, we often made dumplings together.',
        ),
        s(
          '她还教我做中国菜。',
          'tā hái jiāo wǒ zuò Zhōngguó cài.',
          'She also taught me to cook Chinese food.',
        ),
      ],
      [
        s(
          '周末我们一起去市场买蔬菜和海鲜。',
          'zhōumò wǒmen yìqǐ qù shìchǎng mǎi shūcài hé hǎixiān.',
          'At weekends we go to the market together for vegetables and seafood.',
        ),
        s(
          '现在，我已经习惯了这里的生活。',
          'xiànzài, wǒ yǐjīng xíguàn le zhèlǐ de shēnghuó.',
          "Now I'm used to life here.",
        ),
        s(
          '我觉得，有一个好邻居真是幸运。',
          'wǒ juéde, yǒu yí gè hǎo línjū zhēn shì xìngyùn.',
          "I think I'm really lucky to have a good neighbour.",
        ),
      ],
    ],
    questions: [
      {
        question: 'Why did the writer move?',
        options: ['For work', 'To study', 'To be near family'],
        answer: 'For work',
      },
      {
        question: 'How did the writer find the flat?',
        options: ['Through an agent', 'Through a friend', 'Online, on their own'],
        answer: 'Through an agent',
      },
      {
        question: 'Who knocked on the door?',
        options: ['The neighbour next door', 'The landlord', 'A delivery driver'],
        answer: 'The neighbour next door',
      },
      {
        question: 'What do they do together now?',
        options: ['Make dumplings and go food shopping', 'Play chess', 'Go running'],
        answer: 'Make dumplings and go food shopping',
      },
    ],
  },
  {
    id: 'grandpas-story',
    title: s('爷爷的故事', 'yéye de gùshi', "Grandpa's story"),
    hskLevel: 5,
    after: 'h5-u35-l9',
    extras: [],
    paragraphs: [
      [
        s(
          '我爷爷已经八十岁了，但是身体很健康。',
          'wǒ yéye yǐjīng bāshí suì le, dànshì shēntǐ hěn jiànkāng.',
          'My grandpa is eighty, but he is in good health.',
        ),
        s(
          '他平常早上六点起床，在公园里散步。',
          'tā píngcháng zǎoshang liù diǎn qǐchuáng, zài gōngyuán lǐ sànbù.',
          'He usually gets up at six and goes for a walk in the park.',
        ),
        s(
          '从前，爷爷是一个农民。',
          'cóngqián, yéye shì yí gè nóngmín.',
          'Grandpa used to be a farmer.',
        ),
        s(
          '那个时候，生活很困难，粮食也不够。',
          'nàge shíhou, shēnghuó hěn kùnnan, liángshi yě bú gòu.',
          "In those days life was hard, and there wasn't enough food.",
        ),
      ],
      [
        s(
          '但是爷爷很乐观，也很勤劳。',
          'dànshì yéye hěn lèguān, yě hěn qínláo.',
          'But Grandpa was optimistic and hardworking.',
        ),
        s(
          '他一边干活儿，一边学习写字。',
          'tā yìbiān gànhuór, yìbiān xuéxí xiě zì.',
          'He learned to write while he worked.',
        ),
        s('后来，他当了老师。', 'hòulái, tā dāng le lǎoshī.', 'Later he became a teacher.'),
        s(
          '他经常说：“只要努力，就能改变命运。”',
          'tā jīngcháng shuō: "zhǐyào nǔlì, jiù néng gǎibiàn mìngyùn."',
          'He often says, "As long as you work hard, you can change your fate."',
        ),
      ],
      [
        s(
          '爷爷退休以后，最大的爱好是下象棋。',
          'yéye tuìxiū yǐhòu, zuì dà de àihào shì xià xiàngqí.',
          "Since he retired, Grandpa's great hobby has been Chinese chess.",
        ),
        s(
          '他下得非常好，我从来没有赢过他。',
          'tā xià de fēicháng hǎo, wǒ cónglái méiyǒu yíng guo tā.',
          "He plays brilliantly; I've never beaten him.",
        ),
        s('我很佩服我的爷爷。', 'wǒ hěn pèifú wǒ de yéye.', 'I really admire my grandpa.'),
      ],
    ],
    questions: [
      {
        question: 'How old is Grandpa?',
        options: ['Eighty', 'Seventy', 'Ninety'],
        answer: 'Eighty',
      },
      {
        question: 'What was Grandpa before?',
        options: ['A farmer', 'A soldier', 'A doctor'],
        answer: 'A farmer',
      },
      {
        question: 'What did he become later?',
        options: ['A teacher', 'A businessman', 'An engineer'],
        answer: 'A teacher',
      },
      {
        question: "What's his favourite hobby now?",
        options: ['Chinese chess', 'Tai chi', 'Fishing'],
        answer: 'Chinese chess',
      },
    ],
  },
  {
    id: 'trip-to-xian',
    title: s('去西安旅游', "qù Xī'ān lǚyóu", "A trip to Xi'an"),
    hskLevel: 5,
    after: 'h5-u39-l4',
    extras: [s('西安', "Xī'ān", "Xi'an (a city)")],
    paragraphs: [
      [
        s(
          '国庆节的时候，我和朋友去西安旅游。',
          "guóqìngjié de shíhou, wǒ hé péngyou qù Xī'ān lǚyóu.",
          "Over National Day, my friend and I went to Xi'an.",
        ),
        s(
          '西安是一座古老的城市，有悠久的历史。',
          "Xī'ān shì yí zuò gǔlǎo de chéngshì, yǒu yōujiǔ de lìshǐ.",
          "Xi'an is an ancient city with a long history.",
        ),
        s(
          '因为是放假期间，到处都很拥挤。',
          'yīnwèi shì fàngjià qījiān, dàochù dōu hěn yōngjǐ.',
          'Because it was the holidays, everywhere was packed.',
        ),
        s(
          '我们事先预订了宾馆，所以不用担心住的地方。',
          'wǒmen shìxiān yùdìng le bīnguǎn, suǒyǐ bú yòng dānxīn zhù de dìfang.',
          "We'd booked a hotel in advance, so we didn't have to worry about somewhere to stay.",
        ),
      ],
      [
        s(
          '我们游览了很多名胜，还参观了博物馆。',
          'wǒmen yóulǎn le hěn duō míngshèng, hái cānguān le bówùguǎn.',
          'We toured lots of famous sights and visited a museum.',
        ),
        s(
          '导游给我们讲了很多神话和传说，非常生动。',
          'dǎoyóu gěi wǒmen jiǎng le hěn duō shénhuà hé chuánshuō, fēicháng shēngdòng.',
          'The guide told us lots of myths and legends, very vividly.',
        ),
        s(
          '西安的小吃也很有名，口味很特别。',
          "Xī'ān de xiǎochī yě hěn yǒumíng, kǒuwèi hěn tèbié.",
          "Xi'an's street food is famous too, with very distinctive flavours.",
        ),
        s(
          '我们几乎吃遍了所有的小吃。',
          'wǒmen jīhū chī biàn le suǒyǒu de xiǎochī.',
          'We tried almost every snack there was.',
        ),
      ],
      [
        s(
          '回来以前，我们一起合影留念。',
          'huí lái yǐqián, wǒmen yìqǐ héyǐng liúniàn.',
          'Before we came back, we had a photo taken together as a keepsake.',
        ),
        s(
          '这次旅行虽然很累，但是收获很大。',
          'zhè cì lǚxíng suīrán hěn lèi, dànshì shōuhuò hěn dà.',
          'The trip was tiring, but we got a lot out of it.',
        ),
        s(
          '我盼望着下次再去。',
          'wǒ pànwàng zhe xià cì zài qù.',
          "I'm looking forward to going again.",
        ),
      ],
    ],
    questions: [
      {
        question: 'When did they go?',
        options: ['Over the National Day holiday', "On New Year's Eve", 'In the summer holidays'],
        answer: 'Over the National Day holiday',
      },
      {
        question: "Why didn't they need to worry about where to stay?",
        options: [
          'They had booked a hotel in advance',
          'They stayed with friends',
          'They went camping',
        ],
        answer: 'They had booked a hotel in advance',
      },
      {
        question: 'What did the guide tell them about?',
        options: ['Myths and legends', 'Food prices', 'Train times'],
        answer: 'Myths and legends',
      },
      {
        question: 'How was the trip, overall?',
        options: ['Tiring but worth it', 'Boring', 'Too expensive'],
        answer: 'Tiring but worth it',
      },
    ],
  },
];

export const storyById = (id: string) => stories.find((s) => s.id === id);

/** Every sentence of a story, title first. */
export const storySentences = (story: Story): PathSentence[] => [
  story.title,
  ...story.paragraphs.flat(),
];
