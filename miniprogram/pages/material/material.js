const api = require('../../utils/api');

// 素材分类
const CATEGORIES = [
  { id: 'template', name: '模板', icon: '🎨' },
  { id: 'sticker', name: '贴纸', icon: '🎯' },
  { id: 'bg', name: '背景', icon: '🌄' },
  { id: 'text', name: '文案', icon: '✍️' }
];

// 内置素材数据 - 使用真实素材图片
const MATERIALS = {
  template: [
    { id: 't1', name: '落日', tag: '经典', type: 'gradient', gradient: ['#FF6B6B', '#FFE66D'] },
    { id: 't2', name: '海洋', tag: '简约', type: 'gradient', gradient: ['#4ECDC4', '#44A08D'] },
    { id: 't3', name: '紫夜', tag: '神秘', type: 'gradient', gradient: ['#667eea', '#764ba2'] },
    { id: 't4', name: '桃花', tag: '温柔', type: 'gradient', gradient: ['#ffecd2', '#fcb69f'] },
    { id: 't5', name: '夜空', tag: '深邃', type: 'gradient', gradient: ['#0f2027', '#203a43', '#2c5364'] },
    { id: 't6', name: '森林', tag: '自然', type: 'gradient', gradient: ['#11998e', '#38ef7d'] },
    { id: 't7', name: '梦幻', tag: '可爱', type: 'gradient', gradient: ['#ff9a9e', '#fecfef'] },
    { id: 't8', name: '暗色', tag: '酷酷', type: 'gradient', gradient: ['#232526', '#414345'] },
    { id: 't9', name: '冰蓝', tag: '清爽', type: 'gradient', gradient: ['#2193b0', '#6dd5ed'] },
    { id: 't10', name: '橙子', tag: '活力', type: 'gradient', gradient: ['#f83600', '#f9d423'] },
    { id: 't11', name: '粉红', tag: '赛博', type: 'gradient', gradient: ['#ff00cc', '#333399'] },
    { id: 't12', name: '森林深', tag: '深郁', type: 'gradient', gradient: ['#134e5e', '#71b280'] }
  ],
  sticker: [
    { id: 's1', src: '/assets/stickers/joy.png', name: '笑哭' },
    { id: 's2', src: '/assets/stickers/cry.png', name: '哭泣' },
    { id: 's3', src: '/assets/stickers/smirk.png', name: '得意' },
    { id: 's4', src: '/assets/stickers/unamused.png', name: '无语' },
    { id: 's5', src: '/assets/stickers/scream.png', name: '惊讶' },
    { id: 's6', src: '/assets/stickers/heart_eyes.png', name: '喜爱' },
    { id: 's7', src: '/assets/stickers/thumbsup.png', name: '点赞' },
    { id: 's8', src: '/assets/stickers/party.png', name: '庆祝' },
    { id: 's9', src: '/assets/stickers/smiling_imp.png', name: '小恶魔' },
    { id: 's10', src: '/assets/stickers/zany_face.png', name: '调皮' },
    { id: 's11', src: '/assets/stickers/thinking.png', name: '思考' },
    { id: 's12', src: '/assets/stickers/sleeping.png', name: '困了' },
    { id: 's13', src: '/assets/stickers/fire.png', name: '火焰' },
    { id: 's14', src: '/assets/stickers/heart.png', name: '爱心' },
    { id: 's15', src: '/assets/stickers/star.png', name: '星星' },
    { id: 's16', src: '/assets/stickers/smile.png', name: '微笑' },
    { id: 's17', src: '/assets/stickers/doodle_check.svg', name: '对勾' },
    { id: 's18', src: '/assets/stickers/doodle_cross.svg', name: '叉号' },
    { id: 's19', src: '/assets/stickers/doodle_exclamation.svg', name: '惊叹号' },
    { id: 's20', src: '/assets/stickers/icon_heart.svg', name: '心形' },
    { id: 's21', src: '/assets/stickers/poo.png', name: '便便' },
    { id: 's22', src: '/assets/stickers/clown.png', name: '小丑' },
    { id: 's23', src: '/assets/stickers/skull.png', name: '髅髋' },
    { id: 's24', src: '/assets/stickers/ghost.png', name: '幽灵' },
    { id: 's25', src: '/assets/stickers/alien.png', name: '外星人' },
    { id: 's26', src: '/assets/stickers/robot.png', name: '机器人' },
    { id: 's27', src: '/assets/stickers/cat_heart.png', name: '花心猫' },
    { id: 's28', src: '/assets/stickers/dog.png', name: '狗狗' },
    { id: 's29', src: '/assets/stickers/frog.png', name: '青蛙' },
    { id: 's30', src: '/assets/stickers/chicken.png', name: '小鸡' },
    { id: 's31', src: '/assets/stickers/pig.png', name: '小猪' },
    { id: 's32', src: '/assets/stickers/panda.png', name: '熊猫' },
    { id: 's33', src: '/assets/stickers/monkey.png', name: '猴子' },
    { id: 's34', src: '/assets/stickers/unicorn.png', name: '独角兽' },
    { id: 's35', src: '/assets/stickers/butterfly.png', name: '蝴蝶' },
    { id: 's36', src: '/assets/stickers/sunflower.png', name: '向日葵' },
    { id: 's37', src: '/assets/stickers/rose.png', name: '玫瑰' },
    { id: 's38', src: '/assets/stickers/cactus.png', name: '仙人掌' },
    { id: 's39', src: '/assets/stickers/mushroom.png', name: '蘑菇' },
    { id: 's40', src: '/assets/stickers/cookie.png', name: '饼干' },
    { id: 's41', src: '/assets/stickers/pizza.png', name: '披萨' },
    { id: 's42', src: '/assets/stickers/beer.png', name: '啤酒' },
    { id: 's43', src: '/assets/stickers/coffee.png', name: '咖啡' },
    { id: 's44', src: '/assets/stickers/gift.png', name: '礼物' },
    { id: 's45', src: '/assets/stickers/balloon.png', name: '气球' },
    { id: 's46', src: '/assets/stickers/tada.png', name: '礼花' },
    { id: 's47', src: '/assets/stickers/crown.png', name: '皇冠' },
    { id: 's48', src: '/assets/stickers/glasses.png', name: '眼镜' },
    { id: 's49', src: '/assets/stickers/rainbow.png', name: '彩虹' },
    { id: 's50', src: '/assets/stickers/lightning.png', name: '闪电' },
    { id: 's51', src: '/assets/stickers/snowflake.png', name: '雪花' },
    { id: 's52', src: '/assets/stickers/wave.png', name: '招手' },
    { id: 's53', src: '/assets/stickers/ok_hand.png', name: 'OK' },
    { id: 's54', src: '/assets/stickers/pray.png', name: '祈祷' },
    { id: 's55', src: '/assets/stickers/muscle.png', name: '肌肉' },
    { id: 's56', src: '/assets/stickers/shrug.png', name: '摊手' },
    { id: 's57', src: '/assets/stickers/facepalm.png', name: '扶额' },
    { id: 's58', src: '/assets/stickers/nerd.png', name: '书呆子' },
    { id: 's59', src: '/assets/stickers/cool.png', name: '酷' },
    { id: 's60', src: '/assets/stickers/kiss.png', name: '亲亲' },
    { id: 's61', src: '/assets/stickers/angry.png', name: '生气' },
    { id: 's62', src: '/assets/stickers/confused.png', name: '困惑' },
    { id: 's63', src: '/assets/stickers/rolling_eyes.png', name: '翻白眼' },
    { id: 's64', src: '/assets/stickers/vomit.png', name: '吐了' },
    { id: 's65', src: '/assets/stickers/exploding_head.png', name: '脑炸' },
    { id: 's66', src: '/assets/stickers/sunglasses.png', name: '墨镜' },
    { id: 's67', src: '/assets/stickers/shushing.png', name: '噗' },
    { id: 's68', src: '/assets/stickers/point_right.png', name: '右指' },
    { id: 's69', src: '/assets/stickers/point_left.png', name: '左指' },
    { id: 's70', src: '/assets/stickers/point_up.png', name: '上指' },
    { id: 's71', src: '/assets/stickers/sneezing.png', name: '打喷嚏' },
    { id: 's72', src: '/assets/stickers/lying.png', name: '说谎' },
    { id: 's73', src: '/assets/stickers/neutral.png', name: '无表情' },
    { id: 's74', src: '/assets/stickers/expressionless.png', name: '面瘫' },
  ],
  bg: [
    { id: 'mb1', color: '#FFFFFF', name: '纯白' },
    { id: 'mb2', color: '#FF6B6B', name: '珊瑚红' },
    { id: 'mb3', color: '#4ECDC4', name: '薄荷绿' },
    { id: 'mb4', color: '#FFE66D', name: '柠檬黄' },
    { id: 'mb5', color: '#95E1D3', name: '清新绿' },
    { id: 'mb6', color: '#F38181', name: '樱花粉' },
    { id: 'mb7', color: '#AA96DA', name: '薰衣草' },
    { id: 'mb8', color: '#FCBAD3', name: '樱花粉' }
  ],
  text: [
    { id: 'tx1', text: '我真的会谢', category: '日常' },
    { id: 'tx2', text: '今天也在摸鱼呢', category: '打工' },
    { id: 'tx3', text: '你说的对但我不改', category: '日常' },
    { id: 'tx4', text: '退退退！', category: '渠道' },
    { id: 'tx5', text: '没有一顿饭是白吃的', category: '干饭' },
    { id: 'tx6', text: '加油你是最棒的', category: '鼓励' },
    { id: 'tx7', text: '这是人干的事吗', category: '吐槽' },
    { id: 'tx8', text: '怎么又到周一了', category: '打工' },
    { id: 'tx9', text: '抱歉，有钱真的可以为所欲为', category: '吐槽' },
    { id: 'tx10', text: '抱歉，是我不配', category: '渠道' }
  ]
};

Page({
  data: {
    categories: CATEGORIES,
    activeCategory: 'template',
    materials: [],
    searchKeyword: ''
  },

  onLoad(options) {
    if (options.keyword) {
      this.setData({ searchKeyword: options.keyword });
      this.searchMaterials(options.keyword);
    } else {
      this.loadMaterials('template');
    }
  },

  onShow() {
    this.loadMaterials(this.data.activeCategory);
  },

  loadMaterials(category) {
    const mats = MATERIALS[category] || [];
    this.setData({ materials: mats });
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeCategory: id });
    this.loadMaterials(id);
  },

  onMaterialTap(e) {
    const item = e.currentTarget.dataset.item;
    const cat = this.data.activeCategory;

    if (cat === 'text') {
      wx.navigateTo({
        url: `/pages/editor/editor?text=${encodeURIComponent(item.text)}`
      });
    } else if (cat === 'template' && item.type === 'gradient') {
      wx.navigateTo({
        url: `/pages/editor/editor?materialId=${item.id}&type=${cat}&gradient=${encodeURIComponent(JSON.stringify(item.gradient))}`
      });
    } else if (item.src) {
      wx.navigateTo({
        url: `/pages/editor/editor?materialId=${item.id}&type=${cat}&src=${encodeURIComponent(item.src)}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/editor/editor?materialId=${item.id}&type=${cat}`
      });
    }
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.searchMaterials(this.data.searchKeyword);
  },

  searchMaterials(keyword) {
    if (!keyword.trim()) {
      this.loadMaterials(this.data.activeCategory);
      return;
    }
    const all = [];
    Object.values(MATERIALS).forEach(arr => {
      arr.forEach(item => {
        const text = (item.name || item.text || '').toLowerCase();
        if (text.includes(keyword.toLowerCase())) {
          all.push(item);
        }
      });
    });
    this.setData({ materials: all });
  },

  onShareAppMessage() {
    return {
      title: '表情包素材库 - 海量模板贴纸任你选',
      path: '/pages/material/material'
    };
  }
});
