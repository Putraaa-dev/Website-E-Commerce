import { createBrowserRouter } from 'react-router';
import { Layout } from '@/app/components/Layout';
import { HomePage } from '@/app/pages/HomePage';
import { ProductDetailPage } from '@/app/pages/ProductDetailPage';
import { ProductsListPage } from '@/app/pages/ProductsListPage';
import { CartPage } from '@/app/pages/CartPage';
import { CheckoutPage } from '@/app/pages/CheckoutPage';
import { AdminDashboard } from '@/app/pages/AdminDashboard';
import { ProtectedAdminHome } from '@/app/pages/ProtectedAdminHome';
import { ProtectedAdminProducts } from '@/app/pages/ProtectedAdminProducts';
import { ProtectedAdminUsers } from '@/app/pages/ProtectedAdminUsers';
import { ProtectedAdminManagement } from '@/app/pages/ProtectedAdminManagement';
import { AdminLoginPage } from '@/app/pages/AdminLoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'products',
        Component: ProductsListPage,
      },
      {
        path: 'product/:id',
        Component: ProductDetailPage,
      },
      {
        path: 'cart',
        Component: CartPage,
      },
      {
        path: 'checkout',
        Component: CheckoutPage,
      },
    ],
  },
  {
    path: '/admin',
    Component: AdminDashboard,
    children: [
      {
        index: true,
        Component: ProtectedAdminHome,
      },
      {
        path: 'products',
        Component: ProtectedAdminProducts,
      },
      {
        path: 'users',
        Component: ProtectedAdminUsers,
      },
      {
        path: 'management',
        Component: ProtectedAdminManagement,
      },
    ],
  },
  {
    path: '/admin/login',
    Component: AdminLoginPage,
  },
]);