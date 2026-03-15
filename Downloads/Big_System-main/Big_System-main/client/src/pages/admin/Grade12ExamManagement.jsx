import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaPlus, FaSearch, FaFilePdf, FaEye } from 'react-icons/fa';

const Grade12ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedExamType, setSelectedExamType] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'exam',
    examType: '',
    year: '',
    access_level: 'free',
    file: null,
    tags: ['grade12']
  });

  const subjects = [
    'All', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'Amharic', 'Civics', 'Economics', 'History',
    'Geography', 'Information Technology'
  ];

  const examTypes = [
    'All', 'Entrance Exam', 'Practice Test', 'Placement Test',
    'Mock Exam', 'Final Exam', 'Past Paper'
  ];

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/resources', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Filter for Grade 12 resources
      const grade12Resources = response.data.resources?.filter(resource =>
        resource.tags?.toLowerCase().includes('grade12') ||
        resource.tags?.toLowerCase().includes('grade-12') ||
        resource.tags?.toLowerCase().includes('12th') ||
        resource.description?.toLowerCase().includes('grade 12')
      ) || [];
      setExams(grade12Resources);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingExam) {
        await axios.put(
          `http://localhost:5000/api/resources/${editingExam._id}`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/resources',
          formDataToSend,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      }

      fetchExams();
      setShowUploadModal(false);
      setEditingExam(null);
      resetForm();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDelete = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/resources/${examId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        fetchExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      type: 'exam',
      examType: '',
      year: '',
      access_level: 'free',
      file: null,
      tags: ['grade12']
    });
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || exam.subject === selectedSubject;
    const matchesExamType = selectedExamType === 'All' || exam.examType === selectedExamType;
    return matchesSearch && matchesSubject && matchesExamType;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Grade 12 Exam Management</h1>
          <p className="text-slate-400">Upload and manage Grade 12 entrance exams, practice tests, and past papers</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => {
              setShowUploadModal(true);
              setEditingExam(null);
              resetForm();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <FaPlus /> Upload New Exam
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            {examTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map(exam => (
              <div key={exam._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaFilePdf className="text-red-500 text-2xl" />
                    <div>
                      <h3 className="font-semibold text-white">{exam.title}</h3>
                      <p className="text-sm text-slate-400">{exam.subject} • {exam.examType}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${exam.access_level === 'premium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-green-500/20 text-green-400'
                    }`}>
                    {exam.access_level}
                  </span>
                </div>

                <p className="text-slate-300 text-sm mb-4 line-clamp-3">{exam.description}</p>

                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <span>Year: {exam.year}</span>
                  <span>Downloads: {exam.downloadCount || 0}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(exam.file_url, '_blank')}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => {
                      setEditingExam(exam);
                      setFormData({
                        title: exam.title,
                        description: exam.description,
                        subject: exam.subject,
                        type: exam.type || 'exam',
                        examType: exam.examType,
                        year: exam.year,
                        access_level: exam.access_level || 'free',
                        file: null,
                        tags: exam.tags || ['grade12']
                      });
                      setShowUploadModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingExam ? 'Edit Exam' : 'Upload New Exam'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="">Select Subject</option>
                      {subjects.filter(s => s !== 'All').map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Exam Type</label>
                    <select
                      required
                      value={formData.examType}
                      onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="">Select Type</option>
                      {examTypes.filter(t => t !== 'All').map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                    <input
                      type="text"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Access Level</label>
                    <select
                      value={formData.access_level}
                      onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">PDF File</label>
                  <input
                    type="file"
                    accept=".pdf"
                    required={!editingExam}
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {editingExam ? 'Update Exam' : 'Upload Exam'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setEditingExam(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grade12ExamManagement;
