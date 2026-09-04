'use client'

import { useMemo, useState } from 'react'
import { defineColumns, type ExpandedState, type SortingState } from 'boneless-table'
import { AdminPage } from '../../../src/components/admin-page'
import { ExampleCode } from '../../../src/components/example-code'
import { ExampleSettings } from '../../../src/components/example-settings'
import { BonelessTable } from '../../../src/components/themed-boneless-table'

type FamilyMember = {
  id: string
  name: string
  relationship: 'Root' | 'Child' | 'Grandchild' | 'Great-grandchild' | 'Descendant'
  generation: number
  location: string
  children?: FamilyMember[]
}

const names = ['Mira', 'Nora', 'Owen', 'Priya', 'Ravi', 'June', 'Theo', 'Zoe', 'Arden', 'Blair']
const surnames = [
  'Hart',
  'Hale',
  'Park way too long but it has to show it',
  'Rowe',
  'Stone',
  'Vega',
  'Wells',
  'Young',
]
const locations = ['Chicago', 'Austin', 'Seattle', 'Denver', 'Boston', 'Portland']
const relationships: FamilyMember['relationship'][] = [
  'Root',
  'Child',
  'Grandchild',
  'Great-grandchild',
  'Descendant',
]

function createFamily(size: number): FamilyMember[] {
  const roots = Array.from({ length: 8 }, (_, index): FamilyMember => ({
    id: `member-${index + 1}`,
    name: `${names[index % names.length]} ${surnames[index % surnames.length]}`,
    relationship: 'Root',
    generation: 1,
    location: locations[index % locations.length]!,
  }))
  function createMember(index: number, generation: number): FamilyMember {
    return {
      id: `member-${index + 1}`,
      name: `${names[index % names.length]} ${surnames[(index * 3) % surnames.length]}`,
      relationship: relationships[Math.min(generation - 1, relationships.length - 1)]!,
      generation,
      location: locations[(index * 5) % locations.length]!,
    }
  }

  let nextIndex = roots.length
  // Keep the deep lineage under the final root so it is easy to find in the example.
  let ancestor = roots[roots.length - 1]!
  for (let generation = 2; generation <= 20; generation += 1) {
    const descendant = createMember(nextIndex, generation)
    nextIndex += 1
    ancestor.children = [descendant]
    ancestor = descendant
  }

  const availableParentSlots = roots.flatMap((root) => Array.from({ length: 4 }, () => root))

  for (; nextIndex < size; nextIndex += 1) {
    const parent = availableParentSlots.shift()
    if (!parent) break
    const generation = parent.generation + 1
    const member = createMember(nextIndex, generation)
    parent.children = [...(parent.children ?? []), member]
    if (generation < 20) availableParentSlots.push(...Array.from({ length: 4 }, () => member))
  }

  return roots
}

const family = createFamily(1_000)

const code = `const [expanded, setExpanded] = useState<ExpandedState>({})

<BonelessTable
  data={family}
  columns={columns}
  getSubRows={(member) => member.children}
  tree={{ columnId: 'name', indentPx: 14 }}
  state={{ sorting, expanded }}
  onExpandedChange={setExpanded}
  scroller="fill"
  virtualization={{ estimateSize: 58, overscan: 12 }}
  resultLabel="family members"
/>`

export default function FamilyTreePage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const columns = useMemo(
    () =>
      defineColumns<FamilyMember>([
        {
          key: 'name',
          header: 'Family member',
          meta: {
            bonelessTable: { sizing: { minPx: 260, flex: 1.6 } },
          },
        },
        {
          key: 'relationship',
          header: 'Relationship',
          meta: {
            bonelessTable: {
              sizing: { minPx: 150 },
            },
          },
        },
        {
          key: 'generation',
          header: 'Generation',
          meta: { bonelessTable: { sizing: { minPx: 120 }, align: 'right', borders: 'left' } },
        },
        {
          key: 'location',
          header: 'Location',
          meta: {
            bonelessTable: {
              sizing: { minPx: 150 },
              borders: 'right',
            },
          },
        },
      ]),
    [],
  )

  return (
    <AdminPage title="Family tree" contentClassName="flex min-h-0 flex-col overflow-y-auto">
      <section className="flex h-full min-h-0 shrink-0 flex-col">
        <div className="mb-5 flex items-end justify-between gap-4 max-sm:items-start">
          <div>
            <h2 className="text-lg font-bold">Nested relationship directory</h2>
            <p className="mt-1 text-slate-500">
              A deterministic 1,000-member hierarchy, including a 20-generation lineage. Expand an
              individual branch or control the whole tree from one toolbar action, then sort without
              losing column alignment.
            </p>
            <ExampleSettings
              items={[
                { name: 'getSubRows', description: 'supplies each member’s children' },
                { name: 'tree.columnId', description: 'puts indentation in the name cell' },
                {
                  name: 'controlled expansion',
                  description: 'keeps open branches in screen state',
                },
                { name: 'virtualization', description: 'keeps 1,000 members responsive' },
              ]}
            />
          </div>
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800">
            1,000 members
          </span>
        </div>
        <BonelessTable
          className="min-h-0 flex-1 flex-col"
          data={family}
          columns={columns}
          getSubRows={(member) => member.children}
          tree={{ columnId: 'name', indentPx: 14 }}
          state={{ sorting, expanded }}
          onSortingChange={setSorting}
          onExpandedChange={setExpanded}
          resultLabel="family members"
          resultHint="Nested relationships"
          totalCount={1_000}
          scroller="fill"
          virtualization={{ estimateSize: 58, overscan: 12 }}
        />
      </section>
      <ExampleCode>{code}</ExampleCode>
    </AdminPage>
  )
}
