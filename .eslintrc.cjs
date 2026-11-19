module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  plugins: ['react-hooks'],
  extends: [
    'eslint:recommended',
  ],
  ignorePatterns: ['dist', 'build', 'node_modules', 'coverage', '*.config.*', 'vite.config.*'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-empty': 'warn',
    'no-useless-escape': 'off',
    'no-extra-semi': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react-hooks'],
      extends: ['eslint:recommended'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
        'no-empty': 'warn',
      },
    },
  ],
};
