import type { Lesson, PathSentence, Unit } from './types';

const s = (hanzi: string, pinyin: string, meaning: string): PathSentence => ({
  hanzi,
  pinyin,
  meaning,
});

/** Build a unit's lessons as h5-uN-l1, l2… from [title, words, sentences, grammar?]. */
function unit(
  n: number,
  title: string,
  description: string,
  lessons: [string, string[], PathSentence[], string?][],
  scenario?: string,
): Unit {
  const id = `h5-u${n}`;
  return {
    id,
    hskLevel: 5,
    title,
    description,
    ...(scenario ? { scenario } : {}),
    lessons: lessons.map(([lessonTitle, words, sentences, grammar], i): Lesson => ({
      id: `${id}-l${i + 1}`,
      title: lessonTitle,
      words,
      ...(grammar ? { grammar } : {}),
      sentences,
    })),
  };
}

const w = (text: string) => text.split(' ');

// HSK 5 (2012), part 2: the other 623 new words, in 103 lessons (units 19–39).
export const hsk5bUnits: Unit[] = [
  unit(
    19,
    'Things around the house',
    'Bedding, kitchen things, tools, stationery and odds and ends.',
    [
      [
        'Bedroom',
        w('被子 枕头 窗帘 地毯 抽屉 书架'),
        [
          s(
            '晚上很冷，我多盖了一条被子。',
            'wǎnshang hěn lěng, wǒ duō gài le yì tiáo bèizi.',
            'It was cold at night, so I put on an extra quilt.',
          ),
          s('请把窗帘拉上。', 'qǐng bǎ chuānglián lā shàng.', 'Please draw the curtains.'),
          s('钥匙在抽屉里。', 'yàoshi zài chōuti lǐ.', 'The keys are in the drawer.'),
        ],
      ],
      [
        'In the kitchen',
        w('叉子 醋 酱油 罐头 煎 油炸'),
        [
          s(
            '我不会用筷子，能给我一把叉子吗？',
            'wǒ bú huì yòng kuàizi, néng gěi wǒ yì bǎ chāzi ma?',
            "I can't use chopsticks. Could I have a fork?",
          ),
          s(
            '我吃饺子喜欢放醋。',
            'wǒ chī jiǎozi xǐhuan fàng cù.',
            'I like vinegar with my dumplings.',
          ),
          s(
            '油炸的食物对身体不好。',
            'yóuzhá de shíwù duì shēntǐ bù hǎo.',
            'Deep-fried food is bad for you.',
          ),
        ],
      ],
      [
        'Tools',
        w('剪刀 尺子 胶水 夹子 绳子 管子'),
        [
          s('你有剪刀吗？', 'nǐ yǒu jiǎndāo ma?', 'Have you got any scissors?'),
          s('这根绳子太短了。', 'zhè gēn shéngzi tài duǎn le.', 'This rope is too short.'),
        ],
      ],
      [
        'Little things',
        w('火柴 蜡烛 扇子 梳子 肥皂 盆'),
        [
          s(
            '生日蛋糕上有十根蜡烛。',
            'shēngrì dàngāo shàng yǒu shí gēn làzhú.',
            'There are ten candles on the birthday cake.',
          ),
          s(
            '卫生间里没有肥皂了。',
            'wèishēngjiān lǐ méiyǒu féizào le.',
            "There's no soap left in the bathroom.",
          ),
        ],
      ],
      [
        'Stationery',
        w('文具 册 目录 标点 提纲 日历'),
        [
          s(
            '写文章以前，先写一个提纲。',
            'xiě wénzhāng yǐqián, xiān xiě yí gè tígāng.',
            'Before writing an essay, write an outline.',
          ),
          s(
            '墙上挂着一本日历。',
            'qiáng shàng guà zhe yì běn rìlì.',
            "There's a calendar on the wall.",
          ),
          s('请先看目录。', 'qǐng xiān kàn mùlù.', 'Look at the contents page first.'),
        ],
      ],
      [
        'Odds and ends',
        w('包裹 壶 铃 名片 木头 柜台'),
        [
          s('这是我的名片。', 'zhè shì wǒ de míngpiàn.', "Here's my business card."),
          s(
            '我去邮局寄一个包裹。',
            'wǒ qù yóujú jì yí gè bāoguǒ.',
            "I'm going to the post office to send a parcel.",
          ),
          s(
            '这个桌子是木头做的。',
            'zhège zhuōzi shì mùtou zuò de.',
            'This table is made of wood.',
          ),
        ],
      ],
      [
        'Around the building',
        w('台阶 影子 灰尘 小偷 中介 单元'),
        [
          s('小心台阶！', 'xiǎoxīn táijiē!', 'Mind the step!'),
          s(
            '昨天小偷进了我家。',
            'zuótiān xiǎotōu jìn le wǒ jiā.',
            'A burglar got into my home yesterday.',
          ),
          s(
            '我们通过中介租了房间。',
            'wǒmen tōngguò zhōngjiè zū le fángjiān.',
            'We rented the room through an agent.',
          ),
        ],
      ],
    ],
  ),
  unit(20, 'Computers and media', 'Gadgets, the computer, recordings and subtitles.', [
    [
      'Gadgets',
      w('电池 充电器 键盘 鼠标 硬件 光盘'),
      [
        s('手机电池用完了。', 'shǒujī diànchí yòng wán le.', 'My phone battery has run out.'),
        s('你带充电器了吗？', 'nǐ dài chōngdiànqì le ma?', 'Did you bring a charger?'),
      ],
    ],
    [
      'On the computer',
      w('下载 删除 复制 粘贴 浏览 输入'),
      [
        s(
          '我从网站下载了这个软件。',
          'wǒ cóng wǎngzhàn xiàzài le zhège ruǎnjiàn.',
          'I downloaded this software from a website.',
        ),
        s('请输入你的密码。', 'qǐng shūrù nǐ de mìmǎ.', 'Please enter your password.'),
        s('别删除这个文件。', 'bié shānchú zhège wénjiàn.', "Don't delete this file."),
      ],
    ],
    [
      'Recording',
      w('磁带 录音 字幕 麦克风 电台 数码'),
      [
        s(
          '我看中国电影的时候要看字幕。',
          'wǒ kàn Zhōngguó diànyǐng de shíhou yào kàn zìmù.',
          'I need subtitles when I watch Chinese films.',
        ),
        s(
          '老师让我们听录音。',
          'lǎoshī ràng wǒmen tīng lùyīn.',
          'The teacher had us listen to a recording.',
        ),
      ],
    ],
  ]),
  unit(
    21,
    'Food',
    'Vegetables, fruit and grain, snacks, and how food tastes.',
    [
      [
        'Vegetables',
        w('蔬菜 土豆 黄瓜 辣椒 豆腐 花生'),
        [
          s(
            '多吃蔬菜对身体好。',
            'duō chī shūcài duì shēntǐ hǎo.',
            'Eating more vegetables is good for you.',
          ),
          s(
            '这个菜里有很多辣椒。',
            'zhège cài lǐ yǒu hěn duō làjiāo.',
            "There's a lot of chilli in this dish.",
          ),
          s('我不吃豆腐。', 'wǒ bù chī dòufu.', "I don't eat tofu."),
        ],
      ],
      [
        'Fruit and grain',
        w('桃 梨 桔子 小麦 粮食 果实'),
        [
          s('我喜欢吃桃和梨。', 'wǒ xǐhuan chī táo hé lí.', 'I like peaches and pears.'),
          s('我们不能浪费粮食。', 'wǒmen bù néng làngfèi liángshi.', "We mustn't waste food."),
        ],
      ],
      [
        'Snacks',
        w('零食 点心 馒头 海鲜 口味 清淡'),
        [
          s('小孩子喜欢吃零食。', 'xiǎo háizi xǐhuan chī língshí.', 'Little kids love snacks.'),
          s('我的口味比较清淡。', 'wǒ de kǒuwèi bǐjiào qīngdàn.', 'I prefer light food.'),
          s('你想吃海鲜吗？', 'nǐ xiǎng chī hǎixiān ma?', 'Do you fancy seafood?'),
        ],
      ],
      [
        'How it tastes',
        w('淡 浓 嫩 薄 营养 消化'),
        [
          s(
            '这个汤太淡了，放点盐吧。',
            'zhège tāng tài dàn le, fàng diǎn yán ba.',
            "This soup's bland. Add some salt.",
          ),
          s('牛奶很有营养。', 'niúnǎi hěn yǒu yíngyǎng.', 'Milk is very nutritious.'),
          s('我喜欢喝浓咖啡。', 'wǒ xǐhuan hē nóng kāfēi.', 'I like strong coffee.'),
        ],
      ],
    ],
    'ordering-food',
  ),
  unit(
    22,
    'Clothes and looks',
    'Clothes and accessories, style, face and body, appearance.',
    [
      [
        'Clothes',
        w('牛仔裤 皮鞋 手套 围巾 项链 戒指'),
        [
          s(
            '天气很冷，戴上手套和围巾吧。',
            'tiānqì hěn lěng, dài shàng shǒutào hé wéijīn ba.',
            "It's cold. Put on your gloves and scarf.",
          ),
          s('他送给她一条项链。', 'tā sòng gěi tā yì tiáo xiàngliàn.', 'He gave her a necklace.'),
        ],
      ],
      [
        'Style',
        w('系领带 丝绸 棉花 名牌 时髦 样式'),
        [
          s('他今天系领带了。', 'tā jīntiān jì lǐngdài le.', "He's wearing a tie today."),
          s('这件衣服是丝绸的。', 'zhè jiàn yīfu shì sīchóu de.', 'This top is silk.'),
          s(
            '我不喜欢买名牌。',
            'wǒ bù xǐhuan mǎi míngpái.',
            "I don't like buying designer brands.",
          ),
        ],
      ],
      [
        'Face and body',
        w('眉毛 胡须 肩膀 舌头 嗓子 骨头'),
        [
          s('我嗓子疼。', 'wǒ sǎngzi téng.', 'I have a sore throat.'),
          s('他的肩膀很宽。', 'tā de jiānbǎng hěn kuān.', 'He has broad shoulders.'),
        ],
      ],
      [
        'Good-looking',
        w('英俊 苗条 难看 天真 朴素 鲜艳'),
        [
          s('她穿得很朴素。', 'tā chuān de hěn pǔsù.', 'She dresses simply.'),
          s('这个颜色太鲜艳了。', 'zhège yánsè tài xiānyàn le.', 'This colour is too bright.'),
          s(
            '他是一个英俊的小伙子。',
            'tā shì yí gè yīngjùn de xiǎohuǒzi.',
            "He's a handsome young man.",
          ),
        ],
      ],
    ],
    'shopping',
  ),
  unit(
    23,
    'Home and family',
    'Relatives, rooms, chores, pets and creatures.',
    [
      [
        'Relatives',
        w('舅舅 姑姑 姥姥 祖先 孝顺 疼爱'),
        [
          s('我姥姥非常疼爱我。', "wǒ lǎolao fēicháng téng'ài wǒ.", 'My grandma dotes on me.'),
          s(
            '他对父亲母亲很孝顺。',
            'tā duì fùqīn mǔqīn hěn xiàoshùn.',
            'He is very good to his parents.',
          ),
        ],
      ],
      [
        'Rooms',
        w('卧室 阳台 屋子 车库 宿舍 隔壁'),
        [
          s(
            '我住在学校的宿舍里。',
            'wǒ zhù zài xuéxiào de sùshè lǐ.',
            'I live in the school dorm.',
          ),
          s(
            '隔壁的邻居很热情。',
            'gébì de línjū hěn rèqíng.',
            'The neighbours next door are very friendly.',
          ),
          s(
            '阳台上有很多花。',
            'yángtái shàng yǒu hěn duō huā.',
            'There are lots of flowers on the balcony.',
          ),
        ],
      ],
      [
        'Chores and jobs',
        w('家务 干活儿 打工 挣钱 日用品 结账'),
        [
          s(
            '周末我和妈妈一起做家务。',
            'zhōumò wǒ hé māma yìqǐ zuò jiāwù.',
            'At the weekend Mum and I do the housework together.',
          ),
          s(
            '放暑假的时候我去打工。',
            'fàng shǔjià de shíhou wǒ qù dǎgōng.',
            'In the summer holidays I work a part-time job.',
          ),
          s('服务员，结账！', 'fúwùyuán, jiézhàng!', 'Could we have the bill, please!'),
        ],
      ],
      [
        'Pets',
        w('宠物 老鼠 兔子 大象 鸽子 蝴蝶'),
        [
          s('我家的宠物是一只兔子。', 'wǒ jiā de chǒngwù shì yì zhī tùzi.', 'Our pet is a rabbit.'),
          s('猫在找老鼠。', 'māo zài zhǎo lǎoshǔ.', 'The cat is looking for mice.'),
        ],
      ],
      [
        'Wings and tails',
        w('蜜蜂 翅膀 尾巴 竹子 彩虹 闪电'),
        [
          s('熊猫喜欢吃竹子。', 'xióngmāo xǐhuan chī zhúzi.', 'Pandas love eating bamboo.'),
          s('你看，有彩虹！', 'nǐ kàn, yǒu cǎihóng!', "Look, there's a rainbow!"),
          s('狗在摇尾巴。', 'gǒu zài yáo wěiba.', 'The dog is wagging its tail.'),
        ],
      ],
    ],
    'relationships',
  ),
  unit(
    24,
    'The natural world',
    'Bad weather, land and water, sights, materials and farming.',
    [
      [
        'Bad weather',
        w('雾 地震 灾害 预报 着凉 发抖'),
        [
          s(
            '天气预报说，明天有雾。',
            'tiānqì yùbào shuō, míngtiān yǒu wù.',
            "The forecast says it'll be foggy tomorrow.",
          ),
          s(
            '多穿点衣服，别着凉了。',
            'duō chuān diǎn yīfu, bié zháoliáng le.',
            "Wrap up warm so you don't catch a cold.",
          ),
          s('他冷得发抖。', 'tā lěng de fādǒu.', "He's shivering with cold."),
        ],
      ],
      [
        'Land and water',
        w('沙漠 沙滩 岸 陆地 田野 池子'),
        [
          s(
            '我们在沙滩上玩了一下午。',
            'wǒmen zài shātān shàng wán le yí xiàwǔ.',
            'We spent the whole afternoon on the beach.',
          ),
          s(
            '河的两岸有很多树。',
            'hé de liǎng àn yǒu hěn duō shù.',
            'There are lots of trees on both banks of the river.',
          ),
        ],
      ],
      [
        'Sights',
        w('名胜 寺庙 胡同 博物馆 景色 雄伟'),
        [
          s(
            '北京的胡同很有意思。',
            'Běijīng de hútòng hěn yǒu yìsi.',
            "Beijing's alleyways are fascinating.",
          ),
          s('我们去参观博物馆吧。', 'wǒmen qù cānguān bówùguǎn ba.', "Let's visit the museum."),
          s('长城非常雄伟。', 'Chángchéng fēicháng xióngwěi.', 'The Great Wall is magnificent.'),
        ],
      ],
      [
        'Materials',
        w('钢铁 煤炭 铜 汽油 液体 固体'),
        [
          s(
            '汽油越来越贵了。',
            'qìyóu yuè lái yuè guì le.',
            'Petrol is getting more and more expensive.',
          ),
          s('水是一种液体。', 'shuǐ shì yì zhǒng yètǐ.', 'Water is a liquid.'),
        ],
      ],
      [
        'Farming',
        w('农业 品种 融化 燃烧 振动 结实'),
        [
          s('雪融化了。', 'xuě rónghuà le.', 'The snow has melted.'),
          s('这个桌子很结实。', 'zhège zhuōzi hěn jiēshi.', 'This table is sturdy.'),
          s(
            '这个地区主要发展农业。',
            'zhège dìqū zhǔyào fāzhǎn nóngyè.',
            'This area mainly develops farming.',
          ),
        ],
      ],
    ],
    'weather',
  ),
  unit(
    25,
    'Travel',
    'Vehicles, trips, and paperwork.',
    [
      [
        'Vehicles',
        w('摩托车 卡车 车厢 救护车 行人 拐弯 拥挤'),
        [
          s('快叫救护车！', 'kuài jiào jiùhùchē!', 'Call an ambulance, quick!'),
          s('地铁里很拥挤。', 'dìtiě lǐ hěn yōngjǐ.', 'The subway is packed.'),
          s(
            '到了前面的路口再拐弯。',
            'dào le qiánmiàn de lùkǒu zài guǎiwān.',
            'Turn at the junction ahead.',
          ),
        ],
      ],
      [
        'Trips',
        w('游览 往返 长途 划船 合影 明信片'),
        [
          s(
            '我们在长城前面合影。',
            'wǒmen zài Chángchéng qiánmiàn héyǐng.',
            'We had a group photo taken in front of the Great Wall.',
          ),
          s(
            '我给朋友寄了一张明信片。',
            'wǒ gěi péngyou jì le yì zhāng míngxìnpiàn.',
            'I sent my friend a postcard.',
          ),
          s(
            '往返的飞机票多少钱？',
            'wǎngfǎn de fēijī piào duōshao qián?',
            'How much is a return plane ticket?',
          ),
        ],
      ],
      [
        'Paperwork',
        w('海关 证件 国籍 手续 签字 办理'),
        [
          s('请在这里签字。', 'qǐng zài zhèlǐ qiānzì.', 'Please sign here.'),
          s(
            '办理签证需要什么手续？',
            'bànlǐ qiānzhèng xūyào shénme shǒuxù?',
            "What's the procedure for getting a visa?",
          ),
          s(
            '请给我看一下你的证件。',
            'qǐng gěi wǒ kàn yíxià nǐ de zhèngjiàn.',
            'Please show me your ID.',
          ),
        ],
      ],
    ],
    'travel-hotel',
  ),
  unit(
    26,
    'School',
    'School life, essays, exams, subjects, words and measuring.',
    [
      [
        'At school',
        w('幼儿园 操场 班主任 教材 试卷 测验'),
        [
          s('我儿子在上幼儿园。', "wǒ érzi zài shàng yòu'éryuán.", 'My son goes to kindergarten.'),
          s(
            '下课以后，我们去操场打篮球。',
            'xià kè yǐhòu, wǒmen qù cāochǎng dǎ lánqiú.',
            'After class we play basketball on the sports field.',
          ),
          s(
            '明天有一个小测验。',
            'míngtiān yǒu yí gè xiǎo cèyàn.',
            "There's a little quiz tomorrow.",
          ),
        ],
      ],
      [
        'Essays',
        w('作文 论文 题目 本科 初级 讲座'),
        [
          s(
            '这篇作文的题目是什么？',
            'zhè piān zuòwén de tímù shì shénme?',
            "What's the title of this essay?",
          ),
          s('我正在写毕业论文。', 'wǒ zhèngzài xiě bìyè lùnwén.', "I'm writing my dissertation."),
        ],
      ],
      [
        'Exams',
        w('及格 录取 改正 抄 提问 学术 丙'),
        [
          s('我的考试及格了！', 'wǒ de kǎoshì jígé le!', 'I passed my exam!'),
          s(
            '他被北京的一所学校录取了。',
            'tā bèi Běijīng de yì suǒ xuéxiào lùqǔ le.',
            'He got into a school in Beijing.',
          ),
          s('别抄别人的作业。', 'bié chāo biérén de zuòyè.', "Don't copy other people's homework."),
        ],
      ],
      [
        'Subjects',
        w('常识 学问 文学 哲学 物理 地理'),
        [
          s(
            '我对中国文学很感兴趣。',
            'wǒ duì Zhōngguó wénxué hěn gǎn xìngqù.',
            "I'm very interested in Chinese literature.",
          ),
          s(
            '他是一个很有学问的人。',
            'tā shì yí gè hěn yǒu xuéwen de rén.',
            "He's a very learned man.",
          ),
        ],
      ],
      [
        'Words',
        w('成语 谜语 声调 语气 称呼 省略'),
        [
          s('汉语有四个声调。', 'Hànyǔ yǒu sì gè shēngdiào.', 'Mandarin has four tones.'),
          s('我应该怎么称呼您？', 'wǒ yīnggāi zěnme chēnghu nín?', 'How should I address you?'),
          s(
            '他说话的语气很不友好。',
            'tā shuōhuà de yǔqì hěn bù yǒuhǎo.',
            'His tone of voice was very unfriendly.',
          ),
        ],
      ],
      [
        'Measuring',
        w('比例 平方 立方 厘米 吨 重量 乙'),
        [
          s(
            '我的房间有二十平方米。',
            'wǒ de fángjiān yǒu èrshí píngfāngmǐ.',
            'My room is twenty square metres.',
          ),
          s(
            '这张桌子长一百二十厘米。',
            'zhè zhāng zhuōzi cháng yìbǎi èrshí límǐ.',
            'This table is 120 centimetres long.',
          ),
        ],
      ],
    ],
    'school-classroom',
  ),
  unit(
    27,
    'Work and money',
    'Jobs, employment, trade, paying and spending.',
    [
      [
        'Jobs',
        w('秘书 会计 工程师 总裁 总理 解说员'),
        [
          s('我妈妈是会计。', 'wǒ māma shì kuàijì.', 'My mum is an accountant.'),
          s('他想当工程师。', 'tā xiǎng dāng gōngchéngshī.', 'He wants to be an engineer.'),
        ],
      ],
      [
        'Employment',
        w('人事 待遇 执照 失业 雇佣 简历'),
        [
          s('这家公司的待遇很好。', 'zhè jiā gōngsī de dàiyù hěn hǎo.', 'This company pays well.'),
          s('请把你的简历发给我。', 'qǐng bǎ nǐ de jiǎnlì fā gěi wǒ.', 'Please send me your CV.'),
          s('他失业了三个月。', 'tā shīyè le sān gè yuè.', 'He was out of work for three months.'),
        ],
      ],
      [
        'Trade',
        w('贸易 进口 营业 破产 利息 汇率'),
        [
          s(
            '这家商店早上九点开始营业。',
            'zhè jiā shāngdiàn zǎoshang jiǔ diǎn kāishǐ yíngyè.',
            'This shop opens at nine in the morning.',
          ),
          s('那家公司破产了。', 'nà jiā gōngsī pòchǎn le.', 'That company went bankrupt.'),
          s('今天的汇率是多少？', 'jīntiān de huìlǜ shì duōshao?', "What's today's exchange rate?"),
        ],
      ],
      [
        'Paying',
        w('支票 硬币 发票 收据 罚款 优惠'),
        [
          s('请给我开一张发票。', 'qǐng gěi wǒ kāi yì zhāng fāpiào.', 'Please give me a receipt.'),
          s(
            '在这里抽烟会被罚款。',
            'zài zhèlǐ chōuyān huì bèi fákuǎn.',
            "You'll be fined for smoking here.",
          ),
          s(
            '学生买票有优惠。',
            'xuésheng mǎi piào yǒu yōuhuì.',
            'Students get a discount on tickets.',
          ),
        ],
      ],
      [
        'Spending',
        w('消费 节省 预订 零件 原料 用途'),
        [
          s('我已经预订了宾馆。', 'wǒ yǐjīng yùdìng le bīnguǎn.', "I've already booked a hotel."),
          s(
            '坐地铁可以节省时间。',
            'zuò dìtiě kěyǐ jiéshěng shíjiān.',
            'Taking the subway saves time.',
          ),
        ],
      ],
    ],
    'business-work',
  ),
  unit(
    28,
    'Health',
    'At the clinic, and aches and itches.',
    [
      [
        'At the clinic',
        w('过敏 传染 失眠 打喷嚏 内科 挂号'),
        [
          s('我对花生过敏。', 'wǒ duì huāshēng guòmǐn.', "I'm allergic to peanuts."),
          s('感冒会传染。', 'gǎnmào huì chuánrǎn.', 'Colds are catching.'),
          s(
            '我最近经常失眠。',
            'wǒ zuìjìn jīngcháng shīmián.',
            "I've been having trouble sleeping lately.",
          ),
        ],
      ],
      [
        'Aches and itches',
        w('痒 疲劳 烫 寿命 戒烟 健身房'),
        [
          s('小心，汤很烫。', 'xiǎoxīn, tāng hěn tàng.', "Careful, the soup's very hot."),
          s('我爸爸戒烟了。', 'wǒ bàba jièyān le.', 'My dad has given up smoking.'),
          s(
            '我每个星期去三次健身房。',
            'wǒ měi gè xīngqī qù sān cì jiànshēnfáng.',
            'I go to the gym three times a week.',
          ),
        ],
      ],
    ],
    'at-the-doctor',
  ),
  unit(
    29,
    'Sport and leisure',
    'Sports, free time and festivals.',
    [
      [
        'Sports',
        w('球迷 排球 滑冰 射击 武术 太极拳'),
        [
          s('我爷爷会太极拳。', 'wǒ yéye huì tàijíquán.', 'My grandpa does tai chi.'),
          s('我是一个球迷。', 'wǒ shì yí gè qiúmí.', "I'm a big football fan."),
          s('你会滑冰吗？', 'nǐ huì huábīng ma?', 'Can you ice-skate?'),
        ],
      ],
      [
        'Free time',
        w('休闲 业余 象棋 动画片 连续剧 展览'),
        [
          s(
            '业余时间你喜欢做什么？',
            'yèyú shíjiān nǐ xǐhuan zuò shénme?',
            'What do you like doing in your spare time?',
          ),
          s(
            '我爷爷喜欢下象棋。',
            'wǒ yéye xǐhuan xià xiàngqí.',
            'My grandpa likes playing Chinese chess.',
          ),
          s(
            '我妈妈很喜欢看连续剧。',
            'wǒ māma hěn xǐhuan kàn liánxùjù.',
            'My mum loves watching TV dramas.',
          ),
        ],
      ],
      [
        'Festivals',
        w('除夕 元旦 国庆节 鞭炮 开幕式 宴会'),
        [
          s(
            '除夕晚上我们一起吃饺子。',
            'chúxī wǎnshang wǒmen yìqǐ chī jiǎozi.',
            "On New Year's Eve we eat dumplings together.",
          ),
          s(
            '国庆节的时候，很多人去旅游。',
            'guóqìngjié de shíhou, hěn duō rén qù lǚyóu.',
            'Lots of people go travelling over National Day.',
          ),
        ],
      ],
    ],
    'chinese-festivals',
  ),
  unit(30, 'Actions', 'Hands, bending, water, people, and giving.', [
    [
      'Hands',
      w('挥 捡 扶 伸 撕 递'),
      [
        s('请把盐递给我。', 'qǐng bǎ yán dì gěi wǒ.', 'Please pass me the salt.'),
        s(
          '他在地上捡到了一个钱包。',
          'tā zài dì shàng jiǎn dào le yí gè qiánbāo.',
          'He picked up a wallet off the ground.',
        ),
        s('我扶奶奶过马路。', 'wǒ fú nǎinai guò mǎlù.', 'I helped Grandma across the road.'),
      ],
    ],
    [
      'Bending',
      w('飘 闯 弯 斜 歪 横'),
      [
        s('你的帽子戴歪了。', 'nǐ de màozi dài wāi le.', 'Your hat is on crooked.'),
        s('这条路很弯。', 'zhè tiáo lù hěn wān.', 'This road is very winding.'),
      ],
    ],
    [
      'Water',
      w('漏 洒 浇 钓 睁 披'),
      [
        s('我在给花浇水。', 'wǒ zài gěi huā jiāo shuǐ.', "I'm watering the flowers."),
        s(
          '周末我和爸爸去钓鱼。',
          'zhōumò wǒ hé bàba qù diào yú.',
          'At the weekend Dad and I go fishing.',
        ),
        s('请睁开眼睛。', 'qǐng zhēng kāi yǎnjing.', 'Please open your eyes.'),
      ],
    ],
    [
      'People',
      w('催 拦 逗 夸 嚷 歇'),
      [
        s(
          '别催我，我马上就好。',
          'bié cuī wǒ, wǒ mǎshàng jiù hǎo.',
          "Don't rush me, I'm nearly ready.",
        ),
        s('累了就歇一会儿吧。', 'lèi le jiù xiē yíhuìr ba.', "If you're tired, take a break."),
        s(
          '老师夸我作文写得好。',
          'lǎoshī kuā wǒ zuòwén xiě de hǎo.',
          'The teacher praised my essay.',
        ),
      ],
    ],
    [
      'Giving',
      w('捐 赔偿 摘 趁 涨 粒'),
      [
        s(
          '他给学校捐了很多书。',
          'tā gěi xuéxiào juān le hěn duō shū.',
          'He donated lots of books to the school.',
        ),
        s(
          '趁天气好，我们去公园吧。',
          'chèn tiānqì hǎo, wǒmen qù gōngyuán ba.',
          "Let's go to the park while the weather's nice.",
        ),
        s(
          '汽油的价格又涨了。',
          'qìyóu de jiàgé yòu zhǎng le.',
          'Petrol prices have gone up again.',
        ),
      ],
    ],
  ]),
  unit(31, 'Character', 'Good sorts and bad, modesty, unease, pride, caring and respect.', [
    [
      'Good sorts',
      w('乐观 善良 热心 勤奋 勤劳 刻苦'),
      [
        s('他很乐观。', 'tā hěn lèguān.', "He's an optimist."),
        s(
          '她是一个善良的姑娘。',
          'tā shì yí gè shànliáng de gūniang.',
          "She's a kind-hearted girl.",
        ),
        s('他学习非常刻苦。', 'tā xuéxí fēicháng kèkǔ.', 'He studies very hard.'),
      ],
    ],
    [
      'Not so good',
      w('悲观 自私 小气 狡猾 糊涂 胆小鬼'),
      [
        s('别太悲观了。', 'bié tài bēiguān le.', "Don't be so pessimistic."),
        s('他太小气了。', 'tā tài xiǎoqi le.', "He's so stingy."),
        s(
          '我真糊涂，又忘记带钥匙了。',
          'wǒ zhēn hútu, yòu wàngjì dài yàoshi le.',
          "I'm so scatterbrained, I forgot my keys again.",
        ),
      ],
    ],
    [
      'Modest',
      w('谦虚 虚心 老实 诚恳 坦率 大方'),
      [
        s('他很谦虚。', 'tā hěn qiānxū.', "He's very modest."),
        s(
          '老实说，我不喜欢这个电影。',
          'lǎoshi shuō, wǒ bù xǐhuan zhège diànyǐng.',
          "To be honest, I don't like this film.",
        ),
        s(
          '她很大方，经常请客。',
          'tā hěn dàfang, jīngcháng qǐngkè.',
          "She's generous and often treats people.",
        ),
      ],
    ],
    [
      'Uneasy',
      w('不安 慌张 惭愧 委屈 灰心 发愁'),
      [
        s('别灰心，再试一次。', 'bié huīxīn, zài shì yí cì.', "Don't lose heart. Try again."),
        s('他为工作发愁。', 'tā wèi gōngzuò fāchóu.', "He's worried about work."),
        s('她觉得很委屈，哭了。', 'tā juéde hěn wěiqu, kū le.', 'She felt hard done by and cried.'),
      ],
    ],
    [
      'Proud',
      w('自豪 荣幸 痛快 不耐烦 操心 舍不得'),
      [
        s('我为你自豪。', 'wǒ wèi nǐ zìháo.', "I'm proud of you."),
        s('我很荣幸认识您。', 'wǒ hěn róngxìng rènshi nín.', "It's an honour to meet you."),
        s('我舍不得离开这里。', 'wǒ shěbude líkāi zhèlǐ.', "I can't bear to leave this place."),
      ],
    ],
    [
      'Caring',
      w('爱心 爱护 爱惜 关怀 体贴 周到'),
      [
        s('我们要爱护动物。', 'wǒmen yào àihù dòngwù.', 'We should take care of animals.'),
        s('他对妻子很体贴。', 'tā duì qīzi hěn tǐtiē.', "He's very considerate towards his wife."),
        s(
          '这家宾馆的服务员很周到。',
          'zhè jiā bīnguǎn de fúwùyuán hěn zhōudào.',
          'The staff at this hotel are very attentive.',
        ),
      ],
    ],
    [
      'Respect',
      w('尊敬 敬爱 佩服 称赞 赞美 看不起'),
      [
        s('我很佩服他。', 'wǒ hěn pèifú tā.', 'I really admire him.'),
        s('别看不起别人。', 'bié kànbuqǐ biérén.', "Don't look down on other people."),
      ],
    ],
  ]),
  unit(32, 'Society', 'Emperors and dynasties, people, order, arguing and development.', [
    [
      'Emperors',
      w('统治 改革 外交 皇帝 皇后 朝代'),
      [
        s(
          '中国历史上有很多朝代。',
          'Zhōngguó lìshǐ shàng yǒu hěn duō cháodài.',
          'Chinese history has many dynasties.',
        ),
        s(
          '这个皇帝统治了五十年。',
          'zhège huángdì tǒngzhì le wǔshí nián.',
          'This emperor ruled for fifty years.',
        ),
      ],
    ],
    [
      'People',
      w('老百姓 青少年 移民 华裔 残疾 罪犯'),
      [
        s('他是一个华裔。', 'tā shì yí gè huáyì.', "He's of Chinese descent."),
        s(
          '他的家人移民到了中国。',
          'tā de jiārén yímín dào le Zhōngguó.',
          'His family emigrated to China.',
        ),
      ],
    ],
    [
      'Order',
      w('秩序 纪律 规矩 规律 服从 平等'),
      [
        s('男女平等。', 'nán nǚ píngděng.', 'Men and women are equal.'),
        s('请大家遵守秩序。', 'qǐng dàjiā zūnshǒu zhìxù.', 'Everyone please keep order.'),
        s('我的生活很有规律。', 'wǒ de shēnghuó hěn yǒu guīlǜ.', 'I live by a regular routine.'),
      ],
    ],
    [
      'Arguing',
      w('侵略 抗议 争论 辩论 吵架 讽刺'),
      [
        s(
          '我昨天和男朋友吵架了。',
          'wǒ zuótiān hé nánpéngyou chǎojià le.',
          'I had a row with my boyfriend yesterday.',
        ),
        s('他俩争论了很久。', 'tā liǎ zhēnglùn le hěn jiǔ.', 'The two of them argued for ages.'),
      ],
    ],
    [
      'Development',
      w('发达 繁荣 建设 促进 推广 实行'),
      [
        s('这个城市很发达。', 'zhège chéngshì hěn fādá.', 'This city is very developed.'),
        s(
          '交流可以促进了解。',
          'jiāoliú kěyǐ cùjìn liǎojiě.',
          'Talking helps people understand each other.',
        ),
      ],
    ],
  ]),
  unit(33, 'Ideas', 'Truth, views, describing, logic and comparing.', [
    [
      'The truth',
      w('真理 本质 性质 客观 主观 实话'),
      [
        s(
          '说实话，我不太喜欢。',
          'shuō shíhuà, wǒ bú tài xǐhuan.',
          "To tell the truth, I don't really like it.",
        ),
        s('你的看法太主观了。', 'nǐ de kànfǎ tài zhǔguān le.', 'Your view is too subjective.'),
      ],
    ],
    [
      'Views',
      w('观念 主张 赞成 否定 片面 抽象'),
      [
        s('我赞成你的意见。', 'wǒ zànchéng nǐ de yìjiàn.', 'I agree with you.'),
        s('这幅画太抽象了。', 'zhè fú huà tài chōuxiàng le.', 'This painting is too abstract.'),
      ],
    ],
    [
      'Describing',
      w('启发 体现 象征 概括 描写 叙述'),
      [
        s(
          '这本书给了我很大的启发。',
          'zhè běn shū gěi le wǒ hěn dà de qǐfā.',
          'This book really opened my eyes.',
        ),
        s(
          '熊猫是中国的象征。',
          'xióngmāo shì Zhōngguó de xiàngzhēng.',
          'The panda is a symbol of China.',
        ),
      ],
    ],
    [
      'Logic',
      w('逻辑 必然 偶然 可见 因而 从而'),
      [
        s('你的回答没有逻辑。', 'nǐ de huídá méiyǒu luóji.', "Your answer isn't logical."),
        s('我是偶然认识他的。', 'wǒ shì ǒurán rènshi tā de.', 'I met him by chance.'),
      ],
    ],
    [
      'Comparing',
      w('对比 相似 差别 形状 面积 体积'),
      [
        s(
          '这两个字很相似。',
          'zhè liǎng gè zì hěn xiāngsì.',
          'These two characters look very alike.',
        ),
        s(
          '这两个手机有什么差别？',
          'zhè liǎng gè shǒujī yǒu shénme chābié?',
          "What's the difference between these two phones?",
        ),
      ],
    ],
  ]),
  unit(34, 'Linking and emphasis', 'Rather than, luckily, hurriedly, especially, maybe.', [
    [
      'Rather than',
      w('与其 宁可 哪怕 何况 何必 未必'),
      [
        s(
          '与其在家等，不如去找他。',
          'yǔqí zài jiā děng, bùrú qù zhǎo tā.',
          'Rather than wait at home, we might as well go and find him.',
        ),
        s('哪怕下雨，我也要去。', 'nǎpà xià yǔ, wǒ yě yào qù.', "Even if it rains, I'm going."),
        s(
          '贵的东西未必好。',
          'guì de dōngxi wèibì hǎo.',
          "Expensive things aren't necessarily good.",
        ),
      ],
      'yuqi-buru',
    ],
    [
      'Luckily',
      w('幸亏 多亏 总算 难怪 怪不得 不免'),
      [
        s('幸亏你来了！', 'xìngkuī nǐ lái le!', 'Thank goodness you came!'),
        s('难怪他不高兴。', 'nánguài tā bù gāoxìng.', "No wonder he's unhappy."),
        s('我们总算到了。', 'wǒmen zǒngsuàn dào le.', "We've made it at last."),
      ],
      'napa-ye',
    ],
    [
      'Hurriedly',
      w('急忙 连忙 匆忙 悄悄 纷纷 陆续'),
      [
        s('他悄悄地走了。', 'tā qiāoqiāo de zǒu le.', 'He left quietly.'),
        s('客人陆续到了。', 'kèrén lùxù dào le.', 'The guests arrived one after another.'),
        s('他连忙说对不起。', 'tā liánmáng shuō duìbuqǐ.', 'He quickly apologised.'),
      ],
    ],
    [
      'Especially',
      w('格外 特意 丝毫 再三 逐步 照常'),
      [
        s(
          '今天的天气格外好。',
          'jīntiān de tiānqì géwài hǎo.',
          'The weather is especially nice today.',
        ),
        s(
          '这是我特意为你做的。',
          'zhè shì wǒ tèyì wèi nǐ zuò de.',
          'I made this specially for you.',
        ),
        s('明天照常上课。', 'míngtiān zhàocháng shàng kè.', 'Classes go ahead as usual tomorrow.'),
      ],
      'hekuang',
    ],
    [
      'Maybe',
      w('说不定 不见得 凡是 个别 其余 总共'),
      [
        s('说不定他已经走了。', 'shuōbudìng tā yǐjīng zǒu le.', 'He may have already left.'),
        s(
          '我们班总共有三十个学生。',
          'wǒmen bān zǒnggòng yǒu sānshí gè xuésheng.',
          'Our class has thirty students in all.',
        ),
        s(
          '凡是去过的人都说好。',
          'fánshì qù guo de rén dōu shuō hǎo.',
          'Everyone who has been says it is good.',
        ),
      ],
      'ningke-ye',
    ],
  ]),
  unit(35, 'Getting on with it', 'Time, effort, coping, improving, passing messages on, guests.', [
    [
      'Once upon a time',
      w('从此 从前 最初 事先 当代 近代'),
      [
        s(
          '从前这里没有地铁。',
          'cóngqián zhèlǐ méiyǒu dìtiě.',
          "There didn't use to be a subway here.",
        ),
        s(
          '你来以前，事先打电话告诉我。',
          'nǐ lái yǐqián, shìxiān dǎ diànhuà gàosu wǒ.',
          'Call me before you come.',
        ),
      ],
    ],
    [
      'Times of day',
      w('傍晚 中旬 日程 日常 空闲 古代 平常'),
      [
        s('我们傍晚去散步吧。', 'wǒmen bàngwǎn qù sànbù ba.', "Let's go for a walk this evening."),
        s('我平常六点起床。', 'wǒ píngcháng liù diǎn qǐchuáng.', 'I usually get up at six.'),
        s(
          '下个月中旬我要去出差。',
          'xià gè yuè zhōngxún wǒ yào qù chūchāi.',
          "I'm going on a business trip in the middle of next month.",
        ),
      ],
    ],
    [
      'Effort',
      w('奋斗 尽力 决心 坚决 企图 使劲儿'),
      [
        s('我会尽力的。', 'wǒ huì jìnlì de.', "I'll do my best."),
        s('他下决心减肥。', 'tā xià juéxīn jiǎnféi.', "He's made up his mind to lose weight."),
        s('再使劲儿推一下！', 'zài shǐjìnr tuī yíxià!', 'Push harder!'),
      ],
    ],
    [
      'Coping',
      w('应付 协调 耽误 妨碍 缓解 犹豫'),
      [
        s(
          '对不起，耽误你的时间了。',
          'duìbuqǐ, dānwu nǐ de shíjiān le.',
          'Sorry to take up your time.',
        ),
        s('别犹豫了，快决定吧。', 'bié yóuyù le, kuài juédìng ba.', 'Stop hesitating and decide.'),
        s('运动可以缓解压力。', 'yùndòng kěyǐ huǎnjiě yālì.', 'Exercise can relieve stress.'),
      ],
    ],
    [
      'Improving',
      w('改进 完善 补充 吸收 消灭 危害'),
      [
        s(
          '我们的产品还需要改进。',
          'wǒmen de chǎnpǐn hái xūyào gǎijìn.',
          'Our product still needs improving.',
        ),
        s('我补充一点。', 'wǒ bǔchōng yìdiǎn.', 'Let me add one thing.'),
        s('抽烟危害健康。', 'chōuyān wēihài jiànkāng.', 'Smoking harms your health.'),
      ],
    ],
    [
      'Longer and shorter',
      w('延长 缩短 缩小 构成 包含 综合'),
      [
        s(
          '会议延长了半个小时。',
          'huìyì yáncháng le bàn gè xiǎoshí.',
          'The meeting ran half an hour over.',
        ),
        s('坐飞机可以缩短时间。', 'zuò fēijī kěyǐ suōduǎn shíjiān.', 'Flying saves time.'),
      ],
    ],
    [
      'Passing it on',
      w('打听 转告 问候 嘱咐 征求 议论'),
      [
        s(
          '请转告他，我明天不来了。',
          'qǐng zhuǎngào tā, wǒ míngtiān bù lái le.',
          "Please tell him I won't be coming tomorrow.",
        ),
        s('我去打听一下。', 'wǒ qù dǎting yíxià.', "I'll go and ask around."),
        s(
          '妈妈嘱咐我路上小心。',
          'māma zhǔfù wǒ lù shàng xiǎoxīn.',
          'Mum told me to be careful on the way.',
        ),
      ],
    ],
    [
      'Guests',
      w('接待 招待 迎接 嘉宾 光临 劳驾'),
      [
        s('欢迎光临！', 'huānyíng guānglín!', 'Welcome!'),
        s('劳驾，请让一下。', 'láojià, qǐng ràng yíxià.', 'Excuse me, could I get past?'),
        s(
          '我们去机场迎接客人。',
          'wǒmen qù jīchǎng yíngjiē kèrén.',
          "We're going to the airport to meet our guests.",
        ),
      ],
    ],
    [
      'Dealing with people',
      w('辅导 说服 推辞 打交道 交际 碰见'),
      [
        s(
          '我在超市碰见了老师。',
          'wǒ zài chāoshì pèngjiàn le lǎoshī.',
          'I ran into my teacher at the supermarket.',
        ),
        s('我说服了他。', 'wǒ shuōfú le tā.', 'I talked him round.'),
        s(
          '他很会和别人打交道。',
          'tā hěn huì hé biérén dǎ jiāodao.',
          "He's good at dealing with people.",
        ),
      ],
    ],
  ]),
  unit(36, 'Culture and heritage', 'Ancient times, home, and the arts.', [
    [
      'Ancient times',
      w('古老 古典 悠久 公元 神话 流传'),
      [
        s('中国有悠久的历史。', 'Zhōngguó yǒu yōujiǔ de lìshǐ.', 'China has a long history.'),
        s(
          '这个故事流传了一千多年。',
          'zhège gùshi liúchuán le yìqiān duō nián.',
          'This story has been handed down for over a thousand years.',
        ),
        s(
          '我喜欢听古典音乐。',
          'wǒ xǐhuan tīng gǔdiǎn yīnyuè.',
          'I like listening to classical music.',
        ),
      ],
    ],
    [
      'Home',
      w('家乡 祖国 风俗 青春 前途 光明'),
      [
        s(
          '每个地方都有自己的风俗。',
          'měi gè dìfang dōu yǒu zìjǐ de fēngsú.',
          'Every place has its own customs.',
        ),
        s(
          '年轻人的前途很光明。',
          'niánqīng rén de qiántú hěn guāngmíng.',
          'Young people have a bright future.',
        ),
      ],
    ],
    [
      'Arts and crafts',
      w('美术 戏剧 手工 生动 优美 情景'),
      [
        s('他讲的故事很生动。', 'tā jiǎng de gùshi hěn shēngdòng.', 'He tells stories vividly.'),
        s(
          '这里的风景非常优美。',
          'zhèlǐ de fēngjǐng fēicháng yōuměi.',
          'The scenery here is beautiful.',
        ),
      ],
    ],
  ]),
  unit(37, 'Qualities', 'Skilful, smooth, grand, useful, simple and close.', [
    [
      'Skilful',
      w('巧妙 灵活 能干 熟练 了不起 突出 本领'),
      [
        s('他很能干。', 'tā hěn nénggàn.', "He's very capable."),
        s('你真了不起！', 'nǐ zhēn liǎobuqǐ!', "You're amazing!"),
        s('他用电脑很熟练。', 'tā yòng diànnǎo hěn shúliàn.', "He's very good with computers."),
      ],
    ],
    [
      'Surfaces',
      w('光滑 均匀 透明 尖锐 模糊 浅'),
      [
        s('这里的水很浅。', 'zhèlǐ de shuǐ hěn qiǎn.', 'The water here is shallow.'),
        s('照片有点模糊。', 'zhàopiàn yǒudiǎn móhu.', 'The photo is a bit blurry.'),
      ],
    ],
    [
      'Grand',
      w('紫 光荣 广大 广泛 高档 舒适'),
      [
        s('这个沙发很舒适。', 'zhège shāfā hěn shūshì.', 'This sofa is comfortable.'),
        s('她的衣服是紫的。', 'tā de yīfu shì zǐ de.', 'Her clothes are purple.'),
      ],
    ],
    [
      'Useful',
      w('实用 可靠 有利 宝贵 必需 次要'),
      [
        s('这个东西很实用。', 'zhège dōngxi hěn shíyòng.', 'This thing is very handy.'),
        s(
          '谢谢你的宝贵意见。',
          'xièxie nǐ de bǎoguì yìjiàn.',
          'Thank you for your valuable advice.',
        ),
        s('他是一个可靠的人。', 'tā shì yí gè kěkào de rén.', "He's someone you can rely on."),
      ],
    ],
    [
      'Simple',
      w('单纯 干脆 地道 仿佛 形容 整体'),
      [
        s(
          '这家饭馆的菜很地道。',
          'zhè jiā fànguǎn de cài hěn dìdao.',
          'The food at this restaurant is authentic.',
        ),
        s('我不知道怎么形容。', 'wǒ bù zhīdào zěnme xíngróng.', "I don't know how to describe it."),
        s('他很单纯。', 'tā hěn dānchún.', "He's very innocent."),
      ],
    ],
    [
      'Close',
      w('密切 多余 成分 传递 具备 姿势'),
      [
        s('我们的关系很密切。', 'wǒmen de guānxi hěn mìqiè.', "We're very close."),
        s('你的担心是多余的。', 'nǐ de dānxīn shì duōyú de.', "There's no need for you to worry."),
      ],
    ],
  ]),
  unit(38, 'Attitudes', 'Hard work, enthusiasm, care, pretending, bad luck and reactions.', [
    [
      'Hard work',
      w('劳动 艰苦 艰巨 实践 实习 克服'),
      [
        s(
          '我们一定能克服困难。',
          'wǒmen yídìng néng kèfú kùnnan.',
          'We can definitely overcome the difficulties.',
        ),
        s(
          '我在一家公司实习。',
          'wǒ zài yì jiā gōngsī shíxí.',
          "I'm doing an internship at a company.",
        ),
      ],
    ],
    [
      'Enthusiasm',
      w('热爱 热烈 活跃 亲切 盼望 迫切'),
      [
        s('我热爱我的工作。', "wǒ rè'ài wǒ de gōngzuò.", 'I love my job.'),
        s('大家热烈欢迎他。', 'dàjiā rèliè huānyíng tā.', 'Everyone gave him a warm welcome.'),
        s(
          '孩子盼望着放假。',
          'háizi pànwàng zhe fàngjià.',
          'The kids are longing for the holidays.',
        ),
      ],
    ],
    [
      'Carefully',
      w('谨慎 讲究 专心 自觉 自愿 善于'),
      [
        s('上课的时候要专心。', 'shàng kè de shíhou yào zhuānxīn.', 'Pay attention in class.'),
        s('他很善于交流。', 'tā hěn shànyú jiāoliú.', "He's a good communicator."),
        s('投资要谨慎。', 'tóuzī yào jǐnshèn.', 'Be careful with investments.'),
      ],
    ],
    [
      'Pretending',
      w('假装 模仿 借口 逃避 躲藏 胡说'),
      [
        s('他假装没看见我。', 'tā jiǎzhuāng méi kànjiàn wǒ.', "He pretended he hadn't seen me."),
        s('别找借口了。', 'bié zhǎo jièkǒu le.', 'Stop making excuses.'),
        s('你胡说！', 'nǐ húshuō!', 'Nonsense!'),
      ],
    ],
    [
      'Bad luck',
      w('倒霉 吃亏 上当 毛病 废话 不得了'),
      [
        s(
          '今天真倒霉，手机丢了。',
          'jīntiān zhēn dǎoméi, shǒujī diū le.',
          'What a rotten day: I lost my phone.',
        ),
        s('小心，别上当。', 'xiǎoxīn, bié shàngdàng.', 'Be careful not to get taken in.'),
        s(
          '我的电脑出毛病了。',
          'wǒ de diànnǎo chū máobìng le.',
          "Something's wrong with my computer.",
        ),
      ],
    ],
    [
      "Can't help it",
      w('无奈 忍不住 不要紧 恶劣 陌生 单调'),
      [
        s('不要紧，下次再来。', 'bú yàojǐn, xià cì zài lái.', 'Never mind, come again next time.'),
        s('我忍不住笑了。', 'wǒ rěnbuzhù xiào le.', "I couldn't help laughing."),
        s(
          '这个城市对我来说很陌生。',
          'zhège chéngshì duì wǒ lái shuō hěn mòshēng.',
          'This city is new to me.',
        ),
      ],
    ],
    [
      'Reactions',
      w('感想 鼓舞 责备 轻视 忽视 调皮'),
      [
        s('这个孩子很调皮。', 'zhège háizi hěn tiáopí.', 'This child is very naughty.'),
        s('别忽视这个问题。', 'bié hūshì zhège wèntí.', "Don't ignore this problem."),
        s(
          '看了这个电影，你有什么感想？',
          'kàn le zhège diànyǐng, nǐ yǒu shénme gǎnxiǎng?',
          'What did you think of the film?',
        ),
      ],
    ],
  ]),
  unit(39, 'How things happen', 'Steps, causes, taking the floor, and waiting.', [
    [
      'Steps',
      w('步骤 参考 提倡 预防 应用 效率'),
      [
        s(
          '我们要提高工作效率。',
          'wǒmen yào tígāo gōngzuò xiàolǜ.',
          'We need to work more efficiently.',
        ),
        s(
          '这本书可以作为参考。',
          'zhè běn shū kěyǐ zuòwéi cānkǎo.',
          'This book can serve as a reference.',
        ),
        s('预防感冒要多运动。', 'yùfáng gǎnmào yào duō yùndòng.', 'To avoid colds, exercise more.'),
      ],
    ],
    [
      'Causes',
      w('促使 缘故 趋势 规模 分布 围绕'),
      [
        s('这家公司的规模很大。', 'zhè jiā gōngsī de guīmó hěn dà.', 'This company is very large.'),
        s(
          '因为下雨的缘故，比赛取消了。',
          'yīnwèi xià yǔ de yuángù, bǐsài qǔxiāo le.',
          'The match was cancelled because of the rain.',
        ),
      ],
    ],
    [
      'Taking the floor',
      w('发明 召开 担任 发言 告别 点头'),
      [
        s('谁发明了电脑？', 'shéi fāmíng le diànnǎo?', 'Who invented the computer?'),
        s('他点头同意了。', 'tā diǎntóu tóngyì le.', 'He nodded in agreement.'),
        s('明天召开会议。', 'míngtiān zhàokāi huìyì.', "There's a meeting tomorrow."),
      ],
    ],
    [
      'Waiting',
      w('等候 轮流 反复 过期 退步 疑问'),
      [
        s('这个牛奶过期了。', 'zhège niúnǎi guòqī le.', 'This milk is past its date.'),
        s('我们轮流打扫房间。', 'wǒmen lúnliú dǎsǎo fángjiān.', 'We take turns cleaning the room.'),
        s(
          '有疑问请随时问我。',
          'yǒu yíwèn qǐng suíshí wèn wǒ.',
          'Ask me any time if you have questions.',
        ),
      ],
    ],
  ]),
];
