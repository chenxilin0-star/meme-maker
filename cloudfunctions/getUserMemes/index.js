const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    return { success: false, error: '未能获取用户OPENID' };
  }

  const { page = 1, limit = 20 } = event;
  const skip = (page - 1) * limit;

  try {
    const memeCollection = db.collection('user_memes');
    const res = await memeCollection
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(limit)
      .get();

    const countRes = await memeCollection.where({ _openid: openid }).count();

    return {
      success: true,
      data: {
        list: res.data,
        total: countRes.total,
        page,
        limit
      }
    };
  } catch (err) {
    console.error('getUserMemes error:', err);
    return { success: false, error: err.message, data: { list: [], total: 0 } };
  }
};