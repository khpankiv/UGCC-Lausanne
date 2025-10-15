// scripts/data/fetchSheet.js
const fs = require('fs');
const https = require('https');
const path = require('path');

/** Завантажує CSV з Google Sheet і зберігає у JSON */
function fetchSheet(csvUrl, outPath) {
  return new Promise((resolve, reject) => {
    https.get(csvUrl, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        const json = csvToJson(data);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
        console.log(`✅ ${outPath} готово (${json.length} рядків)`);
        resolve(json);
      });
    }).on('error', e => reject(e));
  });
}

/** Конвертація CSV → JSON */
function csvToJson(csv) {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(',');
  const out = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const row = {};
    header.forEach((h, idx) => row[h.trim()] = (cols[idx] || '').trim());
    
    // if ampty get from assets/images/article.png
    if (!row.image) {
      row.image = '/assets/images/article.png';
    }

    if (row.categories) {
      row.categories = row.categories.split(/\s*,\s*/);
    }

    out.push(row);
  }
  return out;
}


module.exports = { fetchSheet };
