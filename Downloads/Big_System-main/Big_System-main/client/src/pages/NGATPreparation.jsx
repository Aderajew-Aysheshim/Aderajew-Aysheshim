import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaGlobe, FaUsers, FaBrain, FaCalculator, FaChevronRight,
  FaPlay, FaQuestionCircle, FaBook, FaVideo, FaFileAlt, FaUniversity,
  FaLock, FaCrown, FaAtom, FaFlask, FaLaptopCode, FaChartLine, FaLightbulb, FaLanguage
} from 'react-icons/fa';

const NGATPreparation = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Aptitude Score Tracker (Targeting 100%)
  const [aptitudeScores, setAptitudeScores] = useState([
    { name: 'Verbal Reasoning', score: 75, max: 100 },
    { name: 'Quantitative', score: 68, max: 100 },
    { name: 'Analytical', score: 82, max: 100 }
  ]);
  const [averageScore, setAverageScore] = useState(0);

  const tabs = [
    { id: 'tests', label: 'Tests', icon: FaFileAlt },
    { id: 'practice', label: 'Practice', icon: FaQuestionCircle },
    { id: 'videos', label: 'Lessons', icon: FaVideo },
    { id: 'tips', label: 'Tips', icon: FaLightbulb }
  ];

  useEffect(() => {
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
    const total = aptitudeScores.reduce((acc, curr) => acc + curr.score, 0);
    setAverageScore((total / aptitudeScores.length).toFixed(1));
  }, [aptitudeScores]);

  const updateScore = (index, value) => {
    const updated = [...aptitudeScores];
    updated[index].score = value > 100 ? 100 : value;
    setAptitudeScores(updated);
  };

  const subjects = [
    {
      id: 'logical',
      name: 'Logical Reasoning',
      icon: <FaBrain />,
      color: 'from-purple-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
      description: 'Pattern recognition and deductive logic.',
      videos: [
        { title: 'Logical Reasoning Basics', id: 'Dk4s5f6g', thumb: 'https://img.youtube.com/vi/ZM8ECpBuQYE/mqdefault.jpg' },
        { title: 'Syllogism Tricks', id: 'G7h8j9k0', thumb: 'https://img.youtube.com/vi/kKKM8Y-u7ds/mqdefault.jpg' }
      ]
    },
    {
      id: 'quantitative',
      name: 'Quantitative Aptitude',
      icon: <FaCalculator />,
      color: 'from-emerald-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
      description: 'Numerical ability and mathematical problem solving.',
      videos: [
        { title: 'Speed Math Techniques', id: 'vLnPwxZdW4Y', thumb: 'https://img.youtube.com/vi/vLnPwxZdW4Y/mqdefault.jpg' },
        { title: 'Data Interpretation', id: '4F-4G-4H-4I', thumb: 'https://img.youtube.com/vi/4F-4G-4H-4I/mqdefault.jpg' }
      ]
    },
    {
      id: 'verbal',
      name: 'Verbal Reasoning',
      icon: <FaLanguage />,
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
      description: 'Vocabulary, grammar, and reading comprehension.',
      videos: [
        { title: 'Vocabulary Builder', id: 'TNKWgcFPHqw', thumb: 'https://img.youtube.com/vi/TNKWgcFPHqw/mqdefault.jpg' },
        { title: 'Reading Comprehension', id: 'GInFy26W7DE', thumb: 'https://img.youtube.com/vi/GInFy26W7DE/mqdefault.jpg' }
      ]
    },
    {
      id: 'analytical',
      name: 'Analytical Ability',
      icon: <FaChartLine />,
      color: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
      description: 'Critical thinking and complex data analysis.',
      videos: [
        { title: 'Analytical Reasoning Sets', id: 'GMnsZCRhZNM', thumb: 'https://img.youtube.com/vi/GMnsZCRhZNM/mqdefault.jpg' },
        { title: 'Puzzle Solving', id: 'dIDgPFEucFM', thumb: 'https://img.youtube.com/vi/dIDgPFEucFM/mqdefault.jpg' }
      ]
    }
  ];

  const SubjectCard = ({ subject }) => (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-slate-100 h-full flex flex-col">
      {/* Visual Header */}
      <div className="relative h-40 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-90 mix-blend-multiply z-10 transition-opacity group-hover:opacity-100`} />
        <img src={subject.image} alt={subject.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">NGAT Prep</span>
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
              ? 'text-teal-600 border-b-2 border-teal-600 bg-white'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
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
          {activeTab === 'tests' && (
            <>
              <div onClick={() => navigate(`/ngat/test/${subject.id}-mock-1`)} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs">M1</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Mock Test 1</h4>
                    <p className="text-[10px] text-slate-500">Standard Difficulty</p>
                  </div>
                </div>
                <FaChevronRight className="text-slate-300 group-hover/item:text-teal-500 text-xs" />
              </div>
              <div onClick={() => navigate(isPremium ? `/ngat/test/${subject.id}-mock-2` : '/subscribe-premium')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">M2</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Mock Test 2</h4>
                    <p className="text-[10px] text-slate-500">Advanced Difficulty</p>
                  </div>
                </div>
                {isPremium ? <FaChevronRight className="text-slate-300 text-xs" /> : <FaLock className="text-amber-500 text-xs" />}
              </div>
            </>
          )}

          {activeTab === 'practice' && (
            [1, 2, 3].map(level => (
              <div key={level} onClick={() => navigate(isPremium ? `/ngat/test/${subject.id}-practice-${level}` : '/subscribe-premium')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">L{level}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Level {level} Practice</h4>
                    <p className="text-[10px] text-slate-500">20 Questions (Untimed)</p>
                  </div>
                </div>
                {isPremium ? <FaPlay className="text-blue-500 text-xs" /> : <FaLock className="text-amber-500 text-xs" />}
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
                <p className="text-xs text-slate-400">Video lessons coming soon.</p>
              </div>
            )
          )}

          {activeTab === 'tips' && (
            <div onClick={() => window.open('#', '_blank')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 cursor-pointer transition-colors group/item">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xs"><FaLightbulb /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Mastery Guide</h4>
                  <p className="text-[10px] text-slate-500">Tips & Tricks PDF</p>
                </div>
              </div>
              <FaCrown className="text-amber-500 text-xs" />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-teal-100 text-slate-900 pt-20 pb-20">

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-teal-100/40 to-emerald-100/40 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-100/40 to-blue-100/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-bold uppercase tracking-wider mb-4">
              <FaUniversity /> Graduate Admission
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">NGAT Aptitude</span>.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              National Graduate Admission Test preparation. Focus on Verbal Reasoning, Quantitative Aptitude, and Analytical Logic with adaptive practice sets.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="text-right hidden md:block">
              <p className="text-3xl font-black text-slate-900">100</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Marks</p>
            </div>
            <div className="h-12 w-px bg-slate-200 hidden md:block" />
            <div className="text-right hidden md:block">
              <p className="text-3xl font-black text-slate-900">4+</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Sections</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar / Score Calculator */}
          <div className="lg:col-span-1 space-y-6">
            {/* Aptitude Score Tracker */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
              <div className="bg-slate-900 p-6 text-white text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Aptitude Score</p>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  {averageScore}
                </div>
                <p className="text-xs text-slate-400 mt-2">Average (out of 100)</p>
              </div>
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider px-2 mb-2">
                  <span>Section</span>
                  <span>Score</span>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto px-1">
                  {aptitudeScores.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{item.name}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={item.score}
                          onChange={(e) => updateScore(i, parseInt(e.target.value) || 0)}
                          className={`w-12 bg-white border border-slate-200 rounded-md px-1 py-1 text-xs font-bold text-right outline-none focus:border-teal-500 ${item.score >= 50 ? 'text-green-600' : 'text-slate-600'}`}
                          max={100}
                        />
                        <span className="text-[10px] text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200">
                  Update Statistics
                </button>
              </div>
            </div>

            {/* Premium Promo */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => navigate('/subscribe-premium')}>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 text-white/10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <FaCrown size={100} />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-4">
                    <FaCrown />
                  </div>
                  <h3 className="font-black text-white text-lg leading-tight mb-2">Unlock Aptitude</h3>
                  <p className="text-emerald-100 text-xs font-medium mb-4 leading-relaxed">
                    Get 1000+ practice questions for Logical, Quantitative, and Verbal Reasoning.
                  </p>
                  <button className="bg-white text-teal-600 text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-teal-50 transition-colors">
                    Start Prep
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="lg:col-span-3 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>

            {/* Success Stories Section */}
            <div className="pt-8">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
                Our <span className="text-teal-600">Top Rankers</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: 'Bethlehem Tadesse',
                    exam: 'NGAT 2025',
                    score: '94/120',
                    text: 'The Quantitative section was my biggest hurdle. TutorHubs practice sets made it feel like a breeze.',
                    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=300'
                  },
                  {
                    name: 'Dawit Abraham',
                    exam: 'NGAT 2025',
                    score: '112/120',
                    text: 'Achieving 112/120 seemed impossible until I found the Logical Reasoning masterclass here.',
                    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300'
                  },
                  {
                    name: 'Kidist Solomon',
                    exam: 'NGAT 2024',
                    score: '92/120',
                    text: 'The video lessons are life-savers. I felt fully prepared for the Verbal and Analytical sections.',
                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300'
                  }
                ].map((story, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500/20">
                        <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{story.name}</h4>
                        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">{story.exam}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">"{story.text}"</p>
                    <div className="text-xl font-black text-slate-900">{story.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NGATPreparation;
