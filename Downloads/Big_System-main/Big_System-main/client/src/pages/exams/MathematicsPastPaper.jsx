import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaClock, FaCalendar, FaFilePdf, FaLock, FaCrown, FaFilter, FaSearch, FaBook, FaGraduationCap, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const MathematicsPastPaper = () => {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPapers();
    checkPremiumStatus();
  }, []);

  useEffect(() => {
    filterPapers();
  }, [papers, searchTerm, filterYear, filterType]);

  const fetchPapers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exam-papers/Mathematics');
      setPapers(response.data.papers || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
      // Fallback to mock data if backend is not available
      setPapers(getMockPapers());
    } finally {
      setLoading(false);
    }
  };

  const checkPremiumStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsPremium(false);
        setLoadingProfile(false);
        return;
      }
      const response = await axios.get('http://localhost:5000/api/students/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsPremium(response.data.student.subscriptionStatus === 'premium');
    } catch (error) {
      console.error("Error checking premium status:", error);
      setIsPremium(false);
    } finally {
      setLoadingProfile(false);
    }
  };

  const filterPapers = () => {
    let filtered = papers;

    if (searchTerm) {
      filtered = filtered.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterYear !== 'all') {
      filtered = filtered.filter(paper => paper.year === filterYear);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(paper => paper.examType === filterType);
    }

    setFilteredPapers(filtered);
  };

  const getMockPapers = () => [
    {
      id: 1,
      title: "Mathematics Final Exam - 2023",
      description: "Comprehensive final examination covering calculus, algebra, and statistics",
      course: "Mathematics",
      year: "2023",
      semester: "Fall Semester",
      date: "December 2023",
      duration: "3 Hours",
      examType: "Final Exam",
      fileUrl: "/api/past-papers/mathematics-2023-final.pdf",
      thumbnail: "/api/placeholder/400/250",
      accessLevel: "premium"
    },
    {
      id: 2,
      title: "Mathematics Midterm Exam - 2023",
      description: "Midterm assessment focusing on differential equations and linear algebra",
      course: "Mathematics",
      year: "2023",
      semester: "Fall Semester",
      date: "October 2023",
      duration: "2 Hours",
      examType: "Midterm Exam",
      fileUrl: "/api/past-papers/mathematics-2023-midterm.pdf",
      thumbnail: "/api/placeholder/400/250",
      accessLevel: "premium"
    },
    {
      id: 3,
      title: "Mathematics Final Exam - 2022",
      description: "Previous year final exam with detailed solutions",
      course: "Mathematics",
      year: "2022",
      semester: "Spring Semester",
      date: "May 2022",
      duration: "3 Hours",
      examType: "Final Exam",
      fileUrl: "/api/past-papers/mathematics-2022-final.pdf",
      thumbnail: "/api/placeholder/400/250",
      accessLevel: "premium"
    },
    {
      id: 4,
      title: "Mathematics Quiz - 2023",
      description: "Quick assessment on probability and statistics",
      course: "Mathematics",
      year: "2023",
      semester: "Fall Semester",
      date: "November 2023",
      duration: "1 Hour",
      examType: "Quiz",
      fileUrl: "/api/past-papers/mathematics-2023-quiz.pdf",
      thumbnail: "/api/placeholder/400/250",
      accessLevel: "free"
    }
  ];

  const years = [...new Set(papers.map(paper => paper.year))];
  const examTypes = [...new Set(papers.map(paper => paper.examType))];

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 font-semibold">Loading Mathematics Past Papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 pt-20 pb-32">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Mathematics Past Papers</h1>
              <p className="text-slate-400">AASTU Freshman Mathematics Exam Archive</p>
            </div>
          </div>
          {isPremium && (
            <div className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center gap-2">
              <FaCrown />
              <span className="font-semibold">Premium Access</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600/50"
              />
            </div>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600/50"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600/50"
            >
              <option value="all">All Types</option>
              {examTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-slate-400">
              Showing {filteredPapers.length} of {papers.length} papers
            </p>
            <div className="flex items-center gap-2">
              <FaFilter className="text-blue-400" />
              <span className="text-slate-400 text-sm">Filters Applied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Past Papers Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-800/50 rounded-2xl h-64 mb-4"></div>
                <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
                <div className="h-3 bg-slate-700/50 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="group relative bg-slate-900/30 backdrop-blur-2xl rounded-2xl border border-slate-700/40 overflow-hidden hover:bg-slate-800/30 hover:border-blue-500/30 transition-all duration-500"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={paper.thumbnail}
                    alt={paper.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                      {paper.examType}
                    </span>
                  </div>

                  {/* Access Level Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${paper.accessLevel === 'premium'
                        ? 'bg-yellow-600/80 text-yellow-300'
                        : 'bg-green-600/80 text-green-300'
                      }`}>
                      {paper.accessLevel === 'premium' ? 'PRO' : 'FREE'}
                    </span>
                  </div>

                  {/* Premium Lock */}
                  {!isPremium && paper.accessLevel === 'premium' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center">
                        <FaLock className="text-4xl text-yellow-500 mb-3" />
                        <span className="text-white font-semibold">Premium Only</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {paper.title}
                  </h3>

                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {paper.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <FaCalendar className="text-blue-400" />
                      <span>{paper.semester}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <FaClock className="text-blue-400" />
                      <span>{paper.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <FaFilePdf className="text-red-400" />
                      <span>{paper.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <FaBook className="text-blue-400" />
                      <span>{paper.course}</span>
                    </div>
                  </div>

                  <Link
                    to={isPremium || paper.accessLevel === 'free' ? paper.fileUrl : "/subscribe-premium"}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isPremium || paper.accessLevel === 'free'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                      }`}
                  >
                    {(isPremium || paper.accessLevel === 'free') ? (
                      <React.Fragment>
                        <FaDownload />
                        Download PDF
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <FaLock />
                        Upgrade to Access
                      </React.Fragment>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Papers Found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || filterYear !== 'all' || filterType !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'No mathematics papers are available at the moment'}
            </p>
            {(searchTerm || filterYear !== 'all' || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterYear('all');
                  setFilterType('all');
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Premium CTA */}
        {!isPremium && papers.some(p => p.accessLevel === 'premium') && (
          <div className="mt-12 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-2xl p-8 border border-yellow-500/30">
            <div className="text-center">
              <FaCrown className="text-5xl text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Unlock All Mathematics Papers</h3>
              <p className="text-slate-300 mb-6">
                Get access to {papers.filter(p => p.accessLevel === 'premium').length} premium mathematics papers with detailed solutions and marking schemes.
              </p>
              <Link
                to="/subscribe-premium"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                <FaCrown />
                Upgrade to Premium
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathematicsPastPaper;
