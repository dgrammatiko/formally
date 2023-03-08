// setup.js
const os = require('os');
const path = require('path');
const { mkdir, writeFile } = require('fs/promises');
const puppeteer = require('puppeteer');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async () => {
  const browser = await puppeteer.launch({
        dumpio: true,
        headless: true, //process.env.HEADLESS !== 'false',
        slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
        devtools: false,
        // product: 'firefox',    // "postinstall": "PUPPETEER_PRODUCT=firefox npm i puppeteer"
        // defaultViewport: {width: 1920, height: 1080},
        defaultViewport: null,
        args: [
          '--no-sandbox',
          // '--single-process',
          // '--no-zygote',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--no-first-run',
          `--window-size=1280,800`,
          '--window-position=0,0',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-skip-list',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--hide-scrollbars',
          '--disable-notifications',
          '--disable-extensions',
          '--force-color-profile=srgb',
          '--mute-audio',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-component-extensions-with-background-pages',
          '--disable-features=TranslateUI,BlinkGenPropertyTrees,IsolateOrigins,site-per-process',
          '--disable-ipc-flooding-protection',
          '--disable-renderer-backgrounding',
          '--enable-features=NetworkService,NetworkServiceInProcess',
        ]
    });
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  global.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, {recursive: true});
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint(), {encoding: 'utf8'});
};
