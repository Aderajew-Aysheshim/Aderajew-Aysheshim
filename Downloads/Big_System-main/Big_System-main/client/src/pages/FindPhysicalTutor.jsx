import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaStar, FaGraduationCap, FaEnvelope, FaSearch, FaChevronRight, FaShieldAlt, FaMapMarkerAlt, FaClock, FaLanguage, FaMoneyBillWave, FaPaperPlane, FaFilter, FaUsers } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';

const FindPhysicalTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhysicalTutors();
  }, []);

  useEffect(() => {
    filterTutors();
  }, [searchTerm, subjectFilter, locationFilter, tutors]);

  const fetchPhysicalTutors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tutors');
      const physicalTutors = res.data.tutors?.filter(tutor =>
        tutor.tutoring_type === 'physical' || tutor.tutoring_type === 'both' || !tutor.tutoring_type
      ) || [];
      setTutors(physicalTutors);
      setFilteredTutors(physicalTutors);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filterTutors = () => {
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
    if (locationFilter) {
      filtered = filtered.filter(tutor =>
        tutor.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        tutor.city?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    setFilteredTutors(filtered);
  };

  const handleDirectMessage = (tutor) => {
    setSelectedTutor(tutor);
    setShowMessageModal(true);
  };

  const sendDirectMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTutor) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/messages/send', {
        receiverId: selectedTutor.id,
        receiverType: 'tutor',
        message: messageText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessageText('');
      setShowMessageModal(false);
      setSelectedTutor(null);
      navigate('/messages');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const locations = ['Addis Ababa', 'Bahir Dar', 'Hawassa', 'Mekelle', 'Gondar', 'Dire Dawa', 'Adama', 'Jimma'];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-green-200 text-slate-900 dark:text-white pt-16 sm:pt-20 pb-16 sm:pb-20 transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] sm:w-[70%] sm:h-[70%] rounded-full bg-gradient-to-br from-green-200/40 to-emerald-200/40 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] sm:w-[50%] sm:h-[50%] rounded-full bg-gradient-to-tr from-teal-200/40 to-cyan-200/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex p-4 sm:p-6 bg-green-500/10 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] border border-green-500/20 mb-6 sm:mb-8 relative group">
            <div className="absolute inset-0 bg-green-400 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
            <FaHome className="text-3xl sm:text-4xl lg:text-5xl text-green-500 relative z-10 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight uppercase italic transition-colors">
            Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Physical Tutors</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto transition-colors">
            Connect with local tutors for face-to-face learning sessions in your area.
          </p>
        </div>

        {/* Featured Physical Tutor Info Card */}
        <div className="mb-12 sm:mb-16 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-green-500/10 shadow-2xl overflow-hidden relative group transition-colors">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full -mr-48 -mt-48 group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full -ml-32 -mb-32 group-hover:scale-125 transition-transform duration-1000 delay-100" />

            <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
              {/* Left Side: Call to Action */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/10 text-green-800 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-6 transition-colors">
                  <FaShieldAlt /> Premium Physical Tutoring
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6 transition-colors">
                  Expert In-Person <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">Guidance & Support</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-colors">
                  Connect with vetted professional tutors for personalized face-to-face learning sessions. Our premium physical tutoring ensures maximum engagement and rapid academic progress.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => window.location.href = 'tel:0951594353'}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl group/btn"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover/btn:bg-green-500 transition-colors">
                      <FiPhone className="text-white" />
                    </div>
                    CALL NOW: 0951594353
                  </button>
                  <div className="flex items-center gap-3 px-6 text-slate-500 font-bold uppercase tracking-widest text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Active Support
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Info Grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                {[
                  { icon: <FaClock />, title: 'Flexible Timing', desc: 'Schedule at your home' },
                  { icon: <FaGraduationCap />, title: 'Vetted Tutors', desc: 'Top 1% Professors' },
                  { icon: <FaMapMarkerAlt />, title: 'At Your Home', desc: 'Convenient learning' },
                  { icon: <FaStar />, title: 'Premium Care', desc: 'Dedicated mentoring' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-green-500/30 transition-all hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl group/item">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-green-600 shadow-sm mb-4 group-hover/item:scale-110 transition-all">
                      {item.icon}
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-1 transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Search & Filters */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-white dark:border-slate-800 mb-12 sm:mb-16 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
            <div className="relative">
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="Search tutors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 sm:py-3 pl-9 sm:pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-green-500/20 outline-none transition-all font-medium"
              />
            </div>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 sm:py-3 px-4 text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-green-500/20 outline-none transition-all font-medium"
            >
              <option value="">All Subjects</option>
              {/* ... options ... */}
            </select>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 sm:py-3 px-4 text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-green-500/20 outline-none transition-all font-medium"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <button className="bg-green-600 hover:bg-green-500 text-white rounded-xl py-2.5 sm:py-3 px-4 sm:px-6 font-bold transition-all flex items-center justify-center gap-2 text-sm">
              <FaFilter /> Apply Filters
            </button>
          </div>
        </div>

        {/* Tutors Grid */}
        {loading ? (
          <div className="py-16 sm:py-20 flex flex-col items-center justify-center gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.4em] text-xs sm:text-sm">Loading Physical Tutors...</p>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <p className="text-xl sm:text-2xl font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest italic transition-colors">No Physical Tutors Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTutors.map((tutor, idx) => (
              <div key={tutor.id} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-slate-100 dark:border-slate-800">
                {/* Header */}
                <div className="relative h-24 sm:h-28 lg:h-32 bg-gradient-to-br from-green-500 to-emerald-600">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={tutor.profilePhoto ? `http://localhost:5000${tutor.profilePhoto}` : 'https://via.placeholder.com/150'}
                        alt=""
                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl object-cover border-2 border-white shadow-lg"
                      />
                      <div className="text-white">
                        <h3 className="font-bold text-sm sm:text-base lg:text-lg">{tutor.firstName} {tutor.lastName}</h3>
                        <p className="text-xs opacity-90">{tutor.specialization || 'Expert Tutor'}</p>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-1.5 sm:p-2">
                      <FaHome className="text-white text-sm sm:text-base" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/10 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full mb-3 sm:mb-4 transition-colors">
                    <FaStar className="text-yellow-500 text-sm" />
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white transition-colors">{tutor.rating || '5.0'}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 transition-colors">({tutor.totalReviews || 0} reviews)</span>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors">
                        <FaGraduationCap className="text-sm" /> Subjects
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 sm:p-3 rounded-xl transition-all">{tutor.subjects || 'General Studies'}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hourly Rate</span>
                      <span className="text-base sm:text-lg font-black text-green-600">{tutor.hourlyRate} <span className="text-xs text-slate-600 font-bold">ETB/hr</span></span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>{tutor.location || tutor.city || 'Location not specified'}</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-green-500" />
                        <span>Face-to-Face</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-blue-500" />
                        <span>In-Person</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <button
                      onClick={() => navigate(`/tutor-profile/${tutor.id}`)}
                      className="w-full py-2 sm:py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      View Profile <FaChevronRight className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDirectMessage(tutor)}
                      className="w-full py-2 sm:py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FaPaperPlane className="text-xs" /> Message Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedTutor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 max-w-2xl w-full shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors uppercase tracking-wider">
                Message {selectedTutor.firstName || selectedTutor.full_name}
              </h3>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedTutor(null);
                  setMessageText('');
                }}
                className="text-slate-500 hover:text-slate-900 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={sendDirectMessage} className="space-y-6">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white font-medium placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-all min-h-[150px] resize-none"
                required
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowMessageModal(false);
                    setSelectedTutor(null);
                    setMessageText('');
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <FaPaperPlane /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPhysicalTutor;
