import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaGlobe, FaUsers, FaBrain, FaCalculator, FaChevronRight,
  FaPlay, FaQuestionCircle, FaBook, FaVideo, FaFileAlt, FaUniversity,
  FaLock, FaCrown, FaAtom, FaFlask, FaLaptopCode, FaStethoscope, FaBalanceScale, FaBuilding
} from 'react-icons/fa';

const ExitExams = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock Exam Score Tracker (Targeting 100%)
  const [mockScores, setMockScores] = useState([
    { name: 'Model 2015', score: 78, max: 100 },
    { name: 'Model 2016', score: 82, max: 100 },
    { name: 'Ministry', score: 0, max: 100 }
  ]);
  const [averageScore, setAverageScore] = useState(0);

  const tabs = [
    { id: 'exams', label: 'Past Exams', icon: FaFileAlt },
    { id: 'mock', label: 'Mock Tests', icon: FaQuestionCircle },
    { id: 'videos', label: 'Reviews', icon: FaVideo },
    { id: 'guide', label: 'Guide', icon: FaBook }
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
    const scoredExams = mockScores.filter(m => m.score > 0);
    const total = scoredExams.reduce((acc, curr) => acc + curr.score, 0);
    setAverageScore(scoredExams.length ? (total / scoredExams.length).toFixed(1) : 0);
  }, [mockScores]);

  const updateScore = (index, value) => {
    const updated = [...mockScores];
    updated[index].score = value > 100 ? 100 : value;
    setMockScores(updated);
  };

  const subjects = [
    {
      id: 'civil',
      name: 'Civil Engineering',
      icon: <FaBuilding />,
      color: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
      description: 'Structures, Geotechnics, and Hydraulics.',
      videos: [
        { title: 'Structural Analysis Review', id: 'Dk4s5f6g', thumb: 'https://img.youtube.com/vi/ZM8ECpBuQYE/mqdefault.jpg' },
        { title: 'Geotechnical Engineering Basics', id: 'G7h8j9k0', thumb: 'https://img.youtube.com/vi/kKKM8Y-u7ds/mqdefault.jpg' }
      ]
    },
    {
      id: 'cs',
      name: 'Computer Science',
      icon: <FaLaptopCode />,
      color: 'from-blue-600 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=600',
      description: 'Algorithms, Database, and Networking.',
      videos: [
        { title: 'Exit Exam: Algorithms Review', id: 'vLnPwxZdW4Y', thumb: 'https://img.youtube.com/vi/vLnPwxZdW4Y/mqdefault.jpg' },
        { title: 'Database Systems Overview', id: '4F-4G-4H-4I', thumb: 'https://img.youtube.com/vi/4F-4G-4H-4I/mqdefault.jpg' }
      ]
    },
    {
      id: 'health',
      name: 'Medicine & Health',
      icon: <FaStethoscope />,
      color: 'from-green-500 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=600',
      description: 'Anatomy, Pharmacology, and Clinical Cases.',
      videos: [
        { title: 'Medical Licensing Exam Prep', id: 'TNKWgcFPHqw', thumb: 'https://img.youtube.com/vi/TNKWgcFPHqw/mqdefault.jpg' },
        { title: 'Clinical Case Studies', id: 'GInFy26W7DE', thumb: 'https://img.youtube.com/vi/GInFy26W7DE/mqdefault.jpg' }
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical Engineering',
      icon: <FaAtom />,
      color: 'from-yellow-500 to-amber-600',
      image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&q=80&w=600',
      description: 'Power Systems, Control, and Electronics.',
      videos: [
        { title: 'Circuit Analysis Crash Course', id: 'GMnsZCRhZNM', thumb: 'https://img.youtube.com/vi/GMnsZCRhZNM/mqdefault.jpg' },
        { title: 'Power Systems Engineering', id: 'dIDgPFEucFM', thumb: 'https://img.youtube.com/vi/dIDgPFEucFM/mqdefault.jpg' }
      ]
    },
    {
      id: 'law',
      name: 'Law',
      icon: <FaBalanceScale />,
      color: 'from-emerald-800 to-teal-900',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
      description: 'Constitutional, Criminal, and Civil Law.',
      videos: [
        { title: 'Ethiopian Legal System', id: 'k3k4k5k6', thumb: 'https://img.youtube.com/vi/5J-5g-5h-5i/mqdefault.jpg' },
        { title: 'Contract Law Essentials', id: 'l7l8l9l0', thumb: 'https://img.youtube.com/vi/P8Sj8p--ygo/mqdefault.jpg' }
      ]
    },
    {
      id: 'mechanical',
      name: 'Mechanical Engineering',
      icon: <FaUsers />,
      color: 'from-slate-600 to-gray-700',
      image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=600',
      description: 'Thermodynamics, Mechanics, and Design.',
      videos: [
        { title: 'Thermodynamics Review', id: 'HFACrKJ_Y2g', thumb: 'https://img.youtube.com/vi/HfACrKJ_Y2g/mqdefault.jpg' },
        { title: 'Fluid Mechanics', id: 'SP-YJe7Vldo', thumb: 'https://img.youtube.com/vi/SP-YJe7Vldo/mqdefault.jpg' }
      ]
    },
    {
      id: 'software',
      name: 'Software Engineering',
      icon: <FaLaptopCode />,
      color: 'from-violet-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=600',
      description: 'SDLC, Architecture, and Web Development.',
      videos: [
        { title: 'System Design Interview', id: 'yB3j3j3j', thumb: 'https://img.youtube.com/vi/Nq8-w2Q_2t0/mqdefault.jpg' },
        { title: 'Software Testing Fundamentals', id: 'zC4k4k4k', thumb: 'https://img.youtube.com/vi/5i_5j_5k_5l/mqdefault.jpg' }
      ]
    },
    {
      id: 'cotm',
      name: 'COTM',
      icon: <FaBuilding />,
      color: 'from-amber-600 to-orange-700',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600',
      description: 'Construction Management and Technology.',
      videos: [
        { title: 'Project Management Basics', id: 's2s3s4s5', thumb: 'https://img.youtube.com/vi/HfACrKJ_Y2g/mqdefault.jpg' },
        { title: 'Construction Materials', id: 't6t7t8t9', thumb: 'https://img.youtube.com/vi/5m_5n_5o_5p/mqdefault.jpg' }
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
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">Exit Exam</span>
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
        <div className="space-y-3">
          {activeTab === 'exams' && (
            <>
              <div onClick={() => navigate(`/exit-exams/${subject.id}-2015`)} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">2015</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Exit Exam 2015</h4>
                    <p className="text-[10px] text-slate-500">Official Exam PDF</p>
                  </div>
                </div>
                <FaChevronRight className="text-slate-300 group-hover/item:text-blue-500 text-xs" />
              </div>
              <div onClick={() => navigate(isPremium ? `/exit-exams/${subject.id}-2016` : '/subscribe-premium')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">2016</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Exit Exam 2016</h4>
                    <p className="text-[10px] text-slate-500">Collected Questions</p>
                  </div>
                </div>
                {isPremium ? <FaChevronRight className="text-slate-300 text-xs" /> : <FaLock className="text-amber-500 text-xs" />}
              </div>
            </>
          )}

          {activeTab === 'mock' && (
            [1, 2].map(num => (
              <div key={num} onClick={() => navigate(isPremium ? `/exit-exams/${subject.id}-mock-${num}` : '/subscribe-premium')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 cursor-pointer transition-colors group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">M{num}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Mock Model {num}</h4>
                    <p className="text-[10px] text-slate-500">100 Questions (Timed)</p>
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
                      <FaVideo size={10} /> Watch Review
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaVideo className="text-purple-300" />
                </div>
                <p className="text-xs text-slate-400">Video reviews coming soon.</p>
              </div>
            )
          )}

          {activeTab === 'guide' && (
            <div onClick={() => window.open('#', '_blank')} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 cursor-pointer transition-colors group/item">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xs"><FaFileAlt /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Exam Blueprint</h4>
                  <p className="text-[10px] text-slate-500">Official Outline</p>
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 text-slate-900 pt-20 pb-20">

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-100/40 to-blue-100/40 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-100/40 to-teal-100/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
              <FaUniversity /> Professional Certification
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight leading-tight">
              Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Professional Future</span>.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              The ultimate Exit Exam preparation platform. Past papers, mock tests, and review materials for Engineering, Health, Law, and Computing.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="text-right hidden md:block">
              <p className="text-3xl font-black text-slate-900">50%</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pass Mark</p>
            </div>
            <div className="h-12 w-px bg-slate-200 hidden md:block" />
            <div className="text-right hidden md:block">
              <p className="text-3xl font-black text-slate-900">40+</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Programs</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar / Score Calculator */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mock Exam Score Tracker */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
              <div className="bg-slate-900 p-4 text-white text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Average Performance</p>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  {averageScore}%
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Target: &gt;50%</p>
              </div>
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider px-2 mb-2">
                  <span>Exam</span>
                  <span>Score</span>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto px-1">
                  {mockScores.map((mock, i) => (
                    <div key={i} className="flex gap-2 items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{mock.name}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={mock.score}
                          onChange={(e) => updateScore(i, parseInt(e.target.value) || 0)}
                          className={`w-12 bg-white border border-slate-200 rounded-md px-1 py-1 text-xs font-bold text-right outline-none focus:border-indigo-500 ${mock.score >= 50 ? 'text-green-600' : 'text-red-500'}`}
                          max={100}
                        />
                        <span className="text-[10px] text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                  Track Progress
                </button>
              </div>
            </div>

            {/* Premium Promo */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-6 rounded-3xl shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => navigate('/subscribe-premium')}>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 text-white/10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <FaCrown size={100} />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-4">
                    <FaCrown />
                  </div>
                  <h3 className="font-black text-white text-lg leading-tight mb-2">Unlock Mock Exams</h3>
                  <p className="text-cyan-100 text-xs font-medium mb-4 leading-relaxed">
                    Get access to 50+ MoE standard mock exams for your specific department.
                  </p>
                  <button className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                    Get Certified
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

export default ExitExams;
