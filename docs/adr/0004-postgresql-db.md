# 0004. Use PostgreSQL with Drizzle for DB layer

- Status: accepted (proposed in Phase 0, accepted after Phase 3 put it into practice)
- Date: 2026-11-17

## Context

Plate's data is relational and integrity guarantees matter (foreign keys, unique constraints, `NOT NULL`). The schema should live in TypeScript next to the code that uses it, and every schema change should be reviewable in a PR.

The same database must run everywhere, on the same major version: locally in Docker, in CI through Testcontainers, and in production.

## Decision

- PostgreSQL, with the major version pinned (`postgres:18`)
- Drizzle ORM with the node-postgres driver, schema written in TypeScript
- Migrations are generated as SQL files, reviewed in PRs and applied by one standalone runner that is reused locally, in CI and in deployments
- `drizzle-kit push` is never used

## Version policy

### PostgreSQL

- Only the major version is pinned (`postgres:18`, Debian variant). Minor releases arrive with `docker compose pull`.
- The same major runs locally, in Testcontainers and in production. A major upgrade happens in all three together.
- The schema requires PostgreSQL 18 or later, because primary keys default to the built-in `uuidv7()`.
- A major upgrade is a deliberate data migration (dump/restore or `pg_upgrade`), done once the new major has had a minor release or two. PostgreSQL 19 (GA planned for 2026-11-19) will be the first test of this policy.

### Drizzle

- `drizzle-orm` stays on the stable 0.45 line and `drizzle-kit` on the matching 0.31 line, pinned in the catalog with caret ranges. For 0.x versions, a caret range only allows patch releases.
- The two packages are always upgraded together.
- When this ADR was accepted, Drizzle 1.0 was still a release candidate (1.0.0-rc.5, October 2026), and its release candidates were still making breaking changes.
- Upgrading to 1.0 is a planned task, done once the stable release has had a patch or two. Known work: relational queries v2 (`defineRelations`), the reworked casing API and the new migrations folder format. At that point, re-check whether the tsx workaround and the duplicated `casing` setting are still needed.

## Alternatives considered

- Prisma: it has a separate schema language and requires a `prisma generate` step after every change. Drizzle stays closer to raw SQL, which is preferred. Prisma 7 removed its Rust engine, so performance and native binaries are no longer arguments against it; the schema language and the generate step are.

## Consequences

### Positive

- Types are inferred directly from the schema, with no generation step
- Every schema change produces a readable SQL file that gets reviewed in the PR
- One migration runner works the same locally, in CI and in production (`node dist/migrate.js`)

### Negative

- NodeNext friction: drizzle-kit can't resolve `.js` imports in TypeScript schema files, so it runs under tsx, an extra dev dependency that exists only for this workaround
- `casing` must be defined in both `drizzle.config.ts` and `createDb`, and the two must match
- Branch conflicts on migrations: Drizzle decides what to apply by timestamp, so a migration conflict between branches means deleting your migration, regenerating it and resetting your local database
- Migrations are forward-only: there are no down migrations, so mistakes are fixed with a new migration, and recovering from a bad one relies on backups (Phase 10)
