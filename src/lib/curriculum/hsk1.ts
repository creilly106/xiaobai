import type { PathSentence, Unit } from './types';

const s = (hanzi: string, pinyin: string, meaning: string): PathSentence => ({
  hanzi,
  pinyin,
  meaning,
});

// HSK 1 (2012): all 149 words in 25 lessons. Most useful topics come first.
export const hsk1Units: Unit[] = [
  {
    id: 'h1-u1',
    hskLevel: 1,
    title: 'Hello',
    description: 'Greetings, names, and being polite.',
    scenario: 'meeting-someone',
    lessons: [
      {
        id: 'h1-u1-l1',
        title: 'Hello',
        words: ['你', '好', '我', '是', '谢谢', '再见'],
        sentences: [s('你好！', 'nǐ hǎo!', 'Hello!'), s('谢谢你！', 'xièxie nǐ!', 'Thank you!')],
      },
      {
        id: 'h1-u1-l2',
        title: "What's your name?",
        words: ['叫', '什么', '名字', '他', '她', '谁'],
        grammar: 'wh-questions',
        sentences: [
          s('你叫什么名字？', 'nǐ jiào shénme míngzi?', "What's your name?"),
          s('他是谁？', 'tā shì shéi?', 'Who is he?'),
          s('她叫什么名字？', 'tā jiào shénme míngzi?', "What's her name?"),
        ],
      },
      {
        id: 'h1-u1-l3',
        title: 'Nice to meet you',
        words: ['很', '高兴', '认识', '吗', '不', '呢'],
        grammar: 'ma-yes-no',
        sentences: [
          s('你好吗？', 'nǐ hǎo ma?', 'How are you?'),
          s('我很好，你呢？', 'wǒ hěn hǎo, nǐ ne?', "I'm fine, and you?"),
          s('很高兴认识你。', 'hěn gāoxìng rènshi nǐ.', 'Nice to meet you.'),
          s('她不高兴。', 'tā bù gāoxìng.', "She isn't happy."),
        ],
      },
      {
        id: 'h1-u1-l4',
        title: 'Excuse me',
        words: ['对不起', '没关系', '不客气', '请', '先生', '小姐'],
        sentences: [
          s('对不起！', 'duìbuqǐ!', 'Sorry!'),
          s('没关系。', 'méi guānxi.', "It doesn't matter."),
          s('先生，你好！', 'xiānsheng, nǐ hǎo!', 'Hello, sir!'),
          s('小姐，谢谢你。', 'xiǎojiě, xièxie nǐ.', 'Thank you, miss.'),
        ],
      },
      {
        id: 'h1-u1-l5',
        title: 'Where are you from?',
        words: ['中国', '人', '哪', '哪儿', '老师', '学生'],
        sentences: [
          s('你是中国人吗？', 'nǐ shì Zhōngguó rén ma?', 'Are you Chinese?'),
          s('我不是中国人。', 'wǒ bú shì Zhōngguó rén.', "I'm not Chinese."),
          s(
            '他是老师，我是学生。',
            'tā shì lǎoshī, wǒ shì xuésheng.',
            "He's a teacher; I'm a student.",
          ),
          s('你是哪儿人？', 'nǐ shì nǎr rén?', 'Where are you from?'),
        ],
      },
    ],
  },
  {
    id: 'h1-u2',
    hskLevel: 1,
    title: 'Numbers',
    description: 'Counting, ages, and prices.',
    scenario: 'shopping',
    lessons: [
      {
        id: 'h1-u2-l1',
        title: 'One to six',
        words: ['一', '二', '三', '四', '五', '六'],
      },
      {
        id: 'h1-u2-l2',
        title: 'Seven to ten',
        words: ['七', '八', '九', '十', '几', '岁'],
        sentences: [
          s('你几岁？', 'nǐ jǐ suì?', 'How old are you?'),
          s('我十八岁。', 'wǒ shíbā suì.', "I'm eighteen."),
          s('她九岁。', 'tā jiǔ suì.', "She's nine."),
        ],
      },
      {
        id: 'h1-u2-l3',
        title: 'How much is it?',
        words: ['多少', '钱', '块', '个', '些', '本'],
        grammar: 'measure-words',
        sentences: [
          s('多少钱？', 'duōshao qián?', 'How much is it?'),
          s('三块钱。', 'sān kuài qián.', 'Three yuan.'),
          s('十块钱。', 'shí kuài qián.', 'Ten yuan.'),
          s('五个人。', 'wǔ ge rén.', 'Five people.'),
        ],
      },
    ],
  },
  {
    id: 'h1-u3',
    hskLevel: 1,
    title: 'Family and friends',
    description: 'The people in your life, and what you like.',
    scenario: 'relationships',
    lessons: [
      {
        id: 'h1-u3-l1',
        title: 'My family',
        words: ['爸爸', '妈妈', '家', '有', '儿子', '女儿'],
        grammar: 'you-possession',
        sentences: [
          s('我有一个女儿。', 'wǒ yǒu yí ge nǚ’ér.', 'I have a daughter.'),
          s('你家有几个人？', 'nǐ jiā yǒu jǐ ge rén?', 'How many people are in your family?'),
          s('我爸爸是老师。', 'wǒ bàba shì lǎoshī.', 'My dad is a teacher.'),
        ],
      },
      {
        id: 'h1-u3-l2',
        title: 'Friends',
        words: ['的', '朋友', '同学', '和', '我们', '都'],
        grammar: 'possessive-de',
        sentences: [
          s('他是我的朋友。', 'tā shì wǒ de péngyou.', 'He is my friend.'),
          s('我们都是学生。', 'wǒmen dōu shì xuésheng.', 'We are all students.'),
          s('我和她是同学。', 'wǒ hé tā shì tóngxué.', 'She and I are classmates.'),
        ],
      },
      {
        id: 'h1-u3-l3',
        title: 'What I like',
        words: ['爱', '喜欢', '狗', '猫', '没', '想'],
        grammar: 'bu-vs-mei',
        sentences: [
          s('我喜欢猫。', 'wǒ xǐhuan māo.', 'I like cats.'),
          s('我没有狗。', 'wǒ méi yǒu gǒu.', "I don't have a dog."),
          s('我爱我妈妈。', 'wǒ ài wǒ māma.', 'I love my mum.'),
        ],
      },
    ],
  },
  {
    id: 'h1-u4',
    hskLevel: 1,
    title: 'Food and shopping',
    description: 'Eating, drinking, and buying things.',
    scenario: 'ordering-food',
    lessons: [
      {
        id: 'h1-u4-l1',
        title: 'Eat and drink',
        words: ['吃', '喝', '茶', '水', '米饭', '菜'],
        grammar: 'basic-svo',
        sentences: [
          s('我喝茶。', 'wǒ hē chá.', 'I drink tea.'),
          s('你吃米饭吗？', 'nǐ chī mǐfàn ma?', 'Do you eat rice?'),
          s('我不喝水。', 'wǒ bù hē shuǐ.', "I don't drink water."),
        ],
      },
      {
        id: 'h1-u4-l2',
        title: 'At the restaurant',
        words: ['饭店', '杯子', '苹果', '水果', '东西', '买'],
        sentences: [
          s('我想买苹果。', 'wǒ xiǎng mǎi píngguǒ.', 'I want to buy apples.'),
          s('我想吃水果。', 'wǒ xiǎng chī shuǐguǒ.', 'I want to eat some fruit.'),
          s('饭店有什么菜？', 'fàndiàn yǒu shénme cài?', 'What dishes does the restaurant have?'),
        ],
      },
      {
        id: 'h1-u4-l3',
        title: 'Shopping',
        words: ['商店', '衣服', '漂亮', '太', '大', '小'],
        grammar: 'adj-predicate',
        sentences: [
          s('衣服很漂亮。', 'yīfu hěn piàoliang.', 'The clothes are pretty.'),
          s('商店很大。', 'shāngdiàn hěn dà.', 'The shop is big.'),
          s('我的猫很小。', 'wǒ de māo hěn xiǎo.', 'My cat is small.'),
        ],
      },
    ],
  },
  {
    id: 'h1-u5',
    hskLevel: 1,
    title: 'Time',
    description: 'Days, dates, and your daily routine.',
    lessons: [
      {
        id: 'h1-u5-l1',
        title: 'Today and tomorrow',
        words: ['今天', '明天', '昨天', '现在', '了', '时候'],
        grammar: 'time-when',
        sentences: [
          s('今天我很高兴。', 'jīntiān wǒ hěn gāoxìng.', "I'm happy today."),
          s('昨天我吃了米饭。', 'zuótiān wǒ chī le mǐfàn.', 'I ate rice yesterday.'),
          s('我现在不想吃。', 'wǒ xiànzài bù xiǎng chī.', "I don't want to eat now."),
        ],
      },
      {
        id: 'h1-u5-l2',
        title: 'Dates and times',
        words: ['年', '月', '号', '星期', '点', '分钟'],
        sentences: [
          s('今天几号？', 'jīntiān jǐ hào?', "What's the date today?"),
          s('今天星期几？', 'jīntiān xīngqī jǐ?', 'What day is it today?'),
          s('现在几点？', 'xiànzài jǐ diǎn?', 'What time is it now?'),
        ],
      },
      {
        id: 'h1-u5-l3',
        title: 'My day',
        words: ['上午', '中午', '下午', '睡觉', '工作', '做'],
        sentences: [
          s('我下午工作。', 'wǒ xiàwǔ gōngzuò.', 'I work in the afternoon.'),
          s('你中午做什么？', 'nǐ zhōngwǔ zuò shénme?', 'What are you doing at noon?'),
          s('我想睡觉。', 'wǒ xiǎng shuìjiào.', 'I want to sleep.'),
        ],
      },
    ],
  },
  {
    id: 'h1-u6',
    hskLevel: 1,
    title: 'Getting around',
    description: 'Where things are, and going places.',
    scenario: 'getting-around',
    lessons: [
      {
        id: 'h1-u6-l1',
        title: 'Where is it?',
        words: ['在', '这', '那', '里', '上', '下'],
        grammar: 'zai-location',
        sentences: [
          s('我在家。', 'wǒ zài jiā.', "I'm at home."),
          s('那是什么？', 'nà shì shénme?', 'What is that?'),
          s('你在哪儿？', 'nǐ zài nǎr?', 'Where are you?'),
          s('这是我的猫。', 'zhè shì wǒ de māo.', 'This is my cat.'),
        ],
      },
      {
        id: 'h1-u6-l2',
        title: 'Around town',
        words: ['前面', '后面', '学校', '医院', '医生', '北京'],
        sentences: [
          s('医院在前面。', 'yīyuàn zài qiánmiàn.', 'The hospital is up ahead.'),
          s('我在北京工作。', 'wǒ zài Běijīng gōngzuò.', 'I work in Beijing.'),
          s('他是医生。', 'tā shì yīshēng.', 'He is a doctor.'),
        ],
      },
      {
        id: 'h1-u6-l3',
        title: 'Going places',
        words: ['去', '来', '回', '坐', '出租车', '飞机'],
        sentences: [
          s('我去学校。', 'wǒ qù xuéxiào.', "I'm going to school."),
          s('他回家了。', 'tā huí jiā le.', 'He went home.'),
          s('我们坐出租车去。', 'wǒmen zuò chūzūchē qù.', "We'll go by taxi."),
          s('你坐飞机去北京吗？', 'nǐ zuò fēijī qù Běijīng ma?', 'Are you flying to Beijing?'),
        ],
      },
    ],
  },
  {
    id: 'h1-u7',
    hskLevel: 1,
    title: 'Daily life',
    description: 'Studying, watching, home, and the phone.',
    lessons: [
      {
        id: 'h1-u7-l1',
        title: 'Studying',
        words: ['学习', '读', '写', '字', '汉语', '会'],
        sentences: [
          s('我学习汉语。', 'wǒ xuéxí Hànyǔ.', 'I study Chinese.'),
          s('你会写这个字吗？', 'nǐ huì xiě zhège zì ma?', 'Can you write this character?'),
        ],
      },
      {
        id: 'h1-u7-l2',
        title: 'Watch and listen',
        words: ['看', '看见', '听', '说话', '电视', '电影'],
        sentences: [
          s('我喜欢看电影。', 'wǒ xǐhuan kàn diànyǐng.', 'I like watching films.'),
          s('你看见我的猫了吗？', 'nǐ kànjiàn wǒ de māo le ma?', 'Have you seen my cat?'),
          s('我在看电视。', 'wǒ zài kàn diànshì.', "I'm watching TV."),
        ],
      },
      {
        id: 'h1-u7-l3',
        title: 'At home',
        words: ['书', '电脑', '桌子', '椅子', '开', '住'],
        sentences: [
          s('书在桌子上。', 'shū zài zhuōzi shang.', 'The book is on the table.'),
          s('你住在哪儿？', 'nǐ zhù zài nǎr?', 'Where do you live?'),
          s('我住在北京。', 'wǒ zhù zài Běijīng.', 'I live in Beijing.'),
        ],
      },
      {
        id: 'h1-u7-l4',
        title: 'On the phone',
        words: ['打电话', '喂', '能', '怎么', '多', '少'],
        sentences: [
          s('喂，你好！', 'wéi, nǐ hǎo!', 'Hello? (on the phone)'),
          s('我能打电话吗？', 'wǒ néng dǎ diànhuà ma?', 'Can I make a phone call?'),
          s('这个字怎么读？', 'zhège zì zěnme dú?', 'How do you read this character?'),
        ],
      },
    ],
  },
  {
    id: 'h1-u8',
    hskLevel: 1,
    title: 'Weather',
    description: 'Hot, cold, rain, and small talk.',
    scenario: 'small-talk',
    lessons: [
      {
        id: 'h1-u8-l1',
        title: "How's the weather?",
        words: ['天气', '下雨', '冷', '热', '怎么样'],
        sentences: [
          s('今天天气怎么样？', 'jīntiān tiānqì zěnmeyàng?', "How's the weather today?"),
          s('今天很热。', 'jīntiān hěn rè.', "It's hot today."),
          s('明天下雨吗？', 'míngtiān xià yǔ ma?', 'Will it rain tomorrow?'),
          s('北京很冷。', 'Běijīng hěn lěng.', "It's cold in Beijing."),
        ],
      },
    ],
  },
];
