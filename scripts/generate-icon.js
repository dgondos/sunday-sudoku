'use strict';
const path = require('node:path');
const {chromium} = require('playwright');
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {});
  const page = await browser.newPage({viewport:{width:180,height:180},deviceScaleFactor:1});
  await page.goto('file://' + path.resolve(__dirname,'../icon.svg'));
  await page.screenshot({path:path.resolve(__dirname,'../apple-touch-icon.png')});
  await browser.close();
  console.log('Created apple-touch-icon.png');
})();
