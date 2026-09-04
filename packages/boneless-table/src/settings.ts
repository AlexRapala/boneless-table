import type { DeepPartial } from './types'

export type ColumnAlignment = 'left' | 'right'
export type ColumnBorders = 'none' | 'left' | 'right' | 'both'
export type FilterType = 'text' | 'select'
export type RevealMode = 'always' | 'hover'

export type BonelessTableColumnSizing = { widthPx: number } | { minPx: number; flex?: number }

export type BonelessTableColumnSettings = {
  sizing?: BonelessTableColumnSizing
  align?: ColumnAlignment
  borders?: ColumnBorders
  sorting?: { enabled?: boolean; reveal?: RevealMode }
  filtering?: { type: FilterType; options?: readonly string[] }
  valueDisplay?: { truncateAt: number; suffix?: string }
}

export type BonelessTableSettings = {
  columnDefaults: Required<Pick<BonelessTableColumnSettings, 'align' | 'borders'>> & {
    sizing: Required<NonNullable<BonelessTableColumnSettings['sizing']>>
    sorting: Required<NonNullable<BonelessTableColumnSettings['sorting']>>
  }
  interactions: { horizontalOverflow: 'auto' | 'scroll' }
}

export const defaultBonelessTableSettings: BonelessTableSettings = {
  columnDefaults: {
    sizing: { minPx: 120, flex: 1 },
    align: 'left',
    borders: 'none',
    sorting: { enabled: true, reveal: 'hover' },
  },
  interactions: { horizontalOverflow: 'auto' },
}

export function mergeBonelessTableSettings(
  override?: DeepPartial<BonelessTableSettings>,
  base: BonelessTableSettings = defaultBonelessTableSettings,
): BonelessTableSettings {
  if (!override) return base
  return {
    columnDefaults: {
      sizing: {
        ...base.columnDefaults.sizing,
        ...override.columnDefaults?.sizing,
      },
      align: override.columnDefaults?.align ?? base.columnDefaults.align,
      borders: override.columnDefaults?.borders ?? base.columnDefaults.borders,
      sorting: {
        ...base.columnDefaults.sorting,
        ...override.columnDefaults?.sorting,
      },
    },
    interactions: {
      ...base.interactions,
      ...override.interactions,
    },
  }
}

export function resolveColumnSettings(
  settings: BonelessTableSettings,
  column: { columnDef: { meta?: { bonelessTable?: BonelessTableColumnSettings } } },
) {
  const configured = column.columnDef.meta?.bonelessTable
  const configuredSizing = configured?.sizing
  return {
    sizing:
      configuredSizing && 'widthPx' in configuredSizing
        ? { widthPx: configuredSizing.widthPx }
        : { ...settings.columnDefaults.sizing, ...configuredSizing },
    align: configured?.align ?? settings.columnDefaults.align,
    borders: configured?.borders ?? settings.columnDefaults.borders,
    sorting: { ...settings.columnDefaults.sorting, ...configured?.sorting },
    filtering: configured?.filtering,
    valueDisplay: configured?.valueDisplay,
  }
}

export function compactValue(value: unknown, settings?: BonelessTableColumnSettings) {
  const text = value == null ? '' : String(value)
  const display = settings?.valueDisplay
  if (!display || text.length <= display.truncateAt) return text
  return `${text.slice(0, display.truncateAt).trimEnd()}${display.suffix ?? '...'}`
}
