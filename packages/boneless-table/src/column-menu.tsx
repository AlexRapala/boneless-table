import type { Table } from '@tanstack/react-table'
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

export type ColumnMenuIcons = Partial<{
  close: ReactNode
  moveEarlier: ReactNode
  moveLater: ReactNode
}>

export function ColumnMenu<TData>({
  table,
  onClose,
  onMoveColumn,
  className,
  icons,
  id = 'boneless-table-column-menu',
  triggerRef,
}: {
  table: Table<TData>
  onClose: () => void
  onMoveColumn: (id: string, direction: -1 | 1) => void
  className?: string
  /** Optional consumer-owned icons. Text labels remain available without them. */
  icons?: ColumnMenuIcons
  id?: string
  /** The menu trigger is not an outside click; this lets it reliably toggle the dialog closed. */
  triggerRef?: RefObject<HTMLElement | null>
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    function dismissOnOutsideClick(event: MouseEvent) {
      const target = event.target as Node
      if (!menuRef.current?.contains(target) && !triggerRef?.current?.contains(target)) onClose()
    }
    document.addEventListener('mousedown', dismissOnOutsideClick)
    return () => document.removeEventListener('mousedown', dismissOnOutsideClick)
  }, [onClose])

  return (
    <div
      className={className}
      data-slot="column-menu"
      ref={menuRef}
      id={id}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        }
      }}
    >
      <div data-slot="column-menu-header">
        <span id={`${id}-title`}>Configure columns</span>
        <button
          data-slot="column-menu-close"
          onClick={onClose}
          aria-label="Close column settings"
          ref={closeButtonRef}
        >
          {icons?.close ?? 'Close'}
        </button>
      </div>
      {table.getAllLeafColumns().map((column) => (
        <div data-slot="column-menu-item" key={column.id}>
          <label data-slot="column-menu-label">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {column.columnDef.meta?.columnLabel ??
              (typeof column.columnDef.header === 'string' ||
              typeof column.columnDef.header === 'number'
                ? String(column.columnDef.header)
                : column.id)}
          </label>
          <div data-slot="column-menu-actions">
            <button
              data-slot="column-menu-move-earlier"
              onClick={() => onMoveColumn(column.id, -1)}
              title="Move column earlier"
            >
              {icons?.moveEarlier ?? 'Earlier'}
            </button>
            <button
              data-slot="column-menu-move-later"
              onClick={() => onMoveColumn(column.id, 1)}
              title="Move column later"
            >
              {icons?.moveLater ?? 'Later'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
