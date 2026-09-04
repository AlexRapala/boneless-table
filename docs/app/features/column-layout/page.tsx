'use client'

import { AdminPage } from '../../../src/components/admin-page'
import { ExampleCode } from '../../../src/components/example-code'
import { ExampleSettings } from '../../../src/components/example-settings'
import type { BonelessTableColumn } from 'boneless-table'
import { BonelessTable } from '../../../src/components/themed-boneless-table'

type Account = {
  account: string
  region: string
  owner: string
  plan: string
  health: string
  renewal: string
}

const columns = [
  {
    key: 'account',
    header: 'Account',
    meta: { bonelessTable: { sizing: { minPx: 180, flex: 1.2 } } },
  },
  { key: 'region', header: 'Region', meta: { bonelessTable: { sizing: { minPx: 125 } } } },
  {
    key: 'owner',
    header: 'Owner',
    meta: { bonelessTable: { sizing: { minPx: 145 }, borders: 'left' } },
  },
  { key: 'plan', header: 'Plan', meta: { bonelessTable: { sizing: { minPx: 120 } } } },
  {
    key: 'health',
    header: 'Account health',
    meta: { bonelessTable: { sizing: { minPx: 145 }, borders: 'right' } },
  },
  {
    key: 'renewal',
    header: 'Renewal',
    meta: { bonelessTable: { sizing: { minPx: 140 }, align: 'right' } },
  },
] satisfies BonelessTableColumn<Account>[]
const rows: Account[] = [
  {
    account: 'Sable & Co.',
    region: 'US East',
    owner: 'Maya Chen',
    plan: 'Enterprise',
    health: 'On track',
    renewal: 'Oct 14, 2026',
  },
  {
    account: 'Orbit Labs',
    region: 'EMEA',
    owner: 'Renee Ibrahim',
    plan: 'Growth',
    health: 'Needs review',
    renewal: 'Nov 02, 2026',
  },
  {
    account: 'Hawthorne',
    region: 'APAC',
    owner: 'Theo Foster',
    plan: 'Team',
    health: 'On track',
    renewal: 'Dec 18, 2026',
  },
]

const code = `import { BonelessTable, type BonelessTableColumn } from 'boneless-table'

const columns = [
  { key: 'account', header: 'Account', meta: { bonelessTable: { sizing: { minPx: 180, flex: 1.2 } } } },
  { key: 'region', header: 'Region', meta: { bonelessTable: { sizing: { minPx: 125 } } } },
  { key: 'owner', header: 'Owner', meta: { bonelessTable: { sizing: { minPx: 145 }, borders: 'left' } } },
  { key: 'plan', header: 'Plan', meta: { bonelessTable: { sizing: { minPx: 120 } } } },
  { key: 'health', header: 'Account health', meta: { bonelessTable: { sizing: { minPx: 145 }, borders: 'right' } } },
  { key: 'renewal', header: 'Renewal', meta: { bonelessTable: { sizing: { minPx: 140 }, align: 'right' } } },
] satisfies BonelessTableColumn<Account>[]

<BonelessTable data={accounts} columns={columns} resultLabel="accounts" />`

export default function GroupedTablePage() {
  return (
    <AdminPage title="Account details">
      <section>
        <h2 className="text-lg font-bold">Selective grouping borders</h2>
        <p className="mt-1 max-w-3xl text-slate-500">
          Owner, Plan, and Account health form one visual group. The border settings go only on its
          outer columns, so the related fields read as one unit.
        </p>
        <ExampleSettings
          items={[
            { name: "borders: 'left'", description: 'starts the related-field group at Owner' },
            { name: "borders: 'right'", description: 'ends it at Account health' },
            { name: 'sizing.flex', description: 'lets the account name use remaining space' },
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
