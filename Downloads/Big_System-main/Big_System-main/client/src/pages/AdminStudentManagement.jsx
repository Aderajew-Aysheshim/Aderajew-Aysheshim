import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUser, FaEnvelope, FaPhone, FaSchool, FaSearch, FaFilter,
  FaEye, FaCrown, FaTrash, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';

const AdminStudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/students/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setStudents(res.data.students);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      alert('Failed to load students');
      setLoading(false);
    }
  };

  const grantPremium = async (studentId) => {
    const months = window.prompt('Enter number of months for premium access:', '1');
    if (!months) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/students/${studentId}/premium`,
        { months: parseInt(months) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Premium access granted!');
      fetchStudents();
      if (selectedStudent?.id === studentId) {
        setSelectedStudent({ ...selectedStudent, is_premium: true });
      }
    } catch (err) {
      console.error('Error granting premium:', err);
      alert('Failed to grant premium access');
    }
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/students/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Student deleted');
      fetchStudents();
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'premium') return matchesSearch && student.is_premium;
    if (filterStatus === 'free') return matchesSearch && !student.is_premium;
    if (filterStatus === 'paid_registration') return matchesSearch && student.registration_fee_paid;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedStudent(null)}
                className="btn btn-outline"
              >
                ← Back to All Students
              </button>
              <div className="flex gap-2">
                {!selectedStudent.is_premium && (
                  <button
                    onClick={() => grantPremium(selectedStudent.id)}
                    className="btn bg-yellow-500 text-white hover:bg-yellow-600 flex items-center gap-2"
                  >
                    <FaCrown /> Grant Premium
                  </button>
                )}
                <button
                  onClick={() => deleteStudent(selectedStudent.id)}
                  className="btn bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Student Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center mb-6">
                  <img
                    src={selectedStudent.profile_photo ? `http://localhost:5000${selectedStudent.profile_photo}` : 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-500 mb-4"
                  />
                  <h2 className="text-2xl font-bold">
                    {selectedStudent.full_name}
                  </h2>
                  <p className="text-gray-600">{selectedStudent.grade_level || 'Student'}</p>
                  <div className="mt-3">
                    {selectedStudent.is_premium ? (
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 flex items-center justify-center gap-2">
                        <FaCrown /> Premium Member
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                        Free Account
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-medium">{selectedStudent.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaSchool className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">School</p>
                      <p className="font-medium">{selectedStudent.school || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaUser className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Grade Level</p>
                      <p className="font-medium">{selectedStudent.grade_level || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              {/* Account Details */}
              <div className="card mb-6">
                <h3 className="text-xl font-bold mb-4">Account Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Registration Fee</p>
                      <p className="font-medium flex items-center gap-2">
                        {selectedStudent.registration_fee_paid ? (
                          <>
                            <FaCheckCircle className="text-green-500" />
                            <span className="text-green-600">Paid</span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-red-500" />
                            <span className="text-red-600">Not Paid</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Premium Status</p>
                      <p className="font-medium flex items-center gap-2">
                        {selectedStudent.is_premium ? (
                          <>
                            <FaCrown className="text-yellow-500" />
                            <span className="text-yellow-600">Active</span>
                          </>
                        ) : (
                          <span className="text-gray-600">Free Account</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedStudent.is_premium && selectedStudent.premium_expires_at && (
                    <div>
                      <p className="text-sm text-gray-600">Premium Expires</p>
                      <p className="font-medium">
                        {new Date(selectedStudent.premium_expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {new Date(selectedStudent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot */}
              {selectedStudent.registration_payment_screenshot && (
                <div className="card">
                  <h3 className="text-xl font-bold mb-4">Registration Payment Screenshot</h3>
                  <img
                    src={`http://localhost:5000${selectedStudent.registration_payment_screenshot}`}
                    alt="Payment Screenshot"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="card mb-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Student Management</h1>
              <p className="text-lg opacity-90">Manage all registered students</p>
            </div>
            <FaUser className="text-6xl opacity-50" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card bg-blue-50 border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{students.length}</div>
            <div className="text-gray-700 mt-1">Total Students</div>
          </div>
          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600">
              {students.filter(s => s.is_premium).length}
            </div>
            <div className="text-gray-700 mt-1">Premium Members</div>
          </div>
          <div className="card bg-green-50 border-2 border-green-200">
            <div className="text-3xl font-bold text-green-600">
              {students.filter(s => s.registration_fee_paid).length}
            </div>
            <div className="text-gray-700 mt-1">Paid Registration</div>
          </div>
          <div className="card bg-gray-50 border-2 border-gray-200">
            <div className="text-3xl font-bold text-gray-600">
              {students.filter(s => !s.is_premium).length}
            </div>
            <div className="text-gray-700 mt-1">Free Accounts</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input flex-1"
              >
                <option value="all">All Students</option>
                <option value="premium">Premium Only</option>
                <option value="free">Free Only</option>
                <option value="paid_registration">Paid Registration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">All Students ({filteredStudents.length})</h3>
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No students found</p>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={student.profile_photo ? `http://localhost:5000${student.profile_photo}` : 'https://via.placeholder.com/80'}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {student.full_name}
                        </h4>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-sm text-gray-600">
                          {student.school || 'No school listed'} • Grade {student.grade_level || 'N/A'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {student.is_premium && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                              <FaCrown /> Premium
                            </span>
                          )}
                          {student.registration_fee_paid && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                              Paid Registration
                            </span>
                          )}
                          {!student.is_premium && !student.registration_fee_paid && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                              Free Account
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <FaEye /> View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManagement;
