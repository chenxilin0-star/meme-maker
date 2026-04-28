const { MEME_CATEGORIES, MEME_DATA } = require('../../data/memes');

const PAGE_SIZE = 20;

Page({
  data: {
    categories: [],
    activeCategory: 'all',
    allMemes: [],
    memes: [],
    searchKeyword: '',
    loading: false,
    hasMore: true,
    pageIndex: 0
  },

  onLoad() {
    // 构建分类列表
    const catList = [{ id: 'all', name: '全部' }];
    Object.entries(MEME_CATEGORIES).forEach(([key, val]) => {
      catList.push({ id: key, name: val.name });
    });

    this.setData({
      categories: catList,
      allMemes: MEME_DATA,
      memes: MEME_DATA.slice(0, PAGE_SIZE),
      hasMore: MEME_DATA.length > PAGE_SIZE,
      pageIndex: 1
    });
  },

  onCategoryTap(e) {
    const catId = e.currentTarget.dataset.id;
    this.setData({
      activeCategory: catId,
      searchKeyword: '',
      pageIndex: 0,
      loading: false
    });
    this.loadMemes(true);
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.setData({ pageIndex: 0 });
    this.loadMemes(true);
  },

  onLoadMore() {
    if (this.data.loading || !this.data.hasMore) return;
    this.loadMemes(false);
  },

  loadMemes(reset) {
    const { activeCategory, searchKeyword, allMemes, pageIndex } = this.data;
    this.setData({ loading: true });

    let list = allMemes;

    // 分类筛选
    if (activeCategory !== 'all') {
      list = list.filter(m => m.category === activeCategory);
    }

    // 关键词筛选
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(kw) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(kw)))
      );
    }

    const start = reset ? 0 : pageIndex * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageData = list.slice(start, end);

    this.setData({
      memes: reset ? pageData : this.data.memes.concat(pageData),
      hasMore: end < list.length,
      pageIndex: reset ? 1 : pageIndex + 1,
      loading: false
    });
  },

  onMemeTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/meme-detail/meme-detail?id=${item.id}`
    });
  },

  onCustomMeme() {
    wx.navigateTo({
      url: '/pages/editor/editor'
    });
  },

  onFreeCreate() {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  }
});
