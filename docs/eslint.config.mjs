import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import prettier from 'eslint-config-prettier'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

const config = [
  { ignores: ['.next/**', 'next-env.d.ts', 'node_modules/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  prettier,
]

export default config
