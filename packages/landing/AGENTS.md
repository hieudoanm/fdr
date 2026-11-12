# FDR

Can't decide what to eat? A food randomizer that spins a reel of dishes across
world cuisines, built with Next.js.

## Commands

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `pnpm run dev`      | Start the development server              |
| `pnpm run build`    | Production build with type checking       |
| `pnpm run lint`     | ESLint, writing fixes                     |
| `pnpm run test`     | Unit tests with coverage (80% thresholds) |
| `pnpm run test:e2e` | Playwright end-to-end tests               |

## Key Conventions

- **Fonts:** Inter (sans) via `next/font` (`--font-inter`) or the Google Fonts
  link in `index.html`; mono stack
  `ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace`. Tokens:
  `--font-sans` / `--font-mono`. Do not add other typefaces.

- The randomizer feature is wired up in
  `src/components/organisms/Randomizer.tsx` (the `FoodRandomizer` organism), and
  its reusable pieces live in `src/components/molecules/` (`CuisineSelect`,
  `Reel`, `SchedulePicker`) and `src/hooks/` (`useFoodPicker`). The same
  organisms serve both `/foods/*` and `/drinks/*` routes via props (`items`,
  `optionsMap`, `kind`, `randomizerBasePath`); `/foods/randomizer` and
  `/drinks/randomizer` share `src/components/templates/RandomizerTemplate.tsx`;
  the three wheel and three dishes pages share `WheelTemplate` and
  `DishesTemplate`.
- Jest treats every file inside `__tests__/` as a suite: keep shared fixtures in
  `<feature>/testing/`, not in `__tests__/`.
- Pages are thin: they compose templates (`HomeTemplate`) and feature
  components.
- Path alias `@/*` maps to `./src/*`.
- DaisyUI has a single `fdr` light theme, defined in `src/styles/globals.css`
  and applied via `data-theme="fdr"` on `<html>`.
- Shared infrastructure lives in `src/components/atoms/` (`ServiceWorker`,
  `src/components/atoms/` (`Badge`, `OfflineBadge`) and `src/hooks/`.

## Data

Static food data lives in `src/data/json/`, imported through
`src/data/index.ts`. The canonical CSV sources are in `src/data/csv/`;
regenerate JSON with `node scripts/csv-to-json.mjs` (or `pnpm foods:convert`),
which writes `src/data/json/`.

- `meal-foods.json` — 360 dishes, `meal-drinks.json` — 60 drinks,
  `meal-snacks.json` — 60 snacks/desserts, all with
  `{ country, category, subcategory, value, label, emoji }`. `foodsAndDrinks`
  merges all three (200 entries); `foods`, `drinks`, and `snacks` are exported
  separately, with matching `*_OPTIONS` maps.
- `countries.json` — 12 countries with `{ value, label, emoji }`.
- `schedule-scheldon.json` — 7 entries, `schedule-vietnam.json` — 28 entries
  (four weeks, with `week`), `schedule-united-kingdom.json` — 28 entries (four
  weeks, with `week`); all with `{ day, week?, meal, emoji, restaurant, note }`.
- `FOOD_OPTIONS` maps `all`, each country, and each dish value to label lists
  used by the reel and picker.

Types (`Cuisine`, `Food`, `ScheduleEntry`) live in `src/data/types.ts` and are
re-exported from `src/data/index.ts`.

## Documentation

| Document        | Description                                  |
| --------------- | -------------------------------------------- |
| [docs](./docs/) | Architecture notes and feature documentation |

## Footer

The landing footer follows the shared contract via
`packages/landing/src/components/Footer.tsx`: `© {year} {repo-name}` (lowercase
repo name, `new Date().getFullYear()`), a one-line tagline/license descriptor,
and a right-aligned `<nav aria-label="Footer">` with exactly two links —
`GitHub` (repo root) and `README` (`<repo>#readme`), both
`target="_blank" rel="noreferrer"`. Reuse the component on every page that shows
a footer.

## Features & CTA sections

The landing page composes `Features` and `CTA` components (in
`src/components/molecules/`). Features: centered head (h2 + supporting p),
responsive card grid, card = icon chip + h3 + p. CTA: alt/surface background,
centered h2 + p, primary action button plus at most one ghost button. Keep copy
and link targets per-repo; keep the structure shared.
