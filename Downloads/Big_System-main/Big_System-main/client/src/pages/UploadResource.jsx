import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileAlt, FaBook, FaGraduationCap, FaLock, FaUnlock, FaTerminal, FaChevronLeft, FaYoutube, FaVideo } from 'react-icons/fa';

const UploadResource = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'past-paper', subject: '',
    gradeLevel: '', accessLevel: 'free', isAASTU: false, youtubeUrl: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const subjects = [
    'mathematics', 'physics', 'chemistry', 'biology', 'english',
    'civil-engineering', 'electrical-engineering', 'mechanical-engineering',
    'chemical-engineering', 'architecture', 'computer-science', 'software-engineering',
    'accounting-finance', 'management', 'economics', 'other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { showToast('MAX CAPACITY REACHED: 50MB limit exceeded.', 'error'); return; }
      setFile(selectedFile);
    }
  };

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === 'video' && !formData.youtubeUrl) { showToast('INPUT FAULT: YouTube URL required for video type.', 'error'); return; }
    if (formData.type !== 'video' && !file) { showToast('DATA MISSING: Resource file required.', 'error'); return; }

    setLoading(true);
    const uploadData = new FormData();
    if (file) uploadData.append('file', file);
    Object.keys(formData).forEach(key => uploadData.append(key, formData[key]));

    try {
      const { API_CONFIG } = await import('../utils/apiConfig');
      const token = localStorage.getItem('token');
      await axios.post(`${API_CONFIG.BASE_URL}/api/admin/resources/upload`, uploadData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total))
      });
      showToast('UPLOAD SUCCESSFUL: Resource integrated into system.');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (error) {
      showToast(error.response?.data?.error || 'TRANSMISSION ERROR: Upload failed.', 'error');
    } finally { setLoading(false); setUploadProgress(0); }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 font-sans p-6 md:p-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/5 blur-[180px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => navigate('/admin/dashboard')} className="group flex items-center gap-4 text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-12 hover:text-blue-300 transition-all">
          <FaChevronLeft className="group-hover:-translate-x-2 transition-transform" /> BACK TO CONSOLE
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">UPLOAD <span className="text-blue-500">RESOURCE</span></h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">SYSTEM DATA INGESTION • ENCRYPTED PAYLOAD</p>
          </div>
          <div className="w-20 h-20 bg-blue-600 rounded-[25px] flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-pulse">
            <FaTerminal className="text-white text-3xl" />
          </div>
        </div>

        {message.text && (
          <div className={`mb-12 p-8 rounded-[40px] font-black italic uppercase tracking-widest text-xs text-center border animate-pulse ${message.type === 'success' ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {}
          <div className="bg-slate-900/40 backdrop-blur-3xl p-12 rounded-[60px] border border-white/5 space-y-10">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">PRIMARY PAYLOAD</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">RESOURCE TYPE</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-800 rounded-[30px] p-6 text-white font-bold outline-none focus:border-blue-500/50 transition-all appearance-none uppercase text-xs tracking-widest cursor-pointer">
                  <option value="past-paper">EXAM PAPER</option>
                  <option value="study-notes">LECTURE NOTES</option>
                  <option value="video">VIDEO CONTENT</option>
                  <option value="other">OTHER DATA</option>
                </select>
              </div>

              {formData.type === 'video' ? (
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">YOUTUBE URL</label>
                  <div className="relative">
                    <FaYoutube className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500 text-xl" />
                    <input type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} placeholder="HTTPS://YOUTU.BE/..." className="w-full bg-slate-800/40 border border-slate-800 rounded-[30px] p-6 pl-16 text-white font-bold outline-none focus:border-blue-500/50 transition-all placeholder-slate-700" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">FILE ATTACHMENT</label>
                  <div className="relative group/upload h-full">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="h-full bg-slate-800/40 border-2 border-dashed border-slate-800 rounded-[30px] flex items-center justify-center gap-4 text-slate-500 group-hover/upload:border-blue-500/50 group-hover/upload:text-blue-400 transition-all p-6">
                      <FaUpload />
                      <span className="font-black text-[10px] uppercase tracking-widest truncate max-w-[200px]">{file ? file.name : 'SELECT PAYLOAD'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="bg-slate-900/40 backdrop-blur-3xl p-12 rounded-[60px] border border-white/5 space-y-10">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">METADATA PARSING</h2>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">RESOURCE TITLE</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="E.G. ADVANCED MATHEMATICS FINAL EXAM" className="w-full bg-slate-800/40 border border-slate-800 rounded-[30px] p-8 text-white font-black italic uppercase tracking-tighter text-2xl outline-none focus:border-blue-500/50 transition-all placeholder-slate-800" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">SUBJECT CATEGORY</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-800 rounded-[25px] p-5 text-white font-bold outline-none focus:border-blue-500/50 uppercase text-[10px] tracking-widest appearance-none cursor-pointer" required>
                  <option value="">SELECT SUBJECT</option>
                  {subjects.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">GRADUATION CYCLE</label>
                <input type="text" name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} placeholder="E.G. FRESHMAN" className="w-full bg-slate-800/40 border border-slate-800 rounded-[25px] p-5 text-white font-bold outline-none focus:border-blue-500/50 uppercase text-[10px] tracking-widest placeholder-slate-700" required />
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">ACCESS LEVEL</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({ ...formData, accessLevel: 'free' })} className={`flex-1 py-4 rounded-[20px] font-black text-[9px] uppercase tracking-widest border transition-all ${formData.accessLevel === 'free' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>PUBLIC</button>
                  <button type="button" onClick={() => setFormData({ ...formData, accessLevel: 'premium' })} className={`flex-1 py-4 rounded-[20px] font-black text-[9px] uppercase tracking-widest border transition-all ${formData.accessLevel === 'premium' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>PREMIUM</button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">DATA DESCRIPTION</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="BRIEF TECHNICAL OVERVIEW..." rows="4" className="w-full bg-slate-800/40 border border-slate-800 rounded-[40px] p-8 text-white font-bold outline-none focus:border-blue-500/50 transition-all placeholder-slate-800 resize-none" required />
            </div>

            <div className="flex items-center gap-6 p-8 bg-slate-800/20 rounded-[40px] border border-slate-800/50">
              <input type="checkbox" name="isAASTU" checked={formData.isAASTU} onChange={handleChange} className="appearance-none w-8 h-8 rounded-xl border-2 border-slate-700 checked:bg-blue-600 checked:border-blue-500 transition-all cursor-pointer relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:opacity-0 checked:after:opacity-100" />
              <div>
                <p className="text-white font-black text-xs uppercase tracking-widest">AASTU CLASSIFICATION</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">TAG THIS DATA AS UNIVERSITY-SPECIFIC</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 py-10">
            {loading && (
              <div className="w-full space-y-4">
                <div className="flex justify-between text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">
                  <span>TRANSMITTING PAYLOAD</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full md:w-auto px-20 py-8 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-[0.4em] rounded-[35px] shadow-2xl shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-4">
                {loading ? 'INITIALIZING UPLOAD...' : 'DEPLOY RESOURCE'}
                <FaUpload className="group-hover:translate-y-[-5px] transition-transform" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResource;
