const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FOLDER = './emojis';  // Folder containing your 3500 SVG files
const OUTPUT_FILE = './sprite.svg'; // Output sprite file

console.log('🚀 Starting SVG Sprite Builder...\n');

// Read all SVG files from the input folder
const files = fs.readdirSync(INPUT_FOLDER).filter(file => file.endsWith('.svg'));

console.log(`📁 Found ${files.length} SVG files in ${INPUT_FOLDER}\n`);

if (files.length === 0) {
  console.error('❌ No SVG files found! Make sure your emojis are in the correct folder.');
  process.exit(1);
}

// Start building the sprite
let spriteContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
spriteContent += '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n';
spriteContent += '<defs>\n';

let processedCount = 0;
let errorCount = 0;

// Process each SVG file
files.forEach((file, index) => {
  try {
    const filePath = path.join(INPUT_FOLDER, file);
    const svgContent = fs.readFileSync(filePath, 'utf-8');
    
    // Extract the filename without extension to use as ID
    const id = path.basename(file, '.svg');
    
    // Parse the SVG content
    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
    
    // Extract the inner content (everything between <svg> tags)
    let innerContent = svgContent
      .replace(/<\?xml[^>]*\?>/g, '')
      .replace(/<svg[^>]*>/gi, '')
      .replace(/<\/svg>/gi, '')
      .trim();
    
    // Remove any existing defs, metadata, or title tags if present
    innerContent = innerContent
      .replace(/<defs>[\s\S]*?<\/defs>/gi, '')
      .replace(/<metadata>[\s\S]*?<\/metadata>/gi, '')
      .replace(/<title>[\s\S]*?<\/title>/gi, '');
    
    // Create symbol with the filename as ID
    spriteContent += `  <symbol id="${id}" viewBox="${viewBox}">\n`;
    spriteContent += `    ${innerContent}\n`;
    spriteContent += `  </symbol>\n`;
    
    processedCount++;
    
    // Progress indicator
    if ((index + 1) % 100 === 0) {
      console.log(`⏳ Processed ${index + 1}/${files.length} files...`);
    }
  } catch (error) {
    errorCount++;
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

// Close the sprite SVG
spriteContent += '</defs>\n';
spriteContent += '</svg>';

// Write the output file
fs.writeFileSync(OUTPUT_FILE, spriteContent, 'utf-8');

const fileSize = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);

console.log('\n✅ Sprite creation complete!');
console.log(`📊 Statistics:`);
console.log(`   - Total files: ${files.length}`);
console.log(`   - Successfully processed: ${processedCount}`);
console.log(`   - Errors: ${errorCount}`);
console.log(`   - Output file: ${OUTPUT_FILE}`);
console.log(`   - File size: ${fileSize} MB`);
console.log('\n🎉 Your sprite.svg is ready to use!\n');
