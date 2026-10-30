# FDR — Food & Drink

**Can't decide what to eat? Let fate choose.**

FDR (Food & Drink) is a small, fast food-picker app. It ships as **FDR**, a
static Next.js site with a Tauri desktop shell. Pick a country on the wheel,
spin a reel of dishes, browse the full menu, or follow Sheldon's weekly food
schedule.

[🚀 Live site](https://hieudoanm.github.io/fdr) · [🔧 Technical docs](./AGENTS.md) · [📖 Product spec](./docs/README.md)

## Features

| Feature                 | Route          | What it does                                             |
| ----------------------- | -------------- | -------------------------------------------------------- |
| **Wheel of Cuisine**    | `/wheel/`      | Spin a wheel to pick a country to eat from               |
| **Food Randomizer**     | `/randomizer/` | Spin a reel to pick a dish, filtered by cuisine           |
| **Sheldon's Schedule**  | `/schedule/`   | A fixed week of meals, dictated by a rigorous schedule    |
| **Cuisine List**        | `/list/`       | Browse and search dishes across world cuisines            |

The data set covers **200 dishes** across **10 countries** — American, Chinese,
Indian, Italian, Japanese, Korean, Mexican, Thai, Turkish, and Vietnamese — with
drinks, mains, sides, and desserts.

## Monorepo layout

```
.
├── .github/workflows/ci.yaml   # lint → test → build → GitHub Pages deploy
├── docs/                       # product specification (00–12)
├── packages/
│   ├── data/                   # CSV sources + generated JSON
│   │   ├── csv/                # foods, countries, scheldon
│   │   └── json/               # generated from csv/
│   └── web/                    # FDR: Next.js app + Tauri shell
│       ├── src/app/            # App Router pages and error boundaries
│       ├── src/components/     # atoms / molecules / organisms / templates
│       ├── src/data/           # typed data access + JSON consumed by the app
│       ├── src/hooks/          # useFoodPicker and friends
│       ├── src/lib/            # native bridges, providers, utilities
│       ├── src-tauri/          # desktop shell (dialog, notification, updater)
│       └── e2e/                # Playwright specs
├── AGENTS.md                   # technical reference for contributors/agents
└── turbo.json                  # task graph and cache outputs
```

## Getting started

Requirements: Node **26.13.0** (see `.nvmrc`) and pnpm **12.16.1**.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Root scripts fan out through Turborepo:

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `pnpm dev`        | Development server                               |
| `pnpm build`      | Production build; static export in `packages/web/out` |
| `pnpm lint`       | ESLint across the workspace                      |
| `pnpm typecheck`  | `tsc --noEmit` across the workspace              |
| `pnpm test`       | Jest unit tests with 80% coverage thresholds     |
| `pnpm format`     | Prettier, writing changes                        |

Run a single package's script with pnpm's filter:

```bash
pnpm --filter @fdr/web test
pnpm --filter @fdr/web test:e2e     # Playwright
pnpm --filter @fdr/web tauri dev    # desktop shell
```

## Data model

The canonical data is CSV in `packages/data/csv/`; JSON in `packages/data/json/`
is generated from it:

```bash
node packages/data/csv-to-json.mjs
```

| File            | Records | Shape                                                              |
| --------------- | ------- | ------------------------------------------------------------------ |
| `foods.csv`     | 200     | `country, category, subcategory, value, label, emoji`              |
| `countries.csv` | 10      | `value, label, emoji`                                              |
| `scheldon.csv`  | 7       | `day, meal, emoji, restaurant, note`                               |

The web app imports its own copy of the JSON from
`packages/web/src/data/json/`. When the data changes, regenerate the JSON and
copy it into the web package (the two directories are currently kept in sync by
hand).

`packages/web/src/data/` exposes the typed accessors:

- `Food`, `Cuisine`, and `ScheduleEntry` types
- `foods`, `countries`, and `scheldon` arrays
- `FOOD_OPTIONS` — label lists keyed by country, dish value, and `all`

## Deployment

`.github/workflows/ci.yaml` runs on every push and pull request to `master`:

1. **Typecheck**, **lint**, and **test**.
2. **Build** with `BASE_PATH=/fdr`, producing `packages/web/out`.
3. Upload the static export as a Pages artifact.
4. On `master` (push or manual dispatch), **deploy** to GitHub Pages.

Set the repository's **Settings → Pages → Source** to **GitHub Actions** once;
the workflow cannot configure that itself. The site is served from
`https://hieudoanm.github.io/fdr`.

## License

[MIT](./LICENSE) © 2026 Hieu Doan
