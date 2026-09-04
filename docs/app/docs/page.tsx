import Link from 'next/link'
import { AdminPage } from '../../src/components/admin-page'
import { BonelessTableExample } from '../../src/components/boneless-table-example'

const quickStart = `import { BonelessTable, defineColumns } from 'boneless-table'

type Account = {
  id: string
  name: string
  plan: string
  spend: string
}

const columns = defineColumns<Account>([
  {
    key: 'name',
    header: 'Account',
    meta: { bonelessTable: { filtering: { type: 'text' } } },
  },
  {
    key: 'plan',
    header: 'Plan',
    meta: {
      bonelessTable: {
        filtering: { type: 'select', options: ['Enterprise', 'Growth', 'Team'] },
      },
    },
  },
  {
    key: 'spend',
    header: 'Monthly spend',
    meta: { bonelessTable: { align: 'right' } },
  },
])

export function AccountsTable({ data }: { data: Account[] }) {
  return (
    <BonelessTable
      data={data}
      columns={columns}
      resultLabel="accounts"
    />
  )
}`

const guideGroups = [
  {
    title: 'Getting started',
    guides: [
      {
        href: '/features/basic',
        title: 'Basic table',
        description: 'Define typed columns and render local data with the default controls.',
      },
      {
        href: '/features/server-data',
        title: 'Server data',
        description: 'Control sorting and filtering, load more rows, and add row navigation.',
      },
    ],
  },
  {
    title: 'Columns and values',
    guides: [
      {
        href: '/features/column-layout',
        title: 'Column layout',
        description: 'Configure sizing, alignment, borders, and visual column groups.',
      },
      {
        href: '/features/value-display',
        title: 'Value display',
        description: 'Truncate long values while retaining their complete source content.',
      },
    ],
  },
  {
    title: 'Rows and interaction',
    guides: [
      {
        href: '/features/expanding',
        title: 'Expanding rows',
        description: 'Display nested records and control tree expansion state.',
      },
      {
        href: '/features/editing',
        title: 'Editing and selection',
        description: 'Compose inputs, selection controls, drag handles, and custom actions.',
      },
    ],
  },
  {
    title: 'Advanced',
    guides: [
      {
        href: '/features/virtualization',
        title: 'Virtualization and themes',
        description: 'Render large datasets and apply a complete visual system through slots.',
      },
    ],
  },
] as const

const apiGroups = [
  ['Data', 'data, columns, getRowId, getSubRows'],
  ['Presentation', 'settings, className, classNames, icons, emptyState'],
  ['State', 'state, initialState, sorting, filters, visibility, order, expansion'],
  ['Async data', 'manualSorting, manualFiltering, onNearEnd, canLoadMore, totalCount'],
  ['Rows', 'onRowClick, rowLink, tree, virtualization, scroller'],
  ['Composition', 'toolbar, toolbarLayout, filters, filterPlacement, footer, defaultColumn, meta'],
] as const

const previewColumns = [
  {
    key: 'account',
    header: 'Account',
    settings: { sizing: { minPx: 170, flex: 1.4 }, filtering: { type: 'text' as const } },
  },
  {
    key: 'plan',
    header: 'Plan',
    settings: {
      sizing: { minPx: 120 },
      filtering: {
        type: 'select' as const,
        options: ['Enterprise', 'Growth', 'Team'] as string[],
      },
    },
  },
  {
    key: 'spend',
    header: 'Monthly spend',
    settings: { sizing: { minPx: 140 }, align: 'right' as const },
  },
] as const

const previewRows = [
  { account: 'Acme Industries', plan: 'Enterprise', spend: '$12,400' },
  { account: 'Northstar Labs', plan: 'Growth', spend: '$4,800' },
  { account: 'Juniper Health', plan: 'Team', spend: '$1,950' },
]

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-md border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
      <code>{children}</code>
    </pre>
  )
}

export default function DocumentationPage() {
  return (
    <AdminPage title="boneless-table">
      <article className="mx-auto max-w-4xl pb-16">
        <p className="max-w-3xl border-b border-slate-200 pb-7 leading-6 text-slate-600">
          A typed React renderer built on TanStack Table and TanStack Virtual. It provides table
          mechanics, accessible controls, and stable structural hooks while leaving the visual
          system to your application.
        </p>

        <section className="pt-9" id="installation">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Installation</h2>
          <p className="mt-2 leading-6 text-slate-600">
            Install the package in a React application. TanStack Table and Virtual are included as
            dependencies; React and React DOM are peer dependencies.
          </p>
          <CodeBlock>npm install boneless-table</CodeBlock>
        </section>

        <section className="pt-9" id="quick-start">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Quick start</h2>
          <p className="mt-2 leading-6 text-slate-600">
            Define columns outside the component when possible, then pass rows directly to{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em]">BonelessTable</code>.
            Column presentation belongs in{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em]">
              meta.bonelessTable
            </code>
            .
          </p>
          <CodeBlock>{quickStart}</CodeBlock>
        </section>

        <section className="pt-9" id="live-example">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Live example</h2>
          <p className="mt-2 mb-5 leading-6 text-slate-600">
            This table uses the same three-column configuration shown above. Header sorting and the
            built-in column controls are enabled by default.
          </p>
          <BonelessTableExample
            columns={previewColumns}
            rows={previewRows}
            title="Accounts"
            description="Filter Account or Plan from the labeled controls above the table. Header sorting and right-aligned numeric values remain independent."
          />
        </section>

        <section className="pt-9" id="feature-guides">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Feature guides</h2>
          <p className="mt-2 max-w-3xl leading-6 text-slate-600">
            Each guide contains a focused live example, the relevant configuration, and copyable
            source code.
          </p>
          <div className="mt-7 space-y-8">
            {guideGroups.map((group) => (
              <section key={group.title}>
                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold text-slate-950">
                  {group.title}
                </h3>
                <ul className="divide-y divide-slate-100">
                  {group.guides.map((guide) => (
                    <li className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr]" key={guide.href}>
                      <Link
                        className="font-bold text-teal-700 no-underline hover:underline"
                        href={guide.href}
                      >
                        {guide.title}
                      </Link>
                      <span className="leading-6 text-slate-500">{guide.description}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="pt-9" id="api-reference">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">API overview</h2>
          <p className="mt-2 max-w-3xl leading-6 text-slate-600">
            Props are grouped below by the concern they control. The feature guides show how these
            options work together in complete table configurations. Filters default to a labeled
            region above the scroll area; use <code>filterPlacement</code> to move them below, or
            pass a render function to <code>filters</code> for a completely custom arrangement.
          </p>
          <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {apiGroups.map(([name, values]) => (
              <div className="grid gap-2 py-3.5 sm:grid-cols-[10rem_1fr]" key={name}>
                <dt className="font-bold text-slate-900">{name}</dt>
                <dd className="font-mono text-xs leading-6 text-slate-500">{values}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pt-9" id="tanstack-table">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">TanStack Table</h2>
          <p className="mt-2 leading-6 text-slate-600">
            For details about row models, column definitions, state semantics, sorting functions,
            and filter functions, refer to the{' '}
            <a
              className="font-semibold text-teal-700 hover:underline"
              href="https://tanstack.com/table/latest/docs"
            >
              TanStack Table documentation
            </a>
            .
          </p>
        </section>
      </article>
    </AdminPage>
  )
}
