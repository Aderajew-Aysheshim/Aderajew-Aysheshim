import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaCrown, FaCheckCircle, FaTimesCircle, FaCheck, FaChevronRight, FaHistory, FaLock, FaGlobe } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PremiumWall from "../components/PremiumWall";

const anthropologyQuestions = [
  { id: 1, type: "tf", question: "Anthropology is the study of humans, past and present.", answer: true, explanation: "It is the comprehensive study of human biological and cultural diversity." },
  { id: 2, type: "tf", question: "Cultural anthropology focuses solely on biological differences.", answer: false, explanation: "Biological anthropology focuses on biology; Cultural anthropology focuses on societies and culture." },
  { id: 3, type: "tf", question: "Archaeology is a subfield of anthropology.", answer: true, explanation: "It is one of the four main subfields, along with cultural, biological, and linguistic anthropology." },
  { id: 4, type: "tf", question: "Linguistic anthropology studies human language in social contexts.", answer: true, explanation: "It examines how language shapes communication and social identity." },
  { id: 5, type: "tf", question: "Physical anthropology is unrelated to evolution.", answer: false, explanation: "Human evolution is a core component of physical (biological) anthropology." },
  { id: 6, type: "mcq", options: ["Franz Boas", "Bronislaw Malinowski", "Margaret Mead", "Claude Lévi-Strauss"], question: "Which anthropologist is known for participant observation?", answer: "Bronislaw Malinowski", explanation: "His work in the Trobriand Islands revolutionized fieldwork methods." },
  { id: 7, type: "mcq", options: ["Cultural anthropology", "Physical anthropology", "Linguistic anthropology", "Applied anthropology"], question: "Which subfield studies human fossils and skeletal remains?", answer: "Physical anthropology", explanation: "Also known as biological anthropology, it includes paleoanthropology." },
  { id: 8, type: "mcq", options: ["A statistical survey", "A detailed cultural study", "A linguistic analysis", "A biological experiment"], question: "Ethnography is best described as:", answer: "A detailed cultural study", explanation: "It is the primary research product of cultural anthropology." },
  { id: 9, type: "mcq", options: ["Culture", "Society", "Ethnicity", "Gene"], question: "Which term refers to the shared beliefs, norms, and values of a group?", answer: "Culture", explanation: "Culture is the learned and shared system of meaning." },
  { id: 10, type: "mcq", options: ["Cultural", "Physical", "Linguistic", "Applied"], question: "The study of human evolution primarily falls under which subfield?", answer: "Physical", explanation: "Biological/Physical anthropology tracks human adaptation and evolution." },
  { id: 11, type: "mcq", options: ["Margaret Mead", "Franz Boas", "Claude Lévi-Strauss", "Edward Tylor"], question: "Which anthropologist studied gender roles in Samoa?", answer: "Margaret Mead", explanation: "Her book 'Coming of Age in Samoa' explored cultural vs biological destiny." },
  { id: 12, type: "mcq", options: ["Research for practical solutions", "Studying fossils", "Observing rituals", "Language preservation"], question: "Applied anthropology is mainly concerned with:", answer: "Research for practical solutions", explanation: "It uses anthropological findings to solve real-world problems." },
  { id: 13, type: "fill", question: "The scientific study of human language is called __________.", answer: "Linguistics", explanation: "Linguistics is the structured study of language patterns." },
  { id: 14, type: "fill", question: "__________ anthropology studies the physical and biological development of humans.", answer: "Physical", explanation: "Also referred to as biological anthropology." },
  { id: 15, type: "fill", question: "The practice of living among a community to study its culture is called __________.", answer: "Participant observation", explanation: "This is the hallmark method of anthropological fieldwork." },
  { id: 16, type: "fill", question: "__________ are inherited traits passed from one generation to another.", answer: "Genes", explanation: "Genetic inheritance is central to biological anthropology." },
  { id: 17, type: "short", question: "Define culture in anthropology.", answer: "Learned behavior", explanation: "A system of shared meanings, symbols, and behaviors." },
  { id: 18, type: "short", question: "What is the difference between society and culture?", answer: "People vs Way of Life", explanation: "Society is the group; culture is the shared software of that group." },
  { id: 19, type: "short", question: "Explain the main focus of linguistic anthropology.", answer: "Language and Society", explanation: "How language affects social life and vice versa." },
  { id: 20, type: "short", question: "Give an example of applied anthropology.", answer: "Medical anthropology", explanation: "Helping healthcare providers understand cultural barriers to treatment." },
];

export default function AnthropologyQuiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsPremium(false);
          setLoadingProfile(false);
          return;
        }
        const response = await axios.get('http://localhost:5000/api/students/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsPremium(response.data.student.subscriptionStatus === 'premium');
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      } finally {
        setLoadingProfile(false);
      }
    };
    checkPremiumStatus();
  }, []);

  const handleChange = (qid, option) => {
    if (submitted) return;
    setAnswers({ ...answers, [qid]: option });
  };

  const toggleReveal = (qid) => {
    setRevealedAnswers(prev => ({ ...prev, [qid]: !prev[qid] }));
  };

  const demoLimit = 10;
  const displayQuestions = isPremium ? anthropologyQuestions : anthropologyQuestions.slice(0, demoLimit);
  const score = displayQuestions.filter((q) => answers[q.id] === q.answer).length;

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] uppercase tracking-widest text-[10px] font-black text-slate-500 italic">
        Loading Anthropology Quiz...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 pb-40 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16 bg-slate-900/40 backdrop-blur-3xl p-12 rounded-[50px] border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaGlobe size={150} />
          </div>
          <div className="flex items-center gap-10 text-center md:text-left flex-col md:flex-row">
            <div className="p-6 bg-teal-600/10 rounded-[32px] border border-teal-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <FaGlobe className="text-5xl text-teal-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3 leading-none uppercase italic">
                Anthropology <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Exam Simulator</span>
              </h1>
              <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Department of Social Sciences • Institutional Resource</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            {isPremium ? (
              <span className="px-5 py-2 bg-yellow-400/10 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-yellow-500/20 flex items-center gap-2">
                <FaCrown className="animate-bounce" /> PRO AUTHORIZED
              </span>
            ) : (
              <Link to="/subscribe-premium" className="px-5 py-2 bg-slate-800/80 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-700 flex items-center gap-2 hover:bg-slate-700 hover:text-white transition-all">
                <FaLock /> TRIAL VERSION
              </Link>
            )}
          </div>
        </div>

        {/* Question Stream */}
        <div className="space-y-12">
          {displayQuestions.map((q, idx) => (
            <div key={q.id} className="group relative bg-slate-900/30 backdrop-blur-2xl rounded-[44px] p-12 border border-slate-800 hover:border-teal-500/30 transition-all duration-700 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-600/20 group-hover:bg-teal-600 transition-colors"></div>

              <div className="flex items-start gap-8 mb-10">
                <div className="flex-shrink-0 w-14 h-14 bg-slate-800 rounded-[24px] flex items-center justify-center font-black text-xl text-slate-500 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-inner border border-slate-700/50">
                  {q.id.toString().padStart(2, '0')}
                </div>
                <h3 className="text-2xl font-bold text-white leading-relaxed tracking-tight group-hover:text-teal-200 transition-colors">{q.question}</h3>
              </div>

              {q.type === "mcq" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[q.id] === opt;
                    const isCorrect = q.answer === opt;
                    return (
                      <label
                        key={optIdx}
                        className={`relative flex items-center p-8 rounded-[36px] border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-95 ${isSelected ? 'bg-teal-600/10 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.15)]' : 'bg-slate-800/20 border-slate-800 hover:border-slate-600'
                          } ${submitted && isCorrect ? 'border-green-500 bg-green-500/5' : ''} ${submitted && isSelected && !isCorrect ? 'border-red-500 bg-red-500/5' : ''}`}
                      >
                        <input type="radio" disabled={submitted} checked={isSelected} onChange={() => handleChange(q.id, opt)} className="hidden" />
                        <div className={`w-10 h-10 rounded-[14px] border-2 mr-6 flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-teal-600 border-teal-600 text-white rotate-[360deg]' : 'border-slate-700 bg-slate-800/50'}`}>
                          {isSelected && <FaCheck size={14} />}
                        </div>
                        <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-400'} transition-colors`}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.type === "tf" && (
                <div className="flex gap-6 mb-10">
                  {[true, false].map((val) => {
                    const isSelected = answers[q.id] === val;
                    const isCorrect = q.answer === val;
                    return (
                      <label key={val.toString()} className={`flex-1 relative flex items-center justify-center p-8 rounded-[36px] border-2 cursor-pointer transition-all duration-500 ${isSelected ? 'bg-teal-600/10 border-teal-500' : 'bg-slate-800/20 border-slate-800 hover:border-slate-600'
                        } ${submitted && isCorrect ? 'border-green-500' : ''}`}>
                        <input type="radio" disabled={submitted} checked={isSelected} onChange={() => handleChange(q.id, val)} className="hidden" />
                        <span className="font-black text-xl uppercase italic tracking-widest">{val ? 'True' : 'False'}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {(q.type === "fill" || q.type === "short") && (
                <div className="mb-10">
                  <div className="p-8 bg-slate-800/20 rounded-[36px] border border-slate-800 text-slate-500 font-black italic uppercase tracking-widest text-xs">
                    Quiz Input Active ... Use review for validation.
                  </div>
                </div>
              )}

              {submitted && (
                <div className="animate-fadeIn pt-8 border-t border-slate-800/50">
                  <button onClick={() => toggleReveal(q.id)} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-teal-400 hover:text-teal-300 transition-all mb-6 group/btn">
                    {revealedAnswers[q.id] || showAnswers ? 'HIDE EXPLANATION' : 'REVEAL EXPLANATION'}
                    <FaChevronRight className={`transition-transform duration-500 ${revealedAnswers[q.id] || showAnswers ? 'rotate-90' : 'group-hover/btn:translate-x-2'}`} />
                  </button>
                  {(showAnswers || revealedAnswers[q.id]) && (
                    <div className="p-10 bg-slate-800/20 rounded-[40px] border border-slate-700/50 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-2 h-full ${answers[q.id] === q.answer ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div className="flex items-center gap-4 mb-6">
                        <span className={`px-4 py-1.5 ${answers[q.id] === q.answer ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} text-[10px] font-black uppercase tracking-widest rounded-full border border-current flex items-center gap-2`}>
                          {answers[q.id] === q.answer ? <FaCheckCircle /> : <FaTimesCircle />} {answers[q.id] === q.answer ? 'CORRECT' : 'INCORRECT'}
                        </span>
                        <span className="text-white font-black text-xs uppercase tracking-widest">Correction: <span className="text-teal-400">{String(q.answer).toUpperCase()}</span></span>
                      </div>
                      <p className="text-slate-400 font-bold text-lg leading-relaxed italic"><span className="text-slate-300 font-black not-italic uppercase text-[11px] tracking-widest block mb-1 opacity-60">Anthropology Module Explanation:</span> "{q.explanation}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {!isPremium && <PremiumWall limit={demoLimit} total={anthropologyQuestions.length} />}
        </div>

        {/* Global Control Bar */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-50 animate-slideUp">
          <div className="bg-slate-900/60 backdrop-blur-[40px] p-6 rounded-[36px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 flex items-center gap-6 group">
            <button onClick={() => navigate(-1)} className="p-6 bg-slate-800 rounded-[24px] text-slate-500 hover:bg-slate-700 hover:text-white transition-all active:scale-90 shadow-xl border border-slate-700/50">
              <FaArrowLeft />
            </button>

            {!submitted ? (
              <button onClick={() => setSubmitted(true)} className="flex-1 py-6 bg-teal-600 hover:bg-teal-500 text-white font-black tracking-[0.4em] rounded-[24px] transition-all shadow-[0_20px_40px_rgba(20,184,166,0.3)] hover:scale-[1.02] active:scale-95 text-xs">
                SUBMIT & VIEW SCORE
              </button>
            ) : (
              <div className="flex-1 flex items-center justify-between gap-10 px-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                    <FaHistory /> SCORE RECORD
                  </span>
                  <span className="text-2xl font-black text-white italic">
                    {score} / {displayQuestions.length} <span className="text-teal-500 not-italic text-sm ml-2">({Math.round(score / displayQuestions.length * 100)}%)</span>
                  </span>
                </div>
                <button onClick={() => setShowAnswers(!showAnswers)} className="py-5 px-10 bg-white text-slate-900 font-black text-[10px] tracking-widest rounded-[20px] hover:bg-slate-200 transition-all active:scale-95 shadow-2xl">
                  {showAnswers ? 'HIDE ALL ANSWERS' : 'REVIEW FULL ANALYSIS'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 50px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
}
