import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema/index.js';

export function createDb(url: string) {
  return drizzle({
    connection: { connectionString: url },
    schema,
    casing: 'snake_case',
  });
}

export type Db = ReturnType<typeof createDb>;
