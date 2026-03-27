import React from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export const Header: React.FC = () => {
  const { getCartCount } = useCart();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4FC3F7]">
            <span className="font-bold text-white">KM</span>
          </div>
          <span className="text-xl font-bold text-gray-800">KodeMurah</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 transition-colors hover:text-[#4FC3F7]">
            Home
          </Link>
          <Link to="/products" className="text-gray-600 transition-colors hover:text-[#4FC3F7]">
            Products
          </Link>
          {!isAdminRoute && (
            <>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                  {getCartCount() > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#4FC3F7] p-0 text-xs">
                      {getCartCount()}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            </>
          )}
          {isAdminRoute ? (
            <Link to="/">
              <Button variant="outline" size="sm" className="border-[#4FC3F7] text-[#4FC3F7]">
                Exit Admin
              </Button>
            </Link>
          ) : (
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <LayoutDashboard className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
