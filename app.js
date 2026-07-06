const STORAGE_KEY = "pokemon-figure-collection-slides-v2";
const LOCAL_ICON_IDS = new Set([6, 25, 94, 130, 142, 149, 227, 230, 248, 282, 306, 344, 346, 348, 350, 376, 407, 423, 442, 443, 445, 448, 461, 468, 530, 587, 612, 635, 652, 687, 697, 699, 701, 706, 711, 812, 815, 818, 865, 866, 882, 887]);
const LOCAL_ICON_BASE = "../pokemon_masters_collection/icons/";
const REMOTE_ICON_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const OWNED_STATUSES = new Set(["已购", "已到货"]);
const FIGURE_COLORS = ["原色", "异色", "特殊色"];
const EXPORT_ICON_WORKERS = 64;
const EXPORT_ICON_LOAD_TIMEOUT_MS = 1800;
const EXPORT_ICON_LOAD_BUDGET_MS = 18000;
const EXPORT_STATUS_STYLES = {
  luxury: { fill: "#dff6ed", border: "#0f8b65", badge: "#0f8b65", text: "#0f513f" },
  other: { fill: "#fff1cb", border: "#c58a11", badge: "#c58a11", text: "#7c5608" },
  pending: { fill: "#dceafe", border: "#2563eb", badge: "#2563eb", text: "#1741a6" },
  missing: { fill: "#fde4e2", border: "#c9433d", badge: "#c9433d", text: "#8e2d28" },
};
const SLIDES = [
  ["dashboard", "总览"],
  ["dex", "总图鉴"],
  ["teams", "人物阵容"],
  ["add", "批量新增"],
  ["inventory", "库存"],
  ["extra", "扩展图鉴"],
  ["sources", "说明"],
];
const BASE_PHASES = [
  { id: "gen1", label: "001-151", start: 1, end: 151 },
  { id: "gen2", label: "152-251", start: 152, end: 251 },
  { id: "gen3", label: "252-386", start: 252, end: 386 },
  { id: "gen4", label: "387-493", start: 387, end: 493 },
];
const PHASES = [
  ...BASE_PHASES,
  { id: "mega", label: "超级进化", isMega: true },
];
const NATIONAL_GENERATIONS = [
  { id: "gen1", label: "第1世代 001-151", shortLabel: "第1世代", start: 1, end: 151 },
  { id: "gen2", label: "第2世代 152-251", shortLabel: "第2世代", start: 152, end: 251 },
  { id: "gen3", label: "第3世代 252-386", shortLabel: "第3世代", start: 252, end: 386 },
  { id: "gen4", label: "第4世代 387-493", shortLabel: "第4世代", start: 387, end: 493 },
  { id: "gen5", label: "第5世代 494-649", shortLabel: "第5世代", start: 494, end: 649 },
  { id: "gen6", label: "第6世代 650-721", shortLabel: "第6世代", start: 650, end: 721 },
  { id: "gen7", label: "第7世代 722-809", shortLabel: "第7世代", start: 722, end: 809 },
  { id: "gen8", label: "第8世代 810-905", shortLabel: "第8世代", start: 810, end: 905 },
  { id: "gen9", label: "第9世代 906-1025", shortLabel: "第9世代", start: 906, end: 1025 },
];

const KNOWN_NAMES = {
  1: "妙蛙种子", 2: "妙蛙草", 3: "妙蛙花", 4: "小火龙", 5: "火恐龙", 6: "喷火龙", 7: "杰尼龟", 8: "卡咪龟",
  9: "水箭龟", 10: "绿毛虫", 11: "铁甲蛹", 12: "巴大蝶", 13: "独角虫", 14: "铁壳蛹", 15: "大针蜂", 16: "波波",
  17: "比比鸟", 18: "大比鸟", 19: "小拉达", 20: "拉达", 21: "烈雀", 22: "大嘴雀", 23: "阿柏蛇", 24: "阿柏怪",
  25: "皮卡丘", 26: "雷丘", 27: "穿山鼠", 28: "穿山王", 29: "尼多兰", 30: "尼多娜", 31: "尼多后", 32: "尼多朗",
  33: "尼多力诺", 34: "尼多王", 35: "皮皮", 36: "皮可西", 37: "六尾", 38: "九尾", 39: "胖丁", 40: "胖可丁",
  41: "超音蝠", 42: "大嘴蝠", 43: "走路草", 44: "臭臭花", 45: "霸王花", 46: "派拉斯", 47: "派拉斯特", 48: "毛球",
  49: "摩鲁蛾", 50: "地鼠", 51: "三地鼠", 52: "喵喵", 53: "猫老大", 54: "可达鸭", 55: "哥达鸭", 56: "猴怪",
  57: "火暴猴", 58: "卡蒂狗", 59: "风速狗", 60: "蚊香蝌蚪", 61: "蚊香君", 62: "蚊香泳士", 63: "凯西", 64: "勇基拉",
  65: "胡地", 66: "腕力", 67: "豪力", 68: "怪力", 69: "喇叭芽", 70: "口呆花", 71: "大食花", 72: "玛瑙水母",
  73: "毒刺水母", 74: "小拳石", 75: "隆隆石", 76: "隆隆岩", 77: "小火马", 78: "烈焰马", 79: "呆呆兽", 80: "呆壳兽",
  81: "小磁怪", 82: "三合一磁怪", 83: "大葱鸭", 84: "嘟嘟", 85: "嘟嘟利", 86: "小海狮", 87: "白海狮", 88: "臭泥",
  89: "臭臭泥", 90: "大舌贝", 91: "刺甲贝", 92: "鬼斯", 93: "鬼斯通", 94: "耿鬼", 95: "大岩蛇", 96: "催眠貘",
  97: "引梦貘人", 98: "大钳蟹", 99: "巨钳蟹", 100: "霹雳电球", 101: "顽皮雷弹", 102: "蛋蛋", 103: "椰蛋树", 104: "卡拉卡拉",
  105: "嘎啦嘎啦", 106: "飞腿郎", 107: "快拳郎", 108: "大舌头", 109: "瓦斯弹", 110: "双弹瓦斯", 111: "独角犀牛", 112: "钻角犀兽",
  113: "吉利蛋", 114: "蔓藤怪", 115: "袋兽", 116: "墨海马", 117: "海刺龙", 118: "角金鱼", 119: "金鱼王", 120: "海星星",
  121: "宝石海星", 122: "魔墙人偶", 123: "飞天螳螂", 124: "迷唇姐", 125: "电击兽", 126: "鸭嘴火兽", 127: "凯罗斯", 128: "肯泰罗",
  129: "鲤鱼王", 130: "暴鲤龙", 131: "拉普拉斯", 132: "百变怪", 133: "伊布", 134: "水伊布", 135: "雷伊布", 136: "火伊布",
  137: "多边兽", 138: "菊石兽", 139: "多刺菊石兽", 140: "化石盔", 141: "镰刀盔", 142: "化石翼龙", 143: "卡比兽", 144: "急冻鸟",
  145: "闪电鸟", 146: "火焰鸟", 147: "迷你龙", 148: "哈克龙", 149: "快龙", 150: "超梦", 151: "梦幻", 152: "菊草叶",
  153: "月桂叶", 154: "大竺葵", 155: "火球鼠", 156: "火岩鼠", 157: "火暴兽", 158: "小锯鳄", 159: "蓝鳄", 160: "大力鳄",
  161: "尾立", 162: "大尾立", 163: "咕咕", 164: "猫头夜鹰", 165: "芭瓢虫", 166: "安瓢虫", 167: "圆丝蛛", 168: "阿利多斯",
  169: "叉字蝠", 170: "灯笼鱼", 171: "电灯怪", 172: "皮丘", 173: "皮宝宝", 174: "宝宝丁", 175: "波克比", 176: "波克基古",
  177: "天然雀", 178: "天然鸟", 179: "咩利羊", 180: "茸茸羊", 181: "电龙", 182: "美丽花", 183: "玛力露", 184: "玛力露丽",
  185: "树才怪", 186: "蚊香蛙皇", 187: "毽子草", 188: "毽子花", 189: "毽子棉", 190: "长尾怪手", 191: "向日种子", 192: "向日花怪",
  193: "蜻蜻蜓", 194: "乌波", 195: "沼王", 196: "太阳伊布", 197: "月亮伊布", 198: "黑暗鸦", 199: "呆呆王", 200: "梦妖",
  201: "未知图腾", 202: "果然翁", 203: "麒麟奇", 204: "榛果球", 205: "佛烈托斯", 206: "土龙弟弟", 207: "天蝎", 208: "大钢蛇",
  209: "布鲁", 210: "布鲁皇", 211: "千针鱼", 212: "巨钳螳螂", 213: "壶壶", 214: "赫拉克罗斯", 215: "狃拉", 216: "熊宝宝",
  217: "圈圈熊", 218: "熔岩虫", 219: "熔岩蜗牛", 220: "小山猪", 221: "长毛猪", 222: "太阳珊瑚", 223: "铁炮鱼", 224: "章鱼桶",
  225: "信使鸟", 226: "巨翅飞鱼", 227: "盔甲鸟", 228: "戴鲁比", 229: "黑鲁加", 230: "刺龙王", 231: "小小象", 232: "顿甲",
  233: "多边兽２型", 234: "惊角鹿", 235: "图图犬", 236: "无畏小子", 237: "战舞郎", 238: "迷唇娃", 239: "电击怪", 240: "鸭嘴宝宝",
  241: "大奶罐", 242: "幸福蛋", 243: "雷公", 244: "炎帝", 245: "水君", 246: "幼基拉斯", 247: "沙基拉斯", 248: "班基拉斯",
  249: "洛奇亚", 250: "凤王", 251: "时拉比", 252: "木守宫", 253: "森林蜥蜴", 254: "蜥蜴王", 255: "火稚鸡", 256: "力壮鸡",
  257: "火焰鸡", 258: "水跃鱼", 259: "沼跃鱼", 260: "巨沼怪", 261: "土狼犬", 262: "大狼犬", 263: "蛇纹熊", 264: "直冲熊",
  265: "刺尾虫", 266: "甲壳茧", 267: "狩猎凤蝶", 268: "盾甲茧", 269: "毒粉蛾", 270: "莲叶童子", 271: "莲帽小童", 272: "乐天河童",
  273: "橡实果", 274: "长鼻叶", 275: "狡猾天狗", 276: "傲骨燕", 277: "大王燕", 278: "长翅鸥", 279: "大嘴鸥", 280: "拉鲁拉丝",
  281: "奇鲁莉安", 282: "沙奈朵", 283: "溜溜糖球", 284: "雨翅蛾", 285: "蘑蘑菇", 286: "斗笠菇", 287: "懒人獭", 288: "过动猿",
  289: "请假王", 290: "土居忍士", 291: "铁面忍者", 292: "脱壳忍者", 293: "咕妞妞", 294: "吼爆弹", 295: "爆音怪", 296: "幕下力士",
  297: "铁掌力士", 298: "露力丽", 299: "朝北鼻", 300: "向尾喵", 301: "优雅猫", 302: "勾魂眼", 303: "大嘴娃", 304: "可可多拉",
  305: "可多拉", 306: "波士可多拉", 307: "玛沙那", 308: "恰雷姆", 309: "落雷兽", 310: "雷电兽", 311: "正电拍拍", 312: "负电拍拍",
  313: "电萤虫", 314: "甜甜萤", 315: "毒蔷薇", 316: "溶食兽", 317: "吞食兽", 318: "利牙鱼", 319: "巨牙鲨", 320: "吼吼鲸",
  321: "吼鲸王", 322: "呆火驼", 323: "喷火驼", 324: "煤炭龟", 325: "跳跳猪", 326: "噗噗猪", 327: "晃晃斑", 328: "大颚蚁",
  329: "超音波幼虫", 330: "沙漠蜻蜓", 331: "刺球仙人掌", 332: "梦歌仙人掌", 333: "青绵鸟", 334: "七夕青鸟", 335: "猫鼬斩", 336: "饭匙蛇",
  337: "月石", 338: "太阳岩", 339: "泥泥鳅", 340: "鲶鱼王", 341: "龙虾小兵", 342: "铁螯龙虾", 343: "天秤偶", 344: "念力土偶",
  345: "触手百合", 346: "摇篮百合", 347: "太古羽虫", 348: "太古盔甲", 349: "丑丑鱼", 350: "美纳斯", 351: "飘浮泡泡", 352: "变隐龙",
  353: "怨影娃娃", 354: "诅咒娃娃", 355: "夜巡灵", 356: "彷徨夜灵", 357: "热带龙", 358: "风铃铃", 359: "阿勃梭鲁", 360: "小果然",
  361: "雪童子", 362: "冰鬼护", 363: "海豹球", 364: "海魔狮", 365: "帝牙海狮", 366: "珍珠贝", 367: "猎斑鱼", 368: "樱花鱼",
  369: "古空棘鱼", 370: "爱心鱼", 371: "宝贝龙", 372: "甲壳龙", 373: "暴飞龙", 374: "铁哑铃", 375: "金属怪", 376: "巨金怪",
  377: "雷吉洛克", 378: "雷吉艾斯", 379: "雷吉斯奇鲁", 380: "拉帝亚斯", 381: "拉帝欧斯", 382: "盖欧卡", 383: "固拉多", 384: "烈空坐",
  385: "基拉祈", 386: "代欧奇希斯", 387: "草苗龟", 388: "树林龟", 389: "土台龟", 390: "小火焰猴", 391: "猛火猴", 392: "烈焰猴",
  393: "波加曼", 394: "波皇子", 395: "帝王拿波", 396: "姆克儿", 397: "姆克鸟", 398: "姆克鹰", 399: "大牙狸", 400: "大尾狸",
  401: "圆法师", 402: "音箱蟀", 403: "小猫怪", 404: "勒克猫", 405: "伦琴猫", 406: "含羞苞", 407: "罗丝雷朵", 408: "头盖龙",
  409: "战槌龙", 410: "盾甲龙", 411: "护城龙", 412: "结草儿", 413: "结草贵妇", 414: "绅士蛾", 415: "三蜜蜂", 416: "蜂女王",
  417: "帕奇利兹", 418: "泳圈鼬", 419: "浮潜鼬", 420: "樱花宝", 421: "樱花儿", 422: "无壳海兔", 423: "海兔兽", 424: "双尾怪手",
  425: "飘飘球", 426: "随风球", 427: "卷卷耳", 428: "长耳兔", 429: "梦妖魔", 430: "乌鸦头头", 431: "魅力喵", 432: "东施喵",
  433: "铃铛响", 434: "臭鼬噗", 435: "坦克臭鼬", 436: "铜镜怪", 437: "青铜钟", 438: "盆才怪", 439: "魔尼尼", 440: "小福蛋",
  441: "聒噪鸟", 442: "花岩怪", 443: "圆陆鲨", 444: "尖牙陆鲨", 445: "烈咬陆鲨", 446: "小卡比兽", 447: "利欧路", 448: "路卡利欧",
  449: "沙河马", 450: "河马兽", 451: "钳尾蝎", 452: "龙王蝎", 453: "不良蛙", 454: "毒骷蛙", 455: "尖牙笼", 456: "荧光鱼",
  457: "霓虹鱼", 458: "小球飞鱼", 459: "雪笠怪", 460: "暴雪王", 461: "玛狃拉", 462: "自爆磁怪", 463: "大舌舔", 464: "超甲狂犀",
  465: "巨蔓藤", 466: "电击魔兽", 467: "鸭嘴炎兽", 468: "波克基斯", 469: "远古巨蜓", 470: "叶伊布", 471: "冰伊布", 472: "天蝎王",
  473: "象牙猪", 474: "多边兽乙型", 475: "艾路雷朵", 476: "大朝北鼻", 477: "黑夜魔灵", 478: "雪妖女", 479: "洛托姆", 480: "由克希",
  481: "艾姆利多", 482: "亚克诺姆", 483: "帝牙卢卡", 484: "帕路奇亚", 485: "席多蓝恩", 486: "雷吉奇卡斯", 487: "骑拉帝纳", 488: "克雷色利亚",
  489: "霏欧纳", 490: "玛纳霏", 491: "达克莱伊", 492: "谢米", 493: "阿尔宙斯",
  495: "藤藤蛇", 499: "炒炒猪", 501: "水水獭", 521: "高傲雉鸡", 525: "地幔岩", 530: "龙头地鼠", 536: "蓝蟾蜍", 542: "保姆虫", 553: "流氓鳄", 559: "滑滑小子", 587: "电飞鼠",
  612: "双斧战龙", 635: "三首恶龙", 652: "布里卡隆", 658: "甲贺忍蛙", 663: "烈箭鹰", 687: "乌贼王", 697: "怪颚龙", 699: "冰雪巨龙", 701: "摔角鹰人", 706: "黏美龙", 711: "南瓜怪人", 715: "音波龙",
  722: "木木枭", 727: "炽焰咆哮虎", 745: "鬃岩狼人", 804: "四颚针龙", 809: "美录梅塔", 812: "轰擂金刚猩", 815: "闪焰王牌", 818: "千面避役", 865: "葱游兵", 866: "踏冰人偶", 882: "鳃鱼龙", 887: "多龙巴鲁托",
};

Object.assign(KNOWN_NAMES, window.POKEMON_SPECIES_NAMES || {});
const POKEMON_MAX_DEX = window.POKEMON_SPECIES_MAX_DEX || Math.max(...Object.keys(KNOWN_NAMES).map(Number), 493);

const POKEDEX = Array.from({ length: 493 }, (_, index) => {
  const dex = index + 1;
  return { dex, name: KNOWN_NAMES[dex] || `No.${padDex(dex)}` };
});

const ALL_POKEMON = Array.from({ length: POKEMON_MAX_DEX }, (_, index) => {
  const dex = index + 1;
  return { dex, name: pokemonName(dex) };
});
const POKEMON_NAME_INDEX = ALL_POKEMON
  .filter((entry) => entry.name && !entry.name.startsWith("No."))
  .sort((a, b) => b.name.length - a.name.length || a.dex - b.dex);
const POKEMON_PARSE_ALIASES = [
  {
    term: "XY喷",
    dex: 6,
    name: "喷火龙",
    kind: "mega",
    expandsTo: [
      { term: "X喷", dex: 6, name: "喷火龙", kind: "mega", megaKey: "charizard-mega-x" },
      { term: "Y喷", dex: 6, name: "喷火龙", kind: "mega", megaKey: "charizard-mega-y" },
    ],
  },
  {
    term: "喷XY",
    dex: 6,
    name: "喷火龙",
    kind: "mega",
    expandsTo: [
      { term: "喷X", dex: 6, name: "喷火龙", kind: "mega", megaKey: "charizard-mega-x" },
      { term: "喷Y", dex: 6, name: "喷火龙", kind: "mega", megaKey: "charizard-mega-y" },
    ],
  },
  { term: "X喷", dex: 6, name: "喷火龙", kind: "mega", megaKey: "charizard-mega-x" },
  { term: "Y喷", dex: 6, name: "喷火龙", kind: "mega", megaKey: "charizard-mega-y" },
  { term: "喷X", dex: 6, name: "喷火龙", kind: "mega", megaKey: "charizard-mega-x" },
  { term: "喷Y", dex: 6, name: "喷火龙", kind: "mega", megaKey: "charizard-mega-y" },
  { term: "火爆猴", dex: 57, name: "火暴猴" },
].sort((a, b) => b.term.length - a.term.length);
const EVOLUTION_CHAINS = window.POKEMON_EVOLUTION_CHAINS || {};
const MEGA_FORMS = (window.POKEMON_MEGA_FORMS || []).map((form) => ({
  ...form,
  isMega: true,
  name: `${pokemonName(form.dex)} ${form.form}`,
}));
const MEGA_FORM_BY_KEY = new Map(MEGA_FORMS.map((form) => [form.key, form]));
const MEGA_FORMS_BY_DEX = MEGA_FORMS.reduce((map, form) => {
  const forms = map.get(form.dex) || [];
  forms.push(form);
  map.set(form.dex, forms);
  return map;
}, new Map());

const ASH_TEAMS = [
  team("ash", "小智 - 关都 / 橘子群岛", "早期代表队伍与收服成员", [25, 1, 6, 7, 12, 18, 57, 89, 99, 128, 131, 143]),
  team("ash", "小智 - 城都", "城都联盟时期", [25, 153, 155, 158, 164, 214, 231]),
  team("ash", "小智 - 丰缘 / 对战开拓区", "AG 与开拓区时期", [25, 277, 254, 341, 324, 362, 190, 232]),
  team("ash", "小智 - 神奥", "DP 时期", [25, 398, 389, 392, 418, 472, 443]),
  team("ash", "小智 - 合众", "BW 时期", [25, 521, 501, 499, 495, 559, 542, 536, 525, 553]),
  team("ash", "小智 - 卡洛斯", "XY 时期", [25, 658, 663, 701, 706, 715]),
  team("ash", "小智 - 阿罗拉", "SM 时期", [25, 722, 745, 727, 809, 804]),
  team("ash", "小智 - 旅途 / 八大师决赛", "宝可梦旅途主力队", [25, 149, 94, 448, 865, 882]),
];

const MASTERS_TEAMS = [
  team("masters", "丹帝", "八大师阵容", [6, 812, 815, 818, 866, 887]),
  team("masters", "小智", "八大师阵容", [25, 149, 94, 448, 865, 882]),
  team("masters", "竹兰", "八大师阵容", [445, 423, 350, 407, 442, 468]),
  team("masters", "卡露妮", "八大师阵容", [282, 701, 697, 699, 711, 706]),
  team("masters", "大吾", "八大师阵容 + 补全位", [376, 306, 346, 227, 344, 348]),
  team("masters", "渡", "八大师阵容 + 补全位", [149, 130, 635, 6, 142, 230]),
  team("masters", "艾岚", "八大师阵容 + 补全位", [6, 652, 687, 376, 248, 461]),
  team("masters", "艾莉丝", "八大师阵容 + 补全位", [612, 149, 530, 587, 443, 635]),
];

const TEAMS = [...ASH_TEAMS, ...MASTERS_TEAMS];

const INITIAL_INVENTORY = [
  {
    id: "fig-alain-charizard-20260701",
    dex: 6,
    name: "喷火龙",
    studio: "豪车",
    status: "已购",
    color: "原色",
    price: 750,
    form: "Mega X形态",
    variant: "mega",
    megaKey: "charizard-mega-x",
    note: "艾岚",
    date: "2026-07-01",
  },
];

const state = loadState();
let currentSlide = 0;
let currentPhase = "gen1";
let pickerTargetRow = null;

const els = {
  nav: document.querySelector("#slideNav"),
  slides: Array.from(document.querySelectorAll(".slide")),
  prev: document.querySelector("#prevSlide"),
  next: document.querySelector("#nextSlide"),
  counter: document.querySelector("#slideCounter"),
  completionRing: document.querySelector("#completionRing"),
  completionRate: document.querySelector("#completionRate"),
  ownedSpecies: document.querySelector("#ownedSpecies"),
  pendingSpecies: document.querySelector("#pendingSpecies"),
  totalPieces: document.querySelector("#totalPieces"),
  totalCost: document.querySelector("#totalCost"),
  phaseStats: document.querySelector("#phaseStats"),
  phaseTabs: document.querySelector("#phaseTabs"),
  dexAddButton: document.querySelector("#dexAddButton"),
  dexSearch: document.querySelector("#dexSearch"),
  dexStatusFilter: document.querySelector("#dexStatusFilter"),
  dexGrid: document.querySelector("#dexGrid"),
  teamBoard: document.querySelector("#teamBoard"),
  teamGroupFilter: document.querySelector("#teamGroupFilter"),
  aiTextInput: document.querySelector("#aiTextInput"),
  aiParseStatus: document.querySelector("#aiParseStatus"),
  localParseButton: document.querySelector("#localParseButton"),
  batchRows: document.querySelector("#batchRows"),
  addEntryRow: document.querySelector("#addEntryRow"),
  saveBatch: document.querySelector("#saveBatch"),
  inventorySummary: document.querySelector("#inventorySummary"),
  inventorySearch: document.querySelector("#inventorySearch"),
  studioFilter: document.querySelector("#studioFilter"),
  colorFilter: document.querySelector("#colorFilter"),
  generationFilter: document.querySelector("#generationFilter"),
  minPrice: document.querySelector("#minPrice"),
  maxPrice: document.querySelector("#maxPrice"),
  inventoryList: document.querySelector("#inventoryList"),
  extraGrid: document.querySelector("#extraGrid"),
  pickerModal: document.querySelector("#pokemonPickerModal"),
  pickerClose: document.querySelector("#pokemonPickerClose"),
  pickerSearch: document.querySelector("#pokemonPickerSearch"),
  pickerGeneration: document.querySelector("#pokemonPickerGeneration"),
  pickerGrid: document.querySelector("#pokemonPickerGrid"),
  exportDexImageButton: document.querySelector("#exportDexImageButton"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  clearButton: document.querySelector("#clearButton"),
  toastRegion: document.querySelector("#toastRegion"),
};

init();

function init() {
  renderNav();
  renderPhaseTabs();
  renderPickerGenerationOptions();
  bindEvents();
  addBatchRow();
  addBatchRow();
  addBatchRow();
  renderAll();
  showSlide(0);
}

function team(group, title, subtitle, dexes) {
  return { group, title, subtitle, dexes };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { inventory: structuredClone(INITIAL_INVENTORY) };
    const parsed = JSON.parse(raw);
    return { inventory: Array.isArray(parsed.inventory) ? parsed.inventory.map(normalizeRecord) : [] };
  } catch {
    return { inventory: structuredClone(INITIAL_INVENTORY) };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ inventory: state.inventory }));
}

function normalizeRecord(record) {
  const dex = Number(record.dex);
  const megaKey = record.variant === "evolution" ? "" : normalizeMegaKey(record, dex);
  return {
    id: record.id || `fig-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dex: Number.isFinite(dex) ? dex : 0,
    name: record.name || pokemonName(dex),
    studio: record.studio || "",
    status: record.status || "已购",
    color: normalizeFigureColor(record.color),
    price: numberOrBlank(record.price),
    form: record.form || "",
    variant: megaKey ? "mega" : record.variant || "single",
    megaKey,
    bundleId: record.bundleId || "",
    note: record.note || "",
    date: record.date || today(),
  };
}

function numberOrBlank(value) {
  if (value === "" || value == null) return "";
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : "";
}

function normalizeFigureColor(value) {
  return FIGURE_COLORS.includes(value) ? value : "原色";
}

function normalizeMegaKey(record, dex) {
  if (record.megaKey && MEGA_FORM_BY_KEY.has(record.megaKey)) return record.megaKey;
  const forms = MEGA_FORMS_BY_DEX.get(Number(dex)) || [];
  if (!forms.length) return "";
  const formText = [record.form, record.note, record.name].join(" ").toLowerCase();
  if (!formText.includes("mega") && !formText.includes("超级")) return "";
  if (formText.includes("x")) {
    const xForm = forms.find((form) => form.key.endsWith("-mega-x"));
    if (xForm) return xForm.key;
  }
  if (formText.includes("y")) {
    const yForm = forms.find((form) => form.key.endsWith("-mega-y"));
    if (yForm) return yForm.key;
  }
  if (formText.includes("z")) {
    const zForm = forms.find((form) => form.key.endsWith("-mega-z"));
    if (zForm) return zForm.key;
  }
  return forms.length === 1 ? forms[0].key : "";
}

function bindEvents() {
  els.nav.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-slide-index]");
    if (button) showSlide(Number(button.dataset.slideIndex));
  });
  els.prev.addEventListener("click", () => showSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length));
  els.next.addEventListener("click", () => showSlide((currentSlide + 1) % SLIDES.length));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && els.pickerModal && !els.pickerModal.hidden) {
      closePokemonPicker();
      return;
    }
    if (event.target.matches("input, select, textarea")) return;
    if (event.key === "ArrowLeft") showSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length);
    if (event.key === "ArrowRight") showSlide((currentSlide + 1) % SLIDES.length);
  });

  els.phaseTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-phase]");
    if (!button) return;
    currentPhase = button.dataset.phase;
    renderPhaseTabs();
    renderDexGrid();
  });
  els.dexSearch.addEventListener("input", renderDexGrid);
  els.dexStatusFilter.addEventListener("change", renderDexGrid);
  els.dexAddButton.addEventListener("click", () => showSlide(SLIDES.findIndex(([id]) => id === "add")));
  els.teamGroupFilter.addEventListener("change", renderTeams);
  els.localParseButton.addEventListener("click", parseLocalTextIntoBatchRows);
  els.addEntryRow.addEventListener("click", () => addBatchRow());
  els.saveBatch.addEventListener("click", saveBatchRows);
  els.batchRows.addEventListener("input", syncBatchRowName);
  els.batchRows.addEventListener("click", handleBatchRowClick);
  if (els.pickerModal) {
    els.pickerClose.addEventListener("click", closePokemonPicker);
    els.pickerModal.addEventListener("click", closePokemonPickerFromBackdrop);
    els.pickerSearch.addEventListener("input", renderPokemonPickerGrid);
    els.pickerGeneration.addEventListener("change", renderPokemonPickerGrid);
    els.pickerGrid.addEventListener("click", choosePokemonFromPicker);
  }
  [els.inventorySearch, els.studioFilter, els.colorFilter, els.generationFilter, els.minPrice, els.maxPrice].forEach((input) => {
    input.addEventListener("input", renderInventory);
    input.addEventListener("change", renderInventory);
  });
  els.inventoryList.addEventListener("change", updateInventoryRecord);
  els.inventoryList.addEventListener("click", handleInventoryClick);
  els.dexGrid.addEventListener("click", jumpToInventoryFromDexCard);
  els.extraGrid.addEventListener("click", jumpToInventoryFromDexCard);
  els.teamBoard.addEventListener("click", prefillFromDexCard);
  els.exportDexImageButton.addEventListener("click", exportDexImage);
  els.exportButton.addEventListener("click", exportData);
  els.importInput.addEventListener("change", importData);
  els.clearButton.addEventListener("click", clearData);
}

function renderNav() {
  els.nav.innerHTML = SLIDES.map(([id, label], index) => `
    <button type="button" data-slide-index="${index}">
      <span>${label}</span><small>${String(index + 1).padStart(2, "0")}</small>
    </button>
  `).join("");
}

function renderPhaseTabs() {
  els.phaseTabs.innerHTML = PHASES.map((phase) => `
    <button type="button" data-phase="${phase.id}" class="${phase.id === currentPhase ? "active" : ""}">
      ${phase.label}
    </button>
  `).join("");
}

function showSlide(index) {
  currentSlide = index;
  els.slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === index));
  Array.from(els.nav.querySelectorAll("button")).forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === index));
  els.counter.textContent = `${index + 1} / ${SLIDES.length}`;
}

function renderAll() {
  renderDashboard();
  renderDexGrid();
  renderTeams();
  renderStudioOptions();
  renderInventory();
  renderExtraGrid();
}

function renderDashboard() {
  const mainDex = POKEDEX;
  const owned = mainDex.filter((entry) => ["luxury", "other"].includes(statusForDex(entry.dex).kind)).length;
  const pending = mainDex.filter((entry) => statusForDex(entry.dex).kind === "pending").length;
  const rate = owned / mainDex.length;
  const totalPieces = state.inventory.filter((record) => record.status !== "已售").length;
  const totalCost = sumInventoryCost(state.inventory);

  els.ownedSpecies.textContent = owned;
  els.pendingSpecies.textContent = pending;
  els.totalPieces.textContent = totalPieces;
  els.totalCost.textContent = currency(totalCost);
  els.completionRate.textContent = percentLabel(rate);
  els.completionRing.style.setProperty("--progress", `${rate * 360}deg`);

  els.phaseStats.innerHTML = BASE_PHASES.map((phase) => {
    const entries = POKEDEX.filter((entry) => entry.dex >= phase.start && entry.dex <= phase.end);
    const phaseOwned = entries.filter((entry) => ["luxury", "other"].includes(statusForDex(entry.dex).kind)).length;
    const phaseRate = entries.length ? phaseOwned / entries.length : 0;
    return `<div class="phase-row">
      <strong>${phase.label}</strong>
      <div class="phase-bar"><span style="width:${phaseRate * 100}%"></span></div>
      <span>${phaseOwned}/${entries.length}</span>
    </div>`;
  }).join("");
}

function renderDexGrid() {
  const phase = PHASES.find((item) => item.id === currentPhase) || PHASES[0];
  const keyword = els.dexSearch.value.trim().toLowerCase();
  const statusFilter = els.dexStatusFilter.value;
  const sourceEntries = phase.isMega
    ? MEGA_FORMS
    : POKEDEX.filter((entry) => entry.dex >= phase.start && entry.dex <= phase.end);
  const entries = sourceEntries
    .filter((entry) => matchesDexSearch(entry, keyword))
    .filter((entry) => statusFilter === "all" || statusForEntry(entry).kind === statusFilter);

  els.dexGrid.innerHTML = entries.map(renderDexCard).join("");
}

function renderExtraGrid() {
  const extraDexes = Array.from(new Set(state.inventory.filter((record) => record.dex > 493).map((record) => record.dex))).sort((a, b) => a - b);
  if (!extraDexes.length) {
    els.extraGrid.innerHTML = `<div class="empty-state">还没有 493 以后的手办。批量新增时输入大于 493 的编号后，这里会自动出现。</div>`;
    return;
  }
  els.extraGrid.innerHTML = extraDexes.map((dex) => renderDexCard({ dex, name: pokemonName(dex) })).join("");
}

function renderDexCard(entry) {
  const status = statusForEntry(entry);
  const records = activeRecordsForEntry(entry);
  const studios = studioNamesForRecords(records).slice(0, 3);
  const dataAttrs = entry.isMega ? `data-dex="${entry.dex}" data-mega-key="${entry.key}"` : `data-dex="${entry.dex}"`;
  return `<button class="dex-card ${status.className}" type="button" ${dataAttrs}>
    <span class="piece-badge">${records.length}</span>
    <img src="${entryIconSrc(entry)}" data-remote-src="${entryRemoteIconSrc(entry)}" onerror="handleImgError(this)" alt="${entryDisplayName(entry)}">
    <span class="dex-number">${entryDisplayNumber(entry)}</span>
    <span class="dex-name">${entryDisplayName(entry)}</span>
    <span class="dex-meta">${status.label}</span>
    <span class="studio-strip">${studios.map((studio) => `<span class="studio-chip">${escapeHtml(studio)}</span>`).join("")}</span>
  </button>`;
}

function matchesDexSearch(entry, keyword) {
  if (!keyword) return true;
  const records = recordsForEntry(entry);
  const haystack = [
    String(entry.dex),
    padDex(entry.dex),
    pokemonName(entry.dex),
    entry.isMega ? entry.form : "",
    entry.isMega ? entry.key : "",
    entryDisplayName(entry),
    ...records.flatMap((record) => [record.studio, record.form, record.note, record.status]),
  ].join(" ").toLowerCase();
  return haystack.includes(keyword);
}

function renderTeams() {
  const group = els.teamGroupFilter.value;
  const teams = TEAMS.filter((item) => group === "all" || item.group === group);
  els.teamBoard.innerHTML = teams.map((item) => {
    const owned = item.dexes.filter((dex) => ["luxury", "other"].includes(statusForDex(dex).kind)).length;
    return `<section class="team-section">
      <header>
        <h2>${item.title}</h2>
        <small>${item.subtitle} · ${owned}/${item.dexes.length}</small>
      </header>
      <div class="team-grid">
        ${item.dexes.map((dex) => {
          const status = statusForDex(dex);
          return `<button class="team-slot ${status.className}" type="button" data-dex="${dex}">
            <img src="${iconSrc(dex)}" data-remote-src="${remoteIconSrc(dex)}" onerror="handleImgError(this)" alt="${pokemonName(dex)}">
            <span class="dex-number">No.${padDex(dex)}</span>
            <span class="dex-name">${pokemonName(dex)}</span>
            <span class="dex-meta">${status.label}</span>
          </button>`;
        }).join("")}
      </div>
    </section>`;
  }).join("");
}

function addBatchRow(values = {}) {
  const row = document.createElement("div");
  row.className = "batch-row";
  row.innerHTML = `
    <button class="pokemon-select-button" type="button">选择</button>
    <select class="batch-kind">
      <option value="single" ${(values.kind || "single") === "single" ? "selected" : ""}>单只本体</option>
      <option value="evolution" ${values.kind === "evolution" ? "selected" : ""}>进化组</option>
      <option value="mega" ${values.kind === "mega" ? "selected" : ""}>Mega系列</option>
    </select>
    <input class="batch-dex" type="number" min="1" max="2000" placeholder="001" value="${values.dex || ""}">
    <input class="batch-name" type="text" placeholder="自动 / 自填" value="${escapeHtml(values.name || "")}">
    <input class="batch-studio" type="text" placeholder="工作室" value="${escapeHtml(values.studio || "")}">
    <select class="batch-status">
      ${["已购", "预订", "已到货", "已售", "观望"].map((status) => `<option value="${status}" ${status === (values.status || "已购") ? "selected" : ""}>${status}</option>`).join("")}
    </select>
    <select class="batch-color">
      ${FIGURE_COLORS.map((color) => `<option value="${color}" ${color === normalizeFigureColor(values.color) ? "selected" : ""}>${color}</option>`).join("")}
    </select>
    <input class="batch-price" type="number" min="0" step="0.01" placeholder="价格" value="${escapeHtml(values.price || "")}">
    <input class="batch-form" type="text" placeholder="形态、角色、渠道、备注" value="${escapeHtml(values.form || values.note || "")}">
    <button class="secondary-button remove-row" type="button">移除</button>
  `;
  if (values.megaKey) row.dataset.megaKey = values.megaKey;
  els.batchRows.append(row);
}

function syncBatchRowName(event) {
  if (!event.target.classList.contains("batch-dex")) return;
  const row = event.target.closest(".batch-row");
  const dex = Number(event.target.value);
  delete row.dataset.megaKey;
  const nameInput = row.querySelector(".batch-name");
  if (!nameInput.value.trim() && Number.isFinite(dex) && dex > 0) {
    nameInput.value = pokemonName(dex);
  }
}

function removeBatchRow(event) {
  const button = event.target.closest(".remove-row");
  if (!button) return;
  const row = button.closest(".batch-row");
  if (els.batchRows.children.length > 1) row.remove();
}

function handleBatchRowClick(event) {
  if (event.target.closest(".pokemon-select-button")) {
    openPokemonPicker(event.target.closest(".batch-row"));
    return;
  }
  removeBatchRow(event);
}

function renderPickerGenerationOptions() {
  if (!els.pickerGeneration) return;
  els.pickerGeneration.innerHTML = [
    `<option value="all">全部世代</option>`,
    ...NATIONAL_GENERATIONS.map((generation) => `<option value="${generation.id}">${generation.label}</option>`),
    `<option value="mega">超级进化</option>`,
  ].join("");
}

function openPokemonPicker(row) {
  if (!els.pickerModal) {
    showToast("宝可梦选择器未加载");
    return;
  }
  pickerTargetRow = row;
  els.pickerSearch.value = "";
  els.pickerGeneration.value = row.querySelector(".batch-kind")?.value === "mega" ? "mega" : "all";
  els.pickerModal.hidden = false;
  renderPokemonPickerGrid();
  els.pickerSearch.focus();
}

function closePokemonPicker() {
  els.pickerModal.hidden = true;
  pickerTargetRow = null;
}

function closePokemonPickerFromBackdrop(event) {
  if (event.target.matches("[data-picker-close]")) closePokemonPicker();
}

function renderPokemonPickerGrid() {
  const keyword = els.pickerSearch.value.trim().toLowerCase();
  const generation = els.pickerGeneration.value;
  const sourceEntries = generation === "mega" ? MEGA_FORMS : ALL_POKEMON;
  const entries = sourceEntries
    .filter((entry) => generation === "all" || generation === "mega" || nationalGenerationOf(entry.dex).id === generation)
    .filter((entry) => matchesPokemonPickerSearch(entry, keyword));

  if (!entries.length) {
    els.pickerGrid.innerHTML = `<div class="empty-state">没有符合筛选条件的宝可梦。</div>`;
    return;
  }

  els.pickerGrid.innerHTML = entries.map((entry) => {
    const generationInfo = entry.isMega ? { shortLabel: "超级进化" } : nationalGenerationOf(entry.dex);
    const dataAttrs = entry.isMega ? `data-picker-dex="${entry.dex}" data-picker-mega-key="${entry.key}"` : `data-picker-dex="${entry.dex}"`;
    return `<button class="pokemon-picker-card ${entry.isMega ? "mega-card" : ""}" type="button" ${dataAttrs}>
      <img src="${entryIconSrc(entry)}" data-remote-src="${entryRemoteIconSrc(entry)}" loading="lazy" onerror="handleImgError(this)" alt="${entryDisplayName(entry)}">
      <span class="dex-number">${entryDisplayNumber(entry)}</span>
      <span class="dex-name">${entryDisplayName(entry)}</span>
      <span class="picker-generation">${generationInfo.shortLabel}</span>
    </button>`;
  }).join("");
}

function matchesPokemonPickerSearch(entry, keyword) {
  if (!keyword) return true;
  const padded = padDex(entry.dex);
  const haystack = [
    String(entry.dex),
    padded,
    pokemonName(entry.dex),
    entry.isMega ? entry.form : "",
    entry.isMega ? entry.key : "",
    entryDisplayName(entry),
  ].join(" ").toLowerCase();
  return haystack.includes(keyword);
}

function choosePokemonFromPicker(event) {
  const card = event.target.closest("[data-picker-dex]");
  if (!card || !pickerTargetRow) return;
  const dex = Number(card.dataset.pickerDex);
  const megaKey = card.dataset.pickerMegaKey || "";
  pickerTargetRow.querySelector(".batch-dex").value = dex;
  pickerTargetRow.querySelector(".batch-name").value = pokemonName(dex);
  if (megaKey) {
    const mega = MEGA_FORM_BY_KEY.get(megaKey);
    pickerTargetRow.dataset.megaKey = megaKey;
    pickerTargetRow.querySelector(".batch-kind").value = "mega";
    pickerTargetRow.querySelector(".batch-form").value = mega?.form || "Mega形态";
  } else {
    delete pickerTargetRow.dataset.megaKey;
  }
  closePokemonPicker();
}

function parseLocalTextIntoBatchRows() {
  const text = els.aiTextInput.value.trim();
  if (!text) {
    showToast("请先粘贴需要解析的库存文字");
    els.aiParseStatus.textContent = "待解析";
    return;
  }
  const snippets = splitInventoryText(text);
  const parsedGroups = snippets.map(parseInventorySnippetRows);
  const parsedRows = parsedGroups.flat();
  const skipped = parsedGroups.filter((rows) => !rows.length).length;
  if (!parsedRows.length) {
    els.aiParseStatus.textContent = "未识别";
    showToast("没有识别到可新增的库存");
    return;
  }
  els.batchRows.innerHTML = "";
  parsedRows.forEach((row) => addBatchRow(row));
  els.aiParseStatus.textContent = skipped ? `已解析 ${parsedRows.length} 行，跳过 ${skipped} 段` : `已解析 ${parsedRows.length} 行`;
  showToast(`已生成 ${parsedRows.length} 条批量新增行`);
}

function splitInventoryText(text) {
  return toHalfWidth(text)
    .replace(/\r/g, "\n")
    .split(/\n+|[；;]/)
    .map((item) => item.replace(/^\s*\d+[.、)]\s*/, "").trim())
    .filter(Boolean);
}

function parseInventorySnippetRows(rawSnippet) {
  const snippet = normalizeParseSnippet(rawSnippet);
  const pokemon = findPokemonInSnippet(snippet);
  if (!pokemon) return [];
  if (pokemon.expandsTo?.length) {
    return pokemon.expandsTo
      .map((expanded) => parseInventorySnippetWithPokemon(snippet, {
        ...expanded,
        index: pokemon.index,
        alias: pokemon.alias,
      }))
      .filter(Boolean);
  }
  const parsed = parseInventorySnippetWithPokemon(snippet, pokemon);
  return parsed ? [parsed] : [];
}

function parseInventorySnippet(rawSnippet) {
  return parseInventorySnippetRows(rawSnippet)[0] || null;
}

function parseInventorySnippetWithPokemon(snippet, pokemon) {
  const studio = extractStudio(snippet, pokemon);
  if (!studio) return null;
  const kind = pokemon.kind || extractBatchKind(snippet);
  const megaKey = kind === "mega" ? pokemon.megaKey || extractMegaKey(snippet, pokemon.dex) : "";
  const context = {
    kind,
    megaKey,
    pokemon,
    price: extractPrice(snippet, pokemon.dex),
    status: extractStatus(snippet),
    color: extractFigureColor(snippet),
    studio,
  };
  return {
    kind,
    dex: pokemon.dex,
    name: pokemonName(pokemon.dex),
    studio,
    status: context.status,
    color: context.color,
    price: context.price,
    form: extractParsedForm(snippet, context),
    megaKey,
  };
}

function normalizeParseSnippet(value) {
  return toHalfWidth(value)
    .replace(/[，。]/g, " ")
    .replace(/[、]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toHalfWidth(value) {
  return String(value || "")
    .replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/　/g, " ");
}

function findPokemonInSnippet(snippet) {
  const dexMatch = snippet.match(/(?:no\.?|编号|#)\s*0*(\d{1,4})/i);
  if (dexMatch) {
    const dex = Number(dexMatch[1]);
    if (Number.isFinite(dex) && dex > 0) return { dex, name: pokemonName(dex), index: dexMatch.index || 0 };
  }
  for (const alias of POKEMON_PARSE_ALIASES) {
    const index = snippet.indexOf(alias.term);
    if (index !== -1) return { ...alias, index, alias: alias.term };
  }
  for (const entry of POKEMON_NAME_INDEX) {
    const index = snippet.indexOf(entry.name);
    if (index !== -1) return { ...entry, index };
  }
  return null;
}

function extractStudio(snippet, pokemon) {
  const explicit = snippet.match(/工作室(?:为|是|:|：)?\s*([A-Za-z0-9\u4e00-\u9fa5_-]{1,18})/);
  if (explicit) return cleanStudioName(explicit[1]);
  const suffix = snippet.match(/([A-Za-z0-9\u4e00-\u9fa5_-]{1,18})工作室/);
  if (suffix) return cleanStudioName(suffix[1]);

  const known = knownStudioNames().find((studio) => snippet.includes(studio));
  if (known) return known;

  const beforePokemon = snippet.slice(0, Math.max(0, pokemon.index));
  const tokens = beforePokemon
    .replace(/我|已?买了?|购买|入手|购入|预订|预定|一个|一只|一款|一套|的/g, " ")
    .split(/[\s,，、]+/)
    .map(cleanStudioName)
    .filter((token) => token && !isParseStopToken(token));
  return tokens[0] || "";
}

function knownStudioNames() {
  const studios = new Set(["豪车"]);
  state.inventory.forEach((record) => {
    if (record.studio?.trim()) studios.add(record.studio.trim());
  });
  return Array.from(studios).sort((a, b) => b.length - a.length);
}

function cleanStudioName(value) {
  return String(value || "")
    .replace(/工作室/g, "")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .trim();
}

function isParseStopToken(token) {
  return ["艾岚", "小智", "丹帝", "竹兰", "卡露妮", "大吾", "渡", "艾莉丝", "八大师", "冠军", "宝可梦", "手办"].includes(token);
}

function extractBatchKind(snippet) {
  if (/进化组|进化链|全家桶|整组|一套/.test(snippet)) return "evolution";
  if (/mega|超级进化/i.test(snippet)) return "mega";
  return "single";
}

function extractMegaKey(snippet, dex) {
  const forms = MEGA_FORMS_BY_DEX.get(Number(dex)) || [];
  if (!forms.length) return "";
  const compact = snippet.toLowerCase().replace(/\s+/g, "");
  const suffix = /(megax|mega-x|x形态|x版|x喷|喷x|喷火龙x)/.test(compact)
    ? "x"
    : /(megay|mega-y|y形态|y版|y喷|喷y|喷火龙y)/.test(compact)
      ? "y"
      : /(megaz|mega-z|z形态|z版)/.test(compact)
        ? "z"
        : "";
  if (suffix) {
    const matched = forms.find((form) => form.key.endsWith(`-mega-${suffix}`));
    if (matched) return matched.key;
  }
  return forms.length === 1 ? forms[0].key : "";
}

function extractStatus(snippet) {
  if (/预订|预定|定金/.test(snippet)) return "预订";
  if (/已到货|到货|补款/.test(snippet)) return "已到货";
  if (/已售|卖出|出售/.test(snippet)) return "已售";
  if (/观望/.test(snippet)) return "观望";
  if (/现货/.test(snippet)) return "已购";
  return "已购";
}

function extractFigureColor(snippet) {
  if (/特殊色|特别色|限定色|限量色/.test(snippet)) return "特殊色";
  if (/异色|闪光|闪色|shiny/i.test(snippet)) return "异色";
  return "原色";
}

function extractPrice(snippet, dex) {
  const keyword = snippet.match(/(?:购入价|买入价|入手价|价格|价钱|补款|尾款|定金|price|¥|￥)\s*(?:为|是|:|：)?\s*(\d+(?:\.\d+)?)/i);
  if (keyword) return keyword[1];
  const currency = Array.from(snippet.matchAll(/(?:¥|￥)?\s*(\d+(?:\.\d+)?)\s*(?:元|块|rmb|RMB)/g));
  if (currency.length) return currency[currency.length - 1][1];
  const numbers = Array.from(snippet.matchAll(/\d+(?:\.\d+)?/g)).map((match) => match[0]);
  const priceLike = numbers.filter((value) => Number(value) > 20 && Number(value) !== Number(dex));
  return priceLike.length ? priceLike[priceLike.length - 1] : "";
}

function extractParsedForm(snippet, context) {
  const note = extractLooseNote(snippet, context);
  if (context.kind === "mega") {
    const mega = MEGA_FORM_BY_KEY.get(context.megaKey);
    const megaForm = mega?.form || (/mega/i.test(snippet) ? "Mega形态" : "");
    return [megaForm, note].filter(Boolean).join(" / ");
  }
  if (context.kind === "evolution") {
    return ["进化组", note].filter(Boolean).join(" / ");
  }
  return note;
}

function extractLooseNote(snippet, context) {
  let note = snippet;
  const removePatterns = [
    /工作室(?:为|是|:|：)?\s*[A-Za-z0-9\u4e00-\u9fa5_-]{1,18}/g,
    /[A-Za-z0-9\u4e00-\u9fa5_-]{1,18}工作室/g,
    /(?:购入价|买入价|入手价|价格|价钱|补款|尾款|定金|price|¥|￥)\s*(?:为|是|:|：)?\s*\d+(?:\.\d+)?/gi,
    /\d+(?:\.\d+)?\s*(?:元|块|rmb|RMB)/g,
    /(?:no\.?|编号|#)\s*0*\d{1,4}/gi,
    /已购|购买|买了|入手|购入|预订|预定|现货|已到货|到货|已售|卖出|出售|观望/g,
    /原色|异色|闪光|闪色|特殊色|特别色|限定色|限量色|shiny/gi,
    /进化组|进化链|全家桶|整组|一套/g,
    /mega\s*系列|Mega\s*系列|超级进化系列|系列/g,
    /形态(?:为|是|:|：)?/g,
    /我|一个|一只|一款|的/g,
  ];
  removePatterns.forEach((pattern) => {
    note = note.replace(pattern, " ");
  });
  [context.pokemon.name, context.pokemon.alias, context.studio, context.price].filter(Boolean).forEach((value) => {
    note = note.replace(new RegExp(escapeRegExp(String(value)), "g"), " ");
  });
  note = note.replace(/mega\s*[- ]?[xyz]?/gi, " ");
  return note.replace(/\s+/g, " ").trim().slice(0, 64);
}

function saveBatchRows() {
  const rows = Array.from(els.batchRows.querySelectorAll(".batch-row"));
  const records = rows.flatMap(readBatchRow);
  if (!records.length) {
    showToast("没有可保存的行");
    return;
  }
  state.inventory.unshift(...records);
  saveState();
  els.batchRows.innerHTML = "";
  addBatchRow();
  addBatchRow();
  renderAll();
  showToast(`已新增 ${records.length} 件手办`);
}

function readBatchRow(row) {
  const dex = Number(row.querySelector(".batch-dex").value);
  const studio = row.querySelector(".batch-studio").value.trim();
  if (!Number.isFinite(dex) || dex <= 0 || !studio) return [];
  const kind = row.querySelector(".batch-kind").value;
  const form = row.querySelector(".batch-form").value.trim();
  const shared = {
    studio,
    status: row.querySelector(".batch-status").value,
    color: row.querySelector(".batch-color").value,
    price: row.querySelector(".batch-price").value,
    form,
    note: form,
    date: today(),
  };

  if (kind === "evolution") {
    const chain = evolutionChainForDex(dex);
    const bundleId = chain.length > 1 ? newBundleId("evolution") : "";
    return chain.map((chainDex) => buildInventoryRecord({
      ...shared,
      dex: chainDex,
      name: pokemonName(chainDex),
      form: form || "进化组",
      note: form || `${pokemonName(dex)}所属进化链`,
      variant: "evolution",
      bundleId,
    }));
  }

  if (kind === "mega") {
    const selectedMega = row.dataset.megaKey ? MEGA_FORM_BY_KEY.get(row.dataset.megaKey) : null;
    const megaForms = selectedMega ? [selectedMega] : (MEGA_FORMS_BY_DEX.get(dex) || []);
    if (!megaForms.length) {
      showToast(`${pokemonName(dex)} 暂无 Mega 形态`);
      return [];
    }
    const bundleId = megaForms.length > 1 ? newBundleId("mega") : "";
    return megaForms.map((mega) => buildInventoryRecord({
      ...shared,
      dex: mega.dex,
      name: pokemonName(mega.dex),
      form: mega.form,
      note: form || mega.form,
      variant: "mega",
      megaKey: mega.key,
      bundleId,
    }));
  }

  const name = row.querySelector(".batch-name").value.trim() || pokemonName(dex);
  return [buildInventoryRecord({
    ...shared,
    dex,
    name,
    variant: "single",
  })];
}

function buildInventoryRecord(values) {
  return normalizeRecord({
    id: `fig-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ...values,
  });
}

function renderStudioOptions() {
  const supported = new Set(["all", "luxury", "other"]);
  if (!supported.has(els.studioFilter.value)) els.studioFilter.value = "all";
}

function renderInventory() {
  const keyword = els.inventorySearch.value.trim().toLowerCase();
  const studio = els.studioFilter.value;
  const color = els.colorFilter.value;
  const generation = els.generationFilter.value;
  const min = Number(els.minPrice.value);
  const max = Number(els.maxPrice.value);
  const filtered = state.inventory.filter((record) => {
    const haystack = [record.dex, padDex(record.dex), record.name, record.studio, record.color, record.form, record.note, record.status, record.megaKey].join(" ").toLowerCase();
    const price = Number(record.price) || 0;
    return (!keyword || haystack.includes(keyword))
      && (studio === "all" || studioCategory(record.studio) === studio)
      && (color === "all" || record.color === color)
      && (generation === "all" || generationOf(record.dex).id === generation)
      && (!Number.isFinite(min) || !els.minPrice.value || price >= min)
      && (!Number.isFinite(max) || !els.maxPrice.value || price <= max);
  });

  els.inventorySummary.innerHTML = `
    <span class="chip">${filtered.length} 件</span>
    <span class="chip">${currency(sumInventoryCost(filtered))}</span>
  `;

  if (!filtered.length) {
    els.inventoryList.innerHTML = `<div class="empty-state">没有符合筛选条件的库存。</div>`;
    return;
  }
  els.inventoryList.innerHTML = filtered.map((record) => renderInventoryRow(record)).join("");
}

function renderInventoryRow(record) {
  return `<div class="inventory-row" data-record-id="${record.id}">
    <img src="${recordIconSrc(record)}" data-remote-src="${recordRemoteIconSrc(record)}" onerror="handleImgError(this)" alt="${recordDisplayName(record)}">
    <div class="inventory-title">
      <strong>No.${padDex(record.dex)} ${recordDisplayName(record)}</strong>
      <span>${record.studio || "未填工作室"} · ${record.color || "原色"} · ${record.form || "常规"} · ${generationOf(record.dex).label}</span>
    </div>
    <select data-field="status">
      ${["已购", "预订", "已到货", "已售", "观望"].map((status) => `<option value="${status}" ${status === record.status ? "selected" : ""}>${status}</option>`).join("")}
    </select>
    <select data-field="color">
      ${FIGURE_COLORS.map((color) => `<option value="${color}" ${color === normalizeFigureColor(record.color) ? "selected" : ""}>${color}</option>`).join("")}
    </select>
    <input data-field="studio" type="text" value="${escapeHtml(record.studio)}">
    <input data-field="price" type="number" min="0" step="0.01" value="${record.price}">
    <strong class="price">${currency(record.price)}</strong>
    <div class="row-actions">
      ${record.status === "预订" ? `<button class="arrive-button" type="button" data-action="arrive">到货</button>` : ""}
      <button class="danger-button" type="button" data-action="delete">删除</button>
    </div>
  </div>`;
}

function updateInventoryRecord(event) {
  const control = event.target.closest("[data-field]");
  if (!control) return;
  const row = control.closest(".inventory-row");
  const record = state.inventory.find((item) => item.id === row.dataset.recordId);
  if (!record) return;
  const field = control.dataset.field;
  record[field] = field === "price" ? numberOrBlank(control.value) : control.value;
  saveState();
  renderAll();
}

function handleInventoryClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const row = button.closest(".inventory-row");
  const record = state.inventory.find((item) => item.id === row.dataset.recordId);
  if (!record) return;
  if (button.dataset.action === "arrive") {
    record.status = "已到货";
    saveState();
    renderAll();
    showToast(`${record.name} 已标记到货`);
  }
  if (button.dataset.action === "delete") {
    if (!confirm(`删除 No.${padDex(record.dex)} ${record.name}？`)) return;
    state.inventory = state.inventory.filter((item) => item.id !== record.id);
    saveState();
    renderAll();
    showToast("记录已删除");
  }
}

function jumpToInventoryFromDexCard(event) {
  const card = event.target.closest("[data-dex]");
  if (!card) return;
  const dex = Number(card.dataset.dex);
  const megaKey = card.dataset.megaKey || "";
  els.inventorySearch.value = megaKey || padDex(dex);
  els.studioFilter.value = "all";
  els.colorFilter.value = "all";
  els.generationFilter.value = "all";
  els.minPrice.value = "";
  els.maxPrice.value = "";
  renderInventory();
  showSlide(SLIDES.findIndex(([id]) => id === "inventory"));
  showToast(megaKey ? "已跳转到对应 Mega 库存" : "已跳转到对应库存");
}

function prefillFromDexCard(event) {
  const card = event.target.closest("[data-dex]");
  if (!card) return;
  const dex = Number(card.dataset.dex);
  const megaKey = card.dataset.megaKey || "";
  const firstEmpty = Array.from(els.batchRows.querySelectorAll(".batch-row")).find((row) => !row.querySelector(".batch-dex").value);
  const row = firstEmpty || (() => {
    addBatchRow();
    return els.batchRows.lastElementChild;
  })();
  row.querySelector(".batch-dex").value = dex;
  row.querySelector(".batch-name").value = pokemonName(dex);
  if (megaKey) {
    const mega = MEGA_FORM_BY_KEY.get(megaKey);
    row.dataset.megaKey = megaKey;
    row.querySelector(".batch-kind").value = "mega";
    row.querySelector(".batch-form").value = mega?.form || "Mega形态";
  } else {
    delete row.dataset.megaKey;
  }
  showSlide(SLIDES.findIndex(([id]) => id === "add"));
}

function statusForEntry(entry) {
  return entry.isMega ? statusForRecords(activeRecordsForEntry(entry)) : statusForDex(entry.dex);
}

function statusForDex(dex) {
  return statusForRecords(activeRecords(dex));
}

function statusForRecords(records) {
  if (records.some((record) => record.status === "预订")) return { kind: "pending", className: "status-pending", label: "预订中" };
  if (records.some((record) => OWNED_STATUSES.has(record.status) && record.studio.trim() === "豪车")) return { kind: "luxury", className: "status-luxury", label: "豪车已拥有" };
  if (records.some((record) => OWNED_STATUSES.has(record.status))) return { kind: "other", className: "status-other", label: "已拥有" };
  return { kind: "missing", className: "status-missing", label: "未拥有" };
}

function studioCategory(studio) {
  return String(studio || "").trim() === "豪车" ? "luxury" : "other";
}

function recordsForDex(dex) {
  return state.inventory.filter((record) => record.dex === dex);
}

function recordsForEntry(entry) {
  if (entry.isMega) return state.inventory.filter((record) => record.megaKey === entry.key);
  return recordsForDex(entry.dex);
}

function activeRecords(dex) {
  return recordsForDex(dex).filter((record) => record.status !== "已售" && record.status !== "观望");
}

function activeRecordsForEntry(entry) {
  return recordsForEntry(entry).filter((record) => record.status !== "已售" && record.status !== "观望");
}

function studioNamesForRecords(records) {
  return Array.from(new Set(records.map((record) => record.studio.trim()).filter(Boolean)));
}

function evolutionChainForDex(dex) {
  const chain = EVOLUTION_CHAINS[String(dex)] || [dex];
  return chain.map(Number).filter((entryDex) => Number.isFinite(entryDex) && entryDex > 0);
}

function newBundleId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function generationOf(dex) {
  if (dex >= 1 && dex <= 151) return { id: "gen1", label: "001-151" };
  if (dex >= 152 && dex <= 251) return { id: "gen2", label: "152-251" };
  if (dex >= 252 && dex <= 386) return { id: "gen3", label: "252-386" };
  if (dex >= 387 && dex <= 493) return { id: "gen4", label: "387-493" };
  return { id: "extra", label: "493 以后" };
}

function nationalGenerationOf(dex) {
  return NATIONAL_GENERATIONS.find((generation) => dex >= generation.start && dex <= generation.end)
    || { id: "extra", label: "未知世代", shortLabel: "扩展" };
}

function pokemonName(dex) {
  return KNOWN_NAMES[dex] || `No.${padDex(dex)}`;
}

function entryDisplayName(entry) {
  if (entry.isMega) return `${pokemonName(entry.dex)} ${entry.form}`;
  return pokemonName(entry.dex);
}

function entryKey(entry) {
  return entry.isMega ? `mega:${entry.key}` : `dex:${entry.dex}`;
}

function entryDisplayNumber(entry) {
  if (entry.isMega) return `No.${padDex(entry.dex)} Mega`;
  return `No.${padDex(entry.dex)}`;
}

function entryIconSrc(entry) {
  if (entry.isMega) return remoteIconSrc(entry.iconId);
  return iconSrc(entry.dex);
}

function entryRemoteIconSrc(entry) {
  if (entry.isMega) return remoteIconSrc(entry.iconId);
  return remoteIconSrc(entry.dex);
}

function recordDisplayName(record) {
  const mega = record.megaKey ? MEGA_FORM_BY_KEY.get(record.megaKey) : null;
  return mega ? `${pokemonName(record.dex)} ${mega.form}` : record.name;
}

function recordIconSrc(record) {
  const mega = record.megaKey ? MEGA_FORM_BY_KEY.get(record.megaKey) : null;
  return mega ? remoteIconSrc(mega.iconId) : iconSrc(record.dex);
}

function recordRemoteIconSrc(record) {
  const mega = record.megaKey ? MEGA_FORM_BY_KEY.get(record.megaKey) : null;
  return mega ? remoteIconSrc(mega.iconId) : remoteIconSrc(record.dex);
}

function iconSrc(dex) {
  return LOCAL_ICON_IDS.has(Number(dex)) ? `${LOCAL_ICON_BASE}${dex}.png` : remoteIconSrc(dex);
}

function remoteIconSrc(dex) {
  return `${REMOTE_ICON_BASE}${dex}.png`;
}

window.handleImgError = function handleImgError(img) {
  const remote = img.dataset.remoteSrc;
  if (remote && img.src !== remote) {
    img.src = remote;
    img.dataset.remoteSrc = "";
    return;
  }
  img.style.visibility = "hidden";
};

function padDex(dex) {
  return String(dex || 0).padStart(3, "0");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currency(value) {
  const numeric = Number(value) || 0;
  return `¥${numeric.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
}

function sumInventoryCost(records) {
  const seen = new Set();
  return records.reduce((sum, record) => {
    const key = record.bundleId || record.id;
    if (seen.has(key)) return sum;
    seen.add(key);
    return sum + (Number(record.price) || 0);
  }, 0);
}

function percentLabel(rate) {
  const percent = rate * 100;
  if (percent > 0 && percent < 1) return `${percent.toFixed(1)}%`;
  return `${Math.round(percent)}%`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  els.toastRegion.append(toast);
  setTimeout(() => toast.remove(), 2400);
}

async function exportDexImage() {
  const button = els.exportDexImageButton;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "生成中...";
  showToast("正在生成图鉴长图");
  try {
    const canvas = await drawDexExportCanvas();
    await downloadCanvas(canvas, `宝可梦手办总图鉴-${today()}.png`);
    showToast("图鉴长图已导出");
  } catch (error) {
    console.error(error);
    showToast("导出失败，请稍后重试");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function drawDexExportCanvas() {
  const exportSections = exportDexSections();
  const columns = 13;
  const gap = 12;
  const cardWidth = 138;
  const cardHeight = 158;
  const padding = 56;
  const headerHeight = 196;
  const sectionTitleHeight = 48;
  const sectionBottomGap = 36;
  const footerHeight = 58;
  const width = padding * 2 + columns * cardWidth + (columns - 1) * gap;
  const sections = exportSections.map((section) => {
    const rows = Math.ceil(section.entries.length / columns);
    return {
      ...section,
      rows,
      height: sectionTitleHeight + rows * cardHeight + Math.max(0, rows - 1) * gap + sectionBottomGap,
    };
  });
  const height = headerHeight + sections.reduce((sum, section) => sum + section.height, 0) + footerHeight;
  const scale = Math.min(1.5, window.devicePixelRatio || 1.5);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = "#f6f7fb";
  ctx.fillRect(0, 0, width, height);

  const allEntries = sections.flatMap((section) => section.entries);
  const images = await loadExportImages(allEntries);
  drawExportHeader(ctx, width, padding, headerHeight);

  let y = headerHeight;
  sections.forEach((section) => {
    drawExportSectionTitle(ctx, section, padding, y, width - padding * 2);
    y += sectionTitleHeight;
    section.entries.forEach((entry, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = padding + col * (cardWidth + gap);
      const cardY = y + row * (cardHeight + gap);
      drawExportCard(ctx, entry, images.get(entryKey(entry)), x, cardY, cardWidth, cardHeight);
    });
    y += section.rows * cardHeight + Math.max(0, section.rows - 1) * gap + sectionBottomGap;
  });

  drawExportFooter(ctx, padding, height - footerHeight + 18, width - padding * 2);
  return canvas;
}

function exportDexSections() {
  const sections = BASE_PHASES.map((phase) => ({
    label: phase.label,
    entries: POKEDEX.filter((entry) => entry.dex >= phase.start && entry.dex <= phase.end),
  }));
  if (MEGA_FORMS.length) {
    sections.push({
      label: "超级进化",
      entries: MEGA_FORMS,
    });
  }
  const extraDexes = Array.from(new Set(state.inventory.filter((record) => record.dex > 493).map((record) => record.dex))).sort((a, b) => a - b);
  if (extraDexes.length) {
    sections.push({
      label: "493 以后",
      entries: extraDexes.map((dex) => ({ dex, name: pokemonName(dex) })),
    });
  }
  return sections;
}

function drawExportHeader(ctx, width, padding, headerHeight) {
  const owned = POKEDEX.filter((entry) => ["luxury", "other"].includes(statusForDex(entry.dex).kind)).length;
  const pending = POKEDEX.filter((entry) => statusForDex(entry.dex).kind === "pending").length;
  const totalPieces = state.inventory.filter((record) => record.status !== "已售").length;
  const totalCost = sumInventoryCost(state.inventory);

  ctx.fillStyle = "#17202e";
  ctx.font = "900 44px Inter, system-ui, sans-serif";
  ctx.fillText("宝可梦手办收藏总图鉴", padding, 72);
  ctx.font = "700 20px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#6b7484";
  ctx.fillText(`001-493 · ${today()} · ${owned}/493 · ${percentLabel(owned / 493)}`, padding, 108);

  const metrics = [
    [`已拥有`, `${owned}`],
    [`预订中`, `${pending}`],
    [`库存件数`, `${totalPieces}`],
    [`入手合计`, currency(totalCost)],
  ];
  metrics.forEach(([label, value], index) => {
    const metricWidth = 156;
    const x = width - padding - (metrics.length - index) * metricWidth - (metrics.length - index - 1) * 12;
    drawRoundRect(ctx, x, 42, metricWidth, 70, 12, "#ffffff", "#d8dee8");
    ctx.fillStyle = "#17202e";
    ctx.font = "900 24px Inter, system-ui, sans-serif";
    ctx.fillText(value, x + 18, 74);
    ctx.fillStyle = "#6b7484";
    ctx.font = "700 14px Inter, system-ui, sans-serif";
    ctx.fillText(label, x + 18, 98);
  });

  const legend = [
    ["luxury", "豪车已拥有"],
    ["other", "其他工作室"],
    ["pending", "预订中"],
    ["missing", "未拥有"],
  ];
  let legendX = padding;
  legend.forEach(([kind, label]) => {
    const style = EXPORT_STATUS_STYLES[kind];
    drawRoundRect(ctx, legendX, 142, 148, 32, 16, "#ffffff", "#d8dee8");
    ctx.fillStyle = style.badge;
    ctx.beginPath();
    ctx.arc(legendX + 20, 158, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#17202e";
    ctx.font = "800 14px Inter, system-ui, sans-serif";
    ctx.fillText(label, legendX + 34, 163);
    legendX += 160;
  });

  ctx.strokeStyle = "#d8dee8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, headerHeight - 8);
  ctx.lineTo(width - padding, headerHeight - 8);
  ctx.stroke();
}

function drawExportSectionTitle(ctx, section, x, y, width) {
  const owned = section.entries.filter((entry) => ["luxury", "other"].includes(statusForEntry(entry).kind)).length;
  ctx.fillStyle = "#17202e";
  ctx.font = "900 28px Inter, system-ui, sans-serif";
  ctx.fillText(section.label, x, y + 32);
  ctx.fillStyle = "#6b7484";
  ctx.font = "800 16px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${owned}/${section.entries.length}`, x + width, y + 32);
  ctx.textAlign = "left";
}

function drawExportCard(ctx, entry, image, x, y, width, height) {
  const status = statusForEntry(entry);
  const records = activeRecordsForEntry(entry);
  const style = EXPORT_STATUS_STYLES[status.kind];
  drawRoundRect(ctx, x, y, width, height, 14, style.fill, style.border);

  ctx.fillStyle = style.text;
  ctx.font = "900 15px Inter, system-ui, sans-serif";
  ctx.fillText(entryDisplayNumber(entry), x + 12, y + 24);

  if (records.length) {
    const badgeText = String(records.length);
    const badgeWidth = Math.max(30, ctx.measureText(badgeText).width + 18);
    drawRoundRect(ctx, x + width - badgeWidth - 10, y + 10, badgeWidth, 24, 12, style.badge, style.badge);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 13px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(badgeText, x + width - badgeWidth / 2 - 10, y + 27);
    ctx.textAlign = "left";
  }

  if (image) {
    const imgSize = 78;
    ctx.drawImage(image, x + (width - imgSize) / 2, y + 36, imgSize, imgSize);
  } else {
    ctx.fillStyle = "rgba(23, 32, 46, 0.12)";
    ctx.beginPath();
    ctx.arc(x + width / 2, y + 76, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#17202e";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  drawCenteredText(ctx, entryDisplayName(entry), x + width / 2, y + 128, width - 18);
  ctx.fillStyle = style.text;
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  drawCenteredText(ctx, status.label, x + width / 2, y + 148, width - 18);
}

function drawExportFooter(ctx, x, y, width) {
  ctx.strokeStyle = "#d8dee8";
  ctx.beginPath();
  ctx.moveTo(x, y - 18);
  ctx.lineTo(x + width, y - 18);
  ctx.stroke();
  ctx.fillStyle = "#6b7484";
  ctx.font = "700 14px Inter, system-ui, sans-serif";
  ctx.fillText("绿色：豪车工作室已拥有 · 黄色：其他工作室已拥有 · 蓝色：预订中 · 红色：未拥有", x, y + 12);
}

function drawCenteredText(ctx, text, centerX, baselineY, maxWidth) {
  let output = text;
  while (ctx.measureText(output).width > maxWidth && output.length > 1) {
    output = `${output.slice(0, -2)}…`;
  }
  ctx.textAlign = "center";
  ctx.fillText(output, centerX, baselineY);
  ctx.textAlign = "left";
}

function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

async function loadExportImages(entries) {
  const images = new Map();
  let index = 0;
  const stopAt = Date.now() + EXPORT_ICON_LOAD_BUDGET_MS;
  const workers = Array.from({ length: EXPORT_ICON_WORKERS }, async () => {
    while (index < entries.length && Date.now() < stopAt) {
      const entry = entries[index];
      index += 1;
      const image = await loadPokemonExportImage(entry, stopAt);
      if (image) images.set(entryKey(entry), image);
    }
  });
  await Promise.all(workers);
  return images;
}

async function loadPokemonExportImage(entry, stopAt) {
  const dataUrl = await fetchImageDataUrl(entryRemoteIconSrc(entry), iconLoadTimeout(stopAt));
  if (!dataUrl) return null;
  return loadCanvasImage(dataUrl, iconLoadTimeout(stopAt));
}

function iconLoadTimeout(stopAt) {
  return Math.max(250, Math.min(EXPORT_ICON_LOAD_TIMEOUT_MS, stopAt - Date.now()));
}

async function fetchImageDataUrl(src, timeoutMs) {
  if (timeoutMs <= 0) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(src, { mode: "cors", signal: controller.signal });
    if (!response.ok) return null;
    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });
}

function loadCanvasImage(src, timeoutMs) {
  return new Promise((resolve) => {
    if (timeoutMs <= 0) {
      resolve(null);
      return;
    }
    const image = new Image();
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    image.onload = () => finish(image);
    image.onerror = () => finish(null);
    image.src = src;
  });
}

function downloadCanvas(canvas, filename) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas export failed"));
        return;
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

function exportData() {
  const blob = new Blob([JSON.stringify({ inventory: state.inventory }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `pokemon-figure-collection-${today()}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed.inventory)) throw new Error("bad data");
      state.inventory = parsed.inventory.map(normalizeRecord);
      saveState();
      renderAll();
      showToast("数据已导入");
    } catch {
      showToast("导入失败");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function clearData() {
  if (!confirm("清空本地库存数据？")) return;
  state.inventory = [];
  saveState();
  renderAll();
  showToast("已清空");
}
