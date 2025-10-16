// Nunjucks static-site renderer (reads config.json and templates)
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const glob = require('glob');

// Nunjucks environment
const env = nunjucks.configure('templates', { autoescape: true });

// Helper to parse dates found in data files
function parseToDate(inputDate, inputTime) {
  if (!inputDate && !inputTime) return null;
  let str = '';
  if (typeof inputDate === 'string') str = inputDate.trim();
  if (!str && inputTime) str = String(inputTime).trim();
  if (inputDate && inputTime && !/\s/.test(str)) str = `${inputDate} ${inputTime}`;
  if (!str) return null;
  const normalized = str.replace(' ', 'T');
  const d = new Date(normalized);
  return isNaN(d) ? null : d;
}

// Filters used by templates
env.addFilter('truncate', (str, len = 150) => {
  if (!str || typeof str !== 'string') return '';
  return str.length > len ? str.slice(0, len).replace(/\s+\S*$/, '') + ':' : str;
});

env.addFilter('format_date', (value, lang = 'uk') => {
  const d = parseToDate(value);
  if (!d) return '';
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-GB' : 'uk-UA';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
});

env.addFilter('sort_by_time', (arr) => {
  if (!Array.isArray(arr)) return [];
  const getTime = (item) => {
    const d = parseToDate(item?.timestamp || item?.date, item?.time);
    return d ? d.getTime() : Number.POSITIVE_INFINITY;
  };
  return arr.slice().sort((a, b) => getTime(a) - getTime(b));
});

env.addFilter('take', (arr, start = 0, count) => {
  if (!Array.isArray(arr)) return [];
  const s = Number.isFinite(start) ? start : 0;
  if (Number.isFinite(count)) return arr.slice(s, s + Number(count));
  return arr.slice(s);
});

// Extra helpers used by schedule/cards templates
env.addFilter('substr', (str, start, len) => {
  const s = String(str ?? '');
  const a = Number(start) || 0;
  if (len === undefined) return s.slice(a);
  const l = Number(len);
  return Number.isFinite(l) ? s.slice(a, a + l) : s.slice(a);
});
env.addFilter('int', (value) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
});
env.addFilter('monthname', (m, lang = 'uk') => {
  const n = (() => {
    if (typeof m === 'string') {
      const mm = m.trim();
      if (/^\d+$/.test(mm)) return parseInt(mm, 10);
    }
    return Number(m);
  })();
  const idx = (n > 0 ? n - 1 : 0) | 0;
  const uk = ['січ', 'лют', 'бер', 'кві', 'трав', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
  const en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fr = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const map = lang === 'fr' ? fr : lang === 'en' ? en : uk;
  return map[(idx >= 0 && idx < 12) ? idx : 0];
});
env.addFilter('enc', (s) => encodeURIComponent(String(s ?? '')));

// Languages to render
const languages = [
  { code: '', dir: '.' },
  { code: 'en', dir: 'en' },
  { code: 'fr', dir: 'fr' }
];

// Paths
const pagesDir = path.join(__dirname, '../pages');
const configPath = path.join(pagesDir, 'config.json');
const headerPath = path.join(pagesDir, 'header.json');
const footerPath = path.join(pagesDir, 'footer.json');

const globalConfig = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  : {};
const headerData = fs.existsSync(headerPath)
  ? JSON.parse(fs.readFileSync(headerPath, 'utf-8'))
  : {};
const footerData = fs.existsSync(footerPath)
  ? JSON.parse(fs.readFileSync(footerPath, 'utf-8'))
  : {};

// Load and group data
function loadSections() {
  let articles = [];
  let schedule = [];
  try {
    articles = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/articles.json'), 'utf-8'));
    console.log(`Loaded articles: ${articles.length}`);
  } catch {
    console.warn('Could not read data/articles.json');
  }
  try {
    schedule = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/schedule.json'), 'utf-8'));
    console.log(`Loaded schedule items: ${schedule.length}`);
  } catch {
    console.warn('Could not read data/schedule.json');
  }

  const sections = {};
  const defaultSections = { hero: [], news: [], spiritual: [], community: [], schedule: [] };

  // Enrich articles with images[], primary image, slug and url
  const slugCounters = {};
  const splitImages = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return String(val)
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
  };
  const slugBase = (title, ts) => {
    const t = typeof title === 'string' ? title.toLowerCase().trim() : '';
    const ascii = encodeURIComponent(t).replace(/%[0-9A-Fa-f]{2}/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const d = ts ? new Date(String(ts).replace(' ', 'T')) : null;
    const datePart = d && !isNaN(d) ? d.toISOString().slice(0, 10).replace(/-/g, '') : '';
    return (datePart || 'post') + (ascii ? '-' + ascii : '');
  };
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const lang = (a.language || 'uk').trim();
    const cat = (a.category || '').trim();
    if (!sections[lang]) sections[lang] = JSON.parse(JSON.stringify(defaultSections));
    if (!cat || !sections[lang][cat]) continue;
    const images = splitImages(a.image || a.images);
    const image = images[0] || a.image || '';
    const base = slugBase(a.title, a.timestamp || a.date);
    const key = `${lang}:${cat}:${base}`;
    slugCounters[key] = (slugCounters[key] || 0) + 1;
    const slug = slugCounters[key] > 1 ? `${base}-${slugCounters[key]}` : base;
    const langDir = lang === 'uk' ? '' : `/${lang}`;
    const url = `${langDir}/${cat}/${slug}/`;
    sections[lang][cat].push({ ...a, images, image, slug, url });
  }
  for (const s of schedule) {
    const lang = (s.language || 'uk').trim();
    if (!sections[lang]) sections[lang] = JSON.parse(JSON.stringify(defaultSections));
    sections[lang].schedule.push(s);
  }
  return sections;
}

// Render all pages
(async function renderAll() {
  const pageJsonFiles = glob.sync(pagesDir.replace(/\\/g, '/') + '/*/page.json');
  console.log('Found pages:', pageJsonFiles.map(p => path.relative(path.join(__dirname, '..'), p)));

  const sheetSections = loadSections();

  for (const pageFile of pageJsonFiles) {
    const pageName = path.basename(path.dirname(pageFile));
    const rawPageData = JSON.parse(fs.readFileSync(pageFile, 'utf-8'));
    const pageCommon = rawPageData.common || {};

    for (const lang of languages) {
      const langKey = lang.code || globalConfig.default_lang || 'uk';
      const configCommon = globalConfig.common || {};
      const configLang = globalConfig[langKey] || {};
      const pageLang = rawPageData[langKey] || {};
      const header = headerData[langKey] || {};
      const footer = footerData[langKey] || {};
      const sections = sheetSections[langKey] || sheetSections.uk || {};

      const pageData = {
        ...configCommon,
        ...configLang,
        ...pageCommon,
        ...pageLang,
        lang: langKey,
        page: pageName,
        header,
        footer,
        sections
      };

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

      try {
        const html = nunjucks.render('base.njk', pageData);
        fs.writeFileSync(outPath, html, 'utf-8');
        console.log(`Rendered: ${outPath}`);
      } catch (e) {
        console.error(`Render error for ${pageName} (${langKey}):`, e.message);
      }
    }
  }

  // After rendering static pages, render per-article detail pages
  const enriched = loadSections();
  for (const lang of languages) {
    const langKey = lang.code || globalConfig.default_lang || 'uk';
    const configCommon = globalConfig.common || {};
    const configLang = globalConfig[langKey] || {};
    const header = headerData[langKey] || {};
    const footer = footerData[langKey] || {};
    const cats = ['news', 'spiritual', 'community'];
    for (const cat of cats) {
      const list = (enriched[langKey] && enriched[langKey][cat]) || [];
      for (const item of list) {
        const pageData = {
          ...configCommon,
          ...configLang,
          lang: langKey,
          page: 'article',
          header,
          footer,
          article: item,
          category: cat
        };
        const outDir = lang.dir === '.' ? path.join('..', cat, item.slug) : path.join('..', lang.dir, cat, item.slug);
        const outPath = path.join(__dirname, outDir, 'index.html');
        fs.mkdirSync(path.join(__dirname, outDir), { recursive: true });
        try {
          const html = nunjucks.render('base.njk', pageData);
          fs.writeFileSync(outPath, html, 'utf-8');
          console.log(`Rendered article: ${outPath}`);
        } catch (e) {
          console.error(`Render error for article ${item.slug} (${langKey}):`, e.message);
        }
      }
    }
  }

  console.log('Done rendering pages.');
})();
