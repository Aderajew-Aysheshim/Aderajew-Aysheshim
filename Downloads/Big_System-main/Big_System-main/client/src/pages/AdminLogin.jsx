import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const result = await login(formData.email, formData.password, 'admin');

      if (result.success) {
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else {
        setMessage({ text: result.error || 'Login failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: error.message || 'Login error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
            <FaUserShield className="text-5xl text-red-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">Access the admin dashboard</p>
        </div>

        <div className="card">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-lg bg-gradient-to-r from-red-500 to-red-600"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
