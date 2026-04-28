# 架构变更

## 新增文件
- `miniprogram/pages/template-lib/` - 模板库首页（替代原首页）
- `miniprogram/pages/template-editor/` - 模板改字编辑器
- `miniprogram/data/templates.js` - 模板数据集
- `miniprogram/assets/templates/` - 模板底图

## 修改文件
- `miniprogram/app.json` - 调整页面路由，首页改为 template-lib
- `miniprogram/pages/index/index.js` - 保留作为自由创作入口

## 流程图
```
首页(template-lib)
    ↓ 点击模板
模板编辑器(template-editor)
    ↓ 点击文字/编辑
文字输入弹窗
    ↓ 确认
实时预览
    ↓ 导出
保存到相册
```
