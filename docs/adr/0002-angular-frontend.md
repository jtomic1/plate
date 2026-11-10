# 0002. Use Angular for the frontend

- Status: accepted
- Date: 2026-11-10

## Context

The client needs to be a responsive web app with comfortable desktop and mobile layouts. Mobile app will be most suitable for use as a PWA. Frontend and backend should
share request/response schemas from `packages/contracts`.

## Decision

Use Angular v22 for `apps/web`. This decision is driven by the fact the developer is already strongly familiar with Angular.

Spartan-ng will be used as a UI component library, since it is often used as a headless component library, looks good, and can give a new insight into how UI libraries other than Angular Material work.

## Alternatives considered

- React, Vue: dropped due to developer's inexperience.
- Angular Material: dropped since it has been used extensively by the developer before. We want the app to have a stronger identity, and to explore different UI libs in more depth.

## Consequences

- Opinionated structure with built in DI that matches many production codebases.
- Strong support for testing with Vitest and Playwright.
- A bit more heavyweight than alternative frameworks.
- Tied to Angular's release cycle; major upgrades go through `ng update`.
- Tailwind CSS becomes a dependency.
- Developer owns the component code.
