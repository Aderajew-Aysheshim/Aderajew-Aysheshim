import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG } from '../utils/apiConfig';
import {
  FaLock, FaChevronRight, FaCrown, FaCheckCircle, FaBrain,
  FaArrowLeft, FaClock, FaHistory, FaCheck, FaTimesCircle,
  FaPlay, FaRedo, FaBookOpen, FaLightbulb, FaUsers, FaChartBar,
  FaSignOutAlt, FaCog, FaBell, FaEye, FaEdit, FaTrash,
  FaChalkboardTeacher, FaBook, FaFileAlt, FaUpload, FaMoneyCheckAlt,
  FaArrowUp, FaArrowDown, FaSearch, FaGraduationCap, FaAward,
  FaDollarSign, FaCalendar, FaHome, FaComments, FaShieldAlt,
  FaTimes, FaBars, FaTerminal, FaBan, FaPlus, FaUser, FaMoon, FaSun,
  FaRocket, FaStar, FaTrophy, FaFire, FaBolt, FaGem, FaHeart,
  FaZap, FaChartLine, FaDatabase, FaNetworkWired, FaServer,
  FaUserShield, FaKey, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaMedal, FaCertificate, FaClipboardList, FaGlobe, FaLockOpen,
  FaUniversity, FaSchool, FaFilePdf, FaCreditCard, FaDownload, FaExpand
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
 
  const [stats, setStats] = useState({
    totalStudents: 0, verifiedTutors: 0, pendingTutors: 0, totalRevenue: 0,
    totalResources: 0, pendingPayments: 0, activeSessions: 0,
    todayLogins: 0, weeklyGrowth: 0, systemHealth: 98
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [liveActivity, setLiveActivity] = useState([]);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    growth: [],
    revenueStreams: [],
    dailyRevenue: []
  });
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    publicRegistration: true,
    apiCaching: true,
    emailNotifications: true,
    autoVerification: false
  });
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [conversationMessages, setConversationMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const fetchConversationMessages = async (convId) => {
    setMessagesLoading(true);
    try {
      const res = await axios.get(`${API_CONFIG.BASE_URL}/api/messages/admin/conversation/${convId}`);
      if (res.data.success) {
        setConversationMessages(res.data.messages);
      }
    } catch (error) {
      console.error('Fetch messages failed:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => {
      if (!item) return false;
      const searchStr = searchTerm.toLowerCase();
      const mainField = (item.full_name || item.user_name || item.title || item.student_name || '').toLowerCase();
      const subField = (item.email || item.user_email || item.subject || item.tutor_name || '').toLowerCase();
      return mainField.includes(searchStr) || subField.includes(searchStr);
    });
  }, [data, searchTerm]);

  const openModal = (item) => { 
    setSelectedItem(item); 
    setIsModalOpen(true); 
    if (activeTab === 'messages' && item.id) {
      fetchConversationMessages(item.id);
    }
  };

  const closeModal = () => { 
    setIsModalOpen(false); 
    setSelectedItem(null); 
    setConversationMessages([]);
  };

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/dashboard`, {
        timeout: API_CONFIG.TIMEOUT
      });
      if (response.data.stats) setStats(response.data.stats);
    } catch (error) {
      console.error('Stats fetch failed:', error.message);
     
      setStats({
        totalStudents: 0, verifiedTutors: 0, pendingTutors: 0, totalRevenue: 0,
        totalResources: 0, pendingPayments: 0, activeSessions: 0,
        todayLogins: 0, weeklyGrowth: 0, systemHealth: 98
      });
    } finally { setLoading(false); }
  }, []);

  const fetchDataForTab = useCallback(async (tab) => {
    if (tab === 'dashboard' || tab === 'analytics' || tab === 'settings') return;
    setTabLoading(true);
    try {
      let endpoint = '';
      if (tab === 'tutors') endpoint = `${API_CONFIG.BASE_URL}/api/admin/tutors/all`;
      else if (tab === 'students') endpoint = `${API_CONFIG.BASE_URL}/api/admin/students/all`;
      else if (tab === 'payments') endpoint = `${API_CONFIG.BASE_URL}/api/payment-verification/all`;
      else if (tab === 'resources') endpoint = `${API_CONFIG.BASE_URL}/api/admin/resources`;
      else if (tab === 'messages') endpoint = `${API_CONFIG.BASE_URL}/api/messages/admin/all`;

      if (endpoint) {
        const response = await axios.get(endpoint, { timeout: API_CONFIG.TIMEOUT });
       
        let responseData = response.data?.data || response.data?.conversations || response.data?.tutors || response.data?.students || response.data?.verifications || response.data?.payments || response.data?.resources || response.data?.messages || [];
        setData(Array.isArray(responseData) ? responseData : []);
      }
    } catch (error) {
      console.error(`Fetch Error (${tab}):`, error.message);
      setData([]);
      showToast(`⚠️ Backend unavailable for ${tab}`, 'warning');
    } finally { setTabLoading(false); }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/settings`, {
        timeout: API_CONFIG.TIMEOUT
      });
      if (res.data.settings) setSystemSettings(res.data.settings);
    } catch (e) {
      console.error('Settings load fail:', e.message);
     
      setSystemSettings({
        maintenanceMode: false,
        publicRegistration: true,
        apiCaching: true,
        emailNotifications: true,
        autoVerification: false
      });
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [growthRes, revenueRes] = await Promise.all([
        axios.get(`${API_CONFIG.BASE_URL}/api/analytics/growth`, { timeout: API_CONFIG.TIMEOUT }),
        axios.get(`${API_CONFIG.BASE_URL}/api/analytics/revenue`, { timeout: API_CONFIG.TIMEOUT })
      ]);

      setAnalyticsData({
        growth: growthRes.data?.data?.studentGrowth || [],
        revenueStreams: revenueRes.data?.streams || [],
        dailyRevenue: revenueRes.data?.daily || []
      });
    } catch (error) {
      console.error('Analytics fetch failed:', error.message);
     
      setAnalyticsData({
        growth: [],
        revenueStreams: [],
        dailyRevenue: []
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchSettings();
    fetchAnalytics();

    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode !== null ? savedMode === 'true' : prefersDark);

    const activityTypes = ['login', 'signup', 'payment', 'resource'];
    const names = ['Abebe', 'Challa', 'Solomon', 'Hirut', 'Marta', 'Kebede'];
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        user: names[Math.floor(Math.random() * names.length)],
        time: 'Just now'
      };
      setLiveActivity(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 15000);

    return () => clearInterval(interval);
  }, [navigate, fetchStats, fetchSettings]);

  useEffect(() => {
    setSelectedIDs([]);
    fetchDataForTab(activeTab);
  }, [activeTab, fetchDataForTab]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#1e293b';
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const updateSetting = async (key, value) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/api/admin/settings`, { settings: { [key]: value } }, {
        timeout: API_CONFIG.TIMEOUT
      });
      showToast(`⚙️ ${key} synchronized`);
    } catch (e) {
      console.error('Settings update failed:', e.message);
      showToast('❌ Sync fail - Backend unavailable', 'error');
    }
  };

  const handleVerifyTutor = async (id) => {
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/api/admin/tutors/${id}/verify`, {}, {
        timeout: API_CONFIG.TIMEOUT
      });
      showToast('✅ Tutor verified successfully!');
      fetchDataForTab('tutors');
      fetchStats();
    } catch (error) {
      console.error('Tutor verification failed:', error.message);
      showToast('❌ Verification failed - Backend unavailable', 'error');
    }
  };

  const handleGrantPremium = async (id) => {
    const months = window.prompt('Enter premium duration (months):', '1');
    if (!months) return;
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/api/admin/students/${id}/premium`, { months: parseInt(months) }, {
        timeout: API_CONFIG.TIMEOUT
      });
      showToast('🎉 Premium access deployed!');
      fetchDataForTab('students');
    } catch (error) {
      console.error('Premium grant failed:', error.message);
      showToast('❌ Premium deployment failed - Backend unavailable', 'error');
    }
  };

  const handleApprovePayment = async (id) => {
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/api/payment-verification/${id}/approve`, { adminNotes: 'Validation Complete' }, {
        timeout: API_CONFIG.TIMEOUT
      });
      showToast('💳 Fund recognized and approved!');
      fetchDataForTab('payments');
      fetchStats();
    } catch (error) {
      console.error('Payment approval failed:', error.message);
      showToast('❌ Validation failed - Backend unavailable', 'error');
    }
  };

  const handleRejectPayment = async (id) => {
    const reason = window.prompt('Rejection rationale:');
    if (!reason) return;
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/api/payment-verification/${id}/reject`, { adminNotes: reason }, {
        timeout: API_CONFIG.TIMEOUT
      });
      showToast('🚫 Transaction voided');
      fetchDataForTab('payments');
    } catch (error) {
      console.error('Payment rejection failed:', error.message);
      showToast('❌ Action interrupted - Backend unavailable', 'error');
    }
  };

  const handleBulkAuthorize = async () => {
    if (!window.confirm(`Authorize ${selectedIDs.length} entities?`)) return;
    try {
      const endpoint = activeTab === 'payments'
        ? `${API_CONFIG.BASE_URL}/api/payment-verification/bulk-approve`
        : `${API_CONFIG.BASE_URL}/api/admin/${activeTab}/bulk-verify`;

      await axios.put(endpoint, { ids: selectedIDs }, {
        timeout: API_CONFIG.TIMEOUT
      });
      showToast(`✅ ${selectedIDs.length} entities authorized!`);
      setSelectedIDs([]);
      fetchDataForTab(activeTab);
      fetchStats();
    } catch (error) {
      console.error('Bulk authorization failed:', error.message);
      showToast('❌ Bulk operation failed - Backend unavailable', 'error');
    }
  };

  const renderAnalytics = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {}
        <div className={`p-8 rounded-[30px] border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 Shadow-xl'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl flex items-center gap-3">
              <FaChartLine className="text-blue-500" /> User Growth (30 Days)
            </h3>
            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">+24%</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {Array.isArray(analyticsData.growth) && analyticsData.growth.length > 0 ? (
              analyticsData.growth.slice(-10).map((day, i) => {
                const max = Math.max(...analyticsData.growth.map(d => d.count), 1);
                const h = (day.count / max) * 100;
                return (
                  <div key={i} className="flex-1 group relative">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-1000 ${darkMode ? 'bg-blue-600/40 hover:bg-blue-500' : 'bg-blue-500/20 hover:bg-blue-500'}`}
                      style={{ height: `${Math.max(h, 5)}%` }}
                    ></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {new Date(day.date).toLocaleDateString()}: {day.count} Users
                    </div>
                  </div>
                );
              })
            ) : (
              [40, 65, 55, 80, 70, 95, 85, 110, 100, 130].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-1000 ${darkMode ? 'bg-blue-600/40 hover:bg-blue-500' : 'bg-blue-500/20 hover:bg-blue-500'}`}
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between mt-4 text-[10px] uppercase font-black tracking-widest text-slate-500">
            <span>{analyticsData.growth?.[0]?.date ? new Date(analyticsData.growth[0].date).toLocaleDateString() : 'Baseline'}</span>
            <span>Uplink Data Stream</span>
            <span>{analyticsData.growth?.length > 0 ? 'Today' : 'Real-time'}</span>
          </div>
        </div>

        {}
        <div className={`p-8 rounded-[30px] border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-xl'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl flex items-center gap-3">
              <FaDollarSign className="text-yellow-500" /> Revenue Stream
            </h3>
            <span className="text-xs text-slate-500 font-bold">Total: ETB 12,450</span>
          </div>
          <div className="space-y-6">
            {Array.isArray(analyticsData.revenueStreams) && analyticsData.revenueStreams.length > 0 ? (
              analyticsData.revenueStreams.map((item, i) => {
                const colors = ['blue', 'purple', 'green', 'indigo', 'pink'];
                const total = Array.isArray(analyticsData.revenueStreams) ? analyticsData.revenueStreams.reduce((acc, curr) => acc + Number(curr.total || 0), 0) : 0;
                const perc = total > 0 ? Math.round((Number(item.total || 0) / total) * 100) : 0;
                const colorClass = colors[i % colors.length];
                return (
                  <div key={item.payment_type || i}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="uppercase tracking-widest">{(item.payment_type || 'Unknown').replace(/_/g, ' ')}</span>
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>ETB {Number(item.total || 0).toLocaleString()} ({perc}%)</span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${perc}%`,
                          backgroundColor: colorClass === 'blue' ? '#3b82f6' :
                            colorClass === 'purple' ? '#a855f7' :
                              colorClass === 'green' ? '#22c55e' :
                                colorClass === 'indigo' ? '#6366f1' : '#ec4899'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              [
                { label: 'Tutor Subs', value: 65, color: 'blue', amount: '8.2k' },
                { label: 'Resource Sales', value: 25, color: 'purple', amount: '3.1k' },
                { label: 'Platform Fees', value: 10, color: 'green', amount: '1.1k' }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="uppercase tracking-widest">{item.label}</span>
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>ETB {item.amount} ({item.value}%)</span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className={`p-8 rounded-[40px] border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-2xl'}`}>
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
          <FaShieldAlt className="text-purple-500" /> Platform Control Center
        </h3>

        <div className="space-y-6">
          {[
            { id: 'maintenanceMode', icon: FaBan, label: 'System Maintenance Mode', desc: 'Lock the platform and display maintenance screen to users.', color: 'red' },
            { id: 'publicRegistration', icon: FaUsers, label: 'Public User Registration', desc: 'Allow new students and tutors to join the platform.', color: 'blue' },
            { id: 'apiCaching', icon: FaDatabase, label: 'Advanced Data Caching', desc: 'Improve server response times by caching heavy queries.', color: 'green' },
            { id: 'emailNotifications', icon: FaEnvelope, label: 'Global Email Dispatch', desc: 'Send automated alerts for payments and signups.', color: 'yellow' },
            { id: 'autoVerification', icon: FaCheckCircle, label: 'Auto-Tutor Trust Bridge', desc: 'Automatically verify tutors with verified credentials.', color: 'cyan' }
          ].map((s) => (
            <div key={s.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-900 group hover:scale-[1.01] transition-all">
              <div className="flex gap-6 items-center">
                <div className={`w-14 h-14 rounded-2xl bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-500`}>
                  {React.createElement(s.icon, { size: 24 })}
                </div>
                <div>
                  <p className="font-bold text-lg">{s.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">{s.desc}</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting(s.id, !systemSettings[s.id])}
                className={`w-14 h-8 rounded-full relative transition-all ${systemSettings[s.id] ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${systemSettings[s.id] ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`h-24 rounded-2xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
      ))}
    </div>
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: 'blue' },
    { id: 'tutors', label: 'Tutors', icon: FaChalkboardTeacher, color: 'green', badge: stats.pendingTutors },
    { id: 'students', label: 'Students', icon: FaGraduationCap, color: 'purple' },
    { id: 'payments', label: 'Finance', icon: FaMoneyCheckAlt, color: 'yellow', badge: stats.pendingPayments },
    { id: 'exams', label: 'Exam Management', icon: FaFilePdf, color: 'red' },
    { id: 'grade12', label: 'Grade 12 System', icon: FaUniversity, color: 'orange' },
    { id: 'resources', label: 'Resources', icon: FaBook, color: 'indigo' },
    { id: 'messages', label: 'Inbox', icon: FaComments, color: 'pink', badge: notifications },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine, color: 'cyan' },
    { id: 'settings', label: 'System Control', icon: FaCog, color: 'gray' }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="relative mb-8">
          <div className="w-24 h-24 border-8 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <FaRocket className="absolute inset-0 m-auto text-blue-500 text-3xl animate-bounce" />
        </div>
        <p className="font-black text-xl tracking-[0.3em] uppercase animate-pulse">Initializing Super Admin</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900'}`}>
      {}
      {message.text && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-[20px] shadow-2xl border-2 backdrop-blur-xl animate-slideDown ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          <p className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
            {message.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />} {message.text}
          </p>
        </div>
      )}

      {}
      <aside className={`fixed left-0 top-0 h-full ${sidebarOpen ? 'w-80' : 'w-24'} backdrop-blur-3xl border-r ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'} transition-all duration-500 z-50`}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg`}>
              <FaTerminal className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-black text-xs uppercase tracking-[0.3em]">Sentinel</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Protocol v4.2</p>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-xl border ${darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-100'} transition-all`}>
            {sidebarOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
          </button>
        </div>

        <nav className="p-4 mt-8 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${activeTab === item.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 opacity-60 hover:opacity-100'}`}
            >
              {React.createElement(item.icon, {
                size: 20,
                className: activeTab === item.id ? (darkMode ? 'text-slate-900' : 'text-white') : `text-${item.color}-500`
              })}
              {sidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              {item.badge > 0 && (
                <span className="absolute right-4 px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white dark:border-slate-900 animate-pulse">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-8">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 font-bold text-sm">
            <FaSignOutAlt /> {sidebarOpen && "Terminate Session"}
          </button>
        </div>
      </aside>

      {}
      <main className={`transition-all duration-500 ${sidebarOpen ? 'pl-80' : 'pl-24'} min-h-screen`}>
        {}
        <header className={`sticky top-0 z-40 px-12 py-6 backdrop-blur-xl border-b ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-white/50 border-slate-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-8">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Lookup global registry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-96 pl-12 pr-6 py-3 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} text-sm font-bold`}
              />
            </div>
            <div className="hidden xl:flex items-center gap-4 py-2 px-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <FaClock className="text-blue-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400">Node Time</span>
                <span className="text-xs font-black italic tracking-wider">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={toggleDarkMode} className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-yellow-400/10' : 'bg-white border-slate-100 text-blue-600 hover:bg-blue-600/10'}`}>
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <p className="font-black text-xs uppercase tracking-tighter">Super Admin Instance</p>
                <p className="text-[10px] text-slate-500 font-bold">Admin@System.Root</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5`}>
                <div className={`w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden`}>
                  <FaUser className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {}
        <section className="p-12 pb-24">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-12 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-8">
                  <div>
                    <h1 className="text-5xl font-black italic tracking-tighter mb-2 uppercase">Operational Control</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                      <FaGlobe className="animate-spin-slow" /> Synchronization Active
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'Network Population', value: stats.totalStudents, icon: FaUsers, color: 'blue', delta: '+12.5%' },
                    { label: 'Verified Faculty', value: stats.verifiedTutors, icon: FaChalkboardTeacher, color: 'green', delta: '+4.2%' },
                    { label: 'Settlement Liquidity', value: `ETB ${stats.totalRevenue.toLocaleString()}`, icon: FaDollarSign, color: 'yellow', delta: '+21.8%' },
                    { label: 'Core Integrity', value: `${stats.systemHealth}%`, icon: FaServer, color: 'cyan', delta: 'Nominal' }
                  ].map((stat, i) => (
                    <div key={i} className={`p-8 rounded-[40px] border relative overflow-hidden group hover:scale-105 transition-all duration-500 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div className={`inline-flex p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 mb-6`}>
                        {React.createElement(stat.icon, { size: 28 })}
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter mb-1">{stat.value}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{stat.label}</p>
                      <div className={`flex items-center gap-2 text-[10px] font-black ${stat.delta.includes('+') ? 'text-green-500' : 'text-blue-400'}`}>
                        {stat.delta.includes('+') ? <FaArrowUp /> : <FaShieldAlt />} {stat.delta} Evolution
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className={`p-8 rounded-[40px] border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-2xl shadow-blue-500/5'}`}>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8 text-slate-500 flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Rapid Task Matrix
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'tutors', label: 'Faculty Review', icon: FaCheckCircle, color: 'green' },
                        { id: 'payments', label: 'Ledger Audit', icon: FaDollarSign, color: 'yellow' },
                        { id: 'resources', label: 'Repository', icon: FaDatabase, color: 'indigo' },
                        { id: 'analytics', label: 'Data Hub', icon: FaChartBar, color: 'cyan' }
                      ].map(act => (
                        <button
                          key={act.label}
                          onClick={() => setActiveTab(act.id)}
                          className={`p-6 rounded-[30px] border border-transparent hover:border-${act.color}-500/20 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col items-center gap-4 transition-all hover:scale-105 group`}
                        >
                          <div className={`p-4 rounded-2xl bg-${act.color}-500/10 text-${act.color}-500 group-hover:scale-110 transition-transform`}>
                            {React.createElement(act.icon, { size: 22 })}
                          </div>
                          <span className="font-black text-[10px] uppercase tracking-widest">{act.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`p-8 rounded-[40px] border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-2xl shadow-purple-500/5'}`}>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8 text-slate-500 flex items-center justify-between">
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Real-time Uplink</div>
                      <span className="text-[8px] animate-pulse">Connection: Secure</span>
                    </h3>
                    <div className="space-y-4">
                      {Array.isArray(liveActivity) && liveActivity.length > 0 ? liveActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-100/50 dark:bg-slate-950/50 transition-all hover:scale-[1.02] border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.type === 'login' ? 'bg-green-500/10 text-green-500' : activity.type === 'payment' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                              {activity.type === 'login' ? <FaLockOpen /> : activity.type === 'payment' ? <FaDollarSign /> : <FaUser />}
                            </div>
                            <div>
                              <p className="font-bold text-sm tracking-tight">{activity.user} <span className="text-slate-500 font-medium">initiated {activity.type} pulse</span></p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.time}</p>
                            </div>
                          </div>
                          <FaChevronRight size={12} className="text-slate-300" />
                        </div>
                      )) : (
                        <div className="py-12 text-center opacity-30 italic text-sm">Waiting for incoming telemetry...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exams' && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Exam Management System</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Comprehensive Exam Creation & Management Portal</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Freshman Exams', value: '24', icon: FaUniversity, color: 'blue' },
                      { label: 'Grade 12 Exams', value: '18', icon: FaGraduationCap, color: 'purple' },
                      { label: 'GAT Tests', value: '12', icon: FaBook, color: 'green' },
                      { label: 'Exit Exams', value: '8', icon: FaSchool, color: 'red' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400`}>
                            {React.createElement(stat.icon)}
                          </div>
                          <span className="text-2xl font-bold">{stat.value}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Link to="/exam-management" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FaFilePdf /> Manage Exams
                    </Link>
                    <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                      <FaPlus /> Create New Exam
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'grade12' && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Grade 12 Payment System</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Student Payment Verification & Management</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Total Payments', value: 'ETB 45,000', icon: FaDollarSign, color: 'green' },
                      { label: 'Pending', value: '12', icon: FaClock, color: 'yellow' },
                      { label: 'Verified', value: '156', icon: FaCheckCircle, color: 'blue' },
                      { label: 'Active Students', value: '89', icon: FaGraduationCap, color: 'purple' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400`}>
                            <stat.icon />
                          </div>
                          <span className="text-2xl font-bold">{stat.value}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Link to="/grade12-payment-system" className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                      <FaCreditCard /> Payment Management
                    </Link>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FaDownload /> Export Reports
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}

            {}
            {!['dashboard', 'analytics', 'settings'].includes(activeTab) && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center bg-slate-900/5 dark:bg-white/5 p-8 rounded-[40px] border border-blue-500/10">
                  <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-1">{activeTab} Cluster</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Registry Segment Identification Matrix</p>
                  </div>
                  {activeTab === 'resources' && (
                    <Link to="/admin/upload-resource" className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-3xl shadow-2xl transition-all hover:scale-105 flex items-center gap-3 uppercase text-xs tracking-widest">
                      <FaPlus /> Deployment Interface
                    </Link>
                  )}
                </div>

                {tabLoading ? renderSkeleton() : (
                  <div className="space-y-6">
                    {filteredData.length > 0 ? filteredData.map((item, i) => (
                      <div key={i} className={`group p-8 rounded-[40px] border transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
                        <div className="flex flex-col lg:flex-row items-center gap-10">
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedIDs.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedIDs(prev => [...prev, item.id]);
                                else setSelectedIDs(prev => prev.filter(id => id !== item.id));
                              }}
                              className="w-8 h-8 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-transparent text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                            />
                          </div>

                          <div className="w-24 h-24 rounded-[35px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-inner overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => openModal(item)}>
                            {item.profile_photo || item.screenshot_path || item.payment_screenshot || item.activation_fee_screenshot || item.registration_payment_screenshot ? (
                              <img
                                src={`${API_CONFIG.BASE_URL}${item.profile_photo || item.screenshot_path || item.payment_screenshot || item.activation_fee_screenshot || item.registration_payment_screenshot}`}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                alt="Registry Asset"
                              />
                            ) : (
                              <FaUser size={32} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            )}
                          </div>

                          <div className="flex-1 text-center lg:text-left space-y-4">
                            <div>
                              <h3 className="text-2xl font-black tracking-tight mb-1 uppercase italic cursor-pointer hover:text-blue-500 transition-colors" onClick={() => openModal(item)}>
                                {activeTab === 'messages' ? `${item.student_name} ↔ ${item.tutor_name}` : (item.full_name || item.user_name || item.title)}
                              </h3>
                              <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">{activeTab === 'messages' ? `Inbound Stream: ${item.message_count} Packets` : (item.email || item.user_email || item.subject)}</p>
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                              {activeTab === 'tutors' && (
                                <>
                                  <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${item.is_verified ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}`}>
                                    {item.is_verified ? 'Authorized Identity' : 'Pending Authorization'}
                                  </span>
                                  {item.transaction_reference && (
                                    <span className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-2 border-slate-800 dark:border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2">
                                      <FaTerminal size={10} /> REF: {item.transaction_reference}
                                    </span>
                                  )}
                                </>
                              )}
                              {activeTab === 'students' && (
                                <>
                                  <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${item.is_premium ? 'bg-purple-500/10 border-purple-500/30 text-purple-500' : 'bg-slate-500/10 border-slate-500/30 text-slate-500'}`}>
                                    {item.is_premium ? 'Premium Tier' : 'Standard Tier'}
                                  </span>
                                  {item.transaction_reference && (
                                    <span className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-2 border-slate-800 dark:border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2">
                                      <FaTerminal size={10} /> REF: {item.transaction_reference}
                                    </span>
                                  )}
                                </>
                              )}
                              {activeTab === 'payments' && (
                                <>
                                  <span className="px-5 py-2 bg-blue-500/10 border-2 border-blue-500/30 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-2xl">Value: ETB {item.amount || 0}</span>
                                  <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${item.status === 'approved' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}`}>Registry: {item.status}</span>
                                  {item.transaction_reference && (
                                    <span className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-2 border-slate-800 dark:border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2">
                                      <FaTerminal size={10} /> REF: {item.transaction_reference}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-4">
                            {activeTab === 'tutors' && !item.is_verified && (
                              <button onClick={() => handleVerifyTutor(item.id)} className="p-5 rounded-3xl bg-green-500 text-white shadow-xl shadow-green-500/20 hover:scale-110 transition-all"><FaCheck /></button>
                            )}
                            {activeTab === 'students' && !item.is_premium && (
                              <button onClick={() => handleGrantPremium(item.id)} className="p-5 rounded-3xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-110 transition-all"><FaCrown /></button>
                            )}
                            {activeTab === 'payments' && item.status === 'pending' && (
                              <div className="flex gap-3">
                                <button onClick={() => handleApprovePayment(item.id)} className="px-8 py-4 bg-blue-600 text-white font-black rounded-3xl shadow-lg hover:scale-105 transition-all text-[10px] uppercase tracking-widest">Verify Ledger</button>
                                <button onClick={() => handleRejectPayment(item.id)} className="px-8 py-4 bg-slate-200 dark:bg-slate-800 text-slate-500 font-black rounded-3xl hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase tracking-widest">Void</button>
                              </div>
                            )}
                            <button onClick={() => openModal(item)} className="p-5 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:scale-110 transition-all"><FaEye /></button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="py-32 text-center border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[50px] opacity-40">
                        <FaDatabase size={48} className="mx-auto mb-6" />
                        <p className="font-black text-xl uppercase tracking-widest">No Sector Matching Query</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {}
          {selectedIDs.length > 0 && (
            <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] px-10 py-6 rounded-full border-2 backdrop-blur-3xl shadow-3xl animate-slideUp flex items-center gap-10 ${darkMode ? 'bg-slate-900/90 border-blue-500/30' : 'bg-white/90 border-blue-500/30'}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-xs">{selectedIDs.length}</div>
                <p className="font-black text-xs uppercase tracking-widest">Selected Entities</p>
              </div>
              <div className="h-8 w-0.5 bg-slate-500/20"></div>
              <div className="flex gap-4">
                <button
                  onClick={handleBulkAuthorize}
                  className="px-8 py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg"
                >
                  Bulk Authorize
                </button>
                <button
                  onClick={() => setSelectedIDs([])}
                  className="px-8 py-3 border-2 border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-fadeIn" onClick={closeModal}></div>
          <div className="bg-white dark:bg-slate-900 rounded-[60px] w-full max-w-5xl max-h-[85vh] overflow-y-auto relative z-10 shadow-3xl animate-slideUp border border-white/10">
            <button onClick={closeModal} className="absolute top-10 right-10 p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-all"><FaTimes size={24} /></button>

            <div className="p-16">
              <div className="flex flex-col lg:flex-row gap-16 items-start mb-16">
                <div className="w-64 h-64 rounded-[50px] bg-slate-100 dark:bg-slate-800 border-8 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex-shrink-0">
                  {selectedItem.profile_photo || selectedItem.screenshot_path || selectedItem.payment_screenshot || selectedItem.activation_fee_screenshot || selectedItem.registration_payment_screenshot ? (
                    <img src={`${API_CONFIG.BASE_URL}${selectedItem.profile_photo || selectedItem.screenshot_path || selectedItem.payment_screenshot || selectedItem.activation_fee_screenshot || selectedItem.registration_payment_screenshot}`} className="w-full h-full object-cover" alt="Detail" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 opacity-20"><FaUser size={120} /></div>
                  )}
                </div>
                <div className="flex-1 pt-6">
                  <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-4 leading-none">
                    {selectedItem.full_name || selectedItem.user_name || selectedItem.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="px-6 py-2 bg-blue-600 text-white font-black text-xs rounded-2xl uppercase tracking-[0.2em]">ID: #{selectedItem.id}</span>
                    <span className="text-xl font-bold text-slate-500">{selectedItem.email || selectedItem.user_email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8 border-l-4 border-blue-600 pl-4">Registry Specifications</h4>
                  
                  {activeTab === 'messages' ? (
                    <div className="space-y-6">
                      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Subject Connection</p>
                        <p className="font-bold underline decoration-blue-500 decoration-2">{selectedItem.student_name} ↔ {selectedItem.tutor_name}</p>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 rounded-[35px] border-2 border-slate-100 dark:border-slate-900">
                       {messagesLoading ? (
                         <div className="py-20 text-center animate-pulse font-black uppercase text-xs">Uplinking to chat archive...</div>
                       ) : conversationMessages.length > 0 ? conversationMessages.map((m, i) => (
                         <div key={i} className={`flex flex-col ${m.sender_type === 'admin' ? 'items-end' : 'items-start'}`}>
                           <div className={`p-4 rounded-3xl max-w-[80%] ${m.sender_type === 'admin' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-200 dark:bg-slate-800 rounded-tl-none'}`}>
                             <p className="text-xs font-medium">{m.content || m.message}</p>
                           </div>
                           <span className="text-[8px] font-black uppercase text-slate-400 mt-1 px-2">{m.sender_name} • {new Date(m.created_at).toLocaleTimeString()}</span>
                         </div>
                       )) : <div className="py-20 text-center opacity-30 italic">No communication logs detected.</div>}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(selectedItem).map(([key, value]) => {
                        if (['id', 'password_hash', 'profile_photo', 'screenshot_path', 'full_name', 'user_name', 'title', 'email', 'user_email', 'payment_screenshot', 'activation_fee_screenshot', 'registration_payment_screenshot'].includes(key)) return null;
                        if (typeof value === 'object') return null;
                        return (
                          <div key={key} className="flex justify-between items-center group">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">{key.replace(/_/g, ' ')}</span>
                            <div className="h-0.5 flex-1 mx-4 bg-slate-100 dark:bg-slate-800 opacity-30"></div>
                            <span className="text-sm font-black dark:text-slate-100 uppercase italic">{String(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {(selectedItem.screenshot_path || selectedItem.payment_screenshot || selectedItem.registration_payment_screenshot || selectedItem.premium_payment_screenshot || selectedItem.activation_fee_screenshot) && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8 border-l-4 border-purple-600 pl-4">Optical Verification Data</h4>
                    <div className="rounded-[40px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-black group relative cursor-zoom-in">
                      <img
                        src={`${API_CONFIG.BASE_URL}${selectedItem.screenshot_path || selectedItem.payment_screenshot || selectedItem.registration_payment_screenshot || selectedItem.premium_payment_screenshot || selectedItem.activation_fee_screenshot}`}
                        className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                        alt="Optical Evidence"
                      />
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FaExpand className="text-white text-4xl" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-16 pt-16 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-6">
                <button onClick={closeModal} className="px-12 py-6 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black rounded-3xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase text-xs tracking-widest">Acknowledge</button>
                <button className="px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl hover:scale-105 transition-all shadow-2xl uppercase text-xs tracking-widest">Execute Override</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translate(-50%, -50px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideDown { animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
