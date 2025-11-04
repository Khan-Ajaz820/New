// build-sprite.js
// Combine all optimized SVGs into one <symbol>-based sprite
// Keeps filenames as IDs and removes redundant attributes for max compression.

import fs from "fs";
import path from "path";

const dir = "./sprite"; // your folder with optimized SVGs
let sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n`;

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".svg")) continue;
  const id = path.basename(file, ".svg");

  let content = fs.readFileSync(path.join(dir, file), "utf8");

  // Strip outer <svg> tags and XML headers for smallest output
  content = content
    .replace(/<\?xml.*?\?>/g, "")
    .replace(/<!DOCTYPE.*?>/g, "")
    .replace(/<\/?svg[^>]*>/g, "")
    .trim();

  sprite += `<symbol id="${id}" viewBox="0 0 72 72">${content}</symbol>\n`;
}

sprite += `</svg>`;

fs.writeFileSync("sprite.svg", sprite);
console.log("✅ sprite.svg created successfully!");
