import { act, fireEvent, render, screen } from '@testing-library/react'
import { getCoreRowModel, type SortingState } from '@tanstack/react-table'
import { useState, type ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getColumnIds, withDefaultCells } from '../src/columns'
import { BonelessTable, type BonelessTableProps } from '../src/boneless-table'
import { resolveRowHref } from '../src/row-link'
import {
  compactValue,
  defaultBonelessTableSettings,
  mergeBonelessTableSettings,
  resolveColumnSettings,
} from '../src/settings'
import type { BonelessTableColumn } from '../src/types'

type Record = { id: string; name: string; team: string; score: number }
type TreeRecord = Record & { children?: TreeRecord[] }

const rows: Record[] = [
  { id: 'one', name: 'Ada', team: 'Platform', score: 42 },
  { id: 'two', name: 'Bryn', team: 'Product', score: 7 },
  { id: 'three', name: 'Cleo', team: 'Platform', score: 18 },
]

const relationshipRows: TreeRecord[] = [
  {
    id: 'arden',
    name: 'Arden',
    team: 'Family',
    score: 60,
    children: [
      { id: 'blair', name: 'Blair', team: 'Family', score: 30 },
      { id: 'casey', name: 'Casey', team: 'Family', score: 28 },
    ],
  },
]

const treeColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'team', header: 'Relationship' },
  { accessorKey: 'score', header: 'Age' },
] satisfies BonelessTableColumn<TreeRecord>[]

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: { bonelessTable: { filtering: { type: 'text', reveal: 'always' } } },
  },
  {
    accessorKey: 'team',
    header: 'Team',
    meta: {
      bonelessTable: {
        filtering: { type: 'select', options: ['Platform', 'Product'], reveal: 'always' },
      },
    },
  },
  { accessorKey: 'score', header: 'Score', meta: { bonelessTable: { align: 'right' } } },
] satisfies BonelessTableColumn<Record>[]

function TestLink({ children, ...props }: ComponentProps<'a'>) {
  return <a {...props}>{children}</a>
}

describe('boneless-table utilities', () => {
  it('deeply merges only supplied presentation settings', () => {
    const settings = mergeBonelessTableSettings({
      columnDefaults: { sizing: { minPx: 200 }, sorting: { reveal: 'always' } },
      interactions: { horizontalOverflow: 'scroll' },
    })
    expect(settings.columnDefaults.sizing).toEqual({ minPx: 200, flex: 1 })
    expect(settings.columnDefaults.sorting).toEqual({ enabled: true, reveal: 'always' })
    expect(settings.interactions).toEqual({ filterReveal: 'hover', horizontalOverflow: 'scroll' })
  })

  it('keeps its base object when no overrides are supplied', () => {
    expect(mergeBonelessTableSettings()).toBe(defaultBonelessTableSettings)
  })

  it('resolves per-column settings over defaults', () => {
    const resolved = resolveColumnSettings(defaultBonelessTableSettings, {
      columnDef: {
        meta: {
          bonelessTable: {
            align: 'right',
            sizing: { minPx: 220 },
            sorting: { enabled: false },
            filtering: { type: 'text' },
          },
        },
      },
    })
    expect(resolved).toMatchObject({
      align: 'right',
      sizing: { minPx: 220, flex: 1 },
      sorting: { enabled: false, reveal: 'hover' },
      filtering: { type: 'text' },
    })
  })

  it('preserves explicit fixed column widths', () => {
    const resolved = resolveColumnSettings(defaultBonelessTableSettings, {
      columnDef: {
        meta: { bonelessTable: { sizing: { widthPx: 34 } } },
      },
    })

    expect(resolved.sizing).toEqual({ widthPx: 34 })
  })

  it('compacts unknown values only when configured', () => {
    expect(compactValue(null)).toBe('')
    expect(compactValue(123)).toBe('123')
    expect(
      compactValue('Central deployment service', { valueDisplay: { truncateAt: 7, suffix: '…' } }),
    ).toBe('Central…')
  })

  it('uses ids, accessor keys, and stable index fallbacks', () => {
    expect(
      getColumnIds([
        { id: 'explicit', header: 'Explicit' },
        { accessorKey: 'name', header: 'Name' },
        { header: 'Fallback' },
      ]),
    ).toEqual(['explicit', 'name', '2'])
  })

  it('uses the friendlier key shorthand for column ids', () => {
    expect(getColumnIds([{ key: 'name', header: 'Name' }])).toEqual(['name'])
  })

  it('preserves custom cells and supplies compact default cells', () => {
    const input = [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'score', header: 'Score', cell: () => 'custom' },
    ] satisfies BonelessTableColumn<Record>[]
    const output = withDefaultCells(input)
    expect(output[1]).toBe(input[1])
    expect(output[0]?.cell).toBeTypeOf('function')
  })

  it('builds row links from templates, nested values, and callbacks', () => {
    expect(resolveRowHref({ href: '/products/{row.id}' }, rows[0]!)).toBe('/products/one')
    expect(resolveRowHref({ href: '/teams/{team}/members/{id}' }, rows[0]!)).toBe(
      '/teams/Platform/members/one',
    )
    expect(resolveRowHref({ href: '/products/{missing}' }, rows[0]!)).toBeUndefined()
    expect(resolveRowHref({ href: (row) => `/scores/${row.score}` }, rows[0]!)).toBe('/scores/42')
  })
})

describe('BonelessTable behavior', () => {
  function renderTable(overrides: Partial<BonelessTableProps<Record>> = {}) {
    return render(
      <BonelessTable
        data={rows}
        columns={columns}
        getCoreRowModel={getCoreRowModel()}
        scroller="auto"
        filterDebounceMs={0}
        {...overrides}
      />,
    )
  }

  it('sorts rows when an enabled header is activated', () => {
    renderTable()
    fireEvent.click(screen.getByRole('button', { name: 'Score' }))
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ada')
    fireEvent.click(screen.getByRole('button', { name: 'Score' }))
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Bryn')
  })

  it('expands tree rows in place and toggles the complete hierarchy from the toolbar', () => {
    render(
      <BonelessTable
        data={relationshipRows}
        columns={treeColumns}
        getSubRows={(row) => row.children}
        tree={{ indentPx: 20 }}
        virtualization={false}
      />,
    )

    expect(screen.queryByText('Blair')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
    expect(screen.getByText('Blair')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="row-group"]')).toHaveStyle({ height: 'auto' })
    expect(screen.getByText('Blair').closest('[data-slot="tree-content"]')).toHaveStyle({
      paddingInlineStart: '20px',
    })
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Collapse row' }))
    expect(screen.queryByText('Blair')).not.toBeInTheDocument()
  })

  it('supports controlled expansion state for tree data', () => {
    function ControlledTree() {
      const [expanded, setExpanded] = useState({})
      return (
        <BonelessTable
          data={relationshipRows}
          columns={treeColumns}
          getSubRows={(row) => row.children}
          tree
          state={{ expanded }}
          onExpandedChange={setExpanded}
          virtualization={false}
        />
      )
    }

    render(<ControlledTree />)
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
    expect(screen.getByText('Blair')).toBeInTheDocument()
  })

  it('renders every grouped header row and exposes sortable table semantics', () => {
    const groupedColumns = [
      {
        header: 'Account details',
        columns: [
          { accessorKey: 'name', header: 'Name' },
          { accessorKey: 'team', header: 'Team' },
        ],
      },
      { accessorKey: 'score', header: 'Score' },
    ] satisfies BonelessTableColumn<Record>[]
    renderTable({ columns: groupedColumns })

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Account details' })).toHaveAttribute(
      'aria-colspan',
      '2',
    )
    const scoreHeader = screen.getByRole('columnheader', { name: 'Score' })
    expect(scoreHeader).toHaveAttribute('aria-sort', 'none')
    fireEvent.click(screen.getByRole('button', { name: 'Score' }))
    expect(scoreHeader).toHaveAttribute('aria-sort', 'descending')
  })

  it('renders content-sized tables in full and virtualizes fill scroll viewports', () => {
    const manyRows = Array.from({ length: 100 }, (_, index) => ({
      id: String(index),
      name: `Account ${index}`,
      team: 'Platform',
      score: index,
    }))
    const { rerender } = renderTable({ data: manyRows })
    expect(screen.getAllByRole('row')).toHaveLength(101)
    rerender(<BonelessTable data={manyRows} columns={columns} scroller="fill" />)
    expect(screen.getAllByRole('row').length).toBeLessThan(101)
  })

  it('filters text and select columns using TanStack state', () => {
    renderTable()
    fireEvent.change(screen.getByRole('textbox', { name: 'Filter name' }), {
      target: { value: 'Ada' },
    })
    expect(screen.getAllByRole('row')).toHaveLength(2)
    fireEvent.change(screen.getByRole('textbox', { name: 'Filter name' }), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter team' }), {
      target: { value: 'Product' },
    })
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Bryn')
  })

  it('debounces text filters before recalculating the row model', () => {
    vi.useFakeTimers()
    const { container } = render(
      <BonelessTable data={rows} columns={columns} scroller="auto" filterDebounceMs={100} />,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Filter name' }), {
      target: { value: 'Ada' },
    })
    expect(container.querySelectorAll('[data-slot="row"]')).toHaveLength(3)
    act(() => vi.advanceTimersByTime(100))
    expect(container.querySelectorAll('[data-slot="row"]')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('calls controlled sorting callbacks without changing externally owned state', () => {
    const onSortingChange = vi.fn()
    renderTable({ state: { sorting: [] }, onSortingChange })
    fireEvent.click(screen.getByRole('button', { name: 'Name' }))
    expect(onSortingChange).toHaveBeenCalledOnce()
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ada')
  })

  it('resets uncontrolled sorting, filters, visibility, and order', () => {
    renderTable()
    fireEvent.click(screen.getByRole('button', { name: 'Name' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Filter name' }), {
      target: { value: 'Ada' },
    })
    fireEvent.click(screen.getByTitle('Reset table settings'))
    expect(screen.getAllByRole('row')).toHaveLength(4)
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ada')
  })

  it('uses an explicit reset callback instead of resetting local table state', () => {
    const onReset = vi.fn()
    renderTable({ onReset })
    fireEvent.click(screen.getByTitle('Reset table settings'))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('toggles column visibility and restores it with the built-in reset', () => {
    renderTable()
    fireEvent.click(screen.getByRole('button', { name: 'Columns' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Team' }))
    expect(screen.queryByRole('columnheader', { name: 'Team' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByTitle('Reset table settings'))
    expect(screen.getByRole('columnheader', { name: /^Team/ })).toBeInTheDocument()
  })

  it('treats the column chooser as a dismissible dialog', () => {
    renderTable()
    const trigger = screen.getByRole('button', { name: 'Columns' })
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Configure columns' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close column settings' })).toHaveFocus()
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes the column chooser when its trigger is activated again', () => {
    renderTable()
    const trigger = screen.getByRole('button', { name: 'Columns' })
    fireEvent.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.mouseDown(trigger)
    fireEvent.click(trigger)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('uses columnLabel or the column id for non-text column chooser headers', () => {
    const menuColumns = [
      { accessorKey: 'name', header: <span>Account name</span>, meta: { columnLabel: 'Account' } },
      { accessorKey: 'team', header: () => <strong>Team header</strong> },
    ] satisfies BonelessTableColumn<Record>[]
    renderTable({ columns: menuColumns })
    fireEvent.click(screen.getByRole('button', { name: 'Columns' }))
    expect(screen.getByRole('checkbox', { name: 'Account' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'team' })).toBeInTheDocument()
  })

  it('reorders columns through the column menu controls', () => {
    renderTable()
    fireEvent.click(screen.getByRole('button', { name: 'Columns' }))
    const moveScoreEarlier = screen.getAllByTitle('Move column earlier')[2]
    fireEvent.click(moveScoreEarlier)
    expect(
      screen
        .getAllByRole('columnheader')
        .map((header) => header.querySelector('button')?.textContent),
    ).toEqual(['Name', 'Score', 'Team'])
  })

  it('announces loading and fetching-more states', () => {
    const { rerender } = renderTable({
      isLoading: true,
      skeletonRows: 2,
      skeletonLabel: 'Loading records',
    })
    expect(screen.getAllByRole('status', { name: 'Loading records' })).toHaveLength(2)
    rerender(
      <BonelessTable
        data={rows}
        columns={columns}
        scroller="auto"
        isFetchingMore
        skeletonLabel="Fetching records"
      />,
    )
    expect(screen.getAllByRole('status', { name: 'Fetching records' })).toHaveLength(3)
    expect(
      screen.getAllByRole('status', { name: 'Fetching records' })[0]?.parentElement,
    ).toHaveAttribute('aria-busy', 'true')
  })

  it('calls onNearEnd when the scroller reaches the configured threshold', () => {
    const onNearEnd = vi.fn()
    const { container } = renderTable({ onNearEnd, nearEndOffset: 30 })
    const scroller = container.querySelector('[data-slot="scroller"]') as HTMLDivElement
    Object.defineProperties(scroller, {
      scrollHeight: { value: 400 },
      scrollTop: { value: 350, writable: true },
      clientHeight: { value: 40 },
    })
    fireEvent.scroll(scroller)
    expect(onNearEnd).toHaveBeenCalledOnce()
    fireEvent.scroll(scroller)
    expect(onNearEnd).toHaveBeenCalledOnce()
  })

  it('does not request more rows when loading is unavailable or already in progress', () => {
    const onNearEnd = vi.fn()
    const { container, rerender } = renderTable({
      onNearEnd,
      canLoadMore: false,
      nearEndOffset: 30,
    })
    const scroller = container.querySelector('[data-slot="scroller"]') as HTMLDivElement
    Object.defineProperties(scroller, {
      scrollHeight: { value: 400 },
      scrollTop: { value: 350, writable: true },
      clientHeight: { value: 40 },
    })
    fireEvent.scroll(scroller)
    expect(onNearEnd).not.toHaveBeenCalled()

    rerender(
      <BonelessTable
        data={rows}
        columns={columns}
        scroller="auto"
        onNearEnd={onNearEnd}
        isFetchingMore
      />,
    )
    fireEvent.scroll(scroller)
    expect(onNearEnd).not.toHaveBeenCalled()
  })

  it('renders a useful default empty state and permits custom empty content', () => {
    const { rerender } = renderTable({ data: [] })
    expect(screen.getByRole('status')).toHaveTextContent('No rows to display.')
    rerender(
      <BonelessTable data={[]} columns={columns} scroller="auto" emptyState="No accounts yet." />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('No accounts yet.')
  })

  it('renders custom toolbar and footer slots with the table instance', () => {
    renderTable({
      toolbar: (table) => <button onClick={() => table.resetSorting()}>Custom reset</button>,
      footer: <footer>Custom footer</footer>,
    })
    expect(screen.getByRole('button', { name: 'Custom reset' })).toBeInTheDocument()
    expect(screen.getByText('Custom footer')).toBeInTheDocument()
    expect(screen.queryByTitle('Reset table settings')).not.toBeInTheDocument()
  })

  it('allows the default toolbar pieces to be repositioned', () => {
    renderTable({
      toolbarLayout: ({ summary, actions }) => (
        <div>
          <div data-testid="custom-actions">{actions}</div>
          <div data-testid="custom-summary">{summary}</div>
        </div>
      ),
    })
    expect(screen.getByTestId('custom-actions')).toHaveTextContent('Reset')
    expect(screen.getByTestId('custom-actions')).toHaveTextContent('Columns')
    expect(screen.getByTestId('custom-summary')).toHaveTextContent('3 rows')
  })

  it('normalizes key shorthand into working TanStack columns', () => {
    renderTable({ columns: [{ key: 'name', header: 'Name' }] })
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
  })

  it('scrolls back to the top when its scroll trigger changes', () => {
    const { container, rerender } = renderTable()
    const scroller = container.querySelector('[data-slot="scroller"]') as HTMLDivElement
    const scrollTo = vi.fn()
    Object.defineProperty(scroller, 'scrollTo', { value: scrollTo })
    rerender(
      <BonelessTable
        data={rows}
        columns={columns}
        getCoreRowModel={getCoreRowModel()}
        scroller="auto"
        scrollToTopOn="first query"
      />,
    )
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 })
  })

  it('does not apply client sorting or filtering when the corresponding modes are manual', () => {
    renderTable({ manualSorting: true, manualFiltering: true })
    fireEvent.click(screen.getByRole('button', { name: 'Score' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Filter name' }), {
      target: { value: 'Ada' },
    })
    expect(screen.getAllByRole('row')).toHaveLength(4)
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ada')
  })

  it('renders navigable row anchors from a data template', () => {
    renderTable({
      rowLink: {
        component: TestLink,
        href: '/products/{row.id}',
        label: (row) => `Open ${row.name}`,
      },
    })
    expect(screen.getByRole('link', { name: 'Open Ada' })).toHaveAttribute('href', '/products/one')
    expect(screen.getByRole('link', { name: 'Open Bryn' })).toHaveAttribute('href', '/products/two')
  })

  it('passes row data to click handlers and supports keyboard activation', () => {
    const onRowClick = vi.fn()
    renderTable({ onRowClick })
    const firstRow = screen.getAllByRole('row')[1]!

    fireEvent.click(firstRow)
    fireEvent.keyDown(firstRow, { key: 'Enter' })

    expect(onRowClick).toHaveBeenCalledTimes(2)
    expect(onRowClick).toHaveBeenNthCalledWith(1, rows[0], expect.any(Object))
    expect(firstRow).toHaveAttribute('tabindex', '0')
  })

  it('supports a screen-controlled sorting state end to end', () => {
    function ControlledTable() {
      const [sorting, setSorting] = useState<SortingState>([])
      return (
        <BonelessTable
          data={rows}
          columns={columns}
          scroller="auto"
          state={{ sorting }}
          onSortingChange={setSorting}
        />
      )
    }
    render(<ControlledTable />)
    fireEvent.click(screen.getByRole('button', { name: 'Score' }))
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ada')
  })
})
