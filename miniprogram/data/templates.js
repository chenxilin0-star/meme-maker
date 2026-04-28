// 梗图模板数据集
const MEME_TEMPLATES = [
  {
    id: 'tmpl_001',
    name: '熊猫头无语',
    category: 'hot',
    src: '/assets/templates/panda_speechless.png',
    defaultText: '无语了家人们',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '热门'
  },
  {
    id: 'tmpl_002',
    name: '熊猫头生气',
    category: 'hot',
    src: '/assets/templates/panda_angry.png',
    defaultText: '你再说一遍？',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#CC0000', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '热门'
  },
  {
    id: 'tmpl_003',
    name: '熊猫头哭泣',
    category: 'hot',
    src: '/assets/templates/panda_cry.png',
    defaultText: '我好难啊',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '热门'
  },
  {
    id: 'tmpl_004',
    name: '熊猫头得意',
    category: 'hot',
    src: '/assets/templates/panda_smirk.png',
    defaultText: '哼 小意思',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '热门'
  },
  {
    id: 'tmpl_005',
    name: '熊猫头惊讶',
    category: 'hot',
    src: '/assets/templates/panda_shocked.png',
    defaultText: '什么？！',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 24, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 34 },
    tag: '热门'
  },
  {
    id: 'tmpl_006',
    name: '粉色气泡',
    category: 'classic',
    src: '/assets/templates/bubble_pink.png',
    defaultText: '今天也是元气满满的一天呢',
    textPosition: { x: 150, y: 150 },
    textStyle: { fontSize: 20, color: '#333333', strokeColor: 'none', strokeWidth: 0, maxWidth: 240, lineHeight: 30 },
    tag: '经典'
  },
  {
    id: 'tmpl_007',
    name: '蓝色气泡',
    category: 'classic',
    src: '/assets/templates/bubble_blue.png',
    defaultText: '这就是人生吗',
    textPosition: { x: 150, y: 150 },
    textStyle: { fontSize: 20, color: '#333333', strokeColor: 'none', strokeWidth: 0, maxWidth: 240, lineHeight: 30 },
    tag: '经典'
  },
  {
    id: 'tmpl_008',
    name: '黄色气泡',
    category: 'classic',
    src: '/assets/templates/bubble_yellow.png',
    defaultText: '干饭人 干饭魂',
    textPosition: { x: 150, y: 150 },
    textStyle: { fontSize: 20, color: '#333333', strokeColor: 'none', strokeWidth: 0, maxWidth: 240, lineHeight: 30 },
    tag: '经典'
  },
  {
    id: 'tmpl_009',
    name: '绿色气泡',
    category: 'classic',
    src: '/assets/templates/bubble_green.png',
    defaultText: '我绿了 但是我不说',
    textPosition: { x: 150, y: 150 },
    textStyle: { fontSize: 20, color: '#333333', strokeColor: 'none', strokeWidth: 0, maxWidth: 240, lineHeight: 30 },
    tag: '经典'
  },
  {
    id: 'tmpl_010',
    name: '紫色气泡',
    category: 'classic',
    src: '/assets/templates/bubble_purple.png',
    defaultText: '太困了 下次一定不瞄了',
    textPosition: { x: 150, y: 150 },
    textStyle: { fontSize: 20, color: '#333333', strokeColor: 'none', strokeWidth: 0, maxWidth: 240, lineHeight: 30 },
    tag: '经典'
  },
  {
    id: 'tmpl_011',
    name: '打工人',
    category: 'work',
    src: '/assets/templates/char_worker.png',
    defaultText: '今天也是努力打工的一天',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 20, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 30 },
    tag: '打工'
  },
  {
    id: 'tmpl_012',
    name: '撒娇猫',
    category: 'cute',
    src: '/assets/templates/char_cat.png',
    defaultText: '今天也要可可爱爱',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 20, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 30 },
    tag: '可爱'
  },
  {
    id: 'tmpl_013',
    name: '单身狗',
    category: 'roast',
    src: '/assets/templates/char_dog.png',
    defaultText: '今天也是单身的一天呢',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 20, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 30 },
    tag: '自嘲'
  },
  {
    id: 'tmpl_014',
    name: '蘑菇头开心',
    category: 'cute',
    src: '/assets/templates/mushroom_happy.png',
    defaultText: '开心心~',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '可爱'
  },
  {
    id: 'tmpl_015',
    name: '蘑菇头难过',
    category: 'roast',
    src: '/assets/templates/mushroom_sad.png',
    defaultText: '世界崩塌了',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '自嘲'
  },
  {
    id: 'tmpl_016',
    name: '蘑菇头惊讶',
    category: 'hot',
    src: '/assets/templates/mushroom_surprised.png',
    defaultText: '啊？！',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 24, color: '#CC0000', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 34 },
    tag: '热门'
  },
  {
    id: 'tmpl_017',
    name: '杀马特',
    category: 'hot',
    src: '/assets/templates/shamate_cool.png',
    defaultText: '哥的伤你不会懂',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#9900CC', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '热门'
  },
  {
    id: 'tmpl_018',
    name: '悲伤青蛙',
    category: 'roast',
    src: '/assets/templates/frog_meme.png',
    defaultText: '嗯...',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '自嘲'
  },
  {
    id: 'tmpl_019',
    name: '可爱小幽灵',
    category: 'cute',
    src: '/assets/templates/ghost_meme.png',
    defaultText: '哇呦~',
    textPosition: { x: 150, y: 250 },
    textStyle: { fontSize: 22, color: '#333333', strokeColor: '#FFFFFF', strokeWidth: 2, maxWidth: 240, lineHeight: 32 },
    tag: '可爱'
  }
];

// 分类标签
const TEMPLATE_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'hot', name: '热门' },
  { id: 'work', name: '打工' },
  { id: 'cute', name: '可爱' },
  { id: 'roast', name: '自嘲' },
  { id: 'classic', name: '经典' }
];

module.exports = {
  MEME_TEMPLATES,
  TEMPLATE_CATEGORIES
};
