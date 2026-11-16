import { resolve } from 'node:path';

import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { createDb } from './client.js';
import { requireDatabaseUrl } from './env.js';

// Resolved from dist/, so it works the same locally and in the Phase 8 image.
const migrationsFolder = resolve(import.meta.dirname, '../migrations');
const db = createDb(requireDatabaseUrl());

try {
  await migrate(db, { migrationsFolder });
  console.log('Migrations are up to date.');
} finally {
  await db.$client.end();
}
