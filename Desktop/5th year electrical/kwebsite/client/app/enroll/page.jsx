'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Calendar, Users, Clock } from 'lucide-react';

const COURSES = {
  beginner: { name: 'Beginner', price: 49, duration: '4 weeks', students: 'Up to 20' },
  intermediate: { name: 'Intermediate', price: 79, duration: '8 weeks', students: 'Up to 15' },
  advanced: { name: 'Advanced', price: 129, duration: '12 weeks', students: 'Up to 10' }
};

const SCHEDULES = {
  beginner: ['Monday & Wednesday (7 PM)', 'Saturday & Sunday (10 AM)', 'Tuesday & Thursday (6 PM)'],
  intermediate: ['Tuesday & Thursday (8 PM)', 'Saturday (2 PM)', 'Wednesday & Friday (7 PM)'],
  advanced: ['Monday & Wednesday (9 PM)', 'Sunday (3 PM)', 'Thursday & Saturday (8 PM)']
};

export default function EnrollPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addEnrollment } = useCart();
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: 'beginner',
    instrument: 'kirar'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const course = searchParams.get('course');
    if (course && COURSES[course]) {
      setSelectedCourse(course);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1 && !selectedCourse) {
      newErrors.course = 'Please select a course';
    }

    if (step === 2 && !selectedSchedule) {
      newErrors.schedule = 'Please select a schedule';
    }

    if (step === 3) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleEnroll = () => {
    if (validateStep()) {
      const enrollment = {
        course: selectedCourse,
        courseName: COURSES[selectedCourse].name,
        coursePrice: COURSES[selectedCourse].price,
        schedule: selectedSchedule,
        studentName: `${formData.firstName} ${formData.lastName}`,
        studentEmail: formData.email,
        studentPhone: formData.phone,
        experience: formData.experience,
        instrument: formData.instrument,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };

      addEnrollment(enrollment);
      router.push('/enrollmentconfirmation');
    }
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
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Enrollment */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}>
                  {s}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Select Your Course</h2>
                    <p className="text-muted-foreground">Choose the course level that matches your experience</p>

                    <div className="space-y-4">
                      {Object.entries(COURSES).map(([key, course]) => (
                        <div
                          key={key}
                          onClick={() => setSelectedCourse(key)}
                          className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                            selectedCourse === key
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          <h3 className="text-lg font-semibold text-foreground mb-2">{course.name} Course</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Duration: {course.duration}</p>
                            <p>Class size: {course.students}</p>
                            <p className="font-bold text-primary mt-2">${course.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {errors.course && <p className="text-destructive text-sm">{errors.course}</p>}
                  </div>
                )}

                {step === 2 && selectedCourse && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Select Schedule</h2>
                    <p className="text-muted-foreground">Choose your preferred class time</p>

                    <div className="space-y-3">
                      {SCHEDULES[selectedCourse].map((schedule, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedSchedule(schedule)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition flex items-center gap-4 ${
                            selectedSchedule === schedule
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-foreground">{schedule}</span>
                        </div>
                      ))}
                    </div>

                    {errors.schedule && <p className="text-destructive text-sm">{errors.schedule}</p>}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Personal Information</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+1234567890"
                      />
                      {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Your Experience Level</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="beginner">Beginner - No prior experience</option>
                        <option value="intermediate">Intermediate - Some experience</option>
                        <option value="advanced">Advanced - Experienced player</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Interested Instrument</label>
                      <select
                        name="instrument"
                        value={formData.instrument}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="kirar">Kirar</option>
                        <option value="begena">Begena</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 4 && selectedCourse && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Confirm Enrollment</h2>
                    <p className="text-muted-foreground">Please review your enrollment details below</p>

                    <Card className="p-6 bg-secondary/50">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Course</p>
                          <p className="font-bold text-foreground text-lg">{COURSES[selectedCourse].name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Schedule</p>
                          <p className="font-semibold text-foreground">{selectedSchedule}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-sm text-muted-foreground">Student Name</p>
                            <p className="font-semibold text-foreground">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-foreground">{formData.email}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Instrument</p>
                          <p className="font-semibold text-foreground capitalize">{formData.instrument}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary/10"
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={step === 4 ? handleEnroll : handleNextStep}
                  >
                    {step === 4 ? 'Complete Enrollment' : 'Next'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Summary */}
            <div>
              {selectedCourse && (
                <Card className="p-6 sticky top-20">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-6">Enrollment Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Course</p>
                      <p className="font-semibold text-foreground">{COURSES[selectedCourse].name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-semibold text-foreground">{COURSES[selectedCourse].duration}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Class Size</p>
                      <p className="font-semibold text-foreground">{COURSES[selectedCourse].students}</p>
                    </div>

                    {selectedSchedule && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                        <p className="font-semibold text-foreground">{selectedSchedule}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                    <p className="text-3xl font-bold text-primary">${COURSES[selectedCourse].price}</p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">What's Included</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li>✓ Live online classes</li>
                      <li>✓ Video recordings</li>
                      <li>✓ Learning materials</li>
                      <li>✓ Certificate upon completion</li>
                      <li>✓ Email support</li>
                    </ul>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
