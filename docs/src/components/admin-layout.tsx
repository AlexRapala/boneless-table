'use client'

import {
  Activity,
  BookOpen,
  Braces,
  Columns3,
  Database,
  FileText,
  GitBranch,
  LayoutTemplate,
  Palette,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const navigation = [
  {
    label: 'Getting started',
    links: [
      { href: '/', label: 'Overview', icon: BookOpen },
      { href: '/#installation', label: 'Installation', icon: FileText },
      { href: '/#quick-start', label: 'Quick start', icon: Braces },
      { href: '/features/basic', label: 'Basic table', icon: LayoutTemplate },
    ],
  },
  {
    label: 'Feature guides',
    links: [
      { href: '/features/server-data', label: 'Server data', icon: Database },
      { href: '/features/column-layout', label: 'Column layout', icon: Columns3 },
      { href: '/features/value-display', label: 'Value display', icon: FileText },
      { href: '/features/expanding', label: 'Expanding rows', icon: GitBranch },
      { href: '/features/editing', label: 'Editing & selection', icon: Users },
    ],
  },
  {
    label: 'Advanced',
    links: [
      { href: '/features/virtualization', label: 'Virtualization & themes', icon: Palette },
      { href: '/#api-reference', label: 'API reference', icon: Braces },
    ],
  },
]

type AdminLayoutProps = { children: ReactNode }

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const activePath = pathname

  return (
    <main className="fixed inset-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-white md:grid-cols-[15rem_minmax(0,1fr)] md:grid-rows-1">
      <aside className="flex min-h-16 flex-row items-center overflow-y-auto border-b border-slate-200 bg-slate-50 px-3.5 py-2.5 md:flex-col md:items-stretch md:border-r md:border-b-0 md:px-3.5 md:pt-6 md:pb-3.5">
        <Link
          href="https://github.com/AlexRapala/boneless-table"
          className="flex items-center gap-2.5 px-2.5 font-bold text-lg text-slate-800 no-underline md:pb-7.5"
        >
          <span className="grid size-7 place-items-center rounded-md bg-teal-700">
            <span className="size-3 rotate-45 border-3 border-white border-t-transparent" />
          </span>
          <span>Boneless</span>
        </Link>
        <nav aria-label="Documentation navigation" className="space-y-5">
          {navigation.map((group) => (
            <div key={group.label}>
              <p className="mb-2 ml-2.5 text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                {group.label}
              </p>
              {group.links.map(({ href, label, icon: Icon }) => {
                const path = href.split('#')[0]
                const isActive = !href.includes('#') && activePath === path
                return (
                  <Link
                    href={href}
                    key={href}
                    className={`flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-slate-600 no-underline hover:bg-slate-200 ${isActive ? 'bg-teal-100 font-bold text-teal-800' : ''}`}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-slate-200 pt-3 md:block">
          <Link
            href="/"
            className="flex h-10 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-slate-600 no-underline hover:bg-slate-200"
          >
            <Activity size={18} />
            <span>GitHub</span>
          </Link>
        </div>
      </aside>
      <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">{children}</section>
    </main>
  )
}
