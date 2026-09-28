import type { PathSentence, Unit } from './types';

const s = (hanzi: string, pinyin: string, meaning: string): PathSentence => ({
  hanzi,
  pinyin,
  meaning,
});

// HSK 4 (2012): all 588 new words in 98 lessons, building on HSK 1–3.
export const hsk4Units: Unit[] = [
  {
    id: 'h4-u1',
    hskLevel: 4,
    title: 'Who people are',
    description: 'Personality, looks, family and the stages of a life.',
    scenario: 'relationships',
    lessons: [
      {
        id: 'h4-u1-l1',
        title: 'Personality',
        words: ['性格', '脾气', '活泼', '幽默', '害羞', '诚实'],
        sentences: [
          s('她的性格很活泼。', 'tā de xìnggé hěn huópō.', 'She has a lively personality.'),
          s(
            '我爸爸脾气很好，也很幽默。',
            'wǒ bàba píqi hěn hǎo, yě hěn yōumò.',
            'My dad is good-tempered and funny.',
          ),
          s('这个孩子很害羞。', 'zhège háizi hěn hàixiū.', 'This child is very shy.'),
        ],
      },
      {
        id: 'h4-u1-l2',
        title: 'Good and bad points',
        words: ['优点', '缺点', '懒', '笨', '粗心', '马虎'],
        sentences: [
          s(
            '每个人都有优点和缺点。',
            'měi gè rén dōu yǒu yōudiǎn hé quēdiǎn.',
            'Everyone has strengths and weaknesses.',
          ),
          s(
            '他不笨，只是太懒了。',
            'tā bú bèn, zhǐshì tài lǎn le.',
            "He isn't stupid, just too lazy.",
          ),
          s('考试的时候别马虎。', 'kǎoshì de shíhou bié mǎhu.', "Don't be careless in exams."),
        ],
      },
      {
        id: 'h4-u1-l3',
        title: 'How people behave',
        words: ['态度', '耐心', '礼貌', '友好', '勇敢', '自信'],
        sentences: [
          s(
            '老师对我们很有耐心。',
            'lǎoshī duì wǒmen hěn yǒu nàixīn.',
            'The teacher is very patient with us.',
          ),
          s('他的态度很友好。', 'tā de tàidu hěn yǒuhǎo.', 'He has a friendly attitude.'),
          s('说话要有礼貌。', 'shuōhuà yào yǒu lǐmào.', 'You should speak politely.'),
        ],
      },
      {
        id: 'h4-u1-l4',
        title: 'How people look',
        words: ['样子', '帅', '美丽', '皮肤', '眼镜', '戴'],
        sentences: [
          s(
            '他戴着眼镜，样子很帅。',
            'tā dài zhe yǎnjìng, yàngzi hěn shuài.',
            'He wears glasses and looks handsome.',
          ),
          s('她的皮肤很白。', 'tā de pífū hěn bái.', 'Her skin is very fair.'),
        ],
      },
      {
        id: 'h4-u1-l5',
        title: 'Family',
        words: ['父亲', '母亲', '亲戚', '孙子', '年龄', '性别'],
        sentences: [
          s(
            '我父亲和母亲都是医生。',
            'wǒ fùqīn hé mǔqīn dōu shì yīshēng.',
            'My father and mother are both doctors.',
          ),
          s(
            '周末很多亲戚来我家。',
            'zhōumò hěn duō qīnqi lái wǒ jiā.',
            'Lots of relatives came to our house at the weekend.',
          ),
          s(
            '奶奶很喜欢她的孙子。',
            'nǎinai hěn xǐhuan tā de sūnzi.',
            'Grandma adores her grandson.',
          ),
        ],
      },
      {
        id: 'h4-u1-l6',
        title: 'A whole life',
        words: ['出生', '儿童', '小伙子', '生命', '生活', '死'],
        sentences: [
          s('我是在北京出生的。', 'wǒ shì zài Běijīng chūshēng de.', 'I was born in Beijing.'),
          s('这个小伙子很努力。', 'zhège xiǎohuǒzi hěn nǔlì.', 'This young man works hard.'),
          s(
            '我很喜欢现在的生活。',
            'wǒ hěn xǐhuan xiànzài de shēnghuó.',
            'I really like my life now.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u2',
    hskLevel: 4,
    title: 'Feelings',
    description: 'Happy, sad, nervous, envious, in love.',
    scenario: 'small-talk',
    lessons: [
      {
        id: 'h4-u2-l1',
        title: 'Happy',
        words: ['开心', '愉快', '幸福', '兴奋', '激动', '得意'],
        sentences: [
          s('我们玩得很开心。', 'wǒmen wán de hěn kāixīn.', 'We had a great time.'),
          s(
            '我哥哥结婚了，生活很幸福。',
            'wǒ gēge jiéhūn le, shēnghuó hěn xìngfú.',
            'My older brother got married and is very happy.',
          ),
          s(
            '明天去旅游，孩子非常兴奋。',
            'míngtiān qù lǚyóu, háizi fēicháng xīngfèn.',
            'The kids are really excited about the trip tomorrow.',
          ),
        ],
      },
      {
        id: 'h4-u2-l2',
        title: 'Sad and lonely',
        words: ['伤心', '难受', '烦恼', '失望', '孤单', '可怜'],
        sentences: [
          s(
            '他一个人住，有时候很孤单。',
            'tā yí gè rén zhù, yǒu shíhou hěn gūdān.',
            'He lives alone and is sometimes lonely.',
          ),
          s(
            '考试成绩不好，他很失望。',
            'kǎoshì chéngjì bù hǎo, tā hěn shīwàng.',
            'His exam results were poor, and he was disappointed.',
          ),
          s('别伤心了。', 'bié shāngxīn le.', "Don't be sad."),
        ],
      },
      {
        id: 'h4-u2-l3',
        title: 'Calm or nervous',
        words: ['吃惊', '紧张', '冷静', '放松', '轻松', '心情'],
        sentences: [
          s(
            '考试以前我总是很紧张。',
            'kǎoshì yǐqián wǒ zǒngshì hěn jǐnzhāng.',
            "I'm always nervous before exams.",
          ),
          s('别着急，你要冷静。', 'bié zháojí, nǐ yào lěngjìng.', "Don't panic. Stay calm."),
          s(
            '周末我想在家放松。',
            'zhōumò wǒ xiǎng zài jiā fàngsōng.',
            'At the weekend I want to relax at home.',
          ),
        ],
      },
      {
        id: 'h4-u2-l4',
        title: 'Strong feelings',
        words: ['羡慕', '讨厌', '受不了', '后悔', '同情', '感动'],
        sentences: [
          s('我很羡慕你。', 'wǒ hěn xiànmù nǐ.', 'I really envy you.'),
          s(
            '这里太热了，我真受不了。',
            'zhèlǐ tài rè le, wǒ zhēn shòubuliǎo.',
            "It's too hot here. I can't stand it.",
          ),
          s('我很后悔没有去。', 'wǒ hěn hòuhuǐ méiyǒu qù.', 'I really regret not going.'),
        ],
      },
      {
        id: 'h4-u2-l5',
        title: 'Love and friendship',
        words: ['爱情', '浪漫', '感情', '友谊', '抱', '约会'],
        sentences: [
          s('我们的感情很好。', 'wǒmen de gǎnqíng hěn hǎo.', "We're very close."),
          s(
            '今天晚上我有一个约会。',
            'jīntiān wǎnshang wǒ yǒu yí gè yuēhuì.',
            "I've got a date tonight.",
          ),
          s('妈妈抱着孩子。', 'māma bào zhe háizi.', 'Mum is holding the baby.'),
        ],
      },
      {
        id: 'h4-u2-l6',
        title: 'How it feels',
        words: ['骄傲', '感觉', '无聊', '有趣', '压力'],
        sentences: [
          s('这个电影很无聊。', 'zhège diànyǐng hěn wúliáo.', 'This film is boring.'),
          s('工作压力太大了。', 'gōngzuò yālì tài dà le.', 'There is too much pressure at work.'),
          s('你感觉怎么样？', 'nǐ gǎnjué zěnmeyàng?', 'How are you feeling?'),
        ],
      },
    ],
  },
  {
    id: 'h4-u3',
    hskLevel: 4,
    title: 'At home',
    description: 'Rooms, tidying up, everyday things and renting a flat.',
    scenario: 'renting-a-flat',
    lessons: [
      {
        id: 'h4-u3-l1',
        title: 'Rooms',
        words: ['客厅', '厨房', '卫生间', '厕所', '窗户', '家具', '沙发'],
        sentences: [
          s(
            '客厅里有一个大沙发。',
            'kètīng lǐ yǒu yí gè dà shāfā.',
            "There's a big sofa in the living room.",
          ),
          s('妈妈在厨房做菜。', 'māma zài chúfáng zuò cài.', 'Mum is cooking in the kitchen.'),
          s('卫生间在哪儿？', 'wèishēngjiān zài nǎr?', "Where's the bathroom?"),
        ],
      },
      {
        id: 'h4-u3-l2',
        title: 'Tidying up',
        words: ['收拾', '整理', '乱', '脏', '擦', '扔', '垃圾桶'],
        sentences: [
          s(
            '你的房间太乱了，快收拾一下！',
            'nǐ de fángjiān tài luàn le, kuài shōushi yíxià!',
            'Your room is a mess. Tidy it up!',
          ),
          s(
            '桌子很脏，我擦一下。',
            'zhuōzi hěn zāng, wǒ cā yíxià.',
            "The table is dirty. I'll give it a wipe.",
          ),
        ],
      },
      {
        id: 'h4-u3-l3',
        title: 'Everyday things',
        words: ['毛巾', '牙膏', '钥匙', '盒子', '塑料袋', '勺子', '刀'],
        sentences: [
          s('我找不到钥匙了。', 'wǒ zhǎo bú dào yàoshi le.', "I can't find my keys."),
          s('牙膏在卫生间里。', 'yágāo zài wèishēngjiān lǐ.', 'The toothpaste is in the bathroom.'),
          s('你要塑料袋吗？', 'nǐ yào sùliàodài ma?', 'Do you want a plastic bag?'),
        ],
      },
      {
        id: 'h4-u3-l4',
        title: 'Renting a flat',
        words: ['租', '房东', '郊区', '地址', '对面', '周围'],
        sentences: [
          s(
            '我在郊区租了一个房间。',
            'wǒ zài jiāoqū zū le yí gè fángjiān.',
            'I rented a room in the suburbs.',
          ),
          s(
            '房东住在我们对面。',
            'fángdōng zhù zài wǒmen duìmiàn.',
            'The landlord lives opposite us.',
          ),
          s(
            '周围有超市和银行，很方便。',
            'zhōuwéi yǒu chāoshì hé yínháng, hěn fāngbiàn.',
            "There's a supermarket and a bank nearby, which is handy.",
          ),
        ],
      },
      {
        id: 'h4-u3-l5',
        title: 'Moving things',
        words: ['挂', '推', '拉', '抬', '敲', '躺'],
        sentences: [
          s('有人在敲门。', 'yǒu rén zài qiāo mén.', "Someone's knocking at the door."),
          s(
            '他累了，在沙发上躺着。',
            'tā lèi le, zài shāfā shàng tǎng zhe.',
            "He's tired and lying on the sofa.",
          ),
          s('你推，我拉。', 'nǐ tuī, wǒ lā.', "You push, and I'll pull."),
        ],
      },
    ],
  },
  {
    id: 'h4-u4',
    hskLevel: 4,
    title: 'Food and drink',
    description: 'Flavours, Chinese dishes, snacks and eating out.',
    scenario: 'ordering-food',
    lessons: [
      {
        id: 'h4-u4-l1',
        title: 'Flavours',
        words: ['味道', '酸', '辣', '苦', '咸', '香'],
        sentences: [
          s('这个菜的味道很好。', 'zhège cài de wèidao hěn hǎo.', 'This dish tastes great.'),
          s('我不能吃辣的。', 'wǒ bù néng chī là de.', "I can't eat spicy food."),
          s('这个菜太咸了。', 'zhège cài tài xián le.', 'This dish is too salty.'),
        ],
      },
      {
        id: 'h4-u4-l2',
        title: 'Chinese food',
        words: ['饺子', '包子', '烤鸭', '汤', '小吃', '盐', '糖'],
        sentences: [
          s('北京烤鸭非常有名。', 'Běijīng kǎoyā fēicháng yǒumíng.', 'Peking duck is very famous.'),
          s(
            '我早上喜欢吃包子。',
            'wǒ zǎoshang xǐhuan chī bāozi.',
            'I like having steamed buns in the morning.',
          ),
          s('咖啡里要放糖吗？', 'kāfēi lǐ yào fàng táng ma?', 'Do you want sugar in your coffee?'),
        ],
      },
      {
        id: 'h4-u4-l3',
        title: 'Snacks and drinks',
        words: ['饼干', '巧克力', '果汁', '矿泉水', '干杯', '尝'],
        sentences: [
          s('你尝一下这个饼干。', 'nǐ cháng yíxià zhège bǐnggān.', 'Try this biscuit.'),
          s(
            '我不喝咖啡，喝果汁。',
            'wǒ bù hē kāfēi, hē guǒzhī.',
            "I don't drink coffee. I'll have juice.",
          ),
          s('来，大家干杯！', 'lái, dàjiā gānbēi!', 'Come on, everyone, cheers!'),
        ],
      },
      {
        id: 'h4-u4-l4',
        title: 'At the restaurant',
        words: ['餐厅', '顾客', '份', '倒', '满', '够'],
        sentences: [
          s(
            '这家餐厅的顾客很多。',
            'zhè jiā cāntīng de gùkè hěn duō.',
            'This restaurant has lots of customers.',
          ),
          s(
            '我们要两份饺子。',
            'wǒmen yào liǎng fèn jiǎozi.',
            "We'd like two portions of dumplings.",
          ),
          s('我给你倒茶。', 'wǒ gěi nǐ dào chá.', "I'll pour you some tea."),
          s('菜够不够？', 'cài gòu bu gòu?', 'Is there enough food?'),
        ],
      },
    ],
  },
  {
    id: 'h4-u5',
    hskLevel: 4,
    title: 'Shopping and money',
    description: 'Prices, paying, earning and saving.',
    scenario: 'shopping',
    lessons: [
      {
        id: 'h4-u5-l1',
        title: 'Prices',
        words: ['价格', '打折', '免费', '质量', '合适', '购物'],
        sentences: [
          s('这件衣服在打折。', 'zhè jiàn yīfu zài dǎzhé.', 'This top is on sale.'),
          s(
            '价格不贵，质量也很好。',
            'jiàgé bú guì, zhìliàng yě hěn hǎo.',
            "It isn't expensive, and the quality is good too.",
          ),
          s('喝水是免费的。', 'hē shuǐ shì miǎnfèi de.', 'The water is free.'),
        ],
      },
      {
        id: 'h4-u5-l2',
        title: 'Paying',
        words: ['付款', '现金', '零钱', '收', '存', '取'],
        sentences: [
          s('你用现金还是信用卡？', 'nǐ yòng xiànjīn háishi xìnyòngkǎ?', 'Cash or card?'),
          s('我没有零钱。', 'wǒ méiyǒu língqián.', "I don't have any change."),
          s('我去银行取钱。', 'wǒ qù yínháng qǔ qián.', "I'm going to the bank to get some money."),
        ],
      },
      {
        id: 'h4-u5-l3',
        title: 'In the shop',
        words: ['售货员', '逛', '袜子', '硬', '厚', '轻'],
        sentences: [
          s(
            '周末我喜欢去商店逛逛。',
            'zhōumò wǒ xǐhuan qù shāngdiàn guàngguang.',
            'At the weekend I like to wander round the shops.',
          ),
          s('售货员很热情。', 'shòuhuòyuán hěn rèqíng.', 'The shop assistant is very friendly.'),
          s('这件衣服太厚了。', 'zhè jiàn yīfu tài hòu le.', 'This top is too thick.'),
        ],
      },
      {
        id: 'h4-u5-l4',
        title: 'Earning',
        words: ['工资', '收入', '奖金', '赚', '富', '穷'],
        sentences: [
          s('他的工资很高。', 'tā de gōngzī hěn gāo.', 'His wages are high.'),
          s(
            '公司给了每个人奖金。',
            'gōngsī gěi le měi gè rén jiǎngjīn.',
            'The company gave everyone a bonus.',
          ),
          s(
            '他以前很穷，现在很富。',
            'tā yǐqián hěn qióng, xiànzài hěn fù.',
            'He used to be poor; now he is rich.',
          ),
        ],
      },
      {
        id: 'h4-u5-l5',
        title: 'Spending and saving',
        words: ['浪费', '节约', '省', '剩', '许多', '数量'],
        sentences: [
          s('别浪费水。', 'bié làngfèi shuǐ.', "Don't waste water."),
          s('我们要节约用水。', 'wǒmen yào jiéyuē yòng shuǐ.', 'We should save water.'),
          s(
            '盘子里还剩一个饺子。',
            'pánzi lǐ hái shèng yí gè jiǎozi.',
            "There's one dumpling left on the plate.",
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u6',
    hskLevel: 4,
    title: 'Getting around',
    description: 'Traffic, flying, travelling and finding your way.',
    scenario: 'transportation',
    lessons: [
      {
        id: 'h4-u6-l1',
        title: 'On the road',
        words: ['交通', '堵车', '高速公路', '加油站', '公里', '速度'],
        sentences: [
          s(
            '早上经常堵车。',
            'zǎoshang jīngcháng dǔchē.',
            "There's often a traffic jam in the morning.",
          ),
          s(
            '离这里十公里有一个加油站。',
            'lí zhèlǐ shí gōnglǐ yǒu yí gè jiāyóuzhàn.',
            "There's a petrol station ten kilometres from here.",
          ),
          s(
            '在高速公路上，速度不能太快。',
            'zài gāosù gōnglù shàng, sùdù bù néng tài kuài.',
            "On the motorway, you mustn't go too fast.",
          ),
        ],
      },
      {
        id: 'h4-u6-l2',
        title: 'Flying',
        words: ['航班', '登机牌', '乘坐', '降落', '座位', '准时'],
        sentences: [
          s(
            '我们的航班准时起飞了。',
            'wǒmen de hángbān zhǔnshí qǐfēi le.',
            'Our flight took off on time.',
          ),
          s(
            '请拿好您的登机牌。',
            'qǐng ná hǎo nín de dēngjīpái.',
            'Please keep hold of your boarding pass.',
          ),
          s(
            '飞机马上就要降落了。',
            'fēijī mǎshàng jiù yào jiàngluò le.',
            'The plane is about to land.',
          ),
        ],
      },
      {
        id: 'h4-u6-l3',
        title: 'Travelling',
        words: ['旅行', '导游', '签证', '大使馆', '出发', '参观'],
        sentences: [
          s('明天我去大使馆。', 'míngtiān wǒ qù dàshǐguǎn.', "Tomorrow I'm going to the embassy."),
          s(
            '我们早上八点出发。',
            'wǒmen zǎoshang bā diǎn chūfā.',
            "We'll set off at eight in the morning.",
          ),
          s('导游带我们去参观。', 'dǎoyóu dài wǒmen qù cānguān.', 'The guide took us sightseeing.'),
        ],
      },
      {
        id: 'h4-u6-l4',
        title: 'Finding the way',
        words: ['迷路', '方向', '距离', '桥', '转', '停'],
        sentences: [
          s(
            '我迷路了，找不到方向。',
            'wǒ mílù le, zhǎo bú dào fāngxiàng.',
            "I'm lost and can't tell which way to go.",
          ),
          s(
            '过了桥就到了。',
            'guò le qiáo jiù dào le.',
            "Once you're over the bridge, you're there.",
          ),
          s(
            '司机，请在这里停一下。',
            'sījī, qǐng zài zhèlǐ tíng yíxià.',
            'Driver, please stop here.',
          ),
        ],
      },
      {
        id: 'h4-u6-l5',
        title: 'Famous places',
        words: ['长城', '长江', '首都', '著名', '地点', '入口'],
        sentences: [
          s(
            '北京是中国的首都。',
            'Běijīng shì Zhōngguó de shǒudū.',
            'Beijing is the capital of China.',
          ),
          s('长城非常著名。', 'Chángchéng fēicháng zhùmíng.', 'The Great Wall is very famous.'),
          s('入口在前面。', 'rùkǒu zài qiánmiàn.', 'The entrance is ahead.'),
        ],
      },
      {
        id: 'h4-u6-l6',
        title: 'Errands',
        words: ['排队', '趟', '赶', '顺便', '理发', '脱'],
        sentences: [
          s('买票要排队。', 'mǎi piào yào páiduì.', 'You have to queue for tickets.'),
          s(
            '我去理发，顺便买水果。',
            'wǒ qù lǐfà, shùnbiàn mǎi shuǐguǒ.',
            "I'm getting a haircut and picking up some fruit while I'm out.",
          ),
          s(
            '快点，我们要赶飞机！',
            'kuài diǎn, wǒmen yào gǎn fēijī!',
            "Hurry up, we've got a plane to catch!",
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u7',
    hskLevel: 4,
    title: 'Nature and weather',
    description: 'Climate, the natural world, animals and the planet.',
    scenario: 'weather',
    lessons: [
      {
        id: 'h4-u7-l1',
        title: 'Weather',
        words: ['气候', '温度', '凉快', '暖和', '阳光', '汗'],
        sentences: [
          s('这里的气候很好。', 'zhèlǐ de qìhòu hěn hǎo.', 'The climate here is good.'),
          s(
            '今天的温度不高，很凉快。',
            'jīntiān de wēndù bù gāo, hěn liángkuai.',
            "It isn't hot today. It's nice and cool.",
          ),
          s(
            '天气太热，我出了很多汗。',
            'tiānqì tài rè, wǒ chū le hěn duō hàn.',
            "It's so hot I'm sweating buckets.",
          ),
        ],
      },
      {
        id: 'h4-u7-l2',
        title: 'The natural world',
        words: ['自然', '森林', '海洋', '植物', '叶子', '棵'],
        sentences: [
          s(
            '我们家门口有一棵大树。',
            'wǒmen jiā ménkǒu yǒu yì kē dà shù.',
            "There's a big tree outside our door.",
          ),
          s(
            '树上的叶子都红了。',
            'shù shàng de yèzi dōu hóng le.',
            'The leaves on the tree have all turned red.',
          ),
          s('我喜欢大自然。', 'wǒ xǐhuan dà zìrán.', 'I love nature.'),
        ],
      },
      {
        id: 'h4-u7-l3',
        title: 'Animals',
        words: ['老虎', '猪', '龙', '毛', '骑马', '动作'],
        sentences: [
          s('你骑过马吗？', 'nǐ qí guo mǎ ma?', 'Have you ever ridden a horse?'),
          s('这只猫的毛很长。', 'zhè zhī māo de máo hěn cháng.', 'This cat has long fur.'),
          s(
            '老虎是一种很大的动物。',
            'lǎohǔ shì yì zhǒng hěn dà de dòngwù.',
            'The tiger is a very big animal.',
          ),
        ],
      },
      {
        id: 'h4-u7-l4',
        title: 'Our planet',
        words: ['地球', '空气', '污染', '保护', '火', '光'],
        sentences: [
          s('我们要保护地球。', 'wǒmen yào bǎohù dìqiú.', 'We need to protect the planet.'),
          s(
            '大城市的空气不太好。',
            'dà chéngshì de kōngqì bú tài hǎo.',
            "The air in big cities isn't great.",
          ),
          s('污染是一个大问题。', 'wūrǎn shì yí gè dà wèntí.', 'Pollution is a big problem.'),
        ],
      },
    ],
  },
  {
    id: 'h4-u8',
    hskLevel: 4,
    title: 'Health and body',
    description: 'Aches, doctors and healthy habits.',
    scenario: 'at-the-doctor',
    lessons: [
      {
        id: 'h4-u8-l1',
        title: 'The body',
        words: ['胳膊', '肚子', '嘴巴', '力气', '困', '咳嗽'],
        sentences: [
          s('我肚子疼。', 'wǒ dùzi téng.', 'I have a stomach ache.'),
          s(
            '他感冒了，一直咳嗽。',
            'tā gǎnmào le, yìzhí késou.',
            "He has a cold and hasn't stopped coughing.",
          ),
          s(
            '我现在很困，想睡觉。',
            'wǒ xiànzài hěn kùn, xiǎng shuìjiào.',
            "I'm really sleepy. I want to go to bed.",
          ),
        ],
      },
      {
        id: 'h4-u8-l2',
        title: 'Seeing a doctor',
        words: ['护士', '打针', '危险', '严重', '正常', '及时'],
        sentences: [
          s('我不喜欢打针。', 'wǒ bù xǐhuan dǎzhēn.', "I don't like injections."),
          s('医生说不严重。', 'yīshēng shuō bù yánzhòng.', "The doctor says it isn't serious."),
          s(
            '生病了要及时去医院。',
            'shēngbìng le yào jíshí qù yīyuàn.',
            'When you get ill, go to the hospital straight away.',
          ),
        ],
      },
      {
        id: 'h4-u8-l3',
        title: 'Healthy habits',
        words: ['减肥', '抽烟', '散步', '养成', '坚持', '放弃'],
        sentences: [
          s('抽烟对身体不好。', 'chōuyān duì shēntǐ bù hǎo.', 'Smoking is bad for you.'),
          s(
            '我经常去公园散步。',
            'wǒ jīngcháng qù gōngyuán sànbù.',
            'I often go for a walk in the park.',
          ),
          s(
            '减肥要坚持，别放弃。',
            'jiǎnféi yào jiānchí, bié fàngqì.',
            "Losing weight takes persistence. Don't give up.",
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u9',
    hskLevel: 4,
    title: 'Sport and fun',
    description: 'Sports, the arts, parties and weekends.',
    scenario: 'sports-fitness',
    lessons: [
      {
        id: 'h4-u9-l1',
        title: 'Sports',
        words: ['网球', '羽毛球', '乒乓球', '功夫', '输', '赢'],
        sentences: [
          s('我很喜欢乒乓球。', 'wǒ hěn xǐhuan pīngpāngqiú.', 'I love table tennis.'),
          s('我们赢了！', 'wǒmen yíng le!', 'We won!'),
          s(
            '他练习了十年功夫。',
            'tā liànxí le shí nián gōngfu.',
            "He's practised kung fu for ten years.",
          ),
        ],
      },
      {
        id: 'h4-u9-l2',
        title: 'Winning and losing',
        words: ['竞争', '成功', '失败', '鼓掌', '观众', '场'],
        sentences: [
          s(
            '失败了也没关系，再试一次。',
            'shībài le yě méi guānxi, zài shì yí cì.',
            "It's fine if you fail. Try again.",
          ),
          s('观众都在鼓掌。', 'guānzhòng dōu zài gǔzhǎng.', 'The audience are all clapping.'),
          s('这场比赛我们输了。', 'zhè chǎng bǐsài wǒmen shū le.', 'We lost this match.'),
        ],
      },
      {
        id: 'h4-u9-l3',
        title: 'The arts',
        words: ['艺术', '京剧', '表演', '演出', '演员', '弹钢琴'],
        sentences: [
          s(
            '我妹妹会弹钢琴。',
            'wǒ mèimei huì tán gāngqín.',
            'My younger sister can play the piano.',
          ),
          s(
            '他是一个很有名的演员。',
            'tā shì yí gè hěn yǒumíng de yǎnyuán.',
            "He's a very famous actor.",
          ),
          s(
            '你看过京剧表演吗？',
            'nǐ kàn guo jīngjù biǎoyǎn ma?',
            'Have you ever seen Beijing opera?',
          ),
        ],
      },
      {
        id: 'h4-u9-l4',
        title: 'Parties',
        words: ['聚会', '热闹', '开玩笑', '笑话', '流行', '打扮'],
        sentences: [
          s(
            '周末我们有一个聚会。',
            'zhōumò wǒmen yǒu yí gè jùhuì.',
            "We're having a party at the weekend.",
          ),
          s('聚会很热闹。', 'jùhuì hěn rènao.', 'The party was lively.'),
          s(
            '别生气，我在开玩笑。',
            'bié shēngqì, wǒ zài kāi wánxiào.',
            "Don't be cross, I'm joking.",
          ),
        ],
      },
      {
        id: 'h4-u9-l5',
        title: 'Sunday',
        words: ['礼拜天', '梦', '节', '遍', '呀', '正好'],
        sentences: [
          s('礼拜天我不上班。', 'lǐbàitiān wǒ bú shàngbān.', "I don't work on Sundays."),
          s('我昨天做了一个梦。', 'wǒ zuótiān zuò le yí gè mèng.', 'I had a dream last night.'),
          s(
            '这个电影我看了三遍。',
            'zhège diànyǐng wǒ kàn le sān biàn.',
            "I've watched this film three times.",
          ),
          s('你来得正好！', 'nǐ lái de zhènghǎo!', "You've come at just the right time!"),
        ],
      },
    ],
  },
  {
    id: 'h4-u10',
    hskLevel: 4,
    title: 'University',
    description: 'Degrees, reading, tests, languages and how to learn.',
    scenario: 'school-classroom',
    lessons: [
      {
        id: 'h4-u10-l1',
        title: 'At university',
        words: ['专业', '毕业', '博士', '硕士', '教授', '学期'],
        sentences: [
          s('你的专业是什么？', 'nǐ de zhuānyè shì shénme?', "What's your major?"),
          s(
            '我哥哥已经毕业了。',
            'wǒ gēge yǐjīng bìyè le.',
            'My older brother has already graduated.',
          ),
          s(
            '这个教授很有名。',
            'zhège jiàoshòu hěn yǒumíng.',
            'This professor is very well known.',
          ),
        ],
      },
      {
        id: 'h4-u10-l2',
        title: 'Reading and writing',
        words: ['预习', '阅读', '语法', '词语', '页', '篇'],
        sentences: [
          s('上课以前要预习。', 'shàng kè yǐqián yào yùxí.', 'Prepare before class.'),
          s('这本书有三百页。', 'zhè běn shū yǒu sānbǎi yè.', 'This book has three hundred pages.'),
          s('汉语的语法不太难。', 'Hànyǔ de yǔfǎ bú tài nán.', "Chinese grammar isn't too hard."),
        ],
      },
      {
        id: 'h4-u10-l3',
        title: 'Tests',
        words: ['答案', '填空', '合格', '标准', '错误', '正确'],
        sentences: [
          s('这个答案是正确的。', "zhège dá'àn shì zhèngquè de.", 'This answer is correct.'),
          s('我的考试合格了。', 'wǒ de kǎoshì hégé le.', 'I passed my exam.'),
        ],
      },
      {
        id: 'h4-u10-l4',
        title: 'Holidays and forms',
        words: ['寒假', '放暑假', '报名', '申请', '橡皮', '考虑'],
        sentences: [
          s(
            '寒假你打算去哪儿？',
            'hánjià nǐ dǎsuàn qù nǎr?',
            'Where are you going in the winter holidays?',
          ),
          s(
            '我想报名参加比赛。',
            'wǒ xiǎng bàomíng cānjiā bǐsài.',
            'I want to sign up for the competition.',
          ),
          s('我还在考虑。', 'wǒ hái zài kǎolǜ.', "I'm still thinking about it."),
        ],
      },
      {
        id: 'h4-u10-l5',
        title: 'Languages',
        words: ['语言', '翻译', '普通话', '流利', '对话', '交流'],
        sentences: [
          s(
            '他的普通话说得很流利。',
            'tā de pǔtōnghuà shuō de hěn liúlì.',
            'He speaks fluent Mandarin.',
          ),
          s('你能给我翻译吗？', 'nǐ néng gěi wǒ fānyì ma?', 'Can you translate for me?'),
          s(
            '学习语言要多交流。',
            'xuéxí yǔyán yào duō jiāoliú.',
            'To learn a language, talk with people a lot.',
          ),
        ],
      },
      {
        id: 'h4-u10-l6',
        title: 'Learning',
        words: ['知识', '基础', '积累', '方法', '总结', '印象'],
        sentences: [
          s('学习要有好的方法。', 'xuéxí yào yǒu hǎo de fāngfǎ.', 'You need a good way to study.'),
          s(
            '他的汉语基础很好。',
            'tā de Hànyǔ jīchǔ hěn hǎo.',
            'He has a good foundation in Chinese.',
          ),
          s(
            '我对他的印象很好。',
            'wǒ duì tā de yìnxiàng hěn hǎo.',
            'I have a good impression of him.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u11',
    hskLevel: 4,
    title: 'Work',
    description: 'Jobs, applying, office life and business.',
    scenario: 'business-work',
    lessons: [
      {
        id: 'h4-u11-l1',
        title: 'Jobs',
        words: ['职业', '律师', '警察', '记者', '师傅'],
        sentences: [
          s('你的职业是什么？', 'nǐ de zhíyè shì shénme?', 'What do you do for a living?'),
          s('我姐姐是律师。', 'wǒ jiějie shì lǜshī.', 'My older sister is a lawyer.'),
          s('师傅，去火车站。', 'shīfu, qù huǒchēzhàn.', 'To the station, please.'),
        ],
      },
      {
        id: 'h4-u11-l2',
        title: 'Getting a job',
        words: ['招聘', '应聘', '经验', '能力', '优秀', '符合'],
        sentences: [
          s('这家公司在招聘。', 'zhè jiā gōngsī zài zhāopìn.', 'This company is hiring.'),
          s('我没有工作经验。', 'wǒ méiyǒu gōngzuò jīngyàn.', "I don't have any work experience."),
          s(
            '他是一个优秀的学生。',
            'tā shì yí gè yōuxiù de xuésheng.',
            "He's an excellent student.",
          ),
        ],
      },
      {
        id: 'h4-u11-l3',
        title: 'At the office',
        words: ['加班', '出差', '负责', '管理', '任务', '责任'],
        sentences: [
          s('今天我又要加班。', 'jīntiān wǒ yòu yào jiābān.', 'I have to work late again today.'),
          s(
            '经理下个星期去出差。',
            'jīnglǐ xià gè xīngqī qù chūchāi.',
            'The manager is going on a business trip next week.',
          ),
          s('你负责这个任务。', 'nǐ fùzé zhège rènwu.', "You're in charge of this task."),
        ],
      },
      {
        id: 'h4-u11-l4',
        title: 'Paperwork',
        words: ['打印', '复印', '传真', '表格', '材料', '通知'],
        sentences: [
          s(
            '请把这些材料复印一下。',
            'qǐng bǎ zhèxiē cáiliào fùyìn yíxià.',
            'Please photocopy these documents.',
          ),
          s(
            '这张表格你看了吗？',
            'zhè zhāng biǎogé nǐ kàn le ma?',
            'Have you looked at this form?',
          ),
          s(
            '我收到了公司的通知。',
            'wǒ shōu dào le gōngsī de tōngzhī.',
            'I got a notice from the company.',
          ),
        ],
      },
      {
        id: 'h4-u11-l5',
        title: 'Business',
        words: ['生意', '经济', '广告', '提供', '共同', '条件'],
        sentences: [
          s('他的生意很好。', 'tā de shēngyi hěn hǎo.', 'His business is doing well.'),
          s(
            '电视上的广告太多了。',
            'diànshì shàng de guǎnggào tài duō le.',
            'There are too many adverts on TV.',
          ),
          s(
            '这里的工作条件很好。',
            'zhèlǐ de gōngzuò tiáojiàn hěn hǎo.',
            'The working conditions here are good.',
          ),
        ],
      },
      {
        id: 'h4-u11-l6',
        title: 'Keen and strict',
        words: ['专门', '主意', '信心', '严格', '积极', '来自'],
        sentences: [
          s('我们的老师很严格。', 'wǒmen de lǎoshī hěn yángé.', 'Our teacher is very strict.'),
          s('这是个好主意！', 'zhè shì gè hǎo zhǔyi!', "That's a good idea!"),
          s('他来自北京。', 'tā láizì Běijīng.', 'He comes from Beijing.'),
        ],
      },
    ],
  },
  {
    id: 'h4-u12',
    hskLevel: 4,
    title: 'Keeping in touch',
    description: 'Messages, post, talking things over and being polite.',
    scenario: 'on-the-phone',
    lessons: [
      {
        id: 'h4-u12-l1',
        title: 'Phones and messages',
        words: ['短信', '号码', '占线', '联系', '消息', '信息'],
        sentences: [
          s(
            '你的手机号码是多少？',
            'nǐ de shǒujī hàomǎ shì duōshao?',
            "What's your mobile number?",
          ),
          s(
            '他的手机一直占线。',
            'tā de shǒujī yìzhí zhànxiàn.',
            'His phone has been engaged the whole time.',
          ),
          s(
            '有消息就给我打电话。',
            'yǒu xiāoxi jiù gěi wǒ dǎ diànhuà.',
            'Call me as soon as there is any news.',
          ),
        ],
      },
      {
        id: 'h4-u12-l2',
        title: 'Post and the internet',
        words: ['寄', '信封', '邮局', '网站', '密码', '日记'],
        sentences: [
          s(
            '我去邮局寄东西。',
            'wǒ qù yóujú jì dōngxi.',
            "I'm going to the post office to send something.",
          ),
          s('我忘记密码了。', 'wǒ wàngjì mìmǎ le.', "I've forgotten my password."),
          s('我经常写日记。', 'wǒ jīngcháng xiě rìjì.', 'I often write in my diary.'),
        ],
      },
      {
        id: 'h4-u12-l3',
        title: 'Talking it over',
        words: ['商量', '讨论', '解释', '说明', '误会', '原谅'],
        sentences: [
          s('我们商量一下。', 'wǒmen shāngliang yíxià.', "Let's talk it over."),
          s(
            '你误会了，我来解释。',
            'nǐ wùhuì le, wǒ lái jiěshì.',
            "You've misunderstood. Let me explain.",
          ),
          s('请原谅我。', 'qǐng yuánliàng wǒ.', 'Please forgive me.'),
        ],
      },
      {
        id: 'h4-u12-l4',
        title: 'Being polite',
        words: ['抱歉', '打扰', '道歉', '感谢', '打招呼', '麻烦'],
        sentences: [
          s('对不起，打扰一下。', 'duìbuqǐ, dǎrǎo yíxià.', 'Sorry to bother you.'),
          s('很抱歉，我迟到了。', 'hěn bàoqiàn, wǒ chídào le.', "I'm sorry I'm late."),
          s(
            '麻烦你了，非常感谢！',
            'máfan nǐ le, fēicháng gǎnxiè!',
            'Sorry for the trouble, and thank you so much!',
          ),
        ],
      },
      {
        id: 'h4-u12-l5',
        title: 'Opinions',
        words: ['看法', '意见', '建议', '支持', '反对', '批评'],
        sentences: [
          s(
            '你对这个问题有什么看法？',
            'nǐ duì zhège wèntí yǒu shénme kànfǎ?',
            "What's your view on this question?",
          ),
          s('我建议你去看医生。', 'wǒ jiànyì nǐ qù kàn yīshēng.', 'I suggest you see a doctor.'),
          s('我的家人都支持我。', 'wǒ de jiārén dōu zhīchí wǒ.', 'My whole family supports me.'),
        ],
      },
      {
        id: 'h4-u12-l6',
        title: 'Each other',
        words: ['互相', '同时', '交', '留', '举', '指'],
        sentences: [
          s('我们要互相帮助。', 'wǒmen yào hùxiāng bāngzhù.', 'We should help each other.'),
          s('明天要交作业。', 'míngtiān yào jiāo zuòyè.', 'The homework is due tomorrow.'),
          s('他指着地图问我。', 'tā zhǐ zhe dìtú wèn wǒ.', 'He pointed at the map and asked me.'),
        ],
      },
    ],
  },
  {
    id: 'h4-u13',
    hskLevel: 4,
    title: 'Plans and events',
    description: 'Planning, events, getting things done and aims.',
    scenario: 'chinese-festivals',
    lessons: [
      {
        id: 'h4-u13-l1',
        title: 'Making plans',
        words: ['计划', '安排', '提前', '推迟', '按时', '来得及'],
        sentences: [
          s('你有什么计划？', 'nǐ yǒu shénme jìhuà?', 'What are your plans?'),
          s(
            '会议推迟到明天了。',
            'huìyì tuīchí dào míngtiān le.',
            "The meeting's been put off till tomorrow.",
          ),
          s('现在去还来得及。', 'xiànzài qù hái láidejí.', "There's still time if you go now."),
        ],
      },
      {
        id: 'h4-u13-l2',
        title: 'Events',
        words: ['活动', '举办', '举行', '邀请', '祝贺', '来不及'],
        sentences: [
          s(
            '学校举办了很多活动。',
            'xuéxiào jǔbàn le hěn duō huódòng.',
            'The school put on lots of events.',
          ),
          s(
            '他邀请我参加他的生日聚会。',
            'tā yāoqǐng wǒ cānjiā tā de shēngrì jùhuì.',
            'He invited me to his birthday party.',
          ),
          s('快走，要来不及了！', 'kuài zǒu, yào láibují le!', "Hurry, we're going to be late!"),
        ],
      },
      {
        id: 'h4-u13-l3',
        title: 'Getting it done',
        words: ['进行', '继续', '接着', '过程', '结果', '效果'],
        sentences: [
          s('会议正在进行。', 'huìyì zhèngzài jìnxíng.', 'The meeting is in progress.'),
          s('你继续说。', 'nǐ jìxù shuō.', 'Go on.'),
          s('比赛的结果怎么样？', 'bǐsài de jiéguǒ zěnmeyàng?', 'How did the match turn out?'),
        ],
      },
      {
        id: 'h4-u13-l4',
        title: 'Aims',
        words: ['目的', '理想', '将来', '真正', '关键', '重点'],
        sentences: [
          s('你的理想是什么？', 'nǐ de lǐxiǎng shì shénme?', "What's your dream?"),
          s(
            '将来我想做医生。',
            'jiānglái wǒ xiǎng zuò yīshēng.',
            'In the future I want to be a doctor.',
          ),
          s('这是今天的重点。', 'zhè shì jīntiān de zhòngdiǎn.', "This is today's key point."),
        ],
      },
      {
        id: 'h4-u13-l5',
        title: 'It went well',
        words: ['安全', '保证', '顺利', '棒', '厉害', '辛苦'],
        sentences: [
          s('考试很顺利。', 'kǎoshì hěn shùnlì.', 'The exam went well.'),
          s('你太棒了！', 'nǐ tài bàng le!', "You're amazing!"),
          s('路上注意安全。', 'lù shàng zhùyì ānquán.', 'Get home safely.'),
        ],
      },
      {
        id: 'h4-u13-l6',
        title: 'Moving forward',
        words: ['重新', '前进', '使用', '提', '吸引', '丰富'],
        sentences: [
          s('我们重新开始。', 'wǒmen chóngxīn kāishǐ.', "Let's start again."),
          s('他的经验很丰富。', 'tā de jīngyàn hěn fēngfù.', 'He has a lot of experience.'),
          s(
            '这个手机很容易使用。',
            'zhège shǒujī hěn róngyì shǐyòng.',
            'This phone is easy to use.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u14',
    hskLevel: 4,
    title: 'Society and the world',
    description: 'Rules, science, the wider world and the news.',
    lessons: [
      {
        id: 'h4-u14-l1',
        title: 'Rules',
        words: ['社会', '法律', '规定', '禁止', '允许', '教育'],
        sentences: [
          s('这里禁止抽烟。', 'zhèlǐ jìnzhǐ chōuyān.', 'No smoking here.'),
          s(
            '公司规定九点上班。',
            'gōngsī guīdìng jiǔ diǎn shàngbān.',
            'Company rules say work starts at nine.',
          ),
          s(
            '妈妈不允许我玩游戏。',
            'māma bù yǔnxǔ wǒ wán yóuxì.',
            "Mum doesn't let me play games.",
          ),
        ],
      },
      {
        id: 'h4-u14-l2',
        title: 'Science',
        words: ['科学', '技术', '研究', '调查', '发展', '世纪'],
        sentences: [
          s(
            '科学技术发展得很快。',
            'kēxué jìshù fāzhǎn de hěn kuài.',
            'Science and technology are developing fast.',
          ),
          s(
            '他在研究中国历史。',
            'tā zài yánjiū Zhōngguó lìshǐ.',
            "He's researching Chinese history.",
          ),
          s(
            '现在是二十一世纪。',
            'xiànzài shì èrshíyī shìjì.',
            "We're in the twenty-first century.",
          ),
        ],
      },
      {
        id: 'h4-u14-l3',
        title: 'The wider world',
        words: ['国际', '亚洲', '民族', '普遍', '各'],
        sentences: [
          s('中国在亚洲。', 'Zhōngguó zài Yàzhōu.', 'China is in Asia.'),
          s(
            '中国有五十六个民族。',
            'Zhōngguó yǒu wǔshíliù gè mínzú.',
            'China has fifty-six ethnic groups.',
          ),
          s(
            '各个国家的学生都来了。',
            'gè gè guójiā de xuésheng dōu lái le.',
            'Students came from all over the world.',
          ),
        ],
      },
      {
        id: 'h4-u14-l4',
        title: 'News and books',
        words: ['报道', '广播', '杂志', '小说', '文章', '内容'],
        sentences: [
          s('我喜欢看小说。', 'wǒ xǐhuan kàn xiǎoshuō.', 'I like reading novels.'),
          s(
            '这篇文章的内容很有意思。',
            'zhè piān wénzhāng de nèiróng hěn yǒu yìsi.',
            'This article is really interesting.',
          ),
          s(
            '电视上报道了这个消息。',
            'diànshì shàng bàodào le zhège xiāoxi.',
            'The news was reported on TV.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u15',
    hskLevel: 4,
    title: 'Linking ideas',
    description: 'Not only, however, even if, because of, for example.',
    lessons: [
      {
        id: 'h4-u15-l1',
        title: 'Not only… but also',
        words: ['不仅', '并且', '而', '以及', '与', '甚至'],
        grammar: 'bujin-erqie',
        sentences: [
          s(
            '他不仅会做菜，也会唱歌。',
            'tā bùjǐn huì zuò cài, yě huì chàng gē.',
            'Not only can he cook, he can sing too.',
          ),
          s(
            '他很忙，甚至没有时间睡觉。',
            'tā hěn máng, shènzhì méiyǒu shíjiān shuìjiào.',
            "He's so busy he doesn't even have time to sleep.",
          ),
        ],
      },
      {
        id: 'h4-u15-l2',
        title: 'But and however',
        words: ['不过', '可是', '却', '然而', '尽管', '相反'],
        grammar: 'jinguan-que',
        sentences: [
          s(
            '我想去，可是没有时间。',
            'wǒ xiǎng qù, kěshì méiyǒu shíjiān.',
            "I'd like to go, but I don't have time.",
          ),
          s(
            '尽管很累，他却很开心。',
            'jǐnguǎn hěn lèi, tā què hěn kāixīn.',
            "Although he's tired, he's happy.",
          ),
          s(
            '这件衣服很漂亮，不过有点贵。',
            'zhè jiàn yīfu hěn piàoliang, búguò yǒudiǎn guì.',
            "This top is lovely, but it's a bit expensive.",
          ),
        ],
      },
      {
        id: 'h4-u15-l3',
        title: 'Ifs and buts',
        words: ['要是', '即使', '既然', '否则', '不管', '无论'],
        grammar: 'jishi-ye',
        sentences: [
          s('即使下雨，我也要去。', 'jíshǐ xià yǔ, wǒ yě yào qù.', "Even if it rains, I'm going."),
          s(
            '快点，否则我们要迟到了。',
            'kuài diǎn, fǒuzé wǒmen yào chídào le.',
            "Hurry up, or we'll be late.",
          ),
          s(
            '不管多忙，他都会给妈妈打电话。',
            'bùguǎn duō máng, tā dōu huì gěi māma dǎ diànhuà.',
            'However busy he is, he always calls his mum.',
          ),
        ],
      },
      {
        id: 'h4-u15-l4',
        title: 'Causes',
        words: ['由于', '因此', '于是', '原因', '引起', '使'],
        grammar: 'youyu-yinci',
        sentences: [
          s(
            '由于下雨，比赛推迟了。',
            'yóuyú xià yǔ, bǐsài tuīchí le.',
            'Because of the rain, the match was postponed.',
          ),
          s('你知道原因吗？', 'nǐ zhīdào yuányīn ma?', 'Do you know why?'),
          s(
            '这个消息使他很高兴。',
            'zhège xiāoxi shǐ tā hěn gāoxìng.',
            'The news made him very happy.',
          ),
        ],
      },
      {
        id: 'h4-u15-l5',
        title: 'For example',
        words: ['比如', '例如', '其中', '其次', '首先', '另外'],
        sentences: [
          s(
            '我喜欢很多水果，比如苹果和西瓜。',
            'wǒ xǐhuan hěn duō shuǐguǒ, bǐrú píngguǒ hé xīguā.',
            'I like lots of fruit, like apples and watermelon.',
          ),
          s(
            '首先，我们要准备材料。',
            'shǒuxiān, wǒmen yào zhǔnbèi cáiliào.',
            'First, we need to get the materials ready.',
          ),
          s(
            '另外，别忘记带护照。',
            'lìngwài, bié wàngjì dài hùzhào.',
            "Also, don't forget your passport.",
          ),
        ],
      },
      {
        id: 'h4-u15-l6',
        title: 'According to',
        words: ['按照', '通过', '对于', '随着', '由', '以'],
        sentences: [
          s(
            '请按照老师说的做。',
            'qǐng ànzhào lǎoshī shuō de zuò.',
            'Please do as the teacher says.',
          ),
          s('我通过了考试！', 'wǒ tōngguò le kǎoshì!', 'I passed the exam!'),
          s('这个任务由我负责。', 'zhège rènwu yóu wǒ fùzé.', "I'm in charge of this task."),
        ],
      },
    ],
  },
  {
    id: 'h4-u16',
    hskLevel: 4,
    title: 'How much and how often',
    description: 'Degree, frequency, likelihood and amounts.',
    lessons: [
      {
        id: 'h4-u16-l1',
        title: 'Very and quite',
        words: ['十分', '挺', '稍微', '尤其', '实在', '确实'],
        sentences: [
          s('这个菜挺好吃的。', 'zhège cài tǐng hǎochī de.', 'This dish is pretty good.'),
          s('我实在太累了。', 'wǒ shízài tài lèi le.', "I'm really exhausted."),
          s(
            '我喜欢运动，尤其是游泳。',
            'wǒ xǐhuan yùndòng, yóuqí shì yóuyǒng.',
            'I like sport, especially swimming.',
          ),
        ],
      },
      {
        id: 'h4-u16-l2',
        title: 'How often',
        words: ['往往', '偶尔', '平时', '从来', '仍然', '到处'],
        sentences: [
          s('我平时七点起床。', 'wǒ píngshí qī diǎn qǐchuáng.', 'I usually get up at seven.'),
          s('我偶尔喝咖啡。', "wǒ ǒu'ěr hē kāfēi.", 'I drink coffee now and then.'),
          s(
            '我从来没去过长城。',
            'wǒ cónglái méi qù guo Chángchéng.',
            "I've never been to the Great Wall.",
          ),
        ],
      },
      {
        id: 'h4-u16-l3',
        title: 'Probably',
        words: ['也许', '大概', '大约', '估计', '恐怕', '好像'],
        grammar: 'jiran-jiu',
        sentences: [
          s('他大概不来了。', 'tā dàgài bù lái le.', "He probably isn't coming."),
          s('恐怕明天会下雨。', 'kǒngpà míngtiān huì xià yǔ.', "I'm afraid it'll rain tomorrow."),
          s('他好像生病了。', 'tā hǎoxiàng shēngbìng le.', 'He seems to be ill.'),
        ],
      },
      {
        id: 'h4-u16-l4',
        title: 'Really and truly',
        words: ['究竟', '到底', '难道', '千万', '肯定', '完全'],
        grammar: 'nandao',
        sentences: [
          s('你到底去不去？', 'nǐ dàodǐ qù bu qù?', 'So are you going or not?'),
          s('难道你不知道吗？', 'nándào nǐ bù zhīdào ma?', "Don't tell me you didn't know?"),
          s('千万别告诉他！', 'qiānwàn bié gàosu tā!', 'Whatever you do, don’t tell him!'),
        ],
      },
      {
        id: 'h4-u16-l5',
        title: 'Then and now',
        words: ['刚', '当时', '本来', '原来', '永远', '暂时'],
        sentences: [
          s('我刚到家。', 'wǒ gāng dào jiā.', "I've just got home."),
          s(
            '我本来想去，可是太忙了。',
            'wǒ běnlái xiǎng qù, kěshì tài máng le.',
            'I meant to go, but I was too busy.',
          ),
          s('原来是你！', 'yuánlái shì nǐ!', "Oh, it's you!"),
        ],
      },
      {
        id: 'h4-u16-l6',
        title: 'Amounts',
        words: ['百分之', '倍', '左右', '至少', '全部', '部分'],
        sentences: [
          s(
            '他的工资是我的两倍。',
            'tā de gōngzī shì wǒ de liǎng bèi.',
            'He earns twice as much as me.',
          ),
          s(
            '百分之八十的学生通过了考试。',
            'bǎifēnzhī bāshí de xuésheng tōngguò le kǎoshì.',
            'Eighty percent of the students passed the exam.',
          ),
          s(
            '从这里到机场至少要一个小时。',
            'cóng zhèlǐ dào jīchǎng zhìshǎo yào yí gè xiǎoshí.',
            'It takes at least an hour from here to the airport.',
          ),
        ],
      },
      {
        id: 'h4-u16-l7',
        title: 'All and any',
        words: ['所有', '任何', '一切', '无', '之', '咱们'],
        grammar: 'buguan-dou',
        sentences: [
          s('咱们一起走。', 'zánmen yìqǐ zǒu.', "Let's go together."),
          s('所有的人都来了。', 'suǒyǒu de rén dōu lái le.', 'Everyone came.'),
          s(
            '有任何问题，都可以问我。',
            'yǒu rènhé wèntí, dōu kěyǐ wèn wǒ.',
            'If you have any questions at all, ask me.',
          ),
        ],
      },
      {
        id: 'h4-u16-l8',
        title: 'Order and numbers',
        words: ['顺序', '排列', '秒', '数字', '台', '座'],
        sentences: [
          s('请按照顺序排队。', 'qǐng ànzhào shùnxù páiduì.', 'Please queue in order.'),
          s('我家有两台电脑。', 'wǒ jiā yǒu liǎng tái diànnǎo.', 'We have two computers at home.'),
          s('这座城市很漂亮。', 'zhè zuò chéngshì hěn piàoliang.', 'This city is beautiful.'),
        ],
      },
      {
        id: 'h4-u16-l9',
        title: 'Whatever',
        words: ['随便', '最好', '是否', '不得不', '差不多', '连'],
        grammar: 'lian-dou',
        sentences: [
          s(
            '你想吃什么？随便。',
            'nǐ xiǎng chī shénme? suíbiàn.',
            'What do you want to eat? Anything.',
          ),
          s(
            '你最好先问老师。',
            'nǐ zuìhǎo xiān wèn lǎoshī.',
            "You'd better ask the teacher first.",
          ),
          s(
            '他忙得连睡觉的时间都没有。',
            'tā máng de lián shuìjiào de shíjiān dōu méiyǒu.',
            "He's so busy he doesn't even have time to sleep.",
          ),
          s(
            '下雨了，我不得不回家。',
            'xià yǔ le, wǒ bùdébù huí jiā.',
            'It started raining, so I had to go home.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u17',
    hskLevel: 4,
    title: 'Things happen',
    description: 'Accidents, reactions, judging and treating people.',
    scenario: 'emergencies',
    lessons: [
      {
        id: 'h4-u17-l1',
        title: 'Accidents',
        words: ['丢', '掉', '破', '弄', '照', '响'],
        sentences: [
          s('我的钱包丢了。', 'wǒ de qiánbāo diū le.', "I've lost my wallet."),
          s('衣服破了。', 'yīfu pò le.', 'My clothes are torn.'),
          s('手机响了。', 'shǒujī xiǎng le.', 'The phone rang.'),
        ],
      },
      {
        id: 'h4-u17-l2',
        title: 'Getting and giving',
        words: ['获得', '受到', '接受', '拒绝', '缺少'],
        sentences: [
          s(
            '他获得了这次比赛的第一。',
            'tā huòdé le zhè cì bǐsài de dì yī.',
            'He won first place in this competition.',
          ),
          s('他拒绝了我的邀请。', 'tā jùjué le wǒ de yāoqǐng.', 'He turned down my invitation.'),
          s('我接受你的道歉。', 'wǒ jiēshòu nǐ de dàoqiàn.', 'I accept your apology.'),
        ],
      },
      {
        id: 'h4-u17-l3',
        title: 'More or less',
        words: ['改变', '增加', '减少', '降低', '超过', '成为'],
        sentences: [
          s('他改变了主意。', 'tā gǎibiàn le zhǔyi.', 'He changed his mind.'),
          s(
            '我想成为一个好老师。',
            'wǒ xiǎng chéngwéi yí gè hǎo lǎoshī.',
            'I want to become a good teacher.',
          ),
          s('温度降低了。', 'wēndù jiàngdī le.', 'The temperature has dropped.'),
        ],
      },
      {
        id: 'h4-u17-l4',
        title: 'Thinking it through',
        words: ['猜', '判断', '怀疑', '证明', '理解', '回忆'],
        sentences: [
          s('你猜猜我是谁。', 'nǐ cāicai wǒ shì shéi.', 'Guess who I am.'),
          s('我理解你的心情。', 'wǒ lǐjiě nǐ de xīnqíng.', 'I understand how you feel.'),
          s(
            '我怀疑他说的不是真的。',
            'wǒ huáiyí tā shuō de bú shì zhēn de.',
            "I suspect what he said isn't true.",
          ),
        ],
      },
      {
        id: 'h4-u17-l5',
        title: 'Treating people',
        words: ['鼓励', '表扬', '提醒', '陪', '骗', '尊重'],
        sentences: [
          s('老师表扬了我。', 'lǎoshī biǎoyáng le wǒ.', 'The teacher praised me.'),
          s('我陪你去医院。', 'wǒ péi nǐ qù yīyuàn.', "I'll go to the hospital with you."),
          s('我们要尊重别人。', 'wǒmen yào zūnzhòng biérén.', 'We should respect other people.'),
        ],
      },
      {
        id: 'h4-u17-l6',
        title: 'What happened',
        words: ['发生', '出现', '反映', '表示', '情况', '困难'],
        sentences: [
          s('发生了什么？', 'fāshēng le shénme?', 'What happened?'),
          s('现在的情况怎么样？', 'xiànzài de qíngkuàng zěnmeyàng?', "How's the situation now?"),
          s('有困难就告诉我。', 'yǒu kùnnan jiù gàosu wǒ.', 'If you run into trouble, tell me.'),
        ],
      },
      {
        id: 'h4-u17-l7',
        title: 'On purpose',
        words: ['敢', '故意', '假', '当', '干', '可惜'],
        grammar: 'fouze',
        sentences: [
          s('对不起，我不是故意的。', 'duìbuqǐ, wǒ bú shì gùyì de.', "Sorry, I didn't mean to."),
          s('我不敢一个人去。', 'wǒ bù gǎn yí gè rén qù.', "I don't dare go on my own."),
          s('你在干什么？', 'nǐ zài gàn shénme?', 'What are you doing?'),
          s('太可惜了！', 'tài kěxī le!', 'What a shame!'),
        ],
      },
    ],
  },
  {
    id: 'h4-u18',
    hskLevel: 4,
    title: 'Describing things',
    description: 'Exact, complicated, heavy, deep, same or different, worth it.',
    lessons: [
      {
        id: 'h4-u18-l1',
        title: 'Right and wrong',
        words: ['准确', '仔细', '详细', '直接', '复杂', '正式'],
        sentences: [
          s('请仔细看。', 'qǐng zǐxì kàn.', 'Please look carefully.'),
          s('这个问题很复杂。', 'zhège wèntí hěn fùzá.', 'This problem is complicated.'),
          s('你直接告诉我。', 'nǐ zhíjiē gàosu wǒ.', 'Just tell me straight.'),
        ],
      },
      {
        id: 'h4-u18-l2',
        title: 'Big and small',
        words: ['低', '底', '深', '重', '空', '内'],
        sentences: [
          s('这个包很重。', 'zhège bāo hěn zhòng.', 'This bag is heavy.'),
          s('这里的水很深。', 'zhèlǐ de shuǐ hěn shēn.', 'The water here is deep.'),
          s('你明天有空吗？', 'nǐ míngtiān yǒu kòng ma?', 'Are you free tomorrow?'),
        ],
      },
      {
        id: 'h4-u18-l3',
        title: 'Same or different',
        words: ['相同', '区别', '特点', '方面', '范围', '实际'],
        sentences: [
          s(
            '这两个字有什么区别？',
            'zhè liǎng gè zì yǒu shénme qūbié?',
            "What's the difference between these two characters?",
          ),
          s('我们的爱好相同。', 'wǒmen de àihào xiāngtóng.', 'We have the same hobbies.'),
          s(
            '每个城市都有自己的特点。',
            'měi gè chéngshì dōu yǒu zìjǐ de tèdiǎn.',
            'Every city has its own character.',
          ),
        ],
      },
      {
        id: 'h4-u18-l4',
        title: 'Worth it',
        words: ['好处', '值得', '适合', '适应', '熟悉', '重视'],
        sentences: [
          s('这本书值得看。', 'zhè běn shū zhíde kàn.', 'This book is worth reading.'),
          s('运动有很多好处。', 'yùndòng yǒu hěn duō hǎochù.', 'Exercise has lots of benefits.'),
          s(
            '我已经适应了这里的生活。',
            'wǒ yǐjīng shìyìng le zhèlǐ de shēnghuó.',
            "I've got used to life here.",
          ),
          s('我对这里不太熟悉。', 'wǒ duì zhèlǐ bú tài shúxī.', "I don't know this area well."),
        ],
      },
    ],
  },
  {
    id: 'h4-u19',
    hskLevel: 4,
    title: 'More everyday words',
    description: 'Home, food, people, nature and actions that round off HSK 4.',
    lessons: [
      {
        id: 'h4-u19-l1',
        title: 'Around the house',
        words: ['墙', '镜子', '洗衣机', '修', '亮', '暗'],
        sentences: [
          s('墙上有一个镜子。', 'qiáng shàng yǒu yí gè jìngzi.', "There's a mirror on the wall."),
          s(
            '洗衣机坏了，我们要找人修。',
            'xǐyījī huài le, wǒmen yào zhǎo rén xiū.',
            "The washing machine's broken; we need someone to fix it.",
          ),
          s(
            '房间里太暗了，开灯吧。',
            'fángjiān lǐ tài àn le, kāi dēng ba.',
            "It's too dark in here. Let's turn the light on.",
          ),
        ],
      },
      {
        id: 'h4-u19-l2',
        title: 'Food and money',
        words: ['西红柿', '食品', '饮料', '市场', '人民币', '请客'],
        sentences: [
          s(
            '我去市场买西红柿。',
            'wǒ qù shìchǎng mǎi xīhóngshì.',
            "I'm going to the market to buy tomatoes.",
          ),
          s('今天我请客！', 'jīntiān wǒ qǐngkè!', "Today it's my treat!"),
          s(
            '这些饮料一共二十块人民币。',
            'zhèxiē yǐnliào yígòng èrshí kuài rénmínbì.',
            'These drinks come to twenty yuan in all.',
          ),
        ],
      },
      {
        id: 'h4-u19-l3',
        title: 'People',
        words: ['大夫', '研究生', '作者', '俩', '群', '精神'],
        sentences: [
          s('我哥哥是大夫。', 'wǒ gēge shì dàifu.', 'My older brother is a doctor.'),
          s('我们俩都是研究生。', 'wǒmen liǎ dōu shì yánjiūshēng.', "We're both postgraduates."),
          s('你今天很精神！', 'nǐ jīntiān hěn jīngshen!', 'You look full of energy today!'),
        ],
      },
      {
        id: 'h4-u19-l4',
        title: 'Countryside',
        words: ['风景', '农村', '猴子', '狮子', '朵', '干燥', '湿润'],
        sentences: [
          s(
            '农村的风景很漂亮。',
            'nóngcūn de fēngjǐng hěn piàoliang.',
            'The countryside scenery is beautiful.',
          ),
          s(
            '北京的天气很干燥。',
            'Běijīng de tiānqì hěn gānzào.',
            'The weather in Beijing is very dry.',
          ),
          s('我送她一朵花。', 'wǒ sòng tā yì duǒ huā.', 'I gave her a flower.'),
        ],
      },
      {
        id: 'h4-u19-l5',
        title: 'Shapes and sizes',
        words: ['宽', '窄', '圆', '软', '整齐', '高级'],
        sentences: [
          s('这条路很窄。', 'zhè tiáo lù hěn zhǎi.', 'This road is narrow.'),
          s('他的房间非常整齐。', 'tā de fángjiān fēicháng zhěngqí.', 'His room is really tidy.'),
          s('这个沙发很软。', 'zhège shāfā hěn ruǎn.', 'This sofa is soft.'),
        ],
      },
      {
        id: 'h4-u19-l6',
        title: 'Doing things',
        words: ['弹', '断', '撞', '醒', '握手', '流泪'],
        sentences: [
          s(
            '我早上六点就醒了。',
            'wǒ zǎoshang liù diǎn jiù xǐng le.',
            'I was awake by six this morning.',
          ),
          s(
            '见面的时候，我们握手。',
            'jiànmiàn de shíhou, wǒmen wòshǒu.',
            'When we meet, we shake hands.',
          ),
          s('我的铅笔断了。', 'wǒ de qiānbǐ duàn le.', 'My pencil broke.'),
        ],
      },
      {
        id: 'h4-u19-l7',
        title: 'Talking',
        words: ['谈', '表达', '发', '访问', '吵', '顿'],
        sentences: [
          s('我们谈了很久。', 'wǒmen tán le hěn jiǔ.', 'We talked for a long time.'),
          s('别吵了！', 'bié chǎo le!', 'Stop arguing!'),
          s('我给你发短信。', 'wǒ gěi nǐ fā duǎnxìn.', "I'll text you."),
          s(
            '我们一起吃了一顿饺子。',
            'wǒmen yìqǐ chī le yí dùn jiǎozi.',
            'We had a meal of dumplings together.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h4-u20',
    hskLevel: 4,
    title: 'More ideas and change',
    description: 'Time, linking words, work and growth that round off HSK 4.',
    lessons: [
      {
        id: 'h4-u20-l1',
        title: 'Suddenly and gradually',
        words: ['刚刚', '后来', '忽然', '逐渐', '果然', '竟然'],
        sentences: [
          s('他刚刚走。', 'tā gānggang zǒu.', 'He just left.'),
          s('忽然下雨了。', 'hūrán xià yǔ le.', 'Suddenly it started raining.'),
          s(
            '天气逐渐暖和了。',
            'tiānqì zhújiàn nuǎnhuo le.',
            'The weather is gradually getting warmer.',
          ),
        ],
      },
      {
        id: 'h4-u20-l2',
        title: 'As long as',
        words: ['不但', '只要', '只好', '极其', '分之', '算'],
        sentences: [
          s(
            '只要你努力，就能成功。',
            'zhǐyào nǐ nǔlì, jiù néng chénggōng.',
            'As long as you work hard, you can succeed.',
          ),
          s(
            '没有出租车，我只好走回家。',
            'méiyǒu chūzūchē, wǒ zhǐhǎo zǒu huí jiā.',
            'There were no taxis, so I had to walk home.',
          ),
          s(
            '他不但聪明，而且很努力。',
            'tā búdàn cōngming, érqiě hěn nǔlì.',
            "He's not only clever but also hardworking.",
          ),
        ],
      },
      {
        id: 'h4-u20-l3',
        title: 'Business',
        words: ['做生意', '代表', '组织', '工具', '制造', '经历'],
        sentences: [
          s('他在做生意。', 'tā zài zuò shēngyi.', "He's in business."),
          s(
            '这是一次很好的经历。',
            'zhè shì yí cì hěn hǎo de jīnglì.',
            'It was a great experience.',
          ),
          s(
            '他代表我们公司参加会议。',
            'tā dàibiǎo wǒmen gōngsī cānjiā huìyì.',
            'He is representing our company at the meeting.',
          ),
        ],
      },
      {
        id: 'h4-u20-l4',
        title: 'Growing and stopping',
        words: ['增长', '扩大', '限制', '停止', '代替', '包括'],
        sentences: [
          s(
            '公司的收入增长了。',
            'gōngsī de shōurù zēngzhǎng le.',
            "The company's income has grown.",
          ),
          s('没有人能代替你。', 'méiyǒu rén néng dàitì nǐ.', 'Nobody can replace you.'),
          s(
            '这个价格包括两个人。',
            'zhège jiàgé bāokuò liǎng gè rén.',
            'This price covers two people.',
          ),
        ],
      },
      {
        id: 'h4-u20-l5',
        title: 'Taking the lead',
        words: ['主动', '信任', '集合', '组成', '当地', '行'],
        sentences: [
          s(
            '我们八点在门口集合。',
            'wǒmen bā diǎn zài ménkǒu jíhé.',
            "We'll meet at the door at eight.",
          ),
          s('我很信任他。', 'wǒ hěn xìnrèn tā.', 'I trust him completely.'),
          s(
            '明天见面，行吗？',
            'míngtiān jiànmiàn, xíng ma?',
            'Can we meet tomorrow? Does that work?',
          ),
        ],
      },
      {
        id: 'h4-u20-l6',
        title: 'Big numbers',
        words: ['亿', '血', '笔记本', '成熟', '现代', '精彩'],
        sentences: [
          s('中国有十四亿人。', 'Zhōngguó yǒu shísì yì rén.', 'China has 1.4 billion people.'),
          s('这场比赛非常精彩。', 'zhè chǎng bǐsài fēicháng jīngcǎi.', 'This match is brilliant.'),
          s(
            '他比以前成熟了。',
            'tā bǐ yǐqián chéngshú le.',
            "He's more mature than he used to be.",
          ),
        ],
      },
    ],
  },
];
