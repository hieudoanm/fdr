# AGENTS.md

- Technical reference for working in the FDR repository.
- The [README](./README.md) explains what the app is; this file explains how to
  change it.
- Product requirements live in [`docs/`](./docs/README.md).
- Package-level guidance lives in [`packages/web/AGENTS.md`](./packages/web/AGENTS.md).

## Read this first

- **Static Next.js app.** `packages/web` uses the App Router with
  `output: 'export'`; every route is prerendered into `packages/web/out`.
- **No backend.** There is no API, database, or server-side data fetching. Food
  data is bundled at build time.
- **Tauri is a shell, not a second app.** `packages/web/src-tauri` wraps the
  same web build for desktop; web-only behaviour must keep working.
- **One workspace, two packages.** `packages/data` holds source data;
  `packages/web` holds the app.
- **`pnpm typecheck`, `pnpm lint`, and `pnpm test` must pass before a change is
  done.**
- **Keep diffs minimal.** Do not reformat files you did not change.

## Stack

| Area        | Choice                                                        |
| ----------- | ------------------------------------------------------------- |
| Runtime     | Node 26.13.0 (`.nvmrc`), pnpm 12.16.1                         |
| Monorepo    | pnpm workspaces + Turborepo                                   |
| Framework   | Next.js 16 App Router, React 19, TypeScript 6                 |
| Styling     | Tailwind CSS 4 + DaisyUI 5 (`fdr`, `fdr-dark` themes)     |
| Icons       | `react-icons`                                                 |
| State/data  | `@tanstack/react-query`, `idb`, static JSON                   |
| Tests       | Jest 30 + Testing Library (jsdom), Playwright for e2e         |
| Desktop     | Tauri 2 (dialog, notification, updater plugins)               |
| Deploy      | GitHub Pages via GitHub Actions                               |

## Commands

Run from the repository root unless noted.

```bash
pnpm install          # install workspace dependencies
pnpm dev              # turbo run dev -> http://localhost:3000
pnpm build            # turbo run build -> packages/web/out
pnpm lint             # turbo run lint (eslint . --fix in web)
pnpm typecheck        # turbo run typecheck (tsc --noEmit)
pnpm test             # turbo run test (Jest, 80% coverage thresholds)
pnpm format           # turbo run format (Prettier, writes)

pnpm --filter @fdr/web test:e2e     # Playwright
pnpm --filter @fdr/web tauri dev    # desktop shell
node packages/data/csv-to-json.mjs  # regenerate JSON from CSV
```

## Workspace layout

| Path                              | Contents                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| `packages/web/src/app`            | Routes: `/`, `/wheel`, `/randomizer`, `/schedule`, `/list`; error/loading/not-found boundaries; `robots.ts` |
| `packages/web/src/components/atoms`      | `Badge`, `Button`, `OfflineBadge`, `ThemeToggle`      |
| `packages/web/src/components/molecules`  | `CuisineSelect`, `Reel`                               |
| `packages/web/src/components/organisms`  | `Header`, `List`, `Randomizer`, `Schedule`, `Wheel`   |
| `packages/web/src/components/templates`  | `HomeTemplate`, `ErrorTemplate`                       |
| `packages/web/src/data`           | Types, JSON, and `FOOD_OPTIONS` accessors                    |
| `packages/web/src/hooks`          | `useFoodPicker` and related hooks                            |
| `packages/web/src/lib`            | Providers, native bridges, utilities                         |
| `packages/web/src-tauri`          | Desktop configuration, Rust entry point, capabilities        |
| `packages/web/e2e`                | Playwright specs                                             |
| `packages/data/csv`               | Source of truth: `foods.csv`, `countries.csv`, `scheldon.csv` |
| `packages/data/json`              | Generated JSON (`csv-to-json.mjs`)                           |

## Architecture

- **Pages are thin.** Each page composes a template or a feature organism and
  supplies its heading copy.
- **Organisms are single files.** `Wheel.tsx`, `List.tsx`, `Randomizer.tsx`, and
  `Schedule.tsx` live directly under `organisms/`; do not recreate feature
  subfolders.
- **Atomic split.** `atoms` have no app knowledge; `molecules` compose atoms;
  `organisms` own feature state; `templates` arrange organisms for a page.
- **Client components are explicit.** Any file using hooks, browser APIs, or
  event handlers starts with `'use client'`. Prefer a server component
  otherwise.
- **Components are `FC`; pages are `NextPage`.**
- **Path alias.** `@/*` maps to `packages/web/src/*`.
- **Theme.** `layout.tsx` renders the default `fdr-light` theme; `Header`
  owns the toggle, applies the stored theme, and writes
  `localStorage['fdr:theme']`.
- **Native behaviour.** Anything Tauri-specific goes through
  `src/lib/native/index.ts`, never directly from a component.

## Data conventions

- **CSV is the source of truth.** Edit `packages/data/csv/*.csv`, then run
  `node packages/data/csv-to-json.mjs` to rewrite `packages/data/json/*.json`.
- **The web app imports a copy.** `packages/web/src/data/json/` is a checked-in
  duplicate of `packages/data/json/`. Regenerate both and keep them identical.
- **`Food` shape.** `{ country, category, subcategory, value, label, emoji }`.
  `value` is the stable slug; `label` is display text.
- **`Cuisine` shape.** `{ value, label, emoji }`; `value` matches
  `Food.country`.
- **`ScheduleEntry` shape.** `{ day, meal, emoji, restaurant, note }`.
- **Derived options.** `FOOD_OPTIONS` in `src/data/foods.ts` maps `all`, each
  country, and each dish value to label lists used by the reel and picker.
- **Types live in `src/data/types.ts`.** Export new shared types from
  `src/data/index.ts`.

## Testing

- **Jest** runs in jsdom with coverage thresholds at 80%. Tests live in
  `__tests__/` next to the code they cover; shared fixtures go in
  `__fixtures__/` or `testing/`, never inside `__tests__/`.
- **Organism tests** live in
  `src/components/organisms/__tests__/<Name>.test.tsx` and import from
  `../<Name>`.
- **Test names describe behaviour**, e.g. `renders the theme toggle`.
- **Playwright** specs in `e2e/` target the exported site. They are not part of
  CI; run them locally with `pnpm --filter @fdr/web test:e2e`.
- **Coverage is a gate.** A new branch or component needs a test that exercises
  it.

## CI and deployment

`.github/workflows/ci.yaml` runs on push and pull request to `master`, plus
manual dispatch:

1. Checkout, pnpm 12.16.1, Node from `.nvmrc`, cached pnpm store.
2. `pnpm install --frozen-lockfile`.
3. `pnpm typecheck`, `pnpm lint`, `pnpm test`.
4. `pnpm build` with `BASE_PATH=/fdr`.
5. `touch packages/web/out/.nojekyll`, upload `packages/web/out` as the Pages
   artifact.
6. On `master`, deploy with `actions/deploy-pages`.

- **Base path is required.** GitHub Pages serves the project from `/fdr`, so
  `next.config.ts` reads `BASE_PATH`. Links and assets must stay relative or
  base-path-aware.
- **Pages source is a repo setting.** Set Settings → Pages → Source to
  **GitHub Actions** once; the workflow cannot do it.
- **Build outputs are cached by Turborepo.** `out/**` is listed in
  `turbo.json` so a cached build still produces the Pages artifact.
- **The site is live at** <https://hieudoanm.github.io/fdr>.

## Gotchas

- **Stale data copies.** Editing only `packages/web/src/data/json/` leaves
  `packages/data` behind, and vice versa. Update both.
- **`pnpm lint` is `eslint . --fix`.** It may rewrite files; review the diff.
- **Static export limits.** No dynamic routes without `generateStaticParams`, no
  route handlers that need a server, no `next/image` optimisation.
- **Trailing slashes are on.** `trailingSlash: true` means routes resolve as
  `/wheel/`, not `/wheel`.
- **Tauri tests do not run in CI.** Native plugins are stubbed in unit tests;
  verify desktop behaviour manually.
- **Playwright specs reference routes that may not exist** (`/about`,
  `/downloads`, `/version`). Keep them out of CI until they match the app.
- **`packages/web/package.json` metadata is stale** (GPL-3.0, old repository
  URL). The repository license is MIT; do not propagate the old metadata.

## Definition of done

- [ ] Change is scoped; no unrelated formatting churn
- [ ] Types are explicit; no `any` introduced
- [ ] New behaviour has a test; coverage stays above 80%
- [ ] `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass
- [ ] `pnpm build` succeeds when routes, config, or data change
- [ ] Docs updated when commands, structure, or data change
