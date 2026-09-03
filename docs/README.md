# Documentation site

This is the independently deployable Next.js site for `boneless-table`.

Deploy this as a separate hosting project connected to this repository. Because it consumes the local package through `file:../packages/boneless-table`, Vercel must build from the repository root.

In Vercel Project Settings → Build and Deployment, set **Root Directory** to `.` (the repository root), not `docs`. The root `vercel.json` then installs workspace dependencies, builds the local table package before Next resolves it, and deploys `docs/.next`.

Do not set `docs` as an isolated checkout root until the package dependency is changed to a published npm version.

```bash
npm run dev --workspace boneless-table-docs
npm run build --workspace boneless-table-docs
```
