import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG } from '../utils/apiConfig';
import {
  FaStar, FaMoneyBillWave, FaGraduationCap, FaEnvelope,
  FaArrowLeft, FaCheckCircle, FaShieldAlt, FaRocket, FaBrain, FaPaperPlane, FaUserTie
} from 'react-icons/fa';

const TutorProfile = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const fetchTutor = useCallback(async () => {
    try {
      const res = await axios.get(`${API_CONFIG.BASE_URL}/api/tutors/${id}`, {
        timeout: API_CONFIG.TIMEOUT
      });
      setTutor(res.data.tutor);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tutor:', err.message);
      setLoading(false);
      // Don't navigate away on error, just show a message
      alert('Failed to load tutor profile - Backend may be unavailable');
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userType !== 'student') {
      navigate('/');
      return;
    }

    fetchTutor();
  }, [id, navigate, fetchTutor]);

  const sendMessage = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/api/messages/send`, {
        receiverId: tutor.id,
        receiverType: 'tutor',
        message: message
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          timeout: API_CONFIG.TIMEOUT
        }
      });
      setMessage('');
      navigate('/messages');
    } catch (err) {
      console.error('Error sending message:', err.message);
      alert('Failed to send message - Backend may be unavailable');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 font-sans selection:bg-blue-500/30 pb-40 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[180px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-24">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 animate-fadeIn">
          <button
            onClick={() => navigate('/tutors')}
            className="group flex items-center gap-4 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.4em] transition-all"
          >
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:border-blue-500/50 transition-all">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </div>
            BACK TO TUTOR LIST
          </button>

          <div className="flex items-center gap-6 bg-slate-900/50 backdrop-blur-3xl px-8 py-4 rounded-[28px] border border-slate-800">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PROFILE STATUS</span>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> CONNECTION ESTABLISHED
              </span>
            </div>
            <div className="h-10 w-[1px] bg-slate-800"></div>
            <FaShieldAlt className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Expert Identity */}
          <div className="lg:col-span-4 space-y-8 animate-slideUp">
            <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[60px] border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <FaUserTie size={160} />
              </div>

              <div className="relative z-10 text-center">
                <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20"></div>
                  <img
                    src={tutor.profilePhoto ? `${API_CONFIG.BASE_URL}${tutor.profilePhoto}` : '/default-avatar.png'}
                    alt={tutor.firstName}
                    className="w-48 h-48 rounded-[40px] object-cover relative z-10 border-4 border-slate-800 shadow-2xl"
                  />
                </div>

                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
                  {tutor.firstName} <span className="text-blue-500">{tutor.lastName}</span>
                </h1>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8">
                  {tutor.specialization || 'VERIFIED PRO'}
                </p>

                <div className="flex flex-col gap-4">
                  <div className="bg-slate-900/80 rounded-[30px] p-6 border border-slate-800 flex items-center justify-between group-hover:border-blue-500/30 transition-all">
                    <div className="text-left">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">RATING</span>
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        <span className="text-2xl font-black text-white italic">{tutor.rating || '5.0'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">REVIEWS</span>
                      <span className="text-xl font-black text-slate-400 italic">{tutor.totalReviews || '0'}</span>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-[30px] p-6 flex items-center justify-between shadow-lg shadow-blue-500/20">
                    <div className="text-left">
                      <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest block mb-1">HOURLY RATE</span>
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-blue-100" />
                        <span className="text-2xl font-black text-white italic">{tutor.hourlyRate} <span className="text-sm">ETB</span></span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest">/ HR</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[50px] border border-slate-800">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                <FaShieldAlt className="text-blue-500" /> VERIFICATION LEVEL
              </h3>
              <div className="flex items-center gap-6 p-6 bg-green-500/5 rounded-[30px] border border-green-500/10">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500">
                  <FaCheckCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">IDENTITY VERIFIED</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">PRO VERIFIED</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Intelligence Payload */}
          <div className="lg:col-span-8 space-y-12 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            {/* Biography */}
            <div className="bg-slate-900/30 backdrop-blur-3xl p-12 rounded-[60px] border border-slate-800">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                <FaBrain className="text-blue-500" /> PROFESSIONAL BIOGRAPHY
              </h3>
              <p className="text-xl text-slate-400 font-medium leading-[1.8] italic">
                "{tutor.bio || 'Information pending update.'}"
              </p>
            </div>

            {/* Expertise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/30 backdrop-blur-3xl p-12 rounded-[50px] border border-slate-800">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                  <FaGraduationCap className="text-blue-500" /> EXPERTISE
                </h3>
                <div className="flex flex-wrap gap-4">
                  {tutor.subjects?.split(',').map((subj, i) => (
                    <span key={i} className="px-6 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-blue-600 hover:text-white transition-all">
                      {subj.trim()}
                    </span>
                  )) || <span className="text-slate-600 text-[10px] font-black">PENDING UPDATE</span>}
                </div>
              </div>

              <div className="bg-slate-900/30 backdrop-blur-3xl p-12 rounded-[50px] border border-slate-800">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                  <FaShieldAlt className="text-blue-500" /> QUALIFICATIONS
                </h3>
                <div className="space-y-4">
                  {tutor.qualifications?.split('\n').map((q, i) => (
                    <div key={i} className="flex items-start gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                      {q}
                    </div>
                  )) || <p className="text-slate-600 text-[10px] font-black italic">"INFORMATION PRIVATE"</p>}
                </div>
              </div>
            </div>

            {/* Communication Terminal */}
            <div className="bg-slate-900/30 backdrop-blur-3xl p-12 rounded-[60px] border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <FaPaperPlane size={200} />
              </div>

              <div className="relative z-10">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                  <FaEnvelope className="text-blue-500" /> SEND MESSAGE
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="space-y-8">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="ENTER MESSAGE..."
                      className="w-full bg-slate-950/50 border border-slate-800 p-10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.3em] placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all min-h-[250px] resize-none"
                      required
                    />
                    <div className="absolute bottom-6 right-10 text-[9px] font-black text-slate-700 tracking-[0.4em]">PRIVATE MESSAGE</div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-8 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.8em] rounded-[30px] shadow-2xl hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-6 group/btn"
                  >
                    {sending ? 'SENDING...' : 'SEND MESSAGE'}
                    <FaRocket className="group-hover/btn:-translate-y-2 group-hover/btn:translate-x-2 transition-transform duration-500" />
                  </button>
                </form>

                <div className="mt-10 p-8 bg-blue-500/5 rounded-[30px] border border-blue-500/10 flex items-start gap-6">
                  <FaShieldAlt className="text-blue-500 text-2xl shrink-0 mt-1" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                    THIS MESSAGE MAY BE SUBJECT TO MONITORING. DO NOT SHARE PRIVATE PASSWORDS OR FINANCIAL DETAILS DIRECTLY IN THIS CHANNEL.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default TutorProfile;
