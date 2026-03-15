import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaCreditCard, FaUniversity, FaMobile, FaShieldAlt, FaCheck, FaTimes,
  FaCrown, FaAward, FaBook, FaGraduationCap, FaLock, FaCalendar
} from 'react-icons/fa';
import {
  FiCreditCard, FiSmartphone, FiShield, FiCheck, FiArrowLeft, FiClock
} from 'react-icons/fi';

const ExamPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { exam } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [paymentData, setPaymentData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bankAccount: '',
    mobileNumber: '',
    transactionRef: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!exam) {
      navigate('/exams');
      return;
    }
    fetchStudent();
  }, [exam, navigate]);

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Mock student data - replace with actual API call
        setStudent({
          name: 'Student User',
          email: 'student@example.com',
          phone: '+251911234567'
        });
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful payment
      alert(`Payment successful! You now have access to ${exam.title}`);
      navigate('/dashboard');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No Exam Selected</h2>
          <button
            onClick={() => navigate('/exams')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <FaUniversity />,
      description: 'Transfer to our bank account',
      details: 'Account: 1000558675668 - Commercial Bank of Ethiopia'
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: <FaMobile />,
      description: 'Pay with Telebirr',
      details: 'Send to: 0960737167'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/exams')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Exams
          </button>

          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Complete Your <span className="text-blue-600">Payment</span>
          </h1>
          <p className="text-xl text-slate-600">
            Secure payment for {exam.title}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

            <div className={`bg-gradient-to-r ${exam.color} rounded-2xl p-6 text-white mb-6`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  {exam.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{exam.title}</h3>
                  <p className="text-white/80">{exam.difficulty}</p>
                </div>
              </div>
              <p className="text-white/90 text-sm">{exam.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Duration:</span>
                <span className="font-semibold text-slate-900">{exam.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Students Enrolled:</span>
                <span className="font-semibold text-slate-900">{exam.students}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rating:</span>
                <span className="font-semibold text-slate-900">{exam.rating}/5.0</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Original Price:</span>
                <span className="text-slate-500 line-through">{exam.originalPrice} ETB</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Discount:</span>
                <span className="text-green-600 font-semibold">-{exam.originalPrice - exam.price} ETB</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-slate-900">Total:</span>
                <span className="text-blue-600">{exam.price} ETB</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                <FaShieldAlt className="w-4 h-4" />
                What's Included:
              </div>
              <ul className="space-y-1 text-sm text-green-600">
                {exam.features.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FiCheck className="w-3 h-3" />
                    {feature}
                  </li>
                ))}
                <li className="text-green-500 font-semibold">
                  + {exam.features.length - 4} more features
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Details</h2>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Choose Payment Method
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4 w-full">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === method.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{method.name}</div>
                          <div className="text-sm text-slate-600">{method.description}</div>
                          <div className="text-xs text-blue-600 font-medium mt-1">{method.details}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                          }`}>
                          {paymentMethod === method.id && <FiCheck className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={paymentData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={paymentData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="+251911234567"
                  required
                />
              </div>

              {/* Payment Specific Fields */}
              {paymentMethod === 'bank' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Your Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={paymentData.bankAccount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your account number"
                    required
                  />
                </div>
              )}

              {paymentMethod === 'mobile' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={paymentData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="+251911234567"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Transaction Reference (Optional)
                </label>
                <input
                  type="text"
                  name="transactionRef"
                  value={paymentData.transactionRef}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter transaction reference if available"
                />
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                  <FaShieldAlt className="w-4 h-4" />
                  Secure Payment
                </div>
                <p className="text-sm text-blue-600">
                  Your payment information is encrypted and secure. We never store your financial details.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${isProcessing
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="w-5 h-5" />
                    Pay {exam.price} ETB Now
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPayment;