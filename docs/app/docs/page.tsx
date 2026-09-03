import Link from 'next/link'

const install = 'npm install boneless-table'

const quickStart = `import { BonelessTable, type BonelessTableColumn } from 'boneless-table'

type Account = { id: string; name: string; plan: string; spend: number }

const columns: BonelessTableColumn<Account>[] = [
  { key: 'name', header: 'Account', meta: { bonelessTable: { sizing: { minPx: 220, flex: 2 } } } },
  { key: 'plan', header: 'Plan' },
  { key: 'spend', header: 'Monthly spend', meta: { bonelessTable: { align: 'right' } } },
]

const classNames = {
  root: 'rounded-lg border border-slate-200 bg-white',
  toolbar: 'flex items-center justify-between border-b p-3',
  headerRow: 'border-b bg-slate-50',
  header: 'px-3 py-2 font-semibold',
  row: 'border-b hover:bg-slate-50',
  cell: 'px-3 py-2',
}

export function AccountsTable({ data }: { data: Account[] }) {
  return <BonelessTable data={data} columns={columns} classNames={classNames} resultLabel="accounts" />
}`

const toolbarCode = `<BonelessTable
  data={data}
  columns={columns}
  resultLabel="accounts"
  resultHint="Server-side results"
  toolbarLayout={({ summary, actions }) => (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>{actions}</div>
      <div className="text-right">{summary}</div>
    </div>
  )}
/>`

const apiGroups = [
  [
    'Required data',
    'data, columns — rows and column definitions. Use key for a field column; accessorKey is still accepted for TanStack compatibility.',
  ],
  [
    'Column presentation',
    'settings, className, classNames, icons — global defaults and all styling/icon extension points.',
  ],
  [
    'Column meta.bonelessTable',
    'sizing (minPx, flex, widthPx), align, borders, sorting (enabled, reveal), filtering (type, options, reveal), valueDisplay (truncateAt, suffix).',
  ],
  [
    'Toolbar and footer',
    'toolbar, toolbarLayout, footer, resultLabel, resultHint, totalCount, onReset — replace the whole slot or reposition the default summary and actions.',
  ],
  ['Loading and empty data', 'isLoading, isFetchingMore, skeletonRows, skeletonLabel, emptyState.'],
  [
    'Scrolling and virtual rows',
    'scroller, virtualization (estimateSize, overscan), onNearEnd, canLoadMore, nearEndOffset, scrollToTopOn.',
  ],
  ['Rows and navigation', 'getRowId, onRowClick, rowLink (component, href, label, target, rel).'],
  [
    'Tree rows',
    'getSubRows, tree (columnId, indentPx, expandAllLabel, collapseAllLabel), state.expanded, initialState.expanded, onExpandedChange, filterFromLeafRows, maxLeafRowFilterDepth.',
  ],
  [
    'Sorting and filtering',
    'state.sorting, state.columnFilters, initialState, onSortingChange, onColumnFiltersChange, manualSorting, manualFiltering, enableSorting, enableFilters, sortingFns, filterFns, filterDebounceMs, sortDescFirst, enableMultiSort, enableSortingRemoval, enableMultiRemove, maxMultiSortColCount, isMultiSortEvent.',
  ],
  [
    'Column state',
    'state.columnVisibility, state.columnOrder, onColumnVisibilityChange, onColumnOrderChange. The built-in chooser controls both.',
  ],
  [
    'Advanced TanStack options',
    'getCoreRowModel, getSortedRowModel, getFilteredRowModel, defaultColumn, renderFallbackValue, meta, debugTable, debugHeaders, debugColumns.',
  ],
] as const

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
      <code>{children}</code>
    </pre>
  )
}

export default function DocumentationPage() {
  return (
    <main className="min-h-dvh bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a className="font-bold text-lg text-slate-950 no-underline" href="#top">
            boneless-table
          </a>
          <nav className="flex items-center gap-4 text-sm" aria-label="Documentation navigation">
            <a className="text-slate-600 no-underline hover:text-slate-950" href="#quick-start">
              Quick start
            </a>
            <a className="text-slate-600 no-underline hover:text-slate-950" href="#api-reference">
              API
            </a>
            <Link className="text-slate-600 no-underline hover:text-slate-950" href="/examples">
              Examples
            </Link>
          </nav>
        </div>
      </header>
      <div
        className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)]"
        id="top"
      >
        <aside className="hidden lg:block">
          <nav className="sticky top-6 space-y-1" aria-label="On this page">
            {[
              'Introduction',
              'Installation',
              'Quick start',
              'Toolbar layout',
              'Examples',
              'API reference',
              'TanStack Table',
            ].map((item) => (
              <a
                className="block rounded px-2 py-1.5 text-sm text-slate-600 no-underline hover:bg-slate-200 hover:text-slate-950"
                href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>
        <article className="min-w-0 max-w-3xl">
          <section id="introduction">
            <p className="text-xs font-bold tracking-[0.1em] text-teal-700 uppercase">
              React component
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              A styled-by-you data table with TanStack mechanics.
            </h1>
            <p className="mt-5 max-w-2xl leading-7 text-slate-600">
              boneless-table bundles TanStack Table and Virtual, while keeping React as the only
              peer dependency. It supplies the table mechanics, accessible controls, and stable
              structural hooks; your app supplies the visual system.
            </p>
          </section>
          <section className="mt-14" id="installation">
            <h2 className="text-2xl font-bold text-slate-950">Installation</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Install one package. TanStack Table and Virtual are included and re-exported when you
              need their types or helpers.
            </p>
            <CodeBlock>{install}</CodeBlock>
          </section>
          <section className="mt-14" id="quick-start">
            <h2 className="text-2xl font-bold text-slate-950">Quick start</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Use <code>key</code> for the row property, then pass named class slots from the start.
              No CSS framework is required; the utility strings below are only an example.
            </p>
            <CodeBlock>{quickStart}</CodeBlock>
          </section>
          <section className="mt-14" id="toolbar-layout">
            <h2 className="text-2xl font-bold text-slate-950">Arrange the table top bar</h2>
            <p className="mt-3 leading-7 text-slate-600">
              <code>toolbarLayout</code> receives the working default summary and action controls.
              Place them anywhere without reimplementing reset, column visibility, or ordering
              behavior. Use <code>toolbar</code> only when you want to replace the entire top bar.
            </p>
            <CodeBlock>{toolbarCode}</CodeBlock>
          </section>
          <section className="mt-14" id="examples">
            <h2 className="text-2xl font-bold text-slate-950">Runnable examples</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Every example has its configuration notes and a code block beside the live table.
            </p>
            <Link
              className="mt-4 inline-flex rounded-md bg-teal-700 px-3 py-2 text-sm font-bold text-white no-underline hover:bg-teal-800"
              href="/examples"
            >
              Browse all examples
            </Link>
          </section>
          <section className="mt-14" id="api-reference">
            <h2 className="text-2xl font-bold text-slate-950">API reference</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Boneless props are listed below. TanStack options listed here are passed through;
              features without renderer UI are intentionally left to your own composition.
            </p>
            <dl className="mt-5 divide-y rounded-lg border border-slate-200 bg-white text-sm shadow-sm">
              {apiGroups.map(([name, description]) => (
                <div className="grid gap-2 p-4 sm:grid-cols-[12rem_1fr]" key={name}>
                  <dt className="font-mono font-bold text-slate-900">{name}</dt>
                  <dd className="leading-6 text-slate-600">{description}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="mt-14" id="tanstack-table">
            <h2 className="text-2xl font-bold text-slate-950">TanStack Table</h2>
            <p className="mt-3 leading-7 text-slate-600">
              For row-model behavior, column definitions, sorting functions, filter functions, and
              state semantics, use the authoritative{' '}
              <a
                className="font-bold text-teal-700"
                href="https://tanstack.com/table/latest/docs/guide/column-defs"
              >
                TanStack column definitions
              </a>
              ,{' '}
              <a
                className="font-bold text-teal-700"
                href="https://tanstack.com/table/latest/docs/guide/sorting"
              >
                sorting guide
              </a>
              ,{' '}
              <a
                className="font-bold text-teal-700"
                href="https://tanstack.com/table/latest/docs/guide/column-filtering"
              >
                filtering guide
              </a>
              , and{' '}
              <a
                className="font-bold text-teal-700"
                href="https://tanstack.com/table/latest/docs/guide/expanding"
              >
                expanding guide
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}
