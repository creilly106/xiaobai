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
        s('“我在家。你怎么了？”', '"wǒ zài jiā. nǐ zěnme le?"', '"I\'m at home. What\'s up?"'),
        s(
          '“下雨了，你能来学校吗？”',
          '"xià yǔ le, nǐ néng lái xuéxiào ma?"',
          '"It\'s raining. Could you come to the school?"',
        ),
        s('“好！我坐出租车来。”', '"hǎo! wǒ zuò chūzūchē lái."', '"OK! I\'ll come by taxi."'),
      ],
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
        s('“没有，我太累了。”', '"méiyǒu, wǒ tài lèi le."', '"No, I\'m too tired."'),
      ],
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
];

export const storyById = (id: string) => stories.find((s) => s.id === id);

/** Every sentence of a story, title first. */
export const storySentences = (story: Story): PathSentence[] => [
  story.title,
  ...story.paragraphs.flat(),
];
