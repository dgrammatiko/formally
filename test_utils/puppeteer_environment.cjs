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
    this.server = exec('./node_modules/.bin/serve -p 8888');
    this.server.stdout.on('data', (d) => console.log(d));
    this.server.stderr.on('data', (data) => console.error(`grep stderr: ${data}`));
    this.server.stdout.on('close', (d) => console.log(d));
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
    await super.teardown();
    this.server.kill(); //kill('SIGHUP'); //.stdin.end();
    // this.server.kill('SIGINT');
    // this.server = void 0;
    // this.server.kill('SIGTERM');
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment
