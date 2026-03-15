import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaUser, FaBook, FaComments, FaSignOutAlt,
  FaHome, FaUsers, FaCalendar, FaFileAlt, FaVideo, FaChartLine,
  FaCheckCircle, FaClock, FaTrophy, FaFire, FaRocket,
  FaArrowUp, FaArrowRight, FaCrown, FaHistory, FaShieldAlt, FaBrain, FaGraduationCap
} from 'react-icons/fa';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'student') {
      navigate('/login');
      return;
    }

    fetchStudentProfile();
  }, [navigate]);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/students/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(response.data.student);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 gap-6">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-600 dark:text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Loading Dashboard Data...</p>
      </div>
    );
  }

  const userName = student ? student.full_name || `${student.firstName} ${student.lastName}` : 'Student';
  const isPremium = student?.subscriptionStatus === 'premium';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 pb-20 sm:pb-40 transition-colors duration-300">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] sm:w-[60%] sm:h-[60%] bg-blue-600/5 blur-[100px] sm:blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] sm:w-[50%] sm:h-[50%] bg-indigo-600/5 blur-[100px] sm:blur-[150px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24">
        {/* Command Center Title */}
        <div className="flex flex-col items-center justify-between gap-6 sm:gap-10 mb-12 sm:mb-16 bg-white dark:bg-slate-900/40 backdrop-blur-3xl p-6 sm:p-8 lg:p-12 rounded-[20px] sm:rounded-[30px] lg:rounded-[50px] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 p-6 sm:p-8 lg:p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity dark:text-white">
            <FaBrain size={150} className="sm:size-200 lg:size-250" />
          </div>

          <div className="flex items-center gap-6 sm:gap-10 text-center flex-col sm:flex-row relative z-10 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-slate-800 rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] border border-blue-500/30 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl text-blue-400 relative shadow-inner">
                <FaUser />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 sm:mb-3 leading-none uppercase italic transition-colors">
                {userName.split(' ')[0]}'S <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">DASHBOARD</span>
              </h1>
              <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center sm:justify-start">
                <span className="text-slate-500 font-black tracking-widest text-[8px] sm:text-[10px] uppercase">STATUS: {isPremium ? 'PRO MEMBER' : 'STANDARD STUDENT'}</span>
                <div className="h-1 w-1 bg-slate-700 rounded-full hidden sm:block"></div>
                <span className="text-slate-500 font-black tracking-widest text-[8px] sm:text-[10px] uppercase">SECTOR: ENGINEERING</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-6 relative z-10">
            {isPremium ? (
              <span className="px-4 sm:px-6 py-2 sm:py-2.5 bg-yellow-400/10 text-yellow-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-yellow-500/20 flex items-center gap-2 sm:gap-3 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                <FaCrown className="animate-bounce text-sm sm:text-base" /> PRO VERIFIED
              </span>
            ) : (
              <Link to="/subscribe-premium" className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 sm:gap-3">
                <FaRocket className="text-sm sm:text-base" /> UPGRADE TO PRO
              </Link>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] font-black text-slate-600 hover:text-red-500 transition-all uppercase tracking-widest group">
              LOGOUT <FaSignOutAlt className="text-sm sm:text-base group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Telemetry Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 animate-fadeIn">
          {[
            { label: "Mentors", val: "05", icon: <FaUsers />, color: "blue", trend: "+2 this month" },
            { label: "Completed Courses", val: "12", icon: <FaCheckCircle />, color: "green", trend: "78% accuracy" },
            { label: "Upcoming Classes", val: "03", icon: <FaCalendar />, color: "purple", trend: "01 tomorrow" },
            { label: "Progress", val: "64%", icon: <FaChartLine />, color: "orange", trend: "Increasing efficiency" }
          ].map((stat, i) => (
            <div key={i} className={`group relative bg-white dark:bg-slate-900/30 backdrop-blur-2xl rounded-[20px] sm:rounded-[30px] lg:rounded-[44px] p-4 sm:p-6 lg:p-8 border border-slate-200 dark:border-white/5 hover:border-${stat.color}-500/30 transition-all duration-700 shadow-xl`}>
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <div className={`p-2 sm:p-3 lg:p-4 bg-${stat.color}-500/10 rounded-xl sm:rounded-2xl border border-${stat.color}-500/20 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest transition-colors">{stat.label}</div>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-2 sm:mb-4 transition-colors">{stat.val}</div>
              <div className={`text-[8px] sm:text-[9px] font-black text-${stat.color}-500/60 uppercase tracking-widest flex items-center gap-2 italic`}>
                <FaArrowUp size={6} className="sm:size-8" /> {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Freshman Exams Section */}
        <div className="mb-20">
          <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.6em] mb-10 flex items-center gap-4">
            <FaGraduationCap className="text-green-500" /> AASTU FRESHMAN EXAMS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-green-600/20 to-teal-600/20 rounded-[44px] p-8 border border-green-500/30 backdrop-blur-2xl hover:scale-[1.02] transition-all duration-500 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-green-400">
                  <FaBook className="text-2xl" />
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                  65+ Papers
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 transition-colors">Past Papers</h3>
              <p className="text-slate-400 text-sm mb-6">Access all AASTU freshman past papers with solutions</p>
              <Link
                to="/aastu-exams"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-center block"
              >
                View Papers →
              </Link>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[44px] p-8 border border-blue-500/30 backdrop-blur-2xl hover:scale-[1.02] transition-all duration-500 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                  <FaBrain className="text-2xl" />
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
                  Interactive
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 transition-colors">Practice Exams</h3>
              <p className="text-slate-400 text-sm mb-6">Take interactive mock exams with instant feedback</p>
              <Link
                to="/aastu-exams"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors text-center block"
              >
                Start Practice →
              </Link>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-[44px] p-8 border border-purple-500/30 backdrop-blur-2xl hover:scale-[1.02] transition-all duration-500 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
                  <FaChartLine className="text-2xl" />
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full">
                  Analytics
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 transition-colors">Dashboard</h3>
              <p className="text-slate-400 text-sm mb-6">Track your progress and performance analytics</p>
              <Link
                to="/aastu-exams"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-colors text-center block"
              >
                View Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* Tactical Repository Links */}
        <div className="mb-20">
          <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.6em] mb-10 flex items-center gap-4">
            <FaShieldAlt className="text-blue-500" /> QUICK LINKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: "Find Tutors", path: "/tutors", icon: <FaUsers />, color: "blue" },
              { label: "Intel Stream", path: "/videos", icon: <FaVideo />, color: "red" },
              { label: "Resources", path: "/resources", icon: <FaFileAlt />, color: "orange" },
              { label: "Exit Exams", path: "/exit-exams", icon: <FaGraduationCap />, color: "indigo" },
              { label: "AASTU HUB", path: "/aastu-exams", icon: <FaCrown />, color: "yellow" }
            ].map((link, i) => (
              <Link key={i} to={link.path} className="group relative bg-white dark:bg-slate-900/30 backdrop-blur-2xl p-10 rounded-[44px] border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all text-center flex flex-col items-center gap-6 shadow-xl">
                <div className={`p-6 bg-slate-50 dark:bg-slate-800 rounded-[28px] text-4xl text-slate-400 dark:text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-slate-100 dark:border-slate-700/50`}>
                  {link.icon}
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover:text-blue-500 transition-colors italic">{link.label}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Global Recent Activity Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.6em] mb-10 flex items-center gap-4 transition-colors">
              <FaHistory className="text-blue-500" /> RECENT ACTIVITY
            </h2>
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-3xl rounded-[50px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-4 transition-colors">
              <div className="space-y-2">
                {[
                  { label: "Mathematics Analysis", val: "Dec 05", icon: <FaBook />, color: "blue", status: "VERIFIED" },
                  { label: "Physics Session", val: "Dec 10", icon: <FaCalendar />, color: "purple", status: "PENDING" },
                  { label: "thermal_physics_guide.pdf", val: "Dec 03", icon: <FaFileAlt />, color: "green", status: "COMPLETED" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-8 hover:bg-white/5 rounded-[40px] transition-all group cursor-pointer">
                    <div className="flex items-center gap-8">
                      <div className="p-4 bg-slate-800 rounded-2xl text-2xl text-slate-600 group-hover:text-white transition-all">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter group-hover:text-blue-500 transition-colors">{item.label}</h4>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1 italic transition-colors">{item.val}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current text-slate-600 opacity-60 group-hover:opacity-100 group-hover:text-green-500`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.6em] mb-10 flex items-center gap-4">
              <FaRocket className="text-orange-500" /> PROGRESS STATUS
            </h2>
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[50px] border border-white/10 p-12 text-center group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><FaTrophy size={100} /></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 animate-float transition-colors">
                  <FaTrophy className="text-4xl text-yellow-500" />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Academic Rank</h3>
                <p className="text-sm font-bold text-white/60 dark:text-slate-500 mb-8 italic uppercase tracking-widest transition-colors">TOP 10% OF SECTOR</p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full mb-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-blue-500 w-[78%] shadow-lg"></div>
                </div>
                <Link to="/messages" className="block py-6 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] rounded-[24px] hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                  VIEW MESSAGES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;
