//playwright.config.js
const {defineConfig} = require('@playwright/test');
module.exports = defineConfig({
  testDir:'./',
  timeout:50000,
  retries: 0,
  reporter: [['list'],['html', {outputFolder: 'playwright-report', open: 'never'}]],
  use:{
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

});