const api = require('../../utils/api');
const store = require('../../utils/store');

Page({
  data: {
    imagePath: '',
    saving: false
  },

  onLoad(options) {
    if (options.path) {
      this.setData({ imagePath: decodeURIComponent(options.path) });
    }
  },

  // 保存到相册
  async onSaveToAlbum() {
    this.setData({ saving: true });
    try {
      await wx.saveImageToPhotosAlbum({
        filePath: this.data.imagePath
      });
      wx.showToast({ title: '已保存到相册', icon: 'success' });

      // 同步保存记录到云端
      api.saveMeme({ path: this.data.imagePath }).catch(() => {});
    } catch (err) {
      if (err.errMsg && err.errMsg.includes('auth deny')) {
        wx.showModal({
          title: '需要授权',
          content: '保存图片需要访问您的相册权限',
          showCancel: false,
          success: () => {
            wx.openSetting();
          }
        });
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    }
    this.setData({ saving: false });
  },

  // 分享给好友
  onShareToFriend() {
    // 小程序内分享由系统按钮处理
  },

  // 返回首页
  onBackHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  // 继续编辑
  onContinueEdit() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: '我刚制作了一个表情包！',
      path: '/pages/index/index',
      imageUrl: this.data.imagePath
    };
  }
});
