import React, { useState } from 'react';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaCheckCircle, FaLock, FaShieldAlt } from 'react-icons/fa';

const PaymentGateway = ({ planType, onPaymentComplete, amount = 299 }) => {
  const [selectedMethod, setSelectedMethod] = useState('telebirr');
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    transactionId: '',
    bankAccount: '',
    accountHolder: ''
  });
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: select method, 2: payment details, 3: confirmation

  const paymentMethods = [
    {
      id: 'telebirr',
      name: 'Telebirr',
      icon: <FaMobileAlt className="text-2xl" />,
      description: 'Pay using Telebirr mobile money',
      color: 'green'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <FaUniversity className="text-2xl" />,
      description: 'Direct bank deposit/transfer',
      color: 'blue'
    }
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
      onPaymentComplete({
        method: selectedMethod,
        amount: amount,
        transactionId: paymentData.transactionId || 'TXN' + Date.now(),
        status: 'completed'
      });
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Choose Payment Method</h3>
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => handleMethodSelect(method.id)}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            selectedMethod === method.id
              ? `border-${method.color}-500 bg-${method.color}-50`
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`text-${method.color}-600`}>
              {method.icon}
            </div>
            <div className="text-left">
              <div className="font-semibold">{method.name}</div>
              <div className="text-sm text-gray-600">{method.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        Payment Details - {paymentMethods.find(m => m.id === selectedMethod)?.name}
      </h3>
      
      {selectedMethod === 'telebirr' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Telebirr Phone Number</label>
            <input
              type="tel"
              value={paymentData.phoneNumber}
              onChange={(e) => setPaymentData({...paymentData, phoneNumber: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="0912345678"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Transaction ID (after payment)</label>
            <input
              type="text"
              value={paymentData.transactionId}
              onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter transaction ID"
              required
            />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm"><strong>To pay via Telebirr:</strong></p>
            <ol className="text-sm mt-2 space-y-1">
              <li>1. Open Telebirr app</li>
              <li>2. Send ETB {amount} to: 0912345678</li>
              <li>3. Enter transaction ID above</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name</label>
            <select className="w-full p-3 border rounded-lg" required>
              <option value="">Select Bank</option>
              <option value="cbe">Commercial Bank of Ethiopia</option>
              <option value="awash">Awash Bank</option>
              <option value="dashen">Dashen Bank</option>
              <option value="wegagen">Wegagen Bank</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account Number</label>
            <input
              type="text"
              value={paymentData.bankAccount}
              onChange={(e) => setPaymentData({...paymentData, bankAccount: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="Your bank account number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account Holder Name</label>
            <input
              type="text"
              value={paymentData.accountHolder}
              onChange={(e) => setPaymentData({...paymentData, accountHolder: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="Name on bank account"
              required
            />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Bank Transfer Details:</strong></p>
            <div className="text-sm mt-2 space-y-1">
              <p>Account Name: TutorHub Ethiopia</p>
              <p>Account Number: 1000123456</p>
              <p>Amount: ETB {amount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handlePaymentSubmit}
          disabled={processing}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay ETB ${amount}`}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-4">
      <div className="text-green-600 text-5xl mb-4">
        <FaCheckCircle />
      </div>
      <h3 className="text-2xl font-bold text-green-600">Payment Successful!</h3>
      <p className="text-gray-600">
        Your {planType} subscription has been activated.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p><strong>Amount:</strong> ETB {amount}</p>
        <p><strong>Method:</strong> {paymentMethods.find(m => m.id === selectedMethod)?.name}</p>
        <p><strong>Status:</strong> Active</p>
      </div>
      <button
        onClick={() => onPaymentComplete({ success: true })}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Continue to Registration
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Security Badge */}
      <div className="flex items-center justify-center mb-6">
        <FaShieldAlt className="text-green-600 mr-2" />
        <span className="text-sm text-gray-600">Secure Payment Powered by TutorHub</span>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > stepNumber ? <FaCheckCircle className="text-sm" /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Render Current Step */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <FaLock className="mr-1" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center">
            <FaCreditCard className="mr-1" />
            <span>Secure</span>
          </div>
          <div className="flex items-center">
            <FaShieldAlt className="mr-1" />
            <span>Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
