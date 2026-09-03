import type { ColumnDef, RowData } from '@tanstack/react-table'
import type { BonelessTableColumnSettings } from './settings'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    bonelessTable?: BonelessTableColumnSettings
    /** Accessible label used for this column in the built-in column chooser. */
    columnLabel?: string
  }
}

/**
 * A friendlier column input: use `key` for a data property instead of TanStack's `accessorKey`.
 * `accessorKey` remains accepted for interoperability with existing TanStack column definitions.
 */
export type BonelessTableColumn<TData extends RowData, TValue = unknown> =
  | ColumnDef<TData, TValue>
  | (Omit<ColumnDef<TData, TValue>, 'accessorKey'> & { key: keyof TData & string })

export type ResolvedBonelessTableColumn<TData extends RowData, TValue = unknown> = ColumnDef<
  TData,
  TValue
>

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
