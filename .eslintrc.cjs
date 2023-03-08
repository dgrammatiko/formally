module.exports = {
  env: {
    es6: true,
    node: false,
    mocha: true
  },
  globals: {
    alert: true,
    document: true,
    HTMLElement: true,
    window: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  }
};
