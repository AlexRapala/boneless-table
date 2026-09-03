import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '../src/components/query-provider'

export const metadata: Metadata = {
  title: 'boneless-table',
  description: 'Documentation and examples for boneless-table',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-sm text-slate-800 antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
