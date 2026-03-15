import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaFilePdf, FaTrash, FaEdit, FaPlus, FaSearch, FaFilter, FaCalendar, FaBook, FaGraduationCap, FaClock, FaEye, FaDownload, FaSave, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const ExamPaperManagement = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    course: '',
    year: '',
    semester: '',
    examType: '',
    duration: '',
    file: null,
    description: '',
    accessLevel: 'premium'
  });

  const courses = [
    'Mathematics', 'Physics', 'Chemistry', 'English', 'English Communication',
    'Psychology', 'Entrepreneurship', 'Anthropology', 'Physical Fitness',
    'Applied Science', 'Philosophy', 'Social Science', 'Geography', 'Logic and Critical Thinking'
  ];

  const examTypes = ['Final Exam', 'Midterm Exam', 'Quiz', 'Assignment', 'Practical Exam', 'Supplementary Exam'];
  const semesters = ['Fall Semester', 'Spring Semester', 'Summer Semester'];
  const accessLevels = ['free', 'premium'];

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/exam-papers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPapers(response.data.papers || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key !== 'file') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      const response = await axios.post(
        'http://localhost:5000/api/admin/exam-papers/upload',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      await fetchPapers();
      setShowUploadModal(false);
      resetForm();
      alert('Exam paper uploaded successfully!');
    } catch (error) {
      console.error('Error uploading paper:', error);
      alert('Error uploading paper. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEditPaper = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://localhost:5000/api/admin/exam-papers/${editingPaper.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPapers();
      setEditingPaper(null);
      resetForm();
      alert('Exam paper updated successfully!');
    } catch (error) {
      console.error('Error updating paper:', error);
      alert('Error updating paper. Please try again.');
    }
  };

  const handleDeletePaper = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this exam paper?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `http://localhost:5000/api/admin/exam-papers/${paperId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPapers();
      alert('Exam paper deleted successfully!');
    } catch (error) {
      console.error('Error deleting paper:', error);
      alert('Error deleting paper. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      course: '',
      year: '',
      semester: '',
      examType: '',
      duration: '',
      file: null,
      description: '',
      accessLevel: 'premium'
    });
  };

  const openEditModal = (paper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      course: paper.course,
      year: paper.year,
      semester: paper.semester,
      examType: paper.examType,
      duration: paper.duration,
      file: null,
      description: paper.description,
      accessLevel: paper.accessLevel
    });
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || paper.course === filterCourse;
    const matchesYear = filterYear === 'all' || paper.year === filterYear;

    return matchesSearch && matchesCourse && matchesYear;
  });

  const groupedPapers = filteredPapers.reduce((groups, paper) => {
    const course = paper.course;
    if (!groups[course]) {
      groups[course] = [];
    }
    groups[course].push(paper);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading Exam Papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Exam Paper Management</h1>
          <p className="text-slate-400">Upload and manage AASTU exam papers by course and year</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Years</option>
              {[2024, 2023, 2022, 2021, 2020].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaPlus />
              Upload Paper
            </button>
          </div>
        </div>

        {/* Papers by Course */}
        <div className="space-y-8">
          {Object.entries(groupedPapers).map(([course, coursePapers]) => (
            <div key={course} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaBook className="text-blue-400 text-2xl" />
                <h2 className="text-2xl font-bold text-white">{course}</h2>
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  {coursePapers.length} papers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursePapers.map(paper => (
                  <div key={paper.id} className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-400 text-2xl" />
                        <div>
                          <h3 className="text-white font-semibold">{paper.title}</h3>
                          <p className="text-slate-400 text-sm">{paper.course}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${paper.accessLevel === 'premium'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : 'bg-green-600/20 text-green-400'
                        }`}>
                        {paper.accessLevel}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <FaCalendar className="text-blue-400" />
                        <span>{paper.semester} {paper.year}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <FaClock className="text-blue-400" />
                        <span>{paper.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <FaGraduationCap className="text-blue-400" />
                        <span>{paper.examType}</span>
                      </div>
                    </div>

                    {paper.description && (
                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                        {paper.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(paper.fileUrl, '_blank')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded flex items-center justify-center gap-1 text-sm transition-colors"
                      >
                        <FaEye />
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(paper)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded flex items-center justify-center gap-1 text-sm transition-colors"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePaper(paper.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded flex items-center justify-center text-sm transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        {(showUploadModal || editingPaper) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPaper ? 'Edit Exam Paper' : 'Upload Exam Paper'}
                </h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setEditingPaper(null);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={editingPaper ? handleEditPaper : handleFileUpload}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2">Course</label>
                    <select
                      required
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2">Year</label>
                    <select
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Year</option>
                      {[2024, 2023, 2022, 2021, 2020].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2">Semester</label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2">Exam Type</label>
                    <select
                      required
                      value={formData.examType}
                      onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      {examTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2">Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 3 Hours"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2">Access Level</label>
                    <select
                      value={formData.accessLevel}
                      onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {accessLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {!editingPaper && (
                    <div>
                      <label className="block text-slate-300 mb-2">PDF File</label>
                      <input
                        type="file"
                        required
                        accept=".pdf"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-slate-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                {uploading && (
                  <div className="mt-4">
                    <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-slate-400 text-sm mt-2">Uploading... {uploadProgress}%</p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setEditingPaper(null);
                      resetForm();
                    }}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {editingPaper ? 'Update' : 'Upload'}
                      </>
                    )}
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

export default ExamPaperManagement;
