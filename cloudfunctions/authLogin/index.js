const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    return { success: false, error: '未能获取用户OPENID' };
  }

  const { nickName, avatarUrl } = event;

  try {
    const userCollection = db.collection('users');
    const userRes = await userCollection.where({ _openid: openid }).get();

    let isNewUser = false;

    if (userRes.data.length === 0) {
      // 新用户
      isNewUser = true;
      await userCollection.add({
        data: {
          _openid: openid,
          nickName: nickName || '表情制作者',
          avatarUrl: avatarUrl || '',
          createTime: db.serverDate(),
          lastLoginAt: db.serverDate()
        }
      });
    } else {
      // 更新登录时间
      const updateData = { lastLoginAt: db.serverDate() };
      if (nickName) updateData.nickName = nickName;
      if (avatarUrl) updateData.avatarUrl = avatarUrl;

      await userCollection.doc(userRes.data[0]._id).update({ data: updateData });
    }

    return {
      success: true,
      data: { openid, isNewUser }
    };
  } catch (err) {
    console.error('authLogin error:', err);
    return { success: false, error: err.message };
  }
};