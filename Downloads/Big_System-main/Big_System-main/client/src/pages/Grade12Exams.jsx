import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaGlobe, FaUsers, FaBrain, FaCalculator, FaChevronRight,
  FaPlay, FaQuestionCircle, FaBook, FaVideo, FaFileAlt, FaUniversity,
  FaLock, FaCrown, FaAtom, FaFlask, FaDna, FaLaptop, FaHome, FaUserTie
} from 'react-icons/fa';

const Grade12Exams = () => {
  const [activeTab, setActiveTab] = useState('entrance');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Entrance Score Calculator State (Out of 600/700)
  const [subjects_score, setSubjectsScore] = useState([
    { name: 'Math (Nat)', score: 95, max: 100 },
    { name: 'Physics', score: 88, max: 100 },
    { name: 'Chemistry', score: 92, max: 100 },
    { name: 'Biology', score: 85, max: 100 },
    { name: 'English', score: 70, max: 100 },
    { name: 'Civics', score: 80, max: 100 },
    { name: 'Aptitude', score: 90, max: 100 }
  ]);
  const [totalScore, setTotalScore] = useState(0);

  const tabs = [
    { id: 'entrance', label: 'Entrance', icon: FaFileAlt },
    { id: 'practice', label: 'Practice', icon: FaQuestionCircle },
    { id: 'videos', label: 'Lectures', icon: FaVideo },
    { id: 'notes', label: 'Notes', icon: FaBook },
    { id: 'tutors', label: 'Tutors', icon: FaUserTie }
  ];

  useEffect(() => {
    // Check Premium Status
    const checkStatus = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  useEffect(() => {
    const total = subjects_score.reduce((acc, curr) => acc + (parseInt(curr.score) || 0), 0);
    setTotalScore(total);
  }, [subjects_score]);

  const updateScore = (index, value) => {
    const updated = [...subjects_score];
    updated[index].score = value > updated[index].max ? updated[index].max : value;
    setSubjectsScore(updated);
  };

  const subjects = [
    {
      id: 'math-nat',
      name: 'Mathematics (Natural)',
      icon: <FaCalculator />,
      color: 'from-blue-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
      description: 'Calculus, Vectors, and Complex Numbers.',
      videos: [
        { title: 'Calculus: Limits and Derivatives', id: 'HfACrKJ_Y2g', thumb: 'https://img.youtube.com/vi/HfACrKJ_Y2g/mqdefault.jpg' },
        { title: 'Introduction to Complex Numbers', id: 'SP-YJe7Vldo', thumb: 'https://img.youtube.com/vi/SP-YJe7Vldo/mqdefault.jpg' }
      ]
    },
    {
      id: 'physics',
      name: 'Physics',
      icon: <FaAtom />,
      color: 'from-cyan-500 to-blue-500',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600',
      description: 'Mechanics, Electromagnetism, and Modern Physics.',
      videos: [
        { title: 'Electromagnetism Explained', id: 'GMnsZCRhZNM', thumb: 'https://img.youtube.com/vi/GMnsZCRhZNM/mqdefault.jpg' },
        { title: 'Newton\'s Laws of Motion', id: 'kKKM8Y-u7ds', thumb: 'https://img.youtube.com/vi/kKKM8Y-u7ds/mqdefault.jpg' }
      ]
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: <FaFlask />,
      color: 'from-emerald-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
      description: 'Organic Chemistry, Acid-Base Equilibria, and Thermodynamics.',
      videos: [
        { title: 'Organic Chemistry Introduction', id: 'bQPPrJjg8Qc', thumb: 'https://img.youtube.com/vi/bQPPrJjg8Qc/mqdefault.jpg' },
        { title: 'Chemical Equilibrium', id: 'dIDgPFEucFM', thumb: 'https://img.youtube.com/vi/dIDgPFEucFM/mqdefault.jpg' }
      ]
    },
    {
      id: 'biology',
      name: 'Biology',
      icon: <FaDna />,
      color: 'from-green-500 to-lime-600',
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600',
      description: 'Genetics, Evolution, and Human Physiology.',
      videos: [
        { title: 'DNA Replication (Updated)', id: 'TNKWgcFPHqw', thumb: 'https://img.youtube.com/vi/TNKWgcFPHqw/mqdefault.jpg' },
        { title: 'Introduction to Ecology', id: 'GInFy26W7DE', thumb: 'https://img.youtube.com/vi/GInFy26W7DE/mqdefault.jpg' }
      ]
    },
    {
      id: 'english',
      name: 'English',
      icon: <FaGlobe />,
      color: 'from-violet-500 to-purple-600',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
      description: 'The National English Examination Preparation.',
      videos: [
        { title: 'Entrance Exam Grammar Tips', id: 'jul2urq8p3g', thumb: 'https://img.youtube.com/vi/jul2urq8p3g/mqdefault.jpg' },
        { title: 'Reading Comprehension Strategies', id: 'b5g33545', thumb: 'https://img.youtube.com/vi/T44g33545/mqdefault.jpg' }
      ]
    },
    {
      id: 'civics',
      name: 'Civics',
      icon: <FaUsers />,
      color: 'from-amber-500 to-orange-600',
      image: 'https://images.unsplash.com/photo-1555890082-9602e1b1236f?auto=format&fit=crop&q=80&w=600',
      description: 'Democracy, Human Rights, and Constitution.',
      videos: [
        { title: 'Federalism in Ethiopia', id: 'k3k4k5k6', thumb: 'https://img.youtube.com/vi/P8Sj8p--ygo/mqdefault.jpg' },
        { title: 'Rights and Obligations', id: 'l7l8l9l0', thumb: 'https://img.youtube.com/vi/5J-5g-5h-5i/mqdefault.jpg' }
      ]
    },
    {
      id: 'sat',
      name: 'Scholastic Aptitude (SAT)',
      icon: <FaBrain />,
      color: 'from-indigo-600 to-fuchsia-600',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600',
      description: 'Verbal and Quantitative Reasoning Skills.',
      videos: [
        { title: 'SAT Math Tips and Tricks', id: 'yB3j3j3j', thumb: 'https://img.youtube.com/vi/Nq8-w2Q_2t0/mqdefault.jpg' },
        { title: 'Logical Reasoning Basics', id: 'zC4k4k4k', thumb: 'https://img.youtube.com/vi/5i_5j_5k_5l/mqdefault.jpg' }
      ]
    },
    {
      id: 'math-soc',
      name: 'Mathematics (Social)',
      icon: <FaCalculator />,
      color: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1614030635332-94943f338d1c?auto=format&fit=crop&q=80&w=600',
      description: 'Statistics, Probability, and Business Math.',
      videos: [
        { title: 'Intro to Statistics', id: 's2s3s4s5', thumb: 'https://img.youtube.com/vi/HfACrKJ_Y2g/mqdefault.jpg' },
        { title: 'Applied Mathematics', id: 't6t7t8t9', thumb: 'https://img.youtube.com/vi/5m_5n_5o_5p/mqdefault.jpg' }
      ]
    }
  ];

  const SubjectCard = ({ subject }) => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-slate-100 dark:border-slate-800 h-full flex flex-col">
      {/* Visual Header */}
      <div className="relative h-40 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-90 mix-blend-multiply z-10 transition-opacity group-hover:opacity-100`} />
        <img src={subject.image} alt={subject.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">Natural Science</span>
            <span className="text-white/80 text-lg">{subject.icon}</span>
          </div>
          <h3 className="font-bold text-xl leading-tight text-shadow">{subject.name}</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 transition-colors">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wide transition-all ${activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-slate-900'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <tab.icon className="text-sm" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 overflow-y-auto min-h-[250px] relative">
        <div className="space-y-3">
          {activeTab === 'entrance' && (
            <>
              <div onClick={() => navigate(`/grade12-exams/${subject.id}-entrance-2015`)} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">2015</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Euee 2015 Entrance</h4>
                    <p className="text-[10px] text-slate-500">Official National Exam</p>
                  </div>
                </div>
                <FaChevronRight className="text-slate-300 group-hover/item:text-blue-500 text-xs" />
              </div>
              <div onClick={() => navigate(isPremium ? `/grade12-exams/${subject.id}-entrance-2016` : '/subscribe-premium')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">2016</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Model Exam 2016</h4>
                    <p className="text-[10px] text-slate-500">Addis Ababa Education Bureau</p>
                  </div>
                </div>
                {isPremium ? <FaChevronRight className="text-slate-300 text-xs" /> : <FaLock className="text-amber-500 text-xs" />}
              </div>
              <div onClick={() => window.open('https://t.me/EthioGrade12/345162', '_blank')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">TG</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Entrance Exam Channel</h4>
                    <p className="text-[10px] text-slate-500">More Resources on Telegram</p>
                  </div>
                </div>
                <FaChevronRight className="text-slate-300 group-hover/item:text-sky-500 text-xs" />
              </div>
            </>
          )}

          {activeTab === 'practice' && (
            [1, 2, 3].map(unit => (
              <div key={unit} onClick={() => navigate(isPremium ? `/grade12-practice/${subject.id}/${unit}` : '/subscribe-premium')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">{unit}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Unit {unit} Practice</h4>
                    <p className="text-[10px] text-slate-500">20 Targeted Questions</p>
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
                      <FaVideo size={10} /> Watch Lesson
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

          {activeTab === 'notes' && (
            <div onClick={() => window.open('#', '_blank')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 cursor-pointer transition-colors group/item">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xs"><FaFileAlt /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Short Notes (PDF)</h4>
                  <p className="text-[10px] text-slate-500">Summary for Exam</p>
                </div>
              </div>
              <FaCrown className="text-amber-500 text-xs" />
            </div>
          )}

          {activeTab === 'tutors' && (
            <>
              <div onClick={() => navigate('/find-online-tutor')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs"><FaLaptop /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Online Tutor</h4>
                    <p className="text-[10px] text-slate-500">Learn from anywhere</p>
                  </div>
                </div>
                <FaChevronRight className="text-slate-300 group-hover/item:text-blue-500 text-xs" />
              </div>
              <div onClick={() => navigate('/find-physical-tutor')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs"><FaHome /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Physical Tutor</h4>
                    <p className="text-[10px] text-slate-500">Face-to-face learning</p>
                  </div>
                </div>
                <FaChevronRight className="text-slate-300 group-hover/item:text-green-500 text-xs" />
              </div>
            </>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 text-slate-900 dark:text-white pt-16 sm:pt-20 pb-16 sm:pb-20 transition-colors duration-300">

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] sm:w-[70%] sm:h-[70%] rounded-full bg-gradient-to-br from-purple-100/40 to-blue-100/40 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] sm:w-[50%] sm:h-[50%] rounded-full bg-gradient-to-tr from-pink-100/40 to-orange-100/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col items-start justify-between mb-8 sm:mb-12 gap-6">
          <div className="max-w-2xl text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-bold uppercase tracking-wider mb-4">
              <FaUniversity /> Class of 2016
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight transition-colors">
              Dominate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Entrance Exams</span>.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
              The ultimate preparation hub for Grade 12 students. Master Natural & Social Science subjects with past papers, video lessons, and mock tests.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3 sm:gap-6 w-full sm:w-auto justify-center sm:justify-end">
            <div className="text-center sm:text-right">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white transition-colors">700</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider transition-colors">Max Score</p>
            </div>
            <div className="h-8 sm:h-12 w-px bg-slate-200 hidden sm:block"></div>
            <div className="text-center sm:text-right">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white transition-colors">12k+</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider transition-colors">Students</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">

          {/* Sidebar / Score Calculator */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Entrance Score Predictor */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden sticky top-20 sm:top-24 transition-colors">
              <div className="bg-slate-900 dark:bg-black p-4 sm:p-6 text-white text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Predicted Score</p>
                <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {totalScore}
                </div>
                <p className="text-xs text-slate-400 mt-2">Out of 700</p>
              </div>
              <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex justify-between text-[8px] sm:text-[10px] font-bold uppercase text-slate-400 tracking-wider px-2 mb-2">
                  <span>Subject</span>
                  <span>Score</span>
                </div>
                <div className="space-y-2 max-h-[200px] sm:max-h-[300px] overflow-y-auto px-1">
                  {subjects_score.map((sub, i) => (
                    <div key={i} className="flex gap-2 items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">{sub.name}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={sub.score}
                          onChange={(e) => updateScore(i, parseInt(e.target.value) || 0)}
                          className="w-10 sm:w-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-1 py-1 text-xs font-bold text-right text-slate-700 dark:text-white focus:border-purple-500 outline-none transition-colors"
                          max={sub.max}
                        />
                        <span className="text-[8px] sm:text-[10px] text-slate-400 dark:text-slate-500 transition-colors">/{sub.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 sm:mt-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
                  Save Prediction
                </button>
              </div>
            </div>

            {/* Premium Promo */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => navigate('/subscribe-premium')}>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 sm:-mr-8 sm:-mt-8 text-white/10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <FaCrown size={60} className="sm:size-100" />
                </div>
                <div className="relative z-10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4">
                    <FaCrown />
                  </div>
                  <h3 className="font-black text-white text-sm sm:text-lg leading-tight mb-2">Go Premium</h3>
                  <p className="text-purple-100 text-xs sm:text-sm font-medium mb-3 sm:mb-4 leading-relaxed">
                    Unlock 10 years of entrance exams with detailed explanations.
                  </p>
                  <button className="bg-white text-purple-600 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:bg-purple-50 transition-colors">
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

export default Grade12Exams;
