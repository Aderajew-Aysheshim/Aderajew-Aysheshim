import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaSearch, FaClock, FaUsers, FaCrown, FaCode, FaChevronRight, FaShieldAlt,
  FaFilter, FaBook, FaFlask, FaLeaf, FaPalette, FaLanguage, FaGraduationCap, FaBrain, FaChartLine, FaArrowRight, FaUniversity
} from 'react-icons/fa';
import {
  FiLayers, FiTarget, FiZap, FiMonitor, FiTrendingUp, FiSearch, FiGrid, FiList, FiCheck, FiX
} from 'react-icons/fi';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  const subjects = [
    { value: '', label: 'All Subjects', icon: <FiLayers /> },
    { value: 'computer-science', label: 'CS & Tech', icon: <FaCode /> },
    { value: 'mathematics', label: 'Mathematics', icon: <FaBrain /> },
    { value: 'engineering', label: 'Engineering', icon: <FaUniversity /> },
    { value: 'business', label: 'Business', icon: <FaChartLine /> },
    { value: 'languages', label: 'Languages', icon: <FaLanguage /> }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await axios.get('http://localhost:5000/api/students/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setStudent(res.data.student);
          } catch (e) { console.error(e); }
        }

        const url = selectedSubject
          ? `http://localhost:5000/api/courses?subject=${selectedSubject}`
          : 'http://localhost:5000/api/courses';
        const response = await axios.get(url);
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSubject]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' ||
      (selectedType === 'free' && (!course.is_premium || course.price === 0)) ||
      (selectedType === 'premium' && course.is_premium && course.price > 0) ||
      (selectedType === 'programming' && course.course_type === 'programming');
    return matchesSearch && matchesType;
  });

  const handleEnroll = (course) => {
    if (!student) { navigate('/login'); return; }
    if (course.is_premium && course.price > 0) {
      navigate('/course-payment', { state: { course } });
    } else {
      enrollInCourse(course.id);
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Success! Enrollment complete.');
    } catch (e) { alert('Enrollment failed.'); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-100 text-slate-900 dark:text-white pb-20 pt-20 transition-colors duration-300">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-200/40 to-violet-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- HERO SECTION --- */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeInLeft">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
              <FiZap /> Industry-Standard Learning
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight transition-colors">
              Upgrade Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 italic">Skillset</span>.
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl transition-colors">
              Access expert-led courses in Programming, Engineering, and Business. Localized curriculum designed for Ethiopian professionals and students.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setSelectedType('programming')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 group">
                Explore Tech <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors">
                  <FaUsers />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">Active Learners</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white transition-colors">1.2k+ Students</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative animate-fadeInRight">
            <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 transform -rotate-2 hover:rotate-0 transition-all duration-700 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10 dark:text-white"><FaCode size={150} /></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <FaUniversity size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">AASTU Hub</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Freshman Specialized</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic transition-colors">
                "The freshman year is critical. We've compiled every resource you need to maintain a 4.0 GPA."
              </p>
              <Link to="/aastu-exams" className="flex items-center justify-between p-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all group">
                Launch Portal <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-400 rounded-3xl -z-10 animate-spin-slow opacity-20" />
          </div>
        </div>

        {/* --- FILTER & SEARCH BAR --- */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-4 md:p-6 rounded-[32px] border border-white dark:border-slate-800 shadow-xl dark:shadow-none shadow-slate-200/50 mb-12 flex flex-col md:flex-row gap-6 items-center sticky top-24 z-40 transition-colors">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            {subjects.map(s => (
              <button
                key={s.value}
                onClick={() => setSelectedSubject(s.value)}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${selectedSubject === s.value ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'}`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div className="h-10 w-px bg-slate-200 hidden md:block" />

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl transition-colors">
            {['all', 'free', 'premium'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === type ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* --- COURSE GRID --- */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Filtering Realtime Streams...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
              ))
            ) : (
              <div className="col-span-full py-40 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <FiX className="text-slate-200 text-8xl mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Courses Found</h3>
                <p className="text-slate-500">Try adjusting your filters or search term.</p>
                <button onClick={() => { setSearchTerm(''); setSelectedSubject(''); setSelectedType('all') }} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Clear All Filters</button>
              </div>
            )}
          </div>
        )}

      </div>

      <style jsx="true">{`
        @keyframes fadeInLeft { from { opacity:0; transform: translateX(-40px); } to { opacity:1; transform: translateX(0); } }
        @keyframes fadeInRight { from { opacity:0; transform: translateX(40px); } to { opacity:1; transform: translateX(0); } }
        .animate-fadeInLeft { animation: fadeInLeft 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-fadeInRight { animation: fadeInRight 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
      `}</style>
    </div>
  );
};

const CourseCard = ({ course, onEnroll }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full">
    {/* Course Image */}
    <div className="relative h-48 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <img
        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=600&fit=crop&auto=format'}
        alt={course.title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      {course.is_premium && (
        <div className="absolute top-4 right-4 z-20 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <FaCrown /> PRO
        </div>
      )}
      <div className="absolute bottom-4 left-4 z-20">
        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase rounded-lg">
          {course.subject}
        </span>
      </div>
    </div>

    {/* Course Info */}
    <div className="p-6 flex-1 flex flex-col relative z-10">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
        {course.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed transition-colors">
        {course.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <FaClock className="text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{course.duration_hours || 40}h</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <FaUsers className="text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{course.enrolled_students || 0} Learners</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Tuition</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter transition-colors">
              {course.price || '0.00'}
            </span>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">ETB</span>
          </div>
        </div>
        <button
          onClick={() => onEnroll(course)}
          className={`px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${course.is_premium ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700' : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700'}`}
        >
          Enroll Now <FaChevronRight size={8} />
        </button>
      </div>
    </div>
  </div>
);

export default Courses;
