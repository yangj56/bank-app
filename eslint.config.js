import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    ignores: ['dist/**/*'],
  },
  eslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    files: ['src/**/*.ts'],
    ignores: ['**/__tests__/**'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        process: true,
        console: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'sonarjs/cognitive-complexity': ['error', 45],
    },
  },
  {
    files: ['src/**/__tests__/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...jestPlugin.configs['flat/recommended'].languageOptions.globals,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      ...jestPlugin.configs['flat/recommended'].plugins,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...jestPlugin.configs['flat/recommended'].rules,
      'sonarjs/constructor-for-side-effects': 'off',
    },
  },
];
