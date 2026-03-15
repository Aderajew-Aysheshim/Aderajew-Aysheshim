'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, BookOpen, Calendar, Users } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function EnrollmentConfirmationPage() {
  const { enrollments } = useCart();
  const [latestEnrollment, setLatestEnrollment] = useState(null);

  useEffect(() => {
    if (enrollments && enrollments.length > 0) {
      setLatestEnrollment(enrollments[0]);
    }
  }, [enrollments]);

  if (!latestEnrollment) {
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
              <h1 className="text-2xl font-bold text-foreground mb-4">No Enrollment Found</h1>
              <Link href="/enroll">
                <Button className="bg-primary hover:bg-primary/90">Enroll Now</Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  const startDate = new Date(latestEnrollment.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', {
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
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Enrollment Confirmed!</h1>
            <p className="text-xl text-muted-foreground">Welcome to your Kidus Online class. Get ready to learn traditional Ethiopian music!</p>
          </div>

          {/* Enrollment Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Course Info */}
            <Card className="p-8">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Course Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Course</p>
                  <p className="font-bold text-foreground text-lg">{latestEnrollment.courseName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                  <p className="font-semibold text-foreground">{latestEnrollment.schedule}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <p className="font-semibold text-foreground">{formattedDate}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Enrollment Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <p className="font-semibold text-foreground">Confirmed</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Course Fee</p>
                  <p className="text-2xl font-bold text-primary">${latestEnrollment.coursePrice}</p>
                </div>
              </div>
            </Card>

            {/* Student Info */}
            <Card className="p-8">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Your Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-semibold text-foreground">{latestEnrollment.studentName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground">{latestEnrollment.studentEmail}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="text-foreground">{latestEnrollment.studentPhone}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Interested Instrument</p>
                  <p className="font-semibold text-foreground capitalize">{latestEnrollment.instrument}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Experience Level</p>
                  <p className="font-semibold text-foreground capitalize">{latestEnrollment.experience}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* What's Next */}
          <Card className="p-8 mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-6">What's Next?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Confirmation Email</h3>
                  <p className="text-muted-foreground">We've sent your enrollment confirmation and class details to {latestEnrollment.studentEmail}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Class Access</h3>
                  <p className="text-muted-foreground">You'll receive login details and video materials before your first class</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Get Ready</h3>
                  <p className="text-muted-foreground">Set up your device, test your audio, and prepare to start learning on {formattedDate}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Course Includes */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <BookOpen className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-3">Learning Materials</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Video lessons & tutorials</li>
                <li>✓ PDF learning guides</li>
                <li>✓ Sheet music & notation</li>
                <li>✓ Progress tracking</li>
              </ul>
            </Card>

            <Card className="p-6">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-3">Class Schedule</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ {latestEnrollment.schedule}</li>
                <li>✓ Live Q&A sessions</li>
                <li>✓ Recorded classes available</li>
                <li>✓ Flexible viewing 24/7</li>
              </ul>
            </Card>
          </div>

          {/* Contact Support */}
          <Card className="p-8 bg-secondary mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Questions or Need Help?</h2>
            <p className="text-muted-foreground mb-6">Our team is here to support your learning journey. Reach out anytime:</p>
            
            <div className="space-y-3">
              <p className="text-foreground">
                <span className="font-semibold">Telegram:</span> <a href="https://t.me/kidus626" className="text-primary hover:underline">@kidus626</a>
              </p>
              <p className="text-foreground">
                <span className="font-semibold">WhatsApp:</span> <a href="https://wa.me/251954789638" className="text-primary hover:underline">+251 954 789 638</a>
              </p>
              <p className="text-foreground">
                <span className="font-semibold">Email:</span> Support team will reach out to {latestEnrollment.studentEmail}
              </p>
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/orders" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90">View My Enrollments</Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
