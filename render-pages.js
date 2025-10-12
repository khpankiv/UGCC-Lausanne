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
  'ukrainian-events',
  'donate',
  'clergy',
  'ministries',
  'news',
  'sacraments'
];
const langs = ['uk', 'en', 'fr'];

// Localized nav labels (used by header.njk)
const navLabels = {
  uk: {
    index: 'Головна',
    about: 'Про нас',
    gallery: 'Галерея',
    schedule: 'Розклад',
    events: 'Події',
    resources: 'Ресурси',
    ukrainianEvents: 'Українські події',
    contacts: 'Контакти'
  },
  en: {
    index: 'Home',
    about: 'About',
    gallery: 'Gallery',
    schedule: 'Schedule',
    events: 'Events',
    resources: 'Resources',
    ukrainianEvents: 'Ukrainian Events',
    contacts: 'Contacts'
  },
  fr: {
    index: 'Accueil',
    about: 'À propos',
    gallery: 'Galerie',
    schedule: 'Horaire',
    events: 'Événements',
    resources: 'Ressources',
    ukrainianEvents: 'Événements ukrainiens',
    contacts: 'Contacts'
  }
};

langs.forEach(lang => {
  const langDir = path.join(__dirname, lang);
  // create folders only for non-uk languages; uk will be served from root
  if (lang !== 'uk' && !fs.existsSync(langDir)) {
    fs.mkdirSync(langDir);
  }
  pages.forEach(pageName => {
    const pageJson = require(`./pages/${pageName}.json`);
    // simple fallback: prefer requested lang, then en, then uk
    const contentForLang = pageJson[lang] || pageJson['en'] || pageJson['uk'];
    if (contentForLang) {
      // try to load events.json (structured items) for use on index page
      let eventsData = {};
      try {
        const ev = require('./pages/events.json');
        eventsData = ev[lang] || ev['en'] || ev['uk'] || {};
      } catch (e) {
        eventsData = {};
      }

      const context = {
        lang,
        pageName,
        title: contentForLang.title,
        content: contentForLang.content,
        navLabels,
        events: eventsData
      };
  const outputFile = lang === 'uk' ? `${pageName}.html` : path.join(lang, `${pageName}.html`);
      let rendered;
      try {
        rendered = nunjucks.render('base.njk', context);
      } catch (err) {
        console.error(`Render error for ${lang}/${pageName}:`, err && err.message ? err.message : err);
        return; // skip this page (inside forEach callback)
      }

      if (typeof rendered !== 'string') {
        console.error(`Rendered output for ${lang}/${pageName} is not a string (type=${typeof rendered}). Skipping write.`);
        return; // skip this page
      }

      const outPath = path.join(__dirname, outputFile);
      fs.writeFileSync(outPath, rendered);
      console.log(`Rendered ${outputFile}`);
    }
  });
});
