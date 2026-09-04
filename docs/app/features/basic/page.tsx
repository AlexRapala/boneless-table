'use client'

import { AdminPage } from '../../../src/components/admin-page'
import { ExampleCode } from '../../../src/components/example-code'
import { ExampleSettings } from '../../../src/components/example-settings'
import { defineColumns } from 'boneless-table'
import { BonelessTable } from '../../../src/components/themed-boneless-table'

type Account = { account: string; plan: string; region: string; spend: string }

const columns = defineColumns<Account>([
  {
    key: 'account',
    header: 'Account',
    meta: {
      bonelessTable: {
        sizing: { minPx: 160, flex: 1 },
        filtering: { type: 'text' },
      },
    },
  },
  {
    key: 'plan',
    header: 'Plan',
    meta: {
      bonelessTable: {
        sizing: { minPx: 160, flex: 1 },
        filtering: { type: 'select', options: ['Enterprise', 'Growth', 'Team'] },
      },
    },
  },
  {
    key: 'region',
    header: 'Region',
    meta: { bonelessTable: { sizing: { minPx: 160, flex: 1 } } },
  },
  {
    key: 'spend',
    header: 'Monthly spend',
    meta: { bonelessTable: { sizing: { minPx: 160, flex: 1 }, align: 'right' } },
  },
])
const rows: Account[] = [
  { account: 'Acme Industries', plan: 'Enterprise', region: 'US East', spend: '$12,400' },
  { account: 'Northstar Labs', plan: 'Growth', region: 'EMEA', spend: '$4,800' },
  { account: 'Juniper Health', plan: 'Team', region: 'US West', spend: '$1,950' },
  { account: 'Cedar & Stone', plan: 'Enterprise', region: 'APAC', spend: '$9,200' },
]

const code = `import { BonelessTable, defineColumns } from 'boneless-table'

type Account = { account: string; plan: string; region: string; spend: string }

const columns = defineColumns<Account>([
  { key: 'account', header: 'Account', meta: { bonelessTable: { sizing: { minPx: 160, flex: 1 }, filtering: { type: 'text' } } } },
  { key: 'plan', header: 'Plan', meta: { bonelessTable: { sizing: { minPx: 160, flex: 1 }, filtering: { type: 'select', options: ['Enterprise', 'Growth', 'Team'] } } } },
  { key: 'region', header: 'Region', meta: { bonelessTable: { sizing: { minPx: 160, flex: 1 } } } },
  { key: 'spend', header: 'Monthly spend', meta: { bonelessTable: { sizing: { minPx: 160, flex: 1 }, align: 'right' } } },
])

export function AccountsTable({ data }: { data: Account[] }) {
  return (
    <BonelessTable
      data={data}
      columns={columns}
      filterPlacement="above"
      resultLabel="accounts"
    />
  )
}`

export default function SimpleTablePage() {
  return (
    <AdminPage title="Table layout">
      <section>
        <h2 className="text-lg font-bold">Full-width simple table</h2>
        <p className="mt-1 max-w-3xl text-slate-500">
          A copyable starting point: four data fields and no screen-owned table state. Sorting and
          column filters have separate regions, and the column menu uses the renderer defaults.
        </p>
        <ExampleSettings
          items={[
            { name: 'sizing.minPx', description: 'keeps every column usable at 160px' },
            { name: 'filters', description: 'accepts built-in, custom, or disabled content' },
            { name: 'filterPlacement', description: 'places controls above or below the table' },
            {
              name: 'sizing.flex',
              description: 'gives all four columns an equal share of spare width',
            },
            { name: "align: 'right'", description: 'aligns the monetary value for scanning' },
          ]}
        />
        <div className="mt-5">
          <BonelessTable
            data={rows}
            columns={columns}
            resultHint="Local example"
            resultLabel="accounts"
          />
        </div>
        <ExampleCode>{code}</ExampleCode>
      </section>
    </AdminPage>
  )
}
