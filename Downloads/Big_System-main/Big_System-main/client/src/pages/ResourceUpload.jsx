import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaFilePdf, FaBook, FaGraduationCap, FaUniversity, FaPlus, FaTimes } from 'react-icons/fa';

const ResourceUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: 'cs',
    accessLevel: 'free',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const departments = [
    { id: 'cs', label: 'Computer Science' },
    { id: 'programming', label: 'Programming' },
    { id: 'mathematics', label: 'Mathematics' },
    { id: 'physics', label: 'Physics' },
    { id: 'chemistry', label: 'Chemistry' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'freshman', label: 'Freshman' },
    { id: 'exit', label: 'Exit Exams' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      setMessage('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const uploadData = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'file') {
          uploadData.append('file', formData[key]);
        } else {
          uploadData.append(key, formData[key]);
        }
      });

      const { API_CONFIG } = await import('../utils/apiConfig');
      await axios.post(`${API_CONFIG.BASE_URL}/api/admin/resources`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Resource uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        department: 'cs',
        accessLevel: 'free',
        file: null
      });
    } catch (error) {
      setMessage('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FaUpload className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Upload Resource</h1>
              <p className="text-slate-500">Add important books and materials to the resource library</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resource Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Head First Java"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the resource..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department/Category
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Access Level
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="free"
                    checked={formData.accessLevel === 'free'}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-sm">Free Access</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="premium"
                    checked={formData.accessLevel === 'premium'}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-sm">Premium Only</span>
                </label>
              </div>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                File Upload (PDF only)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <FaFilePdf className="text-red-500 text-3xl mx-auto mb-3" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Choose File
                </label>
                {formData.file && (
                  <div className="mt-3 text-sm text-slate-600">
                    Selected: {formData.file.name}
                  </div>
                )}
              </div>
            </div>

            {}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </form>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Upload Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Head First Java', dept: 'programming', access: 'free' },
              { title: 'Clean Code', dept: 'programming', access: 'premium' },
              { title: 'Introduction to Algorithms', dept: 'cs', access: 'premium' },
              { title: 'Calculus Made Easy', dept: 'mathematics', access: 'free' },
              { title: 'Fundamentals of Physics', dept: 'physics', access: 'free' },
              { title: 'Organic Chemistry', dept: 'chemistry', access: 'free' }
            ].map((template, index) => (
              <button
                key={index}
                onClick={() => setFormData({
                  ...formData,
                  title: template.title,
                  department: template.dept,
                  accessLevel: template.access
                })}
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-left"
              >
                <div className="font-medium text-slate-900">{template.title}</div>
                <div className="text-sm text-slate-500">
                  {departments.find(d => d.id === template.dept)?.label} • {template.access}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUpload;
