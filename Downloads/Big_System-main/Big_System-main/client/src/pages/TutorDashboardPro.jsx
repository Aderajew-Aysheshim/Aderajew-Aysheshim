import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaUser, FaComments, FaSignOutAlt,
  FaHome, FaUsers, FaCalendar, FaFileAlt, FaChartLine,
  FaCheckCircle, FaClock, FaTrophy, FaFire,
  FaArrowUp, FaArrowRight, FaGem,
  FaDollarSign, FaGraduationCap, FaChartBar, FaChalkboardTeacher, FaCog,
  FaBars, FaTimes, FaUpload, FaBook, FaFileWord, FaFilePdf, FaFileExcel,
  FaTrash, FaDownload, FaEye, FaPlus, FaShieldAlt, FaBrain, FaChevronRight
} from 'react-icons/fa';

const TutorDashboardPro = () => {
  const [tutor, setTutor] = useState(null);
  const [stats, setStats] = useState({
    activeStudents: 0, sessionsThisMonth: 0, totalEarnings: 0, rating: 0, recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [resources, setResources] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('material');
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
      const resourcesResponse = await axios.get('http://localhost:5000/api/tutors/resources', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resourcesResponse.data.resources) setResources(resourcesResponse.data.resources);
    } catch (error) {
      console.error(error);
    } finally { setLoading(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0] || uploadingFile;
    if (!file || !resourceTitle) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', resourceTitle);
    formData.append('type', resourceType);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/tutors/upload-resource', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.resource) {
        setResources([...resources, response.data.resource]);
        setResourceTitle(''); setUploadingFile(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('userType');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const tutorName = tutor ? tutor.full_name || `${tutor.firstName} ${tutor.lastName}` : 'EXPERT';

  const navItems = [
    { id: 'overview', label: 'DASHBOARD', icon: FaHome },
    { id: 'sessions', label: 'SESSIONS', icon: FaCalendar },
    { id: 'messages', label: 'MESSAGES', icon: FaComments },
    { id: 'resources', label: 'RESOURCES', icon: FaBook },
    { id: 'students', label: 'STUDENTS', icon: FaGraduationCap },
    { id: 'analytics', label: 'ANALYTICS', icon: FaChartBar },
    { id: 'settings', label: 'SETTINGS', icon: FaCog }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 font-sans selection:bg-indigo-500/30 flex overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/5 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[180px] rounded-full"></div>
      </div>

      {/* Industrial Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-24'} bg-slate-900/60 backdrop-blur-4xl border-r border-slate-800 transition-all duration-700 relative z-30 flex flex-col`}>
        <div className="p-8 border-b border-slate-800 flex items-center gap-4 overflow-hidden mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20 animate-pulse">
            <FaShieldAlt className="text-white" />
          </div>
          {sidebarOpen && <span className="text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">TUTOR HUB PRO</span>}
        </div>

        <nav className="flex-grow px-4 space-y-3">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-6 px-6 py-5 rounded-[24px] transition-all group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.3em]">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-800">
          <button onClick={handleLogout} className={`w-full flex items-center gap-6 px-6 py-5 rounded-[24px] bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all`}>
            <FaSignOutAlt />
            {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.3em]">LOGOUT</span>}
          </button>
        </div>
      </div>

      {/* Main Command Center */}
      <div className="flex-1 overflow-y-auto px-12 py-12 relative z-10 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-16 animate-fadeIn">
            <div>
              <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">MENTOR <span className="text-indigo-500">DASHBOARD</span></h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">LOGGED IN: {tutorName} • {new Date().toLocaleDateString()}</p>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-14 h-14 bg-slate-800/40 rounded-2xl flex items-center justify-center border border-slate-700 text-slate-400 hover:text-white transition-colors">
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Tabbed Content */}
          {activeTab === 'overview' && (
            <div className="space-y-16 animate-slideUp">
              {/* Stats Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'STUDENTS', value: stats.activeStudents, icon: <FaUsers />, color: 'blue' },
                  { label: 'SESSIONS', value: stats.sessionsThisMonth, icon: <FaCalendar />, color: 'indigo' },
                  { label: 'EARNINGS', value: stats.totalEarnings, icon: <FaDollarSign />, color: 'purple' },
                  { label: 'RATING', value: `${stats.rating || 5.0}★`, icon: <FaTrophy />, color: 'emerald' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[50px] border border-white/5 hover:border-indigo-500/30 transition-all group overflow-hidden relative h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div className={`p-4 rounded-2xl bg-${stat.color}-500/20 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                      </div>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-${stat.color}-500 w-[65%]`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Log */}
              <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[60px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4"><FaClock className="text-indigo-400" /> ACTIVITY LOGS</h2>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">REAL-TIME ACTIVITY</span>
                </div>
                <div className="p-0">
                  {stats.recentActivities?.length > 0 ? (
                    stats.recentActivities.map((log, i) => (
                      <div key={i} className="flex items-center justify-between py-10 px-12 border-b border-slate-800/50 hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-10">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${log.type === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                            {log.type === 'completed' ? <FaCheckCircle size={24} /> : <FaCalendar size={24} />}
                          </div>
                          <div>
                            <p className="text-white font-black uppercase tracking-widest text-sm mb-1">{log.title}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{log.description}</p>
                          </div>
                        </div>
                        <span className="px-6 py-2 bg-slate-800 border border-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{log.status}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center uppercase font-black text-slate-700 tracking-[1em] text-[10px]">NO RECENT ACTIVITY FOUND</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-16 animate-slideUp">
              <div className="bg-slate-900/40 backdrop-blur-3xl p-12 rounded-[60px] border border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><FaUpload size={200} /></div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-12 flex items-center gap-6 relative z-10"><FaUpload className="text-indigo-400 animate-bounce" /> UPLOAD RESOURCE</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                  <div className="space-y-4">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">CORE TITLE</label>
                    <input type="text" value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} placeholder="RESOURCE TITLE ..." className="w-full bg-slate-800/40 border border-slate-800 rounded-[28px] py-5 px-10 text-white hover:border-slate-700 outline-none transition-all font-black placeholder-slate-700" />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">RESOURCE CATEGORY</label>
                    <select value={resourceType} onChange={(e) => setResourceType(e.target.value)} className="w-full bg-slate-800/40 border border-slate-800 rounded-[28px] py-5 px-10 text-white hover:border-slate-700 outline-none transition-all font-black appearance-none">
                      <option value="material">STUDY MATERIAL</option> <option value="exam">EXAM REPOSITORY</option> <option value="exercise">PRACTICE TASK</option>
                    </select>
                  </div>
                </div>

                <div className="mt-10 relative z-10">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 ml-4 text-center">SELECT FILE (PDF, DOC, XLS, PPT)</label>
                  <div className="relative group/upload border-2 border-dashed border-slate-800 rounded-[44px] py-20 px-10 text-center hover:border-indigo-500/30 transition-all cursor-pointer bg-slate-800/10">
                    <input type="file" onChange={(e) => setUploadingFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="relative z-10">
                      <FaUpload className="text-5xl text-slate-700 group-hover:text-indigo-500 transition-colors mx-auto mb-6" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{uploadingFile ? uploadingFile.name : 'CLICK TO UPLOAD FILE'}</p>
                    </div>
                  </div>
                </div>

                <button onClick={handleFileUpload} disabled={!resourceTitle} className="mt-12 w-full py-6 bg-white text-slate-900 font-black text-[12px] uppercase tracking-[0.5em] rounded-[32px] hover:bg-indigo-50 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-95 group/btn">
                  SAVE TO ARCHIVE <FaChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-12">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-6"><FaBook className="text-emerald-400" /> ACTIVE RESOURCES ({resources.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resources.map(res => (
                    <div key={res.id} className="bg-slate-900/30 backdrop-blur-2xl p-10 rounded-[50px] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                        <div className="p-4 bg-slate-800 rounded-2xl text-3xl group-hover:scale-110 transition-transform">
                          {res.fileName?.endsWith('.pdf') ? <FaFilePdf className="text-red-400" /> : <FaFileWord className="text-blue-400" />}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => window.open(res.fileUrl, '_blank')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><FaDownload /></button>
                        </div>
                      </div>
                      <h3 className="text-white font-black uppercase text-sm tracking-widest mb-2 flex-grow">{res.title}</h3>
                      <p className="text-[9px] font-black text-slate-500 tracking-[0.4em] uppercase">{res.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'resources' && (
            <div className="py-40 text-center animate-fadeIn">
              <FaBrain className="text-7xl text-slate-800 mx-auto mb-10 animate-pulse" />
              <p className="text-[12px] font-black text-slate-700 uppercase tracking-[1em]">COMING SOON</p>
            </div>
          )}
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

export default TutorDashboardPro;
