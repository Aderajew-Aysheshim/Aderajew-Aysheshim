import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUpload, FaFileAlt, FaBook, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const TutorUploadResource = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'notes',
    subject: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const resourceTypes = [
    { value: 'notes', label: '📝 Notes', icon: '📝' },
    { value: 'ppt', label: '📊 PowerPoint Presentation', icon: '📊' },
    { value: 'exercise-book', label: '📚 Exercise Book', icon: '📚' },
    { value: 'worksheet', label: '📄 Worksheet', icon: '📄' },
    { value: 'study-guide', label: '📖 Study Guide', icon: '📖' },
    { value: 'practice-questions', label: '❓ Practice Questions', icon: '❓' },
    { value: 'other', label: '📁 Other', icon: '📁' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    console.log('📤 File selected:', selectedFile.name, selectedFile.type, selectedFile.size);

    // Validate file size (20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      setMessage({ text: '❌ File size must be less than 20MB', type: 'error' });
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage({ text: '❌ Only PDF, PPT, DOC, JPG, PNG files are allowed', type: 'error' });
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    setMessage({ text: `✅ ${selectedFile.name} selected!`, type: 'success' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage({ text: '❌ Please select a file to upload', type: 'error' });
      return;
    }

    if (!formData.title || !formData.subject) {
      setMessage({ text: '❌ Please fill in all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      const uploadData = new FormData();

      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('type', formData.type);
      uploadData.append('subject', formData.subject);
      uploadData.append('uploadedBy', 'tutor'); // Mark as tutor upload

      console.log('📤 Uploading resource...');

      const res = await axios.post(
        'http://localhost:5000/api/resources/upload',
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('✅ Upload successful:', res.data);

      setMessage({
        text: '✅ Resource uploaded successfully! Students can now access it.',
        type: 'success'
      });

      // Reset form
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          type: 'notes',
          subject: ''
        });
        setFile(null);
        setPreview(null);
        setMessage({ text: '', type: '' });
      }, 2000);

    } catch (error) {
      console.error('❌ Upload error:', error);
      setMessage({
        text: error.response?.data?.error || 'Failed to upload resource',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="card mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Upload Teaching Resources</h1>
              <p className="text-lg opacity-90">Share your materials with students</p>
            </div>
            <FaBook className="text-6xl opacity-50" />
          </div>
        </div>

        <button
          onClick={() => navigate('/tutor-dashboard')}
          className="btn btn-outline mb-6 flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        {/* Upload Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Resource Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Calculus Chapter 1 Notes"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {resourceTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all text-center ${formData.type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label.split(' ').slice(1).join(' ')}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Mathematics, Physics, Chemistry"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input"
                placeholder="Describe what this resource covers..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>

              {file ? (
                <div className="bg-green-50 border-2 border-green-300 p-6 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-600 text-3xl" />
                      <div>
                        <p className="font-semibold text-green-800 text-lg">✅ File Selected!</p>
                        <p className="text-sm text-green-600">{file.name}</p>
                        <p className="text-xs text-green-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  {preview && (
                    <img src={preview} alt="Preview" className="mt-4 max-h-40 rounded" />
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FaUpload className="text-5xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, PPT, DOC, JPG, PNG (Max 20MB)
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>📌 Note:</strong> Your uploaded resources will be available to all students.
                Make sure your content is clear and helpful for learning.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full text-lg py-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="inline mr-2" />
                  Upload Resource
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="card mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <h3 className="text-lg font-bold mb-3">💡 Tips for Great Resources</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ Use clear, descriptive titles</li>
            <li>✅ Organize content logically</li>
            <li>✅ Include examples and explanations</li>
            <li>✅ Make sure files are readable</li>
            <li>✅ Add descriptions to help students understand</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TutorUploadResource;
