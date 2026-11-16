import { createDb } from './client.js';
import { requireDatabaseUrl } from './env.js';
import { type NewUser, users } from './schema/index.js';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to seed with NODE_ENV=production.');
}

// example.com is reserved for documentation, so these addresses can never reach a real person.
const sampleUsers: NewUser[] = [
  { email: 'john@example.com' },
  { email: 'mark@example.com' },
  { email: 'anne@example.com' },
];

const db = createDb(requireDatabaseUrl());

try {
  const inserted = await db
    .insert(users)
    .values(sampleUsers)
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id });
  console.log(
    'Inserted %d new user(s), %d already existed.',
    inserted.length,
    sampleUsers.length - inserted.length,
  );
} finally {
  await db.$client.end();
}
