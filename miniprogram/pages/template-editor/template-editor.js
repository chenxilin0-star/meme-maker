const { MEME_TEMPLATES } = require('../../data/templates');

const CANVAS_SIZE = 300; // 逻辑分辨率
const COLOR_LIST = ['#333333', '#000000', '#CC0000', '#FF6600', '#FFD700', '#009900', '#0066CC', '#9900CC', '#FF69B4', '#FFFFFF'];

Page({
  data: {
    templateData: {},
    canvasWidth: 300,
    canvasHeight: 300,
    showTextModal: false,
    editText: '',
    textStyle: {},
    colorList: COLOR_LIST,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    textPos: { x: 150, y: 250 },
    textPosStart: { x: 150, y: 250 }
  },

  ctx: null,
  canvas: null,
  templateImg: null,

  onLoad(options) {
    const tmpl = MEME_TEMPLATES.find(t => t.id === options.id);
    if (!tmpl) {
      wx.showToast({ title: '模板不存在', icon: 'none' });
      wx.navigateBack();
      return;
    }

    this.setData({
      templateData: tmpl,
      editText: tmpl.defaultText,
      textStyle: { ...tmpl.textStyle },
      textPos: { ...tmpl.textPosition },
      canvasWidth: CANVAS_SIZE,
      canvasHeight: CANVAS_SIZE
    });

    this.initCanvas();
  },

  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#memeCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) return;
      this.canvas = res[0].node;
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = CANVAS_SIZE;
      this.canvas.height = CANVAS_SIZE;

      this.loadTemplateImage();
    });
  },

  loadTemplateImage() {
    const { src } = this.data.templateData;
    const img = this.canvas.createImage();
    img.onload = () => {
      this.templateImg = img;
      this.render();
    };
    img.onerror = () => {
      wx.showToast({ title: '图片加载失败', icon: 'none' });
    };
    img.src = src;
  },

  render() {
    if (!this.ctx || !this.templateImg) return;
    const ctx = this.ctx;
    const { textPos, editText, textStyle } = this.data;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.drawImage(this.templateImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 绘制文字
    if (editText) {
      this.drawWrappedText(ctx, editText, textPos.x, textPos.y, textStyle);
    }
  },

  drawWrappedText(ctx, text, cx, cy, style) {
    const { fontSize, color, strokeColor, strokeWidth, maxWidth, lineHeight } = style;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = this.wrapText(ctx, text, maxWidth);
    const totalHeight = lines.length * lineHeight;
    const startY = cy - totalHeight / 2 + lineHeight / 2;

    lines.forEach((line, i) => {
      const y = startY + i * lineHeight;
      if (strokeWidth > 0 && strokeColor !== 'none') {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(line, cx, y);
      }
      ctx.fillStyle = color;
      ctx.fillText(line, cx, y);
    });
  },

  wrapText(ctx, text, maxWidth) {
    const chars = text.split('');
    const lines = [];
    let line = '';
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        lines.push(line);
        line = chars[i];
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    return lines;
  },

  onCanvasTouchStart(e) {
    const { x, y } = e.touches[0];
    const { textPos } = this.data;
    // 检测是否点击文字区域（以文字中心点为圆心，半径 50px 的区域）
    const dx = x - textPos.x;
    const dy = y - textPos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 50) {
      this.setData({
        isDragging: true,
        dragStart: { x, y },
        textPosStart: { ...textPos }
      });
    }
  },

  onCanvasTouchMove(e) {
    if (!this.data.isDragging) return;
    const { x, y } = e.touches[0];
    const { dragStart, textPosStart } = this.data;
    const newX = textPosStart.x + (x - dragStart.x);
    const newY = textPosStart.y + (y - dragStart.y);
    this.setData({
      textPos: { x: Math.max(20, Math.min(280, newX)), y: Math.max(20, Math.min(280, newY)) }
    });
    this.render();
  },

  onCanvasTouchEnd(e) {
    if (this.data.isDragging) {
      this.setData({ isDragging: false });
      return;
    }
    // 如果不是拖拽，检测点击文字区域
    const { x, y } = e.changedTouches[0];
    const { textPos } = this.data;
    const dx = x - textPos.x;
    const dy = y - textPos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 60) {
      this.setData({ showTextModal: true });
    }
  },

  onTextInput(e) {
    this.setData({ editText: e.detail.value });
  },

  onFontSizeChange(e) {
    const ts = { ...this.data.textStyle, fontSize: e.detail.value };
    this.setData({ textStyle: ts });
  },

  onColorTap(e) {
    const ts = { ...this.data.textStyle, color: e.currentTarget.dataset.color };
    this.setData({ textStyle: ts });
  },

  onStrokeToggle(e) {
    const ts = { ...this.data.textStyle };
    if (e.detail.value) {
      ts.strokeWidth = 2;
      ts.strokeColor = '#FFFFFF';
    } else {
      ts.strokeWidth = 0;
      ts.strokeColor = 'none';
    }
    this.setData({ textStyle: ts });
  },

  confirmText() {
    this.setData({ showTextModal: false });
    this.render();
  },

  resetText() {
    const { templateData } = this.data;
    this.setData({
      editText: templateData.defaultText,
      textStyle: { ...templateData.textStyle },
      textPos: { ...templateData.textPosition }
    });
    this.render();
  },

  closeTextModal() {
    this.setData({ showTextModal: false });
  },

  onBack() {
    wx.navigateBack();
  },

  onExport() {
    wx.showLoading({ title: '生成中...' });
    wx.canvasToTempFilePath({
      canvas: this.canvas,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading();
            wx.showToast({ title: '已保存到相册', icon: 'success' });
          },
          fail: (err) => {
            wx.hideLoading();
            if (err.errMsg && err.errMsg.includes('auth')) {
              wx.showModal({
                title: '需要授权',
                content: '请允许保存图片到相册',
                success: (r) => {
                  if (r.confirm) wx.openSetting();
                }
              });
            } else {
              wx.showToast({ title: '保存失败', icon: 'none' });
            }
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '生成失败', icon: 'none' });
      }
    });
  }
});
