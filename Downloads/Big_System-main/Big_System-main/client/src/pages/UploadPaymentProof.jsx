import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUpload, FaMoneyBillWave, FaReceipt, FaCheckCircle } from 'react-icons/fa';

const UploadPaymentProof = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem('userType');

  // Get payment details from navigation state or use defaults
  const defaultPaymentType = location.state?.paymentType || (userType === 'tutor' ? 'tutor-activation' : 'registration');
  const defaultAmount = location.state?.amount || (userType === 'tutor' ? 1000 : 50);

  const [formData, setFormData] = useState({
    paymentType: defaultPaymentType,
    amount: defaultAmount,
    paymentMethod: 'cbe',
    transactionReference: ''
  });
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'File size must be less than 5MB', type: 'error' });
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ text: 'Only JPG, PNG, GIF, WEBP, and PDF files are allowed', type: 'error' });
        return;
      }

      setScreenshot(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      setMessage({ text: '', type: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!screenshot) {
      setMessage({ text: 'Please upload a payment screenshot', type: 'error' });
      return;
    }

    if (!formData.transactionReference) {
      setMessage({ text: 'Please enter transaction reference', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    const uploadData = new FormData();
    uploadData.append('screenshot', screenshot);
    uploadData.append('paymentType', formData.paymentType);
    uploadData.append('amount', formData.amount);
    uploadData.append('paymentMethod', formData.paymentMethod);
    uploadData.append('transactionReference', formData.transactionReference);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/payment-verification/upload',
        uploadData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage({ text: 'Payment proof uploaded successfully! Awaiting admin verification.', type: 'success' });
      setTimeout(() => navigate('/payment-status'), 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Upload failed. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentInstructions = {
    cbe: {
      name: 'Commercial Bank of Ethiopia (CBE)',
      account: '1000558675668',
      accountName: 'Aderajew Aysheshim',
      steps: [
        'Login to CBE Birr app',
        'Select "Send Money"',
        'Enter account number: 1000558675668',
        'Enter amount: ' + formData.amount + ' ETB',
        'Complete payment',
        'Take screenshot of confirmation',
        'Upload screenshot below'
      ]
    },
    telebirr: {
      name: 'Telebirr',
      phone: '0960737167',
      accountName: 'Aderajew Aysheshim',
      steps: [
        'Open Telebirr app',
        'Select "Send Money"',
        'Enter phone: 0960737167',
        'Enter amount: ' + formData.amount + ' ETB',
        'Complete payment',
        'Take screenshot of confirmation',
        'Upload screenshot below'
      ]
    },
    'bank-transfer': {
      name: 'Bank Transfer',
      account: '1000558675668',
      bank: 'Commercial Bank of Ethiopia',
      branch: 'Addis Ababa Main Branch',
      accountName: 'Aderajew Aysheshim',
      steps: [
        'Visit any CBE branch',
        'Fill deposit slip',
        'Account: 1000558675668',
        'Amount: ' + formData.amount + ' ETB',
        'Get receipt',
        'Take photo of receipt',
        'Upload photo below'
      ]
    }
  };

  const currentInstructions = paymentInstructions[formData.paymentMethod];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-500 hover:text-primary-600 font-medium mb-4"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Payment Proof</h1>
          <p className="text-gray-600">Submit your payment screenshot for verification</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Instructions */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-500" />
              Payment Instructions
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="input"
              >
                <option value="cbe">CBE Birr</option>
                <option value="telebirr">Telebirr</option>
                <option value="bank-transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-2">{currentInstructions.name}</h3>
              {currentInstructions.account && (
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Account:</strong> {currentInstructions.account}
                </p>
              )}
              {currentInstructions.phone && (
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Phone:</strong> {currentInstructions.phone}
                </p>
              )}
              {currentInstructions.bank && (
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Bank:</strong> {currentInstructions.bank}
                </p>
              )}
              <p className="text-sm text-gray-700">
                <strong>Account Name:</strong> {currentInstructions.accountName}
              </p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
              <p className="font-bold text-gray-900 mb-2">Amount to Pay:</p>
              <p className="text-3xl font-bold text-green-600">{formData.amount} ETB</p>
              <p className="text-sm text-gray-600 mt-1">
                {formData.paymentType === 'tutor-activation'
                  ? 'Tutor Registration Fee'
                  : formData.paymentType === 'registration'
                    ? 'Student Registration Fee'
                    : 'Pro Subscription (1 Month)'}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Steps:</h3>
              <ol className="space-y-2">
                {currentInstructions.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Upload Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FaUpload className="mr-2 text-primary-500" />
              Upload Screenshot
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Reference *
                </label>
                <div className="relative">
                  <FaReceipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="transactionReference"
                    value={formData.transactionReference}
                    onChange={handleChange}
                    placeholder="e.g., TXN123456789"
                    className="input pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the transaction ID from your payment confirmation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Screenshot *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                    className="hidden"
                    id="screenshot-upload"
                    required
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    {preview ? (
                      <div>
                        <img src={preview} alt="Preview" className="max-h-64 mx-auto mb-2 rounded" />
                        <p className="text-sm text-green-600 font-medium">
                          <FaCheckCircle className="inline mr-1" />
                          Screenshot uploaded
                        </p>
                      </div>
                    ) : (
                      <>
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-1">
                          {screenshot ? screenshot.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-gray-500">
                          JPG, PNG, GIF, WEBP, or PDF (Max 5MB)
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Make sure your screenshot clearly shows:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1 ml-4">
                  <li>• Transaction reference number</li>
                  <li>• Amount paid ({formData.amount} ETB)</li>
                  <li>• Date and time</li>
                  <li>• Payment status (Success/Completed)</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-lg"
              >
                {loading ? 'Uploading...' : 'Submit for Verification'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPaymentProof;
