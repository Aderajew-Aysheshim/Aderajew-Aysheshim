import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaShieldAlt, FaRocket, FaCheckCircle, FaCreditCard, FaLock, FaUsers, FaBook, FaAward } from 'react-icons/fa';

const GetStarted = () => {

  const plans = [
    {
      id: 'student',
      title: 'Student Plan',
      icon: <FaGraduationCap className="text-4xl" />,
      price: 'ETB 50',
      period: 'one-time',
      features: [
        'Lifetime account access',
        'Access to all courses',
        'Live tutoring sessions',
        'Study materials',
        'Progress tracking',
        'Certificate upon completion'
      ],
      color: 'blue',
      popular: true
    },
    {
      id: 'tutor',
      title: 'Tutor Plan',
      icon: <FaChalkboardTeacher className="text-4xl" />,
      price: 'ETB 1000',
      period: 'one-time',
      features: [
        'Lifetime tutor account',
        'Create and sell courses',
        'Live teaching platform',
        'Student management',
        'Payment processing',
        'Analytics dashboard'
      ],
      color: 'green',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FaGraduationCap className="text-blue-600 text-2xl" />
              <span className="text-xl font-bold text-slate-900">TutorHub</span>
            </div>
            <nav className="flex space-x-8">
              <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <FaRocket className="text-6xl text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Start Your Learning Journey Today
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join Ethiopia's premier online learning platform. Choose your plan and unlock unlimited access to quality education.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex items-center justify-center space-x-3">
              <FaShieldAlt className="text-green-600 text-2xl" />
              <span className="text-slate-700 font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FaUsers className="text-blue-600 text-2xl" />
              <span className="text-slate-700 font-medium">50,000+ Students</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FaAward className="text-purple-600 text-2xl" />
              <span className="text-slate-700 font-medium">Certified Courses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-slate-600">Select the perfect plan for your learning or teaching needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 ${plan.popular
                  ? 'border-blue-500 ring-4 ring-blue-100'
                  : 'border-slate-200'
                  } hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`text-${plan.color}-600 mb-4 flex justify-center`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className={`text-${plan.color}-600 mt-1 mr-3 flex-shrink-0`} />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Link
                    to={plan.id === 'student' ? '/student-registration' : '/tutor-registration'}
                    className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 ${plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : `bg-${plan.color}-600 hover:bg-${plan.color}-700 text-white`
                      }`}
                  >
                    Register as {plan.id === 'student' ? 'Student' : 'Tutor'} - {plan.price}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose TutorHub?</h2>
            <p className="text-slate-600">Premium features for premium education</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Quality Content</h3>
              <p className="text-slate-600">Expert-created courses and materials</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure Payments</h3>
              <p className="text-slate-600">Safe and reliable payment processing</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Premium Access</h3>
              <p className="text-slate-600">Exclusive content for paid members</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and tutors already using TutorHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/student-registration"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Start as Student
            </Link>
            <Link
              to="/tutor-registration"
              className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              Start as Tutor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FaGraduationCap className="text-2xl" />
            <span className="text-xl font-bold">TutorHub</span>
          </div>
          <p className="text-slate-400">
            © 2024 TutorHub. Premium education platform for Ethiopia.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GetStarted;
