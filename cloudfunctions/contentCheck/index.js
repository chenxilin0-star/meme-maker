const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

/**
 * 内容安全审核 - 使用微信官方免费接口
 * 不依赖任何第三方付费内容审核API
 */
exports.main = async (event, context) => {
  const { content, scene = 1 } = event;

  if (!content || typeof content !== 'string') {
    return { success: false, error: '缺少待检查内容' };
  }

  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content,
      version: 2,
      scene,
      openid: cloud.getWXContext().OPENID || ''
    });

    // result 结构: { errCode, errMsg, result: { suggest: 'pass' | 'risky', label } }
    const isPass = result.result && result.result.suggest === 'pass';

    return {
      success: true,
      pass: isPass,
      detail: result.result || result
    };
  } catch (err) {
    console.error('contentCheck error:', err);
    // 审核失败时默认放行，避免影响用户体验
    return {
      success: true,
      pass: true,
      error: err.message,
      fallback: true
    };
  }
};