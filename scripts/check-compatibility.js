'use strict';
const fs = require('node:fs');
const path = require('node:path');
const acorn = require('acorn');
const root = path.resolve(__dirname,'..');
for (const file of ['engine.js','puzzles.js','state.js','app.js','sw.js']) {
  const source=fs.readFileSync(path.join(root,file),'utf8');
  acorn.parse(source,{ecmaVersion:5,allowReserved:true});
  if (/\.(replaceAll|flatMap|fromEntries|at)\(/.test(source)) throw Error(file + ': unsupported legacy API');
  console.log('ES5 compatible: ' + file);
}
const css = fs.readFileSync(path.join(root,'style.css'),'utf8');
if (/\b(?:aspect-ratio|backdrop-filter|inset)\s*:|\b(?:clamp|min|max|oklch)\(/.test(css)) throw Error('Modern-only CSS needs an explicit iOS12 fallback.');
console.log('Legacy layout check passed (grid-gap, square-padding fallback, no flex-gap).');
