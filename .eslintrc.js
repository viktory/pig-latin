module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "comma-dangle": ["error", {
      "functions": "never"
    }],
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "class-methods-use-this": 0,
    "max-len": ["error", { "code": 120 }],
    "import/extensions": [
      "error",
      "never",
    ],
    'import/no-unresolved': [0],
    "semi": "off",
    "@typescript-eslint/semi": ["error"]
  },
};
