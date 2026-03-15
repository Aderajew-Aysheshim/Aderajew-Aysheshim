import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaDownload, FaFileAlt } from 'react-icons/fa';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatType = (type) => {
    const types = {
      'past-paper': 'Past Paper',
      'study-notes': 'Study Notes',
      'video': 'Video',
      'other': 'Other'
    };
    return types[type] || type;
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/resources', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(response.data.resources);
    } catch (error) {
      setMessage({ text: 'Error loading resources', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Resource deleted successfully!', type: 'success' });
      fetchResources();
    } catch (error) {
      setMessage({ text: 'Error deleting resource', type: 'error' });
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Resources</h1>
          <p className="text-gray-600">View and delete uploaded resources</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        {resources.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600">No resources uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-info">{formatType(resource.type)}</span>
                      {resource.is_aastu && (
                        <span className="badge bg-purple-100 text-purple-800">AASTU</span>
                      )}
                      <span className={`badge ${resource.access_level === 'free' ? 'badge-success' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {resource.access_level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                  </div>
                  <FaFileAlt className="text-3xl text-primary-500" />
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {resource.description}
                </p>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subject:</span>
                    <span className="font-medium capitalize">{resource.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grade:</span>
                    <span className="font-medium">{resource.grade_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span className="font-medium">{resource.downloads || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">
                      {formatFileSize(resource.file_size)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`http://localhost:5000${resource.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    <FaDownload />
                    <span>View</span>
                  </a>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="btn bg-red-500 hover:bg-red-600 text-white flex-1 flex items-center justify-center space-x-2"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResources;
