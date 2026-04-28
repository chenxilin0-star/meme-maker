/**
 * 项目验证脚本
 * 确保项目结构完整、语法正确
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let errors = 0;
let warnings = 0;

function checkFile(filePath, required = true) {
  const fullPath = path.join(ROOT, filePath);
  if (fs.existsSync(fullPath)) {
    return true;
  }
  if (required) {
    console.error(`❌ 缺失必要文件: ${filePath}`);
    errors++;
  } else {
    console.warn(`⚠️ 缺失文件: ${filePath}`);
    warnings++;
  }
  return false;
}

function checkDir(dirPath) {
  const fullPath = path.join(ROOT, dirPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    return true;
  }
  console.error(`❌ 缺失目录: ${dirPath}`);
  errors++;
  return false;
}

function checkJson(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return;
  try {
    JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    console.log(`✅ JSON 格式正确: ${filePath}`);
  } catch (e) {
    console.error(`❌ JSON 解析失败: ${filePath} - ${e.message}`);
    errors++;
  }
}

function checkJs(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return;
  try {
    require('child_process').execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
    console.log(`✅ JS 语法正确: ${filePath}`);
  } catch (e) {
    console.error(`❌ JS 语法错误: ${filePath}`);
    errors++;
  }
}

console.log('🔍 开始验证表情包制作小程序\n');

// 检查根目录结构
checkFile('project.config.json');
checkFile('package.json');
checkFile('README.md', false);

// 检查小程序核心文件
checkFile('miniprogram/app.js');
checkFile('miniprogram/app.json');
checkFile('miniprogram/app.wxss');
checkFile('miniprogram/sitemap.json');

// 检查页面
const pages = ['index', 'material', 'editor', 'result', 'profile'];
pages.forEach(page => {
  const base = `miniprogram/pages/${page}/${page}`;
  checkFile(`${base}.js`);
  checkFile(`${base}.wxml`);
  checkFile(`${base}.wxss`);
  checkFile(`${base}.json`);
});

// 检查工具函数
checkFile('miniprogram/utils/api.js');
checkFile('miniprogram/utils/store.js');

// 检查云函数
const cloudFunctions = ['authLogin', 'getMemeTexts', 'saveMeme', 'getUserMemes', 'contentCheck'];
cloudFunctions.forEach(cf => {
  checkFile(`cloudfunctions/${cf}/index.js`);
  checkFile(`cloudfunctions/${cf}/package.json`);
});

// 语法检查
console.log('\n🔧 语法检查:');
checkJson('project.config.json');
checkJson('miniprogram/app.json');
checkJson('miniprogram/sitemap.json');
pages.forEach(page => {
  checkJson(`miniprogram/pages/${page}/${page}.json`);
});

// JS 检查
checkJs('scripts/validate.js');

console.log('\n' + '='.repeat(40));
if (errors === 0) {
  console.log(`✅ 验证通过！警告数: ${warnings}`);
  process.exit(0);
} else {
  console.log(`❌ 验证失败，错误数: ${errors}，警告数: ${warnings}`);
  process.exit(1);
}
