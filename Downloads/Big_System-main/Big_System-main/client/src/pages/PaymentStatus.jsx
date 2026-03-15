import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaUpload } from 'react-icons/fa';

const PaymentStatus = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/payment-verification/my-submissions',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissions(response.data.verifications);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="badge badge-warning flex items-center space-x-1">
            <FaClock />
            <span>Pending Review</span>
          </span>
        );
      case 'approved':
        return (
          <span className="badge badge-success flex items-center space-x-1">
            <FaCheckCircle />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="badge bg-red-100 text-red-800 flex items-center space-x-1">
            <FaTimesCircle />
            <span>Rejected</span>
          </span>
        );
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  const getPaymentTypeLabel = (type) => {
    if (!type) return 'Payment';

    switch (type) {
      case 'subscription':
        return 'Premium Subscription';
      case 'tutor-activation':
        return 'Tutor Profile Activation';
      case 'course-payment':
        return 'Course Payment';
      case 'registration':
        return 'Registration Fee';
      default:
        return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Status</h1>
          <p className="text-gray-600">Track your payment verification status</p>
        </div>

        {submissions.length === 0 ? (
          <div className="card text-center py-12">
            <FaMoneyBillWave className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No payment submissions yet</p>
            <Link to="/upload-payment" className="btn btn-primary inline-flex items-center space-x-2">
              <FaUpload />
              <span>Upload Payment Proof</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id || submission._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {getPaymentTypeLabel(submission.payment_type || submission.paymentType)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Submitted: {new Date(submission.created_at || submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-bold text-green-600 text-lg">{submission.amount} ETB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {(submission.payment_method || submission.paymentMethod || 'N/A').replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reference</p>
                    <p className="font-medium text-gray-900">
                      {submission.transaction_reference || submission.transactionReference || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-gray-900 capitalize">{submission.status || 'pending'}</p>
                  </div>
                </div>

                {submission.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      <FaClock className="inline mr-2" />
                      Your payment is being reviewed by our admin team. This usually takes 24-48 hours.
                    </p>
                  </div>
                )}

                {submission.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800">
                      <FaCheckCircle className="inline mr-2" />
                      Your payment has been approved! Your account has been updated.
                    </p>
                  </div>
                )}

                {submission.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-800 mb-2">
                      <FaTimesCircle className="inline mr-2" />
                      Your payment was rejected. Please submit a new payment with correct information.
                    </p>
                    {submission.adminNotes && (
                      <p className="text-sm text-red-700">
                        <strong>Reason:</strong> {submission.adminNotes}
                      </p>
                    )}
                  </div>
                )}

                {submission.adminNotes && submission.status === 'approved' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes:</p>
                    <p className="text-gray-900">{submission.adminNotes}</p>
                  </div>
                )}

                <div className="mt-4">
                  {(submission.screenshotUrl || submission.screenshot_url || submission.screenshot_path) && (
                    <button
                      onClick={() => {
                        const url = submission.screenshotUrl || submission.screenshot_url || submission.screenshot_path;
                        window.open(url.startsWith('http') ? url : `http://localhost:5000${url}`, '_blank');
                      }}
                      className="text-primary-500 hover:text-primary-600 font-medium text-sm"
                    >
                      View Screenshot →
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="card bg-blue-50 border-2 border-blue-200">
              <p className="text-sm text-blue-800 mb-3">
                Need to submit another payment?
              </p>
              <Link to="/upload-payment" className="btn btn-primary inline-flex items-center space-x-2">
                <FaUpload />
                <span>Upload New Payment</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
