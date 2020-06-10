module.exports = {
    preset: "jest-puppeteer",
    globals: {
        URL: "http://localhost:8080"
    },
    testMatch: [
        "**/tests/**/*.test.js"
    ],
    verbose: true
}
