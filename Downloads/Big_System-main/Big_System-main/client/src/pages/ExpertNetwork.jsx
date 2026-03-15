import React, { useState, useEffect } from 'react';
import {
  FaUserGraduate, FaShieldAlt, FaStar,
  FaCheckCircle, FaMapMarkerAlt, FaClock, FaBook, FaAward,
  FaFilter, FaSearch, FaUniversity, FaGraduationCap, FaVideo,
  FaCalendarAlt, FaLanguage, FaChevronRight, FaProjectDiagram
} from 'react-icons/fa';

const ExpertNetwork = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters matching Tutors page structure
  const [subjectFilter, setSubjectFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  const [selectedExpert, setSelectedExpert] = useState(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    filterExperts();
  }, [experts, searchTerm, subjectFilter, serviceTypeFilter]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      // Mock data enriched with tags for Grades, Projects, Assignments
      const mockExperts = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          title: 'Professor of Mathematics',
          institution: 'MIT',
          bio: '15+ years of teaching experience. Available for PhD thesis consultation and advanced calculus projects.',
          subjects: ['Mathematics', 'Calculus', 'Statistics', 'thesis', 'final-year-project'],
          serviceTypes: ['tutoring', 'project', 'consultation'],
          rating: 4.9,
          reviews: 234,
          hourlyRate: 75,
          languages: ['English', 'French'],
          location: 'Boston, MA',
          verified: true,
          available: true,
          expertise: ['Calculus', 'Linear Algebra', 'Thesis Support'],
          education: ['PhD Mathematics - MIT'],
          certifications: ['Advanced Teaching Certificate'],
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          videoIntro: true,
          responseTime: '2 hours'
        },
        {
          id: 2,
          name: 'Prof. Michael Chen',
          title: 'Physics Department Head',
          institution: 'Stanford University',
          bio: 'Expert in Physics. Can assist with Final Year Engineering Projects and Grade 12 Entrance Exam prep.',
          subjects: ['Physics', 'Engineering', 'grade-12', 'entrance-exam', 'final-year-project'],
          serviceTypes: ['tutoring', 'project'],
          rating: 4.8,
          reviews: 189,
          hourlyRate: 85,
          languages: ['English', 'Mandarin'],
          location: 'Palo Alto, CA',
          verified: true,
          available: true,
          expertise: ['Quantum Mechanics', 'Entrance Exam Prep'],
          education: ['PhD Physics - Caltech'],
          certifications: ['Excellence in Teaching Award'],
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          videoIntro: true,
          responseTime: '1 hour'
        },
        {
          id: 3,
          name: 'Mr. James Wilson',
          title: 'Senior High School Teacher',
          institution: 'International School',
          bio: 'Specialized in Grade 9-12 Chemistry and Biology. proven track record in student success.',
          subjects: ['Chemistry', 'Biology', 'grade-12', 'grade-11', 'grade-10', 'grade-9'],
          serviceTypes: ['tutoring'],
          rating: 4.9,
          reviews: 312,
          hourlyRate: 45,
          languages: ['English', 'Spanish'],
          location: 'Cambridge, MA',
          verified: true,
          available: false,
          expertise: ['Organic Chemistry', 'High School Science'],
          education: ['MS Education - Harvard'],
          certifications: ['Teaching Excellence Award'],
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          videoIntro: true,
          responseTime: '3 hours'
        },
        {
          id: 5,
          name: 'Dr. Lisa Anderson',
          title: 'Computer Science Professor',
          institution: 'CMU',
          bio: 'Can help with Software Development projects, AI assignments, and Coding interviews.',
          subjects: ['Computer Science', 'Programming', 'software-dev', 'assignment', 'AI'],
          serviceTypes: ['tutoring', 'project', 'assignment'],
          rating: 4.9,
          reviews: 278,
          hourlyRate: 90,
          languages: ['English', 'Python', 'Java'],
          location: 'Pittsburgh, PA',
          verified: true,
          available: true,
          expertise: ['Machine Learning', 'Project Support', 'Python'],
          education: ['PhD Computer Science - CMU'],
          certifications: ['Industry Innovation Award'],
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
          videoIntro: true,
          responseTime: '1 hour'
        },
        {
          id: 7,
          name: 'Eng. David Kim',
          title: 'Senior Network Engineer',
          institution: 'Cisco Systems',
          bio: 'Network design projects, Cisco Packet Tracer assignments, and certification prep.',
          subjects: ['Networking', 'Computer Science', 'Cybersecurity', 'final-year-project', 'assignment'],
          serviceTypes: ['project', 'consultation'],
          rating: 5.0,
          reviews: 112,
          hourlyRate: 95,
          languages: ['English', 'Korean'],
          location: 'San Jose, CA',
          verified: true,
          available: true,
          expertise: ['Cisco Networking', 'Network Security'],
          education: ['MS Computer Engineering - UC Berkeley'],
          certifications: ['CCIE', 'CISSP'],
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          videoIntro: true,
          responseTime: '30 mins'
        },
        {
          id: 8,
          name: 'Sarah Williams',
          title: 'Primary Education Specialist',
          institution: 'Local Academy',
          bio: 'Patient tutor for Elementary students (Grades 1-8). Basic Math, Science, and English.',
          subjects: ['Elementary', 'grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5', 'grade-6', 'grade-7', 'grade-8', 'Mathematics', 'English'],
          serviceTypes: ['tutoring'],
          rating: 4.7,
          reviews: 89,
          hourlyRate: 35,
          languages: ['English'],
          location: 'Chicago, IL',
          verified: true,
          available: true,
          expertise: ['Child Education', 'Basic Math', 'Reading'],
          education: ['BA Education - University of Illinois'],
          certifications: ['Certified Educator'],
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          videoIntro: false,
          responseTime: '4 hours'
        }
      ];

      setExperts(mockExperts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching experts:', error);
      setLoading(false);
    }
  };

  const filterExperts = () => {
    let filtered = [...experts];

    if (searchTerm) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        expert.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subjectFilter) {
      // Flexible matching: check if expert has the specific tag or broader category
      filtered = filtered.filter(expert =>
        expert.subjects.some(sub => sub.toLowerCase().includes(subjectFilter.toLowerCase()))
      );
    }

    if (serviceTypeFilter !== 'all') {
      filtered = filtered.filter(expert =>
        expert.serviceTypes && expert.serviceTypes.includes(serviceTypeFilter)
      );
    }

    setFilteredExperts(filtered);
  };

  const ExpertModal = ({ expert, onClose }) => {
    if (!expert) return null;

    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-[30px] border border-gray-200 dark:border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transition-colors duration-300">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/50 dark:to-purple-900/50 p-8 border-b border-gray-100 dark:border-white/5">
            <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
              <img
                src={expert.image}
                alt={expert.name}
                className="w-32 h-32 rounded-[30px] border-4 border-white dark:border-slate-800 shadow-2xl object-cover"
              />
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-2 mb-2">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase">{expert.name}</h2>
                  {expert.verified && (
                    <span className="bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded shadow-sm flex items-center gap-1 font-bold uppercase mb-2">
                      <FaShieldAlt /> VERIFIED
                    </span>
                  )}
                </div>
                <p className="text-lg text-blue-600 dark:text-blue-300 font-bold uppercase tracking-widest text-[10px] mb-2">{expert.title}</p>
                <p className="text-base text-gray-600 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2">
                  <FaUniversity className="text-blue-500" />
                  {expert.institution}
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-4xl font-black text-green-500 dark:text-green-400 italic tracking-tighter">${expert.hourlyRate}/hr</div>
                <div className="flex items-center justify-center md:justify-end space-x-2 text-gray-500 dark:text-slate-400 mt-2">
                  <FaStar className="text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white">{expert.rating}</span>
                  <span className="text-xs">({expert.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaUserGraduate className="text-blue-500" /> About
                </h3>
                <p className="text-gray-700 dark:text-slate-300 mb-8 leading-relaxed font-medium text-sm">{expert.bio}</p>

                <h3 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaBook className="text-blue-500" /> Expertise
                </h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {expert.expertise.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase">
                      {skill}
                    </span>
                  ))}
                  {expert.subjects.map((sub, index) => (
                    <span key={`sub-${index}`} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-bold uppercase">
                      {sub}
                    </span>
                  ))}
                </div>

                <h3 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-blue-500" /> Education
                </h3>
                <ul className="space-y-3 mb-8">
                  {expert.education.map((edu, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-sm" />
                      <span className="text-gray-700 dark:text-slate-300 text-sm font-medium">{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaAward className="text-blue-500" /> Certifications
                </h3>
                <ul className="space-y-3 mb-8">
                  {expert.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaAward className="text-yellow-500 mt-0.5 flex-shrink-0 text-sm" />
                      <span className="text-gray-700 dark:text-slate-300 text-sm font-medium">{cert}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaLanguage className="text-blue-500" /> Languages
                </h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {expert.languages.map((lang, index) => (
                    <span key={index} className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold uppercase">
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center text-gray-700 dark:text-slate-300 text-sm font-bold">
                    <FaMapMarkerAlt className="mr-3 text-red-500" />
                    <span>{expert.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-slate-300 text-sm font-bold">
                    <FaClock className="mr-3 text-blue-500" />
                    <span>Response time: {expert.responseTime}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-slate-300 text-sm font-bold">
                    <FaCalendarAlt className="mr-3 text-green-500" />
                    <span className={expert.available ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>
                      {expert.available ? 'Available for booking' : 'Currently unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-gray-200 dark:border-slate-700 mt-8">
              <button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 dark:hover:bg-purple-50 transition-all shadow-xl">
                Book Session - ${expert.hourlyRate}/hr
              </button>
              <button className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 dark:hover:bg-slate-700 transition-all border border-gray-200 dark:border-slate-700">
                Send Message
              </button>
              {expert.videoIntro && (
                <button className="px-8 py-4 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center hover:text-slate-900 dark:hover:text-white">
                  <FaVideo className="mr-2" />
                  Intro
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-300 font-sans pb-40 selection:bg-blue-500/30 font-medium transition-colors duration-300">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/40 dark:bg-purple-600/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-normal transform-gpu"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 dark:bg-blue-600/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-normal transform-gpu"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fadeIn">
          <div className="inline-flex p-4 bg-white dark:bg-purple-500/10 rounded-[20px] border border-gray-200 dark:border-purple-500/20 mb-6 relative group shadow-lg dark:shadow-none">
            <div className="absolute inset-0 bg-purple-400 blur-2xl opacity-0 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity"></div>
            <FaUserGraduate className="text-4xl text-purple-600 dark:text-purple-400 relative z-10 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase italic leading-none">
            EXPERT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400">NETWORK</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Connect with verified professors and industry leaders from top global institutions.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-16 relative z-10">
          {[
            { icon: <FaShieldAlt />, label: "VERIFIED", sub: "EXPERTS" },
            { icon: <FaUniversity />, label: "TOP TIER", sub: "INSTITUTIONS" },
            { icon: <FaAward />, label: "PREMIUM", sub: "QUALITY" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-4 rounded-2xl text-center group hover:border-purple-500/30 transition-all shadow-sm">
              <div className="text-2xl text-purple-600 dark:text-purple-500 mb-2 flex justify-center group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-xs font-black text-gray-900 dark:text-white tracking-widest">{stat.label}</div>
              <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 tracking-widest">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Search and Filters - EXACT MATCH to Tutors filter style */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 rounded-[30px] border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl mb-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="SEARCH EXPERTS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-10 text-xs font-bold text-gray-900 dark:text-slate-300 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-600 uppercase tracking-wide"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-gray-900 dark:text-slate-300 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all cursor-pointer uppercase tracking-wide appearance-none"
            >
              <option value="">ALL SUBJECTS & DOMAINS</option>
              <optgroup label="University Courses">
                <option value="Calculus">Calculus</option>
                <option value="Linear Algebra">Linear Algebra</option>
                <option value="Programming">Programming (Python/Java)</option>
                <option value="Engineering">Engineering & Networking</option>
                <option value="Economics">Economics</option>
              </optgroup>
              <optgroup label="Grade Levels">
                <option value="grade-12">Grade 12 (Entrance)</option>
                <option value="grade-11">Grade 11</option>
                <option value="grade-10">Grade 10</option>
                <option value="grade-9">Grade 9</option>
                <option value="elementary">Elementary (Grades 1-8)</option>
              </optgroup>
              <optgroup label="Projects & Tech">
                <option value="final-year-project">Final Year Project</option>
                <option value="thesis">Thesis Support</option>
                <option value="assignment">Assignment Help</option>
                <option value="software-dev">Software Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="AI">AI & Machine Learning</option>
              </optgroup>
            </select>

            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-gray-900 dark:text-slate-300 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all cursor-pointer uppercase tracking-wide appearance-none"
            >
              <option value="all">ALL SERVICES</option>
              <option value="tutoring">Course Tutoring</option>
              <option value="project">Project Assistance</option>
              <option value="assignment">Assignment Help</option>
              <option value="consultation">Consultation</option>
            </select>

            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              <FaFilter /> APPLY
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest">
            SHOWING <span className="text-gray-900 dark:text-white">{filteredExperts.length}</span> ELITE EXPERTS
          </p>
        </div>

        {/* Experts Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-black text-gray-500 dark:text-slate-600 uppercase tracking-widest">LOADING NETWORK...</p>
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="text-center py-32 bg-white/50 dark:bg-slate-900/30 rounded-[40px] border border-gray-200 dark:border-slate-800">
            <FaUserGraduate className="text-6xl text-gray-300 dark:text-slate-800 mx-auto mb-6" />
            <h3 className="text-xl font-black text-gray-200 dark:text-slate-500 uppercase tracking-widest">NO EXPERTS FOUND</h3>
            <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredExperts.map((expert) => (
              <div key={expert.id} className="group bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/5 hover:border-purple-500/30 p-4 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl dark:shadow-none flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-slate-700"
                    />
                    {expert.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-md p-0.5 shadow-sm border border-white dark:border-slate-900">
                        <FaShieldAlt size={8} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-0.5">{expert.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider truncate">{expert.title}</p>
                    <p className="text-[9px] font-medium text-gray-600 dark:text-slate-600 flex items-center gap-1 mt-1 truncate">
                      <FaUniversity className="text-purple-500/70" /> {expert.institution}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {expert.subjects.slice(0, 3).map((sub, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 text-[9px] font-bold uppercase rounded-md truncate max-w-[80px]">{sub}</span>
                  ))}
                  {expert.serviceTypes && expert.serviceTypes.includes('project') && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase rounded-md flex items-center gap-1"><FaProjectDiagram size={8} /> Project</span>
                  )}
                </div>

                {/* Stats */}
                <div className="bg-gray-50 dark:bg-slate-950/30 rounded-xl p-3 border border-gray-100 dark:border-white/5 mb-4 flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-gray-500 dark:text-slate-500 uppercase">RATE</span>
                    <span className="text-sm font-black text-green-500 dark:text-green-400">${expert.hourlyRate}<span className="text-[9px] text-gray-400 dark:text-slate-600 font-bold">/HR</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-500 dark:text-slate-500 uppercase">RATING</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-900 dark:text-white">
                      <FaStar className="text-yellow-500" /> {expert.rating} <span className="text-gray-500 dark:text-slate-600 font-medium">({expert.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 mt-auto">
                  <button
                    onClick={() => setSelectedExpert(expert)}
                    className="w-full py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-purple-50 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg text-center flex items-center justify-center gap-2"
                  >
                    VIEW PROFILE <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expert Modal */}
      <ExpertModal expert={selectedExpert} onClose={() => setSelectedExpert(null)} />

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ExpertNetwork;
