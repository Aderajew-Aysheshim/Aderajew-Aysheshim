import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaCrown, FaLock, FaShieldAlt, FaRocket, FaChevronRight, FaArrowLeft, FaBrain, FaCheck } from 'react-icons/fa';
import PremiumWall from "../components/PremiumWall";

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumRequired, setPremiumRequired] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
    startExam();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && exam) {
      handleSubmit();
    }
  }, [timeLeft, exam]);

  const checkPremiumStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get('http://localhost:5000/api/students/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsPremium(response.data.student.subscriptionStatus === 'premium');
    } catch (error) {
      console.error("Error checking premium status:", error);
    }
  };

  const startExam = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/exit-exams/${id}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExam(response.data.exam);
      setStartedAt(response.data.startedAt);
      setTimeLeft(response.data.exam.duration * 60);
    } catch (error) {
      if (error.response?.status === 403) {
        setPremiumRequired(true);
      } else {
        alert(error.response?.data?.error || 'Failed to start exam');
        navigate('/exit-exams');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    if (submitting) return;
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = exam.questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered questions. Submit for analysis anyway?`)) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = exam.questions.map(q => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || ''
      }));

      const response = await axios.post(
        `http://localhost:5000/api/exit-exams/${id}/submit`,
        {
          answers: formattedAnswers,
          startedAt,
          completedAt: new Date()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/exit-exams/${id}/results`, { state: { results: response.data.attempt } });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit exam results');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (premiumRequired) {
    return (
      <div className="min-h-screen py-24 px-6 bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-300 transition-colors duration-500">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/exit-exams')}
            className="mb-12 flex items-center gap-3 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white font-black text-xs uppercase tracking-[0.2em] group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            RETURN TO ARCHIVE
          </button>
          <div className="text-center mb-16 animate-fadeIn">
            <div className="inline-flex p-6 bg-yellow-500/10 rounded-[40px] border border-yellow-500/20 mb-8 relative group">
              <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <FaCrown className="text-5xl text-yellow-500 relative z-10 animate-pulse" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 uppercase italic tracking-tighter"> Content Locked</h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              This terminal is restricted to Elite authorized accounts.
              Upgrade to access localized engineering blocks and expert verified blueprints.
            </p>
          </div>
          <PremiumWall limit={0} total={100} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0f1d] gap-6 transition-colors duration-500">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing Exam Instance...</p>
      </div>
    );
  }

  if (!exam) return null;

  const progress = (Object.keys(answers).length / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-300 pb-40 font-sans selection:bg-blue-500/30 transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Dynamic Header */}
        <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl sticky top-4 z-50 mb-8">
          <div className="flex items-center justify-between gap-8 flex-wrap">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                <FaShieldAlt className="text-3xl text-blue-500 dark:text-blue-400 group-hover:rotate-12 transition-all" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">{exam.title}</h1>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-1">{exam.department} • {exam.subject}</p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="text-right">
                <div className={`text-4xl font-black tracking-tighter ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`}>
                  {formatTime(timeLeft)}
                </div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1 italic">Time Remaining</p>
              </div>
              <div className="h-12 w-[1px] bg-slate-100 dark:bg-slate-800"></div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900 dark:text-white">{Object.keys(answers).length} / {exam.questions.length}</div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">Questions Answered</p>
              </div>
            </div>
          </div>

          <div className="mt-8 relative h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/10"></div>
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Stream */}
        <div className="space-y-10">
          {exam.questions.map((q, idx) => (
            <div key={q._id} className="group relative bg-white dark:bg-slate-900/30 backdrop-blur-2xl rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-700 shadow-lg">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 transition-colors"></div>

              <div className="flex items-start gap-8 mb-10">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-lg text-slate-400 dark:text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-slate-100 dark:border-slate-700/50">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-100 transition-colors">{q.questionText}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = answers[q._id] === letter;
                  return (
                    <label key={optIdx} className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.01] active:scale-95 ${isSelected ? 'bg-blue-600/5 dark:bg-blue-600/10 border-blue-500/50 dark:border-blue-500' : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-600 shadow-md'
                      }`}>
                      <input type="radio" disabled={submitting} checked={isSelected} onChange={() => handleAnswerSelect(q._id, letter)} className="hidden" />
                      <div className={`w-8 h-8 rounded-xl border-2 mr-6 flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-slate-700'}`}>
                        {isSelected && <FaCheck size={12} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase mb-1">Index {letter}</span>
                        <span className={`text-lg font-bold transition-colors ${isSelected ? 'text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{opt.text}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Global Submission Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-50 animate-slideUp">
          <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-[40px] p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-white/5 flex items-center gap-4">
            <div className="flex-1 px-4">
              <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 mb-1 uppercase">
                <FaBrain className="text-blue-500" /> Exam Progress
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white italic">
                {Object.keys(answers).length} <span className="text-slate-400 dark:text-slate-600 font-bold not-italic">/ {exam.questions.length} Questions</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-[2] py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black tracking-[0.4em] rounded-[24px] transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] dark:shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-95 text-xs flex items-center justify-center gap-4 group"
            >
              {submitting ? 'PROCESSING SUBMISSION...' : 'FINISH & SUBMIT RESULTS'}
              <FaChevronRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 40px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fadeIn { animation: fadeIn 1.2s ease-out forwards; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default TakeExam;
