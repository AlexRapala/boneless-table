'use client'

import './types'

export {
  BonelessTable,
  type BonelessTableClassNames,
  type BonelessTableFilterPlacement,
  type BonelessTableIcons,
  type BonelessTableOptions,
  type BonelessTablePresentationOptions,
  type BonelessTableProps,
  type BonelessTableRowClickEvent,
  type BonelessTableSlot,
  type BonelessTableTreeOptions,
  type BonelessTableToolbarLayout,
} from './boneless-table'
export {
  compactValue,
  defaultBonelessTableSettings,
  mergeBonelessTableSettings,
  resolveColumnSettings,
  type ColumnAlignment,
  type ColumnBorders,
  type BonelessTableColumnSettings,
  type BonelessTableSettings,
  type FilterType,
  type RevealMode,
} from './settings'
export { defineColumns, getColumnIds, resolveColumns, withDefaultCells } from './columns'
export { ColumnFilter } from './column-filter'
export { ColumnMenu } from './column-menu'
export { TableSkeleton } from './table-skeleton'
export {
  resolveRowHref,
  resolveRowLinkLabel,
  type BonelessTableRowLink,
  type BonelessTableRowLinkComponentProps,
} from './row-link'
export type { BonelessTableColumn, DeepPartial, ResolvedBonelessTableColumn } from './types'

export {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ExpandedState,
  type SortingState,
  type Table,
  type TableOptions,
  type VisibilityState,
} from '@tanstack/react-table'
