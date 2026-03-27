import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE } from '@/app/utils/api';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      toast.success('Payment successful! Check your email for download links.');
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F8FF] to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase and get instant access</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300" style={{animation: 'slideIn 0.5s ease-out'}}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-gray-200 focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20 h-11"
                />
                <p className="text-sm text-gray-500">
                  Download links will be sent to this email address.
                </p>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700">Payment Method *</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-xl p-4 hover:border-[#4FC3F7] hover:bg-[#F0F8FF] cursor-pointer transition-all duration-200">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-[#4FC3F7]" />
                      <span>Credit / Debit Card</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-xl p-4 hover:border-[#4FC3F7] hover:bg-[#F0F8FF] cursor-pointer transition-all duration-200">
                    <RadioGroupItem value="e-wallet" id="e-wallet" />
                    <Label htmlFor="e-wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5 text-[#4FC3F7]" />
                      <span>E-Wallet (GoPay, OVO, Dana)</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-xl p-4 hover:border-[#4FC3F7] hover:bg-[#F0F8FF] cursor-pointer transition-all duration-200">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label htmlFor="bank-transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="w-5 h-5 text-[#4FC3F7]" />
                      <span>Bank Transfer</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-12 bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] hover:from-[#2BB5D9] hover:to-[#4FC3F7] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                By completing this purchase, you agree to our Terms of Service.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{animation: 'slideIn 0.5s ease-out 0.1s backwards'}}>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors duration-200"
                    style={{animation: `slideIn 0.4s ease-out ${0.2 + idx * 0.1}s backwards`}}
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm font-bold text-[#4FC3F7]">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t-2 border-gray-200 pt-4 mt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Processing Fee</span>
                    <span className="font-semibold text-gray-800">Rp 0</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] bg-clip-text text-transparent">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-800">💾 Digital Products:</strong> After successful payment, download links will be sent to your email immediately. No shipping required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
