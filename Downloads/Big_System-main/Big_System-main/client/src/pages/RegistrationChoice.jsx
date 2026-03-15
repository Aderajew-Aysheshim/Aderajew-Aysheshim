import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaCrown, FaBook, FaVideo, FaFileAlt, FaGraduationCap, FaShieldAlt, FaRocket, FaChevronRight, FaLock } from 'react-icons/fa';

const RegistrationChoice = () => {
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkReg = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/settings/public');
        if (res.data.settings?.publicRegistration === false) {
          setIsRegOpen(false);
        }
      } catch (e) {
        console.error('Reg check fail');
      } finally {
        setLoading(false);
      }
    };
    checkReg();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-300 font-sans selection:bg-indigo-500/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Choose Your <span className="text-indigo-600">Plan</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select your membership and get started</p>
        </div>

        {/* Registration Locked */}
        {!isRegOpen ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock size={24} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Registration Closed</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Registration is temporarily disabled. Please try again later.
            </p>
            <Link to="/" className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Registration Type Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I want to register as:</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Student Registration */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaGraduationCap className="text-blue-600 text-xl sm:text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Student</h3>
                      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Learn and access resources</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      "Access course materials",
                      "Practice exams",
                      "Watch educational videos",
                      "Connect with tutors"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        <FaCheckCircle className="text-green-500" size={16} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link to="/student-registration" className="w-full py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-center block text-sm sm:text-base">
                    Register as Student
                  </Link>
                </div>

                {/* Tutor Registration */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 hover:border-emerald-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FaBook className="text-emerald-600 text-xl sm:text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Tutor</h3>
                      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Teach and earn</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      "Create and sell courses",
                      "One-on-one tutoring",
                      "Upload educational resources",
                      "Flexible schedule"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        <FaCheckCircle className="text-green-500" size={16} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link to="/tutor-registration" className="w-full py-3 sm:py-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-center block text-sm sm:text-base">
                    Register as Tutor (500 ETB)
                  </Link>
                </div>
              </div>
            </div>
            {/* Free Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <FaBook className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Standard</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Free Access</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">0 ETB</div>
              </div>

              <div className="space-y-2 mb-6">
                {[
                  "Access to free archive",
                  "Basic exam practice",
                  "Educational videos",
                  "Community hub"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <FaCheckCircle className="text-green-500" size={12} />
                    {feature}
                  </div>
                ))}
              </div>

              <Link to="/student-registration" className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-center block">
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-indigo-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                RECOMMENDED
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaCrown className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro</h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Premium Access</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">50 ETB</div>
              </div>

              <div className="space-y-2 mb-6">
                {[
                  "Unrestricted archive access",
                  "Premium tutorials",
                  "Priority expert booking",
                  "Advanced analytics",
                  "24/7 priority support",
                  "Certificate of completion"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <FaCheckCircle className="text-indigo-600" size={12} />
                    {feature}
                  </div>
                ))}
              </div>

              <Link to="/student-register" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center block">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default RegistrationChoice;
