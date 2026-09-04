import { AdminLayout } from '../src/components/admin-layout'
import DocumentationPage from './docs/page'

export default function HomePage() {
  return (
    <AdminLayout>
      <DocumentationPage />
    </AdminLayout>
  )
}
