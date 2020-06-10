//   const configPath = process.env.JEST_PUPPETEER_CONFIG || 'jest-puppeteer.config.js';
module.exports = {
    launch: {
        headless: false, // process.env.HEADLESS !== 'false',
        slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
        devtools: true
    },
    server: {
        command: 'node_modules/.bin/serve -l 8888',
        port: 8888,
        // usedPortAction: 'kill',
        launchTimeout: 50000,
        debug: true,
    },
}
