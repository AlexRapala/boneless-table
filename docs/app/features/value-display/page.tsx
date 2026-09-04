'use client'

import { AdminPage } from '../../../src/components/admin-page'
import { ExampleCode } from '../../../src/components/example-code'
import { ExampleSettings } from '../../../src/components/example-settings'
import { defineColumns } from 'boneless-table'
import { BonelessTable } from '../../../src/components/themed-boneless-table'

type Project = { project: string; summary: string; owner: string }

const columns = defineColumns<Project>([
  {
    key: 'project',
    header: 'Project',
    meta: { bonelessTable: { sizing: { minPx: 180 } } },
  },
  {
    key: 'summary',
    header: 'Summary',
    meta: {
      bonelessTable: {
        sizing: { minPx: 260, flex: 1.8 },
        valueDisplay: { truncateAt: 38, suffix: '...' },
      },
    },
  },
  { key: 'owner', header: 'Owner', meta: { bonelessTable: { sizing: { minPx: 150 } } } },
])
const rows: Project[] = [
  {
    project: 'Apollo migration',
    summary: 'Move legacy account imports to a versioned server-side pipeline with audit coverage.',
    owner: 'Maya Chen',
  },
  {
    project: 'Observability',
    summary:
      'Add live account health indicators and configurable escalation rules for operational teams.',
    owner: 'Marcus Reed',
  },
  {
    project: 'Partner launch',
    summary:
      'Coordinate enablement materials, support coverage, and organization provisioning for the launch cohort.',
    owner: 'Sofia Santos',
  },
]

const code = `import { BonelessTable, defineColumns } from 'boneless-table'

const columns = defineColumns<Project>([
  { key: 'project', header: 'Project', meta: { bonelessTable: { sizing: { minPx: 180 } } } },
  {
    key: 'summary',
    header: 'Summary',
    meta: { bonelessTable: { sizing: { minPx: 260, flex: 1.8 }, valueDisplay: { truncateAt: 38, suffix: '...' } } },
  },
  { key: 'owner', header: 'Owner', meta: { bonelessTable: { sizing: { minPx: 150 } } } },
])

<BonelessTable data={projects} columns={columns} resultLabel="projects" />`

export default function TruncationTablePage() {
  return (
    <AdminPage title="Project summaries">
      <section>
        <h2 className="text-lg font-bold">Configurable value threshold</h2>
        <p className="mt-1 max-w-3xl text-slate-500">
          A concise project table where long summaries are shortened without changing the underlying
          value. Hover a shortened cell to see its full title.
        </p>
        <ExampleSettings
          items={[
            { name: 'valueDisplay.truncateAt: 38', description: 'limits the visible summary text' },
            {
              name: "valueDisplay.suffix: '...'",
              description: 'marks a value that has been shortened',
            },
            { name: 'sizing.flex: 1.8', description: 'prioritizes summary width' },
          ]}
        />
        <div className="mt-5">
          <BonelessTable
            data={rows}
            columns={columns}
            resultHint="Local example"
            resultLabel="projects"
          />
        </div>
        <ExampleCode>{code}</ExampleCode>
      </section>
    </AdminPage>
  )
}
