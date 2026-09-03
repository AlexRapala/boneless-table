import type { BonelessTableClassNames } from './boneless-table'
import { cn } from './class-names'

export function TableSkeleton({
  columnCount,
  rows,
  label = 'Loading rows',
  classNames = {},
}: {
  columnCount: number
  rows: number
  label?: string
  classNames?: Pick<BonelessTableClassNames, 'row' | 'cell' | 'skeleton'>
}) {
  return (
    <div data-slot="skeleton" className={classNames.skeleton} aria-busy="true">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div
          className={classNames.row}
          data-slot="skeleton-row"
          role="status"
          aria-label={label}
          key={rowIndex}
          style={{ display: 'grid', gridTemplateColumns: 'var(--boneless-table-grid)' }}
        >
          {Array.from({ length: columnCount }, (_, columnIndex) => (
            <div className={cn(classNames.cell)} data-slot="skeleton-cell" key={columnIndex}>
              <span data-slot="skeleton-line" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
