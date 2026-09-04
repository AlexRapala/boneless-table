'use client'

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import {
  BonelessTable,
  type BonelessTableClassNames,
  type BonelessTableColumn,
  type BonelessTableIcons,
} from 'boneless-table'
import { useMemo, useState } from 'react'
import { AdminPage } from '../../../src/components/admin-page'
import { ExampleCode } from '../../../src/components/example-code'
import { ExampleSettings } from '../../../src/components/example-settings'

type Theme = 'material' | 'brutalist'
type Workspace = {
  id: string
  name: string
  owner: string
  status: 'Healthy' | 'At risk' | 'Paused'
  members: number
  usage: number
  updatedAt: string
}

const owners = ['Avery Stone', 'Mina Park', 'Jordan Lee', 'Kai Morgan', 'Riley Chen']
const statuses: Workspace['status'][] = ['Healthy', 'At risk', 'Paused']

function makeWorkspaces(count: number): Workspace[] {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1
    return {
      id: `ws-${number}`,
      name: `Workspace ${String(number).padStart(4, '0')}`,
      owner: owners[index % owners.length]!,
      status: statuses[index % statuses.length]!,
      members: 3 + ((index * 7) % 186),
      usage: 12 + ((index * 13) % 88),
      updatedAt: `${(index % 27) + 1} Aug 2026`,
    }
  })
}

const themes: Record<Theme, BonelessTableClassNames> = {
  material: {
    root: 'h-full min-h-0 overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)]',
    toolbar: 'flex min-h-18 items-center justify-between gap-4 border-b border-slate-100 px-5 py-3',
    toolbarSummary: 'text-sm text-slate-500 [&_strong]:font-bold [&_strong]:text-slate-900',
    toolbarActions:
      'flex items-center gap-2 [&>[data-slot=column-settings]]:relative [&_button]:inline-flex [&_button]:h-9 [&_button]:items-center [&_button]:justify-center [&_button]:gap-1.5 [&_button]:rounded-full [&_button]:px-3 [&_button]:text-sm [&_button]:font-semibold [&_button]:transition [&_button]:hover:bg-slate-100 [&>[data-slot=reset]]:text-slate-600 [&>[data-slot=column-settings]>button]:bg-indigo-600 [&>[data-slot=column-settings]>button]:text-white [&>[data-slot=column-settings]>button:hover]:bg-indigo-700',
    scroller: 'overflow-auto',
    table: 'min-w-[780px]',
    headerGroup: 'sticky top-0 z-10 bg-slate-50/95 backdrop-blur',
    headerRow: 'border-b border-slate-200',
    header: 'group relative flex min-w-0 items-center px-4 py-3 data-[align=right]:justify-end',
    headerButton:
      'flex w-full items-center gap-1 border-0 bg-transparent p-0 text-left text-xs font-bold tracking-wide text-slate-500 uppercase data-[align=right]:flex-row-reverse data-[align=right]:text-right',
    sortIndicator:
      'ml-auto text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-[reveal=always]:opacity-100 data-[align=right]:mr-1 data-[align=right]:ml-0',
    row: 'min-h-16 border-b border-slate-100 transition-colors hover:bg-indigo-50/60 focus-visible:bg-indigo-50',
    cell: 'flex min-w-0 items-center overflow-hidden px-4 py-3 text-sm text-slate-700 data-[align=right]:justify-end data-[align=right]:text-right',
    footer: 'border-t border-slate-100 px-5 py-3 text-xs text-slate-500',
    filter:
      'absolute top-full right-2 left-2 z-20 rounded-xl border border-slate-200 bg-white p-2 shadow-xl data-[reveal=hover]:invisible data-[reveal=hover]:pointer-events-none data-[reveal=hover]:group-hover:visible data-[reveal=hover]:group-hover:pointer-events-auto data-[reveal=hover]:group-focus-within:visible data-[reveal=hover]:group-focus-within:pointer-events-auto [&_[data-slot=filter-text]]:flex [&_[data-slot=filter-text]]:items-center [&_[data-slot=filter-text]]:gap-2 [&_[data-slot=filter-input]]:w-full [&_[data-slot=filter-input]]:border-0 [&_[data-slot=filter-input]]:outline-none [&_[data-slot=filter-select]]:w-full [&_[data-slot=filter-select]]:border-0',
    columnMenu:
      'absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl [&_[data-slot=column-menu-header]]:mb-2 [&_[data-slot=column-menu-header]]:flex [&_[data-slot=column-menu-header]]:items-center [&_[data-slot=column-menu-header]]:justify-between [&_[data-slot=column-menu-item]]:flex [&_[data-slot=column-menu-item]]:items-center [&_[data-slot=column-menu-item]]:gap-2 [&_[data-slot=column-menu-item]]:py-2 [&_[data-slot=column-menu-label]]:flex-1 [&_[data-slot=column-menu-actions]]:flex [&_[data-slot=column-menu-actions]_button]:rounded-full [&_[data-slot=column-menu-actions]_button]:p-1.5 [&_[data-slot=column-menu-actions]_button]:hover:bg-slate-100',
    emptyState: 'p-12 text-center text-sm text-slate-500',
  },
  brutalist: {
    root: 'h-full min-h-0 overflow-visible border-3 border-slate-950 bg-[#fff8e7] shadow-[7px_7px_0_#0f172a]',
    toolbar:
      'flex min-h-18 items-center justify-between gap-4 border-b-3 border-slate-950 bg-[#ffdf3f] px-5 py-3',
    toolbarSummary: 'font-mono text-sm text-slate-950 [&_strong]:text-lg',
    toolbarActions:
      'flex items-center gap-2 [&>[data-slot=column-settings]]:relative [&_button]:inline-flex [&_button]:h-9 [&_button]:items-center [&_button]:justify-center [&_button]:gap-1.5 [&_button]:border-2 [&_button]:border-slate-950 [&_button]:bg-white [&_button]:px-3 [&_button]:font-mono [&_button]:text-xs [&_button]:font-black [&_button]:shadow-[3px_3px_0_#0f172a] [&_button]:transition-transform [&_button]:hover:-translate-y-0.5 [&_button]:active:translate-x-0.5 [&_button]:active:translate-y-0.5 [&_button]:active:shadow-none [&>[data-slot=column-settings]>button]:bg-[#ff6b6b]',
    scroller: 'overflow-auto',
    table: 'min-w-[780px]',
    headerGroup: 'sticky top-0 z-10 bg-[#95e1d3]',
    headerRow: 'border-b-3 border-slate-950',
    header:
      'group relative flex min-w-0 items-center border-r-2 border-slate-950 px-4 py-3 last:border-r-0 data-[align=right]:justify-end',
    headerButton:
      'flex w-full items-center gap-1 border-0 bg-transparent p-0 text-left font-mono text-xs font-black tracking-wide uppercase text-slate-950 data-[align=right]:flex-row-reverse data-[align=right]:text-right',
    sortIndicator:
      'ml-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 data-[reveal=always]:opacity-100 data-[align=right]:mr-1 data-[align=right]:ml-0',
    row: 'min-h-16 border-b-2 border-slate-950 bg-[#fff8e7] hover:bg-[#d6f5ff] focus-visible:bg-[#d6f5ff]',
    cell: 'flex min-w-0 items-center overflow-hidden border-r border-slate-950 px-4 py-3 font-mono text-sm text-slate-950 last:border-r-0 data-[align=right]:justify-end data-[align=right]:text-right',
    footer:
      'border-t-3 border-slate-950 bg-white px-5 py-3 font-mono text-xs font-bold text-slate-950',
    filter:
      'absolute top-full right-1 left-1 z-20 border-2 border-slate-950 bg-white p-2 shadow-[4px_4px_0_#0f172a] data-[reveal=hover]:invisible data-[reveal=hover]:pointer-events-none data-[reveal=hover]:group-hover:visible data-[reveal=hover]:group-hover:pointer-events-auto data-[reveal=hover]:group-focus-within:visible data-[reveal=hover]:group-focus-within:pointer-events-auto [&_[data-slot=filter-text]]:flex [&_[data-slot=filter-text]]:items-center [&_[data-slot=filter-text]]:gap-2 [&_[data-slot=filter-input]]:w-full [&_[data-slot=filter-input]]:border-0 [&_[data-slot=filter-input]]:font-mono [&_[data-slot=filter-input]]:outline-none [&_[data-slot=filter-select]]:w-full [&_[data-slot=filter-select]]:border-0 [&_[data-slot=filter-select]]:font-mono',
    columnMenu:
      'absolute right-0 z-30 mt-2 w-72 border-3 border-slate-950 bg-[#fff8e7] p-3 shadow-[6px_6px_0_#0f172a] [&_[data-slot=column-menu-header]]:mb-2 [&_[data-slot=column-menu-header]]:flex [&_[data-slot=column-menu-header]]:items-center [&_[data-slot=column-menu-header]]:justify-between [&_[data-slot=column-menu-header]]:font-mono [&_[data-slot=column-menu-header]]:font-black [&_[data-slot=column-menu-item]]:flex [&_[data-slot=column-menu-item]]:items-center [&_[data-slot=column-menu-item]]:gap-2 [&_[data-slot=column-menu-item]]:border-t [&_[data-slot=column-menu-item]]:border-slate-950 [&_[data-slot=column-menu-item]]:py-2 [&_[data-slot=column-menu-label]]:flex-1 [&_[data-slot=column-menu-label]]:font-mono [&_[data-slot=column-menu-actions]]:flex [&_[data-slot=column-menu-actions]_button]:border [&_[data-slot=column-menu-actions]_button]:border-slate-950 [&_[data-slot=column-menu-actions]_button]:px-1',
    emptyState: 'p-12 text-center font-mono text-sm font-bold text-slate-950',
  },
}

const icons: BonelessTableIcons = {
  reset: <RotateCcw size={15} />,
  columns: <SlidersHorizontal size={15} />,
  close: <X size={15} />,
  moveEarlier: <ArrowUp size={13} />,
  moveLater: <ArrowDown size={13} />,
  search: <Search size={14} />,
  expand: <ChevronRight size={14} />,
  collapse: <ChevronDown size={14} />,
  sort: (direction) =>
    direction === 'asc' ? (
      <ChevronUp size={14} />
    ) : direction === 'desc' ? (
      <ChevronDown size={14} />
    ) : (
      <ArrowUpDown size={14} />
    ),
}

const code = `<BonelessTable
  data={rows}
  columns={columns}
  classNames={themes[theme]}
  icons={icons}
  scroller="fill"
  virtualization={{ estimateSize: 64, overscan: 12 }}
  totalCount={rows.length}
  resultLabel="workspaces"
  resultHint="virtualized stress dataset"
  onRowClick={setSelected}
  emptyState="No workspaces match these filters."
/>`

function StatusBadge({ status, theme }: Pick<Workspace, 'status'> & { theme: Theme }) {
  const material = {
    Healthy: 'bg-emerald-100 text-emerald-700',
    'At risk': 'bg-amber-100 text-amber-800',
    Paused: 'bg-slate-200 text-slate-600',
  }
  const brutalist = {
    Healthy: 'bg-[#95e1d3]',
    'At risk': 'bg-[#ffdf3f]',
    Paused: 'bg-[#d6d6d6]',
  }
  return (
    <span
      className={
        theme === 'material'
          ? `rounded-full px-2.5 py-1 text-xs font-bold ${material[status]}`
          : `border-2 border-slate-950 px-2 py-0.5 text-xs font-black ${brutalist[status]}`
      }
    >
      {status}
    </span>
  )
}

export default function ThemeLabPage() {
  const [theme, setTheme] = useState<Theme>('material')
  const [selected, setSelected] = useState<Workspace | null>(null)
  const rows = useMemo(() => makeWorkspaces(5_000), [])
  const columns = useMemo<BonelessTableColumn<Workspace>[]>(
    () => [
      {
        key: 'name',
        header: 'Workspace',
        meta: {
          bonelessTable: {
            sizing: { minPx: 230, flex: 2 },
            filtering: { type: 'text', reveal: 'hover' },
          },
        },
      },
      {
        key: 'owner',
        header: 'Owner',
        meta: {
          bonelessTable: {
            sizing: { minPx: 170, flex: 1.2 },
            filtering: { type: 'select', options: owners, reveal: 'hover' },
          },
        },
      },
      {
        key: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <StatusBadge status={getValue<Workspace['status']>()} theme={theme} />
        ),
        meta: {
          bonelessTable: {
            sizing: { minPx: 130, flex: 0.8 },
            filtering: { type: 'select', options: statuses, reveal: 'hover' },
          },
        },
      },
      {
        key: 'members',
        header: 'Members',
        meta: { bonelessTable: { align: 'right', sizing: { minPx: 110, flex: 0.7 } } },
      },
      {
        key: 'usage',
        header: 'Usage',
        cell: ({ getValue }) => `${getValue<number>()}%`,
        meta: { bonelessTable: { align: 'right', sizing: { minPx: 100, flex: 0.7 } } },
      },
      {
        key: 'updatedAt',
        header: 'Updated',
        meta: { bonelessTable: { sizing: { minPx: 130, flex: 0.8 } } },
      },
    ],
    [theme],
  )

  return (
    <AdminPage
      title="Theme and stress lab"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto"
      action={
        <span className="hidden items-center gap-1.5 text-xs font-semibold text-slate-500 sm:flex">
          <Sparkles size={15} className="text-amber-500" /> 5,000 virtual rows
        </span>
      }
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            A stress harness for sorting, filtering, column changes, and variable visual systems.
          </p>
          <ExampleSettings
            items={[
              { name: 'classNames + icons', description: 'replace presentation hooks' },
              { name: 'scroller: fill', description: 'uses the available height' },
              { name: 'virtualization', description: 'renders a small window of 5,000 rows' },
              { name: 'onRowClick', description: 'keeps selection in this screen' },
            ]}
          />
          {selected ? (
            <p className="mt-1 text-xs font-bold text-indigo-600">
              Selected: {selected.name} · {selected.members} members
            </p>
          ) : null}
        </div>
        <div
          className="flex rounded-lg border border-slate-300 bg-white p-1 shadow-sm"
          role="group"
          aria-label="Table theme"
        >
          {(['material', 'brutalist'] as const).map((value) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize transition ${theme === value ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {value === 'brutalist' ? 'Neo-brutalist' : 'Material'}
            </button>
          ))}
        </div>
      </div>
      <div className="h-full min-h-0 shrink-0 pb-1">
        <BonelessTable
          data={rows}
          columns={columns}
          classNames={themes[theme]}
          icons={icons}
          scroller="fill"
          virtualization={{ estimateSize: 64, overscan: 12 }}
          totalCount={rows.length}
          resultLabel="workspaces"
          resultHint="virtualized stress dataset"
          onRowClick={setSelected}
          emptyState="No workspaces match these filters."
        />
      </div>
      <ExampleCode>{code}</ExampleCode>
    </AdminPage>
  )
}
