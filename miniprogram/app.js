App({
  globalData: {
    userInfo: null,
    openid: null,
    cloudEnv: 'your-cloud-env-id' // 替换为真实的云开发环境ID
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: this.globalData.cloudEnv,
        traceUser: true
      });
    }

    this.loadLocalUser();
  },

  loadLocalUser() {
    const user = wx.getStorageSync('meme_user_info');
    if (user) {
      this.globalData.userInfo = user;
    }
  }
});
