'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Package, BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const { orders, enrollments } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const hasOrders = orders && orders.length > 0;
  const hasEnrollments = enrollments && enrollments.length > 0;

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
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-12">My Account</h1>

          {!hasOrders && !hasEnrollments ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-foreground mb-4">No Activity Yet</h2>
              <p className="text-muted-foreground mb-8">Start shopping or enrolling to see your orders and enrollments here.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/cart">
                  <Button className="bg-primary hover:bg-primary/90">Shop Instruments</Button>
                </Link>
                <Link href="/enroll">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Enroll in Class</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-12">
              {/* Orders Section */}
              {hasOrders && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Package className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-serif font-bold text-foreground">My Orders</h2>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => {
                      const orderDate = new Date(order.date);
                      const formattedDate = orderDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });

                      return (
                        <Card key={order.id} className="p-6 hover:shadow-lg transition">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Order ID</p>
                              <p className="font-mono font-bold text-foreground mb-4">{order.id}</p>
                              
                              <p className="text-sm text-muted-foreground mb-2">Order Date</p>
                              <p className="text-foreground mb-4">{formattedDate}</p>

                              <p className="text-sm text-muted-foreground mb-2">Items</p>
                              <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                  <p key={idx} className="text-foreground">
                                    {item.name} x {item.quantity}
                                  </p>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Status</p>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                <p className="font-semibold text-foreground capitalize">{order.status}</p>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">Total</p>
                              <p className="text-3xl font-bold text-primary mb-4">${order.total.toFixed(2)}</p>

                              <p className="text-sm text-muted-foreground mb-2">Shipping To</p>
                              <p className="text-foreground text-sm">{order.customerAddress}</p>
                            </div>
                          </div>

                          <div className="border-t border-border mt-6 pt-6">
                            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Enrollments Section */}
              {hasEnrollments && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-serif font-bold text-foreground">My Classes</h2>
                  </div>

                  <div className="space-y-4">
                    {enrollments.map((enrollment) => {
                      const startDate = new Date(enrollment.startDate);
                      const formattedDate = startDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });

                      return (
                        <Card key={enrollment.id} className="p-6 hover:shadow-lg transition border-primary/20">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Course</p>
                              <p className="text-2xl font-bold text-foreground mb-4">{enrollment.courseName}</p>
                              
                              <p className="text-sm text-muted-foreground mb-2">Schedule</p>
                              <p className="text-foreground mb-4">{enrollment.schedule}</p>

                              <p className="text-sm text-muted-foreground mb-2">Instrument</p>
                              <p className="text-foreground capitalize">{enrollment.instrument}</p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Status</p>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                <p className="font-semibold text-foreground capitalize">{enrollment.status}</p>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">Start Date</p>
                              <p className="text-foreground font-semibold mb-4">{formattedDate}</p>

                              <p className="text-sm text-muted-foreground mb-2">Course Fee</p>
                              <p className="text-2xl font-bold text-primary">${enrollment.coursePrice}</p>
                            </div>
                          </div>

                          <div className="border-t border-border mt-6 pt-6">
                            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                              Access Class
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <Card className="p-8 bg-secondary mt-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">Can't find what you're looking for? Contact our support team:</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Telegram</h3>
                <a href="https://t.me/kidus626" className="text-primary hover:underline">@kidus626</a>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                <a href="https://wa.me/251954789638" className="text-primary hover:underline">+251 954 789 638</a>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">Support within 24 hours</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
