const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'assets', 'images');

// mapping of old filenames to new safe filenames
const mapping = {
  'unnamed-2.jpg': 'lozanna-1.jpg',
  'unnamed-3.jpg': 'lozanna-2.jpg',
  'unnamed-4.jpg': 'lozanna-3.jpg',
  'unnamed-5.jpg': 'lozanna-4.jpg',
  'WhatsApp Image 2025-04-25 at 13.36.40.jpeg': 'lozanna-5.jpg'
};

Object.keys(mapping).forEach(oldName => {
  const newName = mapping[oldName];
  const oldPath = path.join(imagesDir, oldName);
  const newPath = path.join(imagesDir, newName);

  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${oldName} -> ${newName}`);
    } catch (err) {
      console.error(`Failed to rename ${oldName}:`, err.message);
    }
  } else {
    console.warn(`File not found, skipping: ${oldName}`);
  }
});

console.log('Rename complete.');
