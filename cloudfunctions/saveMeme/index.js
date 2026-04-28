const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    return { success: false, error: '未能获取用户OPENID' };
  }

  const { path, layers, shareInfo } = event;

  try {
    const memeCollection = db.collection('user_memes');
    const res = await memeCollection.add({
      data: {
        _openid: openid,
        path,
        layers: layers || [],
        shareInfo: shareInfo || {},
        createTime: db.serverDate()
      }
    });

    return {
      success: true,
      data: { id: res._id }
    };
  } catch (err) {
    console.error('saveMeme error:', err);
    return { success: false, error: err.message };
  }
};