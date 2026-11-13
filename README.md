# fdr

[![CI](https://github.com/hieudoanm/fdr/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/hieudoanm/fdr/actions/workflows/ci.yaml?branch=master)  [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Topics: `food`, `randomizer`, `nextjs`, `static-site`

**FDR (Food & Drink)** — Can't decide what to eat? Let fate choose.

![FDR — Can't decide what to eat? Let fate choose.](assets/branding/png/og.png)

FDR (Food & Drink) is a small, fast food-picker app: a static Next.js site
with a wheel, a dish randomizer, a searchable menu, and weekly dining
schedules.

[Live site](https://hieudoanm.github.io/fdr) · [Technical docs](./AGENTS.md) · [Product spec](./docs/README.md)

## Features

| Feature              | Route                 | What it does                                     |
| -------------------- | --------------------- | ------------------------------------------------ |
| **Wheel of Cuisine** | `/foods/wheel/`       | Spin a wheel to pick a country to eat from       |
| **Food Randomizer**  | `/foods/randomizer/`  | Spin a reel to pick a dish, filtered by cuisine  |
| **Dishes**           | `/foods/dishes/`      | Browse and search dishes across world cuisines   |
| **Drinks Wheel**     | `/drinks/wheel/`      | Spin a wheel to pick a country to drink from     |
| **Drink Randomizer** | `/drinks/randomizer/` | Spin a reel to pick a drink, filtered by cuisine |
| **Drinks**           | `/drinks/dishes/`     | Browse and search drinks across world cuisines   |
| **Snacks Wheel**     | `/snacks/wheel/`      | Spin a wheel to pick a country for a snack       |
| **Snack Randomizer** | `/snacks/randomizer/` | Spin a reel to pick a snack, filtered by cuisine |
| **Snacks**           | `/snacks/dishes/`     | Browse and search snacks across world cuisines   |
| **Food Schedules**   | `/schedule/`          | Weekly dining schedules (Sheldon, Vietnam, UK)   |

The data set covers **480 items** across **12 countries** — American (United States), Chinese,
Egyptian, Indian, Italian, Japanese, Korean, Mexican, Thai, Turkish, British, and Vietnamese —
split into 360 dishes (`meal-foods.csv`), 60 drinks (`meal-drinks.csv`), and 60 snacks
and desserts (`meal-snacks.csv`).

## Monorepo layout

```text
.
├── .github/workflows/ci.yaml   # lint → test → build → GitHub Pages deploy
├── docs/                       # product specification (00–12)
├── packages/
│   └── landing/                # FDR: Next.js app + data
│       ├── data/               # CSV sources + generated JSON
│       │   ├── csv/            # foods, countries, schedules
│       │   └── json/           # generated from csv/
│       ├── src/app/            # App Router pages and error boundaries
│       ├── src/components/     # atoms / molecules / organisms / templates
│       ├── src/data/           # typed data access + JSON consumed by the app
│       ├── src/hooks/          # useFoodPicker and friends
│       ├── src/providers/      # service-worker registration
│       └── e2e/                # Playwright specs
├── AGENTS.md                   # technical reference for contributors/agents
└── turbo.json                  # task graph and cache outputs
```

## Get Started

Requirements: Node **26.13.0** (see `.nvmrc`) and pnpm **12.16.1**.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Root scripts fan out through Turborepo:

| Command          | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `pnpm dev`       | Development server                                        |
| `pnpm build`     | Production build; static export in `packages/landing/out` |
| `pnpm lint`      | ESLint across the workspace                               |
| `pnpm typecheck` | `tsc --noEmit` across the workspace                       |
| `pnpm test`      | Jest unit tests with 80% coverage thresholds              |
| `pnpm format`    | Prettier, writing changes                                 |

Run a single package's script with pnpm's filter:

```bash
pnpm --filter @fdr/landing test
pnpm --filter @fdr/landing test:e2e     # builds, then runs Playwright on out/
pnpm --filter @fdr/landing start        # serves out/ on :3000
```

## Data model

The canonical data is CSV in `packages/landing/src/data/csv/`; JSON in
`packages/landing/src/data/json/` is generated from it:

```bash
node packages/landing/scripts/csv-to-json.mjs
```

| File                          | Records | Shape                                                 |
| ----------------------------- | ------- | ----------------------------------------------------- |
| `meal-foods.csv`              | 360     | `country, category, subcategory, value, label, emoji` |
| `meal-drinks.csv`             | 60      | `country, category, subcategory, value, label, emoji` |
| `meal-snacks.csv`             | 60      | `country, category, subcategory, value, label, emoji` |
| `countries.csv`               | 12      | `value, label, emoji`                                 |
| `schedule-scheldon.csv`       | 7       | `day, meal, emoji, restaurant, note`                  |
| `schedule-vietnam.csv`        | 28      | `day, week, meal, emoji, restaurant, note`            |
| `schedule-united-kingdom.csv` | 28      | `day, week, meal, emoji, restaurant, note`            |

`packages/landing/src/data/` exposes the typed accessors:

- `Food`, `Cuisine`, `ScheduleEntry`, and `ScheduleMeta` types
- `foods` (360 dishes), `drinks` (60 drinks), `snacks` (60 snacks),
  `foodsAndDrinks` (all 480), `countries`, `schedules`, `getSchedule`,
  `listSchedules`
- `FOOD_OPTIONS`, `DRINK_OPTIONS`, `SNACK_OPTIONS` — label lists keyed by
  country, item value, and `all`

## Deployment

`.github/workflows/ci.yaml` runs on every push and pull request to `master`:

1. **Typecheck**, **lint**, and **test**.
2. **Build** with `BASE_PATH=/fdr`, producing `packages/landing/out`.
3. Upload the static export as a Pages artifact.
4. On `master` (push or manual dispatch), **deploy** to GitHub Pages.

Set the repository's **Settings → Pages → Source** to **GitHub Actions** once;
the workflow cannot configure that itself. The site is served from
`https://hieudoanm.github.io/fdr`.

## License

This project is licensed under the [MIT License](LICENSE).
