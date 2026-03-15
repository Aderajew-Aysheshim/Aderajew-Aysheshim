import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaDownload, FaLock, FaFileAlt, FaStar, FaUnlock, FaSpinner,
  FaCrown, FaSearch, FaFilter, FaCheckCircle, FaGraduationCap,
  FaFilePdf, FaVideo, FaImage, FaArchive, FaUniversity, FaBookOpen
} from 'react-icons/fa';
import { FiDownload, FiSearch, FiLayers, FiFileText, FiTarget } from 'react-icons/fi';
import PremiumWall from "../components/PremiumWall";

const Resources = () => {
  const [activeTab, setActiveTab] = useState('free');
  const [resources, setResources] = useState({ free: [], premium: [] });
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const departments = [
    { id: 'all', label: 'ALL FILES' },
    { id: 'cs', label: 'COMP SCIENCE' },
    { id: 'programming', label: 'PROGRAMMING' },
    { id: 'mathematics', label: 'MATHEMATICS' },
    { id: 'physics', label: 'PHYSICS' },
    { id: 'chemistry', label: 'CHEMISTRY' },
    { id: 'engineering', label: 'ENGINEERING' },
    { id: 'freshman', label: 'FRESHMAN' },
    { id: 'exit', label: 'EXIT EXAMS' }
  ];

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchResources(), checkPremiumStatus()]);
      setLoading(false);
    };
    init();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get('http://localhost:5000/api/students/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsPremium(res.data.student.subscriptionStatus === 'premium');
      }
    } catch (e) { console.error(e); }
  };

  const fetchResources = async () => {
    try {
      // Try to fetch from API first, fallback to static data
      try {
        const [free, premium] = await Promise.all([
          axios.get('http://localhost:5000/api/resources?accessLevel=free'),
          axios.get('http://localhost:5000/api/resources?accessLevel=premium')
        ]);
        setResources({
          free: free.data.resources || [],
          premium: premium.data.resources || []
        });
      } catch (apiError) {
        // Fallback to static important resources
        const staticResources = getStaticResources();
        setResources(staticResources);
      }
    } catch (e) { console.error(e); }
  };

  const getStaticResources = () => {
    const importantResources = [
      // Computer Science & Programming Books
      {
        id: 1,
        title: "Head First Java",
        description: "Complete guide to Java programming with brain-friendly approach",
        type: "pdf",
        department: "programming",
        accessLevel: "free",
        file_size: 15728640, // 15MB
        file_url: "/resources/books/head-first-java.pdf",
        rating: 4.8,
        downloads: 1250
      },
      {
        id: 2,
        title: "Clean Code",
        description: "A handbook of agile software craftsmanship by Robert Martin",
        type: "pdf",
        department: "programming",
        accessLevel: "premium",
        file_size: 3145728, // 3MB
        file_url: "/resources/books/clean-code.pdf",
        rating: 4.9,
        downloads: 890
      },
      {
        id: 3,
        title: "Introduction to Algorithms",
        description: "Comprehensive algorithms textbook for computer science",
        type: "pdf",
        department: "cs",
        accessLevel: "premium",
        file_size: 15728640, // 15MB
        file_url: "/resources/books/introduction-to-algorithms.pdf",
        rating: 4.7,
        downloads: 650
      },
      {
        id: 4,
        title: "Data Structures and Algorithm Analysis",
        description: "Essential data structures and algorithms for programming",
        type: "pdf",
        department: "cs",
        accessLevel: "free",
        file_size: 8388608, // 8MB
        file_url: "/resources/books/data-structures.pdf",
        rating: 4.6,
        downloads: 1100
      },
      // Mathematics Books
      {
        id: 5,
        title: "Calculus Made Easy",
        description: "Simplified calculus textbook for engineering students",
        type: "pdf",
        department: "mathematics",
        accessLevel: "free",
        file_size: 5242880, // 5MB
        file_url: "/resources/books/calculus-made-easy.pdf",
        rating: 4.5,
        downloads: 980
      },
      {
        id: 6,
        title: "Linear Algebra Done Right",
        description: "Modern approach to linear algebra concepts",
        type: "pdf",
        department: "mathematics",
        accessLevel: "premium",
        file_size: 6291456, // 6MB
        file_url: "/resources/books/linear-algebra.pdf",
        rating: 4.8,
        downloads: 420
      },
      {
        id: 7,
        title: "Engineering Mathematics",
        description: "Comprehensive mathematics for engineering students",
        type: "pdf",
        department: "mathematics",
        accessLevel: "free",
        file_size: 10485760, // 10MB
        file_url: "/resources/books/engineering-mathematics.pdf",
        rating: 4.4,
        downloads: 1350
      },
      // Physics Books
      {
        id: 8,
        title: "Fundamentals of Physics",
        description: "Complete physics textbook for university students",
        type: "pdf",
        department: "physics",
        accessLevel: "free",
        file_size: 20971520, // 20MB
        file_url: "/resources/books/fundamentals-physics.pdf",
        rating: 4.7,
        downloads: 890
      },
      {
        id: 9,
        title: "University Physics",
        description: "Advanced physics concepts and applications",
        type: "pdf",
        department: "physics",
        accessLevel: "premium",
        file_size: 25165824, // 24MB
        file_url: "/resources/books/university-physics.pdf",
        rating: 4.8,
        downloads: 560
      },
      // Chemistry Books
      {
        id: 10,
        title: "Organic Chemistry",
        description: "Complete guide to organic chemistry for students",
        type: "pdf",
        department: "chemistry",
        accessLevel: "free",
        file_size: 15728640, // 15MB
        file_url: "/resources/books/organic-chemistry.pdf",
        rating: 4.5,
        downloads: 720
      },
      {
        id: 11,
        title: "Physical Chemistry",
        description: "Advanced physical chemistry concepts and applications",
        type: "pdf",
        department: "chemistry",
        accessLevel: "premium",
        file_size: 18874368, // 18MB
        file_url: "/resources/books/physical-chemistry.pdf",
        rating: 4.6,
        downloads: 380
      },
      // Engineering Books
      {
        id: 12,
        title: "Engineering Mechanics",
        description: "Statics and dynamics for engineering students",
        type: "pdf",
        department: "engineering",
        accessLevel: "free",
        file_size: 12582912, // 12MB
        file_url: "/resources/books/engineering-mechanics.pdf",
        rating: 4.4,
        downloads: 980
      },
      {
        id: 13,
        title: "Thermodynamics",
        description: "Engineering thermodynamics and heat transfer",
        type: "pdf",
        department: "engineering",
        accessLevel: "premium",
        file_size: 10485760, // 10MB
        file_url: "/resources/books/thermodynamics.pdf",
        rating: 4.7,
        downloads: 450
      },
      // Freshman Resources
      {
        id: 14,
        title: "Freshman Physics Guide",
        description: "Complete physics guide for freshman students",
        type: "pdf",
        department: "freshman",
        accessLevel: "free",
        file_size: 8388608, // 8MB
        file_url: "/resources/freshman/physics-guide.pdf",
        rating: 4.3,
        downloads: 1450
      },
      {
        id: 15,
        title: "Freshman Mathematics",
        description: "Essential mathematics for first-year students",
        type: "pdf",
        department: "freshman",
        accessLevel: "free",
        file_size: 6291456, // 6MB
        file_url: "/resources/freshman/mathematics.pdf",
        rating: 4.5,
        downloads: 1680
      },
      // Exit Exam Resources
      {
        id: 16,
        title: "Exit Exam Preparation Guide",
        description: "Comprehensive guide for university exit exams",
        type: "pdf",
        department: "exit",
        accessLevel: "premium",
        file_size: 15728640, // 15MB
        file_url: "/resources/exit/preparation-guide.pdf",
        rating: 4.8,
        downloads: 890
      },
      {
        id: 17,
        title: "Exit Exam Past Papers",
        description: "Collection of past exit exam papers with solutions",
        type: "pdf",
        department: "exit",
        accessLevel: "premium",
        file_size: 20971520, // 20MB
        file_url: "/resources/exit/past-papers.pdf",
        rating: 4.9,
        downloads: 1200
      }
    ];

    const freeResources = importantResources.filter(r => r.accessLevel === 'free');
    const premiumResources = importantResources.filter(r => r.accessLevel === 'premium');

    return {
      free: freeResources,
      premium: premiumResources
    };
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type?.includes('video')) return <FaVideo className="text-blue-500" />;
    if (type?.includes('image')) return <FaImage className="text-emerald-500" />;
    return <FaArchive className="text-slate-400" />;
  };

  const filteredResources = (activeTab === 'free' ? resources.free : resources.premium).filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || r.department?.toLowerCase() === selectedDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-100 text-white pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-100/40 to-blue-100/40 blur-3xl" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-50 to-teal-50 blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* --- HEADER --- */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest mb-8">
            <FaCheckCircle className="text-emerald-500" /> MoE & AASTU Verified Archive
          </div>
          <h1 className="text-6xl md:text-[5rem] font-black tracking-tighter leading-none mb-8 uppercase italic">
            KNOWLEDGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">CENTRAL.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto italic">
            "The definitive repository for Ethiopia's engineering and academic elite."
          </p>
        </div>

        {/* --- ACCESS TABS --- */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-2 bg-white/80 backdrop-blur-xl rounded-[32px] border border-slate-100 shadow-2xl">
            <button
              onClick={() => setActiveTab('free')}
              className={`px-10 py-4 rounded-[24px] font-black text-xs tracking-widest transition-all flex items-center gap-3 ${activeTab === 'free' ? 'bg-indigo-600 text-white shadow-xl translate-y-[-2px]' : 'text-slate-400 hover:text-indigo-600'}`}
            >
              <FaUnlock /> OPEN ACCESS
            </button>
            <button
              onClick={() => alert('PRO Library - Coming Soon!\n\nWe\'re working hard to bring you premium content. Stay tuned!')}
              className={`px-10 py-4 rounded-[24px] font-black text-xs tracking-widest transition-all flex items-center gap-3 text-slate-400 hover:text-slate-600 cursor-not-allowed relative`}
            >
              <FaCrown className="text-yellow-400" /> PRO LIBRARY
              <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-black bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">SOON</span>
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-10 py-4 rounded-[24px] font-black text-xs tracking-widest transition-all flex items-center gap-3 ${activeTab === 'marketplace' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl translate-y-[-2px]' : 'text-slate-400 hover:text-purple-600'}`}
            >
              <FaArchive /> MARKETPLACE
            </button>
          </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-[40px] border border-white shadow-xl mb-16 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-xl" />
              <input
                type="text"
                placeholder="Search archives (e.g. Civil 2015, Math 1007)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${selectedDept === dept.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-50 hover:border-indigo-200'}`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- CONTENT --- */}
        {activeTab === 'premium' && !isPremium ? (
          <div className="animate-fadeIn">
            <div className="bg-slate-900 rounded-[60px] p-12 mb-16 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5"><FaCrown size={180} /></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                <div>
                  <h3 className="text-3xl font-black uppercase mb-2">UNLOCK THE VAULT</h3>
                  <p className="text-slate-400 font-medium italic">"Access 15,000+ premium exit exam solutions and department blueprints."</p>
                </div>
                <a href="/subscribe-premium" className="px-12 py-5 bg-white text-slate-900 rounded-[28px] font-black tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5">UPGRADE NOW</a>
              </div>
            </div>
            <PremiumWall limit={0} total={resources.premium.length || "15,000+"} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.length > 0 ? (
              filteredResources.map((res, i) => (
                <div key={res.id} className="group bg-white rounded-[48px] p-10 border border-slate-50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-5 bg-slate-50 rounded-[32px] text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      {getFileIcon(res.type)}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg">VERIFIED</span>
                      <span className="text-[10px] font-bold text-slate-300 italic uppercase">ID: HUB-{res.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase leading-tight tracking-tighter group-hover:text-indigo-600 transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10 line-clamp-3 italic">
                    "{res.description || "High-precision academic resource validated for the 2017/2018 Ministry curriculum."}"
                  </p>

                  <div className="mt-auto space-y-4">
                    {/* Rating and Downloads */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[28px]">
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        <span className="text-xs font-black text-slate-900">{res.rating || 4.5}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiDownload className="text-indigo-500" />
                        <span className="text-xs font-black text-slate-900">{res.downloads || 0}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Downloads</span>
                      </div>
                    </div>

                    {/* File Size */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[28px]">
                      <div className="flex items-center gap-2">
                        <FiLayers className="text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Size</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">{(res.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>

                    {/* Department Badge */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[28px]">
                      <div className="flex items-center gap-2">
                        <FaUniversity className="text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</span>
                      </div>
                      <span className="text-xs font-black text-slate-900 uppercase">
                        {departments.find(d => d.id === res.department)?.label || res.department}
                      </span>
                    </div>

                    <button
                      onClick={() => window.open(res.file_url.startsWith('http') ? res.file_url : `http://localhost:5000${res.file_url}`, '_blank')}
                      className="w-full py-6 rounded-[30px] bg-slate-950 text-white font-black tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl translate-y-0 group-hover:translate-y-[-2px]"
                    >
                      <FiDownload size={18} /> DOWNLOAD PORTAL
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 text-center opacity-20">
                <FaArchive size={100} className="mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Archive Empty</h3>
              </div>
            )}
          </div>
        )}

        {/* --- MARKETPLACE COMING SOON --- */}
        {activeTab === 'marketplace' && (
          <div className="animate-fadeIn">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-[60px] p-16 mb-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <FaArchive size={200} />
              </div>
              <div className="absolute bottom-0 left-0 p-12 opacity-10">
                <FaArchive size={150} />
              </div>

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-black uppercase tracking-widest mb-8">
                  <FaArchive /> COMING SOON
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                  AstraETX <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Marketplace</span>
                </h2>
                <p className="text-xl text-purple-100 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
                  Get ready for Ethiopia's premier educational marketplace! Buy and sell textbooks, study materials, lab equipment, and more. Connect with students nationwide.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {[
                    { icon: <FaBookOpen />, title: "Textbooks", desc: "New and used academic books" },
                    { icon: <FaFileAlt />, title: "Notes", desc: "Premium study materials" },
                    { icon: <FaArchive />, title: "Equipment", desc: "Lab and engineering tools" }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <h3 className="text-lg font-black mb-2">{item.title}</h3>
                      <p className="text-sm text-purple-100">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => {
                      const email = 'support@astraetx.com';
                      const subject = 'Marketplace Interest';
                      const body = 'Hi! I\'m interested in the AstraETX Marketplace when it launches.';
                      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }}
                    className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl"
                  >
                    GET NOTIFIED
                  </button>
                  <div className="flex items-center gap-2 text-purple-200">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm">Launching Soon</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-20">
              <FaArchive className="text-6xl text-purple-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-4">Something Amazing is Coming</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                The AstraETX Marketplace will revolutionize how Ethiopian students buy, sell, and trade educational resources.
                Stay tuned for the launch!
              </p>
            </div>
          </div>
        )}

        {/* --- FOOTER FEATURES --- */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Localized Accuracy", icon: <FaUniversity />, desc: "Content specifically calibrated for AAU, AASTU, and ASTU Engineering streams." },
            { title: "Exit Exam Models", icon: <FiTarget />, desc: "The definitive source for Ministry-approved exit exam blueprints and models." },
            { title: "Graduate Standard", icon: <FaGraduationCap />, desc: "Graduate-level aptitude and NGAT materials verified by faculty members." }
          ].map((f, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl mx-auto mb-8 text-indigo-500 group-hover:scale-110 group-hover:rotate-6 transition-all">{f.icon}</div>
              <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{f.title}</h4>
              <p className="text-sm font-medium text-slate-400 italic px-4 leading-relaxed line-clamp-2">"{f.desc}"</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Resources;
