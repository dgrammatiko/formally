module.exports = {
    launch: {
        headless: process.env.HEADLESS !== 'false',
        slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
        devtools: true
    },
    server: {
        command: 'node_modules/.bin/serve -l 8080',
    },
}
