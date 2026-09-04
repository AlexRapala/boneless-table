import { AdminLayout } from '../../src/components/admin-layout'

export default function FeaturesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminLayout>{children}</AdminLayout>
}
