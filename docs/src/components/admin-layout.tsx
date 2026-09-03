'use client'

import {
  Activity,
  BookOpen,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const navigation = [
  { href: '/examples', label: 'All table examples', icon: LayoutDashboard },
  { href: '/examples/accounts', label: 'Server-backed directory', icon: Users },
  { href: '/examples/simple', label: 'Full-width layout', icon: Activity },
  { href: '/examples/grouped', label: 'Grouped columns', icon: Users },
  { href: '/examples/truncation', label: 'Truncated values', icon: FileText },
  { href: '/examples/family-tree', label: 'Expandable tree rows', icon: Users },
  { href: '/examples/form-controls', label: 'Editable table fields', icon: FileText },
  { href: '/examples/theme-lab', label: 'Virtualized theme lab', icon: Activity },
]

type AdminLayoutProps = { children: ReactNode }

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const activePath = pathname.startsWith('/examples/accounts') ? '/examples/accounts' : pathname

  return (
    <main className="fixed inset-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-white md:grid-cols-[15rem_minmax(0,1fr)] md:grid-rows-1">
      <aside className="flex min-h-16 flex-row items-center overflow-y-auto border-b border-slate-200 bg-slate-50 px-3.5 py-2.5 md:flex-col md:items-stretch md:border-r md:border-b-0 md:px-3.5 md:pt-6 md:pb-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2.5 font-bold text-lg text-slate-800 no-underline md:pb-7.5"
        >
          <span className="grid size-7 place-items-center rounded-md bg-teal-700">
            <span className="size-3 rotate-45 border-3 border-white border-t-transparent" />
          </span>
          <span>Boneless</span>
        </Link>
        <nav aria-label="Primary navigation">
          <p className="mb-2 ml-2.5 text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
            Table examples
          </p>
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              className={`flex h-10 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-slate-600 no-underline hover:bg-slate-200 ${activePath === href ? 'bg-teal-100 font-bold text-teal-800' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-slate-200 pt-3 md:block">
          <Link
            href="/"
            className={`flex h-10 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-slate-600 no-underline hover:bg-slate-200 ${activePath === '/' ? 'bg-teal-100 font-bold text-teal-800' : ''}`}
          >
            <BookOpen size={18} />
            <span>Documentation</span>
          </Link>
          <button className="flex h-10 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-slate-600 hover:bg-slate-200">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <div className="mt-4 flex items-center gap-2">
            <span className="grid size-7.5 shrink-0 place-items-center rounded-full bg-amber-700 text-[10px] font-bold text-white">
              AS
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block overflow-hidden text-[13px] text-ellipsis whitespace-nowrap">
                Avery Stone
              </strong>
              <small className="mt-0.5 block overflow-hidden text-xs text-ellipsis whitespace-nowrap text-slate-500">
                Owner
              </small>
            </span>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>
      <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">{children}</section>
    </main>
  )
}
