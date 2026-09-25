import type { PathSentence, Unit } from './types';

const s = (hanzi: string, pinyin: string, meaning: string): PathSentence => ({
  hanzi,
  pinyin,
  meaning,
});

// HSK 2 (2012): all 149 words in 25 lessons, building on HSK 1.
export const hsk2Units: Unit[] = [
  {
    id: 'h2-u1',
    hskLevel: 2,
    title: 'Family and introductions',
    description: 'Brothers, sisters, partners — and introducing people.',
    scenario: 'meeting-someone',
    lessons: [
      {
        id: 'h2-u1-l1',
        title: 'My family',
        words: ['哥哥', '姐姐', '弟弟', '妹妹', '丈夫', '妻子'],
        sentences: [
          s('我有一个哥哥。', 'wǒ yǒu yí ge gēge.', 'I have an older brother.'),
          s('她是我的妻子。', 'tā shì wǒ de qīzi.', 'She is my wife.'),
          s(
            '你姐姐叫什么名字？',
            'nǐ jiějie jiào shénme míngzi?',
            "What's your older sister's name?",
          ),
        ],
      },
      {
        id: 'h2-u1-l2',
        title: 'Introductions',
        words: ['您', '姓', '介绍', '大家', '男', '女'],
        grammar: 'a-not-a',
        sentences: [
          s('大家好！', 'dàjiā hǎo!', 'Hello, everyone!'),
          s('您姓什么？', 'nín xìng shénme?', "What's your surname?"),
          s('我来介绍一下。', 'wǒ lái jièshào yíxià.', 'Let me introduce you.'),
          s('她是不是你的同学？', 'tā shì bu shì nǐ de tóngxué?', 'Is she your classmate?'),
        ],
      },
      {
        id: 'h2-u1-l3',
        title: 'Birthdays',
        words: ['孩子', '它', '生日', '快乐', '送', '给'],
        sentences: [
          s('生日快乐！', 'shēngrì kuàilè!', 'Happy birthday!'),
          s('我送你一本书。', 'wǒ sòng nǐ yì běn shū.', "I'll give you a book."),
          s('你有几个孩子？', 'nǐ yǒu jǐ ge háizi?', 'How many children do you have?'),
        ],
      },
    ],
  },
  {
    id: 'h2-u2',
    hskLevel: 2,
    title: 'Daily routine',
    description: 'Mornings, busy days, and what you are doing right now.',
    scenario: 'messaging-friends',
    lessons: [
      {
        id: 'h2-u2-l1',
        title: 'Mornings',
        words: ['早上', '起床', '洗', '上班', '公司', '晚上'],
        grammar: 'future-yao-hui',
        sentences: [
          s(
            '我早上七点起床。',
            'wǒ zǎoshang qī diǎn qǐchuáng.',
            'I get up at seven in the morning.',
          ),
          s('你在哪个公司上班？', 'nǐ zài nǎge gōngsī shàngbān?', 'Which company do you work at?'),
          s('我晚上不工作。', 'wǒ wǎnshang bù gōngzuò.', "I don't work in the evenings."),
        ],
      },
      {
        id: 'h2-u2-l2',
        title: 'Busy days',
        words: ['忙', '累', '休息', '时间', '小时', '每'],
        grammar: 'time-duration',
        sentences: [
          s('我今天很忙。', 'wǒ jīntiān hěn máng.', "I'm busy today."),
          s('你累了吗？', 'nǐ lèi le ma?', 'Are you tired?'),
          s('我工作了八个小时。', 'wǒ gōngzuò le bā ge xiǎoshí.', 'I worked for eight hours.'),
          s('我没有时间。', 'wǒ méi yǒu shíjiān.', "I don't have time."),
        ],
      },
      {
        id: 'h2-u2-l3',
        title: 'Right now',
        words: ['正在', '着', '等', '找', '进', '房间'],
        grammar: 'zai-progressive',
        sentences: [
          s('我正在找我的书。', 'wǒ zhèngzài zhǎo wǒ de shū.', "I'm looking for my book."),
          s('请进！', 'qǐng jìn!', 'Come in!'),
          s('他在房间里等你。', 'tā zài fángjiān lǐ děng nǐ.', "He's waiting for you in the room."),
        ],
      },
    ],
  },
  {
    id: 'h2-u3',
    hskLevel: 2,
    title: 'Food and colours',
    description: 'Breakfast, buying fruit, and what to wear.',
    scenario: 'ordering-food',
    lessons: [
      {
        id: 'h2-u3-l1',
        title: 'Breakfast',
        words: ['鸡蛋', '牛奶', '咖啡', '面条', '羊肉', '鱼'],
        sentences: [
          s('我想喝咖啡。', 'wǒ xiǎng hē kāfēi.', "I'd like a coffee."),
          s('你吃鱼吗？', 'nǐ chī yú ma?', 'Do you eat fish?'),
          s('我早上喝牛奶。', 'wǒ zǎoshang hē niúnǎi.', 'I drink milk in the morning.'),
        ],
      },
      {
        id: 'h2-u3-l2',
        title: 'Cheap or expensive?',
        words: ['西瓜', '好吃', '服务员', '卖', '贵', '便宜'],
        sentences: [
          s('这个西瓜很好吃。', 'zhège xīguā hěn hǎochī.', 'This watermelon is delicious.'),
          s('太贵了！', 'tài guì le!', 'Too expensive!'),
          s('这里卖水果吗？', 'zhèlǐ mài shuǐguǒ ma?', 'Do they sell fruit here?'),
          s('这个很便宜。', 'zhège hěn piányi.', 'This is cheap.'),
        ],
      },
      {
        id: 'h2-u3-l3',
        title: 'Colours and clothes',
        words: ['颜色', '白', '黑', '红', '穿', '件'],
        sentences: [
          s('你喜欢什么颜色？', 'nǐ xǐhuan shénme yánsè?', 'What colour do you like?'),
          s(
            '我想买一件红衣服。',
            'wǒ xiǎng mǎi yí jiàn hóng yīfu.',
            'I want to buy something red to wear.',
          ),
          s(
            '她今天穿了一件白衣服。',
            'tā jīntiān chuān le yí jiàn bái yīfu.',
            'She wore white today.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h2-u4',
    hskLevel: 2,
    title: 'Travel and directions',
    description: 'Tickets, hotels, left and right, near and far.',
    scenario: 'getting-around',
    lessons: [
      {
        id: 'h2-u4-l1',
        title: 'Travelling',
        words: ['机场', '火车站', '公共汽车', '船', '票', '旅游', '宾馆'],
        grammar: 'le-completion',
        sentences: [
          s('我想去中国旅游。', 'wǒ xiǎng qù Zhōngguó lǚyóu.', 'I want to travel to China.'),
          s('我买了票。', 'wǒ mǎi le piào.', "I've bought the tickets."),
          s(
            '我们坐公共汽车去机场。',
            'wǒmen zuò gōnggòng qìchē qù jīchǎng.',
            "We'll take the bus to the airport.",
          ),
          s(
            '宾馆在火车站前面。',
            'bīnguǎn zài huǒchēzhàn qiánmiàn.',
            'The hotel is in front of the station.',
          ),
        ],
      },
      {
        id: 'h2-u4-l2',
        title: 'Left and right',
        words: ['左边', '右边', '旁边', '往', '路', '走'],
        sentences: [
          s('往左边走。', 'wǎng zuǒbian zǒu.', 'Go to the left.'),
          s(
            '医院在学校旁边。',
            'yīyuàn zài xuéxiào pángbiān.',
            'The hospital is next to the school.',
          ),
          s('我在路上。', 'wǒ zài lù shang.', "I'm on my way."),
        ],
      },
      {
        id: 'h2-u4-l3',
        title: 'Near and far',
        words: ['远', '近', '从', '到', '门', '离'],
        sentences: [
          s('你家离学校远吗？', 'nǐ jiā lí xuéxiào yuǎn ma?', 'Is your home far from school?'),
          s('我家很近。', 'wǒ jiā hěn jìn.', 'My home is close.'),
          s('我从北京来。', 'wǒ cóng Běijīng lái.', "I'm from Beijing."),
          s('请开门。', 'qǐng kāi mén.', 'Please open the door.'),
        ],
      },
    ],
  },
  {
    id: 'h2-u5',
    hskLevel: 2,
    title: 'Numbers and time',
    description: 'Hundreds and thousands, firsts, already, and about to.',
    lessons: [
      {
        id: 'h2-u5-l1',
        title: 'Bigger numbers',
        words: ['零', '两', '百', '千', '第一', '次'],
        sentences: [
          s('这个一百块。', 'zhège yìbǎi kuài.', 'This is 100 yuan.'),
          s('我有两个妹妹。', 'wǒ yǒu liǎng ge mèimei.', 'I have two younger sisters.'),
          s(
            '这是我第一次来中国。',
            'zhè shì wǒ dì yī cì lái Zhōngguó.',
            'This is my first time in China.',
          ),
        ],
      },
      {
        id: 'h2-u5-l2',
        title: 'Already',
        words: ['去年', '日', '已经', '就', '开始', '完'],
        grammar: 'yijing-le',
        sentences: [
          s('我去年去了北京。', 'wǒ qùnián qù le Běijīng.', 'I went to Beijing last year.'),
          s('电影已经开始了。', 'diànyǐng yǐjīng kāishǐ le.', 'The film has already started.'),
          s('我吃完了。', 'wǒ chī wán le.', "I've finished eating."),
        ],
      },
      {
        id: 'h2-u5-l3',
        title: 'Fast and slow',
        words: ['快', '慢', '最', '非常', '真', '再'],
        grammar: 'kuai-le',
        sentences: [
          s('快下雨了。', 'kuài xià yǔ le.', "It's about to rain."),
          s('这个非常好吃。', 'zhège fēicháng hǎochī.', 'This is incredibly tasty.'),
          s('我最喜欢吃鱼。', 'wǒ zuì xǐhuan chī yú.', 'Fish is my favourite.'),
          s('明天再来。', 'míngtiān zài lái.', 'Come again tomorrow.'),
        ],
      },
    ],
  },
  {
    id: 'h2-u6',
    hskLevel: 2,
    title: 'Health and fun',
    description: 'Feeling ill, sport, hobbies, and the weather.',
    scenario: 'sports-fitness',
    lessons: [
      {
        id: 'h2-u6-l1',
        title: 'Feeling ill',
        words: ['身体', '生病', '药', '眼睛', '高', '长'],
        grammar: 'le-change-of-state',
        sentences: [
          s('我生病了。', 'wǒ shēngbìng le.', "I've fallen ill."),
          s('你身体怎么样？', 'nǐ shēntǐ zěnmeyàng?', 'How are you keeping?'),
          s('他很高。', 'tā hěn gāo.', "He's tall."),
          s('她的眼睛很漂亮。', 'tā de yǎnjing hěn piàoliang.', 'Her eyes are beautiful.'),
        ],
      },
      {
        id: 'h2-u6-l2',
        title: 'Sport',
        words: ['运动', '跑步', '游泳', '打篮球', '踢足球', '可以'],
        grammar: 'hui-neng-keyi',
        sentences: [
          s('你会游泳吗？', 'nǐ huì yóuyǒng ma?', 'Can you swim?'),
          s('我喜欢跑步。', 'wǒ xǐhuan pǎobù.', 'I like running.'),
          s('我们可以去打篮球。', 'wǒmen kěyǐ qù dǎ lánqiú.', 'We could go and play basketball.'),
        ],
      },
      {
        id: 'h2-u6-l3',
        title: 'Having fun',
        words: ['唱歌', '跳舞', '玩', '笑', '出', '得'],
        grammar: 'de-complement',
        sentences: [
          s('他写字写得很好。', 'tā xiě zì xiě de hěn hǎo.', 'He writes characters really well.'),
          s('我们出去玩。', 'wǒmen chūqù wán.', "We're going out to have fun."),
          s('你喜欢跳舞吗？', 'nǐ xǐhuan tiàowǔ ma?', 'Do you like dancing?'),
          s('她笑了。', 'tā xiào le.', 'She smiled.'),
        ],
      },
      {
        id: 'h2-u6-l4',
        title: 'Snow and sunshine',
        words: ['雪', '晴', '外'],
        sentences: [
          s('明天会下雪吗？', 'míngtiān huì xià xuě ma?', 'Will it snow tomorrow?'),
          s('明天晴。', 'míngtiān qíng.', 'Tomorrow will be sunny.'),
          s('他在门外。', 'tā zài mén wài.', "He's outside the door."),
        ],
      },
    ],
  },
  {
    id: 'h2-u7',
    hskLevel: 2,
    title: 'School and questions',
    description: 'Classes, asking and understanding, right and wrong.',
    scenario: 'school-classroom',
    lessons: [
      {
        id: 'h2-u7-l1',
        title: 'In class',
        words: ['教室', '课', '考试', '题', '铅笔', '报纸'],
        sentences: [
          s('我们明天考试。', 'wǒmen míngtiān kǎoshì.', 'We have an exam tomorrow.'),
          s('老师在教室里。', 'lǎoshī zài jiàoshì lǐ.', 'The teacher is in the classroom.'),
          s('我没有铅笔。', 'wǒ méi yǒu qiānbǐ.', "I don't have a pencil."),
        ],
      },
      {
        id: 'h2-u7-l2',
        title: 'Asking questions',
        words: ['问', '问题', '懂', '意思', '告诉', '知道', '说'],
        grammar: 'le-questions',
        sentences: [
          s('我可以问一个问题吗？', 'wǒ kěyǐ wèn yí ge wèntí ma?', 'Can I ask a question?'),
          s('这是什么意思？', 'zhè shì shénme yìsi?', 'What does this mean?'),
          s('我不知道。', 'wǒ bù zhīdào.', "I don't know."),
          s('你懂了吗？', 'nǐ dǒng le ma?', 'Did you understand?'),
        ],
      },
      {
        id: 'h2-u7-l3',
        title: 'Right and wrong',
        words: ['对', '错', '事情', '帮助', '让', '准备'],
        sentences: [
          s('对不起，我错了。', 'duìbuqǐ, wǒ cuò le.', 'Sorry, I was wrong.'),
          s('谢谢你的帮助。', 'xièxie nǐ de bāngzhù.', 'Thanks for your help.'),
          s('你准备好了吗？', 'nǐ zhǔnbèi hǎo le ma?', 'Are you ready?'),
        ],
      },
    ],
  },
  {
    id: 'h2-u8',
    hskLevel: 2,
    title: 'Reasons and opinions',
    description: 'Why, because, although — and what you think.',
    scenario: 'small-talk',
    lessons: [
      {
        id: 'h2-u8-l1',
        title: 'Why?',
        words: ['为什么', '因为', '所以', '但是', '虽然', '可能'],
        grammar: 'yin-suo',
        sentences: [
          s('你为什么不来？', 'nǐ wèishénme bù lái?', "Why aren't you coming?"),
          s(
            '因为我生病了，所以没去上班。',
            'yīnwèi wǒ shēngbìng le, suǒyǐ méi qù shàngbān.',
            "I was ill, so I didn't go to work.",
          ),
          s(
            '虽然很贵，但是很好吃。',
            'suīrán hěn guì, dànshì hěn hǎochī.',
            "It's expensive, but it's delicious.",
          ),
          s('他可能不来了。', 'tā kěnéng bù lái le.', 'He might not come after all.'),
        ],
      },
      {
        id: 'h2-u8-l2',
        title: 'What I think',
        words: ['觉得', '希望', '比', '新', '手机', '手表'],
        grammar: 'bi-comparison',
        sentences: [
          s('我觉得很好。', 'wǒ juéde hěn hǎo.', 'I think it’s good.'),
          s('我的手机是新的。', 'wǒ de shǒujī shì xīn de.', 'My phone is new.'),
          s('他比我高。', 'tā bǐ wǒ gāo.', "He's taller than me."),
          s('希望你喜欢。', 'xīwàng nǐ xǐhuan.', 'I hope you like it.'),
        ],
      },
      {
        id: 'h2-u8-l3',
        title: 'Also, still, together',
        words: ['还', '也', '一起', '别', '要', '过'],
        grammar: 'guo-experience',
        sentences: [
          s('我也去过北京。', 'wǒ yě qù guo Běijīng.', "I've been to Beijing too."),
          s('我们一起去。', 'wǒmen yìqǐ qù.', "We'll go together."),
          s('别说话！', 'bié shuōhuà!', 'Stop talking!'),
          s('你还要什么？', 'nǐ hái yào shénme?', 'What else would you like?'),
        ],
      },
    ],
  },
];
