module.exports = {
    // globalSetup: './tests/setup.js',
    // globalTeardown: './tests/teardown.js',
    // testEnvironment: './tests/puppeteer_environment.js',
    preset: "jest-puppeteer",
    globals: {
        URL: "http://localhost:8080"
    },
    testMatch: [
        "**/tests/**/*.test.js"
    ],
    verbose: true
}
