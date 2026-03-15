import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCheckCircle,
  FaTimesCircle, FaEye, FaDownload, FaSearch, FaFilter, FaFileAlt,
  FaIdCard, FaFilePdf, FaImage, FaEdit, FaBan, FaCheck
} from 'react-icons/fa';

const AdminTutorManagement = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/tutors/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setTutors(res.data.tutors);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tutors:', err);
      alert('Failed to load tutors');
      setLoading(false);
    }
  };

  const verifyTutor = async (tutorId) => {
    if (!window.confirm('Are you sure you want to verify this tutor?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/tutors/${tutorId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Tutor verified successfully!');
      fetchTutors();
      if (selectedTutor?.id === tutorId) {
        setSelectedTutor({ ...selectedTutor, is_verified: true });
      }
    } catch (err) {
      console.error('Error verifying tutor:', err);
      alert('Failed to verify tutor');
    }
  };

  const rejectTutor = async (tutorId) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/tutors/${tutorId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Tutor rejected');
      fetchTutors();
      if (selectedTutor?.id === tutorId) {
        setSelectedTutor(null);
      }
    } catch (err) {
      console.error('Error rejecting tutor:', err);
      alert('Failed to reject tutor');
    }
  };

  const suspendTutor = async (tutorId) => {
    if (!window.confirm('Are you sure you want to suspend this tutor?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/tutors/${tutorId}/suspend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Tutor suspended');
      fetchTutors();
    } catch (err) {
      console.error('Error suspending tutor:', err);
      alert('Failed to suspend tutor');
    }
  };

  const viewCredential = (url) => {
    if (!url) {
      alert('No file uploaded');
      return;
    }
    window.open(url.startsWith('http') ? url : `http://localhost:5000${url}`, '_blank');
  };

  const getFileIcon = (url) => {
    if (!url) return <FaTimesCircle className="text-red-500" />;
    if (url.endsWith('.pdf')) return <FaFilePdf className="text-red-600" />;
    return <FaImage className="text-blue-600" />;
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch =
      tutor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'verified') return matchesSearch && tutor.is_verified;
    if (filterStatus === 'pending') return matchesSearch && !tutor.is_verified;
    if (filterStatus === 'with_credentials') return matchesSearch && (tutor.degree_certificate || tutor.id_document || tutor.cv_document);
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (selectedTutor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedTutor(null);
                  setShowCredentials(false);
                }}
                className="btn btn-outline"
              >
                ← Back to All Tutors
              </button>
              <div className="flex gap-2">
                {!selectedTutor.is_verified && (
                  <>
                    <button
                      onClick={() => verifyTutor(selectedTutor.id)}
                      className="btn bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
                    >
                      <FaCheck /> Verify Tutor
                    </button>
                    <button
                      onClick={() => rejectTutor(selectedTutor.id)}
                      className="btn bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                    >
                      <FaBan /> Reject
                    </button>
                  </>
                )}
                {selectedTutor.is_verified && (
                  <button
                    onClick={() => suspendTutor(selectedTutor.id)}
                    className="btn bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2"
                  >
                    <FaBan /> Suspend
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tutor Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center mb-6">
                  <img
                    src={selectedTutor.profile_photo ? `http://localhost:5000${selectedTutor.profile_photo}` : 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-500 mb-4"
                  />
                  <h2 className="text-2xl font-bold">
                    {selectedTutor.full_name}
                  </h2>
                  <p className="text-gray-600">{selectedTutor.specialization || 'Tutor'}</p>
                  <div className="mt-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedTutor.is_verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {selectedTutor.is_verified ? '✅ Verified' : '⏳ Pending Verification'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium">{selectedTutor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-medium">{selectedTutor.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaGraduationCap className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Subjects</p>
                      <p className="font-medium">{selectedTutor.subjects || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaUser className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Hourly Rate</p>
                      <p className="font-medium">{selectedTutor.hourly_rate} ETB/hour</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details & Credentials */}
            <div className="lg:col-span-2">
              {/* Profile Details */}
              <div className="card mb-6">
                <h3 className="text-xl font-bold mb-4">Profile Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Qualifications</p>
                    <p className="font-medium">{selectedTutor.qualifications || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-medium">{selectedTutor.specialization || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bio</p>
                    <p className="font-medium">{selectedTutor.bio || 'No bio provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-medium">{selectedTutor.rating || 0} ⭐ ({selectedTutor.total_reviews || 0} reviews)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-medium">{new Date(selectedTutor.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Educational Credentials */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-primary-500" />
                  Educational Credentials
                </h3>

                <div className="space-y-4">
                  {/* Degree Certificate */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(selectedTutor.degree_certificate)}
                        <div>
                          <p className="font-semibold">Degree Certificate</p>
                          <p className="text-sm text-gray-600">
                            {selectedTutor.degree_certificate ? 'Uploaded' : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      {selectedTutor.degree_certificate && (
                        <button
                          onClick={() => viewCredential(selectedTutor.degree_certificate)}
                          className="btn btn-sm btn-primary flex items-center gap-2"
                        >
                          <FaEye /> View
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ID Document */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(selectedTutor.id_document)}
                        <div>
                          <p className="font-semibold">ID Card / Passport</p>
                          <p className="text-sm text-gray-600">
                            {selectedTutor.id_document ? 'Uploaded' : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      {selectedTutor.id_document && (
                        <button
                          onClick={() => viewCredential(selectedTutor.id_document)}
                          className="btn btn-sm btn-primary flex items-center gap-2"
                        >
                          <FaEye /> View
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CV Document */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(selectedTutor.cv_document)}
                        <div>
                          <p className="font-semibold">CV / Resume</p>
                          <p className="text-sm text-gray-600">
                            {selectedTutor.cv_document ? 'Uploaded' : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      {selectedTutor.cv_document && (
                        <button
                          onClick={() => viewCredential(selectedTutor.cv_document)}
                          className="btn btn-sm btn-primary flex items-center gap-2"
                        >
                          <FaEye /> View
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Transcript */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(selectedTutor.transcript)}
                        <div>
                          <p className="font-semibold">Academic Transcript</p>
                          <p className="text-sm text-gray-600">
                            {selectedTutor.transcript ? 'Uploaded' : 'Not uploaded (Optional)'}
                          </p>
                        </div>
                      </div>
                      {selectedTutor.transcript && (
                        <button
                          onClick={() => viewCredential(selectedTutor.transcript)}
                          className="btn btn-sm btn-primary flex items-center gap-2"
                        >
                          <FaEye /> View
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Credential Status</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {selectedTutor.degree_certificate ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                      <span>Degree Certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTutor.id_document ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                      <span>ID Document</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTutor.cv_document ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                      <span>CV/Resume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTutor.transcript ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-gray-400" />
                      )}
                      <span>Transcript (Optional)</span>
                    </div>
                  </div>
                </div>
              </div>
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
        <div className="card mb-6 bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tutor Management</h1>
              <p className="text-lg opacity-90">Manage and verify tutors</p>
            </div>
            <FaGraduationCap className="text-6xl opacity-50" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card bg-blue-50 border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{tutors.length}</div>
            <div className="text-gray-700 mt-1">Total Tutors</div>
          </div>
          <div className="card bg-green-50 border-2 border-green-200">
            <div className="text-3xl font-bold text-green-600">
              {tutors.filter(t => t.is_verified).length}
            </div>
            <div className="text-gray-700 mt-1">Verified</div>
          </div>
          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600">
              {tutors.filter(t => !t.is_verified).length}
            </div>
            <div className="text-gray-700 mt-1">Pending</div>
          </div>
          <div className="card bg-purple-50 border-2 border-purple-200">
            <div className="text-3xl font-bold text-purple-600">
              {tutors.filter(t => t.degree_certificate || t.id_document || t.cv_document).length}
            </div>
            <div className="text-gray-700 mt-1">With Credentials</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutors..."
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
                <option value="all">All Tutors</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Only</option>
                <option value="with_credentials">With Credentials</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tutors List */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">All Tutors ({filteredTutors.length})</h3>
          <div className="space-y-4">
            {filteredTutors.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tutors found</p>
            ) : (
              filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={tutor.profile_photo ? `http://localhost:5000${tutor.profile_photo}` : 'https://via.placeholder.com/80'}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {tutor.full_name}
                        </h4>
                        <p className="text-sm text-gray-600">{tutor.email}</p>
                        <p className="text-sm text-gray-600">{tutor.subjects || 'No subjects listed'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${tutor.is_verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {tutor.is_verified ? 'Verified' : 'Pending'}
                          </span>
                          {(tutor.degree_certificate || tutor.id_document || tutor.cv_document) && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                              Has Credentials
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTutor(tutor)}
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

export default AdminTutorManagement;
