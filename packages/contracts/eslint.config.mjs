import { base } from '@plate/eslint-config/base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  base({ tsconfigRootDir: import.meta.dirname }),
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['node:*'],
              message: 'contracts also run in the browser: no Node.js modules.',
            },
            { group: ['@angular/*', '@nestjs/*'], message: 'contracts must stay framework-free.' },
          ],
        },
      ],
    },
  },
]);
