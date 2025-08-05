import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      typescript: tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
    },
  },
  {
    files: ['**/*.js'],
    ...pluginJs.configs.recommended,
  },
]