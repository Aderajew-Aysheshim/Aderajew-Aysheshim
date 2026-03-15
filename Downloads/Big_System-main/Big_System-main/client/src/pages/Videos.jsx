import React, { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaSearch, FaStar, FaVideo, FaFilter, FaMoon, FaSun } from 'react-icons/fa';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'free', 'premium'
  const [darkMode, setDarkMode] = useState(false);

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

  const filterVideos = useCallback(() => {
    let filtered = [...videos];

    // Filter by access level (free/premium/all)
    if (activeFilter === 'free') {
      filtered = filtered.filter(v => v.access_level === 'free');
    } else if (activeFilter === 'premium') {
      filtered = filtered.filter(v => v.access_level === 'premium');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(v => v.subject === selectedSubject);
    }

    setFilteredVideos(filtered);
  }, [videos, activeFilter, searchTerm, selectedSubject]);

  useEffect(() => {
    fetchVideos();
    // Initialize dark mode from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = savedMode !== null ? savedMode === 'true' : prefersDark;
    setDarkMode(initialMode);
  }, []);

  useEffect(() => {
    filterVideos();
  }, [filterVideos]);

  useEffect(() => {
    // Apply dark mode to document and save to localStorage
    console.log('Applying dark mode:', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#ffffff';
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb';
      document.body.style.color = '#111827';
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // Mock data with real educational YouTube video URLs
      const mockVideos = [
        {
          id: 1,
          title: 'Introduction to Calculus',
          description: 'Learn the basics of calculus including limits, derivatives, and integrals.',
          duration: '45:23',
          subject: 'Mathematics',
          grade_level: 'University',
          access_level: 'free',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 2,
          title: 'Newton\'s Laws of Motion',
          description: 'Understanding the three fundamental laws of physics that govern motion.',
          duration: '32:15',
          subject: 'Physics',
          grade_level: '12',
          access_level: 'free',
          thumbnail: 'https://img.youtube.com/vi/9IX0XQpLq0Q/maxresdefault.jpg',
          video_url: 'https://www.youtube.com/watch?v=9IX0XQpLq0Q'
        },
        {
          id: 3,
          title: 'Chemical Bonding Basics',
          description: 'Explore different types of chemical bonds and molecular structures.',
          duration: '28:45',
          subject: 'Chemistry',
          grade_level: '11',
          access_level: 'premium',
          thumbnail: 'https://img.youtube.com/vi/3VZ5p_5l5pM/maxresdefault.jpg',
          video_url: 'https://www.youtube.com/watch?v=3VZ5p_5l5pM'
        },
        {
          id: 4,
          title: 'Cell Biology Fundamentals',
          description: 'Understanding cell structure, organelles, and cellular processes.',
          duration: '38:12',
          subject: 'Biology',
          grade_level: '10',
          access_level: 'premium',
          thumbnail: 'https://img.youtube.com/vi/URUJD5fEXac/maxresdefault.jpg',
          video_url: 'https://www.youtube.com/watch?v=URUJD5fEXac'
        },
        {
          id: 5,
          title: 'English Grammar Essentials',
          description: 'Master the fundamentals of English grammar and sentence structure.',
          duration: '25:30',
          subject: 'English',
          grade_level: '9',
          access_level: 'premium',
          thumbnail: 'https://img.youtube.com/vi/AQmKgdhGv_A/maxresdefault.jpg',
          video_url: 'https://www.youtube.com/watch?v=AQmKgdhGv_A'
        },
        {
          id: 6,
          title: 'Introduction to Algorithms',
          description: 'Learn basic algorithms and data structures for computer science.',
          duration: '42:18',
          subject: 'Computer Science',
          grade_level: 'University',
          access_level: 'free',
          thumbnail: 'https://img.youtube.com/vi/zOjov-2OZ0E/maxresdefault.jpg',
          video_url: 'https://www.youtube.com/watch?v=zOjov-2OZ0E'
        }
      ];
      setVideos(mockVideos);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    console.log('Toggle clicked, current mode:', darkMode);
    const newMode = !darkMode;
    setDarkMode(newMode);

    // Force immediate style change
    if (newMode) {
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#ffffff';
      document.body.classList.add('dark-mode');
    } else {
      document.body.style.backgroundColor = '#f9fafb';
      document.body.style.color = '#111827';
      document.body.classList.remove('dark-mode');
    }
  };

  const extractYouTubeID = (url) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden`}>
      <div className="w-full max-w-screen-2xl mx-auto pl-8 pr-4 sm:pl-12 sm:pr-6 lg:pl-16 lg:pr-8 py-4">
        {/* Dark Mode Toggle - Shifted Right */}
        <div className="w-full flex justify-between items-center mb-4 p-4 rounded-lg border-2 border-blue-500 ml-4">
          <div className={`text-sm font-bold ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`}>
            {darkMode ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}
          </div>
          <div className="flex gap-2 mr-4">
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border-2 ${darkMode ? 'bg-yellow-400 text-gray-900 border-yellow-500 hover:bg-yellow-300' : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'}`}
            >
              <span className="flex items-center gap-2">
                {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
                {darkMode ? 'Switch to Light' : 'Switch to Dark'}
              </span>
            </button>
          </div>
        </div>

        {/* Header - Shifted Right */}
        <div className="w-full text-center mb-6 p-4 rounded-lg border-2 border-gray-300 ml-4">
          <div className="flex items-center justify-center mb-2">
            <FaVideo className={`text-3xl mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Video Tutorials</h1>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Learn from expert-led video tutorials</p>
        </div>

        {/* Search and Filters - Shifted Right */}
        <div className={`w-full p-4 rounded-lg shadow-md mb-6 border-2 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} ml-4`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm border-2 ${darkMode ? 'bg-gray-700 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors text-sm border-2 ${darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-3 rounded-lg transition-colors text-xs font-medium border-2 ${activeFilter === 'all'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  }`}
              >
                All Videos
              </button>
              <button
                onClick={() => setActiveFilter('free')}
                className={`px-4 py-3 rounded-lg transition-colors text-xs font-medium border-2 ${activeFilter === 'free'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  }`}
              >
                Free
              </button>
              <button
                onClick={() => setActiveFilter('premium')}
                className={`px-4 py-3 rounded-lg transition-colors text-xs font-medium border-2 ${activeFilter === 'premium'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  }`}
              >
                Premium
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid - Shifted Right */}
        {loading ? (
          <div className="w-full text-center py-8 p-4 rounded-lg border-2 border-blue-500 ml-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading videos...</p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-4">
            {filteredVideos.map((video) => (
              <div key={video.id} className={`w-full rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${darkMode ? 'bg-gray-800 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg opacity-0 hover:opacity-100 transition-opacity">
                    <FaPlay className="text-white text-2xl" />
                  </div>
                  {video.access_level === 'premium' && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-yellow-400 text-xs font-semibold text-gray-900 rounded-full flex items-center border-2 border-yellow-500">
                        <FaStar className="mr-1" /> PRO
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className={`font-semibold mb-1 text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{video.title}</h3>
                  <p className={`text-xs mb-2 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{video.description}</p>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className={`font-medium px-2 py-1 rounded ${darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50'}`}>{video.subject}</span>
                    <span className={`px-2 py-1 rounded ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'}`}>G{video.grade_level}</span>
                  </div>

                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium border-2 border-blue-700"
                  >
                    {video.access_level === 'premium' ? 'Upgrade to Watch' : 'Watch Now'}
                  </button>
                  {video.access_level === 'free' && (
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-1 w-full px-3 py-1.5 border-2 rounded-lg transition-colors text-center block text-xs font-medium ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      Open in YouTube
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State - Shifted Right */}
        {!loading && filteredVideos.length === 0 && (
          <div className="w-full text-center py-12 p-6 rounded-lg border-2 border-red-500 ml-4">
            <FaVideo className={`text-6xl mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No videos found</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedVideo.title}</h2>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className={`aspect-video rounded-lg mb-4 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  {extractYouTubeID(selectedVideo.video_url) ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${extractYouTubeID(selectedVideo.video_url)}?autoplay=1&rel=0`}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaPlay className={`text-4xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>

                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedVideo.description}</p>

                <div className="flex items-center justify-between">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-medium">Subject:</span> {selectedVideo.subject} |
                    <span className="font-medium ml-2">Grade:</span> {selectedVideo.grade_level}
                  </div>
                  {selectedVideo.access_level === 'premium' && (
                    <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 font-semibold">
                      <FaStar className="inline mr-1" /> Upgrade to Premium
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <FaVideo className={`text-6xl mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No videos found</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
