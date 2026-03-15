'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, Mail, MapPin, Star, Users, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <span className="text-xl font-serif font-bold text-foreground">Kidus Online</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-foreground hover:text-primary transition">Home</a>
              <a href="#instruments" className="text-foreground hover:text-primary transition">Instruments</a>
              <a href="#classes" className="text-foreground hover:text-primary transition">Classes</a>
              <a href="#about" className="text-foreground hover:text-primary transition">About</a>
              <a href="#contact" className="text-foreground hover:text-primary transition">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button className="bg-primary hover:bg-primary/90">Order Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-secondary py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight text-balance">
                Learn & Own Authentic Ethiopian Instruments
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Kidus Online teaches you how to play Kirar & Begena, and delivers authentic instruments worldwide in 5–10 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cart">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Shop Instruments
                  </Button>
                </Link>
                <Link href="/enroll">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Join Online Class
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">1000+ Happy Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-sm font-medium text-foreground">5.0 Rating</span>
                </div>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2026-03-01_16-29-52-COT3tDIVW8NlcWjC56WXRwz90CmtaZ.jpg"
                alt="Kidus instruments - Kirar and Begena"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">Why Choose Kidus Online</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">Everything you need to master traditional Ethiopian instruments</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Expert Online Classes',
                description: 'Step-by-step lessons for beginners and advanced players',
                icon: '🎼'
              },
              {
                title: 'Worldwide Delivery',
                description: 'Authentic instruments delivered in 5–10 days to your home',
                icon: '📦'
              },
              {
                title: 'Group Discounts',
                description: 'Special offers for groups, families, and organizations',
                icon: '👥'
              },
              {
                title: 'Spiritual & Cultural',
                description: 'Traditional Ethiopian music for Orthodox followers',
                icon: '🙏'
              }
            ].map((feature, idx) => (
              <Card key={idx} className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="instruments" className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">Our Instruments</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">Authentic, handcrafted instruments for every level</p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Kirar */}
            <div className="space-y-6">
              <div className="relative h-96">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2026-03-01_16-29-52-COT3tDIVW8NlcWjC56WXRwz90CmtaZ.jpg"
                  alt="Kirar instrument"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <Card className="p-8">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Kirar</h3>
                <p className="text-muted-foreground mb-6">Traditional 5-10 stringed Ethiopian lyre. Perfect for beginners and spiritual music enthusiasts.</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Price Range</p>
                    <p className="text-2xl font-bold text-primary">$45 - $85</p>
                  </div>
                  <Link href="/cart?product=kirar&price=65">
                    <Button className="w-full bg-primary hover:bg-primary/90">Add to Cart</Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Begena */}
            <div className="space-y-6">
              <div className="relative h-96">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2026-03-01_16-29-52-COT3tDIVW8NlcWjC56WXRwz90CmtaZ.jpg"
                  alt="Begena instrument"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <Card className="p-8">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Begena</h3>
                <p className="text-muted-foreground mb-6">Large 10-13 stringed harp with deep spiritual significance. For advanced players and collectors.</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Price Range</p>
                    <p className="text-2xl font-bold text-primary">$120 - $280</p>
                  </div>
                  <Link href="/cart?product=begena&price=200">
                    <Button className="w-full bg-primary hover:bg-primary/90">Add to Cart</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">Online Classes</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">Learn from expert instructors at your own pace</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Beginner',
                price: '49',
                duration: '4 weeks',
                students: 'Up to 20',
                description: 'Introduction to Kirar & Begena basics'
              },
              {
                name: 'Intermediate',
                price: '79',
                duration: '8 weeks',
                students: 'Up to 15',
                description: 'Advanced techniques and traditional songs'
              },
              {
                name: 'Advanced',
                price: '129',
                duration: '12 weeks',
                students: 'Up to 10',
                description: 'Mastery and performance preparation'
              }
            ].map((course, idx) => (
              <Card key={idx} className="p-6 border-2 border-border hover:border-primary transition">
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">{course.name}</h3>
                <p className="text-3xl font-bold text-primary mb-4">${course.price}</p>
                <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <p>Duration: {course.duration}</p>
                  <p>Class size: {course.students}</p>
                  <p>{course.description}</p>
                </div>
                <Link href={`/enroll?course=${course.name.toLowerCase()}&price=${course.price}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90">Enroll Now</Button>
                </Link>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/10 border-primary mt-12 p-8">
            <h3 className="text-xl font-bold text-foreground mb-2">Group Discounts Available</h3>
            <p className="text-muted-foreground mb-4">Bring your family or organization and get special discounts on all courses!</p>
            <Link href="/contact">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/20">Contact Us for Details</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">What Our Students Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                name: 'Abebe M.',
                location: 'USA',
                rating: 5,
                text: 'Amazing experience learning Kirar online. The instructor is patient and the instrument arrived in perfect condition!'
              },
              {
                name: 'Almaz T.',
                location: 'Canada',
                rating: 5,
                text: 'I never thought I could learn traditional Ethiopian music so easily. Kidus Online made it accessible and fun.'
              },
              {
                name: 'Yohannes K.',
                location: 'Ethiopia',
                rating: 5,
                text: 'The quality of the Begena instruments is exceptional. I\'ve recommended Kidus Online to all my friends.'
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">About Kidus Online</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                We are passionate about preserving and sharing the rich cultural heritage of Ethiopian music. Our mission is to make traditional instruments and knowledge accessible to everyone, everywhere.
              </p>
              <p className="text-lg text-muted-foreground">
                With over 10 years of experience, we've taught thousands of students and delivered authentic instruments to over 50 countries worldwide.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { number: '1000+', label: 'Students Taught' },
                  { number: '5000+', label: 'Instruments Sold' },
                  { number: '50+', label: 'Countries' },
                  { number: '10+', label: 'Years Experience' }
                ].map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-3xl font-bold text-primary">{stat.number}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-96">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2026-03-01_16-29-52-COT3tDIVW8NlcWjC56WXRwz90CmtaZ.jpg"
                alt="About Kidus Online"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">Contact us to place an order, ask questions, or join our classes</p>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <MessageCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Telegram</h3>
                  <a href="https://t.me/kidus626" className="text-primary hover:underline">@kidus626</a>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                  <a href="https://wa.me/251954789638" className="text-primary hover:underline">+251 954 789 638</a>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Imo</h3>
                  <p className="text-muted-foreground">0925 292 864 / 0954 789 638</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <Link href="/contact">
                  <Button className="w-full bg-primary hover:bg-primary/90">Send Message</Button>
                </Link>
                <Link href="/orders">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">View My Orders</Button>
                </Link>
              </div>
            </div>

            <Card className="p-8 bg-background">
              <h3 className="text-xl font-serif font-bold text-foreground mb-6">Quick Info</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>We ship worldwide in 5-10 business days with tracking information.</p>
                <p>Our customer support team responds within 24 hours via your preferred channel.</p>
                <p>All instruments come with basic care instructions and a quality guarantee.</p>
                <p>Group orders and bulk discounts are available upon request.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Kidus Online</h4>
              <p className="text-sm text-background/70">Learn and own authentic Ethiopian instruments</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/cart?product=kirar" className="hover:text-background">Kirar</Link></li>
                <li><Link href="/cart?product=begena" className="hover:text-background">Begena</Link></li>
                <li><Link href="/cart">All Instruments</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Learn</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/enroll" className="hover:text-background">Classes</Link></li>
                <li><a href="#about" className="hover:text-background">About Us</a></li>
                <li><a href="#contact" className="hover:text-background">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="https://t.me/kidus626" className="hover:text-background">Telegram</a></li>
                <li><a href="https://wa.me/251954789638" className="hover:text-background">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 pt-8">
            <p className="text-center text-sm text-background/70">
              © 2026 Kidus Online. All rights reserved. Learn & Own Authentic Ethiopian Instruments.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
