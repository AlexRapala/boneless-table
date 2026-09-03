import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

const config = [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}', '*.{ts,mts}'],
    languageOptions: { parser: tsParser },
  },
  prettier,
]

export default config
