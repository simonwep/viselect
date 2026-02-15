import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import vue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        globals: {
          ...globals.browser,
        }
      }
    },
    plugins: {
      'prefer-arrow-functions': preferArrowFunctions,
      react
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      'prefer-arrow-functions/prefer-arrow-functions': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': 'error',
      quotes: ['error', 'single']
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser
      },
      globals: {
        ...globals.browser,
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': 'error'
    }
  }
];
