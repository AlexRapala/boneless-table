import type { RowData } from '@tanstack/react-table'
import type { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react'

export type BonelessTableRowLinkComponentProps = {
  children: ReactNode
  className: string
  href: string
  'aria-label'?: string
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  rel?: string
}

export type BonelessTableRowLink<TData extends RowData> = {
  /** A framework-specific component such as Next.js Link that wraps each resolved row. */
  component: ComponentType<BonelessTableRowLinkComponentProps>
  href: string | ((row: TData) => string | undefined)
  label?: string | ((row: TData) => string | undefined)
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  rel?: string
}

function readPath(row: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, row)
}

export function resolveRowHref<TData extends RowData>(
  link: Pick<BonelessTableRowLink<TData>, 'href'>,
  row: TData,
): string | undefined {
  if (typeof link.href === 'function') return link.href(row)

  let hasMissingValue = false
  const href = link.href.replace(/\{(?:row\.)?([\w.]+)\}/g, (token, path: string) => {
    const value = readPath(row, path)
    if (value === undefined || value === null) {
      hasMissingValue = true
      return token
    }
    return encodeURIComponent(String(value))
  })

  return hasMissingValue ? undefined : href
}

export function resolveRowLinkLabel<TData extends RowData>(
  link: Pick<BonelessTableRowLink<TData>, 'label'>,
  row: TData,
): string | undefined {
  return typeof link.label === 'function' ? link.label(row) : link.label
}
