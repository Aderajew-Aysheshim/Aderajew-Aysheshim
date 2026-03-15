import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaGraduationCap, FaCrown, FaCalculator, FaAtom, FaQuoteLeft,
  FaRocket, FaTrophy, FaBolt
} from 'react-icons/fa';
import {
  FiArrowRight, FiTarget, FiAward,
  FiGrid, FiLayers, FiSend, FiPhone, FiShield, FiBookOpen, FiCode, FiMonitor, FiGlobe, FiUsers, FiTrendingUp, FiStar, FiCheckCircle
} from 'react-icons/fi';


const testimonials = [
  {
    name: 'Bethlehem Tadesse',
    role: 'Software Engineering',
    content: 'TutorHub transformed my study habits. Achieving a 4.0 GPA at AASTU felt natural with these resources and personalized learning paths.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23667eea" width="100" height="100"/%3E%3Ctext fill="white" font-size="50" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EBT%3C/text%3E%3C/svg%3E',
    score: '4.0 GPA',
    rating: 5
  },
  {
    name: 'Dawit Abraham',
    role: 'Civil Engineering',
    content: 'The Exit Exam preparation module is industry-standard. I passed with top marks nationally thanks to the adaptive practice tests.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f56565" width="100" height="100"/%3E%3Ctext fill="white" font-size="50" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EDA%3C/text%3E%3C/svg%3E',
    score: '92% Score',
    rating: 5
  },
  {
    name: 'Sara Mohammed',
    role: 'Medicine',
    content: 'The expert tutors helped me understand complex concepts. Now I\'m in my dream medical school with a full scholarship!',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%2348bb78" width="100" height="100"/%3E%3Ctext fill="white" font-size="50" x="50%" y="50%" text-anchor="middle" dy=".3em"%3ESM%3C/text%3E%3C/svg%3E',
    score: 'Full Scholarship',
    rating: 5
  }
];

const features = [
  {
    icon: <FiShield className="w-8 h-8" />,
    title: 'Expert Tutors',
    description: 'Connect with industry-vetted professionals from top universities with smart matching.',
    tag: 'VERIFIED',
    color: 'from-blue-600 via-blue-500 to-sky-500',
    link: '/tutors',
    stats: '2.5k+ Tutors',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)'
  },
  {
    icon: <FiBookOpen className="w-8 h-8" />,
    title: 'Resource Hub',
    description: 'Access the largest archive of engineering and academic materials with smart search.',
    tag: 'PREMIUM',
    color: 'from-sky-500 via-blue-600 to-blue-700',
    link: '/resources',
    stats: '50k+ Resources',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)'
  },
  {
    icon: <FaGraduationCap className="w-8 h-8" />,
    title: 'Exam Mastery',
    description: 'Specialized preparation for NGAT, Exit Exams, and Grade 12 with adaptive learning.',
    tag: 'EXAM PREP',
    color: 'from-orange-500 via-red-600 to-pink-600',
    link: '/exams',
    stats: '99.4% Success',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
];

const subjects = [
  { name: 'Computer Science', icon: <FiCode />, count: '245+ Projects', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%230066cc" width="400" height="300"/%3E%3Ctext fill="white" font-size="30" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EComputer Science%3C/text%3E%3C/svg%3E', color: 'from-blue-500 to-cyan-500' },
  { name: 'Engineering', icon: <FiMonitor />, count: '189+ Courses', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%230ea5e9" width="400" height="300"/%3E%3Ctext fill="white" font-size="30" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EEngineering%3C/text%3E%3C/svg%3E', color: 'from-sky-500 to-blue-600' },
  { name: 'Mathematics', icon: <FaCalculator />, count: '500+ Exams', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%2300aa44" width="400" height="300"/%3E%3Ctext fill="white" font-size="30" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EMathematics%3C/text%3E%3C/svg%3E', color: 'from-green-500 to-emerald-500' },
  { name: 'Pure Sciences', icon: <FaAtom />, count: '120+ Labs', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ff6600" width="400" height="300"/%3E%3Ctext fill="white" font-size="30" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EPure Sciences%3C/text%3E%3C/svg%3E', color: 'from-orange-500 to-red-500' }
];

const Home = () => {
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-200 text-slate-900 dark:text-slate-50 overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mouse Follower */}
      <div
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none z-50 mix-blend-screen opacity-50 transition-transform duration-100"
        style={{
          left: `${mousePosition.x - 12}px`,
          top: `${mousePosition.y - 12}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8 min-h-[50vh] sm:min-h-[60vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-28 h-28 sm:w-36 sm:h-36 lg:w-56 lg:h-56 bg-blue-400/5 dark:bg-blue-300/10 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 bg-blue-300/5 dark:bg-blue-200/5 rounded-full blur-2xl animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className={`${isVisible.hero ? 'animate-fadeIn' : 'opacity-0'} text-center lg:text-left`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-black uppercase tracking-widest mb-4 sm:mb-6 shadow-lg shadow-blue-500/10">
              <FaBolt className="text-yellow-500 animate-pulse" /> <span className="hidden sm:inline">The Future of Learning</span><span className="sm:hidden">Future Learning</span> <FaRocket className="animate-bounce" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] sm:leading-[0.85] tracking-tighter text-slate-950 dark:text-white mb-4 sm:mb-6">
              SUPER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 via-sky-500 to-blue-700 bg-300% animate-gradient">EDUCATION</span> <br />
              FOR ALL.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              <span className="font-black text-blue-600 dark:text-blue-400">AstraETX</span> is Ethiopia's modern learning platform, connecting students with expert tutors online and in person, making education accessible, interactive, and effective for everyone.
            </p>
            <div className="flex flex-col items-center lg:items-start gap-4 pt-4">
              {/* Tutor Actions (Now Above) */}
              <div className="flex flex-wrap gap-4 w-full justify-center lg:justify-start">
                <button
                  onClick={() => document.getElementById('tutor-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[45deg]" />
                  <FiGlobe className="text-xl" /> FIND ONLINE TUTOR
                </button>
                <button
                  onClick={() => document.getElementById('tutor-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-8 py-3.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:from-green-700 hover:to-teal-700 transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[45deg]" />
                  <FiTarget className="text-xl" /> PHYSICAL TUTOR
                </button>
              </div>

              {/* Secondary Actions (Now Below) */}
              <div className="flex gap-4 w-full justify-center lg:justify-start mt-2">
                <Link to={isRegOpen ? "/register" : "/courses"} className="group px-6 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                  GET STARTED <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/exams" className="group px-6 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                  <FiTarget className="group-hover:rotate-180 transition-transform duration-500" /> EXAM HUBS
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {[
                { num: '50K+', label: 'Students', icon: <FiUsers /> },
                { num: '2.5K+', label: 'Tutors', icon: <FiShield /> },
                { num: '99.4%', label: 'Success', icon: <FiAward /> }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1 transition-colors">{stat.num}</div>
                  <div className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative ${isVisible.hero ? 'animate-fadeIn' : 'opacity-0'} mt-8 lg:mt-0 shadow-2xl dark:shadow-blue-500/10`} style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] overflow-hidden shadow-xl border-[4px] sm:border-[6px] lg:border-[8px] border-white dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800 aspect-square lg:aspect-[4/5] group transition-all duration-300">
              <img
                src="/hero.jpeg"
                alt="Students Studying"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23e0e7ff' width='400' height='500'/%3E%3Ctext fill='%234338ca' font-size='25' x='50%' y='40%' text-anchor='middle' dy='.3em'%3EStudents%3C/text%3E%3Ctext fill='%234338ca' font-size='25' x='50%' y='50%' text-anchor='middle' dy='.3em'%3EStudying%3C/text%3E%3Ctext fill='%234338ca' font-size='25' x='50%' y='60%' text-anchor='middle' dy='.3em'%3ETogether%3C/text%3E%3C/svg%3E";
                }}
              />
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {/* Enhanced Floating UI Elements */}
            <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-[16px] sm:rounded-[24px] shadow-xl border border-slate-100 dark:border-slate-800 animate-bounce-slow group-hover:scale-110 transition-all">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg text-sm sm:text-base">4.0</div>
                <div>
                  <p className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-white uppercase transition-colors">Target GPA</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 italic transition-colors">Excellence</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-gradient-to-br from-indigo-600 to-purple-600 p-3 sm:p-4 rounded-[16px] sm:rounded-[24px] shadow-xl text-white animate-pulse group-hover:scale-110 transition-transform">
              <FaCrown size={16} className="sm:size-20 mb-1" />
              <p className="text-sm sm:text-lg font-black italic">PRO</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BAR --- */}
      <section className="py-8 border-y border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-8 lg:gap-16 opacity-40 dark:opacity-60 grayscale dark:grayscale-0">
          <div className="h-8 w-32 bg-slate-300 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-400 transition-colors">AAU</div>
          <div className="text-lg font-black text-slate-400 dark:text-slate-500 tracking-tighter transition-colors">AASTU PREP</div>
          <div className="text-lg font-black text-slate-400 dark:text-slate-500 tracking-tighter transition-colors">MINISTRY APPROVED</div>
          <div className="text-lg font-black text-slate-400 dark:text-slate-500 tracking-tighter transition-colors">ETHIO-TECH HUB</div>
        </div>
      </section>

      {/* --- FEATURES MATRIX --- */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-sky-100 opacity-50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-700 text-xs font-black uppercase tracking-widest mb-6">
              <FiLayers /> NEXT-GEN FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
              SMARTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">TOOLS.</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              We've engineered a platform that anticipates your academic needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Link to={feature.link} key={idx} className={`group relative bg-white p-8 rounded-[30px] border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${isVisible.features ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: feature.gradient }} />
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-indigo-200/50`}>
                    {feature.icon}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{feature.stats}</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6 text-sm">{feature.description}</p>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                    EXPLORE <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- SUBJECT SHOWCASE --- */}
      <section id="subjects" className="py-20 px-6 bg-slate-100 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 overflow-hidden relative transition-colors duration-300">
        {/* Enhanced Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-400/5 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-300/5 blur-[100px] rounded-full animate-pulse delay-500" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-6 transition-colors duration-300">
                <FiGrid /> POPULAR SUBJECTS
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 uppercase">
                TOP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">SUBJECTS.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium italic">"The core of your future career starts here."</p>
            </div>
            <Link to="/courses" className="group inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:shadow-xl">
              VIEW CATALOG <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((sub, idx) => (
              <div key={idx} className="group relative rounded-[30px] overflow-hidden aspect-[4/5] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <img src={sub.image} alt={sub.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${sub.color.split(' ')[0]?.replace('from-', '') || 'blue'} 0%, ${sub.color.split(' ')[2]?.replace('to-', '') || 'purple'} 100%)` }} />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-3 border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {sub.icon}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-1 group-hover:text-blue-400 transition-colors">{sub.name}</h3>
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{sub.count}</p>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <span className="text-xs font-black uppercase tracking-widest">Explore</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (SMART SECTION) --- */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-2xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/10 dark:to-emerald-900/10 rounded-full blur-2xl opacity-50" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-6">
              <FiCheckCircle /> SUCCESS STORIES
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 uppercase leading-tight">
              REAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">VOICES.</span><br />REAL RESULTS.
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Student Satisfaction', val: '99.4%', icon: <FiStar className="text-yellow-500" /> },
                { label: 'National Rankers', val: '500+', icon: <FaTrophy className="text-purple-500" /> },
                { label: 'Expert Tutors', val: '2.5k+', icon: <FiShield className="text-blue-500" /> }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 group hover:bg-slate-50 dark:hover:bg-slate-900 -mx-3 px-3 py-2 rounded-lg transition-all">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div key={currentTestimonial} className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 p-8 rounded-[30px] border border-slate-100 dark:border-slate-800 relative group overflow-hidden shadow-lg transition-all duration-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-700/20 dark:to-purple-700/20 rounded-full blur-xl opacity-30" />
              <FaQuoteLeft className="absolute -top-3 -right-3 text-slate-200 dark:text-slate-700 text-6xl opacity-30 transform -rotate-12 transition-transform group-hover:rotate-0" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} className="w-16 h-16 rounded-2xl object-cover ring-3 ring-white dark:ring-slate-800 shadow-lg shadow-slate-200 dark:shadow-none" />
                  <div className="flex-1">
                    <p className="font-black text-slate-900 dark:text-white text-lg mb-1">{testimonials[currentTestimonial].name}</p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{testimonials[currentTestimonial].role}</p>
                    <div className="flex gap-1">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <FiStar key={i} className="text-yellow-500 fill-current text-sm" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic mb-6">"{testimonials[currentTestimonial].content}"</p>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-green-600 dark:text-green-400 text-xs font-black ring-1 ring-slate-200/50 dark:ring-white/10">
                    <FiCheckCircle /> {testimonials[currentTestimonial].score}
                  </div>
                  <div className="flex gap-1">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentTestimonial(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${currentTestimonial === idx ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA CALL --- */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-sky-100" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full blur-2xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-br from-blue-200 to-sky-200 rounded-full blur-2xl opacity-30 animate-pulse delay-1000" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-[50px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-[0_20px_60px_-10px_rgba(37,99,235,0.3)]">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black uppercase tracking-widest mb-8">
                <FaBolt /> LIMITED TIME OFFER
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 uppercase leading-none">
                READY TO <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">DOMINATE?</span>
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students using TutorHub to secure their professional future.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                {[
                  { num: '5K+', label: 'Students' },
                  { num: '4.0', label: 'GPA' },
                  { num: '24/7', label: 'Support' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-yellow-300 mb-1">{stat.num}</div>
                    <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isRegOpen ? (
                  <Link to="/register" className="group relative px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                      JOIN NOW <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ) : (
                  <Link to="/courses" className="group relative px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                      VIEW COURSES <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )}
                <Link to="/tutors" className="group px-8 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl font-black text-sm hover:bg-white hover:text-blue-600 transition-all shadow-lg">
                  <FiUsers className="inline mr-2" /> BROWSE TUTORS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FIND TUTOR SECTION --- */}
      <section id="tutor-section" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-2xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full blur-2xl opacity-30 animate-pulse delay-1000" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-xs font-black uppercase tracking-widest mb-6">
              <FiUsers /> FIND YOUR TUTOR
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 text-slate-900">
              Get Expert Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">Any Grade Level</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed mb-4">
              Choose between online tutoring with flexible scheduling or in-person physical tutoring for direct face-to-face learning.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <FiPhone className="text-green-600" />
              <span>Call us: <strong className="text-green-600">0951594353</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Online Tutor Card */}
            <div className="group bg-white rounded-[2rem] p-8 border-2 border-slate-100 hover:border-blue-500 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                  <FiGlobe />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 uppercase">Online Tutoring</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-600 font-bold">
                    <FiCheckCircle className="text-blue-500" /> Personalized Learning Paths
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-bold">
                    <FiCheckCircle className="text-blue-500" /> Interactive Virtual Classrooms
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-bold">
                    <FiPhone className="text-blue-500" /> Direct: <strong className="text-blue-600">0951594353</strong>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-bold">
                    <FiCheckCircle className="text-blue-500" /> 24/7 Expert Support Access
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-center block hover:shadow-lg transition-all uppercase tracking-widest text-sm"
                >
                  FIND ONLINE TUTOR
                </Link>
              </div>
            </div>

            {/* Physical Tutor Card */}
            <div className="group bg-white rounded-[2rem] p-8 border-2 border-slate-100 hover:border-green-500 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                  <FiUsers />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 uppercase">Physical Tutoring</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-600 font-bold">
                    <FiCheckCircle className="text-green-500" /> In-Person Expert Guidance
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-bold">
                    <FiPhone className="text-green-500" /> Direct: <strong>0951594353</strong>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-bold">
                    <FiTarget className="text-green-500" /> Personalized Study Plans
                  </li>
                </ul>
                <Link
                  to="/find-physical-tutor"
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-black text-center block hover:shadow-lg transition-all uppercase tracking-widest text-sm"
                >
                  PHYSICAL TUTOR
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- JOIN COMMUNITY SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-sky-50" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-2xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-br from-blue-200 to-sky-200 rounded-full blur-2xl opacity-30 animate-pulse delay-1000" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-widest mb-6">
              <FiUsers /> JOIN OUR COMMUNITY
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 text-slate-900">
              Connect With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">50K+ Students</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Join our vibrant Telegram community for exclusive study materials, exam tips, and direct support from tutors and fellow students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Community Benefits */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FiBookOpen className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Study Materials</h3>
              <p className="text-slate-600 text-sm">Access exclusive notes, past papers, and study guides shared by community members.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <FiUsers className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Peer Support</h3>
              <p className="text-slate-600 text-sm">Get help from fellow students and form study groups for better learning.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Exam Updates</h3>
              <p className="text-slate-600 text-sm">Stay updated with latest exam schedules, results, and important announcements.</p>
            </div>
          </div>

          {/* Telegram CTA */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <FiSend className="text-3xl" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Join Our Telegram Community</h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Get instant access to study resources, ask questions, and connect with thousands of students preparing for the same exams.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://t.me/AstraETX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl flex items-center gap-3"
                >
                  <FiSend className="text-xl" />
                  JOIN TELEGRAM
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="flex items-center gap-6 text-blue-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-xs">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-xs">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">FREE</div>
                    <div className="text-xs">Forever</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(-5px); } 50% { transform: translateY(5px); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 300% 300%;
          animation: gradient 6s ease infinite;
        }
        .delay-1000 { animation-delay: 1s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-700 { animation-delay: 0.7s; }
        .bg-300% { background-size: 300% 300%; }
      `}</style>

    </div>
  );
};

export default Home;
