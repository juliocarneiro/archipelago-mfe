// ESLint "flat config" único para o monorepo inteiro.
// Ponto de atenção para MFEs: a regra `no-restricted-imports` abaixo impede que um
// micro frontend importe código de OUTRO micro frontend diretamente. A única forma
// permitida de integração é via Module Federation (contrato em runtime) ou via
// pacotes em packages/* (contrato em build time).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/@mf-types/**',
      '**/node_modules/**',
      'playwright-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // Fronteiras arquiteturais: apps não podem se importar entre si.
    files: ['apps/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/apps/*',
                '../../shell/**',
                '../../catalog/**',
                '../../cart/**',
                '@mfe/shell',
                '@mfe/catalog',
                '@mfe/cart',
              ],
              message:
                'Um MFE nunca importa código de outro MFE. Use Module Federation (remote) ou um pacote compartilhado em packages/*.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs}', '**/*.config.ts'],
    languageOptions: { globals: { ...globals.node } },
  },
);
