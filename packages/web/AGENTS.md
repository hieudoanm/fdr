# FDR

Can't decide what to eat? A food randomizer that spins a reel of dishes across
world cuisines, built with Next.js and Tauri.

## Commands

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `pnpm run dev`       | Start the development server              |
| `pnpm run build`     | Production build with type checking       |
| `pnpm run lint`      | ESLint, writing fixes                      |
| `pnpm run test`      | Unit tests with coverage (80% thresholds) |
| `pnpm run test:e2e`  | Playwright end-to-end tests               |
| `pnpm run tauri dev` | Run the Tauri desktop shell               |

## Key Conventions

- The randomizer feature is wired up in
  `src/components/organisms/Randomizer.tsx` (the `FoodRandomizer` organism), and
  its reusable pieces live in `src/components/molecules/` (`CuisineSelect`,
  `HowToModal`, `Reel`) and `src/hooks/` (`useFoodPicker`).
- Jest treats every file inside `__tests__/` as a suite: keep shared fixtures in
  `<feature>/testing/`, not in `__tests__/`.
- Pages are thin: they compose templates (`HomeTemplate`) and feature
  components.
- Path alias `@/*` maps to `./src/*`.
- DaisyUI themes are `fdr` (light) and `fdr-dark`; `Header` applies the
  theme and reads/writes `localStorage['fdr:theme']`.
- Shared infrastructure mirrors `education/lingo`: providers (`SWProvider`,
  `NativeProvider`, `QueryProvider`), atoms (`Badge`, `OfflineBadge`,
  `ThemeToggle`), hooks and libs live in the same locations.
- The Tauri shell registers dialog, notification and updater plugins; native
  bridges go through `src/lib/native/index.ts`.

## Data

Static food data lives in `src/data/json/`, imported through
`src/data/index.ts`. The canonical CSV sources are in
`packages/data/csv/`; regenerate JSON with
`node packages/data/csv-to-json.mjs`, then copy it into
`src/data/json/` (the two copies are kept in sync by hand).

- `foods.json` — 200 dishes with
  `{ country, category, subcategory, value, label, emoji }`.
- `countries.json` — 10 countries with `{ value, label, emoji }`.
- `scheldon.json` — 7 schedule entries with
  `{ day, meal, emoji, restaurant, note }`.
- `FOOD_OPTIONS` maps `all`, each country, and each dish value to label lists
  used by the reel and picker.

Types (`Cuisine`, `Food`, `ScheduleEntry`) live in `src/data/types.ts` and are
re-exported from `src/data/index.ts`.

## Documentation

| Document        | Description                                  |
| --------------- | -------------------------------------------- |
| [docs](./docs/) | Architecture notes and feature documentation |
