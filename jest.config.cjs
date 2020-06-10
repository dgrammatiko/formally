module.exports = {
    preset: "jest-puppeteer",
    globals: {
        URL: "http://localhost:8888"
    },
    testMatch: [
        "**/tests/**/*.test.js"
    ],
    verbose: true
}
