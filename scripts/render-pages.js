// Static site render (Nunjucks) with optional Google Sheet CSV for sections
const fs = require('fs');
const path = require('path');
const https = require('https');
const glob = require('glob');
const nunjucks = require('nunjucks');

const env = nunjucks.configure('templates', { autoescape: true });
env.addFilter('truncate', (str, len = 150) => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= len) return str;
  return str.slice(0, len).replace(/\s+\S*$/, '') + '…';
});

const languages = [
  { code: '', dir: '.' },
  { code: 'en', dir: 'en' },
  { code: 'fr', dir: 'fr' },
];

const headerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../pages/header.json'), 'utf-8'));
const footerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../pages/footer.json'), 'utf-8'));

// ===== CSV helpers =====
const SHEET_CSV_URL = process.env.SHEET_CSV_URL;
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}
function parseCSV(text) {
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  const pushField = () => { row.push(field); field = ''; };
  const pushRow = () => { if (row.length) rows.push(row); row = []; };
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i+1] === '"') { field += '"'; i += 2; continue; }
      if (ch === '"') { inQuotes = false; i++; continue; }
      field += ch; i++; continue;
    } else {
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === ',') { pushField(); i++; continue; }
      if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i+1] === '\n') i++; pushField(); pushRow(); i++; continue; }
      field += ch; i++;
    }
  }
  pushField(); pushRow();
  if (!rows.length) return [];
  const header = rows.shift().map(h => h.trim());
  return rows.filter(r => r.length && r.some(v => v && v.trim() !== '')).map(cols => {
    const obj = {}; header.forEach((h, idx) => obj[h] = (cols[idx] || '').trim()); return obj;
  });
}
async function loadSections() {
  const empty = { hero: [], news: [], spiritual: [], community: [] };
  const out = { uk: { ...empty }, en: { ...empty }, fr: { ...empty } };
  if (!SHEET_CSV_URL) return out;
  try {
    const csv = await fetchCSV(SHEET_CSV_URL);
    const rows = parseCSV(csv);
    rows.forEach(r => {
      const type = (r.type || '').trim();
      const lang = (r.lang || 'uk').trim();
      if (!out[lang] || !out[lang][type]) return;
      out[lang][type].push({ title: r.title || '', subtitle: r.subtitle || '', url: r.url || '#', image: r.image || '', date: r.date || '', text: r.text || '' });
    });
    return out;
  } catch (e) {
    console.warn('CSV load failed:', e.message);
    return out;
  }
}

(async function renderAll(){
  const pagesDir = path.join(__dirname, '../pages');
  const pageJsonFiles = glob.sync(pagesDir.replace(/\\/g, '/') + '/*/page.json');
  console.log('Found pages:', pageJsonFiles.map(p => path.relative(path.join(__dirname, '..'), p)));
  const sheetSections = await loadSections();

  pageJsonFiles.forEach(pageFile => {
    const pageName = path.basename(path.dirname(pageFile));
    const pageData = JSON.parse(fs.readFileSync(pageFile, 'utf-8'));
    languages.forEach(lang => {
      const langKey = lang.code || 'uk';
      const langData = pageData[langKey] || {};
      const header = headerData[langKey] || {};
      const footer = footerData[langKey] || {};
      const sections = sheetSections[langKey] && Object.values(sheetSections[langKey]).some(a=>a && a.length)
        ? sheetSections[langKey]
        : (langData.sections || { hero: (langData.hero||[]), news: [], spiritual: [], community: [] });

      let outDir, outPath;
      if (pageName === 'index' && lang.dir === '.') { outDir = '..'; outPath = path.join(__dirname, outDir, 'index.html'); }
      else if (pageName === 'index') { outDir = path.join('..', lang.dir); outPath = path.join(__dirname, outDir, 'index.html'); }
      else { outDir = lang.dir === '.' ? path.join('..', pageName) : path.join('..', lang.dir, pageName); outPath = path.join(__dirname, outDir, 'index.html'); }

      fs.mkdirSync(path.join(__dirname, outDir), { recursive: true });
      let html;
      try {
        html = nunjucks.render('base.njk', { ...langData, page: pageName, lang: langKey, header, footer, sections });
      } catch (e) {
        html = `<!doctype html><meta charset=\"utf-8\"><pre>Render error: ${e.message}</pre>`;
      }
      fs.writeFileSync(outPath, String(html || ''), 'utf-8');
      console.log(`Generated: ${outPath}`);
    });
  });
  console.log('Page rendering completed successfully.');
})();

