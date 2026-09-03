export type Status = 'Active' | 'Invited' | 'Suspended' | 'Archived'
export type Account = {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: Status
  plan: string
  seats: number
  spend: number
  region: string
  lastSeen: string
}
export type SortRule = { id: string; desc: boolean }
export type FilterRule = { id: string; value: unknown }
export type AccountsPage = {
  data: Account[]
  meta: { nextCursor: number | null; totalCount: number }
}

const first = [
  'Maya',
  'Elliot',
  'Nadia',
  'Marcus',
  'Anika',
  'Jonah',
  'Priya',
  'Caleb',
  'Sofia',
  'Luca',
  'Renee',
  'Theo',
]
const last = [
  'Chen',
  'Brooks',
  'Ibrahim',
  'Reed',
  'Patel',
  'Foster',
  'Santos',
  'Kim',
  'Morgan',
  'Ward',
  'Bennett',
  'Rivera',
]
export const options = {
  roles: ['Administrator', 'Manager', 'Analyst', 'Support', 'Viewer'],
  departments: ['Operations', 'Finance', 'Product', 'Sales', 'Support', 'Security'],
  statuses: ['Active', 'Invited', 'Suspended', 'Archived'],
  plans: ['Enterprise', 'Growth', 'Team', 'Starter'],
  regions: ['US East', 'US West', 'EMEA', 'APAC'],
}
const daysAgo = (days: number) => {
  const date = new Date('2026-08-18T12:00:00Z')
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString()
}
const accounts: Account[] = Array.from({ length: 640 }, (_, i) => {
  const f = first[i % first.length]
  const l = last[(i * 5) % last.length]
  return {
    id: `usr_${String(i + 1).padStart(4, '0')}`,
    name: `${f} ${l}`,
    email: `${f.toLowerCase()}.${l.toLowerCase()}${i + 1}@northstar.io`,
    role: options.roles[(i * 7) % options.roles.length],
    department: options.departments[(i * 3) % options.departments.length],
    status: (['Active', 'Active', 'Active', 'Invited', 'Suspended', 'Archived'] as Status[])[i % 6],
    plan: options.plans[(i * 11) % options.plans.length],
    seats: 3 + ((i * 17) % 96),
    spend: 120 + ((i * 137) % 5700),
    region: options.regions[(i * 13) % options.regions.length],
    lastSeen: daysAgo((i * 5) % 180),
  }
})

export function getAccountById(id: string) {
  return accounts.find((account) => account.id === id)
}

export async function fetchAccountsPage({
  cursor = 0,
  limit,
  sorting,
  filters,
}: {
  cursor?: number
  limit: number
  sorting: SortRule[]
  filters: FilterRule[]
}): Promise<AccountsPage> {
  await new Promise((resolve) => setTimeout(resolve, 260))
  const filtered = accounts.filter((item) =>
    filters.every(
      ({ id, value }) =>
        !String(value ?? '').trim() ||
        String(item[id as keyof Account])
          .toLowerCase()
          .includes(String(value).trim().toLowerCase()),
    ),
  )
  const sorted = [...filtered].sort((a, b) => {
    for (const { id, desc } of sorting) {
      const left = a[id as keyof Account]
      const right = b[id as keyof Account]
      const result =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right), undefined, { numeric: true })
      if (result) return desc ? -result : result
    }
    return a.id.localeCompare(b.id)
  })
  const rows = sorted.slice(cursor, cursor + limit)
  return {
    data: rows,
    meta: {
      totalCount: sorted.length,
      nextCursor: cursor + rows.length < sorted.length ? cursor + rows.length : null,
    },
  }
}
