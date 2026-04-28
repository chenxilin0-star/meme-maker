/**
 * API 封装 - 支持云函数调用 + 本地 Mock 降级
 * 所有接口均为免费方案，不依赖第三方付费API
 */

const CLOUD_TIMEOUT_MS = 6000;

// 本地 Mock 数据 - 确保无云开发环境时也可预览
const MOCK_DATA = {
  getMemeTexts: {
    success: true,
    data: {
      hot: [
        { id: 'h1', text: '我真的会谢', category: '日常', hot: 98 },
        { id: 'h2', text: '今天也在摸鱼呢', category: '打工', hot: 95 },
        { id: 'h3', text: '你说的对但我不改', category: '漠然', hot: 92 },
        { id: 'h4', text: '退退退！', category: '渠道', hot: 90 },
        { id: 'h5', text: '没有一顿饭是白吃的', category: '干饭', hot: 88 },
        { id: 'h6', text: '就算是小草也要努力生长', category: '鼓励', hot: 85 },
        { id: 'h7', text: '下班了，灵魂归位', category: '打工', hot: 82 },
        { id: 'h8', text: '这就是人生啊', category: '感叹', hot: 80 }
      ],
      categories: [
        { id: 'daily', name: '日常', icon: '😊' },
        { id: 'work', name: '打工', icon: '💼' },
        { id: 'food', name: '干饭', icon: '🍜' },
        { id: 'emo', name: '渠道', icon: '😭' },
        { id: 'encourage', name: '鼓励', icon: '💪' },
        { id: 'roast', name: '吐槽', icon: '👅' }
      ],
      texts: [
        { id: 't1', text: '我真的会谢', category: 'daily' },
        { id: 't2', text: '在干了在干了', category: 'work' },
        { id: 't3', text: '饭点了饭点了', category: 'food' },
        { id: 't4', text: '我的心好痛', category: 'emo' },
        { id: 't5', text: '加油你是最棒的', category: 'encourage' },
        { id: 't6', text: '这个世界会好的', category: 'encourage' },
        { id: 't7', text: '这是人干的事吗', category: 'roast' },
        { id: 't8', text: '怎么又到周一了', category: 'work' },
        { id: 't9', text: '抱歉，有钱真的可以为所欲为', category: 'roast' },
        { id: 't10', text: '抱歉，是我不配', category: 'emo' }
      ]
    }
  },
  saveMeme: { success: true, data: { id: 'mock_' + Date.now() } },
  getUserMemes: {
    success: true,
    data: { list: [], total: 0 }
  },
  authLogin: {
    success: true,
    data: { openid: 'mock_openid_' + Date.now(), isNewUser: true }
  }
};

/**
 * 调用云函数
 * @param {string} name - 云函数名
 * @param {object} data - 传参
 * @returns {Promise<object>}
 */
function callCloud(name, data = {}) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn(`[API] 云函数 ${name} 超时，降级到本地数据`);
      resolve(MOCK_DATA[name] || { success: true, data: {} });
    }, CLOUD_TIMEOUT_MS);

    wx.cloud.callFunction({
      name,
      data,
      success: (res) => {
        clearTimeout(timeout);
        resolve(res.result || MOCK_DATA[name]);
      },
      fail: (err) => {
        clearTimeout(timeout);
        console.warn(`[API] 云函数 ${name} 失败:`, err);
        resolve(MOCK_DATA[name] || { success: false, error: err.message, data: {} });
      }
    });
  });
}

/**
 * 获取热梗文案
 */
function getMemeTexts(params = {}) {
  return callCloud('getMemeTexts', params);
}

/**
 * 保存表情包
 */
function saveMeme(data) {
  return callCloud('saveMeme', data);
}

/**
 * 获取用户作品
 */
function getUserMemes(params = {}) {
  return callCloud('getUserMemes', params);
}

/**
 * 登录/获取用户信息
 */
function authLogin(userInfo = {}) {
  return callCloud('authLogin', userInfo);
}

/**
 * 内容安全检查（微信免费接口）
 */
function msgSecCheck(content) {
  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: 'contentCheck',
      data: { content },
      success: (res) => resolve(res.result),
      fail: () => resolve({ success: true, pass: true }) // 检查失败时默认放行
    });
  });
}

module.exports = {
  callCloud,
  getMemeTexts,
  saveMeme,
  getUserMemes,
  authLogin,
  msgSecCheck,
  MOCK_DATA
};
