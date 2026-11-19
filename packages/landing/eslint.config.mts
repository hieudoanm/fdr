import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  globalIgnores([
    '.next/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
    'node_modules/**',
    'out/**',
  ]),
]);

export default eslintConfig;
