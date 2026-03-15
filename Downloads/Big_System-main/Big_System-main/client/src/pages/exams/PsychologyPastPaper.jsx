import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaClock, FaCalendar, FaFilePdf, FaLock, FaCrown } from 'react-icons/fa';
import axios from 'axios';

const PsychologyPastPaper = () => {
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

  const pastPapers = [
    {
      id: 1,
      title: "Psychology Final Exam - 2023",
      semester: "Fall Semester",
      date: "December 2023",
      duration: "3 Hours",
      type: "Final Exam",
      fileUrl: "/api/past-papers/psychology-2023-final.pdf",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Psychology Midterm Exam - 2023",
      semester: "Fall Semester",
      date: "October 2023",
      duration: "2 Hours",
      type: "Midterm Exam",
      fileUrl: "/api/past-papers/psychology-2023-midterm.pdf",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Psychology Final Exam - 2022",
      semester: "Spring Semester",
      date: "May 2022",
      duration: "3 Hours",
      type: "Final Exam",
      fileUrl: "/api/past-papers/psychology-2022-final.pdf",
      thumbnail: "/api/placeholder/400/250"
    }
  ];

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-pink-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 font-semibold">Loading Psychology Past Papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-pink-900 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all">
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Psychology Past Papers</h1>
              <p className="text-slate-400">AASTU Freshman Psychology Exam Archive</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastPapers.map((paper) => (
            <div key={paper.id} className="group relative bg-slate-900/30 backdrop-blur-2xl rounded-2xl border border-slate-700/40 overflow-hidden hover:bg-slate-800/30 hover:border-pink-500/30 transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <img src={paper.thumbnail} alt={paper.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-pink-600 text-white text-xs font-bold rounded-full">{paper.type}</span>
                </div>
                {!isPremium && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <FaLock className="text-4xl text-yellow-500 mb-3" />
                      <span className="text-white font-semibold">Premium Only</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">{paper.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <FaCalendar className="text-pink-400" />
                    <span>{paper.semester}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <FaClock className="text-pink-400" />
                    <span>{paper.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <FaFilePdf className="text-red-400" />
                    <span>{paper.date}</span>
                  </div>
                </div>
                <Link to={isPremium ? paper.fileUrl : "/subscribe-premium"} className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isPremium ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'}`}>
                  {isPremium ? (<><FaDownload />Download PDF</>) : (<><FaLock />Upgrade to Access</>)}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PsychologyPastPaper;
