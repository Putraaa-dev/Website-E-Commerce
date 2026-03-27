import { RouterProvider } from 'react-router';
import { router } from '@/app/routes';
import { CartProvider } from '@/app/context/CartContext';
import { AdminProvider } from '@/app/context/AdminContext';
import { Toaster } from '@/app/components/ui/sonner';

export default function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </AdminProvider>
  );
}