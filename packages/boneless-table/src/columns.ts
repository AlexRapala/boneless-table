import type { RowData } from '@tanstack/react-table'
import { compactValue } from './settings'
import type { BonelessTableColumn, ResolvedBonelessTableColumn } from './types'

export function defineColumns<TData extends RowData>(
  columns: BonelessTableColumn<TData>[],
): BonelessTableColumn<TData>[] {
  return columns
}

export function resolveColumns<TData extends RowData>(
  columns: BonelessTableColumn<TData>[],
): ResolvedBonelessTableColumn<TData>[] {
  return columns.map((column) => {
    if ('key' in column && column.key) {
      const { key, ...definition } = column
      return { ...definition, accessorKey: key } as ResolvedBonelessTableColumn<TData>
    }
    return column as ResolvedBonelessTableColumn<TData>
  })
}

export function withDefaultCells<TData extends RowData>(
  columns: ResolvedBonelessTableColumn<TData>[],
): ResolvedBonelessTableColumn<TData>[] {
  return columns.map((column) => {
    if (column.cell) return column
    return {
      ...column,
      cell: ({ getValue, column: tableColumn }) => {
        const text = compactValue(getValue(), tableColumn.columnDef.meta?.bonelessTable)
        return text
      },
    }
  })
}

export function getColumnIds<TData extends RowData>(
  columns: BonelessTableColumn<TData>[],
): string[] {
  return columns.map((column, index) => {
    if ('id' in column && column.id) return column.id
    if ('key' in column && column.key != null) return String(column.key)
    if ('accessorKey' in column && column.accessorKey != null) {
      return String(column.accessorKey)
    }
    return String(index)
  })
}
