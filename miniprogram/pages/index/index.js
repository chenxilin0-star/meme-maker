const api = require('../../utils/api');
const store = require('../../utils/store');

// 内置模板数据 - 使用免费素材源描述，实际运行时从云存储加载
const BUILTIN_TEMPLATES = [
  { id: 't1', name: '熊猫头', category: 'classic', color: '#333', type: 'text', bg: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f43c.svg', desc: '经典熊猫头模板' },
  { id: 't2', name: '纯文字', category: 'simple', color: '#FF6B6B', type: 'color', bgColor: '#FFE66D', desc: '纯色背景配大字' },
  { id: 't3', name: '打工人', category: 'work', color: '#4ECDC4', type: 'text', bg: '', desc: '打工人专属' },
  { id: 't4', name: '干饭', category: 'food', color: '#FF8C42', type: 'text', bg: '', desc: '干饭人干饭魂' },
  { id: 't5', name: '流氓兔', category: 'animal', color: '#FF6B6B', type: 'text', bg: '', desc: '可爱兔兔表情' },
  { id: 't6', name: '神奇海螺', category: 'funny', color: '#4ECDC4', type: 'text', bg: '', desc: '神奇海螺在这里' }
];

// 分类标签
const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'hot', name: '热门' },
  { id: 'classic', name: '经典' },
  { id: 'work', name: '打工' },
  { id: 'food', name: '干饭' },
  { id: 'animal', name: '动物' },
  { id: 'funny', name: '搞笑' }
];

Page({
  data: {
    templates: BUILTIN_TEMPLATES,
    categories: CATEGORIES,
    activeCategory: 'all',
    hotTexts: [],
    currentTextIndex: 0,
    searchKeyword: '',
    userInfo: null
  },

  onLoad() {
    this.loadHotTexts();
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  // 加载热门文案
  async loadHotTexts() {
    const res = await api.getMemeTexts({ type: 'hot', limit: 20 });
    if (res.success && res.data && res.data.hot) {
      this.setData({ hotTexts: res.data.hot });
    } else {
      // 使用内置文案
      this.setData({
        hotTexts: [
          { id: 'h1', text: '我真的会谢' },
          { id: 'h2', text: '今天也在摸鱼呢' },
          { id: 'h3', text: '你说的对但我不改' },
          { id: 'h4', text: '退退退！' },
          { id: 'h5', text: '没有一顿饭是白吃的' }
        ]
      });
    }
  },

  // 加载用户信息
  loadUserInfo() {
    const info = store.getUserInfo();
    if (info) {
      this.setData({ userInfo: info });
    }
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    const kw = this.data.searchKeyword.trim();
    if (kw) {
      wx.navigateTo({
        url: `/pages/material/material?keyword=${encodeURIComponent(kw)}`
      });
    }
  },

  // 切换分类
  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeCategory: id });
    this.filterTemplates(id);
  },

  filterTemplates(category) {
    if (category === 'all') {
      this.setData({ templates: BUILTIN_TEMPLATES });
    } else {
      const filtered = BUILTIN_TEMPLATES.filter(t => t.category === category || category === 'hot');
      this.setData({ templates: filtered.length ? filtered : BUILTIN_TEMPLATES });
    }
  },

  // 点击模板
  onTemplateTap(e) {
    const template = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/editor/editor?templateId=${template.id}&name=${encodeURIComponent(template.name)}`
    });
  },

  // 点击热门文案
  onHotTextTap(e) {
    const text = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: `/pages/editor/editor?text=${encodeURIComponent(text)}`
    });
  },

  // 换一批文案
  onRefreshTexts() {
    this.loadHotTexts();
  },

  // 快速制作
  onQuickMake() {
    wx.navigateTo({
      url: '/pages/editor/editor'
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '表情包制作 - 3秒做表情，斗图永不输',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: '表情包制作 - 3秒做表情，斗图永不输'
    };
  }
});
