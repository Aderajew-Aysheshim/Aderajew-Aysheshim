import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FaDollarSign, FaUniversity, FaMobileAlt,
  FaCheckCircle, FaTimesCircle, FaClock, FaDownload,
  FaEye, FaPlus, FaSearch,
  FaUser, FaGraduationCap, FaBook, FaChartBar
} from 'react-icons/fa';

const grade12Courses = [
  { id: 'grade12-math', name: 'Grade 12 Mathematics', price: 500, category: 'entrance' },
  { id: 'grade12-physics', name: 'Grade 12 Physics', price: 500, category: 'entrance' },
  { id: 'grade12-chemistry', name: 'Grade 12 Chemistry', price: 500, category: 'entrance' },
  { id: 'grade12-biology', name: 'Grade 12 Biology', price: 500, category: 'entrance' },
  { id: 'grade12-english', name: 'Grade 12 English', price: 400, category: 'entrance' },
  { id: 'grade12-complete', name: 'Complete Grade 12 Package', price: 2000, category: 'package' },
  { id: 'grade12-premium', name: 'Grade 12 Premium Access', price: 3000, category: 'premium' }
];

const Grade12PaymentSystem = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    courseId: '',
    amount: 0,
    paymentMethod: '',
    transactionId: '',
    receiptFile: null,
    notes: ''
  });

  const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', icon: <FaMobileAlt />, color: 'orange' },
    { id: 'cbebirr', name: 'CBE Birr', icon: <FaUniversity />, color: 'blue' },
    { id: 'awash', name: 'Awash Bank', icon: <FaUniversity />, color: 'green' },
    { id: 'dashen', name: 'Dashen Bank', icon: <FaUniversity />, color: 'purple' },
    { id: 'boa', name: 'Bank of Abyssinia', icon: <FaUniversity />, color: 'red' },
    { id: 'cash', name: 'Cash Payment', icon: <FaDollarSign />, color: 'gray' }
  ];



  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/payments/grade12', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/students/grade12', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/courses/grade12', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.courses || grade12Courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchStudents();
    fetchCourses();
  }, [fetchPayments, fetchStudents, fetchCourses]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      Object.keys(paymentData).forEach(key => {
        if (key === 'receiptFile') {
          formData.append('receipt', paymentData[key]);
        } else {
          formData.append(key, paymentData[key]);
        }
      });

      await axios.post('http://localhost:5000/api/payments/grade12', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchPayments();
      setShowPaymentModal(false);
      resetPaymentForm();
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (paymentId, action) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/payments/grade12/${paymentId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentForm = () => {
    setPaymentData({
      studentId: '',
      courseId: '',
      amount: 0,
      paymentMethod: '',
      transactionId: '',
      receiptFile: null,
      notes: ''
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paymentStats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    verified: payments.filter(p => p.status === 'verified').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
    revenue: payments.filter(p => p.status === 'verified').reduce((sum, p) => sum + (p.amount || 0), 0)
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-3xl font-bold">{paymentStats.total}</p>
            </div>
            <FaDollarSign className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{paymentStats.pending}</p>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-3xl font-bold text-green-600">{paymentStats.verified}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{paymentStats.rejected}</p>
            </div>
            <FaTimesCircle className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-blue-600">{paymentStats.revenue} ETB</p>
            </div>
            <FaChartBar className="text-blue-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-800">Contact Information</h3>
            <p className="text-sm text-blue-600">For payment inquiries and support</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-800">0960737167</p>
            <p className="text-sm text-blue-600">Call/WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 10).map((payment) => (
                <tr key={payment._id} className="border-t">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{payment.studentName}</p>
                      <p className="text-sm text-gray-500">{payment.studentEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{payment.courseName}</td>
                  <td className="px-4 py-3">{payment.amount} ETB</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      {paymentMethods.find(m => m.id === payment.paymentMethod)?.icon}
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'verified' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPaymentsList = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPlus /> Add Payment
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-green-800">Payment Support</h3>
            <p className="text-sm text-green-600">For payment verification and inquiries</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-800">0960737167</p>
            <p className="text-sm text-green-600">Available 24/7</p>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment Method</th>
              <th className="px-4 py-3 text-left">Transaction ID</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment._id} className="border-t">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{payment.studentName}</p>
                    <p className="text-sm text-gray-500">{payment.studentEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{payment.courseName}</p>
                    <p className="text-sm text-gray-500">{payment.courseCategory}</p>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{payment.amount} ETB</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-${paymentMethods.find(m => m.id === payment.paymentMethod)?.color || 'gray'}-100 flex items-center justify-center`}>
                      {paymentMethods.find(m => m.id === payment.paymentMethod)?.icon}
                    </div>
                    <span>{paymentMethods.find(m => m.id === payment.paymentMethod)?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-sm">{payment.transactionId}</td>
                <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    payment.status === 'verified' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {payment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handlePaymentVerification(payment._id, 'verify')}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          <FaCheckCircle /> Verify
                        </button>
                        <button
                          onClick={() => handlePaymentVerification(payment._id, 'reject')}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        // View payment details functionality can be added here
                        console.log('View payment details:', payment);
                      }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                      title="View payment details"
                    >
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaymentModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Add New Payment</h3>
        </div>

        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Student</label>
            <select
              value={paymentData.studentId}
              onChange={(e) => setPaymentData({ ...paymentData, studentId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName} - {student.email}
                </option>
              ))}
            </select>
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Course</label>
            <select
              value={paymentData.courseId}
              onChange={(e) => {
                const course = courses.find(c => c.id === e.target.value);
                setPaymentData({
                  ...paymentData,
                  courseId: e.target.value,
                  amount: course?.price || 0
                });
              }}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.price} ETB
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentData({ ...paymentData, paymentMethod: method.id })}
                  className={`p-3 rounded-lg border-2 transition-all ${paymentData.paymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`text-${method.color}-500`}>{method.icon}</div>
                    <span className="text-xs font-medium">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount and Transaction ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (ETB)</label>
              <input
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Transaction ID</label>
              <input
                type="text"
                value={paymentData.transactionId}
                onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Receipt (Optional)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setPaymentData({ ...paymentData, receiptFile: e.target.files[0] })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={paymentData.notes}
              onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FaGraduationCap className="text-blue-500 text-2xl" />
              <h1 className="text-xl font-bold">Grade 12 Payment Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
                <FaDownload /> Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
              { id: 'payments', label: 'Payments', icon: <FaDollarSign /> },
              { id: 'students', label: 'Students', icon: <FaUser /> },
              { id: 'courses', label: 'Courses', icon: <FaBook /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'payments' && renderPaymentsList()}
            {activeTab === 'students' && (
              <div className="space-y-4">
                {/* Contact Information */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-purple-800">Student Support</h3>
                      <p className="text-sm text-purple-600">For registration and course inquiries</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-800">0960737167</p>
                      <p className="text-sm text-purple-600">Student Helpline</p>
                    </div>
                  </div>
                </div>

                {/* Students List */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Grade 12 Students</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                      <div key={student._id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Grade: {student.gradeLevel}</p>
                          <p>Registered: {new Date(student.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'courses' && (
              <div className="space-y-4">
                {/* Contact Information */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-orange-800">Course Enrollment</h3>
                      <p className="text-sm text-orange-600">For course selection and pricing inquiries</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-800">0960737167</p>
                      <p className="text-sm text-orange-600">Course Hotline</p>
                    </div>
                  </div>
                </div>

                {/* Courses List */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Grade 12 Courses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{course.name}</h4>
                          <span className="text-lg font-bold text-blue-600">{course.price} ETB</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Category: {course.category}</p>
                          <p>Students: {Math.floor(Math.random() * 100)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && renderPaymentModal()}
    </div>
  );
};

export default Grade12PaymentSystem;
