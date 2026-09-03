# boneless-table

An unstyled, production-oriented React boneless-table renderer built on TanStack Table.

## Repository layout

```text
.
├── .github/workflows/             CI and npm publishing automation
├── docs/                          independently deployable Next.js documentation site
├── packages/boneless-table/     publishable boneless-table package
│   ├── src/                       implementation and public entry point
│   ├── tests/                     unit and behavior tests
├── CONTRIBUTING.md
├── LICENSE
└── package.json                   private workspace orchestrator
```

This structure is inspired by [TanStack Table](https://github.com/TanStack/table): packages, docs, examples, and GitHub automation are separate top-level concerns. The implementation is intentionally smaller because this repository publishes one React package rather than TanStack's multi-adapter suite.

## Install

```bash
npm install boneless-table
```

The published package has no CSS framework or icon dependency. Its documentation site supplies an
optional Tailwind theme using the component's `classNames`, `icons`, and `data-slot` hooks.
The documentation site includes runnable screens and code samples for common patterns.

## Development

```bash
npm install
npm run lint
npm test
npm run build
npm run dev
```

See [docs/README.md](docs/README.md) for documentation-site deployment and [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance.

## Publishing

Publishing is handled by the GitHub release workflow. Add an `NPM_TOKEN` repository secret, create a GitHub release, and the workflow publishes `packages/boneless-table` with public access.
