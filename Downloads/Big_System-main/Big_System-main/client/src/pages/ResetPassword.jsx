import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaLock, FaEye, FaEyeSlash, FaCheck, FaExclamationTriangle, FaRocket,
  FaUserGraduate, FaChalkboardTeacher, FaShieldAlt
} from 'react-icons/fa';
import { passwordUtils } from '../utils/authUtils';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    userType: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null: checking, true: valid, false: invalid

  const navigate = useNavigate();
  const token = searchParams.get('token');
  const userType = searchParams.get('userType') || 'student';
  useEffect(() => {
    setFormData(prev => ({ ...prev, userType }));
    validateToken();
  }, [token, userType]);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(passwordUtils.validateStrength(formData.password));
    }
  }, [formData.password]);

  const validateToken = async () => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    try {
      const axios = (await import('axios')).default;
      
      let endpoint;
      switch (userType) {
        case 'admin':
          endpoint = '/api/admin/validate-reset-token';
          break;
        case 'tutor':
          endpoint = '/api/tutors/validate-reset-token';
          break;
        case 'student':
        default:
          endpoint = '/api/students/validate-reset-token';
          break;
      }

      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        token
      });

      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
      setError(error.response?.data?.error || 'Invalid or expired reset link. Please request a new password reset.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (!passwordStrength.strong) {
      setError('Password must be strong (8+ chars with uppercase, lowercase, numbers, and special characters)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const axios = (await import('axios')).default;
      
      let endpoint;
      switch (userType) {
        case 'admin':
          endpoint = '/api/admin/reset-password';
          break;
        case 'tutor':
          endpoint = '/api/tutors/reset-password';
          break;
        case 'student':
        default:
          endpoint = '/api/students/reset-password';
          break;
      }

      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        token,
        password: formData.password
      });

      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-purple-500/20 animate-pulse">
            <FaRocket className="text-purple-500 text-2xl animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Validating Reset Link</h2>
          <p className="text-gray-400">Please wait while we verify your reset token...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-500/20">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Invalid Reset Link</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Request New Reset Link
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
// Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500/20">
            <FaCheck className="text-green-500 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Password Reset Successful!</h1>
          <p className="text-gray-400 mb-6">
            Your password has been successfully updated. You can now login with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-white text-2xl" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Create a new password for your {userType} account
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30 flex items-center">
              <FaExclamationTriangle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Display */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                {userType === 'student' && <FaUserGraduate className="text-blue-400" />}
                {userType === 'tutor' && <FaChalkboardTeacher className="text-green-400" />}
                {userType === 'admin' && <FaShieldAlt className="text-red-400" />}
                <span className="text-white capitalize">{userType} Account</span>
              </div>
            </div>

          {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength.score
                            ? level <= 2
                              ? 'bg-red-500'
                              : level <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {passwordStrength.strong 
                      ? 'Strong password' 
                      : passwordStrength.medium 
                      ? 'Medium strength' 
                      : 'Weak password'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <h4 className="text-blue-300 font-medium text-sm mb-2">Password Requirements:</h4>
              <ul className="text-blue-200 text-xs space-y-1">
                <li className="flex items-center">
                  <FaCheck className={`mr-2 ${formData.password.length >= 8 ? 'text-green-400' : 'text-gray-400'}`} />
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <FaCheck className={`mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`} />
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <FaCheck className={`mr-2 ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`} />
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <FaCheck className={`mr-2 ${/\d/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`} />
                  One number
                </li>
                <li className="flex items-center">
                  <FaCheck className={`mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`} />
                  One special character
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.password || !passwordStrength.strong || formData.password !== formData.confirmPassword}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
