//  Nunjucks render script for static site generation
const fs = require('fs');
const path = require('path');
const https = require('https');

const nunjucks = require('nunjucks');

// Nunjucks
nunjucks.configure('templates', {
  autoescape: true,
});

// Languages of the site

const languages = [
  { code: '', dir: '.' }, // default (uk)
  { code: 'en', dir: 'en' },
  { code: 'fr', dir: 'fr' },
];

// Read header/footer data
const headerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../pages/header.json'), 'utf-8'));
const footerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../pages/footer.json'), 'utf-8'));

// Optionally read data/articles.json and expose as `articles` for templates
let articles = [];
try {
  const articlesPath = path.join(__dirname, '../data/articles.json');
  if (fs.existsSync(articlesPath)) {
    articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  }
} catch (e) {
  console.warn('Failed to load data/articles.json:', e.message);
}

// ==================== LOAD GOOGLE SHEETS DATA ====================
// Secret CSV link from GitHub Actions Secrets (SHEET_CSV_URL)
const SHEET_CSV_URL = process.env.SHEET_CSV_URL;
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

// Pages list from folder pages)
const pagesDir = path.join(__dirname, '../pages');
const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));



// Looking for all json in pages
const glob = require('glob');
// Use forward slashes for glob to work on Windows
const pageJsonFiles = glob.sync(pagesDir.replace(/\\/g, '/') + '/*/page.json');
console.log('Found pages:', pageJsonFiles.map(p => path.relative(path.join(__dirname, '..'), p)));
console.log('Found pages:', pageJsonFiles.map(p => path.relative(path.join(__dirname, '..'), p)));

pageJsonFiles.forEach(pageFile => {
  const pageName = path.basename(path.dirname(pageFile));
  const pageData = JSON.parse(fs.readFileSync(pageFile, 'utf-8'));

  languages.forEach(lang => {
    const langKey = lang.code || 'uk';
    const langData = pageData[langKey] || {};
    const header = headerData[langKey] || {};
    const footer = footerData[langKey] || {};


    // Creating the path for saving
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

    // Creating the directory if it doesn't exist
    fs.mkdirSync(path.join(__dirname, outDir), { recursive: true });

    // Rendering the page
    const html = nunjucks.render('base.njk', {
      ...langData,
      page: pageName,
      lang: langKey,
      header,
      footer,
      articles
    });

    // Writing the file
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`Generated: ${outPath}`);
  });
});

console.log('Page rendering completed successfully.');
