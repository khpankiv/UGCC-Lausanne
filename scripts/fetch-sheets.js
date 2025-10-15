// scripts/fetch-sheets.js
const { fetchSheet } = require('./data/fetchSheet');

// Two tabs: articles and anounces
const sheets = [
  { url: process.env.ARTICLES_CSV_URL, out: 'data/articles.json' },
  { url: process.env.SCHEDULE_CSV_URL, out: 'data/schedule.json' }
];

(async () => {
  for (const s of sheets) {
    if (!s.url) {
      console.warn(`⚠️ Missed: ${s.out} (no URL)`);
      continue;
    }
    await fetchSheet(s.url, s.out);
  }
  console.log('✅ All tabs updated');
})();
