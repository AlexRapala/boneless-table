import type { ReactNode } from 'react'

type AdminPageProps = {
  children: ReactNode
  title: string
  action?: ReactNode
  contentClassName?: string
}

export function AdminPage({ children, title, action, contentClassName }: AdminPageProps) {
  return (
    <>
      <header className="flex min-h-19.5 shrink-0 items-center justify-between gap-5 border-b border-slate-200 px-4.5 py-3.5 md:min-h-24 md:px-8.5 md:py-5">
        <div>
          <div className="text-xs text-slate-500">
            Table examples <span className="mx-1.5 text-slate-400">/</span> {title}
          </div>
          <h1 className="mt-1 text-[19px] font-bold md:text-[22px]">{title}</h1>
        </div>
        {action}
      </header>
      <section
        className={`mx-auto min-h-0 w-full max-w-[100rem] flex-1 overflow-x-hidden px-4.5 py-5.5 md:px-8.5 md:py-7.5 ${contentClassName ?? 'overflow-y-auto'}`}
      >
        {children}
      </section>
    </>
  )
}
