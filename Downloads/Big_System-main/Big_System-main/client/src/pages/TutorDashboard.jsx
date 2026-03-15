import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaUser, FaComments, FaSignOutAlt,
  FaHome, FaUsers, FaCalendar, FaFileAlt, FaChartLine,
  FaCheckCircle, FaClock, FaTrophy, FaFire,
  FaArrowUp, FaArrowRight, FaGem,
  FaDollarSign, FaGraduationCap, FaChartBar, FaChalkboardTeacher, FaCog, FaVideo, FaShieldAlt
} from 'react-icons/fa';

const TutorDashboard = () => {
  const [tutor, setTutor] = useState(null);
  const [stats, setStats] = useState({
    activeStudents: 0, sessionsThisMonth: 0, totalEarnings: 0, rating: 0, recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'tutor') { navigate('/login'); return; }
    fetchTutorData();
  }, [navigate]);

  const fetchTutorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileResponse = await axios.get('http://localhost:5000/api/tutors/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTutor(profileResponse.data.tutor);
      const statsResponse = await axios.get('http://localhost:5000/api/tutors/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsResponse.data.stats) setStats(statsResponse.data.stats);
    } catch (error) {
      console.error(error);
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('userType');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors duration-300 gap-6">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-600 dark:text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Loading Expert Center...</p>
      </div>
    );
  }

  const tutorName = tutor ? tutor.full_name || `${tutor.firstName} ${tutor.lastName}` : 'EXPERT';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-300 font-sans pb-40 selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[180px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Institutional Header */}
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-3xl p-10 md:p-16 rounded-[60px] border border-slate-200 dark:border-slate-800 shadow-2xl mb-12 relative overflow-hidden group animate-fadeIn transition-colors">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity dark:text-white">
            <FaChalkboardTeacher size={240} />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                  <img
                    src={tutor?.profilePhoto ? `http://localhost:5000${tutor.profilePhoto}` : 'https://via.placeholder.com/150'}
                    className="w-24 h-24 rounded-[32px] object-cover border-2 border-indigo-500/30 shadow-2xl relative z-10"
                    alt=""
                  />
                  <div className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg relative z-20"><FaShieldAlt size={12} /></div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-2 leading-none transition-colors">
                    WELCOME, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{tutorName}</span>
                  </h1>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">MENTOR DASHBOARD • VERIFICATION STATUS: VERIFIED</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <FaGem /> PRO INSTRUCTOR
                </div>
                <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                  <FaShieldAlt /> VERIFIED MENTOR
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="px-8 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[24px] hover:bg-white dark:hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl active:scale-95">
              <FaSignOutAlt /> LOGOUT
            </button>
          </div>
        </div>

        {/* Telemetry Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'ACTIVE STUDENTS', value: stats.activeStudents, icon: <FaUsers />, color: 'from-blue-500 to-blue-600' },
            { label: 'SESSIONS / MO', value: stats.sessionsThisMonth, icon: <FaCalendar />, color: 'from-indigo-500 to-indigo-600' },
            { label: 'TOTAL EARNINGS', value: stats.totalEarnings, icon: <FaDollarSign />, color: 'from-purple-500 to-purple-600' },
            { label: 'AVERAGE RATING', value: `${stats.rating || 5.0}★`, icon: <FaTrophy />, color: 'from-emerald-500 to-emerald-600' }
          ].map((stat, i) => (
            <div key={i} className={`bg-white dark:bg-slate-900/30 backdrop-blur-2xl rounded-[40px] p-8 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all group overflow-hidden relative animate-slideUp`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter transition-colors">{stat.value}</h3>
                </div>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden relative z-10">
                <div className={`h-full bg-gradient-to-r ${stat.color} w-[70%]`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Access Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16 h-full">
          {[
            { label: 'SESSIONS', icon: <FaCalendar />, link: '/tutor/sessions', color: 'indigo' },
            { label: 'MESSAGES', icon: <FaComments />, link: '/tutor/messages', color: 'blue' },
            { label: 'RESOURCES', icon: <FaFileAlt />, link: '/tutor/resources', color: 'purple' },
            { label: 'STUDENTS', icon: <FaGraduationCap />, link: '/tutor/students', color: 'cyan' },
            { label: 'ANALYTICS', icon: <FaChartBar />, link: '/tutor/analytics', color: 'rose' },
            { label: 'LIVE CLASSES', icon: <FaVideo />, link: `/classroom/tutor-${tutor?.id}`, color: 'emerald' }
          ].map((node, i) => (
            <Link key={i} to={node.link} className={`flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900/20 backdrop-blur-3xl rounded-[35px] py-10 border border-slate-200 dark:border-white/5 hover:border-${node.color}-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group shadow-xl h-full animate-fadeIn`} style={{ animationDelay: `${0.4 + i * 0.05}s` }}>
              <div className={`p-5 rounded-2xl bg-${node.color}-500/10 text-${node.color}-400 group-hover:scale-110 transition-transform`}>
                {node.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{node.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-3xl rounded-[60px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slideUp transition-colors" style={{ animationDelay: '0.8s' }}>
          <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter flex items-center gap-4 transition-colors">
              <FaClock className="text-indigo-400" /> RECENT ACTIVITIES
            </h2>
            <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">VIEW ALL ACTIVITIES</button>
          </div>
          <div className="p-0">
            {stats.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-8 px-10 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group last:border-b-0">
                  <div className="flex items-center gap-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${activity.type === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      {activity.type === 'completed' ? <FaCheckCircle size={24} /> : <FaCalendar size={24} />}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-1 transition-colors">{activity.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">{activity.description}</p>
                    </div>
                  </div>
                  <span className="px-6 py-2 bg-slate-800 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border border-white/5">{activity.status}</span>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">NO RECENT ACTIVITIES</p>
              </div>
            )}
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

export default TutorDashboard;
