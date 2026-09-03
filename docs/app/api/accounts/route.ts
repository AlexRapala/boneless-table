import { NextRequest, NextResponse } from 'next/server'
import { fetchAccountsPage, type FilterRule, type SortRule } from '../../../src/mockAdminApi'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const cursor = Number(searchParams.get('cursor') ?? 0)
  const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? 40), 1), 100)
  let sorting: SortRule[] = []
  let filters: FilterRule[] = []
  try {
    sorting = JSON.parse(searchParams.get('sorting') ?? '[]')
    filters = JSON.parse(searchParams.get('filters') ?? '[]')
  } catch {
    return NextResponse.json({ error: 'Invalid table query.' }, { status: 400 })
  }
  return NextResponse.json(await fetchAccountsPage({ cursor, limit, sorting, filters }))
}
