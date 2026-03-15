import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilePdf, FaEye, FaLock, FaUnlock,
  FaDollarSign, FaUsers, FaChartBar, FaClock, FaCheckCircle, FaTimesCircle,
  FaUpload, FaDownload, FaFilter, FaCalendar, FaBook, FaGraduationCap,
  FaUniversity, FaSchool, FaChalkboardTeacher, FaStar, FaTrophy
} from 'react-icons/fa';

const ExamManagementSystem = () => {
  const [activeSection, setActiveSection] = useState('exams');
  const [examType, setExamType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Data states
  const [exams, setExams] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'exam',
    examCategory: '',
    year: '',
    price: 0,
    accessLevel: 'free',
    file: null,
    thumbnail: null,
    tags: [],
    duration: 60,
    questions: [],
    difficulty: 'medium'
  });

  const examCategories = {
    freshman: {
      name: 'Freshman Exams',
      icon: <FaUniversity />,
      color: 'blue',
      subcategories: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Civics']
    },
    grade12: {
      name: 'Grade 12 Exams',
      icon: <FaGraduationCap />,
      color: 'purple',
      subcategories: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography']
    },
    gat: {
      name: 'GAT Preparation',
      icon: <FaBook />,
      color: 'green',
      subcategories: ['Quantitative', 'Verbal', 'Logical Reasoning', 'Analytical Writing']
    },
    exit: {
      name: 'Exit Exams',
      icon: <FaSchool />,
      color: 'red',
      subcategories: ['Engineering', 'Medicine', 'Law', 'Business', 'Agriculture']
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [activeSection]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeSection === 'exams') {
        const examResponse = await axios.get('http://localhost:5000/api/admin/exams/all', { headers });
        setExams(examResponse.data.exams || []);
      } else if (activeSection === 'payments') {
        const paymentResponse = await axios.get('http://localhost:5000/api/admin/payments/all', { headers });
        setPayments(paymentResponse.data.payments || []);
      } else if (activeSection === 'students') {
        const studentResponse = await axios.get('http://localhost:5000/api/admin/students/all', { headers });
        setStudents(studentResponse.data.students || []);
      } else if (activeSection === 'courses') {
        const courseResponse = await axios.get('http://localhost:5000/api/admin/courses/all', { headers });
        setCourses(courseResponse.data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'questions' || key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingItem) {
        await axios.put(
          `http://localhost:5000/api/admin/exams/${editingItem._id}`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/exams',
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchAllData();
      setShowModal(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Error saving exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAction = async (paymentId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/admin/payments/${paymentId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllData();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/api/admin/${type}s/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchAllData();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      type: 'exam',
      examCategory: '',
      year: '',
      price: 0,
      accessLevel: 'free',
      file: null,
      thumbnail: null,
      tags: [],
      duration: 60,
      questions: [],
      difficulty: 'medium'
    });
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = examType === 'all' || exam.examCategory === examType;
    return matchesSearch && matchesType;
  });

  const renderExamModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">
            {editingItem ? 'Edit Exam' : 'Create New Exam'}
          </h3>
        </div>

        <form onSubmit={handleExamSubmit} className="p-6 space-y-4">
          {/* Exam Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Exam Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(examCategories).map(([key, category]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, examCategory: key })}
                  className={`p-3 rounded-lg border-2 transition-all ${formData.examCategory === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`text-${category.color}-500`}>{category.icon}</div>
                    <span className="text-xs font-medium">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Subject</option>
                {formData.examCategory && examCategories[formData.examCategory]?.subcategories?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing and Access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (ETB)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Access Level</label>
              <select
                value={formData.accessLevel}
                onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Exam File (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderExamsList = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(examCategories).map(([key, category]) => {
          const count = exams.filter(exam => exam.examCategory === key).length;
          return (
            <div key={key} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{category.name}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <div className={`text-${category.color}-500 text-2xl`}>
                  {category.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Types</option>
          {Object.entries(examCategories).map(([key, category]) => (
            <option key={key} value={key}>{category.name}</option>
          ))}
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FaPlus /> Add Exam
        </button>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Access</th>
              <th className="px-4 py-3 text-left">Students</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam._id} className="border-t">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-gray-500">{exam.description?.substring(0, 50)}...</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.examCategory === 'freshman' ? 'bg-blue-100 text-blue-800' :
                      exam.examCategory === 'grade12' ? 'bg-purple-100 text-purple-800' :
                        exam.examCategory === 'gat' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                    }`}>
                    {examCategories[exam.examCategory]?.name || exam.examCategory}
                  </span>
                </td>
                <td className="px-4 py-3">{exam.subject}</td>
                <td className="px-4 py-3">
                  {exam.price > 0 ? `${exam.price} ETB` : 'Free'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${exam.accessLevel === 'free' ? 'bg-green-100 text-green-800' :
                      exam.accessLevel === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {exam.accessLevel}
                  </span>
                </td>
                <td className="px-4 py-3">{exam.enrolledStudents || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(exam);
                        setFormData(exam);
                        setShowModal(true);
                      }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(exam._id, 'exam')}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FaTrash />
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

  const renderPaymentsList = () => (
    <div className="space-y-4">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === 'verified').length}
              </p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {payments.filter(p => p.status === 'rejected').length}
              </p>
            </div>
            <FaTimesCircle className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                {payments.reduce((sum, p) => sum + (p.amount || 0), 0)} ETB
              </p>
            </div>
            <FaDollarSign className="text-blue-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Course/Exam</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-t">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{payment.studentName}</p>
                    <p className="text-sm text-gray-500">{payment.studentEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{payment.itemName}</td>
                <td className="px-4 py-3">{payment.amount} ETB</td>
                <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
                          onClick={() => handlePaymentAction(payment._id, 'verify')}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handlePaymentAction(payment._id, 'reject')}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Exam & Payment Management</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <FaFilter />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <FaDownload />
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
              { id: 'exams', label: 'Exams', icon: <FaBook /> },
              { id: 'payments', label: 'Payments', icon: <FaDollarSign /> },
              { id: 'students', label: 'Students', icon: <FaUsers /> },
              { id: 'courses', label: 'Courses', icon: <FaGraduationCap /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeSection === tab.id
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
            {activeSection === 'exams' && renderExamsList()}
            {activeSection === 'payments' && renderPaymentsList()}
            {activeSection === 'students' && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Student Management</h3>
                <p className="text-gray-500">Student management features coming soon...</p>
              </div>
            )}
            {activeSection === 'courses' && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Course Management</h3>
                <p className="text-gray-500">Course management features coming soon...</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && renderExamModal()}
    </div>
  );
};

export default ExamManagementSystem;
