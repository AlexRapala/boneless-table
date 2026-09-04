import { ArrowLeft, Mail, MapPin, ShieldCheck, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { AdminPage } from '../../../../src/components/admin-page'
import { getAccountById } from '../../../../src/mockAdminApi'

type AccountPageProps = {
  params: Promise<{ id: string }>
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(
    new Date(iso),
  )

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export default async function AccountPage({ params }: AccountPageProps) {
  const { id } = await params
  const account = getAccountById(id)

  if (!account) notFound()

  return (
    <AdminPage
      title="Account details"
      action={
        <Link
          href="/"
          className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 font-bold text-slate-700 no-underline hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          All accounts
        </Link>
      }
    >
      <section className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-100 pb-6">
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-100 font-bold text-teal-800">
                {account.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900">{account.name}</h2>
                <p className="mt-1 text-slate-500">{account.id}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
              {account.status}
            </span>
          </div>

          <dl className="grid gap-x-8 gap-y-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
            <Detail icon={<Mail size={17} />} label="Email" value={account.email} />
            <Detail icon={<ShieldCheck size={17} />} label="Role" value={account.role} />
            <Detail icon={<Users size={17} />} label="Department" value={account.department} />
            <Detail icon={<MapPin size={17} />} label="Region" value={account.region} />
            <Detail label="Plan" value={account.plan} />
            <Detail label="Seats" value={account.seats.toLocaleString()} />
            <Detail label="Monthly spend" value={formatMoney(account.spend)} />
            <Detail label="Last seen" value={formatDate(account.lastSeen)} />
          </dl>
        </div>
      </section>
    </AdminPage>
  )
}

function Detail({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-400 uppercase">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 break-words font-medium text-slate-800">{value}</dd>
    </div>
  )
}
