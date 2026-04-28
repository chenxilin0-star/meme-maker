const store = require('../../utils/store');

// 图层类型
const LAYER_TYPES = {
  BACKGROUND: 'background',
  STICKER: 'sticker',
  TEXT: 'text'
};

// 默认模板配置
const DEFAULT_CONFIG = {
  width: 300,
  height: 300,
  bgColor: '#FFFFFF'
};

// 内置贴纸素材 - 使用真实图片
const BUILTIN_STICKERS = [
  { id: 's1', src: '/assets/stickers/joy.png', name: '笑哭' },
  { id: 's2', src: '/assets/stickers/cry.png', name: '哭泣' },
  { id: 's3', src: '/assets/stickers/smirk.png', name: '得意' },
  { id: 's4', src: '/assets/stickers/unamused.png', name: '无语' },
  { id: 's5', src: '/assets/stickers/scream.png', name: '惊讶' },
  { id: 's6', src: '/assets/stickers/heart_eyes.png', name: '喜爱' },
  { id: 's7', src: '/assets/stickers/thumbsup.png', name: '点赞' },
  { id: 's8', src: '/assets/stickers/party.png', name: '庆祝' },
  { id: 's9', src: '/assets/stickers/smiling_imp.png', name: '小恶魔' },
  { id: 's10', src: '/assets/stickers/zany_face.png', name: '调皮' },
  { id: 's11', src: '/assets/stickers/thinking.png', name: '思考' },
  { id: 's12', src: '/assets/stickers/sleeping.png', name: '困了' },
  { id: 's13', src: '/assets/stickers/fire.png', name: '火焰' },
  { id: 's14', src: '/assets/stickers/heart.png', name: '爱心' },
  { id: 's15', src: '/assets/stickers/star.png', name: '星星' },
  { id: 's16', src: '/assets/stickers/smile.png', name: '微笑' },
  { id: 's17', src: '/assets/stickers/doodle_check.svg', name: '对勾' },
  { id: 's18', src: '/assets/stickers/doodle_cross.svg', name: '叉号' },
  { id: 's19', src: '/assets/stickers/doodle_exclamation.svg', name: '惊叹号' },
  { id: 's20', src: '/assets/stickers/icon_heart.svg', name: '心形' },
];

// 内置模板底图 - 使用真实SVG渐变背景
const BUILTIN_TEMPLATES = [
  { id: 't1', name: '落日', src: '/assets/templates/gradient_sunset.svg', type: 'image', desc: '暖色渐变背景' },
  { id: 't2', name: '海洋', src: '/assets/templates/gradient_ocean.svg', type: 'image', desc: '清新海洋渐变' },
  { id: 't3', name: '紫夜', src: '/assets/templates/gradient_purple.svg', type: 'image', desc: '神秘紫色渐变' },
  { id: 't4', name: '桃花', src: '/assets/templates/gradient_peach.svg', type: 'image', desc: '温柔桃花色' },
  { id: 't5', name: '夜空', src: '/assets/templates/gradient_night.svg', type: 'image', desc: '深邃夜空渐变' },
  { id: 't6', name: '森林', src: '/assets/templates/gradient_forest.svg', type: 'image', desc: '自然森林渐变' },
  { id: 't7', name: '梦幻', src: '/assets/templates/gradient_candy.svg', type: 'image', desc: '梦幻粉色渐变' },
  { id: 't8', name: '暗色', src: '/assets/templates/gradient_dark.svg', type: 'image', desc: '酷酷暗色渐变' },
];

// 内置背景色
const BUILTIN_BG_COLORS = [
  '#FFFFFF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
  '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2', '#A8E6CF',
  '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B20', '#333333'
];

Page({
  data: {
    canvasWidth: 300,
    canvasHeight: 300,
    layers: [],
    activeLayerId: null,
    showTextEditor: false,
    showStickerPicker: false,
    showBgPicker: false,
    textInput: '',
    textColor: '#333333',
    textSize: 24,
    stickers: BUILTIN_STICKERS,
    bgColors: BUILTIN_BG_COLORS,
    bgColor: '#FFFFFF',
    showActions: false,
    canUndo: false,
    canRedo: false
  },

  canvas: null,
  ctx: null,
  dpr: 1,
  touchState: null,
  touchStartLayers: null,
  imageCache: new Map(),
  undoStack: [],
  redoStack: [],
  maxHistory: 20,

  onLoad(options) {
    const sysInfo = wx.getWindowInfo();
    const screenWidth = sysInfo.windowWidth;
    const canvasSize = Math.min(screenWidth - 48, 400);

    this.setData({
      canvasWidth: canvasSize,
      canvasHeight: canvasSize
    });

    // 初始化默认图层
    const initialLayers = [];

    // 背景图层
    const bgLayer = {
      id: 'bg_' + Date.now(),
      type: LAYER_TYPES.BACKGROUND,
      x: canvasSize / 2,
      y: canvasSize / 2,
      width: canvasSize,
      height: canvasSize,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: 0,
      bgColor: '#FFFFFF'
    };

    // 如果有传入渐变配置
    if (options.gradient) {
      try {
        bgLayer.gradient = JSON.parse(decodeURIComponent(options.gradient));
        bgLayer.bgColor = null;
      } catch (e) {
        console.warn('Invalid gradient param', e);
      }
    } else if (options.templateSrc) {
      bgLayer.src = decodeURIComponent(options.templateSrc);
      bgLayer.bgColor = null;
    } else if (options.src && options.type === 'template') {
      bgLayer.src = decodeURIComponent(options.src);
      bgLayer.bgColor = null;
    } else if (options.materialId && options.type === 'template') {
      // 从素材库查找模板
      const template = BUILTIN_TEMPLATES.find(t => t.id === options.materialId);
      if (template) {
        if (template.gradient) {
          bgLayer.gradient = template.gradient;
          bgLayer.bgColor = null;
        } else if (template.src) {
          bgLayer.src = template.src;
          bgLayer.bgColor = null;
        }
      }
    }

    initialLayers.push(bgLayer);

    // 如果有传入贴纸
    if (options.stickerSrc) {
      const stickerLayer = this.createStickerLayer(decodeURIComponent(options.stickerSrc));
      stickerLayer.x = canvasSize / 2;
      stickerLayer.y = canvasSize / 2;
      initialLayers.push(stickerLayer);
    } else if (options.src && options.type === 'sticker') {
      const stickerLayer = this.createStickerLayer(decodeURIComponent(options.src));
      stickerLayer.x = canvasSize / 2;
      stickerLayer.y = canvasSize / 2;
      initialLayers.push(stickerLayer);
    } else if (options.materialId && options.type === 'sticker') {
      const sticker = BUILTIN_STICKERS.find(s => s.id === options.materialId);
      if (sticker && sticker.src) {
        const stickerLayer = this.createStickerLayer(sticker.src);
        stickerLayer.x = canvasSize / 2;
        stickerLayer.y = canvasSize / 2;
        initialLayers.push(stickerLayer);
      }
    }

    // 如果有传入文字
    if (options.text) {
      initialLayers.push(this.createTextLayer(decodeURIComponent(options.text), canvasSize / 2, canvasSize / 2));
    }

    this.setData({ layers: initialLayers });

    // 加载草稿
    const draft = store.getDraft();
    if (draft && draft.layers) {
      wx.showModal({
        title: '恢复草稿',
        content: '检测到未完成的表情包，是否恢复？',
        success: (res) => {
          if (res.confirm) {
            this.setData({ layers: draft.layers });
            this.render();
          }
        }
      });
    }
  },

  onReady() {
    this.initCanvas();
  },

  onUnload() {
    // 自动保存草稿
    if (this.data.layers.length > 1) {
      store.saveDraft({ layers: this.data.layers, timestamp: Date.now() });
    }
  },

  // ========== Canvas 初始化 ==========
  async initCanvas() {
    const query = wx.createSelectorQuery();
    const res = await new Promise((resolve) => {
      query.select('#editorCanvas')
        .fields({ node: true, size: true })
        .exec((res) => resolve(res[0]));
    });

    const canvas = res.node;
    const ctx = canvas.getContext('2d');
    const dpr = wx.getWindowInfo().pixelRatio;

    canvas.width = res.width * dpr;
    canvas.height = res.height * dpr;
    canvas.style.width = `${res.width}px`;
    canvas.style.height = `${res.height}px`;
    ctx.scale(dpr, dpr);

    this.canvas = canvas;
    this.ctx = ctx;
    this.dpr = dpr;

    this.render();
  },

  // ========== 图层操作 ==========
  createTextLayer(text, x, y) {
    return {
      id: 'text_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: LAYER_TYPES.TEXT,
      text,
      x,
      y,
      fontSize: 24,
      color: '#333333',
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowBlur: 4,
      align: 'center',
      maxWidth: 200,
      lineHeight: 32,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: this.data.layers.length
    };
  },

  createStickerLayer(src, x, y) {
    return {
      id: 'sticker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: LAYER_TYPES.STICKER,
      src,
      x,
      y,
      width: 60,
      height: 60,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: this.data.layers.length
    };
  },

  // ========== 渲染引擎 ==========
  async render() {
    if (!this.ctx) return;

    const { ctx, canvas, dpr } = this;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    const sorted = [...this.data.layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    for (const layer of sorted) {
      try {
        ctx.save();
        ctx.globalAlpha = layer.opacity ?? 1;
        ctx.translate(layer.x, layer.y);
        ctx.rotate((layer.rotate || 0) * Math.PI / 180);
        ctx.scale((layer.scale || 1), (layer.scale || 1));

        if (layer.type === LAYER_TYPES.BACKGROUND) {
          if (layer.src) {
            const img = await this.getImage(layer.src);
            ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
          } else if (layer.gradient && layer.gradient.length >= 2) {
            const grd = ctx.createLinearGradient(-layer.width / 2, -layer.height / 2, -layer.width / 2, layer.height / 2);
            layer.gradient.forEach((color, idx) => {
              grd.addColorStop(idx / (layer.gradient.length - 1), color);
            });
            ctx.fillStyle = grd;
            ctx.fillRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height);
          } else {
            ctx.fillStyle = layer.bgColor || '#FFFFFF';
            ctx.fillRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height);
          }
        } else if (layer.type === LAYER_TYPES.STICKER) {
          if (layer.src) {
            const img = await this.getImage(layer.src);
            const dw = layer.width || img.width;
            const dh = layer.height || img.height;
            ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
          }
        } else if (layer.type === LAYER_TYPES.TEXT) {
          this.drawStyledText(ctx, layer);
        }

        ctx.restore();
      } catch (err) {
        ctx.restore();
        console.warn('Layer render error:', layer.id, err);
      }
    }

    // 绘制选中框
    const activeLayer = this.data.layers.find(l => l.id === this.data.activeLayerId);
    if (activeLayer && activeLayer.type !== LAYER_TYPES.BACKGROUND) {
      ctx.save();
      ctx.strokeStyle = '#4ECDC4';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.translate(activeLayer.x, activeLayer.y);
      ctx.rotate((activeLayer.rotate || 0) * Math.PI / 180);
      const s = activeLayer.scale || 1;
      let bw, bh;
      if (activeLayer.type === LAYER_TYPES.TEXT) {
        ctx.font = `${activeLayer.fontSize}px sans-serif`;
        const metrics = ctx.measureText(activeLayer.text);
        bw = Math.min(metrics.width, activeLayer.maxWidth || 200) + 20;
        bh = activeLayer.fontSize + 20;
      } else {
        bw = (activeLayer.width || 60) * s;
        bh = (activeLayer.height || 60) * s;
      }
      ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
      ctx.restore();
    }
  },

  drawStyledText(ctx, layer) {
    const {
      text, fontSize, color, align, maxWidth, lineHeight,
      strokeColor, strokeWidth, shadowColor, shadowBlur
    } = layer;

    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';

    const lines = this.breakLines(ctx, text, maxWidth || 200);
    const startY = -(lines.length - 1) * (lineHeight || fontSize * 1.2) / 2;

    lines.forEach((line, i) => {
      const ly = startY + i * (lineHeight || fontSize * 1.2);

      if (shadowColor) {
        ctx.save();
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur || 4;
        ctx.fillStyle = color;
        ctx.fillText(line, 0, ly);
        ctx.restore();
      }

      if (strokeColor && strokeWidth > 0) {
        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(line, 0, ly);
        ctx.restore();
      }

      ctx.fillStyle = color;
      ctx.fillText(line, 0, ly);
    });
  },

  breakLines(ctx, text, maxWidth) {
    const chars = text.split('');
    const lines = [];
    let line = '';
    for (const char of chars) {
      const test = line + char;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = char;
      } else {
        line = test;
      }
    }
    lines.push(line);
    return lines;
  },

  async getImage(src) {
    if (this.imageCache.has(src)) return this.imageCache.get(src);
    return new Promise((resolve, reject) => {
      const img = this.canvas.createImage();
      const timeout = setTimeout(() => {
        reject(new Error('Image load timeout: ' + src));
      }, 5000);
      img.onload = () => {
        clearTimeout(timeout);
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = (err) => {
        clearTimeout(timeout);
        console.warn('Image load failed:', src, err);
        reject(err);
      };
      img.src = src;
    });
  },

  // ========== 触摸事件 ==========
  onTouchStart(e) {
    const touches = e.touches;
    const rect = e.currentTarget.getBoundingClientRect?.() || { left: 0, top: 0 };

    // 命中检测 - 从最上层开始
    const sorted = [...this.data.layers].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    let hitLayer = null;

    for (const layer of sorted) {
      if (layer.type === LAYER_TYPES.BACKGROUND) continue;
      const tx = touches[0].clientX - rect.left;
      const ty = touches[0].clientY - rect.top;
      if (this.hitTest(layer, tx, ty)) {
        hitLayer = layer;
        break;
      }
    }

    if (hitLayer) {
      this.setData({ activeLayerId: hitLayer.id, showActions: true });
      this.touchStartLayers = JSON.stringify(this.data.layers);
      this.touchState = {
        layerId: hitLayer.id,
        startX: hitLayer.x,
        startY: hitLayer.y,
        startScale: hitLayer.scale || 1,
        startRotate: hitLayer.rotate || 0,
        startTouches: touches.map(t => ({ x: t.clientX, y: t.clientY }))
      };
    } else {
      this.setData({ activeLayerId: null, showActions: false });
      this.touchStartLayers = null;
    }
  },

  onTouchMove(e) {
    if (!this.touchState) return;
    e.preventDefault?.();

    const touches = e.touches;
    const state = this.touchState;
    const layers = this.data.layers;
    const layer = layers.find(l => l.id === state.layerId);
    if (!layer) return;

    if (touches.length === 1) {
      const dx = touches[0].clientX - state.startTouches[0].x;
      const dy = touches[0].clientY - state.startTouches[0].y;
      layer.x = state.startX + dx;
      layer.y = state.startY + dy;
    } else if (touches.length >= 2) {
      const p1 = state.startTouches[0];
      const p2 = state.startTouches[1];
      const q1 = { x: touches[0].clientX, y: touches[0].clientY };
      const q2 = { x: touches[1].clientX, y: touches[1].clientY };

      const startDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const currDist = Math.hypot(q2.x - q1.x, q2.y - q1.y);
      const scale = state.startScale * (currDist / (startDist || 1));

      const startAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const currAngle = Math.atan2(q2.y - q1.y, q2.x - q1.x);
      const rotate = state.startRotate + (currAngle - startAngle) * 180 / Math.PI;

      layer.scale = Math.max(0.1, Math.min(scale, 5));
      layer.rotate = rotate;
    }

    this.setData({ layers: [...layers] });
    requestAnimationFrame(() => this.render());
  },

  onTouchEnd() {
    if (this.touchState && this.touchStartLayers) {
      const current = JSON.stringify(this.data.layers);
      if (current !== this.touchStartLayers) {
        this.saveHistory();
      }
    }
    this.touchState = null;
    this.touchStartLayers = null;
  },

  hitTest(layer, tx, ty) {
    const cos = Math.cos(-(layer.rotate || 0) * Math.PI / 180);
    const sin = Math.sin(-(layer.rotate || 0) * Math.PI / 180);
    const dx = tx - layer.x;
    const dy = ty - layer.y;
    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;

    let hw, hh;
    if (layer.type === LAYER_TYPES.TEXT) {
      hw = (layer.maxWidth || 200) / 2;
      hh = 40;
    } else {
      hw = ((layer.width || 60) * (layer.scale || 1)) / 2;
      hh = ((layer.height || 60) * (layer.scale || 1)) / 2;
    }
    return Math.abs(localX) <= hw && Math.abs(localY) <= hh;
  },

  // ========== 工具栏操作 ==========
  onAddText() {
    this.setData({
      showTextEditor: true,
      textInput: '',
      textColor: '#333333',
      textSize: 24
    });
  },

  onTextInput(e) {
    this.setData({ textInput: e.detail.value });
  },

  onTextColorChange(e) {
    this.setData({ textColor: e.currentTarget.dataset.color });
  },

  onTextSizeChange(e) {
    this.setData({ textSize: parseInt(e.detail.value) });
  },

  onConfirmText() {
    const text = this.data.textInput.trim();
    if (!text) {
      wx.showToast({ title: '请输入文字', icon: 'none' });
      return;
    }

    const layer = this.createTextLayer(text, this.data.canvasWidth / 2, this.data.canvasHeight / 2);
    layer.color = this.data.textColor;
    layer.fontSize = this.data.textSize;

    const layers = this.data.layers;
    layers.push(layer);
    this.setData({
      layers,
      showTextEditor: false,
      textInput: '',
      activeLayerId: layer.id,
      showActions: true
    });
    this.saveHistory();
    this.render();
  },

  onCancelText() {
    this.setData({ showTextEditor: false });
  },

  onAddSticker() {
    this.setData({ showStickerPicker: true });
  },

  onStickerSelect(e) {
    const sticker = e.currentTarget.dataset.item;
    const layer = this.createStickerLayer(sticker.src, this.data.canvasWidth / 2, this.data.canvasHeight / 2);
    const layers = [...this.data.layers, layer];
    this.setData({
      layers,
      showStickerPicker: false,
      selectedLayerId: layer.id,
      showActions: true
    });
    this.saveHistory();
    this.render();
  },

  onCloseStickerPicker() {
    this.setData({ showStickerPicker: false });
  },

  onChangeBg() {
    this.setData({ showBgPicker: true });
  },

  onBgColorSelect(e) {
    const color = e.currentTarget.dataset.color;
    const layers = this.data.layers.map(l => {
      if (l.type === LAYER_TYPES.BACKGROUND) {
        return { ...l, bgColor: color, gradient: null, src: null };
      }
      return l;
    });
    this.setData({ layers, bgColor: color, showBgPicker: false });
    this.saveHistory();
    this.render();
  },

  onCloseBgPicker() {
    this.setData({ showBgPicker: false });
  },

  // ========== 选中图层操作 ==========
  onDeleteLayer() {
    const id = this.data.activeLayerId;
    if (!id) return;
    const layers = this.data.layers.filter(l => l.id !== id);
    this.setData({ layers, activeLayerId: null, showActions: false });
    this.saveHistory();
    this.render();
  },

  onMoveUp() {
    const id = this.data.activeLayerId;
    if (!id) return;
    const layers = this.data.layers.map(l => {
      if (l.id === id) return { ...l, zIndex: (l.zIndex || 0) + 1 };
      return l;
    });
    this.setData({ layers });
    this.saveHistory();
    this.render();
  },

  onMoveDown() {
    const id = this.data.activeLayerId;
    if (!id) return;
    const layers = this.data.layers.map(l => {
      if (l.id === id) return { ...l, zIndex: Math.max(0, (l.zIndex || 0) - 1) };
      return l;
    });
    this.setData({ layers });
    this.saveHistory();
    this.render();
  },

  // ========== 撤销/重做 ==========
  saveHistory() {
    const state = JSON.stringify(this.data.layers);
    // 避免连续保存相同状态
    if (this.undoStack.length > 0) {
      const last = this.undoStack[this.undoStack.length - 1];
      if (last === state) return;
    }
    this.undoStack.push(state);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.setData({ canUndo: this.undoStack.length > 0, canRedo: false });
  },

  onUndo() {
    if (this.undoStack.length === 0) return;
    const current = JSON.stringify(this.data.layers);
    this.redoStack.push(current);
    const prev = this.undoStack.pop();
    const layers = JSON.parse(prev);
    this.setData({ layers, activeLayerId: null, showActions: false, canUndo: this.undoStack.length > 0, canRedo: this.redoStack.length > 0 });
    this.render();
  },

  onRedo() {
    if (this.redoStack.length === 0) return;
    const current = JSON.stringify(this.data.layers);
    this.undoStack.push(current);
    const next = this.redoStack.pop();
    const layers = JSON.parse(next);
    this.setData({ layers, activeLayerId: null, showActions: false, canUndo: this.undoStack.length > 0, canRedo: this.redoStack.length > 0 });
    this.render();
  },

  // ========== 导出 ==========
  async onExport() {
    wx.showLoading({ title: '生成中...' });

    try {
      // 渲染到离屏画布以获得更高清图片
      const exportSize = 1200;
      const filePath = await this.exportHighQuality(exportSize);

      wx.hideLoading();

      wx.navigateTo({
        url: `/pages/result/result?path=${encodeURIComponent(filePath)}`
      });

      // 保存到本地
      store.saveMeme({
        path: filePath,
        layers: this.data.layers,
        createTime: new Date().toISOString()
      });
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '导出失败', icon: 'none' });
      console.error('Export error:', err);
    }
  },

  async exportHighQuality(exportSize = 1200) {
    const { canvas, dpr } = this;
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;
    const ratio = cssWidth / cssHeight;

    let destWidth, destHeight;
    if (ratio >= 1) {
      destHeight = exportSize;
      destWidth = Math.round(exportSize * ratio);
    } else {
      destWidth = exportSize;
      destHeight = Math.round(exportSize / ratio);
    }

    const LIMIT = 4096;
    const maxSide = Math.max(destWidth, destHeight);
    const safeScale = maxSide > LIMIT ? LIMIT / maxSide : 1;

    const res = await wx.canvasToTempFilePath({
      canvas,
      x: 0, y: 0,
      width: cssWidth,
      height: cssHeight,
      destWidth: Math.round(destWidth * safeScale),
      destHeight: Math.round(destHeight * safeScale),
      fileType: 'png',
      quality: 1
    });

    return res.tempFilePath;
  },

  // ========== 分享 ==========
  onShareAppMessage() {
    return {
      title: '我刚制作了一个表情包，快来看看！',
      path: '/pages/index/index'
    };
  }
});
