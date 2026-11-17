# Plate - Database Conventions

- Table names should be plural.
- Column names should be `snake_case`. TypeScript keys are converted to `snake_case` automatically by keeping `casing: 'snake_case'` in `drizzle.config.ts` and `createDb` in sync.
- Keys are UUIDv7, and they expose creation time. New rows land at the end of the primary-key index, which is more efficient than random UUIDv4 placement. `uuidv7()` is built into PostgreSQL 18, so the schema wouldn't work on previous versions of PostgreSQL.
- Every table spreads `timestamps` (`created_at` and `updated_at`). `$onUpdate` runs only for updates made through Drizzle, raw SQL won't affect `updated_at`. Make sure to manually update affected `updated_at` rows if not using Drizzle.
- Every user-owned table has a `user_id` FK, and it's `NOT NULL`.
- **cascade/restrict rule** - Choice is made per foreign key, on the referencing table: cascade when the referencing row is part of what it references, restrict when it only points at something independent. If something should truly outlive its creator, it should have a different design (eg. a nullable column with `SET NULL`).
- Since PostgreSQL doesn't index foreign key columns automatically, indexing every FK should be mandatory.
- Data normalization and validation will be done at the API boundary. The unique constraint on email is case-sensitive, so the API lowercases emails before every write and every lookup, such as login.
- **Migration workflow**
  1. Edit the schema
  2. Run `pnpm db:generate --name <migration_name>`
  3. Check the SQL
  4. Run `pnpm db:migrate`
  5. Commit all affected files in a single PR (schema changes, generated `.sql` and `meta/*`...)

- Attention should be paid when renaming a table column or a table itself. `generate` asks whether a column/table is new or renamed. Answering that the column/table is new, when it's actually renamed, can lead to data loss (`DROP` + `ADD` / `CREATE`).
- If `main` gains a migration while another branch is open, delete the unmerged migration (`.sql`, snapshot in `meta` and entry in `meta/_journal.json`), rebase and re-generate the migration. The dev database should be rebuild after regenerating:
  1. `pnpm db:reset`
  2. `pnpm db:migrate`
  3. `pnpm db:seed`
- `drizzle-kit push` should **never** be used. It leaves zero trace in git. It can lead to databases diverging in different environments. It can't carry data changes. Overall, it's better to mark it as forbidden than to deal with potential issues which could arise by using it.
- **A merged migration should never be edited**. Fixes go into a new migration. Database records a migration as applied. An edited migration never runs again anywhere it has already run. This way, environments can drift apart without any error.
- Seed data should be idempotent, it should use fake data, and the seeding script should never be run in production.
- `db` package usage:
  - `createDb(url)` - Connect to the DB and get the client
  - `db.$client.end()` - Close the pool
