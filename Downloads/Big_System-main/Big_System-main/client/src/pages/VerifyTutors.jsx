import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaPhone, FaCertificate, FaGraduationCap, FaDollarSign, FaStar } from 'react-icons/fa';

const VerifyTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchPendingTutors();
  }, [navigate]);

  const fetchPendingTutors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/tutors/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Pending tutors response:', response.data);
      setTutors(response.data.tutors || []);
    } catch (error) {
      console.error('Error loading tutors:', error);
      setMessage({ text: error.response?.data?.error || 'Error loading tutors', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (tutorId) => {
    if (!window.confirm('Are you sure you want to verify this tutor?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/tutors/${tutorId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: 'Tutor verified successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      fetchPendingTutors();
    } catch (error) {
      console.error('Error verifying tutor:', error);
      setMessage({ text: error.response?.data?.error || 'Error verifying tutor', type: 'error' });
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-primary-500 hover:text-primary-600 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Verify Tutors</h1>
          <p className="text-gray-600">Review and approve pending tutor applications</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        {tutors.length === 0 ? (
          <div className="card text-center py-12">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No pending tutor verifications</p>
            <p className="text-gray-500">All tutors have been verified!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                        {tutor.first_name?.[0]}{tutor.last_name?.[0]}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {tutor.first_name} {tutor.last_name}
                        </h3>
                        {tutor.specialization && (
                          <p className="text-primary-600 font-medium">{tutor.specialization}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2 text-primary-500" />
                        <span className="text-sm">{tutor.email}</span>
                      </div>
                      {tutor.phone && (
                        <div className="flex items-center text-gray-600">
                          <FaPhone className="mr-2 text-primary-500" />
                          <span className="text-sm">{tutor.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Qualifications */}
                    {tutor.qualifications && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start">
                          <FaCertificate className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">Qualifications:</p>
                            <p className="text-gray-700 text-sm">{tutor.qualifications}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Subjects */}
                    {tutor.subjects && (
                      <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start">
                          <FaGraduationCap className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">Subjects:</p>
                            <p className="text-gray-700 text-sm">{tutor.subjects}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {tutor.bio && (
                      <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="font-semibold text-gray-900 mb-1">Bio:</p>
                        <p className="text-gray-700 text-sm">{tutor.bio}</p>
                      </div>
                    )}

                    {/* Hourly Rate */}
                    {tutor.hourly_rate && (
                      <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                        <FaDollarSign />
                        <span>{tutor.hourly_rate} ETB/hour</span>
                      </div>
                    )}
                  </div>

                  {/* Verify Button */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleVerify(tutor.id)}
                      className="btn btn-primary flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                      <FaCheckCircle />
                      <span>Verify Tutor</span>
                    </button>
                    <div className="text-xs text-gray-500 text-center">
                      ID: {tutor.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyTutors;
