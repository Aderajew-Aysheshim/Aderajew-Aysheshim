import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaTrophy, FaClock, FaCheckCircle, FaTimesCircle, FaChartLine, FaRedo, FaArrowLeft, FaShieldAlt, FaRocket, FaFlagCheckered, FaBrain, FaGlobe, FaHistory } from 'react-icons/fa';

const ExamResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results) {
    navigate('/exit-exams');
    return null;
  }

  const { score, percentage, passed, timeSpent, totalQuestions, correctAnswers } = results;

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 font-sans pb-40 selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full transition-all duration-1000 ${passed ? 'bg-green-600/10' : 'bg-red-600/10'}`}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-24">
        {/* Navigation */}
        <div className="mb-12">
          <button onClick={() => navigate('/exit-exams')} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            BACK TO EXAM HUB
          </button>
        </div>

        {/* Hero Header */}
        <div className={`relative overflow-hidden rounded-[60px] p-16 text-center shadow-2xl border-2 transition-all duration-1000 mb-16 animate-fadeIn ${passed ? 'bg-green-600/10 border-green-500/30 shadow-green-500/10' : 'bg-red-600/10 border-red-500/30 shadow-red-500/10'
          }`}>
          <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none`}>
            {passed ? <FaTrophy size={200} /> : <FaFlagCheckered size={200} />}
          </div>

          <div className="relative z-10">
            <div className={`inline-flex p-8 rounded-[40px] mb-10 border shadow-2xl transition-all duration-700 hover:scale-110 ${passed ? 'bg-green-500 text-white border-green-400 rotate-12' : 'bg-red-500 text-white border-red-400 rotate-[-12deg]'
              }`}>
              {passed ? <FaTrophy size={48} /> : <FaTimesCircle size={48} />}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
              {passed ? 'EXAM <span className="text-green-400">PASSED</span>' : 'EXAM <span className="text-red-400">RETRY</span>'}
            </h1>
            <p className={`text-xl font-bold uppercase tracking-[0.3em] mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
              {passed ? 'Exam Goal Achieved' : 'Improvement Needed'}
            </p>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium italic">
              {passed
                ? "Your performance matches the professional academic standard. You've successfully finished the exam."
                : "Performance below threshold. Your preparation requires further study before re-taking."}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-3xl rounded-[50px] p-12 border border-slate-800 text-center shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-all"></div>
            <p className="text-slate-500 font-black tracking-[0.4em] uppercase text-[10px] mb-8">Score Breakdown</p>
            <div className="relative inline-block">
              <div className={`text-8xl font-black tracking-tighter italic ${passed ? 'text-green-400' : 'text-red-400'}`}>
                {percentage}<span className="text-3xl text-slate-700 not-italic ml-2">%</span>
              </div>
              <div className="absolute -bottom-4 right-0 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                Term Accuracy
              </div>
            </div>
            <p className="mt-10 text-slate-400 font-bold uppercase tracking-widest text-xs italic">RESULTS VERIFIED</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-8">
            {[
              { icon: <FaCheckCircle className="text-green-400" />, val: correctAnswers, label: "Questions Correct", color: "green" },
              { icon: <FaTimesCircle className="text-red-400" />, val: totalQuestions - correctAnswers, label: "Questions Failed", color: "red" },
              { icon: <FaClock className="text-blue-400" />, val: `${timeSpent}m`, label: "Processing Time", color: "blue" },
              { icon: <FaChartLine className="text-purple-400" />, val: score, label: "Point Results", color: "purple" }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/20 backdrop-blur-2xl rounded-[40px] p-10 border border-slate-800 hover:border-slate-700 transition-all shadow-xl group">
                <div className="flex items-center gap-6">
                  <div className={`p-4 bg-${stat.color}-500/10 rounded-2xl border border-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white italic tracking-tighter">{stat.val}</div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[50px] border border-slate-800 p-12 lg:p-16 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><FaBrain size={120} /></div>
          <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
            <FaShieldAlt /> EXAM PERFORMANCE ANALYSIS
          </h3>

          <div className="space-y-12">
            <div className="group">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest block mb-2">Accuracy Report</span>
                  <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Overall Accuracy</h4>
                </div>
                <span className="text-4xl font-black text-blue-400 italic">{(correctAnswers / totalQuestions * 100).toFixed(1)}%</span>
              </div>
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-1">
                <div className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-1000" style={{ width: `${(correctAnswers / totalQuestions * 100)}%` }}></div>
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest block mb-2">Topic Mastery</span>
                  <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Final Result</h4>
                </div>
                <span className={`text-4xl font-black italic ${passed ? 'text-green-400' : 'text-red-400'}`}>{percentage}%</span>
              </div>
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-1">
                <div className={`h-full rounded-full shadow-lg transition-all duration-1000 ${passed ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'}`} style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
          <Link to="/exit-exams" className="group flex items-center justify-center gap-4 py-8 bg-slate-900 border border-slate-800 rounded-[30px] font-black text-[10px] tracking-[0.3em] uppercase text-slate-500 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all shadow-xl">
            <FaGlobe /> EXAM HUB
          </Link>
          <Link to="/profile" className="group flex items-center justify-center gap-4 py-8 bg-slate-900 border border-slate-800 rounded-[30px] font-black text-[10px] tracking-[0.3em] uppercase text-slate-500 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all shadow-xl">
            <FaHistory /> HISTORY
          </Link>
          <button onClick={() => navigate(-2)} className="group flex items-center justify-center gap-4 py-8 bg-white rounded-[30px] font-black text-[10px] tracking-[0.4em] uppercase text-slate-900 hover:bg-blue-50 transition-all shadow-2xl active:scale-95">
            <FaRedo className="group-hover:rotate-180 transition-transform duration-700" /> RETAKE EXAM
          </button>
        </div>

        {/* Institutional Baseline */}
        <div className="mt-24 flex items-center justify-center gap-12 opacity-30">
          <div className="flex items-center gap-3 font-black text-[9px] tracking-widest italic"><FaRocket /> QUICK ANALYSIS</div>
          <div className="flex items-center gap-3 font-black text-[9px] tracking-widest italic"><FaShieldAlt /> VERIFIED GUIDE</div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ExamResults;
