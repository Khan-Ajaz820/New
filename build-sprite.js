const fs = require('fs');
const path = require('path');

// Configuration
const inputDir = './sprite'; // Your emoji directory
const outputFile = './sprite.svg';

// Read all SVG files
const svgFiles = fs.readdirSync(inputDir).filter(file => file.endsWith('.svg'));

console.log(`Found ${svgFiles.length} SVG files`);

// Start building the sprite
let spriteContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
<defs>
`;

// Process each SVG file
svgFiles.forEach((file, index) => {
  const filePath = path.join(inputDir, file);
  const svgContent = fs.readFileSync(filePath, 'utf8');
  
  // Extract the emoji name (without .svg extension)
  const emojiId = path.basename(file, '.svg');
  
  // Parse SVG content to extract inner content
  // Remove <?xml...?>, <svg...>, and </svg> tags but keep inner content
  let innerContent = svgContent
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<svg[^>]*>/g, '')
    .replace(/<\/svg>/g, '')
    .trim();
  
  // Extract viewBox from original SVG if it exists
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 128 128';
  
  // Create symbol element
  spriteContent += `  <symbol id="${emojiId}" viewBox="${viewBox}">
${innerContent}
  </symbol>
`;
  
  // Progress indicator
  if ((index + 1) % 500 === 0) {
    console.log(`Processed ${index + 1} files...`);
  }
});

// Close the sprite
spriteContent += `</defs>
</svg>`;

// Write the sprite file
fs.writeFileSync(outputFile, spriteContent, 'utf8');

console.log(`✅ Sprite created successfully: ${outputFile}`);
console.log(`Total emojis: ${svgFiles.length}`);
console.log(`File size: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)} MB`);

// Generate a usage example HTML
const exampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Emoji Sprite Demo</title>
  <style>
    .emoji {
      width: 64px;
      height: 64px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <!-- Load the sprite (hidden) -->
  <div style="display: none;">
    <!-- Inline the sprite or use object tag -->
  </div>
  
  <!-- Use emojis like this: -->
  <svg class="emoji">
    <use href="sprite.svg#emoji_u1f600"></use>
  </svg>
  
  <svg class="emoji">
    <use href="sprite.svg#emoji_u1f44d"></use>
  </svg>
</body>
</html>`;

fs.writeFileSync('./example.html', exampleHtml);
console.log('📄 Example HTML created: example.html');
