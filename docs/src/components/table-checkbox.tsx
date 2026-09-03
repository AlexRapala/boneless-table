'use client'

import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react'
import type { BonelessTableColumnSettings } from 'boneless-table'

type TableCheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'ref' | 'type'> & {
  indeterminate?: boolean
}

export const selectionColumnSettings = {
  sizing: { widthPx: 34 },
  align: 'right',
} as const satisfies BonelessTableColumnSettings

export function TableCheckbox({ className, indeterminate = false, ...props }: TableCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      {...props}
      className={`size-3.5 shrink-0 ${className ?? ''}`}
      ref={inputRef}
      type="checkbox"
    />
  )
}
