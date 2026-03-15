import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaEdit, FaSave, FaTimes, FaBook, FaTrophy, FaClock, FaStar, FaShieldAlt, FaRocket, FaChevronRight, FaLock, FaBrain, FaHistory } from 'react-icons/fa';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedExams: 0,
    averageScore: 0,
    totalHours: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/students/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(response.data.student);
      setFormData(response.data.student);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Mock stats
    setStats({
      enrolledCourses: 5,
      completedExams: 12,
      averageScore: 85,
      totalHours: 48
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'Photo size must be less than 2MB', type: 'error' });
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    setUploadingPhoto(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await axios.post(
        'http://localhost:5000/api/students/profile/photo',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage({ text: 'Profile photo updated successfully!', type: 'success' });
      setPhotoFile(null);
      setPhotoPreview(null);
      fetchProfile();
    } catch (error) {
      setMessage({ text: 'Failed to upload photo.', type: 'error' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/students/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Profile details updated successfully!', type: 'success' });
      setEditing(false);
      fetchProfile();
    } catch (error) {
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0f1d] gap-6 transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-600 dark:text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] italic">Loading Profile...</p>
      </div>
    );
  }

  const isPremium = student?.subscriptionStatus === 'premium';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 pb-40 transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase italic tracking-tighter">
            STUDENT <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">PROFILE</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">MANAGE ACCOUNT SETTINGS AND PERFORMANCE</p>
        </div>

        {message.text && (
          <div className={`mb-12 p-6 rounded-[30px] border backdrop-blur-3xl animate-slideUp flex items-center gap-4 ${message.type === 'success'
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
            <div className={`p-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              {message.type === 'success' ? <FaShieldAlt /> : <FaTimes />}
            </div>
            <p className="font-bold italic uppercase tracking-widest text-[10px]">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-8 animate-slideUp">
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-3xl p-12 rounded-[50px] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <FaUser size={150} />
              </div>

              <div className="text-center mb-10 relative z-10">
                <div className="relative inline-block mb-8">
                  {photoPreview || student?.profilePhoto ? (
                    <img
                      src={photoPreview || `http://localhost:5000${student.profilePhoto}`}
                      alt="Profile"
                      className="w-40 h-40 rounded-[44px] object-cover border-2 border-blue-500/30 group-hover:border-blue-500 transition-all shadow-2xl"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-slate-800 rounded-[44px] flex items-center justify-center border-2 border-slate-700 shadow-inner group-hover:border-blue-500/30 transition-all">
                      <FaUser className="text-6xl text-slate-700 group-hover:text-blue-500/40 transition-all" />
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-[-10px] right-[-10px] bg-blue-600 text-white p-4 rounded-2xl cursor-pointer hover:bg-blue-500 transition-all shadow-xl active:scale-90"
                  >
                    <FaEdit size={14} />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                {photoFile && (
                  <div className="flex gap-4 justify-center mb-10">
                    <button
                      onClick={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="px-6 py-2.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-blue-500 transition-all disabled:opacity-50"
                    >
                      {uploadingPhoto ? 'UPLOADING...' : 'CONFIRM PHOTO'}
                    </button>
                    <button
                      onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                      className="px-6 py-2.5 bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-slate-700 transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                )}

                <h2 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-2">
                  {student?.firstName} {student?.lastName}
                </h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{student?.email}</p>
              </div>

              <div className="space-y-4 mb-10 relative z-10">
                {[
                  { label: "GRADE LEVEL", val: student?.gradeLevel || 'UNASSIGNED', icon: <FaGraduationCap /> },
                  { label: "ACCOUNT TYPE", val: isPremium ? 'PRO STUDENT' : 'STUDENT', icon: <FaShieldAlt />, premium: isPremium },
                  { label: "JOINED DATE", val: new Date(student?.createdAt).toLocaleDateString(), icon: <FaClock /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <span className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {item.icon} {item.label}
                    </span>
                    <span className={`text-[10px] font-black italic uppercase tracking-tighter ${item.premium ? 'text-yellow-500' : 'text-slate-300'}`}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  <FaEdit /> EDIT PROFILE
                </button>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "COURSES", val: stats.enrolledCourses, icon: <FaBook />, color: "blue" },
                { label: "EXAMS", val: stats.completedExams, icon: <FaTrophy />, color: "green" },
                { label: "SCORE", val: `${stats.averageScore}%`, icon: <FaStar />, color: "yellow" },
                { label: "HOURS", val: stats.totalHours, icon: <FaClock />, color: "purple" }
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-lg dark:shadow-none">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-${stat.color}-500/10 rounded-xl text-${stat.color}-400`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">{stat.val}</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* AASTU Freshman Exams Quick Access */}
            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <FaGraduationCap className="text-green-500" />
                AASTU FRESHMAN EXAMS
              </h3>
              <div className="space-y-3">
                <Link
                  to="/aastu-exams"
                  className="block bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-2xl p-4 hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                        <FaBook />
                      </div>
                      <div>
                        <div className="text-white font-bold">Past Papers</div>
                        <div className="text-slate-400 text-xs">65+ papers available</div>
                      </div>
                    </div>
                    <FaChevronRight className="text-slate-400" />
                  </div>
                </Link>

                <Link
                  to="/aastu-exams"
                  className="block bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-4 hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <FaBrain />
                      </div>
                      <div>
                        <div className="text-white font-bold">Practice Exams</div>
                        <div className="text-slate-400 text-xs">Interactive mock tests</div>
                      </div>
                    </div>
                    <FaChevronRight className="text-slate-400" />
                  </div>
                </Link>

                <Link
                  to="/aastu-exams"
                  className="block bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-4 hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <FaHistory />
                      </div>
                      <div>
                        <div className="text-white font-bold">Dashboard</div>
                        <div className="text-slate-400 text-xs">Track progress</div>
                      </div>
                    </div>
                    <FaChevronRight className="text-slate-400" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Profile Configuration */}
            <div className="lg:col-span-2 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              {editing ? (
                <div className="bg-slate-900/40 backdrop-blur-3xl p-16 rounded-[60px] border border-slate-800 shadow-2xl relative overflow-hidden">
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-12">EDIT PROFILE</h3>
                  <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {[
                        { name: 'firstName', label: 'FIRST NAME', icon: <FaUser />, placeholder: 'First Name' },
                        { name: 'lastName', label: 'LAST NAME', icon: <FaUser />, placeholder: 'Last Name' }
                      ].map((input) => (
                        <div key={input.name}>
                          <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 ml-4">{input.label}</label>
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600">{input.icon}</span>
                            <input
                              type="text"
                              name={input.name}
                              value={formData[input.name] || ''}
                              onChange={handleChange}
                              className="w-full bg-slate-800/40 border border-slate-700 rounded-[28px] py-5 pl-14 pr-8 text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold placeholder-slate-700"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 ml-4">PHONE NUMBER</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600"><FaPhone /></span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-800/40 border border-slate-700 rounded-[28px] py-5 pl-14 pr-8 text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 ml-4">GRADE LEVEL</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600"><FaGraduationCap /></span>
                          <select
                            name="gradeLevel"
                            value={formData.gradeLevel || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-800/40 border border-slate-700 rounded-[28px] py-5 pl-14 pr-8 text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold appearance-none"
                          >
                            <option value="">SELECT LEVEL</option>
                            <option value="6">Grade 6</option> <option value="7">Grade 7</option> <option value="8">Grade 8</option>
                            <option value="9">Grade 9</option> <option value="10">Grade 10</option> <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                            <option value="university-freshman">Freshman</option>
                            <option value="university-sophomore">Sophomore</option>
                            <option value="university-junior">Junior</option>
                            <option value="university-senior">Senior</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 flex flex-col md:flex-row gap-6">
                      <button type="submit" className="flex-1 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[30px] shadow-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                        <FaShieldAlt /> SAVE CHANGES
                      </button>
                      <button type="button" onClick={() => { setEditing(false); setFormData(student); }} className="flex-1 py-6 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] rounded-[30px] hover:bg-slate-700 transition-all flex items-center justify-center gap-3">
                        <FaTimes /> CANCEL
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Active Enrollments */}
                  <div className="bg-slate-900/40 backdrop-blur-3xl p-16 rounded-[60px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hover:opacity-10 transition-opacity"><FaRocket size={200} /></div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-12 flex items-center gap-6">
                      <FaShieldAlt className="text-blue-500" /> ACTIVE ENROLLMENTS
                    </h3>
                    <div className="space-y-4">
                      {[
                        { title: "Advanced Mathematics", desc: "Progress: 75% Complete", status: "STABLE", color: "blue" },
                        { title: "Physics Grade 12", desc: "Progress: 60% Complete", status: "OPERATIONAL", color: "indigo" }
                      ].map((node, i) => (
                        <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[40px] flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div>
                            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors">{node.title}</h4>
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{node.desc}</p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-${node.color}-500 border border-${node.color}-500/20`}>{node.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exam History */}
                  <div className="bg-slate-900/40 backdrop-blur-3xl p-16 rounded-[60px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-10 opacity-5 pointer-events-none hover:opacity-10 transition-opacity"><FaTrophy size={180} /></div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-12 flex items-center justify-end gap-6 text-right">
                      EXAM HISTORY <FaHistory className="text-indigo-500" />
                    </h3>
                    <div className="space-y-4">
                      {[
                        { title: "Computer Science Mock", date: "DEC 05", score: "85%", status: "SUCCESS" },
                        { title: "Economics Practice", date: "DEC 03", score: "90%", status: "SUCCESS" }
                      ].map((log, i) => (
                        <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[40px] flex items-center justify-between group hover:bg-white/10 transition-all flex-row-reverse">
                          <div className="text-right">
                            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors">{log.title}</h4>
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{log.date}</p>
                          </div>
                          <div className="flex items-center gap-10">
                            <div className="text-4xl font-black text-blue-500 italic tracking-tighter">{log.score}</div>
                            <span className="px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-green-500 border border-green-500/20">{log.status}</span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-10 text-center">
                        <Link to="/exit-exams" className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3">
                          VIEW FULL ARCHIVE <FaChevronRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
      </div>
    </div>
  );
};

export default StudentProfile;
