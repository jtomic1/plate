import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { base } from './base.js';

/**
 * Base rules plus Node.js globals, for the API and tooling.
 * @param {{ tsconfigRootDir: string }} options
 */
export function node({ tsconfigRootDir }) {
  return defineConfig([base({ tsconfigRootDir }), { languageOptions: { globals: globals.node } }]);
}
