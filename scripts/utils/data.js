// Load and group site data (articles + schedule), with translation support.
// This module encapsulates data loading and enrichment to keep the renderer lean.

const fs = require('fs');
const path = require('path');

/**
 * Lazily import the ESM-only translator and cache the module/default export.
 * Falls back to null if the package is missing or cannot be imported.
 */
let translatorModulePromise = null;
async function getTranslatorModule() {
  if (!translatorModulePromise) {
    translatorModulePromise = import('@vitalets/google-translate-api')
      .catch(() => null);
  }
  return translatorModulePromise;
}

// Resolve the actual translate function from various export shapes
async function resolveTranslateFn() {
  const m = await getTranslatorModule();
  if (!m) return null;
  const cand =
    (typeof m === 'function' && m) ||
    (typeof m.default === 'function' && m.default) ||
    (typeof m.translate === 'function' && m.translate) ||
    (m.default && typeof m.default.translate === 'function' && m.default.translate) ||
    null;
  return cand;
}

/**
 * Read a JSON file as text, strip UTF-8 BOM if present, and parse.
 * Throws on IO or parse error, mirroring previous behavior in render-pages.js.
 */
function readJson(p) {
  const raw = fs.readFileSync(p, 'utf-8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

/**
 * Build absolute paths to top-level data files regardless of caller location.
 */
function dataPath(rel) {
  const rootDir = path.join(__dirname, '..', '..');
  return path.join(rootDir, 'data', rel);
}

/**
 * Translate text with caching and resilient fallbacks.
 * - Returns original text on any failure (import/network/rate-limit).
 * - Caches per (text, targetLang) to avoid repeated requests.
 */
function createTranslator() {
  const cache = Object.create(null);
  return async function translateText(text, targetLang) {
    if (!text) return '';
    const key = `${targetLang}::${text}`;
    if (cache[key]) return cache[key];

    const translator = await getTranslator();
    if (!translator) return text; // graceful fallback when import fails

    try {
      const res = await translator(text, { to: targetLang });
      const out = (res && (res.text || res.translation)) || text;
      cache[key] = out;
      return out;
    } catch (_) {
      return text; // network errors, rate limits, etc.
    }
  };
}

/**
 * Load and group data for pages and templates.
 * Keeps logic as in the previous inline version, with clearer comments.
 * Returns a structure: { [lang]: { hero, news, spiritual, community, schedule } }
 */
async function loadSections() {
  // Read domain JSON (BOM-tolerant parsing; failures keep defaults [])
  let articles = [];
  let schedule = [];
  try {
    const a = readJson(dataPath('articles.json'));
    if (Array.isArray(a)) articles = a;
    console.log(`Loaded articles: ${articles.length}`);
  } catch {
    console.warn('Could not read data/articles.json');
  }
  try {
    const s = readJson(dataPath('schedule.json'));
    if (Array.isArray(s)) schedule = s;
    console.log(`Loaded schedule items: ${schedule.length}`);
  } catch {
    console.warn('Could not read data/schedule.json');
  }

  // Target languages to materialize (cards/pages expect these buckets)
  const langs = ['uk', 'en', 'fr'];

  // Skeleton per-language bucket
  const defaultSections = { hero: [], news: [], spiritual: [], community: [], schedule: [] };
  const sections = {};
  const slugCounters = {};

  // Parse semicolon-separated images into array, pass-through arrays
  const splitImages = (val) =>
    val
      ? Array.isArray(val)
        ? val
        : String(val)
            .split(';')
            .map((s) => s.trim())
            .filter(Boolean)
      : [];

  // Build a slug base from title + date (YYYYMMDD-title)
  const slugBase = (title, ts) => {
    const t = typeof title === 'string' ? title.toLowerCase().trim() : '';
    const ascii = encodeURIComponent(t)
      .replace(/%[0-9A-Fa-f]{2}/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const d = ts ? new Date(String(ts).replace(' ', 'T')) : null;
    const datePart = d && !isNaN(d) ? d.toISOString().slice(0, 10).replace(/-/g, '') : '';
    return (datePart || 'post') + (ascii ? '-' + ascii : '');
  };

  // Google Translate wrapper with resolver + disk cache + rate limit.
  const translateFn = await resolveTranslateFn();
  const cache = loadCache();
  const translateText = async (text, targetLang) => {
    if (!text) return null;
    const key = `${targetLang}::${text}`;
    if (cache[key]) return cache[key];
    if (!translateFn) return TL_FALLBACK_ORIGINAL ? text : null;
    let attempt = 0;
    while (attempt < TL_RETRIES) {
      attempt++;
      try {
        await rateLimit();
        const res = await translateFn(text, { to: targetLang });
        const out = (res && (res.text || res.translation)) || null;
        if (out) {
          cache[key] = out;
          saveCache(cache);
          return out;
        }
      } catch (e) {
        // Exponential backoff with jitter on errors (e.g., 429 Too Many Requests)
        const backoff = TL_RATE_MS * Math.pow(2, attempt) + Math.floor(Math.random() * 250);
        await sleep(backoff);
      }
    }
    return TL_FALLBACK_ORIGINAL ? text : null;
  };

  // Articles: enrich with images[], primary image, slug, url; group by language/category
  for (const a of articles) {
    const lang = (a.language || 'uk').trim().toLowerCase();
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

  // Schedule: generate localized copies for each target language
  for (const s of schedule) {
    const baseLang = (s.language || 'uk').trim().toLowerCase();
    for (const lang of langs) {
      if (!sections[lang]) sections[lang] = JSON.parse(JSON.stringify(defaultSections));

      if (lang === baseLang) {
        sections[lang].schedule.push({ ...s, language: lang });
        continue;
      }

      // For non-base languages: only add when we can translate.
      const titleT = await translateText(s.title, lang);
      const detailsT = await translateText(s.details, lang);
      if (titleT || detailsT) {
        sections[lang].schedule.push({
          ...s,
          language: lang,
          title: titleT ?? s.title ?? '',
          details: detailsT ?? s.details ?? '',
        });
      }
    }
  }

  return sections;
}

module.exports = { loadSections };
// ---------------- Translation cache & rate limit ----------------
const cacheDir = path.join(__dirname, '..', '.cache');
const cachePath = path.join(cacheDir, 'translations.json');
function loadCache() {
  try {
    if (fs.existsSync(cachePath)) {
      const raw = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}
function saveCache(obj) {
  try {
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(cachePath, JSON.stringify(obj, null, 2), 'utf-8');
  } catch {}
}
const TL_RATE_MS = Number(process.env.TRANSLATE_RATE_MS || 1200);
const TL_RETRIES = Number(process.env.TRANSLATE_RETRIES || 3);
const TL_FALLBACK_ORIGINAL = /^1|true$/i.test(String(process.env.TRANSLATE_FALLBACK_ORIGINAL || '')); // optional
let lastCallAt = 0;
function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }
async function rateLimit() {
  const now = Date.now();
  const wait = lastCallAt + TL_RATE_MS - now;
  if (wait > 0) await sleep(wait);
  lastCallAt = Date.now();
}
