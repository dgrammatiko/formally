// puppeteer_environment.js
const { readFile } = require('fs/promises');
const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');
const NodeEnvironment = require('jest-environment-node');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');


// PUPPETEER_PRODUCT=firefox npm i puppeteer
class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.server = exec('./node_modules/.bin/serve -p 8888', {async:true});
  }

  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = await readFile(path.join(DIR, 'wsEndpoint'), { encoding: 'utf8'});
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    // connect to puppeteer
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
  }

  async teardown() {
    // this.server.kill();
    this.server.kill('SIGINT')
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment