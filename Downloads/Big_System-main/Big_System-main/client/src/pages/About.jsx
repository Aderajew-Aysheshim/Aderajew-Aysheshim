import { Link } from 'react-router-dom';
import {
  FaRocket, FaUsers, FaGlobe, FaCertificate, FaShieldAlt, FaLightbulb,
  FaAward, FaGraduationCap, FaChalkboardTeacher, FaQuoteLeft, FaFile
} from 'react-icons/fa';
import { FiArrowRight, FiCheckCircle, FiPlay, FiTarget, FiZap } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
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
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-100 text-slate-900 dark:text-white leading-relaxed transition-colors duration-300">

      {/* --- HERO SECTION --- */}
      <section className="relative py-24 lg:py-32 px-6 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-denim.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-600/20 to-transparent blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-widest mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              ESTABLISHED 2024
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-8">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">AstraETX</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light mb-12 leading-relaxed max-w-4xl mx-auto transition-colors">
              Ethiopia's premier educational technology company, pioneering the future of digital learning and academic excellence across the nation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { number: '2.5K+', label: 'Expert Tutors', desc: 'Verified professionals' },
              { number: '10K+', label: 'Active Students', desc: 'Across Ethiopia' },
              { number: '98%', label: 'Success Rate', desc: 'Academic excellence' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-white/50 dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{stat.label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COMPANY OVERVIEW --- */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 text-xs font-semibold uppercase tracking-widest mb-6">
                COMPANY OVERVIEW
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white transition-colors mb-6 leading-tight">
                Pioneering Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Education</span> in Ethiopia
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors mb-8 leading-relaxed">
                AstraETX stands at the forefront of educational technology innovation in Ethiopia. Our platform seamlessly connects students with expert tutors, providing personalized learning experiences that transcend traditional educational boundaries.
              </p>
              <div className="space-y-4">
                {[
                  'Cutting-edge technology infrastructure',
                  'Rigorous tutor verification process',
                  'Adaptive learning algorithms',
                  'Comprehensive academic support system'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                    <span className="text-slate-700 dark:text-slate-300 transition-colors font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Founded', value: '2024', color: 'from-blue-600 to-indigo-600' },
                    { label: 'Headquarters', value: 'Addis Ababa', color: 'from-indigo-600 to-purple-600' },
                    { label: 'Team Size', value: '50+', color: 'from-purple-600 to-pink-600' },
                    { label: 'Focus', value: 'EdTech', color: 'from-pink-600 to-red-600' }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                      <div className={`text-xs font-semibold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${item.color} mb-2`}>
                        {item.label}
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/30 transition-colors">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-widest mb-8">
            CORE PRINCIPLES
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-400">Values</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The foundational principles that guide our mission to transform Ethiopian education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Excellence',
              desc: 'Uncompromising commitment to quality in every aspect of our educational ecosystem',
              icon: '01',
              color: 'from-blue-600 to-cyan-600'
            },
            {
              title: 'Innovation',
              desc: 'Continuously pushing boundaries to create transformative learning experiences',
              icon: '02',
              color: 'from-indigo-600 to-purple-600'
            },
            {
              title: 'Impact',
              desc: 'Measurable improvements in student outcomes and educational accessibility',
              icon: '03',
              color: 'from-purple-600 to-pink-600'
            }
          ].map((value, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
              <div className="relative bg-white p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} text-white text-2xl font-bold mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MISSION & VISION --- */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-denim-3.png')] opacity-5" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/10 to-transparent rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-sm">
              STRATEGIC DIRECTION
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Mission & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Vision</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Defining our purpose and charting the future of education in Ethiopia
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-10 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">M</div>
                <h3 className="text-2xl font-bold text-white">Mission</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg">
                To democratize quality education in Ethiopia by connecting students with expert tutors through innovative technology, ensuring every learner has access to world-class educational resources regardless of their geographical location.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-10 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">V</div>
                <h3 className="text-2xl font-bold text-white">Vision</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg">
                To become Africa's leading educational technology platform, transforming how millions of students learn across the continent through cutting-edge digital solutions and personalized learning experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-16 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-denim.png')] opacity-5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-600/20 to-transparent rounded-full blur-2xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Educational Journey?</span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join thousands of Ethiopian students who are already experiencing the future of education with AstraETX
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/tutors"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Find Expert Tutors
                </Link>
                {isRegOpen ? (
                  <Link
                    to="/register/tutor"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300"
                  >
                    Become a Tutor
                  </Link>
                ) : (
                  <div className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white/50 border border-white/10 rounded-xl font-semibold cursor-not-allowed">
                    Registration Closed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(-5px); } 50% { transform: translateY(5px); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default About;
