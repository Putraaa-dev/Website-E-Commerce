import { Link } from 'react-router';
import { ShoppingCart, Code2 } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

export function Navbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-[#4FC3F7]" />
            <span className="text-2xl text-gray-800">
              Kode<span className="text-[#4FC3F7]">Murah</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-[#4FC3F7] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-600 hover:text-[#4FC3F7] transition-colors"
            >
              Products
            </Link>
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4FC3F7] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
