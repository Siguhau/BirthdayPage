# Modernization roadmap

This document records improvements that should be implemented as separate pull
requests. Keep each pull request focused, merge it before starting the next
item, and require the existing format, lint, and build checks to pass.

## Current baseline

- pnpm is pinned through `packageManager`, and CI installs with a frozen
  lockfile.
- Strict TypeScript is enabled for both application and Vite configuration
  code.
- `pnpm build` performs the TypeScript project build in CI before Vite creates
  the production bundle.
- ESLint and Prettier checks run in CI.

## Recommended order

### 1. Add unit and component tests

Introduce Vitest and React Testing Library. Start with the birthday date logic,
then cover the countdown and greeting views. Use fake timers and explicit time
zones so tests remain deterministic around midnight, daylight-saving changes,
and year boundaries. Add a `test` script and a dedicated CI check.

### 2. Make birthday configuration explicit

Move the birthday date, display name, locale, and intended time zone into a
small typed configuration module. Keep date calculations in pure functions and
rendering in components. This makes future greeting changes safer and makes the
date behavior straightforward to test.

### 3. Add browser-level tests

Use Playwright to verify the two critical journeys: the countdown immediately
before the birthday and the greeting during the birthday. Control the browser
clock and time zone in the tests. Run a small Chromium suite for pull requests;
add other browsers only when they protect a supported audience.

### 4. Add accessibility checks

Audit keyboard navigation, heading structure, color contrast, screen-reader
labels, and motion. Respect `prefers-reduced-motion` for countdown and confetti
effects. Add automated accessibility assertions to component or browser tests,
while retaining a short manual checklist for behavior automation cannot prove.

### 5. Automate dependency maintenance

Configure Dependabot or Renovate for pnpm, GitHub Actions, and Docker base
images. Group low-risk development dependency updates, limit concurrent pull
requests, and keep major upgrades separate. Require the existing CI checks
before merging automated updates.

### 6. Improve repository hygiene

Ignore operating-system metadata such as `.DS_Store` and remove committed
`Zone.Identifier` files after confirming they are not used. Add a short
contributor section to the README with the required Node and pnpm versions and
the commands for development, validation, and production builds.

### 7. Harden the container pipeline

Build and publish only the architectures used by deployment, or explicitly
support both `linux/amd64` and `linux/arm64`. Pin base images immutably, scan the
resulting image for known vulnerabilities, and document how automated updates
refresh those pins. Add a smoke test for the container health endpoint before
publishing.

### 8. Verify PWA behavior

Test manifest validity, installability, offline startup, and service-worker
updates. Document the cache/update behavior so a previous birthday greeting
cannot remain visible because a client is running stale assets.

### 9. Upgrade to TypeScript 7 when the lint stack supports it

Do not force this upgrade while `typescript-eslint` excludes TypeScript 7 from
its supported peer range. Once support is declared, upgrade TypeScript and its
lint integration together, run the complete validation suite, and keep strict
mode enabled. Add a named `typecheck` script and CI step so type checking is
visible independently from bundling, even though the current build already
performs it.

## Pull request checklist

Every modernization pull request should:

1. Address one roadmap item or a clearly bounded part of one.
2. Explain user impact and important tradeoffs.
3. Add or update tests for behavior changes.
4. Pass `pnpm format:check`, `pnpm lint`, and `pnpm build` locally.
5. Avoid drive-by dependency updates or unrelated formatting changes.
