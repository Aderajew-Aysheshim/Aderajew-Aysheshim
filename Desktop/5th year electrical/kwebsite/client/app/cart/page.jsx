'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const PRODUCTS = {
  kirar: { name: 'Kirar', type: 'Instrument', id: 'kirar' },
  begena: { name: 'Begena', type: 'Instrument', id: 'begena' }
};

export default function CartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, addOrder } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const product = searchParams.get('product');
    const price = searchParams.get('price');
    
    if (product && price && PRODUCTS[product]) {
      const newItem = {
        id: PRODUCTS[product].id,
        name: PRODUCTS[product].name,
        type: PRODUCTS[product].type,
        price: parseFloat(price),
        quantity: 1
      };
      addToCart(newItem);
    }
  }, [searchParams, addToCart]);

  if (!mounted) return null;

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = cart.length > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const order = {
      items: cart,
      subtotal,
      tax,
      shipping,
      total,
      customerEmail: '',
      customerName: '',
      customerPhone: '',
      customerAddress: ''
    };

    router.push('/checkout');
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <span className="text-xl font-serif font-bold text-foreground">Kidus Online</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Shopping Cart */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-12">Shopping Cart</h1>

          {cart.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Add some instruments to get started!</p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <Card key={item.cartItemId} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{item.type}</p>
                        <p className="text-primary font-bold text-lg mt-2">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-2 hover:bg-secondary transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-2 hover:bg-secondary transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-border mt-4 pt-4">
                      <p className="text-right font-semibold text-foreground">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="p-6 sticky top-20">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 border-b border-border pb-6 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Proceed to Checkout
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                      onClick={() => router.push('/')}
                    >
                      Continue Shopping
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">Delivery Info</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li>✓ Free shipping on orders over $100</li>
                      <li>✓ Worldwide delivery in 5-10 days</li>
                      <li>✓ Track your order with email updates</li>
                      <li>✓ Quality guarantee on all items</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">Contact Support</h4>
                    <p className="text-xs text-muted-foreground mb-2">Need help? Reach us via:</p>
                    <ul className="space-y-1 text-xs text-primary">
                      <li>• Telegram: @kidus626</li>
                      <li>• WhatsApp: +251 954 789 638</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
