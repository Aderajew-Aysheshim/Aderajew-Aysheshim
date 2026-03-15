import React, { useState, useEffect } from 'react';
import { useMarketplaceAPI } from '../services/marketplaceAPI';
import { FaShoppingCart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUniversity, FaCreditCard, FaCamera, FaCheckCircle, FaTimesCircle, FaClock, FaTruck, FaBox, FaMoneyBillWave, FaFileInvoice, FaUpload, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { FiPackage, FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiCheck, FiX, FiClock, FiTruck, FiBox } from 'react-icons/fi';

const OrderManagement = ({ item, onClose }) => {
  const { createOrder, submitPayment, loading, error } = useMarketplaceAPI();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState({
    payment_method: 'telebirr',
    transaction_reference: '',
    amount: 0
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    university: '',
    studentId: '',
    deliveryMethod: 'delivery',
    city: '',
    region: ''
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (item) {
      setPaymentData(prev => ({ ...prev, amount: item.price }));
    }
  }, [item]);

  const handleCustomerInfoSubmit = (e) => {
    e.preventDefault();

    // Validate phone number
    const phoneRegex = /^(\+251|0)[9][0-9]{8}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      alert('Please enter a valid Ethiopian phone number');
      return;
    }

    // Create order
    const formattedOrderData = {
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_email: customerInfo.email,
      customer_address: customerInfo.address,
      customer_university: customerInfo.university,
      customer_student_id: customerInfo.studentId,
      seller_name: item.sellerName,
      seller_phone: item.sellerPhone,
      items: [{
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        quantity: 1,
        category: item.category,
        listingType: item.listingType || 'product',
        image: item.image
      }],
      subtotal: item.price,
      delivery_fee: customerInfo.deliveryMethod === 'delivery' ? 50 : 0,
      payment_method: paymentData.payment_method,
      delivery_method: customerInfo.deliveryMethod,
      delivery_address: customerInfo.address,
      delivery_city: customerInfo.city,
      delivery_region: customerInfo.region
    };

    createOrder(formattedOrderData)
      .then(result => {
        setOrderData(result);
        setStep(2);
      })
      .catch(err => {
        alert('Error creating order: ' + err.message);
      });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentScreenshot) {
      alert('Please upload payment screenshot');
      return;
    }

    if (!paymentData.transaction_reference) {
      alert('Please enter transaction reference');
      return;
    }

    try {
      await submitPayment(orderData.order_id, paymentData, paymentScreenshot);
      setShowSuccess(true);
      setStep(3);
    } catch (err) {
      alert('Error submitting payment: ' + err.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        alert('Please upload a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setPaymentScreenshot(file);
    }
  };

  const renderCustomerInfoForm = () => (
    <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>

      <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiUser className="inline mr-1" /> Full Name *
            </label>
            <input
              type="text"
              required
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiPhone className="inline mr-1" /> Phone Number *
            </label>
            <input
              type="tel"
              required
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+2519XXXXXXXX or 09XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiMail className="inline mr-1" /> Email Address
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaUniversity className="inline mr-1" /> University
            </label>
            <input
              type="text"
              value={customerInfo.university}
              onChange={(e) => setCustomerInfo({ ...customerInfo, university: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="AASTU, Addis Ababa University, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              value={customerInfo.studentId}
              onChange={(e) => setCustomerInfo({ ...customerInfo, studentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your student ID (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Method *
            </label>
            <select
              required
              value={customerInfo.deliveryMethod}
              onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="delivery">Home/Office Delivery</option>
              <option value="campus_drop">Campus Drop-off</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiMapPin className="inline mr-1" /> Delivery Address *
          </label>
          <textarea
            required
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter your complete delivery address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Addis Ababa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <input
              type="text"
              value={customerInfo.region}
              onChange={(e) => setCustomerInfo({ ...customerInfo, region: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Addis Ababa"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Item:</span>
              <span className="font-medium">{item?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">ETB {item?.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-medium">ETB {customerInfo.deliveryMethod === 'delivery' ? '50' : '0'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>ETB {item?.price + (customerInfo.deliveryMethod === 'delivery' ? 50 : 0)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating Order...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

      {orderData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" />
            <div>
              <p className="font-semibold text-green-900">Order Created Successfully!</p>
              <p className="text-green-700">Order Number: {orderData.order_number}</p>
              <p className="text-green-700">Total Amount: ETB {orderData.total_amount}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiCreditCard className="inline mr-1" /> Payment Method *
          </label>
          <select
            required
            value={paymentData.payment_method}
            onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="telebirr">Telebirr</option>
            <option value="cbe">CBE (Commercial Bank of Ethiopia)</option>
            <option value="boa">BOA (Bank of Abyssinia)</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>

        {paymentData.payment_method !== 'cash' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Reference *
              </label>
              <input
                type="text"
                required
                value={paymentData.transaction_reference}
                onChange={(e) => setPaymentData({ ...paymentData, transaction_reference: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter transaction reference number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaCamera className="inline mr-1" /> Payment Screenshot *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="payment-screenshot"
                />
                <label htmlFor="payment-screenshot" className="cursor-pointer">
                  {paymentScreenshot ? (
                    <div>
                      <img
                        src={URL.createObjectURL(paymentScreenshot)}
                        alt="Payment screenshot"
                        className="max-h-32 mx-auto rounded"
                      />
                      <p className="text-sm text-gray-600 mt-2">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <FaUpload className="text-gray-400 text-3xl mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload payment screenshot</p>
                      <p className="text-sm text-gray-500">JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions</h3>
          <div className="text-sm text-blue-800 space-y-1">
            {paymentData.payment_method === 'telebirr' && (
              <p>• Pay to Telebirr number: 0960737167 (Aderajew Aysheshim)</p>
            )}
            {paymentData.payment_method === 'cbe' && (
              <p>• Pay to CBE Account: 1000558675668 (Aderajew Aysheshim)</p>
            )}
            {paymentData.payment_method === 'boa' && (
              <p>• Pay to BOA Account: 2000123456789</p>
            )}
            {paymentData.payment_method === 'cash' && (
              <p>• Payment will be collected upon delivery</p>
            )}
            <p>• Amount: ETB {orderData?.total_amount}</p>
            <p>• Upload payment screenshot after payment</p>
          </div>
        </div>

        {/* Contact Information for Payment Issues */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">
            <FaPhone className="inline mr-2" />
            Need Help with Payment?
          </h3>
          <div className="text-sm text-yellow-800 space-y-2">
            <p className="font-medium">If payment doesn't work or you need more information:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <FaPhone className="mr-2 text-yellow-600" />
                <span>Call: +251960737167</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2 text-yellow-600" />
                <span>Email: marketplace@bigsystem.com</span>
              </div>
              <div className="flex items-center">
                <FaWhatsapp className="mr-2 text-yellow-600" />
                <span>WhatsApp: +251960737167</span>
              </div>
              <div className="flex items-center">
                <FaTelegramPlane className="mr-2 text-yellow-600" />
                <span>Telegram: @BigSystemMarketplace</span>
              </div>
            </div>
            <p className="text-xs mt-2">Available: Monday - Saturday, 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Payment'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Completed!</h2>
        <p className="text-gray-600">Your order has been successfully submitted and is being processed.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium">{orderData?.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Item:</span>
            <span className="font-medium">{item?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium">ETB {orderData?.total_amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status:</span>
            <span className="font-medium text-green-600">Submitted</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Status:</span>
            <span className="font-medium text-blue-600">Processing</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• We'll verify your payment within 24 hours</p>
          <p>• You'll receive confirmation via SMS/Email</p>
          <p>• Your order will be processed and shipped</p>
          <p>• Track your order status in your account</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
        <button
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          View My Orders
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              <FaShoppingCart className="inline mr-2" />
              Complete Your Order
            </h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimesCircle className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {step === 1 && renderCustomerInfoForm()}
          {step === 2 && renderPaymentForm()}
          {step === 3 && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
