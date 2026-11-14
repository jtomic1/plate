# Plate

A personal nutrition and training tracker.
(Angular · NestJS · PostgreSQL · pnpm + Turborepo monorepo).

> Status: scaffolding — not usable yet.

## Getting started

### Prerequisites

- Windows with PowerShell 7 (see [0007 - Native Windows development](docs/adr/0007-native-windows-development.md))
  - PowerShell 7 - `winget install --id Microsoft.PowerShell -e`
  - Allow local scripts to run (without it pnpm and npm commands will fail) - `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
  - Enable long file paths for `node_modules` (run this **as Administrator**) - `New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`
- git (git hooks run through its bundled bash)
  - `winget install --id Git.Git -e`
  - `git config --global core.autocrlf false` - keeps files as LF on disk
  - `git config --global core.longpaths true` - git part of the long-path fix
- mise - `winget install --id jdx.mise -e`
  - Add mise's shims folder to PATH
    ```powershell
    $shims = "$env:LOCALAPPDATA\mise\shims"
    $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    if ($userPath -notlike "*$shims*") {
      [Environment]::SetEnvironmentVariable('Path', "$userPath;$shims", 'User')
    }
    ```
  - Close and reopen the Terminal.
- Docker Desktop (requires WSL 2, needed from Phase 2 onwards) - `winget install --id Docker.DockerDesktop -e`
- **Explicit installation of Node or pnpm should not be done** - mise handles it.

### Setup

_Versions are pinned in [`mise.toml`](mise.toml)_

1. `git clone https://github.com/jtomic1/plate.git && cd plate`
2. `mise trust` - marks the project's `mise.toml` as trusted and records the hash of the file's current state to protect against tampering
3. `mise install` - installs shared project runtimes with pinned versions
4. `pnpm install` - installs app dependencies and git hooks
5. `pnpm build` - compilation, bundling & optimization, artifact generating

#### Local DB setup (requires Docker Desktop running)

1. Create `.env` using the `.env.example` (`Copy-Item .env.example .env`)
2. Execute `pnpm db:up`. In case port `5432` is already being used, change `POSTGRES_PORT` and the port within `DATABASE_URL` inside `.env` to an available port (eg. `5433`)
3. Connecting to the database can be done by executing the following command: `docker compose exec postgres psql -U plate -d plate`

**Note:** Editing credentials within `.env` requires `pnpm:reset`, since those changes take effect on the first start with an empty volume.

#### Verify your setup

- `pnpm lint && pnpm typecheck` pass
- Hooks - `Get-ChildItem .git\hooks -Exclude *.sample` returns `commit-msg` and `pre-commit`
- `docker compose ps` showing `(healthy)` in the `STATUS` column of the database

### Common Commands

| Command                                | What it does                                                                                                                                                                     |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm build`                           | Compiles and bundles the project for production.                                                                                                                                 |
| `pnpm lint`                            | Checks the codebase for style and syntax issues using ESLint.                                                                                                                    |
| `pnpm typecheck`                       | Runs the TypeScript compiler to verify types without emitting output files.                                                                                                      |
| `pnpm test`                            | Runs the project's test suite.                                                                                                                                                   |
| `pnpm format`                          | Automatically formats code across the codebase according to the formatter rules.                                                                                                 |
| `pnpm format:check`                    | Verifies that all files match formatting rules without modifying them (useful in CI).                                                                                            |
| `pnpm --filter "@scope/pkg" <command>` | Runs a script inside a single workspace package. _(Note: In PowerShell, package names starting with `@` must be wrapped in quotes so `@` isn't parsed as a splatting operator)._ |
| `pnpm db:up`                           | Starts the local PostgreSQL container.                                                                                                                                           |
| `pnpm db:down`                         | Shuts down the local PostgreSQL while preserving data.                                                                                                                           |
| `pnpm db:reset`                        | Restarts the local PostgreSQL container. **Data inside the DB is deleted.**                                                                                                      |

## Project Structure Overview

```text
plate/
├── docs/  - Documentation
├── packages/
│   ├── contracts/  - Zod shared contracts package
│   ├── eslint-config/  - shared ESLint config package
│   └── tsconfig/  - shared TS config package
└── apps/  - coming in Phases 4-5
```

## Troubleshooting

### 1. CRLF Line Endings Causing Script or Linter Errors

- **Symptom:** Scripts fail inexplicably on Windows, or linters complain about carriage return characters (`\r\n` or `CRLF`) even when code looks fine.
- **Diagnosis:** Run the following command to check how Git tracks line endings for your files:
  ```powershell
  git ls-files --eol
  ```
  If you see w/crlf instead of w/lf, Git is checking out files with Windows-style line endings
- **Fix:**
  1. Ensure your repository has a proper .gitattributes file enforcing LF line endings:
     ```
     * text=auto eol=lf
     ```
  2. Reset your local repository line endings (make sure `git status` shows a clean working tree first):
     ```
     git rm --cached -r .
     git reset --hard
     ```

### 2. Git Hooks Not Running After Cloning

- **Symptom:** Pre-commit hooks, linters, or formatting checks aren't triggering when you try to commit changes on a fresh clone.
- **Cause:** Package managers skip lifecycle scripts or local hook initialization during standard installations unless prepared.
- **Fix:** Run the prepare lifecycle script manually to re-initialize your local Git hooks:
  ```
  pnpm run prepare
  ```

### 3. PowerShell Fails on Scoped Package Filters (`@` Splatting)

- **Symptom:** Running a filtered workspace command in PowerShell throws an error.
- **Cause:** PowerShell interprets the `@` symbol at the start of scoped package names (e.g., `@scope/pkg`) as an array splatting operator.
- **Fix:** Wrap the entire filter pattern in double quotes so PowerShell treats it as a literal string:
  ```
  pnpm --filter "@scope/pkg" build
  ```

### 4. `pnpm` Blocks Dependency Build Scripts (`allowBuilds`)

- **Symptom:** Installation fails or packages with native extensions/compilation fail to build, throwing an error regarding unapproved scripts (such as `ERR_PNPM_IGNORED_BUILDS`).
- **Cause:** `pnpm` restricts execution of unreviewed package lifecycle scripts by default for supply-chain security.
- **Fix:** Explicitly allow or disallow the required package rules in your workspace configuration (`pnpm-workspace.yaml`) under `allowBuilds`:
  ```yaml
  allowBuilds:
    lefthook: false
  ```

## Documentation

- Architecture decisions: [docs/adr](docs/adr)

## Contributing

- Changes go through PRs with [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) titles.
- Hooks enforce formatting and commit messages.
