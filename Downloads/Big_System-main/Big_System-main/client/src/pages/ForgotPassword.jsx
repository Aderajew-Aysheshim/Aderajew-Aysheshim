import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaEnvelope, FaArrowLeft, FaCheck, FaClock, FaExclamationTriangle,
  FaUserGraduate, FaChalkboardTeacher, FaShieldAlt
} from 'react-icons/fa';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    userType: 'student'
  });
  const [step, setStep] = useState(1); // 1: email input, 2: success message
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const axios = (await import('axios')).default;
      
      let endpoint;
      switch (formData.userType) {
        case 'admin':
          endpoint = '/api/admin/forgot-password';
          break;
        case 'tutor':
          endpoint = '/api/tutors/forgot-password';
          break;
        case 'student':
        default:
          endpoint = '/api/students/forgot-password';
          break;
      }

      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email: formData.email
      });

      setSuccessMessage(response.data.message || 'Password reset instructions have been sent to your email.');
      setStep(2);
      setCountdown(60); // 60 second countdown for resend

    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const axios = (await import('axios')).default;
      
      let endpoint;
      switch (formData.userType) {
        case 'admin':
          endpoint = '/api/admin/forgot-password';
          break;
        case 'tutor':
          endpoint = '/api/tutors/forgot-password';
          break;
        case 'student':
        default:
          endpoint = '/api/students/forgot-password';
          break;
      }

      await axios.post(`http://localhost:5000${endpoint}`, {
        email: formData.email
      });

      setSuccessMessage('Reset instructions have been resent to your email.');
      setCountdown(60);

    } catch (error) {
      setError(error.response?.data?.error || 'Failed to resend reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {step === 1 ? 'Reset Password' : 'Check Your Email'}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {step === 1 
              ? 'Enter your email to receive password reset instructions'
              : 'We\'ve sent you instructions to reset your password'
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-4 sm:p-6">
          {step === 1 ? (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30 flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Account Type</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {['student', 'tutor', 'admin'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, userType: type }))}
                        className={`p-2.5 sm:p-3 rounded-lg border transition-all text-xs font-medium capitalize ${
                          formData.userType === type
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {type === 'student' && <FaUserGraduate className="mx-auto mb-1 text-sm" />}
                        {type === 'tutor' && <FaChalkboardTeacher className="mx-auto mb-1 text-sm" />}
                        {type === 'admin' && <FaShieldAlt className="mx-auto mb-1 text-sm" />}
                        <span className="hidden sm:inline">{type}</span>
                        <span className="sm:hidden">{type.slice(0, 3)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.email.trim()}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </form>

              {/* Additional Help */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Note:</strong> Make sure to check your spam folder if you don't receive the email within a few minutes.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/20">
                  <FaCheck className="text-green-500 text-2xl" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">Email Sent Successfully!</h3>
                  <p className="text-gray-300 text-sm">
                    {successMessage}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 text-left">
                  <h4 className="text-white font-medium mb-2">What happens next?</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Check your email inbox</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Create a new password</li>
                    <li>• Login with your new password</li>
                  </ul>
                </div>

                {/* Resend Option */}
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">
                    Didn't receive the email?
                  </p>
                  <button
                    onClick={handleResend}
                    disabled={loading || countdown > 0}
                    className="w-full py-2.5 sm:py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {countdown > 0 
                      ? `Resend in ${formatTime(countdown)}` 
                      : loading 
                      ? 'Sending...' 
                      : 'Resend Email'
                    }
                  </button>
                </div>

                {/* Back to Login */}
                <div className="pt-4 border-t border-white/10">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium text-sm"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <FaClock className="text-xs" />
            <span>Reset links expire after 1 hour for security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
