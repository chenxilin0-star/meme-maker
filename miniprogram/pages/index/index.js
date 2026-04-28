const api = require('../../utils/api');
const store = require('../../utils/store');

// 内置模板数据 - 使用真实素材图片
const BUILTIN_TEMPLATES = [
  { id: 't1', name: '落日', category: 'classic', src: '/assets/templates/gradient_sunset.svg', type: 'image', desc: '暖色渐变背景' },
  { id: 't2', name: '海洋', category: 'simple', src: '/assets/templates/gradient_ocean.svg', type: 'image', desc: '清新海洋渐变' },
  { id: 't3', name: '打工人', category: 'work', src: '/assets/templates/gradient_night.svg', type: 'image', desc: '深邃夜空渐变' },
  { id: 't4', name: '干饭', category: 'food', src: '/assets/templates/gradient_peach.svg', type: 'image', desc: '温柔桃花色' },
  { id: 't5', name: '流氓兔', category: 'animal', src: '/assets/templates/gradient_candy.svg', type: 'image', desc: '梦幻粉色渐变' },
  { id: 't6', name: '神奇海螺', category: 'funny', src: '/assets/templates/gradient_purple.svg', type: 'image', desc: '神秘紫色渐变' },
  { id: 't7', name: '森林', category: 'classic', src: '/assets/templates/gradient_forest.svg', type: 'image', desc: '自然森林渐变' },
  { id: 't8', name: '暗色', category: 'funny', src: '/assets/templates/gradient_dark.svg', type: 'image', desc: '酷酷暗色渐变' }
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
    const params = [`templateId=${template.id}`, `name=${encodeURIComponent(template.name)}`];
    if (template.src) {
      params.push(`templateSrc=${encodeURIComponent(template.src)}`);
    }
    wx.navigateTo({
      url: `/pages/editor/editor?${params.join('&')}`
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
