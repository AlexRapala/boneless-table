'use client'

import {
  flexRender,
  getExpandedRowModel,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ExpandedState,
  type RowData,
  type SortingState,
  type Table,
  type TableOptions,
  type TableState,
  type VisibilityState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import './types'
import { ColumnFilter } from './column-filter'
import { ColumnMenu, type ColumnMenuIcons } from './column-menu'
import { cn } from './class-names'
import { getColumnIds, resolveColumns, withDefaultCells } from './columns'
import {
  mergeBonelessTableSettings,
  resolveColumnSettings,
  type BonelessTableSettings,
} from './settings'
import { TableSkeleton } from './table-skeleton'
import { resolveRowHref, resolveRowLinkLabel, type BonelessTableRowLink } from './row-link'
import type { BonelessTableColumn, DeepPartial } from './types'

export type BonelessTableToolbarLayout<TData extends RowData> = (context: {
  table: Table<TData>
  summary: ReactNode
  actions: ReactNode
}) => ReactNode

export type BonelessTableSlot<TData extends RowData> =
  boolean | ReactNode | ((table: Table<TData>) => ReactNode)

export type BonelessTableRowClickEvent = MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>

/**
 * Named hooks for your stylesheet. The renderer applies no default class names or visual styles.
 */
export type BonelessTableClassNames = Partial<{
  root: string
  toolbar: string
  toolbarSummary: string
  toolbarHint: string
  toolbarActions: string
  scroller: string
  table: string
  headerGroup: string
  headerRow: string
  header: string
  headerButton: string
  sortIndicator: string
  rowGroup: string
  row: string
  cell: string
  footer: string
  filter: string
  columnMenu: string
  rowLink: string
  emptyState: string
  skeleton: string
}>

/** Optional consumer-owned icons. Omit these for a text-only renderer. */
export type BonelessTableIcons = ColumnMenuIcons & {
  reset?: ReactNode
  columns?: ReactNode
  search?: ReactNode
  sort?: (direction: false | 'asc' | 'desc') => ReactNode
  expand?: ReactNode
  collapse?: ReactNode
}

export type BonelessTableTreeOptions = {
  /** Column that receives the in-cell indentation and row control. Defaults to the first visible column. */
  columnId?: string
  /** Pixel increment per tree level. Indentation stays inside the cell and never changes the grid. */
  indentPx?: number
  expandAllLabel?: string
  collapseAllLabel?: string
}

export type BonelessTablePresentationOptions<TData extends RowData> = {
  settings?: DeepPartial<BonelessTableSettings>
  className?: string
  classNames?: BonelessTableClassNames
  icons?: BonelessTableIcons
  /** Enables nested row controls when used with TanStack's getSubRows option. */
  tree?: boolean | BonelessTableTreeOptions
  isLoading?: boolean
  isFetchingMore?: boolean
  skeletonRows?: number
  skeletonLabel?: string
  onNearEnd?: () => void
  /** Enables onNearEnd. Keep this false while there is no next page or a request is in flight. */
  canLoadMore?: boolean
  nearEndOffset?: number
  /** Delay text-filter updates to avoid recomputing large client-side row models on every keystroke. */
  filterDebounceMs?: number
  /** Content-sized by default. Use fill only inside a parent that provides a stable height. */
  scroller?: 'fill' | 'auto'
  toolbar?: BonelessTableSlot<TData>
  /** Reposition the default summary and action controls without rebuilding their behavior. */
  toolbarLayout?: BonelessTableToolbarLayout<TData>
  footer?: BonelessTableSlot<TData>
  totalCount?: number
  resultLabel?: string
  resultHint?: string
  onReset?: () => void
  onRowClick?: (row: TData, event: BonelessTableRowClickEvent) => void
  scrollToTopOn?: unknown
  rowLink?: BonelessTableRowLink<TData>
  /** Content shown when loading is complete and no rows match the current table state. */
  emptyState?: ReactNode | ((table: Table<TData>) => ReactNode)
  /** Set to false to render every row, or configure virtual rows when scroller is "fill". */
  virtualization?: false | { estimateSize?: number; overscan?: number }
}

/**
 * TanStack options supported by this renderer. Grouping, pagination, selection,
 * pinning, sizing, and faceting are intentionally outside this component's UI contract.
 * Nested expansion is supported through getSubRows together with the tree presentation option.
 */
export type BonelessTableOptions<TData extends RowData> = Omit<
  Pick<
    TableOptions<TData>,
    | 'getRowId'
    | 'getCoreRowModel'
    | 'getFilteredRowModel'
    | 'getSortedRowModel'
    | 'getSubRows'
    | 'onSortingChange'
    | 'onColumnFiltersChange'
    | 'onColumnVisibilityChange'
    | 'onColumnOrderChange'
    | 'onExpandedChange'
    | 'manualSorting'
    | 'manualFiltering'
    | 'enableSorting'
    | 'enableMultiSort'
    | 'enableSortingRemoval'
    | 'enableMultiRemove'
    | 'maxMultiSortColCount'
    | 'filterFromLeafRows'
    | 'maxLeafRowFilterDepth'
    | 'isMultiSortEvent'
    | 'sortDescFirst'
    | 'sortingFns'
    | 'enableFilters'
    | 'filterFns'
    | 'defaultColumn'
    | 'renderFallbackValue'
    | 'meta'
    | 'debugTable'
    | 'debugHeaders'
    | 'debugColumns'
  >,
  'getCoreRowModel' | 'getFilteredRowModel' | 'getSortedRowModel'
> &
  Partial<
    Pick<TableOptions<TData>, 'getCoreRowModel' | 'getFilteredRowModel' | 'getSortedRowModel'>
  > & {
    state?: Partial<
      Pick<
        TableState,
        'sorting' | 'columnFilters' | 'columnVisibility' | 'columnOrder' | 'expanded'
      >
    >
    initialState?: Partial<
      Pick<
        TableState,
        'sorting' | 'columnFilters' | 'columnVisibility' | 'columnOrder' | 'expanded'
      >
    >
  }

export type BonelessTableProps<TData extends RowData> = BonelessTableOptions<TData> &
  BonelessTablePresentationOptions<TData> & {
    data: TData[]
    columns: BonelessTableColumn<TData>[]
  }

function moveItem(order: string[], id: string, direction: -1 | 1) {
  const index = order.indexOf(id)
  const target = index + direction
  if (index < 0 || target < 0 || target >= order.length) return order
  const next = [...order]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function renderSlot<TData extends RowData>(
  slot: BonelessTableSlot<TData> | undefined,
  table: Table<TData>,
  fallback: ReactNode,
) {
  if (slot === false) return null
  if (typeof slot === 'function') return slot(table)
  if (slot && slot !== true) return slot
  return fallback
}

export function BonelessTable<TData extends RowData>({
  data,
  columns,
  settings: settingsOverride,
  className,
  classNames = {},
  icons,
  tree: treeOption,
  isLoading = false,
  isFetchingMore = false,
  skeletonRows = 8,
  skeletonLabel = 'Loading rows',
  onNearEnd,
  canLoadMore = true,
  nearEndOffset = 220,
  filterDebounceMs = 150,
  scroller = 'auto',
  toolbar = true,
  toolbarLayout,
  footer = true,
  totalCount,
  resultLabel = 'rows',
  resultHint,
  onReset,
  onRowClick,
  scrollToTopOn,
  rowLink,
  emptyState,
  virtualization = {},
  ...tableOptions
}: BonelessTableProps<TData>) {
  const settings = useMemo(() => mergeBonelessTableSettings(settingsOverride), [settingsOverride])
  const resolvedColumns = useMemo(() => withDefaultCells(resolveColumns(columns)), [columns])
  const defaultOrder = useMemo(() => getColumnIds(resolvedColumns), [resolvedColumns])
  const scrollerRef = useRef<HTMLDivElement>(null)
  const headerScrollerRef = useRef<HTMLDivElement>(null)
  const columnsButtonRef = useRef<HTMLButtonElement>(null)
  const nearEndTriggeredRef = useRef(false)
  const columnMenuId = useId()
  const [showColumns, setShowColumns] = useState(false)
  const [headerScrollbarGutter, setHeaderScrollbarGutter] = useState(0)
  const [sorting, setSorting] = useState<SortingState>(tableOptions.initialState?.sorting ?? [])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    tableOptions.initialState?.columnFilters ?? [],
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    tableOptions.initialState?.columnVisibility ?? {},
  )
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    tableOptions.initialState?.columnOrder ?? defaultOrder,
  )
  const [expanded, setExpanded] = useState<ExpandedState>(tableOptions.initialState?.expanded ?? {})

  const {
    state: controlledState,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
    onColumnOrderChange,
    onExpandedChange,
    getCoreRowModel: getCoreRowModelOption,
    getSortedRowModel: getSortedRowModelOption,
    getFilteredRowModel: getFilteredRowModelOption,
    getSubRows,
    manualSorting,
    manualFiltering,
    initialState,
    ...restTableOptions
  } = tableOptions

  useEffect(() => {
    if (scrollToTopOn !== undefined) scrollerRef.current?.scrollTo({ top: 0 })
  }, [scrollToTopOn])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const syncHeaderScrollbarGutter = () => {
      setHeaderScrollbarGutter(Math.max(0, scroller.offsetWidth - scroller.clientWidth))
    }
    syncHeaderScrollbarGutter()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(syncHeaderScrollbarGutter)
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [])

  const table = useReactTable({
    ...restTableOptions,
    data,
    columns: resolvedColumns,
    initialState,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      expanded,
      ...controlledState,
    },
    onSortingChange: onSortingChange ?? setSorting,
    onColumnFiltersChange: onColumnFiltersChange ?? setColumnFilters,
    onColumnVisibilityChange: onColumnVisibilityChange ?? setColumnVisibility,
    onColumnOrderChange: onColumnOrderChange ?? setColumnOrder,
    onExpandedChange: onExpandedChange ?? setExpanded,
    getCoreRowModel: getCoreRowModelOption ?? getCoreRowModel(),
    getSortedRowModel: getSortedRowModelOption ?? (manualSorting ? undefined : getSortedRowModel()),
    getFilteredRowModel:
      getFilteredRowModelOption ?? (manualFiltering ? undefined : getFilteredRowModel()),
    getExpandedRowModel: treeOption ? getExpandedRowModel() : undefined,
    getSubRows,
    manualSorting,
    manualFiltering,
  })

  const visibleColumns = table.getVisibleLeafColumns()
  const allColumns = table.getAllFlatColumns()
  const columnSettingsById = useMemo(
    () => new Map(allColumns.map((column) => [column.id, resolveColumnSettings(settings, column)])),
    [allColumns, settings],
  )
  const getColumnSettings = (column: (typeof allColumns)[number]) =>
    columnSettingsById.get(column.id) ?? resolveColumnSettings(settings, column)
  const grid = visibleColumns
    .map((column) => {
      const columnSettings = getColumnSettings(column)
      if ('widthPx' in columnSettings.sizing) return `${columnSettings.sizing.widthPx}px`
      return `minmax(${columnSettings.sizing.minPx}px, ${columnSettings.sizing.flex}fr)`
    })
    .join(' ')
  const minWidth = visibleColumns.reduce((width, column) => {
    const { sizing } = getColumnSettings(column)
    return width + ('widthPx' in sizing ? sizing.widthPx : sizing.minPx)
  }, 0)
  const gridStyle = {
    '--boneless-table-grid': grid,
    minWidth: `${minWidth}px`,
  } as CSSProperties
  const tree: BonelessTableTreeOptions | undefined =
    treeOption === true ? {} : treeOption === false ? undefined : treeOption
  const treeColumnId = tree?.columnId ?? visibleColumns[0]?.id
  const treeIndentPx = tree?.indentPx ?? 16
  const preExpandedRowModel = tree ? table.getPreExpandedRowModel() : undefined
  const expandableRows = useMemo(
    () => preExpandedRowModel?.flatRows.filter((row) => row.getCanExpand()) ?? [],
    [preExpandedRowModel],
  )
  const allTreeRowsExpanded = useMemo(
    () => expandableRows.length > 0 && expandableRows.every((row) => row.getIsExpanded()),
    [expandableRows, expanded],
  )

  useEffect(() => {
    if (!isFetchingMore || !canLoadMore) nearEndTriggeredRef.current = false
  }, [canLoadMore, isFetchingMore])

  function handleScroll() {
    const element = scrollerRef.current
    if (!element) return
    if (headerScrollerRef.current) headerScrollerRef.current.scrollLeft = element.scrollLeft
    const isNearEnd =
      element.scrollHeight - element.scrollTop - element.clientHeight < nearEndOffset
    if (!isNearEnd) {
      nearEndTriggeredRef.current = false
      return
    }
    if (!onNearEnd || !canLoadMore || isFetchingMore || nearEndTriggeredRef.current) return
    nearEndTriggeredRef.current = true
    onNearEnd()
  }

  function resetTable() {
    if (onReset) return onReset()
    table.resetSorting()
    table.resetColumnFilters()
    table.resetColumnVisibility()
    table.setColumnOrder(defaultOrder)
    table.resetExpanded()
  }

  function moveColumn(id: string, direction: -1 | 1) {
    const current = table.getState().columnOrder
    table.setColumnOrder(moveItem(current.length ? current : defaultOrder, id, direction))
  }

  const shown = table.getRowModel().rows.length
  const total = totalCount ?? shown
  const rows = table.getRowModel().rows
  // A content-sized scroller has no bounded vertical viewport, so it must render every row.
  // `fill` establishes the viewport contract by requiring a stable-height parent.
  const isVirtualized = scroller === 'fill' && virtualization !== false
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => (virtualization === false ? 58 : (virtualization.estimateSize ?? 58)),
    overscan: isVirtualized ? (virtualization.overscan ?? 5) : 0,
    enabled: isVirtualized,
    initialRect: { width: 0, height: 600 },
  })
  const estimatedRowSize = virtualization === false ? 58 : (virtualization.estimateSize ?? 58)
  const virtualRows = !isVirtualized
    ? rows.map((row, index) => ({ index, start: index * 58, key: row.id }))
    : rowVirtualizer.getVirtualItems().length > 0
      ? rowVirtualizer.getVirtualItems()
      : rows
          .slice(0, Math.ceil(600 / estimatedRowSize) + (virtualization.overscan ?? 5))
          .map((row, index) => ({
            index,
            start: index * estimatedRowSize,
            key: row.id,
          }))

  function closeColumnMenu() {
    setShowColumns(false)
    columnsButtonRef.current?.focus()
  }

  const toolbarSummary = (
    <div className={classNames.toolbarSummary} data-slot="toolbar-summary">
      <strong>{total.toLocaleString()}</strong> {resultLabel}
      {resultHint ? (
        <span className={classNames.toolbarHint} data-slot="toolbar-hint">
          {resultHint}
        </span>
      ) : null}
    </div>
  )
  const toolbarActions = (
    <div className={classNames.toolbarActions} data-slot="toolbar-actions">
      {tree && expandableRows.length > 0 ? (
        <button
          data-slot="tree-toggle-all"
          onClick={() => table.toggleAllRowsExpanded(!allTreeRowsExpanded)}
        >
          {allTreeRowsExpanded ? icons?.collapse : icons?.expand}
          {allTreeRowsExpanded
            ? (tree.collapseAllLabel ?? 'Collapse all')
            : (tree.expandAllLabel ?? 'Expand all')}
        </button>
      ) : null}
      <button data-slot="reset" onClick={resetTable} title="Reset table settings">
        {icons?.reset}
        Reset
      </button>
      <div data-slot="column-settings">
        <button
          data-slot="columns-button"
          onClick={() => setShowColumns((value) => !value)}
          aria-expanded={showColumns}
          aria-haspopup="dialog"
          aria-controls={columnMenuId}
          ref={columnsButtonRef}
        >
          {icons?.columns}
          Columns
        </button>
        {showColumns ? (
          <ColumnMenu
            table={table}
            onClose={closeColumnMenu}
            onMoveColumn={moveColumn}
            className={classNames.columnMenu}
            icons={icons}
            id={columnMenuId}
            triggerRef={columnsButtonRef}
          />
        ) : null}
      </div>
    </div>
  )
  const defaultToolbar = toolbarLayout ? (
    toolbarLayout({ table, summary: toolbarSummary, actions: toolbarActions })
  ) : (
    <div className={classNames.toolbar} data-slot="toolbar">
      {toolbarSummary}
      {toolbarActions}
    </div>
  )

  const defaultFooter = (
    <footer className={classNames.footer} data-slot="footer">
      Showing {shown.toLocaleString()} of {total.toLocaleString()} {resultLabel}
    </footer>
  )
  const rootStyle =
    scroller === 'fill'
      ? { display: 'flex', flexDirection: 'column' as const, minHeight: 0 }
      : undefined
  const scrollerStyle: CSSProperties = {
    overflowX: settings.interactions.horizontalOverflow,
    ...(scroller === 'fill' ? { flex: '1 1 auto', minHeight: 0, overflowY: 'auto' } : {}),
  }
  const tableStyle: CSSProperties = {
    '--boneless-table-grid': grid,
    ...(scroller === 'fill'
      ? { display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0 }
      : {}),
  } as CSSProperties

  return (
    <div className={cn(className, classNames.root)} data-slot="root" style={rootStyle}>
      {renderSlot(toolbar, table, defaultToolbar)}
      <div
        className={classNames.table}
        data-slot="table"
        style={tableStyle}
        aria-busy={isLoading || isFetchingMore}
        role="table"
      >
        <div
          data-slot="header-scroller"
          ref={headerScrollerRef}
          style={{
            flex: '0 0 auto',
            minWidth: 0,
            overflow: 'hidden',
            paddingInlineEnd: headerScrollbarGutter || undefined,
          }}
        >
          <div
            className={classNames.headerGroup}
            data-slot="header-group"
            role="rowgroup"
            style={gridStyle}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <div
                className={classNames.headerRow}
                data-slot="header-row"
                key={headerGroup.id}
                role="row"
                style={{ display: 'grid', gridTemplateColumns: 'var(--boneless-table-grid)' }}
              >
                {headerGroup.headers.map((header) => {
                  const columnSettings = getColumnSettings(header.column)
                  const direction = header.column.getIsSorted()
                  const isSortable =
                    !header.isPlaceholder &&
                    header.column.getCanSort() &&
                    columnSettings.sorting.enabled
                  return (
                    <div
                      className={classNames.header}
                      data-slot="header"
                      data-align={columnSettings.align}
                      data-borders={columnSettings.borders}
                      key={header.id}
                      role="columnheader"
                      aria-colspan={header.colSpan > 1 ? header.colSpan : undefined}
                      aria-sort={
                        direction === 'asc'
                          ? 'ascending'
                          : direction === 'desc'
                            ? 'descending'
                            : isSortable
                              ? 'none'
                              : undefined
                      }
                      style={{ gridColumn: `span ${header.colSpan}` }}
                    >
                      {header.isPlaceholder ? null : isSortable ? (
                        <button
                          className={classNames.headerButton}
                          data-slot="header-button"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {icons?.sort ? (
                            <span
                              className={classNames.sortIndicator}
                              data-slot="sort-indicator"
                              data-reveal={columnSettings.sorting.reveal}
                            >
                              {icons.sort(direction)}
                            </span>
                          ) : null}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                      {!header.isPlaceholder && columnSettings.filtering ? (
                        <div
                          className={classNames.filter}
                          data-slot="filter"
                          data-reveal={
                            columnSettings.filtering.reveal ?? settings.interactions.filterReveal
                          }
                        >
                          <ColumnFilter
                            column={header.column}
                            settings={columnSettings.filtering}
                            icon={icons?.search}
                            debounceMs={filterDebounceMs}
                          />
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div
          className={classNames.scroller}
          data-slot="scroller"
          ref={scrollerRef}
          onScroll={handleScroll}
          style={scrollerStyle}
        >
          {isLoading ? (
            <TableSkeleton
              columnCount={visibleColumns.length}
              rows={skeletonRows}
              label={skeletonLabel}
              classNames={classNames}
            />
          ) : rows.length === 0 ? (
            <div className={classNames.emptyState} data-slot="empty-state" role="status">
              {emptyState
                ? typeof emptyState === 'function'
                  ? emptyState(table)
                  : emptyState
                : table.getState().columnFilters.length > 0
                  ? 'No rows match the current filters.'
                  : 'No rows to display.'}
            </div>
          ) : (
            <div
              className={classNames.rowGroup}
              data-slot="row-group"
              style={{
                ...gridStyle,
                height: `${isVirtualized ? rowVirtualizer.getTotalSize() : 'auto'}`,
                position: 'relative',
              }}
              role="rowgroup"
            >
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index]!
                const href = rowLink ? resolveRowHref(rowLink, row.original) : undefined
                const RowLink = rowLink?.component
                const rowContent = (
                  <div
                    className={classNames.row}
                    data-slot="row"
                    role="row"
                    style={{ display: 'grid', gridTemplateColumns: 'var(--boneless-table-grid)' }}
                    tabIndex={onRowClick && !href ? 0 : undefined}
                    onClick={(event) => onRowClick?.(row.original, event)}
                    onKeyDown={(event) => {
                      if (!onRowClick || href || (event.key !== 'Enter' && event.key !== ' '))
                        return
                      event.preventDefault()
                      onRowClick(row.original, event)
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const columnSettings = getColumnSettings(cell.column)
                      const title =
                        columnSettings.valueDisplay != null
                          ? String(cell.getValue() ?? '')
                          : undefined
                      const isTreeCell = Boolean(tree && cell.column.id === treeColumnId)
                      const canExpand = row.getCanExpand()
                      const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext())
                      return (
                        <div
                          className={classNames.cell}
                          data-slot="cell"
                          data-align={columnSettings.align}
                          data-borders={columnSettings.borders}
                          role="cell"
                          key={cell.id}
                          title={title}
                        >
                          {isTreeCell ? (
                            <div
                              data-slot="tree-content"
                              style={{ paddingInlineStart: `${row.depth * treeIndentPx}px` }}
                            >
                              {canExpand ? (
                                <button
                                  data-slot="tree-row-toggle"
                                  type="button"
                                  aria-expanded={row.getIsExpanded()}
                                  aria-label={`${row.getIsExpanded() ? 'Collapse' : 'Expand'} row`}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    row.toggleExpanded()
                                  }}
                                >
                                  {row.getIsExpanded()
                                    ? (icons?.collapse ?? '−')
                                    : (icons?.expand ?? '+')}
                                </button>
                              ) : (
                                <span data-slot="tree-row-toggle-spacer" aria-hidden="true" />
                              )}
                              <span data-slot="tree-value">{cellContent}</span>
                            </div>
                          ) : (
                            cellContent
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
                const rowStyle = !isVirtualized
                  ? undefined
                  : {
                      position: 'absolute' as const,
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }
                if (!href || !rowLink || !RowLink || (tree && row.getCanExpand()))
                  return (
                    <div
                      key={row.id}
                      data-index={isVirtualized ? virtualRow.index : undefined}
                      ref={isVirtualized ? rowVirtualizer.measureElement : undefined}
                      style={rowStyle}
                    >
                      {rowContent}
                    </div>
                  )
                return (
                  <div
                    key={row.id}
                    data-index={isVirtualized ? virtualRow.index : undefined}
                    ref={isVirtualized ? rowVirtualizer.measureElement : undefined}
                    style={rowStyle}
                  >
                    <RowLink
                      className={classNames.rowLink ?? ''}
                      href={href}
                      aria-label={resolveRowLinkLabel(rowLink, row.original)}
                      target={rowLink.target}
                      rel={rowLink.rel}
                    >
                      {rowContent}
                    </RowLink>
                  </div>
                )
              })}
            </div>
          )}
          {isFetchingMore ? (
            <TableSkeleton
              columnCount={visibleColumns.length}
              rows={3}
              label={skeletonLabel}
              classNames={classNames}
            />
          ) : null}
        </div>
      </div>
      {renderSlot(footer, table, defaultFooter)}
    </div>
  )
}
