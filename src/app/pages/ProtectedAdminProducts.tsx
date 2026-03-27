import { ProtectedAdminRoute } from '@/app/components/ProtectedAdminRoute'
import { AdminProductsPage } from '@/app/pages/AdminProductsPage'

export function ProtectedAdminProducts() {
  return (
    <ProtectedAdminRoute>
      <AdminProductsPage />
    </ProtectedAdminRoute>
  )
}
