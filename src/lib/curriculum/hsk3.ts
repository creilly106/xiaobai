import type { PathSentence, Unit } from './types';

const s = (hanzi: string, pinyin: string, meaning: string): PathSentence => ({
  hanzi,
  pinyin,
  meaning,
});

// HSK 3 (2012): all 289 words in 48 lessons, building on HSK 1–2.
export const hsk3Units: Unit[] = [
  {
    id: 'h3-u1',
    hskLevel: 3,
    title: 'People',
    description: 'Family, neighbours, and describing someone.',
    scenario: 'relationships',
    lessons: [
      {
        id: 'h3-u1-l1',
        title: 'Family and neighbours',
        words: ['阿姨', '叔叔', '奶奶', '爷爷', '邻居', '客人'],
        sentences: [
          s('我奶奶八十岁了。', 'wǒ nǎinai bāshí suì le.', 'My grandma is eighty.'),
          s('我们的邻居很好。', 'wǒmen de línjū hěn hǎo.', 'Our neighbours are really nice.'),
          s('家里来了客人。', 'jiā lǐ lái le kèrén.', "We've got guests at home."),
        ],
      },
      {
        id: 'h3-u1-l2',
        title: 'What people look like',
        words: ['个子', '矮', '胖', '瘦', '年轻', '老'],
        sentences: [
          s('他个子很高。', 'tā gèzi hěn gāo.', "He's tall."),
          s('我妈妈很年轻。', 'wǒ māma hěn niánqīng.', 'My mum is young.'),
          s('他比我瘦。', 'tā bǐ wǒ shòu.', "He's thinner than me."),
        ],
      },
      {
        id: 'h3-u1-l3',
        title: 'Face and body',
        words: ['脸', '鼻子', '耳朵', '嘴', '头发', '腿', '脚'],
        sentences: [
          s('她的头发很长。', 'tā de tóufa hěn cháng.', 'Her hair is long.'),
          s('我的脚很大。', 'wǒ de jiǎo hěn dà.', 'My feet are big.'),
          s('他的脸红了。', 'tā de liǎn hóng le.', 'He went red.'),
        ],
      },
      {
        id: 'h3-u1-l4',
        title: 'Personality',
        words: ['聪明', '可爱', '热情', '认真', '努力', '奇怪'],
        grammar: 'budan-erqie',
        sentences: [
          s('这个孩子很聪明。', 'zhège háizi hěn cōngming.', 'This child is very clever.'),
          s('他学习很努力。', 'tā xuéxí hěn nǔlì.', 'He studies hard.'),
          s(
            '我的邻居非常热情。',
            'wǒ de línjū fēicháng rèqíng.',
            'My neighbour is really friendly.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h3-u2',
    hskLevel: 3,
    title: 'Feelings',
    description: 'Moods, hunger, and looking after each other.',
    scenario: 'at-the-doctor',
    lessons: [
      {
        id: 'h3-u2-l1',
        title: 'How you feel',
        words: ['生气', '难过', '害怕', '担心', '着急', '满意'],
        sentences: [
          s('别生气了。', 'bié shēngqì le.', "Don't be angry."),
          s('你别担心。', 'nǐ bié dānxīn.', "Don't worry."),
          s('老师很满意。', 'lǎoshī hěn mǎnyì.', 'The teacher is very pleased.'),
        ],
      },
      {
        id: 'h3-u2-l2',
        title: 'Hungry, full, sore',
        words: ['饿', '渴', '饱', '舒服', '疼', '哭'],
        sentences: [
          s('我饿了。', 'wǒ è le.', "I'm hungry."),
          s('我吃饱了。', 'wǒ chī bǎo le.', "I'm full."),
          s('孩子为什么哭？', 'háizi wèishénme kū?', 'Why is the child crying?'),
        ],
      },
      {
        id: 'h3-u2-l3',
        title: 'Taking care',
        words: ['关心', '放心', '照顾', '小心', '注意', '相信'],
        sentences: [
          s('小心！', 'xiǎoxīn!', 'Careful!'),
          s('我会照顾妈妈。', 'wǒ huì zhàogù māma.', "I'll look after Mum."),
          s('我相信你。', 'wǒ xiāngxìn nǐ.', 'I believe you.'),
        ],
      },
    ],
  },
  {
    id: 'h3-u3',
    hskLevel: 3,
    title: 'At home',
    description: 'Your building, chores, the kitchen, and guests.',
    scenario: 'renting-a-flat',
    lessons: [
      {
        id: 'h3-u3-l1',
        title: 'Around the building',
        words: ['冰箱', '空调', '灯', '电梯', '楼', '层'],
        grammar: 'directional-complements',
        sentences: [
          s('我家在五层。', 'wǒ jiā zài wǔ céng.', 'I live on the fifth floor.'),
          s('请开灯。', 'qǐng kāi dēng.', 'Please turn on the light.'),
          s('冰箱里有牛奶。', 'bīngxiāng lǐ yǒu niúnǎi.', "There's milk in the fridge."),
        ],
      },
      {
        id: 'h3-u3-l2',
        title: 'Chores',
        words: ['打扫', '干净', '洗澡', '刷牙', '放', '搬'],
        sentences: [
          s('我要打扫房间。', 'wǒ yào dǎsǎo fángjiān.', 'I need to clean my room.'),
          s('房间很干净。', 'fángjiān hěn gānjìng.', 'The room is very clean.'),
          s('我们下个月搬家。', 'wǒmen xià ge yuè bān jiā.', "We're moving next month."),
        ],
      },
      {
        id: 'h3-u3-l3',
        title: 'In the kitchen',
        words: ['筷子', '盘子', '碗', '瓶子', '伞', '包'],
        sentences: [
          s(
            '桌子上有两个碗。',
            'zhuōzi shang yǒu liǎng ge wǎn.',
            'There are two bowls on the table.',
          ),
          s('这是你的包吗？', 'zhè shì nǐ de bāo ma?', 'Is this your bag?'),
        ],
      },
      {
        id: 'h3-u3-l4',
        title: 'Helping out',
        words: ['帮忙', '欢迎', '试', '关', '起来', '一边'],
        grammar: 'reduplication',
        sentences: [
          s('欢迎你来我家！', 'huānyíng nǐ lái wǒ jiā!', 'Welcome to my home!'),
          s('请关门。', 'qǐng guān mén.', 'Please close the door.'),
          s('我可以试试吗？', 'wǒ kěyǐ shìshi ma?', 'Can I try?'),
          s('你能帮忙吗？', 'nǐ néng bāngmáng ma?', 'Can you help?'),
        ],
      },
    ],
  },
  {
    id: 'h3-u4',
    hskLevel: 3,
    title: 'Food and shopping',
    description: 'Treats, clothes, paying, and choosing.',
    scenario: 'shopping',
    lessons: [
      {
        id: 'h3-u4-l1',
        title: 'Treats',
        words: ['蛋糕', '面包', '香蕉', '啤酒', '新鲜', '甜'],
        sentences: [
          s('这个蛋糕太甜了。', 'zhège dàngāo tài tián le.', 'This cake is too sweet.'),
          s('我早上吃面包。', 'wǒ zǎoshang chī miànbāo.', 'I have bread in the morning.'),
          s('这些水果很新鲜。', 'zhèxiē shuǐguǒ hěn xīnxiān.', 'This fruit is really fresh.'),
        ],
      },
      {
        id: 'h3-u4-l2',
        title: 'Clothes',
        words: ['衬衫', '裤子', '裙子', '帽子', '双', '条'],
        grammar: 'zhe-ongoing-state',
        sentences: [
          s('她穿着一条红裙子。', 'tā chuān zhe yì tiáo hóng qúnzi.', "She's wearing a red skirt."),
          s(
            '我想买一件白衬衫。',
            'wǒ xiǎng mǎi yí jiàn bái chènshān.',
            'I want to buy a white shirt.',
          ),
          s('这条裤子太长了。', 'zhè tiáo kùzi tài cháng le.', 'These trousers are too long.'),
        ],
      },
      {
        id: 'h3-u4-l3',
        title: 'At the supermarket',
        words: ['超市', '信用卡', '元', '一共', '花', '换'],
        sentences: [
          s('一共多少钱？', 'yígòng duōshao qián?', 'How much altogether?'),
          s(
            '我去超市买东西。',
            'wǒ qù chāoshì mǎi dōngxi.',
            "I'm going to the supermarket to buy some things.",
          ),
          s('我花了一百元。', 'wǒ huā le yìbǎi yuán.', 'I spent 100 yuan.'),
        ],
      },
      {
        id: 'h3-u4-l4',
        title: 'Choosing',
        words: ['蓝', '绿', '菜单', '选择', '还是', '或者'],
        grammar: 'haishi-huozhe',
        sentences: [
          s(
            '你喜欢蓝的还是绿的？',
            'nǐ xǐhuan lán de háishi lǜ de?',
            'Do you like the blue one or the green one?',
          ),
          s('你喝茶还是喝咖啡？', 'nǐ hē chá háishi hē kāfēi?', 'Tea or coffee?'),
          s('请给我菜单。', 'qǐng gěi wǒ càidān.', 'Please give me the menu.'),
        ],
      },
    ],
  },
  {
    id: 'h3-u5',
    hskLevel: 3,
    title: 'Getting around',
    description: 'Transport, directions, travel, and places in town.',
    scenario: 'getting-around',
    lessons: [
      {
        id: 'h3-u5-l1',
        title: 'Transport',
        words: ['地铁', '自行车', '司机', '骑', '站', '地图'],
        sentences: [
          s('我骑自行车上班。', 'wǒ qí zìxíngchē shàngbān.', 'I cycle to work.'),
          s('我们坐地铁去。', 'wǒmen zuò dìtiě qù.', "We'll take the subway."),
          s('他是出租车司机。', 'tā shì chūzūchē sījī.', "He's a taxi driver."),
        ],
      },
      {
        id: 'h3-u5-l2',
        title: 'Directions',
        words: ['东', '南', '西', '北方', '附近', '中间'],
        sentences: [
          s('这附近有超市吗？', 'zhè fùjìn yǒu chāoshì ma?', 'Is there a supermarket near here?'),
          s('他是北方人。', 'tā shì běifāng rén.', "He's from the north."),
          s(
            '医院在学校和商店中间。',
            'yīyuàn zài xuéxiào hé shāngdiàn zhōngjiān.',
            'The hospital is between the school and the shop.',
          ),
        ],
      },
      {
        id: 'h3-u5-l3',
        title: 'Travelling',
        words: ['护照', '行李箱', '起飞', '离开', '经过', '街道'],
        grammar: 'shi-de',
        sentences: [
          s('飞机几点起飞？', 'fēijī jǐ diǎn qǐfēi?', 'What time does the plane take off?'),
          s(
            '我的护照在行李箱里。',
            'wǒ de hùzhào zài xínglixiāng lǐ.',
            'My passport is in the suitcase.',
          ),
          s('他昨天离开了北京。', 'tā zuótiān líkāi le Běijīng.', 'He left Beijing yesterday.'),
        ],
      },
      {
        id: 'h3-u5-l4',
        title: 'Around town',
        words: ['城市', '银行', '公园', '图书馆', '洗手间', '地方'],
        sentences: [
          s(
            '请问，洗手间在哪儿？',
            'qǐngwèn, xǐshǒujiān zài nǎr?',
            "Excuse me, where's the toilet?",
          ),
          s('我们去公园走走。', 'wǒmen qù gōngyuán zǒuzou.', "We're going for a walk in the park."),
          s('这个城市很大。', 'zhège chéngshì hěn dà.', 'This city is big.'),
        ],
      },
    ],
  },
  {
    id: 'h3-u6',
    hskLevel: 3,
    title: 'Nature',
    description: 'Seasons, the sky, animals, and the world.',
    scenario: 'weather',
    lessons: [
      {
        id: 'h3-u6-l1',
        title: 'Seasons',
        words: ['春', '夏', '秋', '冬', '季节', '刮风'],
        sentences: [
          s('你最喜欢哪个季节？', 'nǐ zuì xǐhuan nǎge jìjié?', 'Which season do you like best?'),
          s('今天刮风了。', 'jīntiān guā fēng le.', "It's windy today."),
        ],
      },
      {
        id: 'h3-u6-l2',
        title: 'Sky and trees',
        words: ['太阳', '月亮', '云', '树', '草', '鸟'],
        sentences: [
          s(
            '今天的月亮很漂亮。',
            'jīntiān de yuèliang hěn piàoliang.',
            'The moon is beautiful tonight.',
          ),
          s('树上有鸟。', 'shù shang yǒu niǎo.', 'There are birds in the tree.'),
          s('太阳出来了。', 'tàiyáng chūlái le.', "The sun's come out."),
        ],
      },
      {
        id: 'h3-u6-l3',
        title: 'Animals and the world',
        words: ['动物', '熊猫', '马', '黄河', '世界', '国家'],
        sentences: [
          s(
            '熊猫是中国的动物。',
            'xióngmāo shì Zhōngguó de dòngwù.',
            'Pandas are a Chinese animal.',
          ),
          s('你去过哪些国家？', 'nǐ qù guo nǎxiē guójiā?', 'Which countries have you been to?'),
          s(
            '黄河在中国北方。',
            'Huánghé zài Zhōngguó běifāng.',
            'The Yellow River is in northern China.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h3-u7',
    hskLevel: 3,
    title: 'School',
    description: 'Classes, studying, and remembering.',
    scenario: 'school-classroom',
    lessons: [
      {
        id: 'h3-u7-l1',
        title: 'At school',
        words: ['年级', '班', '校长', '黑板', '数学', '体育'],
        sentences: [
          s('你上几年级？', 'nǐ shàng jǐ niánjí?', 'What year are you in?'),
          s(
            '我们班有二十个学生。',
            'wǒmen bān yǒu èrshí ge xuésheng.',
            'There are twenty students in our class.',
          ),
          s('我喜欢数学。', 'wǒ xǐhuan shùxué.', 'I like maths.'),
        ],
      },
      {
        id: 'h3-u7-l2',
        title: 'Studying',
        words: ['复习', '练习', '作业', '词典', '句子', '成绩'],
        sentences: [
          s('我在复习。', 'wǒ zài fùxí.', "I'm revising."),
          s('你的作业做完了吗？', 'nǐ de zuòyè zuò wán le ma?', 'Have you finished your homework?'),
          s('这个句子是什么意思？', 'zhège jùzi shì shénme yìsi?', 'What does this sentence mean?'),
        ],
      },
      {
        id: 'h3-u7-l3',
        title: 'Easy or hard?',
        words: ['明白', '了解', '清楚', '简单', '容易', '难'],
        grammar: 'suiran-danshi',
        sentences: [
          s('我明白了。', 'wǒ míngbai le.', 'I get it now.'),
          s('汉语不太难。', 'Hànyǔ bú tài nán.', "Chinese isn't too hard."),
          s(
            '虽然很难，但是很有意思。',
            'suīrán hěn nán, dànshì hěn yǒu yìsi.',
            "It's hard, but really interesting.",
          ),
        ],
      },
      {
        id: 'h3-u7-l4',
        title: 'Teaching and remembering',
        words: ['回答', '讲', '教', '借', '记得', '忘记'],
        sentences: [
          s('老师教我们汉语。', 'lǎoshī jiāo wǒmen Hànyǔ.', 'The teacher teaches us Chinese.'),
          s('我忘记他的名字了。', 'wǒ wàngjì tā de míngzi le.', "I've forgotten his name."),
          s('我可以借你的书吗？', 'wǒ kěyǐ jiè nǐ de shū ma?', 'Can I borrow your book?'),
        ],
      },
    ],
  },
  {
    id: 'h3-u8',
    hskLevel: 3,
    title: 'Work',
    description: 'The office, getting things done, and making plans.',
    scenario: 'business-work',
    lessons: [
      {
        id: 'h3-u8-l1',
        title: 'At the office',
        words: ['办公室', '经理', '同事', '会议', '请假', '迟到'],
        sentences: [
          s('经理在办公室。', 'jīnglǐ zài bàngōngshì.', 'The manager is in the office.'),
          s('对不起，我迟到了。', 'duìbuqǐ, wǒ chídào le.', "Sorry I'm late."),
          s('我明天想请假。', 'wǒ míngtiān xiǎng qǐngjià.', "I'd like to take tomorrow off."),
        ],
      },
      {
        id: 'h3-u8-l2',
        title: 'Getting it done',
        words: ['解决', '办法', '完成', '结束', '决定', '要求'],
        sentences: [
          s('会议几点结束？', 'huìyì jǐ diǎn jiéshù?', 'What time does the meeting end?'),
          s(
            '我们有办法解决这个问题。',
            'wǒmen yǒu bànfǎ jiějué zhège wèntí.',
            'We have a way to solve this problem.',
          ),
          s('你决定了吗？', 'nǐ juédìng le ma?', 'Have you decided?'),
        ],
      },
      {
        id: 'h3-u8-l3',
        title: 'Must, should, will',
        words: ['打算', '需要', '必须', '应该', '愿意', '同意'],
        grammar: 'xiang-yao-yao',
        sentences: [
          s('你应该休息一下。', 'nǐ yīnggāi xiūxi yíxià.', 'You should take a break.'),
          s('我同意。', 'wǒ tóngyì.', 'I agree.'),
          s(
            '你打算什么时候去中国？',
            'nǐ dǎsuàn shénme shíhou qù Zhōngguó?',
            'When are you planning to go to China?',
          ),
        ],
      },
    ],
  },
  {
    id: 'h3-u9',
    hskLevel: 3,
    title: 'Free time',
    description: 'Hobbies, going out, and keeping fit.',
    scenario: 'hobbies',
    lessons: [
      {
        id: 'h3-u9-l1',
        title: 'Hobbies',
        words: ['爱好', '音乐', '游戏', '画', '故事', '照片'],
        sentences: [
          s('你有什么爱好？', 'nǐ yǒu shénme àihào?', 'What are your hobbies?'),
          s('我喜欢听音乐。', 'wǒ xǐhuan tīng yīnyuè.', 'I like listening to music.'),
          s('这是我画的。', 'zhè shì wǒ huà de.', 'I drew this.'),
        ],
      },
      {
        id: 'h3-u9-l2',
        title: 'Going out',
        words: ['爬山', '聊天', '见面', '上网', '节目', '照相机'],
        grammar: 'yibian',
        sentences: [
          s('我们明天去爬山。', 'wǒmen míngtiān qù pá shān.', "We're going hiking tomorrow."),
          s('我们在哪儿见面？', 'wǒmen zài nǎr jiànmiàn?', 'Where shall we meet?'),
          s(
            '我们一边喝茶一边聊天。',
            'wǒmen yìbiān hē chá yìbiān liáotiān.',
            'We chatted over tea.',
          ),
        ],
      },
      {
        id: 'h3-u9-l3',
        title: 'Sport and health',
        words: ['锻炼', '比赛', '参加', '健康', '感兴趣', '有名'],
        sentences: [
          s('他参加了比赛。', 'tā cānjiā le bǐsài.', 'He took part in the competition.'),
          s('你对什么感兴趣？', 'nǐ duì shénme gǎn xìngqù?', 'What are you interested in?'),
          s(
            '运动对身体健康很好。',
            'yùndòng duì shēntǐ jiànkāng hěn hǎo.',
            'Exercise is good for your health.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h3-u10',
    hskLevel: 3,
    title: 'When things happen',
    description: 'Just now, first and then, how often, and special days.',
    lessons: [
      {
        id: 'h3-u10-l1',
        title: 'Just now',
        words: ['刚才', '以前', '过去', '最近', '马上', '一会儿'],
        sentences: [
          s('我马上来。', 'wǒ mǎshàng lái.', "I'll be right there."),
          s('你最近怎么样？', 'nǐ zuìjìn zěnmeyàng?', 'How have you been lately?'),
          s('请等一会儿。', 'qǐng děng yíhuìr.', 'Please wait a moment.'),
        ],
      },
      {
        id: 'h3-u10-l2',
        title: 'First, then, finally',
        words: ['先', '然后', '最后', '终于', '突然', '才'],
        grammar: 'xian-ranhou',
        sentences: [
          s(
            '我先刷牙，然后洗澡。',
            'wǒ xiān shuāyá, ránhòu xǐzǎo.',
            "I'll brush my teeth, then shower.",
          ),
          s('你终于来了！', 'nǐ zhōngyú lái le!', "You're here at last!"),
          s('我十点才起床。', 'wǒ shí diǎn cái qǐchuáng.', "I didn't get up until ten."),
        ],
      },
      {
        id: 'h3-u10-l3',
        title: 'How often',
        words: ['经常', '总是', '一直', '又', '久', '半'],
        sentences: [
          s('他经常迟到。', 'tā jīngcháng chídào.', "He's often late."),
          s('你又忘记了！', 'nǐ yòu wàngjì le!', 'You forgot again!'),
          s('我等了半个小时。', 'wǒ děng le bàn ge xiǎoshí.', 'I waited half an hour.'),
        ],
      },
      {
        id: 'h3-u10-l4',
        title: 'Special days',
        words: ['刻', '分', '周末', '节日', '结婚', '礼物'],
        sentences: [
          s('现在三点一刻。', 'xiànzài sān diǎn yí kè.', "It's a quarter past three."),
          s(
            '这个周末你做什么？',
            'zhège zhōumò nǐ zuò shénme?',
            'What are you doing this weekend?',
          ),
          s('这是给你的礼物。', 'zhè shì gěi nǐ de lǐwù.', 'This is a present for you.'),
        ],
      },
    ],
  },
  {
    id: 'h3-u11',
    hskLevel: 3,
    title: 'Linking ideas',
    description: 'If, in order to, compared with, and except.',
    scenario: 'small-talk',
    lessons: [
      {
        id: 'h3-u11-l1',
        title: 'If',
        words: ['如果', '为了', '为', '啊', '只有', '种'],
        grammar: 'ruguo-jiu',
        sentences: [
          s(
            '如果明天下雨，我就不去了。',
            'rúguǒ míngtiān xià yǔ, wǒ jiù bú qù le.',
            "If it rains tomorrow, I won't go.",
          ),
          s(
            '为了学习汉语，他去了中国。',
            'wèile xuéxí Hànyǔ, tā qù le Zhōngguó.',
            'He went to China to study Chinese.',
          ),
          s('你喜欢哪种水果？', 'nǐ xǐhuan nǎ zhǒng shuǐguǒ?', 'What kind of fruit do you like?'),
        ],
      },
      {
        id: 'h3-u11-l2',
        title: 'Comparing',
        words: ['比较', '一样', '更', '像', '越', '极'],
        grammar: 'yue-lai-yue',
        sentences: [
          s(
            '他的汉语越来越好。',
            'tā de Hànyǔ yuè lái yuè hǎo.',
            'His Chinese keeps getting better.',
          ),
          s('你和你妈妈很像。', 'nǐ hé nǐ māma hěn xiàng.', 'You look a lot like your mum.'),
          s('今天比较冷。', 'jīntiān bǐjiào lěng.', "It's fairly cold today."),
        ],
      },
      {
        id: 'h3-u11-l3',
        title: 'How much',
        words: ['特别', '几乎', '多么', '一定', '一般', '只'],
        sentences: [
          s('这个菜特别好吃。', 'zhège cài tèbié hǎochī.', 'This dish is especially good.'),
          s('我一定去。', 'wǒ yídìng qù.', "I'll definitely go."),
          s('我只有十块钱。', 'wǒ zhǐ yǒu shí kuài qián.', 'I only have ten yuan.'),
        ],
      },
      {
        id: 'h3-u11-l4',
        title: 'Actually',
        words: ['其实', '其他', '别人', '自己', '当然', '除了'],
        grammar: 'chule-yiwai',
        sentences: [
          s('其实我不喜欢咖啡。', 'qíshí wǒ bù xǐhuan kāfēi.', "Actually, I don't like coffee."),
          s('当然可以！', 'dāngrán kěyǐ!', 'Of course!'),
          s('除了他，我们都去了。', 'chúle tā, wǒmen dōu qù le.', 'We all went except him.'),
        ],
      },
    ],
  },
  {
    id: 'h3-u12',
    hskLevel: 3,
    title: 'Changes and news',
    description: '把 and 被, improving, opinions, and the wider world.',
    lessons: [
      {
        id: 'h3-u12-l1',
        title: 'Doing things to things',
        words: ['把', '被', '拿', '带', '用', '接'],
        grammar: 'ba-disposal',
        sentences: [
          s('请把门关上。', 'qǐng bǎ mén guān shang.', 'Please shut the door.'),
          s('我去机场接你。', 'wǒ qù jīchǎng jiē nǐ.', "I'll pick you up at the airport."),
          s('你可以用我的电脑。', 'nǐ kěyǐ yòng wǒ de diànnǎo.', 'You can use my computer.'),
        ],
      },
      {
        id: 'h3-u12-l2',
        title: 'Getting better',
        words: ['变化', '发现', '影响', '提高', '水平', '习惯'],
        sentences: [
          s(
            '他的汉语水平提高了很多。',
            'tā de Hànyǔ shuǐpíng tígāo le hěn duō.',
            'His Chinese has improved a lot.',
          ),
          s('这里的变化很大。', 'zhèlǐ de biànhuà hěn dà.', 'This place has changed a lot.'),
          s('我发现他不在家。', 'wǒ fāxiàn tā bú zài jiā.', 'I found he wasn’t home.'),
        ],
      },
      {
        id: 'h3-u12-l3',
        title: 'Opinions',
        words: ['关于', '根据', '向', '跟', '关系', '认为'],
        sentences: [
          s('我认为你说得对。', 'wǒ rènwéi nǐ shuō de duì.', "I think you're right."),
          s('我跟他一起去。', 'wǒ gēn tā yìqǐ qù.', "I'm going with him."),
          s('你跟她是什么关系？', 'nǐ gēn tā shì shénme guānxi?', 'How do you know her?'),
        ],
      },
      {
        id: 'h3-u12-l4',
        title: 'Counting things',
        words: ['位', '段', '口', '角', '米', '万'],
        sentences: [
          s('这位是我的老师。', 'zhè wèi shì wǒ de lǎoshī.', 'This is my teacher.'),
          s('我家有四口人。', 'wǒ jiā yǒu sì kǒu rén.', 'There are four people in my family.'),
          s('他有一米八。', 'tā yǒu yì mǐ bā.', "He's 1.8 metres tall."),
        ],
      },
      {
        id: 'h3-u12-l5',
        title: 'Old and new',
        words: ['旧', '坏', '新闻', '文化', '历史', '留学'],
        grammar: 'bei-passive',
        sentences: [
          s('我的手机坏了。', 'wǒ de shǒujī huài le.', "My phone's broken."),
          s(
            '我对中国历史很感兴趣。',
            'wǒ duì Zhōngguó lìshǐ hěn gǎn xìngqù.',
            "I'm really interested in Chinese history.",
          ),
          s('他在中国留学。', 'tā zài Zhōngguó liúxué.', "He's studying abroad in China."),
        ],
      },
      {
        id: 'h3-u12-l6',
        title: 'Feeling unwell',
        words: ['感冒', '发烧', '检查', '声音', '安静', '方便'],
        sentences: [
          s('我感冒了。', 'wǒ gǎnmào le.', "I've caught a cold."),
          s('请安静！', 'qǐng ānjìng!', 'Quiet, please!'),
          s(
            '医生给我检查了身体。',
            'yīshēng gěi wǒ jiǎnchá le shēntǐ.',
            'The doctor gave me a check-up.',
          ),
        ],
      },
      {
        id: 'h3-u12-l7',
        title: 'Chances',
        words: ['以为', '遇到', '机会', '环境', '主要', '重要'],
        sentences: [
          s('我以为你不来了。', 'wǒ yǐwéi nǐ bù lái le.', "I thought you weren't coming."),
          s('这是一个好机会。', 'zhè shì yí ge hǎo jīhuì.', 'This is a good opportunity.'),
          s('健康最重要。', 'jiànkāng zuì zhòngyào.', 'Health matters most.'),
        ],
      },
      {
        id: 'h3-u12-l8',
        title: 'Odds and ends',
        words: ['差', '电子邮件', '短', '中文', '张', '辆'],
        sentences: [
          s('我的中文还很差。', 'wǒ de Zhōngwén hái hěn chà.', 'My Chinese is still poor.'),
          s('我买了两张票。', 'wǒ mǎi le liǎng zhāng piào.', 'I bought two tickets.'),
          s('这件衣服太短了。', 'zhè jiàn yīfu tài duǎn le.', 'This is too short.'),
        ],
      },
    ],
  },
];
