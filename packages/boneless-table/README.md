# boneless-table

An accessible, virtualized, unstyled React data table renderer built on TanStack Table.

## Install

```bash
npm install boneless-table
```

## Styling and icons

The package ships no CSS, Tailwind utilities, or icon dependency. Apply classes through
`className` and `classNames`, target stable `data-slot` attributes in your stylesheet, and pass
optional icons through `icons`. The documentation app contains a complete Tailwind theme built on
those hooks.

## Usage

```tsx
import { BonelessTable, type BonelessTableColumn } from 'boneless-table'

type Account = { id: string; name: string; plan: string }

const columns: BonelessTableColumn<Account>[] = [
  { key: 'name', header: 'Account' },
  { key: 'plan', header: 'Plan' },
]

export function AccountsTable({ data }: { data: Account[] }) {
  return <BonelessTable data={data} columns={columns} />
}
```

See the repository documentation site for the complete API and configuration guide.

## Layout and virtualization

Content-sized tables (`scroller="auto"`, the default) render all rows. Virtualization is enabled
when `scroller="fill"`, which must be placed in a parent with a stable height. Virtual rows are
measured after rendering, so cells may wrap or render variable-height content. Use
`virtualization={false}` to opt out in a fill layout.

For non-text column headers, set `meta.columnLabel` to provide the label shown in the built-in
column chooser; otherwise the chooser falls back to the column id.

## Filtering performance

Text filters debounce updates by 150ms by default, so large client-side row models are not
recomputed on every keystroke. Set `filterDebounceMs={0}` for immediate filtering, or increase
the value when working with larger local datasets. This delay also reduces request churn for
server-filtered tables.

## Expandable rows

Pass TanStack's `getSubRows` together with `tree` to render nested records. The default toolbar
adds one Expand all / Collapse all control, and indentation is contained inside the selected cell
so tree depth never changes column widths.

```tsx
<BonelessTable
  data={family}
  columns={columns}
  getSubRows={(person) => person.children}
  tree={{ columnId: 'name', indentPx: 18 }}
/>
```
