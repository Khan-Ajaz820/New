/**
 * build-sprite.js
 * Combines all SVGs from ./emojis → sprite.svg
 * (No re-optimization, just clean + combine)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FOLDER = './sprite';
const OUTPUT_FILE = './sprite.svg';

console.log('🚀 Starting SVG Sprite Builder...');
console.log('📂 Reading from:', INPUT_FOLDER);

// Recursively get all SVGs
function getAllSvgFiles(dir) {
  return fs.readdirSync(dir).flatMap(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) return getAllSvgFiles(fullPath);
    if (file.toLowerCase().endsWith('.svg')) return [fullPath];
    return [];
  });
}

const files = getAllSvgFiles(INPUT_FOLDER);
console.log(`✅ Found ${files.length} SVG files`);

if (files.length === 0) {
  console.error('❌ No SVG files found!');
  process.exit(1);
}

let symbols = [];

for (const filePath of files) {
  const fileName = path.basename(filePath, '.svg');
  const svgData = fs.readFileSync(filePath, 'utf8');

  // Extract the content inside <svg>...</svg>
  const inner = svgData
    .replace(/^[\s\S]*?<svg[^>]*>/i, '') // remove opening <svg>
    .replace(/<\/svg>[\s\S]*$/i, '')     // remove closing </svg>
    .trim();

  // Add <symbol> for each emoji
  symbols.push(`<symbol id="${fileName}" viewBox="0 0 72 72">${inner}</symbol>`);
}

console.log(`🧩 Combining ${symbols.length} SVGs into one sprite...`);

const sprite = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
${symbols.join('\n')}
  </defs>
</svg>`;

fs.writeFileSync(OUTPUT_FILE, sprite, 'utf8');

console.log(`✅ Done! Created ${OUTPUT_FILE} with ${symbols.length} emojis`);
const sizeMB = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);
console.log(`📦 File size: ${sizeMB} MB`);
