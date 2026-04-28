/**
 * 本地存储封装 - 用于存储用户作品、设置、草稿等
 */

const PREFIX = 'meme_';

module.exports = {
  get(key, defaultValue = null) {
    try {
      const val = wx.getStorageSync(PREFIX + key);
      return val !== '' ? val : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      wx.setStorageSync(PREFIX + key, value);
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  remove(key) {
    try {
      wx.removeStorageSync(PREFIX + key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },

  // 用户作品管理
  getMemes() {
    return this.get('user_memes', []);
  },

  saveMeme(meme) {
    const memes = this.getMemes();
    meme.localId = 'local_' + Date.now();
    meme.createTime = new Date().toISOString();
    memes.unshift(meme);
    // 限制本地存储数量
    if (memes.length > 50) memes.length = 50;
    this.set('user_memes', memes);
    return meme;
  },

  deleteMeme(localId) {
    let memes = this.getMemes();
    memes = memes.filter(m => m.localId !== localId);
    this.set('user_memes', memes);
    return memes;
  },

  // 草稿
  getDraft() {
    return this.get('editor_draft', null);
  },

  saveDraft(draft) {
    this.set('editor_draft', draft);
  },

  clearDraft() {
    this.remove('editor_draft');
  },

  // 用户信息
  getUserInfo() {
    return this.get('user_info', null);
  },

  setUserInfo(info) {
    this.set('user_info', info);
  }
};
