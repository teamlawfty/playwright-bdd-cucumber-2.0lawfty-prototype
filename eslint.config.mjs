import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import cucumberPlugin from 'eslint-plugin-cucumber';  // Import the cucumber plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'src/graphql/codegen/graphql.ts',
      '.storybook/',
      'dist/',
      'storybook-static/',
      'public/new-relic-agent-*.js',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'prettier', // Keep Prettier for code formatting
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      cucumber: fixupPluginRules(cucumberPlugin), // Fix: Initialize cucumber plugin correctly
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'no-console': 1,
      // Allow unused variables that start with an underscore
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Specific rule set for .feature files (Cucumber)
    files: ['**/*.feature'],
    plugins: ['cucumber'],
    rules: {
      'cucumber/consistent-feature-file-naming': 'error', // Example cucumber-specific rule
      'cucumber/no-empty-step': 'error',  // Ensure steps are not empty
    },
  },
  {
    files: ['**/.eslintrc.{js,cjs}'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 5,
      sourceType: 'commonjs',
    },
  },
];
