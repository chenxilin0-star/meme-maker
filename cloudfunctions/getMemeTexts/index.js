const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 内置热梗文案库（完全免费，无需第三方API）
const BUILTIN_TEXTS = {
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
    { id: 't10', text: '抱歉，是我不配', category: 'emo' },
    { id: 't11', text: '今天也是元气满满的一天', category: 'daily' },
    { id: 't12', text: '再坚持一下就放假了', category: 'work' }
  ]
};

exports.main = async (event, context) => {
  const { type = 'all', category, limit = 20 } = event;

  try {
    // 尝试从数据库获取（如果已配置）
    const textCollection = db.collection('meme_texts');
    const countRes = await textCollection.count();

    if (countRes.total > 0) {
      let query = textCollection;
      if (category) {
        query = query.where({ category });
      }
      const dbRes = await query.limit(limit).get();
      return {
        success: true,
        data: {
          hot: dbRes.data.filter(t => t.hot).sort((a, b) => b.hot - a.hot).slice(0, 10),
          categories: BUILTIN_TEXTS.categories,
          texts: dbRes.data
        }
      };
    }
  } catch (err) {
    // 数据库未配置，返回内置数据
    console.log('DB not ready, using builtin texts');
  }

  // 返回内置免费文案
  let texts = BUILTIN_TEXTS.texts;
  if (category) {
    texts = texts.filter(t => t.category === category);
  }

  return {
    success: true,
    data: {
      hot: BUILTIN_TEXTS.hot,
      categories: BUILTIN_TEXTS.categories,
      texts: texts.slice(0, limit)
    }
  };
};