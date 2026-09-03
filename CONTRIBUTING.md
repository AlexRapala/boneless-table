# Contributing

## Local setup

Use Node.js 20 or later, then install workspace dependencies from the repository root.

```bash
npm install
npm run lint
npm test
npm run build
```

## Repository boundaries

- `packages/boneless-table` is the publishable npm package.
- `docs` is the independently deployable documentation site.

Keep package implementation in `packages/boneless-table/src`; documentation samples and examples belong in `docs`.
