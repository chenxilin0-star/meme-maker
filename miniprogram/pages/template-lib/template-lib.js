const { MEME_TEMPLATES, TEMPLATE_CATEGORIES } = require('../../data/templates');

Page({
  data: {
    categories: TEMPLATE_CATEGORIES,
    activeCategory: 'all',
    allTemplates: MEME_TEMPLATES,
    templates: MEME_TEMPLATES,
    searchKeyword: ''
  },

  onLoad() {
    // 模板已通过 require 导入
  },

  onCategoryTap(e) {
    const catId = e.currentTarget.dataset.id;
    this.setData({ activeCategory: catId });
    this.filterTemplates();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.filterTemplates();
  },

  onSearchConfirm() {
    this.filterTemplates();
  },

  filterTemplates() {
    const { activeCategory, searchKeyword, allTemplates } = this.data;
    let list = allTemplates;

    // 分类筛选
    if (activeCategory !== 'all') {
      list = list.filter(t => t.category === activeCategory);
    }

    // 关键词筛选
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      list = list.filter(t => 
        t.name.toLowerCase().includes(kw) ||
        t.defaultText.toLowerCase().includes(kw) ||
        (t.tag && t.tag.toLowerCase().includes(kw))
      );
    }

    this.setData({ templates: list });
  },

  onTemplateTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/template-editor/template-editor?id=${item.id}`
    });
  },

  onFreeCreate() {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  }
});
