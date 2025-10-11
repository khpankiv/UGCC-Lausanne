const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

nunjucks.configure('templates', { autoescape: true });

const pages = [
  'index',
  'about',
  'contacts',
  'events',
  'gallery',
  'schedule',
  'resources',
  'ukrainian-events'
];
const langs = ['uk', 'en', 'fr'];

langs.forEach(lang => {
  const langDir = path.join(__dirname, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir);
  }
  pages.forEach(pageName => {
    const pageJson = require(`./pages/${pageName}.json`);
    // simple fallback: prefer requested lang, then en, then uk
    const contentForLang = pageJson[lang] || pageJson['en'] || pageJson['uk'];
    if (contentForLang) {
      const context = {
        lang,
        pageName,
        title: contentForLang.title,
        content: contentForLang.content
      };
      const outputFile = path.join(lang, `${pageName}.html`);
      const rendered = nunjucks.render('base.njk', context);
      fs.writeFileSync(path.join(__dirname, outputFile), rendered);
      console.log(`Rendered ${outputFile}`);
    }
  });
});
