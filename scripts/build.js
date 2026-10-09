'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
let html = read('index.html').replace('<link rel="stylesheet" href="style.css">', () => '<style>\n' + read('style.css') + '\n</style>');
for (const file of ['puzzles.js','engine.js','state.js','app.js']) {
  html = html.replace('<script src="' + file + '"></script>', () => '<script>\n' + read(file).replace(/<\/script/gi,'<\\/script') + '\n</script>');
}
html = html.replace('</body>', '<script>\nif ("serviceWorker" in navigator && window.location.protocol !== "file:") { window.addEventListener("load", function () { navigator.serviceWorker.register("./sw.js").catch(function () { /* Offline caching is optional. */ }); }); }\n</script>\n</body>');
const id = createHash('sha256').update(html).digest('hex').slice(0,12);
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/index.html'),html);
fs.writeFileSync(path.join(root,'dist/sw.js'),read('sw.js').replace('__BUILD_ID__',id));
for (const file of ['icon.svg','apple-touch-icon.png']) fs.copyFileSync(path.join(root,file),path.join(root,'dist',file));
fs.writeFileSync(path.join(root,'dist/.nojekyll'),'');
console.log('Built standalone dist/index.html (' + Buffer.byteLength(html) + ' bytes), cache ' + id);
