import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiMessageCircle, FiUser, FiLogOut, FiMenu, FiX, FiHome,
  FiUsers, FiAward, FiChevronDown, FiUserPlus, FiInfo, FiMail,
  FiBell, FiMonitor, FiGlobe
} from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FiHome className="w-4 h-4" /> },
    { path: '/tutors', label: 'Find Tutors', icon: <FiUsers className="w-4 h-4" /> },
    { path: '/exams', label: 'Exams', icon: <FiAward className="w-4 h-4" /> },
    { path: '/register/tutor', label: 'Become a Tutor', icon: <FiUserPlus className="w-4 h-4" /> },
    { path: '/about', label: 'About', icon: <FiInfo className="w-4 h-4" /> },
    { path: '/contact', label: 'Contact', icon: <FiMail className="w-4 h-4" /> },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled
      ? 'bg-white/98 backdrop-blur-xl py-3 border-b border-slate-200/50 shadow-lg shadow-slate-900/5'
      : 'bg-slate-900/90 backdrop-blur-xl py-6 border-b border-white/10 shadow-lg shadow-black/20'
      }`}>
      <div className="container-fluid">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative group ${isActive(link.path)
                  ? scrolled
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-blue-300 bg-blue-900/30 shadow-sm'
                  : scrolled
                    ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {isActive(link.path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Login/Register Buttons - Replaced Search */}
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className={`px-6 py-2 rounded-xl font-semibold transition-all border ${scrolled
                    ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50 border-slate-200'
                    : 'text-white hover:text-white hover:bg-white/10 border-white/20'
                    }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${scrolled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Notifications */}
            {isLoggedIn && (
              <button className={`relative p-3 rounded-xl transition-all ${scrolled
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 backdrop-blur-sm border border-white/20'
                }`}>
                <FiBell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </button>
            )}

            {/* User Menu or Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative group/user">
                <button className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all border ${scrolled
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                  : 'bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm border-white/20'
                  }`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {userType?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className={`text-sm font-semibold ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                    {userType?.charAt(0).toUpperCase() + userType?.slice(1) || 'User'}
                  </span>
                  <FiChevronDown className={`w-4 h-4 transition-transform group-hover/user:rotate-180 ${scrolled ? 'text-slate-600' : 'text-slate-300'
                    }`} />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 translate-y-2 group-hover/user:translate-y-0 z-[110]">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {userType?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Welcome back!</div>
                          <div className="text-sm text-slate-600 capitalize">{userType} Account</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        to={userType === 'tutor' ? '/tutor-dashboard' : '/dashboard'}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <FiMonitor className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-slate-900">Dashboard</span>
                      </Link>

                      <Link
                        to="/messages"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <FiMessageCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-slate-900">Messages</span>
                        <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-bold">2</span>
                      </Link>

                      <Link
                        to={userType === 'tutor' ? '/tutor-profile' : '/student-profile'}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <FiUser className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-slate-900">Profile</span>
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <FiSettings className="w-5 h-5 text-slate-500" />
                        <span className="font-semibold text-slate-900">Settings</span>
                      </Link>

                      {userType === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <FaShieldAlt className="w-5 h-5 text-red-500" />
                          <span className="font-semibold text-slate-900">Admin Panel</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-200 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-all text-red-600"
                      >
                        <FiLogOut className="w-5 h-5" />
                        <span className="font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-6 py-2 rounded-xl font-semibold transition-all border ${scrolled
                    ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50 border-slate-200'
                    : 'text-white hover:text-white hover:bg-white/10 border-white/20'
                    }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${scrolled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Logo - Moved to Right */}
          <Link to="/" className="flex items-center space-x-3 lg:mr-16 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold relative z-10 group-hover:scale-110 transition-transform shadow-lg">
                <FiGlobe />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-white'
                }`}>
                TutorHub
              </span>
              <span className={`text-xs font-semibold tracking-wider transition-colors ${scrolled ? 'text-blue-600' : 'text-blue-300'
                }`}>
                World-Class Learning
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-3 rounded-xl transition-all border ${isOpen
                ? 'bg-blue-600 text-white border-blue-600'
                : scrolled
                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                  : 'bg-slate-800/50 text-slate-300 backdrop-blur-sm border-white/20'
                }`}
            >
              {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[200] bg-white transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}>
        <div className="h-full flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            {/* Mobile Logo */}
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold relative z-10 group-hover:scale-110 transition-transform shadow-lg">
                  <FiGlobe />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900">TutorHub</span>
                <span className="text-xs font-semibold tracking-wider text-blue-600">World-Class Learning</span>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl hover:bg-slate-100 transition-all"
            >
              <FiX className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all ${isActive(link.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {link.icon}
                  <span className="font-semibold text-lg">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile User Section */}
            {isLoggedIn && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {userType?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Welcome back!</div>
                    <div className="text-sm text-slate-600 capitalize">{userType} Account</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={userType === 'tutor' ? '/tutor-dashboard' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <FiMonitor className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-slate-900">Dashboard</span>
                  </Link>

                  <Link
                    to="/messages"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <FiMessageCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-slate-900">Messages</span>
                  </Link>

                  <Link
                    to={userType === 'tutor' ? '/tutor-profile' : '/student-profile'}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <FiUser className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold text-slate-900">Profile</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Auth Actions */}
          <div className="p-6 border-t border-slate-200">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-red-50 text-red-600 rounded-xl font-semibold transition-all hover:bg-red-100"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center font-bold rounded-xl transition-all hover:shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 bg-slate-100 text-slate-600 text-center font-semibold rounded-xl transition-all hover:bg-slate-200"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
