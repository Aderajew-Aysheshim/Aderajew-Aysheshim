import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaCrown, FaStar, FaBrain, FaCheckCircle, FaChevronRight, FaRocket, FaShieldAlt } from 'react-icons/fa';

const PremiumWall = ({ limit, total }) => {
  return (
    <div className="bg-gradient-to-br from-[#0a0f1d] to-[#1e293b] rounded-[60px] p-16 text-center text-white relative overflow-hidden shadow-2xl border border-white/5 mt-16 mb-24 animate-fadeIn group">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition-all duration-1000"></div>
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full group-hover:bg-purple-600/20 transition-all duration-1000"></div>

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center p-6 bg-white/5 rounded-[32px] mb-10 border border-white/10 backdrop-blur-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <FaLock className="text-5xl text-blue-400 group-hover:animate-pulse" />
        </div>

        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-[1.05]">
          ACCESS LEVEL: <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent italic uppercase">PRO REQUIRED</span>
        </h2>

        <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-xl font-medium leading-relaxed">
          Access restricted. You've viewed <span className="text-white font-black">{limit}</span> out of <span className="text-white font-black">{total}</span> resources.
          Upgrade your account to unlock the full resource collection and expert study materials.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-3xl mx-auto">
          {[
            { icon: <FaStar className="text-yellow-400" />, label: "FULL ACCESS", sub: "Thousands of Resources" },
            { icon: <FaBrain className="text-blue-400" />, label: "EXPERT SOLUTIONS", sub: "Step-by-step" },
            { icon: <FaRocket className="text-green-400" />, label: "PREMIUM ACCESS", sub: "Unlimited Downloads" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="text-3xl mb-4 flex justify-center">{item.icon}</div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white mb-1">{item.label}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.sub}</p>
            </div>
          ))}
        </div>

        <Link
          to="/subscribe-premium"
          className="group relative inline-flex items-center justify-center py-6 px-16 bg-white text-slate-900 font-black rounded-[30px] transition-all hover:scale-105 active:scale-95 text-xl shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative flex items-center gap-4">
            UPGRADE NOW <FaChevronRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </span>
        </Link>

        <div className="mt-12 flex items-center justify-center gap-4 opacity-50">
          <div className="h-[1px] w-12 bg-slate-700"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
            <FaShieldAlt className="text-blue-500" /> SECURE ACCESS GATEWAY
          </p>
          <div className="h-[1px] w-12 bg-slate-700"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default PremiumWall;
