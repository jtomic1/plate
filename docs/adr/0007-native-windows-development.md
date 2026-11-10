# 0007. Native Windows development

- Status: accepted
- Date: 2026-11-10

## Context

PC used for development runs Windows, whereas the CI and production run on Linux. The differences that should have extra attention paid to are:

- Line endings: CRLF vs LF
- File name casing: Unlike Windows, Linux does not ignore file name letter casing
- Path separators: '/' vs '\'
- Shell syntax: PowerShell (Windows) vs bash (Linux)
- File handling: symlinks and permissions behave differently
- Docker: runs inside a VM on Windows

Windows is the environment that I'm familiar with, and working on it instead of having multiple environments simplifies the development process.

## Decision

Development will be ongoing on a Windows machine. Docker Desktop uses WSL 2 internally, while the development happens natively.

## Alternatives considered

- WSL2: matches production, but introduces a new environment with a file-access boundary.
- Dev containers: Reproducible by anyone, but introduces a new layer for learning.
- Separate Linux machine / VM: full parity, but requires extra hardware or resources as well as context switching.

## Consequences

- Cross-platform scripts are non-negotiable.
- Hooks must be written as Node scripts instead of in bash.
- CI becomes a safety net for Linux
- Docker Desktop might affect DX due to increased resource usage.
