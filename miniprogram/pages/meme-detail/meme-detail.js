const { MEME_DATA } = require('../../data/memes');

Page({
  data: {
    memeData: {},
    isCollected: false,
    recommendMemes: []
  },

  onLoad(options) {
    const meme = MEME_DATA.find(m => m.id === options.id);
    if (!meme) {
      wx.showToast({ title: '表情包不存在', icon: 'none' });
      wx.navigateBack();
      return;
    }

    // 检查是否已收藏
    const collected = wx.getStorageSync('collected_memes') || [];
    const isCollected = collected.includes(meme.id);

    // 推荐同类别表情包
    const recommend = MEME_DATA
      .filter(m => m.category === meme.category && m.id !== meme.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    this.setData({
      memeData: meme,
      isCollected,
      recommendMemes: recommend
    });

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    const { memeData } = this.data;
    return {
      title: `分享一个好玩的表情包：${memeData.name}`,
      path: `/pages/meme-detail/meme-detail?id=${memeData.id}`,
      imageUrl: memeData.src
    };
  },

  onBack() {
    wx.navigateBack();
  },

  onShare() {
    // 微信小程序分享由 onShareAppMessage 处理，这里只需触发系统分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onSave() {
    const { memeData } = this.data;
    wx.showLoading({ title: '下载中...' });
    wx.downloadFile({
      url: memeData.src,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading();
            wx.showToast({ title: '已保存到相册', icon: 'success' });
          },
          fail: (err) => {
            wx.hideLoading();
            if (err.errMsg && err.errMsg.includes('auth')) {
              wx.showModal({
                title: '需要授权',
                content: '请允许保存图片到相册',
                success: (r) => {
                  if (r.confirm) wx.openSetting();
                }
              });
            } else {
              wx.showToast({ title: '保存失败', icon: 'none' });
            }
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '下载失败', icon: 'none' });
      }
    });
  },

  onCollect() {
    const { memeData, isCollected } = this.data;
    let collected = wx.getStorageSync('collected_memes') || [];

    if (isCollected) {
      collected = collected.filter(id => id !== memeData.id);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      collected.push(memeData.id);
      wx.showToast({ title: '已收藏', icon: 'success' });
    }

    wx.setStorageSync('collected_memes', collected);
    this.setData({ isCollected: !isCollected });
  },

  onCopy() {
    const { memeData } = this.data;
    wx.setClipboardData({
      data: memeData.src,
      success: () => {
        wx.showToast({ title: '链接已复制', icon: 'success' });
      }
    });
  },

  onPreviewImage() {
    const { memeData } = this.data;
    wx.previewImage({
      urls: [memeData.src],
      current: memeData.src
    });
  },

  onRecommendTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.redirectTo({
      url: `/pages/meme-detail/meme-detail?id=${item.id}`
    });
  }
});
