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
  X,
} from 'lucide-react'
import {
  BonelessTable as UnstyledBonelessTable,
  type BonelessTableClassNames,
  type BonelessTableIcons,
  type BonelessTableProps,
} from 'boneless-table'
import type { RowData } from '@tanstack/react-table'

const theme: BonelessTableClassNames = {
  root: 'overflow-visible rounded-lg border border-slate-200 bg-white shadow-sm',
  toolbar: 'flex min-h-15 items-center justify-between gap-4 border-b border-slate-200 px-4 py-2.5',
  toolbarSummary: 'flex min-w-0 items-baseline gap-1.5 text-slate-600',
  toolbarHint: 'text-slate-500',
  toolbarActions:
    'flex gap-2 [&>[data-slot=column-settings]]:relative [&>[data-slot=reset]]:inline-flex [&>[data-slot=reset]]:h-8.5 [&>[data-slot=reset]]:items-center [&>[data-slot=reset]]:justify-center [&>[data-slot=reset]]:gap-1.5 [&>[data-slot=reset]]:rounded-md [&>[data-slot=reset]]:border [&>[data-slot=reset]]:border-slate-200 [&>[data-slot=reset]]:bg-white [&>[data-slot=reset]]:px-2.5 [&>[data-slot=reset]]:font-bold [&>[data-slot=reset]]:text-slate-600 [&>[data-slot=tree-toggle-all]]:inline-flex [&>[data-slot=tree-toggle-all]]:h-8.5 [&>[data-slot=tree-toggle-all]]:items-center [&>[data-slot=tree-toggle-all]]:justify-center [&>[data-slot=tree-toggle-all]]:gap-1.5 [&>[data-slot=tree-toggle-all]]:rounded-md [&>[data-slot=tree-toggle-all]]:border [&>[data-slot=tree-toggle-all]]:border-slate-200 [&>[data-slot=tree-toggle-all]]:bg-white [&>[data-slot=tree-toggle-all]]:px-2.5 [&>[data-slot=tree-toggle-all]]:font-bold [&>[data-slot=tree-toggle-all]]:text-slate-600 [&>[data-slot=column-settings]>button]:inline-flex [&>[data-slot=column-settings]>button]:h-8.5 [&>[data-slot=column-settings]>button]:items-center [&>[data-slot=column-settings]>button]:justify-center [&>[data-slot=column-settings]>button]:gap-1.5 [&>[data-slot=column-settings]>button]:rounded-md [&>[data-slot=column-settings]>button]:border [&>[data-slot=column-settings]>button]:border-slate-200 [&>[data-slot=column-settings]>button]:bg-white [&>[data-slot=column-settings]>button]:px-2.5 [&>[data-slot=column-settings]>button]:font-bold [&>[data-slot=column-settings]>button]:text-slate-600',
  scroller: 'overflow-auto bg-white',
  headerGroup: 'bg-slate-50',
  headerRow: 'border-b border-slate-200',
  header:
    'group flex min-w-0 items-center gap-1 overflow-hidden px-2.5 py-2.5 data-[align=right]:justify-end data-[borders=left]:border-l data-[borders=right]:border-r data-[borders=both]:border-x data-[borders=left]:border-slate-200 data-[borders=right]:border-slate-200 data-[borders=both]:border-slate-200',
  headerButton:
    'relative flex min-w-0 flex-1 items-center overflow-hidden border-0 bg-transparent p-0 text-left text-xs font-bold text-slate-600 data-[align=right]:flex-row-reverse data-[align=right]:text-right',
  headerLabel: 'min-w-0 overflow-hidden text-ellipsis whitespace-nowrap',
  sortIndicator:
    'ml-auto grid shrink-0 place-items-center text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-[reveal=always]:opacity-100 data-[align=right]:mr-1 data-[align=right]:ml-0',
  filters: 'flex flex-wrap items-end gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-3',
  filterItem: 'grid min-w-40 flex-1 gap-1 sm:max-w-56',
  filterLabel: 'text-[11px] font-bold text-slate-500',
  row: 'min-h-14.5 border-b border-slate-100 hover:bg-slate-50/60',
  cell: 'flex min-w-0 items-center overflow-hidden px-2.5 py-2 text-ellipsis whitespace-nowrap text-slate-600 data-[align=right]:justify-end data-[align=right]:text-right data-[borders=left]:border-l data-[borders=right]:border-r data-[borders=both]:border-x data-[borders=left]:border-slate-200 data-[borders=right]:border-slate-200 data-[borders=both]:border-slate-200 [&_[data-slot=tree-content]]:flex [&_[data-slot=tree-content]]:min-w-0 [&_[data-slot=tree-content]]:items-center [&_[data-slot=tree-row-toggle]]:grid [&_[data-slot=tree-row-toggle]]:size-5 [&_[data-slot=tree-row-toggle]]:shrink-0 [&_[data-slot=tree-row-toggle]]:place-items-center [&_[data-slot=tree-row-toggle]]:border-0 [&_[data-slot=tree-row-toggle]]:bg-transparent [&_[data-slot=tree-row-toggle]]:p-0 [&_[data-slot=tree-row-toggle]]:text-slate-500 [&_[data-slot=tree-row-toggle-spacer]]:inline-block [&_[data-slot=tree-row-toggle-spacer]]:size-5 [&_[data-slot=tree-row-toggle-spacer]]:shrink-0 [&_[data-slot=tree-value]]:min-w-0 [&_[data-slot=tree-value]]:overflow-hidden [&_[data-slot=tree-value]]:text-ellipsis',
  footer: 'flex min-h-11 items-center border-t border-slate-200 px-4.5 text-xs text-slate-500',
  filter:
    'h-8 min-w-0 rounded-md border border-slate-200 bg-white px-2 text-xs shadow-xs outline-none focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 data-[slot=filter-text]:flex data-[slot=filter-text]:items-center data-[slot=filter-text]:gap-1.5 [&_[data-slot=filter-input]]:w-full [&_[data-slot=filter-input]]:min-w-0 [&_[data-slot=filter-input]]:border-0 [&_[data-slot=filter-input]]:outline-none',
  columnMenu:
    'absolute right-0 z-4 mt-2 max-h-[min(24rem,calc(100dvh-2rem))] w-72 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-xl [&_[data-slot=column-menu-header]]:sticky [&_[data-slot=column-menu-header]]:top-0 [&_[data-slot=column-menu-header]]:z-1 [&_[data-slot=column-menu-header]]:-mx-2 [&_[data-slot=column-menu-header]]:-mt-2 [&_[data-slot=column-menu-header]]:mb-1 [&_[data-slot=column-menu-header]]:flex [&_[data-slot=column-menu-header]]:items-center [&_[data-slot=column-menu-header]]:justify-between [&_[data-slot=column-menu-header]]:border-b [&_[data-slot=column-menu-header]]:border-slate-100 [&_[data-slot=column-menu-header]]:bg-white [&_[data-slot=column-menu-header]]:px-2 [&_[data-slot=column-menu-header]]:py-2 [&_[data-slot=column-menu-header]]:font-bold [&_[data-slot=column-menu-item]]:flex [&_[data-slot=column-menu-item]]:min-h-9 [&_[data-slot=column-menu-item]]:items-center [&_[data-slot=column-menu-item]]:gap-2 [&_[data-slot=column-menu-item]]:rounded [&_[data-slot=column-menu-item]]:px-1 [&_[data-slot=column-menu-item]]:hover:bg-slate-50 [&_[data-slot=column-menu-label]]:flex [&_[data-slot=column-menu-label]]:min-w-0 [&_[data-slot=column-menu-label]]:items-center [&_[data-slot=column-menu-label]]:gap-1.5 [&_[data-slot=column-menu-label]]:truncate [&_[data-slot=column-menu-actions]]:ml-auto [&_[data-slot=column-menu-actions]]:flex [&_[data-slot=column-menu-actions]]:shrink-0 [&_[data-slot=column-menu-actions]_button]:grid [&_[data-slot=column-menu-actions]_button]:size-7 [&_[data-slot=column-menu-actions]_button]:place-items-center [&_[data-slot=column-menu-actions]_button]:rounded [&_[data-slot=column-menu-actions]_button]:p-0 [&_[data-slot=column-menu-actions]_button]:hover:bg-slate-100',
  rowLink: 'block text-inherit no-underline outline-none',
  emptyState: 'p-8 text-center text-sm text-slate-500',
  skeleton:
    'pointer-events-none [&_[data-slot=skeleton-row]]:min-h-14.5 [&_[data-slot=skeleton-row]]:border-b [&_[data-slot=skeleton-row]]:border-slate-100 [&_[data-slot=skeleton-cell]]:flex [&_[data-slot=skeleton-cell]]:items-center [&_[data-slot=skeleton-cell]]:px-2.5 [&_[data-slot=skeleton-line]]:block [&_[data-slot=skeleton-line]]:h-3 [&_[data-slot=skeleton-line]]:w-2/3 [&_[data-slot=skeleton-line]]:animate-pulse [&_[data-slot=skeleton-line]]:rounded [&_[data-slot=skeleton-line]]:bg-slate-100',
}

const themeIcons: BonelessTableIcons = {
  reset: <RotateCcw size={16} />,
  columns: <SlidersHorizontal size={16} />,
  close: <X size={15} />,
  moveEarlier: <ArrowUp size={13} />,
  moveLater: <ArrowDown size={13} />,
  search: <Search size={13} />,
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

function mergeClassNames(overrides?: BonelessTableClassNames): BonelessTableClassNames {
  return Object.fromEntries(
    new Set([...Object.keys(theme), ...Object.keys(overrides ?? {})])
      .values()
      .map((key) => [
        key,
        [
          theme[key as keyof BonelessTableClassNames],
          overrides?.[key as keyof BonelessTableClassNames],
        ]
          .filter(Boolean)
          .join(' '),
      ]),
  ) as BonelessTableClassNames
}

export function BonelessTable<TData extends RowData>({
  classNames,
  icons,
  ...props
}: BonelessTableProps<TData>) {
  return (
    <UnstyledBonelessTable
      {...props}
      classNames={mergeClassNames(classNames)}
      icons={{ ...themeIcons, ...icons }}
    />
  )
}
