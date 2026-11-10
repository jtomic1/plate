# 0003. Use NestJS for the backend API

- Status: accepted
- Date: 2026-11-10

## Context

The API needs validation, configuration, logging, health checks and OpenAPI docs,
and the project should resemble a real-world codebase. Frontend and backend should
share request/response schemas from `packages/contracts`.

## Decision

Use NestJS 12 (ESM) for `apps/api`, validating requests with the shared Zod schemas
through Nest's Standard Schema support in route decorators.

## Alternatives considered

- Plain Fastify: lighter and faster, but every convention would be hand-rolled.
- Express 5: familiar, but little structure and weaker TypeScript ergonomics.

## Consequences

- Opinionated module/DI structure that matches many production Node codebases.
- Built-in testing utilities, guards, interceptors and Swagger integration.
- More boilerplate and decorator "magic" to learn.
- Tied to Nest's release cycle; major upgrades go through `nest upgrade`.
