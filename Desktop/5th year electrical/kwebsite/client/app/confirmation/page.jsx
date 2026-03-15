'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, Package, Clock, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function ConfirmationPage() {
  const { orders } = useCart();
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    if (orders && orders.length > 0) {
      setLatestOrder(orders[0]);
    }
  }, [orders]);

  if (!latestOrder) {
    return (
      <main className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
                <span className="text-xl font-serif font-bold text-foreground">Kidus Online</span>
              </Link>
            </div>
          </div>
        </nav>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4">
            <Card className="p-12 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">No Order Found</h1>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">Return Home</Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  const orderDate = new Date(latestOrder.date);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
          </div>
        </div>
      </nav>

      {/* Confirmation */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">Thank you for your purchase. Your order has been received.</p>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Order Info */}
            <Card className="p-8">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Order Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="font-mono font-bold text-foreground">{latestOrder.id}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                  <p className="font-semibold text-foreground">{formattedDate}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <p className="font-semibold text-foreground">Order Confirmed</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">${latestOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            {/* Customer Info */}
            <Card className="p-8">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Delivery To</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-semibold text-foreground">{latestOrder.customerName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground">{latestOrder.customerEmail}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="text-foreground">{latestOrder.customerPhone}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="text-foreground">{latestOrder.customerAddress}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="p-8 mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-6">Items Ordered</h2>
            
            <div className="space-y-4">
              {latestOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${latestOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (10%)</span>
                <span>${latestOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>${latestOrder.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${latestOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Processing</h3>
              <p className="text-sm text-muted-foreground">Your order is being prepared for shipment</p>
            </Card>

            <Card className="p-6 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">5-10 Days</h3>
              <p className="text-sm text-muted-foreground">Expected delivery time worldwide</p>
            </Card>

            <Card className="p-6 text-center">
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">We're here to help 24/7</p>
            </Card>
          </div>

          {/* Contact Info */}
          <Card className="p-8 bg-secondary mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">Reach out to our support team via:</p>
            
            <div className="space-y-3">
              <p className="text-foreground">
                <span className="font-semibold">Telegram:</span> <a href="https://t.me/kidus626" className="text-primary hover:underline">@kidus626</a>
              </p>
              <p className="text-foreground">
                <span className="font-semibold">WhatsApp:</span> <a href="https://wa.me/251954789638" className="text-primary hover:underline">+251 954 789 638</a>
              </p>
              <p className="text-foreground">
                <span className="font-semibold">Email:</span> A confirmation email has been sent to {latestOrder.customerEmail}
              </p>
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/orders" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90">View My Orders</Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
