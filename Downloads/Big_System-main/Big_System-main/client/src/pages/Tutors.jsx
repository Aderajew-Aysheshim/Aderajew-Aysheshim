import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG } from '../utils/apiConfig';
import { FaStar, FaSearch, FaShieldAlt, FaUserTie, FaPaperPlane, FaChevronRight, FaUsers } from 'react-icons/fa';

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [tutoringTypeFilter, setTutoringTypeFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (token && userType === 'student') {
      setIsLoggedIn(true);
    }
    fetchTutors();
  }, []);

  const filterTutors = useCallback(() => {
    let filtered = tutors;
    if (searchTerm) {
      filtered = filtered.filter(tutor =>
        `${tutor.firstName || tutor.full_name || ''} ${tutor.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.subjects?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (subjectFilter) {
      filtered = filtered.filter(tutor =>
        tutor.subjects?.toLowerCase().includes(subjectFilter.toLowerCase())
      );
    }
    if (tutoringTypeFilter !== 'all') {
      filtered = filtered.filter(tutor => {
        if (tutoringTypeFilter === 'physical') {
          return tutor.tutoring_type === 'physical' || tutor.tutoring_type === 'both' || !tutor.tutoring_type;
        } else if (tutoringTypeFilter === 'online') {
          return tutor.tutoring_type === 'online' || tutor.tutoring_type === 'both' || !tutor.tutoring_type;
        }
        return true;
      });
    }
    setFilteredTutors(filtered);
  }, [searchTerm, subjectFilter, tutoringTypeFilter, tutors]);

  useEffect(() => {
    filterTutors();
  }, [filterTutors]);

  const fetchTutors = async () => {
    try {
      const res = await axios.get(`${API_CONFIG.BASE_URL}/api/tutors`, {
        timeout: API_CONFIG.TIMEOUT
      });
      setTutors(res.data.tutors || []);
      setFilteredTutors(res.data.tutors || []);
      setLoading(false);
    } catch (err) {
      console.error('Fetch tutors failed:', err.message);
      setTutors([]);
      setFilteredTutors([]);
      setLoading(false);
    }
  };

  const handleDirectMessage = (tutor) => {
    if (!isLoggedIn) {
      alert('Please register or login as a student to message tutors');
      navigate('/student-registration');
      return;
    }
    setSelectedTutor(tutor);
    setShowMessageModal(true);
  };

  const sendDirectMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTutor) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_CONFIG.BASE_URL}/api/messages/send`, {
        receiverId: selectedTutor.id,
        receiverType: 'tutor',
        message: messageText
      }, {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setMessageText('');
      setShowMessageModal(false);
      setSelectedTutor(null);
      navigate('/messages');
    } catch (err) {
      console.error('Error sending message:', err.message);
      alert('Failed to send message - Backend may be unavailable');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1d] text-gray-900 dark:text-slate-300 font-sans pb-40 selection:bg-blue-500/30 transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/40 dark:bg-blue-600/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-normal transform-gpu"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-600/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-normal transform-gpu"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-10 pb-12">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex p-1.5 bg-white dark:bg-blue-500/10 rounded-[12px] border border-gray-200 dark:border-blue-500/20 mb-2 relative group shadow-sm dark:shadow-none">
            <FaUserTie className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 relative z-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter uppercase italic leading-none">
            EXPERT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">NETWORK</span>
          </h1>
          <p className="text-[9px] sm:text-[10px] text-gray-600 dark:text-slate-400 font-bold uppercase tracking-widest max-w-xl mx-auto">
            Connect with verified institutional instructors
          </p>
        </div>

        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 mb-8 border border-blue-500/30 shadow-xl animate-fadeIn relative overflow-hidden group max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
              <FaUsers size={80} />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="text-center sm:text-left">
                <h3 className="text-sm sm:text-base font-black text-white mb-1 uppercase tracking-tight italic">Want to Connect with Tutors?</h3>
                <p className="text-[9px] sm:text-[10px] text-blue-100 font-medium">Get lifetime access for only <span className="font-black text-white bg-white/20 px-1.5 rounded">50 ETB</span></p>
              </div>
              <Link to="/student-registration" className="px-6 py-2.5 bg-white hover:bg-blue-50 text-blue-600 font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-[12px] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                Get Started <FaChevronRight size={10} />
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-3 sm:p-4 rounded-[20px] border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl mb-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs" />
              <input type="text" placeholder="SEARCH EXPERTS..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-700/50 rounded-xl py-2.5 pl-9 pr-3 text-[10px] font-bold text-gray-900 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-600 uppercase tracking-wide" />
            </div>

            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-700/50 rounded-xl py-2.5 px-3 text-[10px] font-bold text-gray-900 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer uppercase tracking-wide">
              <option value="">ALL SUBJECTS</option>
              <optgroup label="University Courses">
                <option value="calculus">Calculus</option>
                <option value="algebra">Linear Algebra</option>
                <option value="programming">Programming</option>
                <option value="engineering">Engineering</option>
                <option value="economics">Economics</option>
              </optgroup>
              <optgroup label="Projects & Tech">
                <option value="software-dev">Software Development</option>
                <option value="final-year-project">Final Year Project</option>
                <option value="thesis">Thesis Support</option>
                <option value="research">Research Assistance</option>
              </optgroup>
              <optgroup label="Grade Levels">
                <option value="grade-12">Grade 12 (Entrance)</option>
                <option value="grade-11">Grade 11</option>
                <option value="grade-10">Grade 10</option>
                <option value="grade-9">Grade 9</option>
                <option value="elementary">Elementary</option>
              </optgroup>
            </select>

            <select value={serviceTypeFilter} onChange={(e) => setServiceTypeFilter(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-700/50 rounded-xl py-2.5 px-3 text-[10px] font-bold text-gray-900 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer uppercase tracking-wide">
              <option value="all">ALL SERVICES</option>
              <option value="tutoring">Course Tutoring</option>
              <option value="project">Project Assistance</option>
            </select>

            <select value={tutoringTypeFilter} onChange={(e) => setTutoringTypeFilter(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-700/50 rounded-xl py-2.5 px-3 text-[10px] font-bold text-gray-900 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer uppercase tracking-wide">
              <option value="all">ALL MODES</option>
              <option value="physical">In-Person</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600/20 dark:border-blue-500/20 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-500 dark:text-slate-600 uppercase tracking-widest">Loading Network...</p>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-[30px] border border-gray-200 dark:border-slate-800">
            <FaUserTie className="text-4xl text-gray-300 dark:text-slate-800 mx-auto mb-4" />
            <p className="text-sm font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest">NO EXPERTS FOUND</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-4 border border-gray-200 dark:border-white/5 hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-none hover:-translate-y-1 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-800 overflow-hidden">
                      <img src={tutor.profilePhoto ? `http://localhost:5000${tutor.profilePhoto}` : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTA5MGIyIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0yMCAyMWE4IDggMCAwIDEtMTYgMCIvPjxlbGxpcHNlIGN4PSIxMiIgY3k9IjgiIHJ4PSI0IiByeT0iNCIvPjwvc3ZnPg=='} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTA5MGIyIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0yMCAyMWE4IDggMCAwIDEtMTYgMCIvPjxlbGxpcHNlIGN4PSIxMiIgY3k9IjgiIHJ4PSI0IiByeT0iNCIvPjwvc3ZnPg=='; }} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-[8px] text-white px-1 py-0.5 rounded-md shadow-sm flex items-center gap-0.5 border border-white dark:border-slate-900">
                      <FaShieldAlt /> <span className="font-bold">PRO</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate mb-0.5">{tutor.firstName} {tutor.lastName}</h3>
                    <p className="text-[9px] text-gray-500 dark:text-slate-500 font-bold uppercase tracking-wider truncate">{tutor.specialization || 'Instructor'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FaStar className="text-yellow-500 text-[9px]" />
                      <span className="text-[10px] font-bold text-gray-700 dark:text-slate-300">{tutor.rating || '5.0'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(!tutor.tutoring_type || tutor.tutoring_type === 'physical' || tutor.tutoring_type === 'both') && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-[8px] font-bold uppercase rounded-md">In-Person</span>
                  )}
                  {(!tutor.tutoring_type || tutor.tutoring_type === 'online' || tutor.tutoring_type === 'both') && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-[8px] font-bold uppercase rounded-md">Online</span>
                  )}
                </div>
                <div className="space-y-2 mb-3 flex-grow">
                  <div className="bg-gray-50 dark:bg-slate-950/30 rounded-lg p-2 border border-gray-100 dark:border-white/5 h-14">
                    <p className="text-[8px] text-gray-400 dark:text-slate-500 font-bold uppercase mb-0.5">Expertise</p>
                    <p className="text-[9px] text-gray-700 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">{tutor.subjects || 'General Engineering, Mathematics, Physics'}</p>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] text-gray-500 dark:text-slate-500 font-bold uppercase">Rate</span>
                    <span className="text-xs font-black text-green-600 dark:text-green-400">{tutor.hourlyRate} <span className="text-[8px] text-gray-400 dark:text-slate-600 font-bold">ETB/HR</span></span>
                  </div>
                </div>
                <button onClick={() => handleDirectMessage(tutor)} className="w-full py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-blue-50 text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-auto">
                  <FaPaperPlane className="text-[9px]" /> Message
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 max-w-md w-full border border-gray-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-4">Send Message</h3>
            <div className="mb-4">
              <label className="block text-[10px] font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-2">Message to {selectedTutor?.firstName}</label>
              <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} className="w-full h-24 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" placeholder="Write your message here..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowMessageModal(false)} className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={sendDirectMessage} className="flex-1 py-2.5 bg-blue-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25">Send</button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Tutors;
