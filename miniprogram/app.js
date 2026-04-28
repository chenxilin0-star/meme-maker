App({
  globalData: {
    userInfo: null,
    openid: null,
    cloudEnv: 'cloudbase-0gfz6a1mf0af3d53' // 微信云开发环境ID
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
    this.autoLogin();
  },

  async autoLogin() {
    try {
      const { result } = await wx.cloud.callFunction({ name: 'authLogin', data: {} });
      if (result && result.success && result.data && result.data.openid) {
        this.globalData.openid = result.data.openid;
        console.log('[App] Auto login success, openid:', result.data.openid);
      }
    } catch (err) {
      console.warn('[App] Auto login failed:', err);
    }
  },

  loadLocalUser() {
    const user = wx.getStorageSync('meme_user_info');
    if (user) {
      this.globalData.userInfo = user;
    }
  }
});
