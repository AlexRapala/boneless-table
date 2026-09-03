import type { Column, RowData } from '@tanstack/react-table'
import { useEffect, useState, type ReactNode } from 'react'
import type { BonelessTableColumnSettings } from './settings'

export function ColumnFilter<TData extends RowData>({
  column,
  settings,
  className,
  icon,
  debounceMs = 0,
}: {
  column: Column<TData, unknown>
  settings: NonNullable<BonelessTableColumnSettings['filtering']>
  className?: string
  /** Optional consumer-owned icon rendered before a text input. */
  icon?: ReactNode
  debounceMs?: number
}) {
  const value = String(column.getFilterValue() ?? '')
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (settings.type !== 'text' || inputValue === value) return
    if (debounceMs <= 0) {
      column.setFilterValue(inputValue || undefined)
      return
    }
    const timer = window.setTimeout(
      () => column.setFilterValue(inputValue || undefined),
      debounceMs,
    )
    return () => window.clearTimeout(timer)
  }, [column, debounceMs, inputValue, settings.type, value])

  if (settings.type === 'select') {
    return (
      <select
        className={className}
        data-slot="filter-select"
        aria-label={`Filter ${column.id}`}
        value={value}
        onChange={(event) => column.setFilterValue(event.target.value || undefined)}
      >
        <option value="">All</option>
        {settings.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }
  return (
    <label className={className} data-slot="filter-text">
      {icon}
      <input
        data-slot="filter-input"
        aria-label={`Filter ${column.id}`}
        value={inputValue}
        placeholder="Filter"
        onChange={(event) => setInputValue(event.target.value)}
      />
    </label>
  )
}
