import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaGlobe, FaUsers, FaBrain, FaCalculator, FaChevronRight,
  FaPlay, FaQuestionCircle, FaBook, FaVideo, FaFileAlt, FaUniversity,
  FaTrash, FaLock, FaCrown, FaAtom, FaFlask, FaLaptopCode

} from 'react-icons/fa';

const AastuFreshmanExams = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [isPremium, setIsPremium] = useState(false);

  const [backendResources, setBackendResources] = useState([]);
  const navigate = useNavigate();

  // GPA Calculator State
  const [courses, setCourses] = useState([{ name: 'Logic', grade: 'A', creditHour: 3 }]);
  const [gpa, setGpa] = useState(4.0);
  const gradePoints = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0 };

  const tabs = [
    { id: 'exams', label: 'Exams', icon: FaFileAlt },
    { id: 'questions', label: 'Worksheets', icon: FaQuestionCircle },
    { id: 'videos', label: 'Lectures', icon: FaVideo },
    { id: 'materials', label: 'Notes', icon: FaBook }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await axios.get('http://localhost:5000/api/students/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIsPremium(response.data.student?.subscriptionStatus === 'premium');
          } catch (e) { console.error("Profile fetch error", e); }
        }

        // Mocking backend resources for demo if empty, or fetching real ones
        // For now, we will use a robust static set for the "Super" look if backend is empty
        const response = await axios.get('http://localhost:5000/api/resources?gradeLevel=Freshman&limit=100');
        if (response.data.success && response.data.resources.length > 0) {
          setBackendResources(response.data.resources);
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (courses.length === 0) { setGpa(0); return; }
    let totalPoints = 0, totalCredits = 0;
    courses.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * course.creditHour;
      totalCredits += course.creditHour;
    });
    setGpa(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0);
  }, [courses]);

  const addCourse = () => setCourses([...courses, { name: '', grade: 'A', creditHour: 3 }]);
  const removeCourse = (index) => setCourses(courses.filter((_, i) => i !== index));
  const updateCourse = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = field === 'creditHour' ? parseInt(value) || 0 : value;
    setCourses(updated);
  };

  const subjects = [
    {
      id: 'geography',
      name: 'Geography of Ethiopia',
      code: 'Geog 1001',
      icon: <FaGlobe />,
      color: 'from-blue-600 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600',
      description: 'Landforms, climate, population, and economic activities.',
      chapters: 8,
      videos: [
        { title: 'Geography of Ethiopia - Chapter 1', id: 'b_t1x5d-XyM', thumb: 'https://img.youtube.com/vi/b_t1x5d-XyM/mqdefault.jpg' },
        { title: 'Climate of Ethiopia', id: 'P8Sj8p--ygo', thumb: 'https://img.youtube.com/vi/P8Sj8p--ygo/mqdefault.jpg' }
      ]
    },
    {
      id: 'anthropology',
      name: 'Social Anthropology',
      code: 'Anth 1012',
      icon: <FaUsers />,
      color: 'from-orange-500 to-amber-500',
      image: 'https://images.unsplash.com/photo-1555890082-9602e1b1236f?auto=format&fit=crop&q=80&w=600',
      description: 'Human culture, society, and development.',
      chapters: 6,
      videos: [
        { title: 'What is Anthropology?', id: 'J52733475', thumb: 'https://img.youtube.com/vi/J52733475/mqdefault.jpg' },
        { title: 'Culture and Society', id: '5J-5g-5h-5i', thumb: 'https://img.youtube.com/vi/5J-5g-5h-5i/mqdefault.jpg' }
      ]
    },
    {
      id: 'psychology',
      name: 'General Psychology',
      code: 'Psyc 1011',
      icon: <FaBrain />,
      color: 'from-purple-600 to-pink-500',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600',
      description: 'Human behavior, cognition, and mental processes.',
      chapters: 11,
      videos: [
        { title: 'Intro to Psychology: Crash Course', id: 'vo4pMVb0R6M', thumb: 'https://img.youtube.com/vi/vo4pMVb0R6M/mqdefault.jpg' },
        { title: 'Sensation and Perception', id: 'unWnZvXJH2o', thumb: 'https://img.youtube.com/vi/unWnZvXJH2o/mqdefault.jpg' }
      ]
    },
    {
      id: 'logic',
      name: 'Logic & Critical Thinking',
      code: 'FLEn 1003',
      icon: <FaBrain />,
      color: 'from-indigo-600 to-violet-600',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=600',
      description: 'Reasoning, arguments, and fallacies.',
      chapters: 5,
      videos: [
        { title: 'Critical Thinking - Fundamentals', id: 'Nq8-w2Q_2t0', thumb: 'https://img.youtube.com/vi/Nq8-w2Q_2t0/mqdefault.jpg' },
        { title: 'Introduction to Logic', id: '5i_5j_5k_5l', thumb: 'https://img.youtube.com/vi/5i_5j_5k_5l/mqdefault.jpg' }
      ]
    },
    {
      id: 'math',
      name: 'Applied Mathematics I',
      code: 'Math 1101',
      icon: <FaCalculator />,
      color: 'from-red-500 to-rose-600',
      image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=600',
      description: 'Calculus, vectors, and matrices.',
      chapters: 7,
      videos: [
        { title: 'Calculus 1 - Introduction', id: 'HfACrKJ_Y2g', thumb: 'https://img.youtube.com/vi/HfACrKJ_Y2g/mqdefault.jpg' },
        { title: 'Limits and Continuity', id: '5m_5n_5o_5p', thumb: 'https://img.youtube.com/vi/5m_5n_5o_5p/mqdefault.jpg' }
      ]
    },
    {
      id: 'physics',
      name: 'General Physics',
      code: 'Phys 1011',
      icon: <FaAtom />,
      color: 'from-sky-500 to-blue-600',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600',
      description: 'Mechanics, heat, and sound.',
      chapters: 8,
      videos: [
        { title: 'Motion in a Straight Line', id: 'ZM8ECpBuQYE', thumb: 'https://img.youtube.com/vi/ZM8ECpBuQYE/mqdefault.jpg' },
        { title: 'Newton\'s Laws', id: 'kKKM8Y-u7ds', thumb: 'https://img.youtube.com/vi/kKKM8Y-u7ds/mqdefault.jpg' }
      ]
    },
    {
      id: 'chemistry',
      name: 'General Chemistry',
      code: 'Chem 1012',
      icon: <FaFlask />,
      color: 'from-emerald-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
      description: 'Atomic structure, bonding, and chemical reactions.',
      chapters: 6,
      videos: [
        { title: 'The Nucleus: Crash Course Chemistry', id: 'FSyAehMdpyI', thumb: 'https://img.youtube.com/vi/FSyAehMdpyI/mqdefault.jpg' },
        { title: 'Chemical Bonds', id: 'QXT4OVM4vXI', thumb: 'https://img.youtube.com/vi/QXT4OVM4vXI/mqdefault.jpg' }
      ]
    },
    {
      id: 'programming',
      name: 'Intro to Computing',
      code: 'CoSc 1011',
      icon: <FaLaptopCode />,
      color: 'from-gray-700 to-slate-900',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600',
      description: 'C++ programming basics and algorithms.',
      chapters: 9,
      videos: [
        { title: 'C++ Tutorial for Beginners', id: 'vLnPwxZdW4Y', thumb: 'https://img.youtube.com/vi/vLnPwxZdW4Y/mqdefault.jpg' },
        { title: 'Variables and Data Types', id: '4F-4G-4H-4I', thumb: 'https://img.youtube.com/vi/4F-4G-4H-4I/mqdefault.jpg' }
      ]
    }
  ];

  const SubjectCard = ({ subject }) => (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-slate-100 h-full flex flex-col">
      {/* Visual Header */}
      <div className="relative h-28 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-90 mix-blend-multiply z-10 transition-opacity group-hover:opacity-100`} />
        <img src={subject.image} alt={subject.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">{subject.code}</span>
            <span className="text-white/80 text-lg">{subject.icon}</span>
          </div>
          <h3 className="font-bold text-xl leading-tight text-shadow">{subject.name}</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wide transition-all ${activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
          >
            <tab.icon className="text-sm" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-3 flex-1 overflow-y-auto min-h-[180px] relative">
        {/* Placeholder Content Logic */}
        <div className="space-y-3">
          {activeTab === 'exams' && (
            <>
              <div onClick={() => navigate(`/aastu-exams/${subject.id}-final`)} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-xs">F</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Final Exam 2015</h4>
                    <p className="text-[10px] text-slate-500">2 hrs • 60 Questions</p>
                  </div>
                </div>
                <FaChevronRight className="text-slate-300 group-hover/item:text-blue-500 text-xs" />
              </div>
              <div onClick={() => navigate(isPremium ? `/aastu-exams/${subject.id}-mid` : '/subscribe-premium')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs">M</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Mid Exam 2016</h4>
                    <p className="text-[10px] text-slate-500">1.5 hrs • 40 Questions</p>
                  </div>
                </div>
                {isPremium ? <FaChevronRight className="text-slate-300 text-xs" /> : <FaLock className="text-amber-500 text-xs" />}
              </div>
            </>
          )}

          {activeTab === 'questions' && (
            [1, 2, 3].map(ch => (
              <div key={ch} onClick={() => navigate(isPremium ? `/quiz/${subject.id}/${ch}` : '/subscribe-premium')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">{ch}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Chapter {ch} Worksheets</h4>
                    <p className="text-[10px] text-slate-500">25 Questions</p>
                  </div>
                </div>
                {isPremium ? <FaPlay className="text-emerald-500 text-xs" /> : <FaLock className="text-amber-500 text-xs" />}
              </div>
            ))
          )}

          {activeTab === 'videos' && (
            subject.videos && subject.videos.length > 0 ? (
              subject.videos.map((video, idx) => (
                <div
                  key={idx}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100 cursor-pointer transition-colors group/item"
                >
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={video.thumb} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover/item:bg-black/10 transition-colors">
                      <FaPlay className="text-white drop-shadow-md text-xs" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-tight mb-1">{video.title}</h4>
                    <p className="text-[10px] text-red-500 flex items-center gap-1 font-medium">
                      <FaVideo size={10} /> Watch Lecture
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaVideo className="text-purple-300" />
                </div>
                <p className="text-xs text-slate-400">Video lectures coming soon.</p>
              </div>
            )
          )}

          {activeTab === 'materials' && (
            <div onClick={() => window.open('#', '_blank')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 cursor-pointer transition-colors group/item">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xs"><FaFileAlt /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Short Notes (PDF)</h4>
                  <p className="text-[10px] text-slate-500">Complete summary</p>
                </div>
              </div>
              <FaCrown className="text-amber-500 text-xs" />
            </div>
          )}
        </div>

        {/* Fade Overlay for long content */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Footer Action */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <button onClick={() => navigate(`/aastu-exams`)} className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center justify-center gap-1">
          Go to Course Page <FaChevronRight size={10} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 text-slate-900 dark:text-white pt-20 pb-20 transition-colors duration-300">

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
              <FaUniversity /> Freshman Center
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight leading-tight transition-colors">
              Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">University Journey</span> Strong.
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
              Access premium resources for all freshman courses. Past exams, worksheets, and study guides tailored for AASTU students.
            </p>
          </div>

          {/* Quick Stats or Actions */}
          <div className="flex gap-3">
            <div className="text-right hidden md:block">
              <p className="text-3xl font-black text-slate-900 dark:text-white transition-colors">4.0</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider transition-colors">Target GPA</p>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="text-right hidden md:block">
              <p className="text-3xl font-black text-slate-900 dark:text-white transition-colors">8+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider transition-colors">Courses</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar / GPA & Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* GPA Calculator Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden sticky top-24 transition-colors">
              <div className="bg-slate-900 dark:bg-black p-4 text-white text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">GPA Forecast</p>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  {gpa}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Based on current inputs</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider px-2 mb-2">
                  <span>Course</span>
                  <span>Grd</span>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto px-1">
                  {courses.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={c.name} onChange={(e) => updateCourse(i, 'name', e.target.value)} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 focus:border-blue-500 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors" placeholder="Course Name" />
                      <select value={c.grade} onChange={(e) => updateCourse(i, 'grade', e.target.value)} className="w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:border-blue-500 outline-none transition-colors">
                        {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <button onClick={() => removeCourse(i)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors"><FaTrash size={10} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={addCourse} className="w-full mt-3 py-2 bg-white border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-all">
                  + Add Course
                </button>
              </div>
            </div>

            {/* Premium Promo */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-amber-200 to-yellow-400 p-6 rounded-3xl shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => navigate('/subscribe-premium')}>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 text-white/40 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <FaCrown size={100} />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center text-amber-900 mb-4">
                    <FaCrown />
                  </div>
                  <h3 className="font-black text-amber-900 text-lg leading-tight mb-2">Unlock All Resources</h3>
                  <p className="text-amber-800 text-xs font-medium mb-4 leading-relaxed">
                    Get access to 500+ past exams, verified solutions, and video tutorials.
                  </p>
                  <button className="bg-white text-amber-600 text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AastuFreshmanExams;
