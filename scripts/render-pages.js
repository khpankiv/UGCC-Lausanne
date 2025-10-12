// Скрипт для генерації HTML-сторінок із шаблонів Nunjucks
const fs = require('fs');
const path = require('path');

const nunjucks = require('nunjucks');

// Налаштування Nunjucks
nunjucks.configure('templates', {
  autoescape: true,
});

// Мови сайту

const languages = [
  { code: '', dir: '.' }, // default (uk)
  { code: 'en', dir: 'en' },
  { code: 'fr', dir: 'fr' },
];

// Читаємо дані для header/footer
const headerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../pages/header.json'), 'utf-8'));
const footerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../pages/footer.json'), 'utf-8'));

// Список сторінок (беремо з папки pages)
const pagesDir = path.join(__dirname, '../pages');
const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));



// Шукаємо всі page.json у підпапках pages
const glob = require('glob');
const pageJsonFiles = glob.sync(path.join(pagesDir, '*/page.json'));

pageJsonFiles.forEach(pageFile => {
  const pageName = path.basename(path.dirname(pageFile));
  const pageData = JSON.parse(fs.readFileSync(pageFile, 'utf-8'));

  languages.forEach(lang => {
    const langKey = lang.code || 'uk';
    const langData = pageData[langKey] || {};
    const header = headerData[langKey] || {};
    const footer = footerData[langKey] || {};


    // Визначаємо шлях для збереження
    let outDir, outPath;
    if (pageName === 'index' && lang.dir === '.') {
      // Головна сторінка українською — у корені
      outDir = '..';
      outPath = path.join(__dirname, outDir, 'index.html');
    } else if (pageName === 'index') {
      // Головна сторінка іншою мовою — у відповідній папці
      outDir = path.join('..', lang.dir);
      outPath = path.join(__dirname, outDir, 'index.html');
    } else {
      // Інші сторінки — у своїх папках
      outDir = lang.dir === '.' ? path.join('..', pageName) : path.join('..', lang.dir, pageName);
      outPath = path.join(__dirname, outDir, 'index.html');
    }

    // Створюємо папку, якщо її немає
    fs.mkdirSync(path.join(__dirname, outDir), { recursive: true });

    // Рендеримо сторінку
    const html = nunjucks.render('base.njk', {
      ...langData,
      page: pageName,
      lang: langKey,
      header,
      footer
    });

    // Записуємо файл
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`Generated: ${outPath}`);
  });
});

console.log('Генерація сторінок завершена.');
