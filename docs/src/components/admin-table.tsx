'use client'

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  defineColumns,
  type BonelessTableColumn,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from 'boneless-table'
import { BonelessTable } from './themed-boneless-table'
import { ExampleSettings } from './example-settings'
import { options, type Account, type AccountsPage } from '../mockAdminApi'

const initialOrder = [
  'name',
  'email',
  'role',
  'department',
  'status',
  'plan',
  'seats',
  'spend',
  'region',
  'lastSeen',
]
export const accountExampleCode = `const [sorting, setSorting] = useState<SortingState>([{ id: 'lastSeen', desc: true }])
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

<BonelessTable
  data={rows}
  columns={columns}
  scroller="fill"
  state={{ sorting, columnFilters, columnVisibility, columnOrder }}
  onSortingChange={setSorting}
  onColumnFiltersChange={setColumnFilters}
  manualSorting
  manualFiltering
  onNearEnd={loadMore}
  rowLink={{ component: Link, href: '/features/server-data/{row.id}', label: (row) => \`Open \${row.name}\` }}
  resultLabel="accounts"
  resultHint="Server-side results"
/>`
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(iso),
  )
const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

function StatusPill({ status }: { status: Account['status'] }) {
  const colors = {
    Active: 'bg-emerald-100 text-emerald-800',
    Invited: 'bg-amber-100 text-amber-800',
    Suspended: 'bg-red-100 text-red-800',
    Archived: 'bg-slate-200 text-slate-600',
  }
  return (
    <span
      className={`inline-flex w-max items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${colors[status]}`}
    >
      {status}
    </span>
  )
}

export function AdminTable() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'lastSeen', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState(initialOrder)

  const columns = useMemo(
    () =>
      defineColumns<Account>([
        {
          key: 'name',
          header: 'Account',
          cell: ({ row }) => (
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid size-7.5 shrink-0 place-items-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-800">
                {row.original.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </span>
              <span className="min-w-0 overflow-hidden">
                <strong className="block overflow-hidden text-[13px] text-ellipsis whitespace-nowrap text-slate-800">
                  {row.original.name}
                </strong>
                <small className="mt-0.5 block overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-slate-400">
                  {row.original.id}
                </small>
              </span>
            </div>
          ),
          meta: {
            bonelessTable: { sizing: { minPx: 210, flex: 1.7 }, filtering: { type: 'text' } },
          },
        },
        {
          key: 'email',
          header: 'Email',
          meta: {
            bonelessTable: { sizing: { minPx: 230, flex: 1.7 }, filtering: { type: 'text' } },
          },
        },
        {
          key: 'role',
          header: 'Role',
          meta: {
            bonelessTable: {
              sizing: { minPx: 145 },
              filtering: { type: 'select', options: options.roles },
            },
          },
        },
        {
          key: 'department',
          header: 'Department',
          meta: {
            bonelessTable: {
              sizing: { minPx: 140 },
              filtering: { type: 'select', options: options.departments },
            },
          },
        },
        {
          key: 'status',
          header: 'Status',
          cell: ({ getValue }) => <StatusPill status={getValue<Account['status']>()} />,
          meta: {
            bonelessTable: {
              sizing: { minPx: 120, flex: 0.8 },
              filtering: { type: 'select', options: options.statuses },
            },
          },
        },
        {
          key: 'plan',
          header: 'Plan',
          meta: {
            bonelessTable: {
              sizing: { minPx: 125, flex: 0.8 },
              filtering: { type: 'select', options: options.plans },
            },
          },
        },
        {
          key: 'seats',
          header: 'Seats',
          meta: {
            bonelessTable: {
              sizing: { minPx: 120, flex: 0.55 },
              align: 'right',
              filtering: { type: 'text' },
            },
          },
        },
        {
          key: 'spend',
          header: 'Monthly spend',
          cell: ({ getValue }) => formatMoney(getValue<number>()),
          meta: {
            bonelessTable: {
              sizing: { minPx: 145, flex: 0.9 },
              align: 'right',
              borders: 'right',
              filtering: { type: 'text' },
            },
          },
        },
        {
          key: 'region',
          header: 'Region',
          meta: {
            bonelessTable: {
              sizing: { minPx: 120, flex: 0.8 },
              filtering: { type: 'select', options: options.regions },
            },
          },
        },
        {
          key: 'lastSeen',
          header: 'Last seen',
          cell: ({ getValue }) => formatDate(getValue<string>()),
          meta: {
            bonelessTable: { sizing: { minPx: 132, flex: 0.8 }, filtering: { type: 'text' } },
          },
        },
      ] satisfies BonelessTableColumn<Account>[]),
    [],
  )

  const accountsQuery = useInfiniteQuery({
    queryKey: ['accounts', { sorting, columnFilters }],
    initialPageParam: 0,
    queryFn: async ({ pageParam }): Promise<AccountsPage> => {
      const params = new URLSearchParams({
        cursor: String(pageParam),
        limit: '40',
        sorting: JSON.stringify(sorting),
        filters: JSON.stringify(columnFilters),
      })
      const response = await fetch(`/api/accounts?${params}`)
      if (!response.ok) throw new Error('Request failed')
      return (await response.json()) as AccountsPage
    },
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

  const rows = useMemo(
    () => accountsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [accountsQuery.data],
  )
  const total = accountsQuery.data?.pages[0]?.meta.totalCount ?? 0

  function loadMore() {
    if (accountsQuery.hasNextPage && !accountsQuery.isFetchingNextPage) {
      void accountsQuery.fetchNextPage()
    }
  }

  function resetTable() {
    setSorting([{ id: 'lastSeen', desc: true }])
    setColumnFilters([])
    setColumnVisibility({})
    setColumnOrder(initialOrder)
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="mb-5 flex shrink-0 items-end justify-between gap-4 max-sm:items-start">
        <div>
          <h2 className="text-lg font-bold">Directory</h2>
          <p className="mt-1 text-slate-500">Manage people and access across the workspace.</p>
          <ExampleSettings
            items={[
              { name: 'controlled state', description: 'mirrors query parameters' },
              { name: 'manual sorting + filtering', description: 'delegate work to the API' },
              { name: 'onNearEnd', description: 'fetches another page' },
              { name: 'rowLink', description: 'makes each account navigable' },
            ]}
          />
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 max-sm:hidden">
          <i className="size-1.5 rounded-full bg-emerald-500" />
          Live data
        </span>
      </div>
      <BonelessTable
        className="min-h-0 flex-1 flex-col"
        data={rows}
        columns={columns}
        scroller="fill"
        state={{ sorting, columnFilters, columnVisibility, columnOrder }}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onColumnVisibilityChange={setColumnVisibility}
        onColumnOrderChange={setColumnOrder}
        manualSorting
        manualFiltering
        isLoading={accountsQuery.isPending}
        isFetchingMore={accountsQuery.isFetchingNextPage}
        onNearEnd={loadMore}
        totalCount={total}
        resultLabel="accounts"
        resultHint="Server-side results"
        onReset={resetTable}
        skeletonLabel="Loading account"
        scrollToTopOn={JSON.stringify({ sorting, columnFilters })}
        rowLink={{
          component: Link,
          href: '/features/server-data/{row.id}',
          label: (account) => `Open ${account.name}'s account details`,
        }}
      />
    </section>
  )
}
