# Contributing to fdr

Thanks for contributing to FDR (Food & Drink), a static Next.js food-picker
site.

## Setup

```bash
git clone https://github.com/hieudoanm/fdr.git
cd fdr
pnpm install
```

Requires Node.js and pnpm; the workspace is driven by Turborepo.

## Checks

Run before opening a pull request:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Conventions

- Food and schedule data lives in `packages/landing/src/data/` (TypeScript
  modules and JSON); keep entries consistent with the existing shape.
- Content changes should stay data-only when possible — avoid restructuring
  components for a menu addition.
- The site is a static export deployed to GitHub Pages; keep it dependency-
  light and fast.

See [AGENTS.md](AGENTS.md) for the technical reference.

## License

By contributing, you agree that your contributions will be licensed under the
repository license in [`LICENSE`](LICENSE).
