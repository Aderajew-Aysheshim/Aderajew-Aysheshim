import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMoneyBillWave, FaUpload, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const CoursePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  const [paymentData, setPaymentData] = useState({
    paymentMethod: '',
    transactionRef: '',
    screenshot: null,
    preview: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const paymentMethods = [
    {
      id: 'cbe',
      name: 'CBE Birr',
      account: '1000558675668',
      accountName: 'Aderajew Aysheshim'
    },
    {
      id: 'telebirr',
      name: 'Telebirr',
      phone: '0960737167',
      accountName: 'Aderajew Aysheshim'
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      bank: 'Commercial Bank of Ethiopia',
      account: '1000558675668'
    }
  ];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No course selected</p>
          <button onClick={() => navigate('/courses')} className="btn btn-primary">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'File size must be less than 5MB', type: 'error' });
        return;
      }

      setPaymentData({ ...paymentData, screenshot: file });

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPaymentData(prev => ({ ...prev, preview: reader.result }));
        };
        reader.readAsDataURL(file);
      }
      setMessage({ text: '', type: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentData.paymentMethod) {
      setMessage({ text: 'Please select a payment method', type: 'error' });
      return;
    }

    if (!paymentData.transactionRef) {
      setMessage({ text: 'Please enter transaction reference', type: 'error' });
      return;
    }

    if (!paymentData.screenshot) {
      setMessage({ text: 'Please upload payment screenshot', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('screenshot', paymentData.screenshot);
      formData.append('paymentType', 'course-payment');
      formData.append('amount', course.price);
      formData.append('paymentMethod', paymentData.paymentMethod);
      formData.append('transactionReference', paymentData.transactionRef);
      formData.append('courseId', course.id);

      await axios.post(
        'http://localhost:5000/api/payment-verification/upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage({
        text: 'Payment submitted successfully! Awaiting admin verification.',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/payment-status');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setMessage({
        text: error.response?.data?.error || 'Failed to submit payment',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentData.paymentMethod);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Courses
        </button>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Payment</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="badge badge-info">{course.subject}</span>
                <span className="badge bg-yellow-500 text-white ml-2">Premium Course</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">{course.price} ETB</div>
                <div className="text-sm text-gray-600">{course.duration} hours</div>
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Choose Payment Method</h4>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentData({ ...paymentData, paymentMethod: method.id })}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentData.paymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-gray-900">{method.name}</h5>
                        {method.account && <p className="text-sm text-gray-600">Account: {method.account}</p>}
                        {method.phone && <p className="text-sm text-gray-600">Phone: {method.phone}</p>}
                        {method.bank && <p className="text-sm text-gray-600">Bank: {method.bank}</p>}
                      </div>
                      <FaMoneyBillWave className="text-2xl text-primary-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Instructions */}
            {selectedMethod && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-3">Payment Instructions</h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>1. Transfer {course.price} ETB to the account above</li>
                  <li>2. Take a screenshot of the confirmation</li>
                  <li>3. Enter the transaction reference number</li>
                  <li>4. Upload the screenshot below</li>
                  <li>5. Submit for admin verification</li>
                </ol>
              </div>
            )}

            {/* Transaction Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Reference Number *
              </label>
              <input
                type="text"
                value={paymentData.transactionRef}
                onChange={(e) => setPaymentData({ ...paymentData, transactionRef: e.target.value })}
                placeholder="Enter transaction reference"
                className="input"
                required
              />
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Payment Screenshot *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                  id="screenshot-upload"
                  required
                />
                <label htmlFor="screenshot-upload" className="cursor-pointer">
                  {paymentData.preview ? (
                    <div>
                      <img src={paymentData.preview} alt="Preview" className="max-h-64 mx-auto mb-2 rounded" />
                      <p className="text-sm text-green-600 font-medium">
                        <FaCheckCircle className="inline mr-1" />
                        Screenshot uploaded
                      </p>
                    </div>
                  ) : (
                    <>
                      <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">JPG, PNG, or PDF (Max 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4"
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoursePayment;
