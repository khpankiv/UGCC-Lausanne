const fs = require('fs');
const https = require('https');
const url = process.env.SHEET_CSV_URL;
if (!url) { console.error('Missing SHEET_CSV_URL'); process.exit(1); }

function csvToJson(csv) {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(',');
  const out = [];
  for (let i=1;i<lines.length;i++){
    const cols = lines[i].split(',');
    const row = {};
    header.forEach((h, idx) => row[h.trim()] = (cols[idx]||'').trim());
    row.categories = row.categories ? row.categories.split(/\s*,\s*/) : [];
    out.push(row);
  }
  return out;
}

https.get(url, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const items = csvToJson(data);
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/articles.json', JSON.stringify(items, null, 2));
    console.log('data/articles.json done:', items.length, 'items');
  });
}).on('error', e => { console.error('Download error:', e); process.exit(1); });
