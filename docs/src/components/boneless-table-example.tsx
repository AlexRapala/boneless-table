'use client'

import { useMemo } from 'react'
import { defineColumns, type BonelessTableColumnSettings } from 'boneless-table'
import { BonelessTable } from './themed-boneless-table'

export type BonelessTableExampleColumn<T extends Record<string, string>> = {
  key: keyof T & string
  header: string
  settings?: BonelessTableColumnSettings
}

type BonelessTableExampleProps<T extends Record<string, string>> = {
  columns: readonly BonelessTableExampleColumn<T>[]
  rows: readonly T[]
  title: string
  description: string
}

export function BonelessTableExample<T extends Record<string, string>>({
  columns,
  rows,
  title,
  description,
}: BonelessTableExampleProps<T>) {
  const columnDefs = useMemo(
    () =>
      defineColumns<T>(
        columns.map((column) => ({
          accessorKey: column.key,
          header: column.header,
          meta: { bonelessTable: column.settings },
        })),
      ),
    [columns],
  )

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4 max-sm:items-start">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-slate-500">{description}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 max-sm:hidden">
          <i className="size-1.5 rounded-full bg-emerald-500" />
          Table pattern
        </span>
      </div>
      <BonelessTable
        data={[...rows]}
        columns={columnDefs}
        toolbar={false}
        footer={false}
        scroller="auto"
      />
    </section>
  )
}
