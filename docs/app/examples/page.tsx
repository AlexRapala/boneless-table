import Link from 'next/link'
import { AdminPage } from '../../src/components/admin-page'

const examples = [
  {
    href: '/examples/accounts',
    title: 'Server-backed account directory',
    detail: 'Controlled server sorting and filtering, incremental loading, row links, and reset.',
    settings: 'manualSorting, manualFiltering, onNearEnd, rowLink, scrollToTopOn',
  },
  {
    href: '/examples/simple',
    title: 'Full-width simple table',
    detail: 'Four equally weighted headers that use the full available width.',
    settings: 'sizing.minPx, sizing.flex, align',
  },
  {
    href: '/examples/grouped',
    title: 'Selective grouping borders',
    detail: 'Only the configured middle columns receive divider borders.',
    settings: 'borders, sizing.minPx, sizing.flex',
  },
  {
    href: '/examples/truncation',
    title: 'Configurable value threshold',
    detail: 'Long content is compacted after a chosen character threshold.',
    settings: 'valueDisplay.truncateAt, valueDisplay.suffix, sizing.flex',
  },
  {
    href: '/examples/family-tree',
    title: 'Expandable family tree',
    detail:
      'Nested relationships with stable grid columns, filters, sorting, and expand-all controls.',
    settings: 'tree, getSubRows, filterFromLeafRows, virtualization',
  },
  {
    href: '/examples/form-controls',
    title: 'Editable form controls',
    detail: 'Controlled inputs, draggable flat rows, and selectable tree records.',
    settings: 'custom cells, tree, toolbar, footer',
  },
  {
    href: '/examples/theme-lab',
    title: 'Theme and stress lab',
    detail: 'A 5,000-row virtual table shown in Material and Neo-brutalist themes.',
    settings: 'classNames, icons, scroller, virtualization, onRowClick',
  },
]

const codeSamples = [
  {
    title: 'Minimal account directory',
    detail: 'A complete starting point: imports, data type, columns, sample data, and renderer.',
    code: `import { BonelessTable, defineColumns } from 'boneless-table'

type Account = { id: string; name: string; plan: 'Enterprise' | 'Growth'; spend: number }

const accounts: Account[] = [{ id: 'a1', name: 'Acme', plan: 'Enterprise', spend: 12400 }]
const columns = defineColumns<Account>([
  { accessorKey: 'name', header: 'Account', meta: { bonelessTable: { sizing: { minPx: 180, flex: 1.4 }, filtering: { type: 'text' } } } },
  { accessorKey: 'plan', header: 'Plan', meta: { bonelessTable: { filtering: { type: 'select', options: ['Enterprise', 'Growth'] } } } },
  { accessorKey: 'spend', header: 'Monthly spend', meta: { bonelessTable: { align: 'right' } } },
])

export function AccountDirectory() {
  return <BonelessTable data={accounts} columns={columns} resultLabel="accounts" />
}`,
  },
  {
    title: 'Controlled deployment list',
    detail: 'Screen-owned sorting, filtering, visibility, and column order.',
    code: `const [sorting, setSorting] = useState<SortingState>([])
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

<BonelessTable
  data={deployments}
  columns={columns}
  state={{ sorting, columnFilters }}
  onSortingChange={setSorting}
  onColumnFiltersChange={setColumnFilters}
  resultHint="State is owned by the screen"
/>`,
  },
  {
    title: 'Product toolbar and footer',
    detail: 'Replace the renderer defaults with product-specific summary content.',
    code: `<BonelessTable
  data={subscriptions}
  columns={columns}
  toolbar={(table) => (
    <div className="toolbar">
      {table.getFilteredRowModel().rows.length} subscriptions
      <strong>$6,490 MRR</strong>
    </div>
  )}
  footer={<div className="footer">Open balance: $8,700</div>}
/>`,
  },
  {
    title: 'Loading and incremental data',
    detail: 'Use skeletons for initial load and while fetching another page.',
    code: `<BonelessTable
  data={featureFlags}
  columns={columns}
  isLoading={query.isPending}
  isFetchingMore={query.isFetchingNextPage}
  canLoadMore={query.hasNextPage}
  onNearEnd={() => void query.fetchNextPage()}
  skeletonLabel="Loading more flags"
/>`,
  },
  {
    title: 'Operational table theme',
    detail: 'Apply a domain-specific theme through named class slots.',
    code: `<BonelessTable
  data={incidents}
  columns={columns}
  className="rounded-xl border-rose-200"
  classNames={{
    toolbar: 'bg-rose-50 text-rose-900',
    headerRow: 'bg-rose-50',
    row: 'hover:bg-rose-50/50',
  }}
/>`,
  },
  {
    title: 'Linked rows',
    detail: 'Keep navigation declarative while preserving accessible row labels.',
    code: `<BonelessTable
  data={deployments}
  columns={columns}
  rowLink={{
    component: Link,
    href: '/deployments/{row.id}',
    label: (row) => \`Open deployment for \${row.service}\`,
  }}
/>`,
  },
] as const

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-md border border-slate-800 bg-slate-950 p-3 text-xs leading-5 text-slate-100">
      <code>{children}</code>
    </pre>
  )
}

export default function ExamplesPage() {
  return (
    <AdminPage title="Table patterns">
      <section>
        <div className="mb-5 flex items-end justify-between gap-4 max-sm:items-start">
          <div>
            <h2 className="text-lg font-bold">Explore table configurations</h2>
            <p className="mt-1 text-slate-500">
              Each screen owns its sample data and column definitions, then explains the settings
              that make the pattern work.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {examples.map((example) => (
            <Link
              href={example.href}
              className="flex min-h-37.5 flex-col justify-between rounded-lg border border-slate-200 bg-white p-4.5 text-slate-800 no-underline shadow-sm hover:border-teal-300 hover:shadow-md"
              key={example.href}
            >
              <strong className="text-[15px]">{example.title}</strong>
              <span className="mt-2 text-slate-500 leading-relaxed">{example.detail}</span>
              <span className="mt-3 font-mono text-[11px] leading-5 text-teal-700">
                Settings: {example.settings}
              </span>
            </Link>
          ))}
        </div>
        <section className="mt-10">
          <div>
            <h2 className="text-lg font-bold">Code samples</h2>
            <p className="mt-1 text-slate-500">
              Reusable patterns for the catalog scenarios previously maintained in Storybook.
            </p>
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {codeSamples.map((sample) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                key={sample.title}
              >
                <h3 className="font-bold text-slate-800">{sample.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{sample.detail}</p>
                <CodeBlock>{sample.code}</CodeBlock>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AdminPage>
  )
}
