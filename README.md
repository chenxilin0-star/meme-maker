# 表情包制作小程序

一个安全合规、完全免费的表情包制作微信小程序，使用原生微信小程序 + 微信云开发构建。

## 核心功能

- ✍️ 静态表情包快速制作（模板 + 文字 + 贴纸）
- 🎨 Canvas 2D 高清绘图引擎（支持拖拽、缩放、旋转）
- 📝 热门网络梗文案推荐
- 💾 一键保存到相册 + 分享
- 🖼️ 我的作品管理

## 技术栈

| 层级 | 技术选择 |
|------|---------|
| 前端框架 | 原生微信小程序 |
| 绘图引擎 | Canvas 2D (type="2d") |
| 云服务 | 微信云开发（云函数 + 云数据库 + 云存储） |
| 内容审核 | 微信官方 msgSecCheck（免费） |

## 安全合规免费方案

### 字体资源
- **阿里巴巴普惠体** - 全球免费正版商用
- **思源黑体** - SIL Open Font License，完全免费商用
- **站酷快乐体** - 设计师社区出品，免费商用

### 素材资源
- **PNGDirs** - 完全免费商用透明PNG
- **Open Doodles** - CC0公共领域，无任何限制
- **unDraw** - MIT许可证，可商用
- **Humaaans** - CC0，可自由商用
- **Iconfont** - 官方素材库免费可商用

### 数据来源
- 热梗文案：内置免费文案库（无需第三方API）
- 内容审核：微信官方 `msgSecCheck` 免费接口
- 不使用任何付费第三方API（天行数据、DeepSeek等）

## 开始使用

### 1. 导入项目
将项目导入微信开发者工具，填写你的 AppID。

### 2. 配置云开发
在 `miniprogram/app.js` 中将 `cloudEnv` 替换为你的云开发环境 ID。

### 3. 初始化云数据库
在微信开发者工具中右键云函数目录，选择「创建并部署：云环境上」。

### 4. 验证
```bash
npm run validate
```

## 项目结构

```
meme-maker/
├── miniprogram/
│   ├── app.js              # 小程序入口
│   ├── app.json            # 全局配置
│   ├── app.wxss            # 全局样式
│   ├── pages/
│   │   ├── index/          # 首页
│   │   ├── material/       # 素材库
│   │   ├── editor/         # 编辑器
│   │   ├── result/         # 结果预览
│   │   └── profile/        # 我的
│   └── utils/
│       ├── api.js            # API封装
│       └── store.js          # 本地存储
├── cloudfunctions/         # 云函数
│   ├── authLogin/
│   ├── getMemeTexts/
│   ├── saveMeme/
│   ├── getUserMemes/
│   └── contentCheck/
├── scripts/
│   └── validate.js       # 验证脚本
├── project.config.json
└── package.json
```

## 合规说明

- 所有使用的素材均为明确免费可商用资源
- 不收集用户隐私信息，仅使用微信公开的 OPENID 标识用户
- 内容审核使用微信官方接口，符合小程序审核规范
- 支持小程序隐私协议和用户协议自动生成

## License

MIT
