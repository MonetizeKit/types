# AGENTS.md

## Project overview

`@monetizekit/types`: shared TypeScript types mirroring the MonetizeKit
REST/GraphQL resource shapes, consumed by `@monetizekit/node`,
`@monetizekit/embed` and `@monetizekit/react`. Type-only: it ships `.d.ts`
plus empty ESM/CJS entry points. Source in `src/`, built with `tsup`.

## Commands

- `pnpm install --frozen-lockfile`
- `pnpm lint`, `pnpm typecheck`, `pnpm build`
- `pnpm check-entry` (package entry guard), `pnpm smoke` (pack + consume)

## Conventions

- Keep types aligned with the monorepo's `apps/web` API responses and the
  OpenAPI spec; a type that the API does not return is a bug.
- No runtime code. If you need a helper, it belongs in `@monetizekit/node`.
- Changes that alter an exported type need a changeset.

## Verifying your work

Run these and expect this healthy output before opening a PR:

```
$ pnpm lint
> eslint .
(no output, exit 0)

$ pnpm typecheck
> tsc --noEmit
(no output, exit 0)

$ pnpm build
DTS ⚡️ Build success in ~200ms
DTS dist/index.d.ts  4.88 KB
DTS dist/index.d.cts 4.88 KB

$ pnpm check-entry
Package entry guard passed: core types are exported.
```

## Releasing

Published to npm by Changesets from `.github/workflows/release.yml` on push to
`main`, with npm provenance. Add a changeset (`pnpm changeset`) to any PR that
changes the published surface. Because `main` only receives promotions from
`delivery`, a release is the result of a promotion, not of a feature merge.

## SDLC and promotion chain

- Branches: `feature/*` -> PR -> `development` -> `delivery` -> `main`. Feature
  PRs target `development`. Promotion between stages is a promotion PR from
  the upstream stage branch (`development -> delivery`, `delivery -> main`);
  where this repository has `.github/workflows/promote.yml`, that workflow
  opens it when the stage gate is green, and `delivery -> main` is always
  merged by a human. Never open a feature PR against `main` or `delivery`.
- Every PR must pass the `Required Checks Gate` job in `.github/workflows/ci.yml`.
  The `Shadow Review (advisory)` job posts a model review comment; it never
  blocks. React with a thumbs-down to dismiss a finding.
- Agent roles, model IDs, tools and autonomy for the whole fleet are declared in
  [`MonetizeKit/.github/agent-policy.json`](https://github.com/MonetizeKit/.github/blob/main/agent-policy.json).
  Never hardcode a model ID in this repository.
- Conventional commits (`feat:`, `fix:`, `chore:`, ...). Position and status live
  in Linear (team `MK`); reference the issue key in the PR body when one exists.
- The fleet-wide plan is
  [`docs/engineering/ai-native-sdlc-plan.md`](https://github.com/MonetizeKit/app-monetizekit-monorepo/blob/main/docs/engineering/ai-native-sdlc-plan.md)
  in the monorepo.
