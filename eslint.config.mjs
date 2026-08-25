import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import vue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier/recommended';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import vuePrettier from '@vue/eslint-config-prettier';

export default [
  prettier,
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  vuePrettier,
  {
    ignores: ['**/test-results/', '**/dist/', '**/node_modules/']
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.tsx', '**/*.mjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        globals: {
          ...globals.browser
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
      '@typescript-eslint/consistent-type-imports': 'error',
      'prefer-arrow-functions/prefer-arrow-functions': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': 'error',
      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'none',
          endOfLine: 'lf'
        }
      ]
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser,
        project: ['./packages/vue/tsconfig.json', './docs/tsconfig.json']
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      'prefer-arrow-functions': preferArrowFunctions
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'vue/multi-word-component-names': 'off',
      'prefer-arrow-functions/prefer-arrow-functions': 'error',
      'no-console': 'error',
      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'none',
          endOfLine: 'lf'
        }
      ]
    }
  }
];
