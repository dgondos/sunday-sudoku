'use strict';
const {chromium} = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const dir=path.resolve(__dirname,'../qa-output');fs.mkdirSync(dir,{recursive:true});
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium'});
  const page=await browser.newPage({viewport:{width:768,height:928},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:4175/');
  await page.evaluate(()=>document.body.classList.add('no-motion'));
  await page.screenshot({path:path.join(dir,'ipad-portrait.png'),fullPage:true});
  await page.setViewportSize({width:1024,height:672});
  await page.screenshot({path:path.join(dir,'ipad-landscape.png'),fullPage:true});
  await page.locator('#new-button').click();
  await page.screenshot({path:path.join(dir,'difficulty-picker.png'),fullPage:true});
  console.log(JSON.stringify({errors,screenshots:['ipad-portrait.png','ipad-landscape.png','difficulty-picker.png'].map(f=>path.join(dir,f))},null,2));
  await browser.close();
})();
