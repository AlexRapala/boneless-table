import type { ReactNode } from 'react'

type AdminPageProps = {
  children: ReactNode
  title: string
  action?: ReactNode
  contentClassName?: string
}

export function AdminPage({ children, title, action, contentClassName }: AdminPageProps) {
  return (
    <section
      className={`mx-auto min-h-0 w-full max-w-[100rem] flex-1 overflow-x-hidden px-3 py-5 sm:px-4.5 sm:py-7 md:px-8.5 md:py-10 ${contentClassName ?? 'overflow-y-auto'}`}
    >
      <div className="mx-auto mb-6 flex max-w-6xl items-start justify-between gap-4 sm:mb-8 sm:gap-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
        {action}
      </div>
      {children}
    </section>
  )
}
