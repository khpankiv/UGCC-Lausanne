// scripts/render-pages.js
// Статичний рендер Nunjucks із JSON-даних (articles, schedule)
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const glob = require('glob');

// Ініціалізація шаблонів
const env = nunjucks.configure('templates', { autoescape: true });
env.addFilter('truncate', (str, len = 150) => {
  if (!str || typeof str !== 'string') return '';
  return str.length > len ? str.slice(0, len).replace(/\s+\S*$/, '') + '…' : str;
});

// Мови
const languages = [
  { code: '', dir: '.' },
  { code: 'en', dir: 'en' },
  { code: 'fr', dir: 'fr' },
];

// Дані хедера і футера
const headerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../pages/header.json'), 'utf-8'));
const footerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../pages/footer.json'), 'utf-8'));

// ===== Завантаження даних статей і розкладу =====
function loadSections() {
  let articles = [];
  let schedule = [];

  try {
    articles = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/articles.json'), 'utf-8'));
    console.log(`📚 Завантажено статей: ${articles.length}`);
  } catch {
    console.warn('⚠️  Не знайдено data/articles.json');
  }

  try {
    schedule = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/schedule.json'), 'utf-8'));
    console.log(`📅 Завантажено подій розкладу: ${schedule.length}`);
  } catch {
    console.warn('⚠️  Не знайдено data/schedule.json');
  }

  // Групуємо статті за категоріями
  const sections = { uk: { hero: [], news: [], spiritual: [], community: [], schedule } };

  for (const a of articles) {
    const lang = (a.language || 'uk').trim();
    const type = (a.category || '').trim();

    if (!sections[lang]) sections[lang] = { hero: [], news: [], spiritual: [], community: [], schedule };
    if (type && sections[lang][type]) sections[lang][type].push(a);
  }

  return sections;
}

// ===== Основний рендер =====
(async function renderAll() {
  const pagesDir = path.join(__dirname, '../pages');
  const pageJsonFiles = glob.sync(pagesDir.replace(/\\/g, '/') + '/*/page.json');
  console.log('📄 Знайдені сторінки:', pageJsonFiles.map(p => path.relative(path.join(__dirname, '..'), p)));

  const sheetSections = loadSections();

  for (const pageFile of pageJsonFiles) {
    const pageName = path.basename(path.dirname(pageFile));
    const pageData = JSON.parse(fs.readFileSync(pageFile, 'utf-8'));

    for (const lang of languages) {
      const langKey = lang.code || 'uk';
      const langData = pageData[langKey] || {};
      const header = headerData[langKey] || {};
      const footer = footerData[langKey] || {};
      const sections = sheetSections[langKey] || sheetSections.uk;

      let outDir, outPath;
      if (pageName === 'index' && lang.dir === '.') {
        outDir = '..';
        outPath = path.join(__dirname, outDir, 'index.html');
      } else if (pageName === 'index') {
        outDir = path.join('..', lang.dir);
        outPath = path.join(__dirname, outDir, 'index.html');
      } else {
        outDir = lang.dir === '.' ? path.join('..', pageName) : path.join('..', lang.dir, pageName);
        outPath = path.join(__dirname, outDir, 'index.html');
      }

      fs.mkdirSync(path.join(__dirname, outDir), { recursive: true });

      let html;
      try {
        html = nunjucks.render('base.njk', {
          ...langData,
          page: pageName,
          lang: langKey,
          header,
          footer,
          sections
        });
      } catch (e) {
        html = `<!doctype html><meta charset="utf-8"><pre>Render error: ${e.message}</pre>`;
      }

      fs.writeFileSync(outPath, String(html || ''), 'utf-8');
      console.log(`✅ Згенеровано: ${outPath}`);
    }
  }

  console.log('🏁 Рендеринг сторінок завершено успішно.');
})();
