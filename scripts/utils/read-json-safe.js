// Small utility to read and parse JSON files safely.
// - Strips a potential UTF-8 BOM
// - Returns an empty object on any read/parse error
//
// Usage:
//   const { readJsonSafe } = require('../utils/read-json-safe');
//   const data = readJsonSafe('path/to/file.json');
//
// Note: This mirrors the previous inline implementation from render-pages.js
// to avoid changing behavior across the codebase.
const fs = require('fs');

/**
 * Reads a JSON file and parses it. If anything goes wrong, returns {}.
 * This function is tolerant to UTF-8 BOM at the start of the file.
 * @param {string} p - Filesystem path to a JSON file
 * @returns {any} Parsed JSON or an empty object on failure
 */
function readJsonSafe(p) {
  try {
    const raw = fs.readFileSync(p, 'utf-8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

module.exports = { readJsonSafe };

