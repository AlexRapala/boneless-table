import { Users } from 'lucide-react'
import { AdminPage } from '../../../src/components/admin-page'
import { AdminTable, accountExampleCode } from '../../../src/components/admin-table'
import { ExampleCode } from '../../../src/components/example-code'

export default function Page() {
  return (
    <AdminPage
      title="Accounts"
      contentClassName="flex min-h-0 flex-col overflow-y-auto"
      action={
        <button className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md border border-teal-800 bg-teal-700 px-3 font-bold text-white whitespace-nowrap">
          <Users size={17} />
          Invite account
        </button>
      }
    >
      <section aria-label="Live table" className="h-full shrink-0">
        <AdminTable />
      </section>
      <ExampleCode>{accountExampleCode}</ExampleCode>
    </AdminPage>
  )
}
