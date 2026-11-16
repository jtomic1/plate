import { sql } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { timestamps } from './columns.js';

export const users = pgTable('users', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  email: text().notNull().unique(),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
