import type { PathSentence, Unit } from './types';

const s = (hanzi: string, pinyin: string, meaning: string): PathSentence => ({
  hanzi,
  pinyin,
  meaning,
});

// HSK 5 (2012), part 1: the 620 most common of its 1,243 new words, in 103
// lessons. Part 2 (the rest) comes later.
export const hsk5Units: Unit[] = [
  {
    id: 'h5-u1',
    hskLevel: 5,
    title: 'Home and body',
    description: 'Cooking, the flat, materials, and the body.',
    lessons: [
      {
        id: 'h5-u1-l1',
        title: 'Cooking',
        words: ['炒', '煮', '锅', '食物', '玉米', '切'],
        sentences: [
          s('妈妈在厨房炒菜。', 'māma zài chúfáng chǎo cài.', 'Mum is stir-frying in the kitchen.'),
          s(
            '先把西红柿切好，再放进锅里。',
            'xiān bǎ xīhóngshì qiē hǎo, zài fàng jìn guō lǐ.',
            'Cut the tomatoes first, then put them in the pot.',
          ),
          s(
            '我早上煮了两个鸡蛋。',
            'wǒ zǎoshang zhǔ le liǎng gè jīdàn.',
            'I boiled two eggs this morning.',
          ),
        ],
      },
      {
        id: 'h5-u1-l2',
        title: 'Around the flat',
        words: ['玻璃', '公寓', '锁', '插', '摆', '装饰'],
        sentences: [
          s('我住在一个小公寓里。', 'wǒ zhù zài yí gè xiǎo gōngyù lǐ.', 'I live in a small flat.'),
          s(
            '出门以前别忘记锁门。',
            'chū mén yǐqián bié wàngjì suǒ mén.',
            "Don't forget to lock the door when you go out.",
          ),
          s(
            '桌子上摆着很多照片。',
            'zhuōzi shàng bǎi zhe hěn duō zhàopiàn.',
            'There are lots of photos set out on the table.',
          ),
        ],
      },
      {
        id: 'h5-u1-l3',
        title: 'Materials',
        words: ['石头', '金属', '银', '黄金', '机器', '玩具', '布'],
        sentences: [
          s(
            '这个玩具是用布做的。',
            'zhège wánjù shì yòng bù zuò de.',
            'This toy is made of cloth.',
          ),
          s('黄金比银贵。', 'huángjīn bǐ yín guì.', 'Gold is more expensive than silver.'),
          s('这台机器坏了。', 'zhè tái jīqì huài le.', 'This machine is broken.'),
        ],
      },
      {
        id: 'h5-u1-l4',
        title: 'Inside the body',
        words: ['胸', '胃', '心脏', '肺', '腰', '脖子'],
        sentences: [
          s(
            '我胃疼，不想吃东西。',
            'wǒ wèi téng, bù xiǎng chī dōngxi.',
            "My stomach hurts; I don't want to eat.",
          ),
          s('抽烟对肺不好。', 'chōuyān duì fèi bù hǎo.', 'Smoking is bad for your lungs.'),
          s('我的腰很疼。', 'wǒ de yāo hěn téng.', 'My back hurts.'),
        ],
      },
      {
        id: 'h5-u1-l5',
        title: 'Strength',
        words: ['手指', '肌肉', '脑袋', '身材', '呼吸', '神经'],
        sentences: [
          s(
            '他经常锻炼，肌肉很多。',
            'tā jīngcháng duànliàn, jīròu hěn duō.',
            'He exercises often and is very muscular.',
          ),
          s('她的身材很好。', 'tā de shēncái hěn hǎo.', 'She has a good figure.'),
          s(
            '慢慢地呼吸，别紧张。',
            'mànmàn de hūxī, bié jǐnzhāng.',
            "Breathe slowly. Don't be nervous.",
          ),
        ],
      },
      {
        id: 'h5-u1-l6',
        title: 'With your hands',
        words: ['摸', '拍', '砍', '拆', '甩', '摔'],
        sentences: [
          s('别摸那只狗。', 'bié mō nà zhī gǒu.', "Don't touch that dog."),
          s('他在路上摔倒了。', 'tā zài lù shàng shuāi dǎo le.', 'He fell over in the street.'),
          s('观众都在拍照。', 'guānzhòng dōu zài pāi zhào.', 'The audience are all taking photos.'),
        ],
      },
    ],
  },
  {
    id: 'h5-u2',
    hskLevel: 5,
    title: 'Moving and doing',
    description: 'Everyday actions: turning, piling, blowing, biting, crouching.',
    lessons: [
      {
        id: 'h5-u2-l1',
        title: 'Moving things',
        words: ['翻', '卷', '盖', '堆', '摇', '挡'],
        sentences: [
          s('他翻了翻书。', 'tā fān le fān shū.', 'He leafed through the book.'),
          s(
            '桌子上堆着很多东西。',
            'zhuōzi shàng duī zhe hěn duō dōngxi.',
            "There's a pile of things on the table.",
          ),
          s('别挡着门。', 'bié dǎng zhe mén.', "Don't block the door."),
        ],
      },
      {
        id: 'h5-u2-l2',
        title: 'Round and round',
        words: ['绕', '冲', '滚', '滴', '升', '踩'],
        sentences: [
          s(
            '前面堵车，我们绕路走吧。',
            'qiánmiàn dǔchē, wǒmen rào lù zǒu ba.',
            "There's a jam ahead; let's go round.",
          ),
          s(
            '对不起，我踩到你的脚了。',
            'duìbuqǐ, wǒ cǎi dào nǐ de jiǎo le.',
            'Sorry, I stepped on your foot.',
          ),
          s('太阳升起来了。', 'tàiyáng shēng qǐlai le.', 'The sun has come up.'),
        ],
      },
      {
        id: 'h5-u2-l3',
        title: 'Mouth and voice',
        words: ['吹', '吐', '咬', '喊', '骂', '吻'],
        sentences: [
          s(
            '别吹空调了，太冷了。',
            'bié chuī kōngtiáo le, tài lěng le.',
            "Turn the air conditioning off, it's too cold.",
          ),
          s('我被狗咬了。', 'wǒ bèi gǒu yǎo le.', 'I was bitten by a dog.'),
          s(
            '有人在门口喊我的名字。',
            'yǒu rén zài ménkǒu hǎn wǒ de míngzi.',
            'Someone at the door is shouting my name.',
          ),
        ],
      },
      {
        id: 'h5-u2-l4',
        title: 'Pushing people',
        words: ['劝', '牵', '抢', '除', '念', '瞧'],
        sentences: [
          s('我劝他别抽烟了。', 'wǒ quàn tā bié chōuyān le.', 'I urged him to stop smoking.'),
          s(
            '奶奶牵着孙子过马路。',
            'nǎinai qiān zhe sūnzi guò mǎlù.',
            'Grandma is leading her grandson across the road.',
          ),
          s('你瞧，下雪了！', 'nǐ qiáo, xià xuě le!', "Look, it's snowing!"),
        ],
      },
      {
        id: 'h5-u2-l5',
        title: 'Positions',
        words: ['蹲', '闻', '露', '背', '顶', '乘'],
        sentences: [
          s(
            '你闻闻，这个菜香不香？',
            'nǐ wénwen, zhège cài xiāng bu xiāng?',
            'Have a sniff. Does this smell good?',
          ),
          s(
            '他蹲在地上找东西。',
            'tā dūn zài dì shàng zhǎo dōngxi.',
            "He's crouching on the ground, looking for something.",
          ),
          s(
            '我们乘地铁去机场。',
            'wǒmen chéng dìtiě qù jīchǎng.',
            "We're taking the subway to the airport.",
          ),
          s('我的背很疼。', 'wǒ de bèi hěn téng.', 'My back hurts.'),
        ],
      },
    ],
  },
  {
    id: 'h5-u3',
    hskLevel: 5,
    title: 'Describing things',
    description: 'Tight, weak, huge, unique, sensible, intense.',
    lessons: [
      {
        id: 'h5-u3-l1',
        title: 'Tight and loose',
        words: ['紧', '弱', '臭', '平', '直', '青'],
        sentences: [
          s('这双鞋太紧了。', 'zhè shuāng xié tài jǐn le.', 'These shoes are too tight.'),
          s('他的身体很弱。', 'tā de shēntǐ hěn ruò.', 'His health is poor.'),
          s('这条路又平又直。', 'zhè tiáo lù yòu píng yòu zhí.', 'This road is flat and straight.'),
        ],
      },
      {
        id: 'h5-u3-l2',
        title: 'Silly and sweet',
        words: ['呆', '乖', '瞎', '丑', '醉', '灰'],
        sentences: [
          s('这个孩子很乖。', 'zhège háizi hěn guāi.', 'This child is very well-behaved.'),
          s('他喝醉了。', 'tā hē zuì le.', "He's drunk."),
          s('周末我在家里呆着。', 'zhōumò wǒ zài jiā lǐ dāi zhe.', 'At the weekend I stayed in.'),
        ],
      },
      {
        id: 'h5-u3-l3',
        title: 'Huge',
        words: ['巨大', '伟大', '大型', '高速', '平均', '无数'],
        sentences: [
          s(
            '这个城市的变化非常巨大。',
            'zhège chéngshì de biànhuà fēicháng jùdà.',
            'This city has changed enormously.',
          ),
          s(
            '我们班的平均成绩是八十分。',
            'wǒmen bān de píngjūn chéngjì shì bāshí fēn.',
            "Our class's average mark is eighty.",
          ),
          s('他是一个伟大的人。', 'tā shì yí gè wěidà de rén.', 'He was a great man.'),
        ],
      },
      {
        id: 'h5-u3-l4',
        title: 'One of a kind',
        words: ['特殊', '独特', '完美', '完整', '唯一', '意外'],
        sentences: [
          s('你是我唯一的朋友。', 'nǐ shì wǒ wéiyī de péngyou.', "You're my only friend."),
          s(
            '这个地方的风景很独特。',
            'zhège dìfang de fēngjǐng hěn dútè.',
            'The scenery here is unique.',
          ),
          s('没有人是完美的。', 'méiyǒu rén shì wánměi de.', 'Nobody is perfect.'),
        ],
      },
      {
        id: 'h5-u3-l5',
        title: 'Sensible',
        words: ['必要', '基本', '合理', '良好', '相关', '一致'],
        sentences: [
          s('这个价格很合理。', 'zhège jiàgé hěn hélǐ.', 'This price is reasonable.'),
          s('没有必要着急。', 'méiyǒu bìyào zháojí.', "There's no need to rush."),
          s('我们的看法一致。', 'wǒmen de kànfǎ yízhì.', 'We see it the same way.'),
        ],
      },
      {
        id: 'h5-u3-l6',
        title: 'Intense',
        words: ['强烈', '深刻', '疯狂', '刺激', '激烈', '温暖'],
        sentences: [
          s('比赛非常激烈。', 'bǐsài fēicháng jīliè.', 'The match was really fierce.'),
          s(
            '这本书给我留下了深刻的印象。',
            'zhè běn shū gěi wǒ liú xià le shēnkè de yìnxiàng.',
            'This book made a deep impression on me.',
          ),
          s('家里很温暖。', 'jiā lǐ hěn wēnnuǎn.', "It's warm and cosy at home."),
        ],
      },
    ],
  },
  {
    id: 'h5-u4',
    hskLevel: 5,
    title: 'Time and place',
    description: 'Then and now, a lifetime, nature, landmarks and journeys.',
    lessons: [
      {
        id: 'h5-u4-l1',
        title: 'Then and now',
        words: ['曾经', '未来', '如今', '自从', '目前', '时刻', '钟'],
        sentences: [
          s(
            '我曾经在北京住过两年。',
            'wǒ céngjīng zài Běijīng zhù guo liǎng nián.',
            'I once lived in Beijing for two years.',
          ),
          s(
            '自从他来了以后，我们都很开心。',
            'zìcóng tā lái le yǐhòu, wǒmen dōu hěn kāixīn.',
            "Since he came, we've all been happy.",
          ),
          s(
            '目前我还没有工作。',
            'mùqián wǒ hái méiyǒu gōngzuò.',
            "At the moment I don't have a job.",
          ),
        ],
      },
      {
        id: 'h5-u4-l2',
        title: 'A lifetime',
        words: ['时代', '年代', '年纪', '一辈子', '日期', '临时'],
        sentences: [
          s('我奶奶年纪大了。', 'wǒ nǎinai niánjì dà le.', 'My grandma is getting on in years.'),
          s('我会一辈子记得你。', 'wǒ huì yíbèizi jìde nǐ.', "I'll remember you all my life."),
          s(
            '你知道考试的日期吗？',
            'nǐ zhīdào kǎoshì de rìqī ma?',
            'Do you know the date of the exam?',
          ),
        ],
      },
      {
        id: 'h5-u4-l3',
        title: 'Weather and nature',
        words: ['雷', '晒', '冻', '岛', '洞', '夜'],
        sentences: [
          s(
            '太阳很大，别晒太久了。',
            'tàiyáng hěn dà, bié shài tài jiǔ le.',
            "The sun's strong; don't stay out in it too long.",
          ),
          s(
            '他一个人在岛上住了一年。',
            'tā yí gè rén zài dǎo shàng zhù le yì nián.',
            'He lived alone on the island for a year.',
          ),
          s('夜里很安静。', 'yè lǐ hěn ānjìng.', "It's very quiet at night."),
        ],
      },
      {
        id: 'h5-u4-l4',
        title: 'Animals and landmarks',
        words: ['狼', '蛇', '塔', '土地', '广场', '建筑'],
        sentences: [
          s('我很害怕蛇。', 'wǒ hěn hàipà shé.', "I'm scared of snakes."),
          s(
            '广场上有很多人。',
            'guǎngchǎng shàng yǒu hěn duō rén.',
            'There are lots of people in the square.',
          ),
          s('这座建筑很有名。', 'zhè zuò jiànzhù hěn yǒumíng.', 'This building is famous.'),
        ],
      },
      {
        id: 'h5-u4-l5',
        title: 'Where you stand',
        words: ['位置', '地位', '程度', '角度', '表面', '背景'],
        sentences: [
          s(
            '从这个角度看，他说得对。',
            'cóng zhège jiǎodù kàn, tā shuō de duì.',
            "From this angle, he's right.",
          ),
          s(
            '这家饭馆的位置很好。',
            'zhè jiā fànguǎn de wèizhi hěn hǎo.',
            'This restaurant is in a good spot.',
          ),
        ],
      },
      {
        id: 'h5-u4-l6',
        title: 'On the way',
        words: ['到达', '度过', '一路', '驾驶', '运输', '交换'],
        sentences: [
          s(
            '我们下午三点到达北京。',
            'wǒmen xiàwǔ sān diǎn dàodá Běijīng.',
            'We arrive in Beijing at three in the afternoon.',
          ),
          s('祝你一路顺利！', 'zhù nǐ yílù shùnlì!', 'Have a good journey!'),
          s('我们交换了手机号码。', 'wǒmen jiāohuàn le shǒujī hàomǎ.', 'We swapped phone numbers.'),
        ],
      },
    ],
  },
  {
    id: 'h5-u5',
    hskLevel: 5,
    title: 'People and feelings',
    description: 'Love and marriage, character, getting along, strong feelings.',
    scenario: 'relationships',
    lessons: [
      {
        id: 'h5-u5-l1',
        title: 'Love and marriage',
        words: ['家庭', '婚姻', '离婚', '恋爱', '嫁', '娶'],
        sentences: [
          s('我有一个幸福的家庭。', 'wǒ yǒu yí gè xìngfú de jiātíng.', 'I have a happy family.'),
          s(
            '我姐姐嫁给了一个医生。',
            'wǒ jiějie jià gěi le yí gè yīshēng.',
            'My older sister married a doctor.',
          ),
          s(
            '他俩恋爱了三年。',
            "tā liǎ liàn'ài le sān nián.",
            'The two of them were together for three years.',
          ),
        ],
      },
      {
        id: 'h5-u5-l2',
        title: 'Dear ones',
        words: ['姑娘', '女士', '太太', '兄弟', '宝贝', '亲爱'],
        sentences: [
          s('那个姑娘很漂亮。', 'nàge gūniang hěn piàoliang.', 'That girl is very pretty.'),
          s('亲爱的，你回来了！', "qīn'ài de, nǐ huílái le!", "Darling, you're back!"),
          s('我有两个兄弟。', 'wǒ yǒu liǎng gè xiōngdì.', 'I have two brothers.'),
        ],
      },
      {
        id: 'h5-u5-l3',
        title: 'Who people are',
        words: ['农民', '工人', '妇女', '士兵', '王子', '公主'],
        sentences: [
          s('我爷爷以前是农民。', 'wǒ yéye yǐqián shì nóngmín.', 'My grandpa used to be a farmer.'),
          s(
            '这家公司有一千个工人。',
            'zhè jiā gōngsī yǒu yìqiān gè gōngrén.',
            'This company has a thousand workers.',
          ),
          s(
            '她喜欢听王子和公主的故事。',
            'tā xǐhuan tīng wángzǐ hé gōngzhǔ de gùshi.',
            'She loves stories about princes and princesses.',
          ),
        ],
      },
      {
        id: 'h5-u5-l4',
        title: 'Character',
        words: ['个性', '温柔', '坚强', '严肃', '好奇', '傻'],
        sentences: [
          s(
            '她很温柔，也很坚强。',
            'tā hěn wēnróu, yě hěn jiānqiáng.',
            "She's gentle, and strong too.",
          ),
          s(
            '孩子对什么都很好奇。',
            'háizi duì shénme dōu hěn hàoqí.',
            'Children are curious about everything.',
          ),
          s('别傻了！', 'bié shǎ le!', "Don't be silly!"),
        ],
      },
      {
        id: 'h5-u5-l5',
        title: 'Getting along',
        words: ['彼此', '相处', '对待', '伙伴', '双方', '对方'],
        sentences: [
          s('我们相处得很好。', 'wǒmen xiāngchǔ de hěn hǎo.', 'We get on well.'),
          s(
            '我们要互相尊重，彼此信任。',
            'wǒmen yào hùxiāng zūnzhòng, bǐcǐ xìnrèn.',
            'We should respect and trust each other.',
          ),
          s('他是我的好伙伴。', 'tā shì wǒ de hǎo huǒbàn.', "He's a good partner of mine."),
        ],
      },
      {
        id: 'h5-u5-l6',
        title: 'Hard feelings',
        words: ['痛苦', '愤怒', '寂寞', '平静', '感激', '遗憾'],
        sentences: [
          s(
            '我非常感激你的帮助。',
            'wǒ fēicháng gǎnjī nǐ de bāngzhù.',
            "I'm very grateful for your help.",
          ),
          s('很遗憾，你没能来。', 'hěn yíhàn, nǐ méi néng lái.', "It's a pity you couldn't come."),
          s(
            '一个人住有时候很寂寞。',
            'yí gè rén zhù yǒu shíhou hěn jìmò.',
            'Living alone is lonely sometimes.',
          ),
        ],
      },
      {
        id: 'h5-u5-l7',
        title: 'Longing',
        words: ['恨', '情绪', '满足', '享受', '怀念', '想念'],
        sentences: [
          s('我很想念我的家人。', 'wǒ hěn xiǎngniàn wǒ de jiārén.', 'I really miss my family.'),
          s(
            '他很满足现在的生活。',
            'tā hěn mǎnzú xiànzài de shēnghuó.',
            "He's content with his life now.",
          ),
          s(
            '周末我喜欢在家享受安静的时间。',
            'zhōumò wǒ xǐhuan zài jiā xiǎngshòu ānjìng de shíjiān.',
            'At weekends I like to enjoy some quiet time at home.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h5-u6',
    hskLevel: 5,
    title: 'Work and money',
    description: 'Business, investing, the office, projects and careers.',
    scenario: 'business-work',
    lessons: [
      {
        id: 'h5-u6-l1',
        title: 'Business',
        words: ['企业', '商业', '行业', '业务', '经营', '销售'],
        sentences: [
          s(
            '他在一家大企业工作。',
            'tā zài yì jiā dà qǐyè gōngzuò.',
            'He works for a big company.',
          ),
          s(
            '我姐姐负责销售。',
            'wǒ jiějie fùzé xiāoshòu.',
            "My older sister's in charge of sales.",
          ),
          s(
            '这家饭馆经营得很好。',
            'zhè jiā fànguǎn jīngyíng de hěn hǎo.',
            'This restaurant is well run.',
          ),
        ],
      },
      {
        id: 'h5-u6-l2',
        title: 'Investing',
        words: ['投资', '利润', '利益', '资金', '贷款', '股票'],
        sentences: [
          s(
            '他把钱都投资在股票上了。',
            'tā bǎ qián dōu tóuzī zài gǔpiào shàng le.',
            'He put all his money into shares.',
          ),
          s(
            '公司的利润增长了很多。',
            'gōngsī de lìrùn zēngzhǎng le hěn duō.',
            "The company's profits have grown a lot.",
          ),
          s('我向银行贷款了。', 'wǒ xiàng yínháng dàikuǎn le.', 'I took out a bank loan.'),
        ],
      },
      {
        id: 'h5-u6-l3',
        title: 'What you own',
        words: ['财产', '费用', '账户', '税', '损失', '欠'],
        sentences: [
          s(
            '我还欠他一百块钱。',
            'wǒ hái qiàn tā yìbǎi kuài qián.',
            'I still owe him a hundred kuai.',
          ),
          s(
            '请把钱存进我的账户。',
            'qǐng bǎ qián cún jìn wǒ de zhànghù.',
            'Please pay the money into my account.',
          ),
          s('这次的损失很大。', 'zhè cì de sǔnshī hěn dà.', 'The loss this time was big.'),
        ],
      },
      {
        id: 'h5-u6-l4',
        title: 'At the office',
        words: ['老板', '人员', '部门', '单位', '文件', '报告'],
        sentences: [
          s(
            '老板让我写一个报告。',
            'lǎobǎn ràng wǒ xiě yí gè bàogào.',
            'The boss asked me to write a report.',
          ),
          s('你在哪个部门工作？', 'nǐ zài nǎge bùmén gōngzuò?', 'Which department do you work in?'),
          s(
            '请把这个文件打印一下。',
            'qǐng bǎ zhège wénjiàn dǎyìn yíxià.',
            'Please print this document.',
          ),
        ],
      },
      {
        id: 'h5-u6-l5',
        title: 'Projects',
        words: ['项目', '合作', '方案', '设计', '程序', '合同'],
        sentences: [
          s(
            '我们两家公司合作了一个新项目。',
            'wǒmen liǎng jiā gōngsī hézuò le yí gè xīn xiàngmù.',
            'Our two companies worked together on a new project.',
          ),
          s('这个合同你看了吗？', 'zhège hétong nǐ kàn le ma?', 'Have you read this contract?'),
          s('这个设计非常好。', 'zhège shèjì fēicháng hǎo.', 'This design is excellent.'),
        ],
      },
      {
        id: 'h5-u6-l6',
        title: 'Making things',
        words: ['产品', '商品', '生产', '工厂', '工业', '制作'],
        sentences: [
          s(
            '这个工厂生产手机。',
            'zhège gōngchǎng shēngchǎn shǒujī.',
            'This factory makes mobile phones.',
          ),
          s(
            '我们的产品质量很好。',
            'wǒmen de chǎnpǐn zhìliàng hěn hǎo.',
            'Our products are good quality.',
          ),
        ],
      },
      {
        id: 'h5-u6-l7',
        title: 'Careers',
        words: ['辞职', '退休', '人才', '资格', '登记', '注册'],
        sentences: [
          s('我爸爸去年退休了。', 'wǒ bàba qùnián tuìxiū le.', 'My dad retired last year.'),
          s(
            '他辞职了，因为工作压力太大。',
            'tā cízhí le, yīnwèi gōngzuò yālì tài dà.',
            'He quit because the pressure at work was too much.',
          ),
          s(
            '在这个网站注册很简单。',
            'zài zhège wǎngzhàn zhùcè hěn jiǎndān.',
            "It's easy to sign up on this website.",
          ),
        ],
      },
    ],
  },
  {
    id: 'h5-u7',
    hskLevel: 5,
    title: 'Government and society',
    description: 'Government, rules, the law, announcements and rights.',
    lessons: [
      {
        id: 'h5-u7-l1',
        title: 'Government',
        words: ['政府', '政治', '政策', '总统', '主席', '领导'],
        sentences: [
          s(
            '政府出了新的政策。',
            'zhèngfǔ chū le xīn de zhèngcè.',
            'The government has brought in a new policy.',
          ),
          s('他是我们的领导。', 'tā shì wǒmen de lǐngdǎo.', "He's our boss."),
          s(
            '我对政治不太感兴趣。',
            'wǒ duì zhèngzhì bú tài gǎn xìngqù.',
            "I'm not very interested in politics.",
          ),
        ],
      },
      {
        id: 'h5-u7-l2',
        title: 'Rules',
        words: ['制度', '规则', '原则', '义务', '合法', '违反'],
        sentences: [
          s(
            '你违反了交通规则。',
            'nǐ wéifǎn le jiāotōng guīzé.',
            "You've broken the traffic rules.",
          ),
          s('这是我的原则。', 'zhè shì wǒ de yuánzé.', "That's a principle of mine."),
        ],
      },
      {
        id: 'h5-u7-l3',
        title: 'Law and order',
        words: ['法院', '证据', '命令', '执行', '批准', '遵守'],
        sentences: [
          s('我们要遵守法律。', 'wǒmen yào zūnshǒu fǎlǜ.', 'We must obey the law.'),
          s('警察找到了证据。', 'jǐngchá zhǎo dào le zhèngjù.', 'The police found the evidence.'),
          s(
            '经理批准了我的请假。',
            'jīnglǐ pīzhǔn le wǒ de qǐngjià.',
            'The manager approved my time off.',
          ),
        ],
      },
      {
        id: 'h5-u7-l4',
        title: 'Making it public',
        words: ['宣布', '公布', '公开', '宣传', '表明', '发表'],
        sentences: [
          s(
            '学校宣布明天放假。',
            'xuéxiào xuānbù míngtiān fàngjià.',
            'The school announced that tomorrow is a holiday.',
          ),
          s(
            '考试成绩已经公布了。',
            'kǎoshì chéngjì yǐjīng gōngbù le.',
            'The exam results have been published.',
          ),
          s(
            '他在杂志上发表了一篇文章。',
            'tā zài zázhì shàng fābiǎo le yì piān wénzhāng.',
            'He published an article in a magazine.',
          ),
        ],
      },
      {
        id: 'h5-u7-l5',
        title: 'Rights and power',
        words: ['民主', '选举', '权利', '权力', '统一', '独立'],
        sentences: [
          s(
            '每个人都有自己的权利。',
            'měi gè rén dōu yǒu zìjǐ de quánlì.',
            'Everyone has their own rights.',
          ),
          s(
            '她很独立，什么都自己做。',
            'tā hěn dúlì, shénme dōu zìjǐ zuò.',
            "She's very independent; she does everything herself.",
          ),
        ],
      },
      {
        id: 'h5-u7-l6',
        title: 'Population',
        words: ['人口', '地区', '县', '人类', '集体', '维护'],
        sentences: [
          s('中国的人口很多。', 'Zhōngguó de rénkǒu hěn duō.', 'China has a large population.'),
          s(
            '这个地区的气候很好。',
            'zhège dìqū de qìhòu hěn hǎo.',
            'The climate in this region is good.',
          ),
          s(
            '我们要保护地球，维护人类的未来。',
            'wǒmen yào bǎohù dìqiú, wéihù rénlèi de wèilái.',
            "We must protect the planet and safeguard humanity's future.",
          ),
        ],
      },
    ],
  },
  {
    id: 'h5-u8',
    hskLevel: 5,
    title: 'Conflict and danger',
    description: 'War and peace, danger, escaping and damage.',
    scenario: 'emergencies',
    lessons: [
      {
        id: 'h5-u8-l1',
        title: 'War',
        words: ['战争', '军事', '武器', '敌人', '枪', '杀'],
        sentences: [
          s('没有人喜欢战争。', 'méiyǒu rén xǐhuan zhànzhēng.', 'Nobody likes war.'),
          s('警察拿着枪。', 'jǐngchá ná zhe qiāng.', 'The police officer is holding a gun.'),
        ],
      },
      {
        id: 'h5-u8-l2',
        title: 'Peace',
        words: ['和平', '胜利', '革命', '解放', '英雄', '命运'],
        sentences: [
          s(
            '我们都希望世界和平。',
            'wǒmen dōu xīwàng shìjiè hépíng.',
            'We all hope for world peace.',
          ),
          s('他是我们的英雄。', 'tā shì wǒmen de yīngxióng.', "He's our hero."),
          s('我相信命运。', 'wǒ xiāngxìn mìngyùn.', 'I believe in fate.'),
        ],
      },
      {
        id: 'h5-u8-l3',
        title: 'Danger',
        words: ['威胁', '恐怖', '可怕', '风险', '冒险', '紧急'],
        sentences: [
          s('这个电影太恐怖了。', 'zhège diànyǐng tài kǒngbù le.', 'This film is terrifying.'),
          s('投资有风险。', 'tóuzī yǒu fēngxiǎn.', 'Investing carries risk.'),
          s(
            '情况很紧急，快打电话！',
            'qíngkuàng hěn jǐnjí, kuài dǎ diànhuà!',
            "It's an emergency. Call now!",
          ),
        ],
      },
      {
        id: 'h5-u8-l4',
        title: 'Getting away',
        words: ['逃', '救', '吓', '退', '阻止', '避免'],
        sentences: [
          s('你吓死我了！', 'nǐ xià sǐ wǒ le!', 'You scared me to death!'),
          s('医生救了他。', 'yīshēng jiù le tā.', 'The doctor saved him.'),
          s(
            '为了避免堵车，我们早上六点出发。',
            'wèile bìmiǎn dǔchē, wǒmen zǎoshang liù diǎn chūfā.',
            'To avoid the traffic, we set off at six in the morning.',
          ),
        ],
      },
      {
        id: 'h5-u8-l5',
        title: 'Damage',
        words: ['破坏', '碎', '烂', '消失', '后果', '造成'],
        sentences: [
          s(
            '杯子掉在地上碎了。',
            'bēizi diào zài dì shàng suì le.',
            'The cup fell on the floor and smashed.',
          ),
          s('这些苹果都烂了。', 'zhèxiē píngguǒ dōu làn le.', 'These apples have all gone rotten.'),
          s(
            '堵车造成了很多问题。',
            'dǔchē zàochéng le hěn duō wèntí.',
            'The traffic jams caused a lot of problems.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h5-u9',
    hskLevel: 5,
    title: 'Sport and culture',
    description: 'Competing, entertainment, art, style and the media.',
    scenario: 'sports-fitness',
    lessons: [
      {
        id: 'h5-u9-l1',
        title: 'Competing',
        words: ['冠军', '训练', '教练', '决赛', '对手', '俱乐部'],
        sentences: [
          s('我们进了决赛！', 'wǒmen jìn le juésài!', "We're through to the final!"),
          s(
            '他每个星期训练五次。',
            'tā měi gè xīngqī xùnliàn wǔ cì.',
            'He trains five times a week.',
          ),
          s('他得了游泳冠军。', 'tā dé le yóuyǒng guànjūn.', 'He won the swimming championship.'),
        ],
      },
      {
        id: 'h5-u9-l2',
        title: 'Entertainment',
        words: ['娱乐', '明星', '导演', '角色', '频道', '酒吧'],
        sentences: [
          s(
            '她是一个很有名的明星。',
            'tā shì yí gè hěn yǒumíng de míngxīng.',
            "She's a very famous star.",
          ),
          s('晚上我们去酒吧吧。', 'wǎnshang wǒmen qù jiǔbā ba.', "Let's go to a bar tonight."),
          s(
            '这个导演的电影我都看过。',
            'zhège dǎoyǎn de diànyǐng wǒ dōu kàn guo.',
            "I've seen all this director's films.",
          ),
        ],
      },
      {
        id: 'h5-u9-l3',
        title: 'Art',
        words: ['作品', '风格', '经典', '诗', '欣赏', '魅力'],
        sentences: [
          s('我很欣赏他的作品。', 'wǒ hěn xīnshǎng tā de zuòpǐn.', 'I really admire his work.'),
          s('这个电影很经典。', 'zhège diànyǐng hěn jīngdiǎn.', 'This film is a classic.'),
          s('她会写诗。', 'tā huì xiě shī.', 'She writes poetry.'),
        ],
      },
      {
        id: 'h5-u9-l4',
        title: 'Style',
        words: ['时尚', '服装', '身份', '形象', '个人', '豪华'],
        sentences: [
          s('她穿得很时尚。', 'tā chuān de hěn shíshàng.', 'She dresses fashionably.'),
          s('这家宾馆很豪华。', 'zhè jiā bīnguǎn hěn háohuá.', 'This hotel is luxurious.'),
          s('这是我个人的看法。', 'zhè shì wǒ gèrén de kànfǎ.', 'This is my personal view.'),
        ],
      },
      {
        id: 'h5-u9-l5',
        title: 'Media',
        words: ['采访', '编辑', '出版', '传播', '话题', '摄影'],
        sentences: [
          s(
            '记者采访了很多人。',
            'jìzhě cǎifǎng le hěn duō rén.',
            'The reporter interviewed lots of people.',
          ),
          s(
            '他的新小说已经出版了。',
            'tā de xīn xiǎoshuō yǐjīng chūbǎn le.',
            'His new novel is out.',
          ),
          s('我们换一个话题吧。', 'wǒmen huàn yí gè huàtí ba.', "Let's change the subject."),
        ],
      },
    ],
  },
  {
    id: 'h5-u10',
    hskLevel: 5,
    title: 'Science and technology',
    description: 'Experiments, technology, energy, medicine and communication.',
    lessons: [
      {
        id: 'h5-u10-l1',
        title: 'Science',
        words: ['实验', '数据', '分析', '理论', '化学', '物质'],
        sentences: [
          s(
            '我们在做化学实验。',
            'wǒmen zài zuò huàxué shíyàn.',
            "We're doing a chemistry experiment.",
          ),
          s('请分析一下这些数据。', 'qǐng fēnxī yíxià zhèxiē shùjù.', 'Please analyse this data.'),
        ],
      },
      {
        id: 'h5-u10-l2',
        title: 'Technology',
        words: ['系统', '设备', '功能', '自动', '软件', '病毒'],
        sentences: [
          s('我的电脑有病毒。', 'wǒ de diànnǎo yǒu bìngdú.', 'My computer has a virus.'),
          s(
            '这个手机有很多功能。',
            'zhège shǒujī yǒu hěn duō gōngnéng.',
            'This phone has lots of features.',
          ),
          s('门会自动关上。', 'mén huì zìdòng guān shàng.', 'The door closes automatically.'),
        ],
      },
      {
        id: 'h5-u10-l3',
        title: 'Space and energy',
        words: ['能源', '资源', '宇宙', '天空', '空间', '移动'],
        sentences: [
          s('我们要节约能源。', 'wǒmen yào jiéyuē néngyuán.', 'We should save energy.'),
          s('天空很蓝。', 'tiānkōng hěn lán.', 'The sky is very blue.'),
          s(
            '房间太小，没有空间放沙发。',
            'fángjiān tài xiǎo, méiyǒu kōngjiān fàng shāfā.',
            "The room's too small; there's no space for a sofa.",
          ),
        ],
      },
      {
        id: 'h5-u10-l4',
        title: 'Medicine',
        words: ['治疗', '诊断', '手术', '受伤', '恢复', '晕'],
        sentences: [
          s(
            '他受伤了，需要做手术。',
            'tā shòushāng le, xūyào zuò shǒushù.',
            "He's hurt and needs an operation.",
          ),
          s('坐船让我很晕。', 'zuò chuán ràng wǒ hěn yūn.', 'Boats make me feel dizzy.'),
          s('他的身体恢复得很快。', 'tā de shēntǐ huīfù de hěn kuài.', 'He recovered quickly.'),
        ],
      },
      {
        id: 'h5-u10-l5',
        title: 'Communication',
        words: ['通讯', '信号', '沟通', '咨询', '询问', '答应'],
        sentences: [
          s('这里没有信号。', 'zhèlǐ méiyǒu xìnhào.', "There's no signal here."),
          s('他答应明天来。', 'tā dāying míngtiān lái.', "He's promised to come tomorrow."),
          s('我们要多沟通。', 'wǒmen yào duō gōutōng.', 'We need to talk to each other more.'),
        ],
      },
    ],
  },
  {
    id: 'h5-u11',
    hskLevel: 5,
    title: 'Ideas',
    description: 'Thinking, reasons, what is real, how things work, the mind, values.',
    lessons: [
      {
        id: 'h5-u11-l1',
        title: 'Thinking',
        words: ['思想', '思考', '观点', '概念', '意义', '道理'],
        sentences: [
          s('你说的很有道理。', 'nǐ shuō de hěn yǒu dàolǐ.', 'What you say makes a lot of sense.'),
          s('我同意你的观点。', 'wǒ tóngyì nǐ de guāndiǎn.', 'I agree with your view.'),
          s('这个工作很有意义。', 'zhège gōngzuò hěn yǒu yìyì.', 'This work is very meaningful.'),
        ],
      },
      {
        id: 'h5-u11-l2',
        title: 'Reasons',
        words: ['理由', '因素', '结论', '事实', '现实', '现象'],
        sentences: [
          s(
            '你有什么理由迟到？',
            'nǐ yǒu shénme lǐyóu chídào?',
            "What's your excuse for being late?",
          ),
          s('这是事实。', 'zhè shì shìshí.', "That's a fact."),
        ],
      },
      {
        id: 'h5-u11-l3',
        title: 'What is real',
        words: ['真实', '秘密', '神秘', '事物', '细节', '具体'],
        sentences: [
          s('这是我们的秘密。', 'zhè shì wǒmen de mìmì.', 'This is our secret.'),
          s('请说得具体一点。', 'qǐng shuō de jùtǐ yìdiǎn.', 'Please be a bit more specific.'),
          s('这个故事是真实的。', 'zhège gùshi shì zhēnshí de.', 'This story is true.'),
        ],
      },
      {
        id: 'h5-u11-l4',
        title: 'How it works',
        words: ['如何', '方式', '形式', '结构', '核心', '中心'],
        sentences: [
          s(
            '我们如何解决这个问题？',
            'wǒmen rúhé jiějué zhège wèntí?',
            'How do we solve this problem?',
          ),
          s('我住在城市中心。', 'wǒ zhù zài chéngshì zhōngxīn.', 'I live in the city centre.'),
          s(
            '每个人的学习方式不一样。',
            'měi gè rén de xuéxí fāngshì bù yíyàng.',
            'Everyone learns in a different way.',
          ),
        ],
      },
      {
        id: 'h5-u11-l5',
        title: 'The mind',
        words: ['心理', '记忆', '想象', '幻想', '精力', '智慧'],
        sentences: [
          s(
            '我的记忆越来越差了。',
            'wǒ de jìyì yuè lái yuè chà le.',
            'My memory is getting worse and worse.',
          ),
          s(
            '这比我想象的容易。',
            'zhè bǐ wǒ xiǎngxiàng de róngyì.',
            'This is easier than I imagined.',
          ),
          s(
            '工作太多，我没有精力了。',
            'gōngzuò tài duō, wǒ méiyǒu jīnglì le.',
            "There's too much work; I've no energy left.",
          ),
        ],
      },
      {
        id: 'h5-u11-l6',
        title: 'Values',
        words: ['价值', '道德', '荣誉', '公平', '珍惜', '追求'],
        sentences: [
          s('这不公平！', 'zhè bù gōngpíng!', "That's not fair!"),
          s(
            '我们要珍惜时间。',
            'wǒmen yào zhēnxī shíjiān.',
            'We should make the most of our time.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h5-u12',
    hskLevel: 5,
    title: 'Change and progress',
    description: 'Changing, growing, success, falling behind and keeping going.',
    lessons: [
      {
        id: 'h5-u12-l1',
        title: 'Changing',
        words: ['转变', '改善', '修改', '调整', '形成', '进步'],
        sentences: [
          s('你的汉语进步很大。', 'nǐ de Hànyǔ jìnbù hěn dà.', 'Your Chinese has come on a lot.'),
          s(
            '请修改一下这篇文章。',
            'qǐng xiūgǎi yíxià zhè piān wénzhāng.',
            'Please revise this article.',
          ),
          s(
            '我们的生活改善了很多。',
            'wǒmen de shēnghuó gǎishàn le hěn duō.',
            'Our lives have improved a lot.',
          ),
        ],
      },
      {
        id: 'h5-u12-l2',
        title: 'Growing',
        words: ['成长', '培养', '创造', '实现', '达到', '成果'],
        sentences: [
          s('我的梦想实现了。', 'wǒ de mèngxiǎng shíxiàn le.', 'My dream has come true.'),
          s('孩子成长得很快。', 'háizi chéngzhǎng de hěn kuài.', 'Children grow up fast.'),
          s(
            '我们要培养好的习惯。',
            'wǒmen yào péiyǎng hǎo de xíguàn.',
            'We should build good habits.',
          ),
        ],
      },
      {
        id: 'h5-u12-l3',
        title: 'Success',
        words: ['成就', '贡献', '奇迹', '出色', '优势', '幸运'],
        sentences: [
          s('他的工作很出色。', 'tā de gōngzuò hěn chūsè.', 'His work is outstanding.'),
          s('我很幸运，认识了你。', 'wǒ hěn xìngyùn, rènshi le nǐ.', "I'm lucky to have met you."),
        ],
      },
      {
        id: 'h5-u12-l4',
        title: 'Falling behind',
        words: ['落后', '不足', '缺乏', '失去', '糟糕', '运气'],
        sentences: [
          s(
            '太糟糕了，我把钥匙丢了。',
            'tài zāogāo le, wǒ bǎ yàoshi diū le.',
            "Oh no, I've lost my keys.",
          ),
          s('他缺乏经验。', 'tā quēfá jīngyàn.', 'He lacks experience.'),
          s('今天我的运气不错。', 'jīntiān wǒ de yùnqi búcuò.', "I'm in luck today."),
        ],
      },
      {
        id: 'h5-u12-l5',
        title: 'Still going',
        words: ['持续', '不断', '始终', '依然', '至今', '以来'],
        sentences: [
          s(
            '这个会议持续了三个小时。',
            'zhège huìyì chíxù le sān gè xiǎoshí.',
            'The meeting went on for three hours.',
          ),
          s('他依然很年轻。', 'tā yīrán hěn niánqīng.', "He's still young."),
          s('他始终没有放弃。', 'tā shǐzhōng méiyǒu fàngqì.', 'He never gave up.'),
        ],
      },
    ],
  },
  {
    id: 'h5-u13',
    hskLevel: 5,
    title: 'How and how much',
    description: 'Obviously, right away, anyway, just in case, it seems, thoroughly.',
    lessons: [
      {
        id: 'h5-u13-l1',
        title: 'Obviously',
        words: ['明显', '显然', '的确', '居然', '简直', '绝对'],
        sentences: [
          s(
            '他居然忘记了我的生日！',
            'tā jūrán wàngjì le wǒ de shēngrì!',
            'He actually forgot my birthday!',
          ),
          s('这简直太好了！', 'zhè jiǎnzhí tài hǎo le!', "That's just brilliant!"),
          s(
            '你的汉语的确进步了。',
            'nǐ de Hànyǔ díquè jìnbù le.',
            'Your Chinese really has improved.',
          ),
        ],
      },
      {
        id: 'h5-u13-l2',
        title: 'Right away',
        words: ['立即', '立刻', '迅速', '赶紧', '赶快', '随时'],
        sentences: [
          s('我立刻就来。', 'wǒ lìkè jiù lái.', "I'll be right there."),
          s(
            '有问题随时给我打电话。',
            'yǒu wèntí suíshí gěi wǒ dǎ diànhuà.',
            'Call me any time if there is a problem.',
          ),
          s(
            '快下雨了，赶紧回家吧。',
            'kuài xià yǔ le, gǎnjǐn huí jiā ba.',
            "It's about to rain. Hurry home.",
          ),
        ],
      },
      {
        id: 'h5-u13-l3',
        title: 'Anyway',
        words: ['反正', '毕竟', '反而', '总之', '此外', '至于'],
        grammar: 'fan-er',
        sentences: [
          s(
            '别着急，反正还有时间。',
            'bié zháojí, fǎnzhèng hái yǒu shíjiān.',
            "Don't rush; there's time anyway.",
          ),
          s('他毕竟还是个孩子。', 'tā bìjìng háishi gè háizi.', "He's only a child, after all."),
          s(
            '吃了药，他反而更难受了。',
            "chī le yào, tā fǎn'ér gèng nánshòu le.",
            'After the medicine he actually felt worse.',
          ),
        ],
      },
      {
        id: 'h5-u13-l4',
        title: 'Just in case',
        words: ['一旦', '万一', '假如', '除非', '要不', '不然'],
        grammar: 'yidan-jiu',
        sentences: [
          s(
            '带上伞，万一下雨呢？',
            'dài shàng sǎn, wànyī xià yǔ ne?',
            'Take an umbrella, in case it rains.',
          ),
          s(
            '一旦决定了，就不要改变。',
            'yídàn juédìng le, jiù bú yào gǎibiàn.',
            "Once you've decided, don't change.",
          ),
          s(
            '快点，要不我们就迟到了。',
            'kuài diǎn, yàobù wǒmen jiù chídào le.',
            "Hurry up, or we'll be late.",
          ),
        ],
      },
      {
        id: 'h5-u13-l5',
        title: 'It seems',
        words: ['似乎', '看来', '似的', '据说', '所谓', '显得'],
        sentences: [
          s('他似乎不太高兴。', 'tā sìhū bú tài gāoxìng.', "He doesn't seem very happy."),
          s('据说明天会下雪。', 'jùshuō míngtiān huì xià xuě.', "They say it'll snow tomorrow."),
          s('看来你今天很忙。', 'kànlái nǐ jīntiān hěn máng.', 'It looks like you are busy today.'),
        ],
      },
      {
        id: 'h5-u13-l6',
        title: 'Thoroughly',
        words: ['相当', '更加', '充分', '全面', '彻底', '过分'],
        sentences: [
          s(
            '这个问题相当复杂。',
            'zhège wèntí xiāngdāng fùzá.',
            'This problem is quite complicated.',
          ),
          s('你别太过分了！', 'nǐ bié tài guòfèn le!', "Don't go too far!"),
          s(
            '考试以前要充分准备。',
            'kǎoshì yǐqián yào chōngfèn zhǔnbèi.',
            'Prepare thoroughly before an exam.',
          ),
        ],
      },
    ],
  },
  {
    id: 'h5-u14',
    hskLevel: 5,
    title: 'Getting things done',
    description: 'Handling things, keeping, deciding, facing up to it, taking steps.',
    lessons: [
      {
        id: 'h5-u14-l1',
        title: 'Handling it',
        words: ['处理', '控制', '掌握', '把握', '利用', '运用'],
        sentences: [
          s('这个问题我来处理。', 'zhège wèntí wǒ lái chǔlǐ.', "I'll deal with this problem."),
          s(
            '他控制不了自己的情绪。',
            'tā kòngzhì bù liǎo zìjǐ de qíngxù.',
            "He can't control his emotions.",
          ),
          s('要好好利用时间。', 'yào hǎohǎo lìyòng shíjiān.', 'Make good use of your time.'),
        ],
      },
      {
        id: 'h5-u14-l2',
        title: 'Keeping',
        words: ['保持', '保存', '保留', '固定', '稳定', '平衡'],
        sentences: [
          s('我们一直保持联系。', 'wǒmen yìzhí bǎochí liánxì.', "We've always kept in touch."),
          s('他有一份稳定的工作。', 'tā yǒu yí fèn wěndìng de gōngzuò.', 'He has a steady job.'),
          s('别忘记保存文件。', 'bié wàngjì bǎocún wénjiàn.', "Don't forget to save the file."),
        ],
      },
      {
        id: 'h5-u14-l3',
        title: 'Deciding',
        words: ['确定', '确认', '承认', '否认', '明确', '评价'],
        sentences: [
          s('你确定吗？', 'nǐ quèdìng ma?', 'Are you sure?'),
          s(
            '他承认是他做错了。',
            'tā chéngrèn shì tā zuò cuò le.',
            'He admitted he was in the wrong.',
          ),
          s(
            '老师对我的评价很高。',
            'lǎoshī duì wǒ de píngjià hěn gāo.',
            'The teacher thinks highly of me.',
          ),
        ],
      },
      {
        id: 'h5-u14-l4',
        title: 'Facing up to it',
        words: ['面对', '面临', '承担', '承受', '接触', '接近'],
        sentences: [
          s(
            '我们要勇敢地面对困难。',
            'wǒmen yào yǒnggǎn de miànduì kùnnan.',
            'We must face difficulties bravely.',
          ),
          s(
            '这是我的责任，我来承担。',
            'zhè shì wǒ de zérèn, wǒ lái chéngdān.',
            "It's my responsibility. I'll take it on.",
          ),
          s(
            '现在已经接近十二点了。',
            "xiànzài yǐjīng jiējìn shí'èr diǎn le.",
            "It's nearly twelve o'clock.",
          ),
        ],
      },
      {
        id: 'h5-u14-l5',
        title: 'Together',
        words: ['参与', '出席', '集中', '结合', '组合', '联合'],
        sentences: [
          s(
            '上课的时候要集中精力。',
            'shàng kè de shíhou yào jízhōng jīnglì.',
            'Concentrate in class.',
          ),
          s('经理出席了会议。', 'jīnglǐ chūxí le huìyì.', 'The manager attended the meeting.'),
          s('每个人都可以参与。', 'měi gè rén dōu kěyǐ cānyù.', 'Everyone can take part.'),
        ],
      },
      {
        id: 'h5-u14-l6',
        title: 'Taking steps',
        words: ['采取', '措施', '针对', '阶段', '时期', '期间'],
        sentences: [
          s(
            '我们必须马上采取措施。',
            'wǒmen bìxū mǎshàng cǎiqǔ cuòshī.',
            'We must take action right away.',
          ),
          s(
            '放假期间，我回家了。',
            'fàngjià qījiān, wǒ huí jiā le.',
            'I went home over the holidays.',
          ),
        ],
      },
      {
        id: 'h5-u14-l7',
        title: 'Hoping',
        words: ['期待', '等待', '愿望', '请求', '取消', '推荐'],
        sentences: [
          s(
            '我很期待你的回答。',
            'wǒ hěn qīdài nǐ de huídá.',
            "I'm looking forward to your reply.",
          ),
          s(
            '因为下雨，比赛取消了。',
            'yīnwèi xià yǔ, bǐsài qǔxiāo le.',
            'The match was cancelled because of rain.',
          ),
          s(
            '你能给我推荐一本书吗？',
            'nǐ néng gěi wǒ tuījiàn yì běn shū ma?',
            'Can you recommend a book?',
          ),
        ],
      },
    ],
  },
  {
    id: 'h5-u15',
    hskLevel: 5,
    title: 'Measure words and grammar',
    description: 'Measure words, kinds and shapes, formal words, and little words.',
    lessons: [
      {
        id: 'h5-u15-l1',
        title: 'Measure words',
        words: ['片', '套', '项', '支', '颗', '幅'],
        sentences: [
          s('我买了一套新衣服。', 'wǒ mǎi le yí tào xīn yīfu.', 'I bought a new outfit.'),
          s(
            '墙上挂着一幅画。',
            'qiáng shàng guà zhe yì fú huà.',
            "There's a painting on the wall.",
          ),
          s('你有几支铅笔？', 'nǐ yǒu jǐ zhī qiānbǐ?', 'How many pencils do you have?'),
        ],
      },
      {
        id: 'h5-u15-l2',
        title: 'More measure words',
        words: ['匹', '届', '阵', '批', '团', '克'],
        sentences: [
          s(
            '我买了五百克苹果。',
            'wǒ mǎi le wǔbǎi kè píngguǒ.',
            'I bought five hundred grams of apples.',
          ),
          s(
            '他是我们学校第一届学生。',
            'tā shì wǒmen xuéxiào dì yī jiè xuésheng.',
            "He was in our school's first class.",
          ),
        ],
      },
      {
        id: 'h5-u15-l3',
        title: 'Kinds and shapes',
        words: ['根', '类', '圈', '方', '系', '派'],
        sentences: [
          s('这类问题很容易。', 'zhè lèi wèntí hěn róngyì.', 'This kind of question is easy.'),
          s(
            '他是中文系的学生。',
            'tā shì Zhōngwén xì de xuésheng.',
            "He's a student in the Chinese department.",
          ),
          s(
            '我们在公园里走了一圈。',
            'wǒmen zài gōngyuán lǐ zǒu le yì quān.',
            'We walked a loop round the park.',
          ),
        ],
      },
      {
        id: 'h5-u15-l4',
        title: 'Formal words',
        words: ['所', '某', '则', '便', '甲', '丁'],
        sentences: [
          s(
            '这是一所很好的学校。',
            'zhè shì yì suǒ hěn hǎo de xuéxiào.',
            'This is a very good school.',
          ),
          s(
            '我在某个地方看见过他。',
            'wǒ zài mǒu gè dìfang kànjiàn guo tā.',
            "I've seen him somewhere.",
          ),
        ],
      },
      {
        id: 'h5-u15-l5',
        title: 'Oh!',
        words: ['唉', '哈', '不好意思', '反应', '显示', '通常'],
        sentences: [
          s('不好意思，我迟到了。', 'bù hǎoyìsi, wǒ chídào le.', "Sorry I'm late."),
          s('我通常七点起床。', 'wǒ tōngcháng qī diǎn qǐchuáng.', 'I usually get up at seven.'),
          s('唉，又下雨了。', 'āi, yòu xià yǔ le.', "Oh no, it's raining again."),
        ],
      },
      {
        id: 'h5-u15-l6',
        title: 'Facing',
        words: ['正', '朝', '凭', '非', '装', '去世'],
        sentences: [
          s('我家的窗户朝南。', 'wǒ jiā de chuānghu cháo nán.', 'Our windows face south.'),
          s('他去年去世了。', 'tā qùnián qùshì le.', 'He passed away last year.'),
          s(
            '别装了，我知道是你。',
            'bié zhuāng le, wǒ zhīdào shì nǐ.',
            "Stop pretending, I know it's you.",
          ),
        ],
      },
    ],
  },
  {
    id: 'h5-u16',
    hskLevel: 5,
    title: 'Purpose',
    description: 'What things are, acting, aims, searching, quiet feelings.',
    lessons: [
      {
        id: 'h5-u16-l1',
        title: 'What things are',
        words: ['存在', '属于', '等于', '相对', '状态', '状况'],
        sentences: [
          s('这本书属于我。', 'zhè běn shū shǔyú wǒ.', 'This book belongs to me.'),
          s(
            '他的身体状况不太好。',
            'tā de shēntǐ zhuàngkuàng bú tài hǎo.',
            "His health isn't great.",
          ),
        ],
      },
      {
        id: 'h5-u16-l2',
        title: 'Acting',
        words: ['作为', '表现', '行动', '行为', '搞', '发挥'],
        sentences: [
          s(
            '作为学生，你应该努力学习。',
            'zuòwéi xuésheng, nǐ yīnggāi nǔlì xuéxí.',
            'As a student, you should study hard.',
          ),
          s('他今天表现得很好。', 'tā jīntiān biǎoxiàn de hěn hǎo.', 'He did really well today.'),
          s('你在搞什么？', 'nǐ zài gǎo shénme?', 'What are you up to?'),
        ],
      },
      {
        id: 'h5-u16-l3',
        title: 'Aims',
        words: ['目标', '对象', '领域', '力量', '人生', '自由'],
        sentences: [
          s(
            '我的目标是说好汉语。',
            'wǒ de mùbiāo shì shuō hǎo Hànyǔ.',
            'My goal is to speak Chinese well.',
          ),
          s('人生很短。', 'rénshēng hěn duǎn.', 'Life is short.'),
          s('我喜欢自由的生活。', 'wǒ xǐhuan zìyóu de shēnghuó.', 'I like a life of freedom.'),
        ],
      },
      {
        id: 'h5-u16-l4',
        title: 'Looking for',
        words: ['寻找', '观察', '体验', '体会', '感受', '挑战'],
        sentences: [
          s('我在寻找新的工作。', 'wǒ zài xúnzhǎo xīn de gōngzuò.', "I'm looking for a new job."),
          s(
            '我想体验一下中国的生活。',
            'wǒ xiǎng tǐyàn yíxià Zhōngguó de shēnghuó.',
            "I'd like to experience life in China.",
          ),
          s(
            '这是一个很大的挑战。',
            'zhè shì yí gè hěn dà de tiǎozhàn.',
            'This is a big challenge.',
          ),
        ],
      },
      {
        id: 'h5-u16-l5',
        title: 'Quiet feelings',
        words: ['微笑', '表情', '沉默', '安慰', '拥抱', '勇气'],
        sentences: [
          s('她对我微笑。', 'tā duì wǒ wēixiào.', 'She smiled at me.'),
          s(
            '他很难过，我去安慰他。',
            'tā hěn nánguò, wǒ qù ānwèi tā.',
            'He was upset, so I went to comfort him.',
          ),
          s('他沉默了很久。', 'tā chénmò le hěn jiǔ.', 'He was silent for a long time.'),
        ],
      },
      {
        id: 'h5-u16-l6',
        title: 'Each their own',
        words: ['矛盾', '谈判', '分别', '单独', '各自', '亲自'],
        sentences: [
          s(
            '我想和你单独谈谈。',
            'wǒ xiǎng hé nǐ dāndú tántan.',
            "I'd like a word with you alone.",
          ),
          s(
            '聚会结束以后，大家各自回家了。',
            'jùhuì jiéshù yǐhòu, dàjiā gèzì huí jiā le.',
            'After the party everyone went their own way home.',
          ),
          s('经理亲自来了。', 'jīnglǐ qīnzì lái le.', 'The manager came in person.'),
        ],
      },
    ],
  },
  {
    id: 'h5-u17',
    hskLevel: 5,
    title: 'Plans and events',
    description: 'Opening and closing, organising, celebrations, records and trade.',
    lessons: [
      {
        id: 'h5-u17-l1',
        title: 'Opening and closing',
        words: ['建立', '成立', '开发', '开放', '关闭', '展开'],
        sentences: [
          s(
            '这家公司是去年成立的。',
            'zhè jiā gōngsī shì qùnián chénglì de.',
            'This company was set up last year.',
          ),
          s(
            '这个公园晚上十点关闭。',
            'zhège gōngyuán wǎnshang shí diǎn guānbì.',
            'This park closes at ten at night.',
          ),
        ],
      },
      {
        id: 'h5-u17-l2',
        title: 'Organising',
        words: ['制定', '指导', '指挥', '主持', '配合', '委托'],
        sentences: [
          s('我们要制定一个计划。', 'wǒmen yào zhìdìng yí gè jìhuà.', 'We need to draw up a plan.'),
          s('谢谢你的指导。', 'xièxie nǐ de zhǐdǎo.', 'Thank you for your guidance.'),
          s(
            '今天的会议由我主持。',
            'jīntiān de huìyì yóu wǒ zhǔchí.',
            "I'm chairing today's meeting.",
          ),
        ],
      },
      {
        id: 'h5-u17-l3',
        title: 'Celebrations',
        words: ['庆祝', '婚礼', '祝福', '纪念', '纪录', '传说'],
        sentences: [
          s(
            '我们去饭馆庆祝一下吧！',
            'wǒmen qù fànguǎn qìngzhù yíxià ba!',
            "Let's go out to a restaurant and celebrate!",
          ),
          s(
            '下个月我要参加朋友的婚礼。',
            'xià gè yuè wǒ yào cānjiā péngyou de hūnlǐ.',
            "Next month I'm going to a friend's wedding.",
          ),
          s('这是世界纪录。', 'zhè shì shìjiè jìlù.', "That's a world record."),
        ],
      },
      {
        id: 'h5-u17-l4',
        title: 'Keeping records',
        words: ['记录', '资料', '标志', '课程', '设施', '安装'],
        sentences: [
          s(
            '请把会议的内容记录下来。',
            'qǐng bǎ huìyì de nèiróng jìlù xiàlái.',
            'Please take notes of the meeting.',
          ),
          s(
            '这个学期我有五门课程。',
            'zhège xuéqī wǒ yǒu wǔ mén kèchéng.',
            'I have five courses this semester.',
          ),
          s(
            '师傅明天来安装空调。',
            'shīfu míngtiān lái ānzhuāng kōngtiáo.',
            'The technician is coming tomorrow to install the air conditioning.',
          ),
        ],
      },
      {
        id: 'h5-u17-l5',
        title: 'Trade',
        words: ['出口', '保险', '计算', '分配', '收获', '从事'],
        sentences: [
          s(
            '这次旅行我收获很大。',
            'zhè cì lǚxíng wǒ shōuhuò hěn dà.',
            'I got a lot out of this trip.',
          ),
          s('他从事教育工作。', 'tā cóngshì jiàoyù gōngzuò.', 'He works in education.'),
          s('出口在前面。', 'chūkǒu zài qiánmiàn.', 'The exit is ahead.'),
        ],
      },
    ],
  },
  {
    id: 'h5-u18',
    hskLevel: 5,
    title: 'The bigger picture',
    description: "Who's who, emphasis, causes and consequences, the situation.",
    lessons: [
      {
        id: 'h5-u18-l1',
        title: "Who's who",
        words: ['专家', '人物', '主人', '官', '私人', '宗教'],
        sentences: [
          s(
            '他是这方面的专家。',
            'tā shì zhè fāngmiàn de zhuānjiā.',
            "He's an expert in this area.",
          ),
          s('这是我的私人问题。', 'zhè shì wǒ de sīrén wèntí.', "That's a private matter."),
        ],
      },
      {
        id: 'h5-u18-l2',
        title: 'Emphasis',
        words: ['根本', '整个', '不如', '不必', '尽量', '重复'],
        grammar: 'buru',
        sentences: [
          s('我根本不认识他。', 'wǒ gēnběn bú rènshi tā.', "I don't know him at all."),
          s(
            '坐出租车不如坐地铁快。',
            'zuò chūzūchē bùrú zuò dìtiě kuài.',
            "A taxi isn't as fast as the subway.",
          ),
          s('你不必担心。', 'nǐ búbì dānxīn.', "There's no need to worry."),
        ],
      },
      {
        id: 'h5-u18-l3',
        title: 'Leading to',
        words: ['产生', '导致', '充满', '抓紧', '争取', '强调'],
        sentences: [
          s(
            '抽烟会导致很多问题。',
            'chōuyān huì dǎozhì hěn duō wèntí.',
            'Smoking leads to lots of problems.',
          ),
          s(
            '这个房间充满了阳光。',
            'zhège fángjiān chōngmǎn le yángguāng.',
            'This room is full of sunshine.',
          ),
          s(
            '我们要抓紧时间。',
            'wǒmen yào zhuājǐn shíjiān.',
            'We need to make the most of our time.',
          ),
        ],
      },
      {
        id: 'h5-u18-l4',
        title: 'The situation',
        words: ['形势', '气氛', '文明', '传统', '特征', '教训'],
        sentences: [
          s('聚会的气氛很好。', 'jùhuì de qìfēn hěn hǎo.', 'The party had a great atmosphere.'),
          s('这是中国的传统。', 'zhè shì Zhōngguó de chuántǒng.', "It's a Chinese tradition."),
          s(
            '这次失败给了我一个教训。',
            'zhè cì shībài gěi le wǒ yí gè jiàoxùn.',
            'This failure taught me a lesson.',
          ),
        ],
      },
    ],
  },
];
