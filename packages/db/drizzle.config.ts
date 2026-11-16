import { existsSync } from 'node:fs';

import { defineConfig } from 'drizzle-kit';

const rootEnvFile = '../../.env';
if (existsSync(rootEnvFile)) {
  process.loadEnvFile(rootEnvFile);
}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is not set in the environment variables.');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './migrations',
  casing: 'snake_case',
  dbCredentials: { url },
});
