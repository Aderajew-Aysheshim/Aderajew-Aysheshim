import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUserGraduate, FaChalkboardTeacher, FaShieldAlt, FaGlobe } from 'react-icons/fa';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', userType: 'student' });
  const [isRegOpen, setIsRegOpen] = useState(true);
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const userType = localStorage.getItem('userType');
      const redirectPath = userType === 'tutor' ? '/tutor-dashboard' :
        userType === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let isMounted = true;
    const checkReg = async () => {
      try {
        // Import axios and API config
        const axios = (await import('axios')).default;
        const { API_CONFIG, isBackendAvailable } = (await import('../utils/apiConfig'));

        // Check if backend is available first
        const backendAvailable = await isBackendAvailable();
        if (!backendAvailable) {
          console.log('Backend not available - using default settings');
          return;
        }

        const res = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/settings/public`, {
          timeout: API_CONFIG.TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        });

        if (isMounted && res.data?.settings?.publicRegistration === false) {
          setIsRegOpen(false);
        }
      } catch (e) {
        if (isMounted) {
          console.error('Reg check fail - Backend server may not be running');
        }
      }
    };

    // Only check if backend is likely available
    const timer = setTimeout(checkReg, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password, formData.userType);

    if (result.success) {
      // Navigation is handled by the useEffect that watches isAuthenticated
      console.log('Login successful');
    }
    // Error handling is managed by the AuthContext
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Logo Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FaGlobe className="text-white text-sm sm:text-base" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors">TutorHub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Welcome Back</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-base transition-colors">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-white/10 backdrop-blur-lg rounded-2xl border border-slate-200 dark:border-white/10 p-4 sm:p-6 shadow-xl dark:shadow-none transition-all">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Account Type</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {['student', 'tutor', 'admin'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: type })}
                    className={`p-2.5 sm:p-3 rounded-lg border transition-all text-xs font-medium capitalize ${formData.userType === type
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                  >
                    {type === 'student' && <FaUserGraduate className="mx-auto mb-1 text-sm sm:text-base" />}
                    {type === 'tutor' && <FaChalkboardTeacher className="mx-auto mb-1 text-sm sm:text-base" />}
                    {type === 'admin' && <FaShieldAlt className="mx-auto mb-1 text-sm sm:text-base" />}
                    <span className="hidden sm:inline">{type}</span>
                    <span className="sm:hidden">{type.slice(0, 3)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abebe@example.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              {isRegOpen ? (
                <>
                  New to TutorHub?{' '}
                  <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                    Create account
                  </Link>
                </>
              ) : (
                <span className="text-gray-500 italic">Registration currently restricted</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
