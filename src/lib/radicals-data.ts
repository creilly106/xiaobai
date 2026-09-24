/** A compressed shape a radical takes when it is part of another character. */
export type RadicalForm = {
  char: string;
  /** Where the form sits inside a character, e.g. "left side". */
  position: string;
};

export type Radical = {
  /** Kangxi radical number (1–214). */
  number: number;
  /** The standalone form a learner of simplified Chinese sees. */
  hanzi: string;
  /** Traditional Kangxi form, when it differs from `hanzi`. */
  kangxi?: string;
  /** Component forms, e.g. 忄 for 心. */
  forms?: RadicalForm[];
  pinyin: string;
  meaning: string;
  /** Stroke count of `hanzi`. */
  strokes: number;
  /** Common characters that contain this radical (any of its forms). */
  examples?: string[];
};

// Core Kangxi radicals (selected) with simplified-Chinese forms.
export const radicals: Radical[] = [
  { number: 1, hanzi: '一', pinyin: 'yī', meaning: 'one, horizontal', strokes: 1, examples: ['三', '七', '下'] },
  { number: 2, hanzi: '丨', pinyin: 'gǔn', meaning: 'vertical line', strokes: 1, examples: ['中', '书'] },
  { number: 3, hanzi: '丶', pinyin: 'zhǔ', meaning: 'dot', strokes: 1, examples: ['主', '为'] },
  { number: 4, hanzi: '丿', pinyin: 'piě', meaning: 'left-falling stroke', strokes: 1, examples: ['九', '及'] },
  { number: 5, hanzi: '乙', pinyin: 'yǐ', meaning: 'second, twist', strokes: 1, examples: ['也', '书'] },
  { number: 6, hanzi: '亅', pinyin: 'jué', meaning: 'hook', strokes: 1, examples: ['了', '事'] },
  { number: 7, hanzi: '二', pinyin: 'èr', meaning: 'two', strokes: 2, examples: ['五', '井'] },
  { number: 8, hanzi: '亠', pinyin: 'tóu', meaning: 'lid', strokes: 2, examples: ['交', '京'] },
  { number: 9, hanzi: '人', forms: [{ char: '亻', position: 'left side' }], pinyin: 'rén', meaning: 'person', strokes: 2, examples: ['你', '他', '们', '会'] },
  { number: 10, hanzi: '儿', pinyin: 'ér', meaning: 'legs / son', strokes: 2, examples: ['先', '光'] },
  { number: 11, hanzi: '入', pinyin: 'rù', meaning: 'enter', strokes: 2, examples: ['内'] },
  { number: 12, hanzi: '八', pinyin: 'bā', meaning: 'eight, divide', strokes: 2, examples: ['分', '公'] },
  { number: 13, hanzi: '冂', pinyin: 'jiōng', meaning: 'downward box', strokes: 2, examples: ['同', '网'] },
  { number: 14, hanzi: '冖', pinyin: 'mì', meaning: 'cover', strokes: 2, examples: ['写', '军'] },
  { number: 15, hanzi: '冫', pinyin: 'bīng', meaning: 'ice', strokes: 2, examples: ['冷', '冰'] },
  { number: 16, hanzi: '几', pinyin: 'jī', meaning: 'small table', strokes: 2, examples: ['凡'] },
  { number: 17, hanzi: '凵', pinyin: 'kǎn', meaning: 'open box', strokes: 2, examples: ['出', '画'] },
  { number: 18, hanzi: '刀', forms: [{ char: '刂', position: 'right side' }], pinyin: 'dāo', meaning: 'knife', strokes: 2, examples: ['分', '别', '到'] },
  { number: 19, hanzi: '力', pinyin: 'lì', meaning: 'strength', strokes: 2, examples: ['男', '加', '动'] },
  { number: 20, hanzi: '勹', pinyin: 'bāo', meaning: 'wrap', strokes: 2, examples: ['包', '句'] },
  { number: 21, hanzi: '匕', pinyin: 'bǐ', meaning: 'spoon', strokes: 2, examples: ['化', '北'] },
  { number: 22, hanzi: '匚', pinyin: 'fāng', meaning: 'box (open on the right)', strokes: 2, examples: ['区'] },
  { number: 24, hanzi: '十', pinyin: 'shí', meaning: 'ten', strokes: 2, examples: ['千', '午', '半'] },
  { number: 25, hanzi: '卜', pinyin: 'bǔ', meaning: 'divination', strokes: 2, examples: ['占'] },
  { number: 26, hanzi: '卩', pinyin: 'jié', meaning: 'seal / kneel', strokes: 2, examples: ['即', '却'] },
  { number: 27, hanzi: '厂', pinyin: 'chǎng', meaning: 'cliff / factory', strokes: 2, examples: ['厚', '原'] },
  { number: 28, hanzi: '厶', pinyin: 'sī', meaning: 'private', strokes: 2, examples: ['去', '公'] },
  { number: 29, hanzi: '又', pinyin: 'yòu', meaning: 'again, right hand', strokes: 2, examples: ['友', '发', '受'] },
  { number: 30, hanzi: '口', pinyin: 'kǒu', meaning: 'mouth', strokes: 3, examples: ['吃', '喝', '叫', '吗'] },
  { number: 31, hanzi: '囗', pinyin: 'wéi', meaning: 'enclosure', strokes: 3, examples: ['国', '园', '因'] },
  { number: 32, hanzi: '土', pinyin: 'tǔ', meaning: 'earth, soil', strokes: 3, examples: ['地', '在', '坏'] },
  { number: 33, hanzi: '士', pinyin: 'shì', meaning: 'scholar', strokes: 3, examples: ['声', '喜'] },
  { number: 35, hanzi: '夂', pinyin: 'zhǐ', meaning: 'go slowly', strokes: 3, examples: ['冬', '夏'] },
  { number: 36, hanzi: '夕', pinyin: 'xī', meaning: 'evening', strokes: 3, examples: ['多', '外', '梦'] },
  { number: 37, hanzi: '大', pinyin: 'dà', meaning: 'big', strokes: 3, examples: ['太', '天', '夫'] },
  { number: 38, hanzi: '女', pinyin: 'nǚ', meaning: 'woman', strokes: 3, examples: ['她', '妈', '好', '姐'] },
  { number: 39, hanzi: '子', pinyin: 'zǐ', meaning: 'child', strokes: 3, examples: ['字', '孩', '学'] },
  { number: 40, hanzi: '宀', pinyin: 'mián', meaning: 'roof', strokes: 3, examples: ['家', '安', '完'] },
  { number: 41, hanzi: '寸', pinyin: 'cùn', meaning: 'inch, thumb', strokes: 3, examples: ['对', '寺', '封'] },
  { number: 42, hanzi: '小', pinyin: 'xiǎo', meaning: 'small', strokes: 3, examples: ['少', '尖'] },
  { number: 44, hanzi: '尸', pinyin: 'shī', meaning: 'corpse / body', strokes: 3, examples: ['局', '层', '屋'] },
  { number: 46, hanzi: '山', pinyin: 'shān', meaning: 'mountain', strokes: 3, examples: ['岛', '岸'] },
  { number: 47, hanzi: '川', kangxi: '巛', pinyin: 'chuān', meaning: 'river', strokes: 3, examples: ['州', '顺'] },
  { number: 48, hanzi: '工', pinyin: 'gōng', meaning: 'work', strokes: 3, examples: ['左', '差'] },
  { number: 49, hanzi: '己', pinyin: 'jǐ', meaning: 'self', strokes: 3, examples: ['已', '记'] },
  { number: 50, hanzi: '巾', pinyin: 'jīn', meaning: 'towel, cloth', strokes: 3, examples: ['帽', '帮', '常'] },
  { number: 51, hanzi: '干', pinyin: 'gān', meaning: 'dry', strokes: 3, examples: ['平'] },
  { number: 52, hanzi: '幺', pinyin: 'yāo', meaning: 'young, tiny', strokes: 3, examples: ['幼'] },
  { number: 53, hanzi: '广', pinyin: 'yǎn', meaning: 'shelter (dotted cliff)', strokes: 3, examples: ['店', '床', '座'] },
  { number: 54, hanzi: '廴', pinyin: 'yǐn', meaning: 'long stride', strokes: 2, examples: ['建', '延'] },
  { number: 55, hanzi: '廾', pinyin: 'gǒng', meaning: 'two hands', strokes: 3, examples: ['开', '弄'] },
  { number: 57, hanzi: '弓', pinyin: 'gōng', meaning: 'bow', strokes: 3, examples: ['张', '弟', '强'] },
  { number: 59, hanzi: '彡', pinyin: 'shān', meaning: 'hair, bristle', strokes: 3, examples: ['形', '影'] },
  { number: 60, hanzi: '彳', pinyin: 'chì', meaning: 'step', strokes: 3, examples: ['很', '往', '得'] },
  { number: 61, hanzi: '心', forms: [{ char: '忄', position: 'left side' }], pinyin: 'xīn', meaning: 'heart, mind', strokes: 4, examples: ['忙', '快', '想', '您'] },
  { number: 62, hanzi: '戈', pinyin: 'gē', meaning: 'halberd, weapon', strokes: 4, examples: ['我', '找', '成'] },
  { number: 63, hanzi: '户', pinyin: 'hù', meaning: 'door, household', strokes: 4, examples: ['房', '所'] },
  { number: 64, hanzi: '手', forms: [{ char: '扌', position: 'left side' }], pinyin: 'shǒu', meaning: 'hand', strokes: 4, examples: ['打', '拉', '找', '拿'] },
  { number: 66, hanzi: '攴', forms: [{ char: '攵', position: 'right side' }], pinyin: 'pū', meaning: 'strike, action', strokes: 4, examples: ['放', '教', '故'] },
  { number: 67, hanzi: '文', pinyin: 'wén', meaning: 'script, culture', strokes: 4, examples: ['这'] },
  { number: 69, hanzi: '斤', pinyin: 'jīn', meaning: 'axe', strokes: 4, examples: ['新', '断', '近'] },
  { number: 70, hanzi: '方', pinyin: 'fāng', meaning: 'direction, square', strokes: 4, examples: ['放', '旁', '旅'] },
  { number: 71, hanzi: '无', pinyin: 'wú', meaning: 'not have', strokes: 4 },
  { number: 72, hanzi: '日', pinyin: 'rì', meaning: 'sun, day', strokes: 4, examples: ['明', '早', '时'] },
  { number: 73, hanzi: '曰', pinyin: 'yuē', meaning: 'to say', strokes: 4, examples: ['最', '替'] },
  { number: 74, hanzi: '月', pinyin: 'yuè', meaning: 'moon, month', strokes: 4, examples: ['明', '朋', '期'] },
  { number: 75, hanzi: '木', pinyin: 'mù', meaning: 'tree, wood', strokes: 4, examples: ['树', '林', '本'] },
  { number: 76, hanzi: '欠', pinyin: 'qiàn', meaning: 'lack, owe / yawn', strokes: 4, examples: ['歌', '欢'] },
  { number: 77, hanzi: '止', pinyin: 'zhǐ', meaning: 'stop', strokes: 4, examples: ['正', '步'] },
  { number: 79, hanzi: '殳', pinyin: 'shū', meaning: 'weapon, spear', strokes: 4, examples: ['没', '般'] },
  { number: 80, hanzi: '毋', pinyin: 'wú', meaning: 'do not', strokes: 4, examples: ['每'] },
  { number: 81, hanzi: '比', pinyin: 'bǐ', meaning: 'compare', strokes: 4 },
  { number: 82, hanzi: '毛', pinyin: 'máo', meaning: 'fur, hair', strokes: 4, examples: ['笔', '毯'] },
  { number: 84, hanzi: '气', pinyin: 'qì', meaning: 'air, breath', strokes: 4, examples: ['汽'] },
  { number: 85, hanzi: '水', forms: [{ char: '氵', position: 'left side' }], pinyin: 'shuǐ', meaning: 'water', strokes: 4, examples: ['河', '海', '洗', '泉'] },
  { number: 86, hanzi: '火', forms: [{ char: '灬', position: 'bottom' }], pinyin: 'huǒ', meaning: 'fire', strokes: 4, examples: ['烟', '灯', '热', '点'] },
  { number: 87, hanzi: '爪', forms: [{ char: '爫', position: 'top' }], pinyin: 'zhǎo', meaning: 'claw', strokes: 4, examples: ['爱', '爬'] },
  { number: 88, hanzi: '父', pinyin: 'fù', meaning: 'father', strokes: 4, examples: ['爸', '爷'] },
  { number: 89, hanzi: '爻', pinyin: 'yáo', meaning: 'divination line', strokes: 4 },
  { number: 91, hanzi: '片', pinyin: 'piàn', meaning: 'slice, piece', strokes: 4, examples: ['版', '牌'] },
  { number: 92, hanzi: '牙', pinyin: 'yá', meaning: 'tooth', strokes: 4, examples: ['穿'] },
  { number: 93, hanzi: '牛', forms: [{ char: '牜', position: 'left side' }], pinyin: 'niú', meaning: 'cow, ox', strokes: 4, examples: ['物', '特'] },
  { number: 94, hanzi: '犬', forms: [{ char: '犭', position: 'left side' }], pinyin: 'quǎn', meaning: 'dog', strokes: 4, examples: ['猫', '狗', '哭'] },
  { number: 96, hanzi: '玉', forms: [{ char: '王', position: 'left side' }], pinyin: 'yù', meaning: 'jade', strokes: 5, examples: ['玩', '现', '球', '国'] },
  { number: 98, hanzi: '瓦', pinyin: 'wǎ', meaning: 'tile', strokes: 4, examples: ['瓶'] },
  { number: 99, hanzi: '甘', pinyin: 'gān', meaning: 'sweet', strokes: 5, examples: ['甜'] },
  { number: 100, hanzi: '生', pinyin: 'shēng', meaning: 'life, birth', strokes: 5, examples: ['星', '姓'] },
  { number: 101, hanzi: '用', pinyin: 'yòng', meaning: 'use', strokes: 5 },
  { number: 102, hanzi: '田', pinyin: 'tián', meaning: 'field, farmland', strokes: 5, examples: ['男', '界', '留'] },
  { number: 103, hanzi: '疋', pinyin: 'pǐ', meaning: 'bolt of cloth', strokes: 5, examples: ['蛋'] },
  { number: 104, hanzi: '疒', pinyin: 'nè', meaning: 'sickness', strokes: 5, examples: ['病', '痛', '疼'] },
  { number: 106, hanzi: '白', pinyin: 'bái', meaning: 'white', strokes: 5, examples: ['的', '百'] },
  { number: 107, hanzi: '皮', pinyin: 'pí', meaning: 'skin', strokes: 5, examples: ['被', '破'] },
  { number: 108, hanzi: '皿', pinyin: 'mǐn', meaning: 'dish, container', strokes: 5, examples: ['盘', '盒'] },
  { number: 109, hanzi: '目', pinyin: 'mù', meaning: 'eye', strokes: 5, examples: ['看', '眼', '睛'] },
  { number: 110, hanzi: '矛', pinyin: 'máo', meaning: 'spear', strokes: 5, examples: ['柔'] },
  { number: 111, hanzi: '矢', pinyin: 'shǐ', meaning: 'arrow', strokes: 5, examples: ['知', '矮'] },
  { number: 112, hanzi: '石', pinyin: 'shí', meaning: 'stone', strokes: 5, examples: ['破', '码', '研'] },
  { number: 113, hanzi: '示', forms: [{ char: '礻', position: 'left side' }], pinyin: 'shì', meaning: 'show, spirit', strokes: 5, examples: ['祝', '福', '票'] },
  { number: 115, hanzi: '禾', pinyin: 'hé', meaning: 'grain', strokes: 5, examples: ['和', '秋', '香'] },
  { number: 116, hanzi: '穴', pinyin: 'xué', meaning: 'cave', strokes: 5, examples: ['空', '窗'] },
  { number: 117, hanzi: '立', pinyin: 'lì', meaning: 'stand', strokes: 5, examples: ['站', '童'] },
  { number: 118, hanzi: '竹', forms: [{ char: '⺮', position: 'top' }], pinyin: 'zhú', meaning: 'bamboo', strokes: 6, examples: ['等', '第', '笔'] },
  { number: 119, hanzi: '米', pinyin: 'mǐ', meaning: 'rice', strokes: 6, examples: ['粉', '糖'] },
  { number: 120, hanzi: '糸', forms: [{ char: '纟', position: 'left side' }], pinyin: 'sī', meaning: 'silk, thread', strokes: 6, examples: ['红', '线', '给', '紧'] },
  { number: 122, hanzi: '网', forms: [{ char: '罒', position: 'top' }], pinyin: 'wǎng', meaning: 'net', strokes: 6, examples: ['罗', '置'] },
  { number: 123, hanzi: '羊', pinyin: 'yáng', meaning: 'sheep', strokes: 6, examples: ['美', '着', '样'] },
  { number: 124, hanzi: '羽', pinyin: 'yǔ', meaning: 'feather', strokes: 6, examples: ['翅'] },
  { number: 125, hanzi: '老', forms: [{ char: '耂', position: 'top' }], pinyin: 'lǎo', meaning: 'old', strokes: 6, examples: ['考', '者'] },
  { number: 126, hanzi: '而', pinyin: 'ér', meaning: 'and, but', strokes: 6, examples: ['需', '耐'] },
  { number: 128, hanzi: '耳', pinyin: 'ěr', meaning: 'ear', strokes: 6, examples: ['聪', '取', '闻'] },
  { number: 130, hanzi: '肉', forms: [{ char: '月', position: 'left side — looks just like 月 "moon"' }], pinyin: 'ròu', meaning: 'meat, flesh', strokes: 6, examples: ['肚', '腿', '脸'] },
  { number: 132, hanzi: '自', pinyin: 'zì', meaning: 'self', strokes: 6, examples: ['息', '鼻'] },
  { number: 133, hanzi: '至', pinyin: 'zhì', meaning: 'to arrive', strokes: 6, examples: ['到', '室'] },
  { number: 134, hanzi: '臼', pinyin: 'jiù', meaning: 'mortar', strokes: 6, examples: ['舅'] },
  { number: 135, hanzi: '舌', pinyin: 'shé', meaning: 'tongue', strokes: 6, examples: ['话', '活', '舒'] },
  { number: 137, hanzi: '舟', pinyin: 'zhōu', meaning: 'boat', strokes: 6, examples: ['船', '般'] },
  { number: 138, hanzi: '艮', pinyin: 'gěn', meaning: 'blunt, still', strokes: 6, examples: ['很', '跟', '银'] },
  { number: 139, hanzi: '色', pinyin: 'sè', meaning: 'color', strokes: 6 },
  { number: 140, hanzi: '艸', forms: [{ char: '艹', position: 'top' }], pinyin: 'cǎo', meaning: 'grass, plant', strokes: 6, examples: ['花', '茶', '菜'] },
  { number: 141, hanzi: '虍', pinyin: 'hū', meaning: 'tiger', strokes: 6, examples: ['虎', '虑'] },
  { number: 142, hanzi: '虫', pinyin: 'chóng', meaning: 'insect', strokes: 6, examples: ['虾', '蛋', '蛇'] },
  { number: 144, hanzi: '行', pinyin: 'xíng', meaning: 'walk, go', strokes: 6, examples: ['街'] },
  { number: 145, hanzi: '衣', forms: [{ char: '衤', position: 'left side' }], pinyin: 'yī', meaning: 'clothing', strokes: 6, examples: ['裤', '裙', '衬'] },
  { number: 147, hanzi: '见', kangxi: '見', pinyin: 'jiàn', meaning: 'see', strokes: 4, examples: ['视', '现', '觉'] },
  { number: 149, hanzi: '言', forms: [{ char: '讠', position: 'left side' }], pinyin: 'yán', meaning: 'speech', strokes: 7, examples: ['说', '话', '语', '请'] },
  { number: 150, hanzi: '谷', pinyin: 'gǔ', meaning: 'valley', strokes: 7, examples: ['欲'] },
  { number: 154, hanzi: '贝', kangxi: '貝', pinyin: 'bèi', meaning: 'shell, money', strokes: 4, examples: ['贵', '费', '员'] },
  { number: 156, hanzi: '走', pinyin: 'zǒu', meaning: 'walk, run', strokes: 7, examples: ['起', '超', '趣'] },
  { number: 157, hanzi: '足', forms: [{ char: '⻊', position: 'left side' }], pinyin: 'zú', meaning: 'foot', strokes: 7, examples: ['跑', '跳', '路'] },
  { number: 158, hanzi: '身', pinyin: 'shēn', meaning: 'body', strokes: 7, examples: ['躺'] },
  { number: 159, hanzi: '车', kangxi: '車', pinyin: 'chē', meaning: 'vehicle', strokes: 4, examples: ['轻', '轮', '较'] },
  { number: 160, hanzi: '辛', pinyin: 'xīn', meaning: 'bitter', strokes: 7, examples: ['辣', '辞'] },
  { number: 161, hanzi: '辰', pinyin: 'chén', meaning: 'morning', strokes: 7, examples: ['晨', '震'] },
  { number: 162, hanzi: '辵', forms: [{ char: '辶', position: 'wraps the bottom-left' }], pinyin: 'chuò', meaning: 'walk (movement)', strokes: 7, examples: ['进', '过', '这', '还'] },
  { number: 163, hanzi: '邑', forms: [{ char: '阝', position: 'right side — "city"' }], pinyin: 'yì', meaning: 'city', strokes: 7, examples: ['都', '邮', '那'] },
  { number: 164, hanzi: '酉', pinyin: 'yǒu', meaning: 'wine, alcohol', strokes: 7, examples: ['酒', '酸', '醒'] },
  { number: 166, hanzi: '里', pinyin: 'lǐ', meaning: 'village, inside', strokes: 7, examples: ['野', '量'] },
  { number: 167, hanzi: '金', forms: [{ char: '钅', position: 'left side' }], pinyin: 'jīn', meaning: 'gold, metal', strokes: 8, examples: ['钱', '钟', '错'] },
  { number: 169, hanzi: '门', kangxi: '門', pinyin: 'mén', meaning: 'gate, door', strokes: 3, examples: ['问', '间', '闹'] },
  { number: 170, hanzi: '阜', forms: [{ char: '阝', position: 'left side — "mound"' }], pinyin: 'fù', meaning: 'mound, hill', strokes: 8, examples: ['阴', '阳', '院'] },
  { number: 172, hanzi: '隹', pinyin: 'zhuī', meaning: 'short-tailed bird', strokes: 8, examples: ['难', '谁', '准'] },
  { number: 173, hanzi: '雨', pinyin: 'yǔ', meaning: 'rain', strokes: 8, examples: ['雪', '雷', '零'] },
  { number: 176, hanzi: '面', pinyin: 'miàn', meaning: 'face; surface', strokes: 9 },
  { number: 177, hanzi: '革', pinyin: 'gé', meaning: 'leather', strokes: 9, examples: ['鞋'] },
  { number: 180, hanzi: '音', pinyin: 'yīn', meaning: 'sound', strokes: 9, examples: ['意', '暗'] },
  { number: 181, hanzi: '页', kangxi: '頁', pinyin: 'yè', meaning: 'page, head', strokes: 6, examples: ['颜', '题', '顺'] },
  { number: 182, hanzi: '风', kangxi: '風', pinyin: 'fēng', meaning: 'wind', strokes: 4 },
  { number: 184, hanzi: '食', forms: [{ char: '饣', position: 'left side' }], pinyin: 'shí', meaning: 'eat, food', strokes: 9, examples: ['饭', '饺', '饿', '餐'] },
  { number: 185, hanzi: '首', pinyin: 'shǒu', meaning: 'head', strokes: 9, examples: ['道'] },
  { number: 187, hanzi: '马', kangxi: '馬', pinyin: 'mǎ', meaning: 'horse', strokes: 3, examples: ['妈', '骑', '吗'] },
  { number: 195, hanzi: '鱼', kangxi: '魚', pinyin: 'yú', meaning: 'fish', strokes: 8, examples: ['鲜'] },
  { number: 196, hanzi: '鸟', kangxi: '鳥', pinyin: 'niǎo', meaning: 'bird', strokes: 5, examples: ['鸡', '鸭'] },
  { number: 205, hanzi: '黾', kangxi: '黽', pinyin: 'mǐn', meaning: 'frog, toad', strokes: 8, examples: ['绳'] },
  { number: 210, hanzi: '齐', kangxi: '齊', pinyin: 'qí', meaning: 'even, equal', strokes: 6, examples: ['济'] },
  { number: 211, hanzi: '齿', kangxi: '齒', pinyin: 'chǐ', meaning: 'tooth', strokes: 8 },
  { number: 212, hanzi: '龙', kangxi: '龍', pinyin: 'lóng', meaning: 'dragon', strokes: 5 },
];

/** Every character (standalone, Kangxi or component form) that names this radical. */
export function radicalChars(r: Radical): string[] {
  return [r.hanzi, ...(r.kangxi ? [r.kangxi] : []), ...(r.forms ?? []).map((f) => f.char)];
}

/**
 * Find the radical a character or component form belongs to. 阝 is ambiguous
 * (city vs mound) — callers that know the position should disambiguate.
 */
export function findRadical(char: string): Radical | null {
  return radicals.find((r) => radicalChars(r).includes(char)) ?? null;
}
