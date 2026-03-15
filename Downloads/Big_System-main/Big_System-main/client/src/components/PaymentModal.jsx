import React, { useState } from 'react';
import { FaTimes, FaCreditCard, FaMobileAlt, FaUniversity, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const PaymentModal = ({ isOpen, onClose, item, onPaymentSuccess, onPaymentFailure, manualApproval = false, accounts }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, success, error
  const [transactionNumber, setTransactionNumber] = useState('');

  if (!isOpen || !item) return null;

  const paymentMethods = [
    { id: 'cbe', name: 'CBE (Commercial Bank of Ethiopia)', icon: <FaUniversity />, color: 'blue' },
    { id: 'boa', name: 'BOA (Bank of Abyssinia)', icon: <FaUniversity />, color: 'green' },
    { id: 'telebirr', name: 'Telebirr', icon: <FaMobileAlt />, color: 'orange' }
  ];

  const selectedAccount = selectedMethod && accounts && accounts[selectedMethod] ? accounts[selectedMethod] : null;

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    if (manualApproval) {
      const tx = transactionNumber.trim();
      if (!tx) {
        alert('Please enter the transaction number');
        return;
      }

      setIsProcessing(true);
      setPaymentStatus('idle');
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentSuccess(item, selectedMethod, { transactionNumber: tx, status: 'pending' });
          handleClose();
        }, 700);
      } catch (error) {
        setPaymentStatus('error');
        onPaymentFailure(item, selectedMethod);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentSuccess(item, selectedMethod);
          handleClose();
        }, 1500);
      } else {
        setPaymentStatus('error');
        setTimeout(() => {
          onPaymentFailure(item, selectedMethod);
          setPaymentStatus('idle');
        }, 1500);
      }
    } catch (error) {
      setPaymentStatus('error');
      onPaymentFailure(item, selectedMethod);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedMethod('');
    setPaymentStatus('idle');
    setIsProcessing(false);
    setTransactionNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/20 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Payment</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isProcessing}
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* Item Details */}
        <div className="p-4 border-b border-white/10">
          <div className="bg-white/5 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-white mb-1 truncate">{item.title}</h3>
            <p className="text-gray-400 text-xs mb-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-xs">Total:</span>
              <div className="text-right">
                {item.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">ETB {item.originalPrice}</span>
                )}
                <span className="text-lg font-bold text-purple-400 ml-1">ETB {item.price}</span>
              </div>
            </div>
          </div>

          {selectedAccount && (
            <div className="mt-3 bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="text-white text-sm font-medium mb-1">Pay To</div>
              <div className="text-gray-300 text-xs">
                <div className="font-medium text-white">{selectedAccount.title || paymentMethods.find(m => m.id === selectedMethod)?.name}</div>
                {selectedAccount.accountName && (
                  <div>Name: <span className="text-white">{selectedAccount.accountName}</span></div>
                )}
                {selectedAccount.accountNumber && (
                  <div>Account: <span className="text-white">{selectedAccount.accountNumber}</span></div>
                )}
                {selectedAccount.phone && (
                  <div>Phone: <span className="text-white">{selectedAccount.phone}</span></div>
                )}
                {!selectedAccount.accountNumber && !selectedAccount.phone && (
                  <div className="text-amber-300 mt-1">Admin needs to set account details.</div>
                )}
              </div>
            </div>
          )}

          {manualApproval && (
            <div className="mt-3">
              <input
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Transaction number"
              />
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3">Method</h3>
          <div className="space-y-2">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                disabled={isProcessing}
                className={`w-full p-3 rounded-lg border transition-all text-sm ${selectedMethod === method.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 bg-${method.color}-500/20 rounded flex items-center justify-center text-${method.color}-400`}>
                      {method.icon}
                    </div>
                    <span className="text-white text-xs">{method.name}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${selectedMethod === method.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-500'
                    }`}>
                    {selectedMethod === method.id && (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus !== 'idle' && (
          <div className="p-4 border-b border-white/10">
            {paymentStatus === 'success' ? (
              <div className="flex items-center space-x-2 text-green-400">
                <FaCheckCircle className="text-sm" />
                <span className="text-sm font-medium">{manualApproval ? 'Submitted for approval!' : 'Payment successful!'}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-400">
                <FaExclamationTriangle className="text-sm" />
                <span className="text-sm font-medium">Payment failed. Try again.</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 flex space-x-2">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || !selectedMethod || (manualApproval && !transactionNumber.trim())}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-1 text-sm"
          >
            {isProcessing ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaCreditCard className="text-xs" />
                <span>{manualApproval ? 'Submit' : `Pay ${item.price}`}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
