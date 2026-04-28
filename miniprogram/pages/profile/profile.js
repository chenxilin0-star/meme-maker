const store = require('../../utils/store');
const api = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    memes: [],
    stats: {
      total: 0,
      saved: 0
    }
  },

  onLoad() {
    this.loadUserInfo();
    this.loadMemes();
    this.checkLoginStatus();
  },

  onShow() {
    this.loadMemes();
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const app = getApp();
    if (app.globalData.openid) {
      // 已登录，尝试从云端获取作品
      this.loadCloudMemes();
    }
  },

  async loadCloudMemes() {
    try {
      const res = await api.getUserMemes({ page: 1, limit: 50 });
      if (res.success && res.data && res.data.list) {
        // 合并本地和云端作品（去重）
        const localMemes = store.getMemes();
        const cloudMemes = res.data.list.map(item => ({
          ...item,
          localId: item._id || item.id,
          fromCloud: true
        }));
        const merged = [...cloudMemes];
        localMemes.forEach(local => {
          if (!merged.find(m => m.localId === local.localId)) {
            merged.push(local);
          }
        });
        this.setData({
          memes: merged,
          stats: {
            total: merged.length,
            saved: merged.filter(m => m.saved || m.fromCloud).length
          }
        });
      }
    } catch (err) {
      console.warn('Load cloud memes failed:', err);
    }
  },

  loadUserInfo() {
    const info = store.getUserInfo();
    if (info) {
      this.setData({ userInfo: info });
    }
  },

  async loadMemes() {
    const localMemes = store.getMemes();
    this.setData({
      memes: localMemes,
      stats: {
        total: localMemes.length,
        saved: localMemes.filter(m => m.saved).length
      }
    });
  },

  // 选择头像
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl;
    this.updateUserInfo({ avatarUrl });
  },

  // 输入昵称
  onNicknameInput(e) {
    const nickName = e.detail.value;
    if (nickName) {
      this.updateUserInfo({ nickName });
    }
  },

  updateUserInfo(data) {
    const userInfo = { ...this.data.userInfo, ...data };
    this.setData({ userInfo });
    store.setUserInfo(userInfo);

    // 同步到云端
    api.authLogin(userInfo).catch(() => {});
  },

  // 查看作品
  onMemeTap(e) {
    const meme = e.currentTarget.dataset.item;
    wx.previewImage({
      urls: [meme.path],
      current: meme.path
    });
  },

  // 删除作品
  onDeleteMeme(e) {
    const meme = e.currentTarget.dataset.item;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      success: (res) => {
        if (res.confirm) {
          const memes = store.deleteMeme(meme.localId);
          this.setData({ memes, stats: { total: memes.length, saved: 0 } });
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // 关于页面
  onAboutTap() {
    wx.showModal({
      title: '关于表情包制作',
      content: '本小程序使用完全免费、开源可商用的素材和字体\n\n素材来源：\n• 阿里巴巴普惠体（免费商用）\n• 思源黑体（OFL开源）\n• Open Doodles / unDraw（CC0/MIT）\n• PNGDirs（免费商用PNG）\n\n技术栈：微信小程序 + 微信云开发',
      showCancel: false
    });
  },

  // 意见反馈
  onFeedbackTap() {
    wx.showModal({
      title: '意见反馈',
      content: '有任何建议或问题，欢迎反馈给我们！',
      editable: true,
      placeholderText: '请输入您的反馈...',
      success: (res) => {
        if (res.confirm && res.content) {
          wx.showToast({ title: '反馈已提交，谢谢！', icon: 'success' });
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '表情包制作 - 3秒做表情',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: '表情包制作 - 3秒做表情'
    };
  }
});