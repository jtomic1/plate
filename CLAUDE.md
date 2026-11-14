# Plate

Personal nutrition + training tracker. Learning project: Angular 22, NestJS 12, PostgreSQL,
pnpm workspaces + Turborepo. Development happens on native Windows (PowerShell 7);
CI and production run Linux.

## Commands (run from the repo root)

- `pnpm install`: install dependencies (also installs git hooks)
- `pnpm build` / `pnpm lint` / `pnpm typecheck` / `pnpm test`: run through Turborepo
- `pnpm format`: format everything with Prettier
- One package only: `pnpm --filter "@plate/contracts" build`
- `pnpm db:up`: start PostgreSQL (Docker) and wait until healthy
- `pnpm db:down`: stop it; data is kept
- `pnpm db:reset`: DELETES all local data and starts fresh; ask before running

## Rules

- Dependency versions live in the `catalog` in `pnpm-workspace.yaml`; packages use `"catalog:"`.
- TypeScript stays on 6.0.x (required by Angular 22).
- Scripts must be cross-platform: no bash-only syntax (ADR 0007).
- `packages/contracts` must not import Node.js or framework code.
- Commit messages and PR titles follow Conventional Commits.
- Architecture decisions live in `docs/adr/`.
