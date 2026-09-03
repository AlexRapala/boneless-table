# Documentation site

This is the independently deployable Next.js site for `boneless-table`.

Deploy this as a separate hosting project connected to this repository. Because it consumes the local package through `file:../packages/boneless-table`, build from the repository root with `npm run build:docs`; do not set `docs` as an isolated checkout root until the package dependency is changed to a published npm version.

```bash
npm run dev --workspace boneless-table-docs
npm run build --workspace boneless-table-docs
```
