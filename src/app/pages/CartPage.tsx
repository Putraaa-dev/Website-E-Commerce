import { Link } from 'react-router';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/app/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { cart, removeFromCart, getCartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link to="/">
            <Button className="bg-[#4FC3F7] hover:bg-[#87CEEB] text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs bg-[#F0F8FF] text-[#4FC3F7] rounded">
                          {item.category}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    <div className="mt-auto flex justify-between items-end">
                      <div className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </div>
                      <div className="text-2xl text-[#4FC3F7]">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24">
              <h2 className="text-2xl text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Processing Fee</span>
                  <span>Rp 0</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl text-gray-800">
                    <span>Total</span>
                    <span className="text-[#4FC3F7]">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full h-12 bg-[#4FC3F7] hover:bg-[#87CEEB] text-white">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
