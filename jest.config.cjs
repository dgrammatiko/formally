module.exports = {
    // preset: "jest-puppeteer",
    globals: {
        URL: "http://localhost:8888"
    },
    testMatch: [
        "**/tests/**/*.test.js"
    ],
    verbose: true,
    // globalSetup: "jest-environment-puppeteer/setup",
    // globalTeardown: "jest-environment-puppeteer/teardown",
    // testEnvironment: "jest-environment-puppeteer"
    globalSetup: './test_utils/setup.cjs',
    globalTeardown: './test_utils/teardown.cjs',
    testEnvironment: './test_utils/puppeteer_environment.cjs',
}


//  --runInBand
