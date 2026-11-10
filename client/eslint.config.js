// client/eslint.config.js
// Flat config for ESLint 9+ (matches Vite 5+ projects).
// SRS refs: NFR-MAINT-001 (modular code), NFR-MAINT-006 (consistent style).
// Pairs with client/.prettierrc.

import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      '*.config.js',
      'public/**',
      '.vite',
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // React + Hooks + a11y + imports
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        __APP_NAME__: 'readonly',
        __APP_VERSION__: 'readonly',
        __DEV__: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        alias: {
          map: [
            ['@', './src'],
            ['@app', './src/app'],
            ['@pages', './src/pages'],
            ['@modules', './src/modules'],
            ['@layouts', './src/layouts'],
            ['@components', './src/shared/components'],
            ['@hooks', './src/shared/hooks'],
            ['@services', './src/shared/services'],
            ['@utils', './src/shared/utils'],
            ['@constants', './src/shared/constants'],
            ['@styles', './src/shared/styles'],
            ['@store', './src/shared/store'],
            ['@i18n', './src/i18n'],
            ['@assets', './public'],
          ],
          extensions: ['.js', '.jsx', '.json'],
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      // ─── React ───
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off', // using TS/JSDoc where needed
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': ['warn', { allowReferrer: true }],
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': [
        'off', // let Prettier/organization decide
      ],
      'react/no-array-index-key': 'warn',

      // ─── Hooks ───
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ─── React Refresh ───
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ─── A11y (NFR-ACCESS-001..007) ───
      ...jsxA11y.configs.recommended.rules,
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/no-autofocus': 'off',

      // ─── Imports ───
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-*', group: 'external', position: 'before' },
            { pattern: '@*/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-duplicates': 'warn',
      'import/no-unresolved': 'off', // Vite resolver handles this
      'import/newline-after-import': 'warn',

      // ─── General JS quality ───
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': [
        'warn',
        { allow: ['warn', 'error', 'info'] },
      ],
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['warn', 'smart'],
      'no-throw-literal': 'warn',
      'no-return-await': 'warn',
      'object-shorthand': 'warn',
    },
  },

  // Test files — allow Jest/Vitest globals
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}', '**/tests/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Prettier (must be last — disables conflicting ESLint formatting rules)
  prettier,
];