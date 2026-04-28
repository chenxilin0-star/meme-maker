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
    { id: 'mt1', name: '落日', tag: '经典', type: 'gradient', gradient: ['#FF6B6B', '#FFE66D'] },
    { id: 'mt2', name: '海洋', tag: '简约', type: 'gradient', gradient: ['#4ECDC4', '#44A08D'] },
    { id: 'mt3', name: '打工人', tag: '职场', type: 'gradient', gradient: ['#0f2027', '#203a43', '#2c5364'] },
    { id: 'mt4', name: '干饭', tag: '生活', type: 'gradient', gradient: ['#ffecd2', '#fcb69f'] },
    { id: 'mt5', name: '流氓兔', tag: '可爱', type: 'gradient', gradient: ['#ff9a9e', '#fecfef'] },
    { id: 'mt6', name: '派大星', tag: '派大星', type: 'gradient', gradient: ['#667eea', '#764ba2'] },
    { id: 'mt7', name: '狗头', tag: '经典', type: 'gradient', gradient: ['#11998e', '#38ef7d'] },
    { id: 'mt8', name: '滑稽', tag: '搞笑', type: 'gradient', gradient: ['#232526', '#414345'] }
  ],
  sticker: [
    { id: 'ms1', src: '/assets/stickers/joy.png', name: '笑哭' },
    { id: 'ms2', src: '/assets/stickers/cry.png', name: '哭泣' },
    { id: 'ms3', src: '/assets/stickers/smirk.png', name: '得意' },
    { id: 'ms4', src: '/assets/stickers/unamused.png', name: '无语' },
    { id: 'ms5', src: '/assets/stickers/scream.png', name: '惊讶' },
    { id: 'ms6', src: '/assets/stickers/heart_eyes.png', name: '喜爱' },
    { id: 'ms7', src: '/assets/stickers/thumbsup.png', name: '点赞' },
    { id: 'ms8', src: '/assets/stickers/party.png', name: '庆祝' },
    { id: 'ms9', src: '/assets/stickers/smiling_imp.png', name: '小恶魔' },
    { id: 'ms10', src: '/assets/stickers/zany_face.png', name: '调皮' },
    { id: 'ms11', src: '/assets/stickers/thinking.png', name: '思考' },
    { id: 'ms12', src: '/assets/stickers/sleeping.png', name: '困了' },
    { id: 'ms13', src: '/assets/stickers/fire.png', name: '火焰' },
    { id: 'ms14', src: '/assets/stickers/heart.png', name: '爱心' },
    { id: 'ms15', src: '/assets/stickers/star.png', name: '星星' },
    { id: 'ms16', src: '/assets/stickers/doodle_check.svg', name: '对勾' },
    { id: 'ms17', src: '/assets/stickers/doodle_cross.svg', name: '叉号' },
    { id: 'ms18', src: '/assets/stickers/icon_heart.svg', name: '心形' }
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
