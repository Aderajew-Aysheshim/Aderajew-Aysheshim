import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaGraduationCap, FaChalkboardTeacher,
  FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes, FaBell, FaEnvelope,
  FaRocket, FaChevronDown, FaSearch, FaHome, FaClipboardList,
  FaInfoCircle, FaSignInAlt, FaUserGraduate, FaUserCircle, FaShieldAlt
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

const NavbarPro = () => {
  const { isAuthenticated, userType, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationsDropdown, setNotificationsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [isRegOpen, setIsRegOpen] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkReg = async () => {
      try {
        // Import API config
        const { API_CONFIG, isBackendAvailable } = await import('../utils/apiConfig');

        // Check if backend is available first
        const backendAvailable = await isBackendAvailable();
        if (!backendAvailable) {
          if (isMounted) {
            console.log('Backend not available - using default registration settings');
          }
          return;
        }

        const res = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/settings/public`, {
          timeout: API_CONFIG.TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        });

        if (isMounted && res.data?.settings?.publicRegistration === false) {
          setIsRegOpen(false);
        }
      } catch (e) {
        if (isMounted) {
          console.error('Reg check fail - Backend server may not be running');
        }
      }
    };

    const timer = setTimeout(checkReg, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdown && !event.target.closest('.profile-dropdown')) {
        setProfileDropdown(false);
      }
      if (notificationsDropdown && !event.target.closest('.notifications-dropdown')) {
        setNotificationsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdown, notificationsDropdown]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome className="w-3.5 h-3.5" /> },
    { path: '/tutors', label: 'Find Tutors', icon: <FaUserGraduate className="w-3.5 h-3.5" /> },
    { path: '/tutor-registration', label: 'Become Tutor', icon: <FaChalkboardTeacher className="w-3.5 h-3.5" /> },
    { path: '/exams', label: 'Exams', icon: <FaClipboardList className="w-3.5 h-3.5" /> },
    { path: '/grade12-exams', label: 'G-12', icon: <FaGraduationCap className="w-3.5 h-3.5" /> },
    { path: '/about', label: 'About', icon: <FaInfoCircle className="w-3.5 h-3.5" /> },
    { path: '/contact', label: 'Contact', icon: <FaEnvelope className="w-3.5 h-3.5" /> },
  ];

  const notifications = [
    { id: 1, text: 'New course available: Advanced Mathematics', time: '2 min ago', read: false },
    { id: 2, text: 'Your tutor request was accepted', time: '1 hour ago', read: false },
    { id: 3, text: 'Payment received for premium subscription', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${scrolled
        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl py-2 border-b border-gray-200/50 dark:border-slate-800/50 shadow-lg shadow-gray-900/10 dark:shadow-black/20'
        : 'bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-blue-800/95 backdrop-blur-xl py-2.5 border-b border-white/10 shadow-xl shadow-black/20'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">

            {/* Logo - Left Side */}
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 blur-lg opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
                <div className="relative w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                  A
                </div>
                <img
                  src="/logo.jpg"
                  alt="AstraETX Logo"
                  className="absolute inset-0 w-8 h-8 rounded-lg transition-all duration-300 group-hover:scale-110 drop-shadow-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-black tracking-tight transition-colors leading-none ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                  }`}>
                  AstraETX
                </span>
                <span className={`text-[10px] font-semibold tracking-wide transition-colors ${scrolled ? 'text-blue-600' : 'text-blue-300'
                  }`}>
                  Education Excellence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center space-x-1 mx-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 relative group ${isActive(link.path)
                    ? scrolled
                      ? 'text-blue-600 bg-blue-50 shadow-sm'
                      : 'text-blue-300 bg-blue-900/30 shadow-sm'
                    : scrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 shrink-0">

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden xl:flex items-center">
                <div className="relative">
                  <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 ${scrolled ? 'text-gray-400' : 'text-gray-300'
                    }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`pl-9 pr-3 py-1.5 rounded-lg text-xs transition-all duration-200 w-32 focus:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 ${scrolled
                      ? 'bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 border border-gray-200 dark:border-slate-800'
                      : 'bg-white/20 text-white placeholder:text-gray-300 backdrop-blur-sm border border-white/20'
                      }`}
                  />
                </div>
              </form>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-all duration-200 ${scrolled
                  ? 'bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/20'
                  }`}
              >
                {isDark ? <FaSun className="w-3.5 h-3.5" /> : <FaMoon className="w-3.5 h-3.5" />}
              </button>

              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative notifications-dropdown">
                  <button
                    onClick={() => setNotificationsDropdown(!notificationsDropdown)}
                    className={`relative p-2 rounded-lg transition-all duration-200 ${scrolled
                      ? 'bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/20'
                      }`}
                  >
                    <FaBell className="w-3.5 h-3.5" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-[10px] text-white font-bold">{unreadCount}</span>
                      </div>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform origin-top-right transition-all">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-slate-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                        <p className="text-xs text-gray-600 dark:text-slate-400">{unreadCount} unread</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''
                              }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'
                                }`}></div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-900">{notification.text}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 bg-gray-50 border-t border-gray-200">
                        <button className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium py-1">
                          View all
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 border ${scrolled
                      ? 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20'
                      }`}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {userType?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className={`text-xs font-bold hidden sm:block ${scrolled ? 'text-gray-900' : 'text-white'
                      }`}>
                      {userType?.charAt(0).toUpperCase() + userType?.slice(1) || 'User'}
                    </span>
                    <FaChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''
                      } ${scrolled ? 'text-gray-600' : 'text-gray-300'}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform origin-top-right">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {userType?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 capitalize text-sm">{userType} Account</div>
                            <div className="text-xs text-gray-600">Premium Member</div>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={userType === 'tutor' ? '/tutor-dashboard' : '/dashboard'}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <FaRocket className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-gray-800 font-medium text-xs">Dashboard</span>
                        </Link>

                        <Link
                          to="/messages"
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <FaEnvelope className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-gray-800 font-medium text-xs">Messages</span>
                        </Link>

                        <Link
                          to={userType === 'tutor' ? '/tutor-profile' : '/student-profile'}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <FaUserCircle className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-gray-800 font-medium text-xs">Profile</span>
                        </Link>

                        {userType === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          >
                            <FaShieldAlt className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-gray-800 font-medium text-xs">Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-200 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                        >
                          <FaSignOutAlt className="w-3.5 h-3.5" />
                          <span className="font-medium text-xs">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth Buttons */
                <div className="hidden lg:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 border flex items-center space-x-1.5 ${scrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-200'
                      : 'text-white hover:text-white hover:bg-white/10 border-white/20'
                      }`}
                  >
                    <FaSignInAlt className="w-3 h-3" />
                    <span>Sign In</span>
                  </Link>
                  {isRegOpen && (
                    <Link
                      to="/get-started"
                      className="px-4 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg flex items-center space-x-1.5"
                    >
                      <FaRocket className="w-3 h-3" />
                      <span>Get Started</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden p-2 rounded-lg transition-all duration-200 border ${isOpen
                  ? 'bg-blue-600 text-white border-blue-600'
                  : scrolled
                    ? 'bg-gray-100 text-gray-600 border-gray-200'
                    : 'bg-white/20 text-white border-white/20'
                  }`}
              >
                {isOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[999] bg-white dark:bg-slate-950 lg:bg-transparent transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}>
        <div className="h-full flex flex-col pt-20 pb-6 px-4">
          <div className="flex items-center justify-between mb-6 px-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Menu</h3>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {isDark ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive(link.path)
                  ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 font-black'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {userType?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white capitalize text-sm">{userType} Account</div>
                    <div className="text-xs text-gray-600 dark:text-slate-400">Premium Member</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={userType === 'tutor' ? '/tutor-dashboard' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-medium"
                  >
                    <FaRocket /> <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium"
                  >
                    <FaSignOutAlt /> <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {isRegOpen && (
                  <Link
                    to="/get-started"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center font-medium rounded-xl transition-all hover:shadow-lg flex items-center justify-center space-x-2 text-sm"
                  >
                    <FaRocket className="w-4 h-4" />
                    <span>Get Started</span>
                  </Link>
                )}
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-center font-medium rounded-xl transition-colors hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center space-x-2 text-sm"
                >
                  <FaSignInAlt className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className={`transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'
        }`}></div>
    </>
  );
};

export default NavbarPro;
