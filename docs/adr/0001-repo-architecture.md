# 0001. Monorepo with pnpm workspaces and Turborepo

- Status: accepted
- Date: 2026-11-12

## Context

- **The codebase has multiple TypeScript parts that must evolve together** - the Angular web app, the NestJS API, shared Zod contracts, shared configs, DB package.
- **Features touch multiple places at once** - contract, API and UI. We want that to be one change in one PR.
- **Shared code shouldn't require publishing packages to a registry**
- **Development is native Windows while CI is Linux [see native Windows development](./0007-native-windows-development.md)** - tooling must work cross-platform
- **Agentic development** - One repository gives agents one consistent context and one set of conventions.

## Decision

Monorepo managed with pnpm workspaces and Turborepo.

- **Workspace layout:** `apps/*`, `packages/*` and `e2e`
- **Shared dependency versions live in a `pnpm` catalog** - TypeScript is pinned to `~6.0` because Angular 22 requires it.
- **Internal packages are compiled to `dist/`** - They are consumed as normal npm packages.
- **Shared ESLint and TypeScript configs are packages.** Each workspace package has its own `eslint.config`, which works because ESLint 10 finds the nearest config file.
- **`pnpm`’s strict install-script policy is kept:** each dependency’s build scripts are approved or denied explicitly in `allowBuilds`.
- **Node and `pnpm` versions are pinned with mise.**
- **The project doubles as a learning environment, so tools that keep the native Angular and Nest CLIs visible are preferred.**

## Alternatives considered

| Alternative    | Why it lost                                                                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nx             | Strong in Angular + Nest, but it wraps the native CLIs and adds many concepts, which works against the learning goal. Those are compensated through ESLint boundary rules and generators through Claude skills. |
| npm workspaces | No caching, no task ordering, no protection against phantom dependencies. One of the goals is gathering experience with `pnpm` as well.                                                                         |
| Polyrepo       | Shared contracts would need publishing and versioning. One feature would mean several coordinated PRs.                                                                                                          |

## Consequences

### Positive

- One PR per feature.
- One source of truth for versions (the catalog).
- Cached builds - improved build time.
- Claude works in one repository with consistent conventions.

### Negative

- Apps are coupled through shared tool versions. Angular decides the TypeScript version for the API too. Migrating Angular's TS version would mandate migrating everything together.
- Internal packages must be built before their consumers.
- No generators, and boundary rules are maintained by hand in ESLint configs.
- One shared lockfile means occasional merge conflicts in it. Every dependency update touches it.

## Revisit if

- Build or CI times stay slow in spite of caching.
- A non-TypeScript service or a native mobile app joins the project.
- One app needs a different TypeScript version than the others.
