const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const TRANSLATE_URL = 'https://libretranslate.com/translate';

const pages = ['about', 'contacts', 'events', 'gallery', 'schedule'];
const pagesDir = path.join(__dirname, 'pages');
const targetLangs = ['en', 'fr']; // Додаємо англійську та французьку

async function translateText(text, target = 'en') {
  const res = await fetch(TRANSLATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      const fs = require('fs');
      const path = require('path');
      const fetch = require('node-fetch');

      const TRANSLATE_URL = 'https://libretranslate.com/translate';

      const pages = ['about', 'contacts', 'events', 'gallery', 'schedule'];
      const pagesDir = path.join(__dirname, 'pages');
      const targetLangs = ['en', 'fr']; // Додаємо англійську та французьку

      async function translateText(text, target = 'en') {
        const res = await fetch(TRANSLATE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            const fs = require('fs');
            const path = require('path');
            const fetch = require('node-fetch');

            const TRANSLATE_URL = 'https://libretranslate.com/translate';

            const pages = ['about', 'contacts', 'events', 'gallery', 'schedule'];
            const pagesDir = path.join(__dirname, 'pages');
            const targetLangs = ['en', 'fr']; // Додаємо англійську та французьку

            async function translateText(text, target = 'en') {
              const res = await fetch(TRANSLATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  q: text,
                  source: 'uk',
                  target,
                  format: 'text'
                })
              });
              const data = await res.json();
              if (data && data.translatedText) {
                return data.translatedText;
              }
              throw new Error('Translation failed');
            }

            async function processPage(pageName) {
              const filePath = path.join(pagesDir, `${pageName}.json`);
              const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              for (const lang of targetLangs) {
                if (!json[lang]) {
                  json[lang] = {};
                  for (const key of Object.keys(json.uk)) {
                    json[lang][key] = await translateText(json.uk[key], lang);
                  }
                  console.log(`Translated ${pageName}.json to ${lang}.`);
                } else {
                  console.log(`${pageName}.json already has ${lang} translation.`);
                }
              }
              fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
            }

            (async () => {
              for (const page of pages) {
                await processPage(page);
              }
            })();
