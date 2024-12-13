// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const path = require('path');

// eslint-disable-next-line no-undef
const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));
// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'eslint-plugin-prettier', 'import', 'simple-import-sort'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'no-tabs': 0,
    'linebreak-style': 0,
    quotes: 0,
    semi: 0,
    camelcase: 0,
    'no-invalid-this': 0,
    'object-curly-spacing': 0,
    'no-unused-expressions': 0,
    'no-non-null-assertion': 0,
    'valid-typeof': 0,
    'default-param-last': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    'react/no-unescaped-entities': 0,
    'import/no-duplicates': 0,
    'react/react-in-jsx-scope': 'off',
    'import/order': [
      1,
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    // 'simple-import-sort/imports': 'error',
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '18.2.0',
    },
  },
};
