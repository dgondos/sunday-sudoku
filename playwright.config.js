'use strict';
const {defineConfig} = require('@playwright/test');
module.exports = defineConfig({
  testDir:'./tests/browser', timeout:30000, fullyParallel:true,
  use:{baseURL:process.env.BASE_URL || 'http://127.0.0.1:4173', trace:'retain-on-failure', screenshot:'only-on-failure'},
  reporter: [['list']],
  projects:[
    {name:'ipad-chromium',use:{browserName:'chromium',viewport:{width:768,height:928},hasTouch:true,launchOptions:process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}}},
    {name:'ipad-webkit',use:{browserName:'webkit',viewport:{width:768,height:928},hasTouch:true}}
  ],
  webServer: process.env.BASE_URL ? undefined : {command:'node scripts/serve.js',port:4173,reuseExistingServer:!process.env.CI}
});
