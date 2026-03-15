import React, { useState } from 'react';
import {
  FaPhone, FaEnvelope, FaTelegramPlane,
  FaGraduationCap
} from 'react-icons/fa';
import { FiSend, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-blue-100 text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      {/* --- HERO SECTION --- */}
      <section className="relative py-16 px-6 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-denim.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-600/20 to-transparent rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10 text-center pt-8">
          <div className="animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> GET IN TOUCH
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">TutorHub</span>
            </h1>
            <p className="text-lg text-slate-300 font-light mb-8 max-w-2xl mx-auto">
              We're here to support your academic journey.
            </p>
          </div>
        </div>
      </section>

      {/* --- CONTACT INFO & FORM --- */}
      <section className="py-12 px-4 -mt-8">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Contact Info Side */}
            <div className="p-8 lg:p-12 bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 transition-colors">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 transition-colors">Contact Channels</h3>
              <div className="space-y-6">
                {/* Contact Links */}
                {[
                  { icon: <FaPhone />, title: 'Phone', info: '0951594353', val: 'tel:0951594353', color: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
                  { icon: <FaEnvelope />, title: 'Email', info: 'support@tutorhub.com', val: 'mailto:support@tutorhub.com', color: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
                  { icon: <FaTelegramPlane />, title: 'Telegram', info: '@TutorHubEthiopia', val: 'https://t.me/TutorHubEthiopia', color: 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' }
                ].map((c, i) => (
                  <a key={i} href={c.val} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-md transition-all group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${c.color} group-hover:scale-110 transition-transform`}>{c.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors">{c.title}</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 transition-colors">{c.info}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Become Tutor CTA */}
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><FaGraduationCap size={80} /></div>
                <h4 className="font-black text-lg mb-1 relative z-10">Become a Tutor?</h4>
                <p className="text-xs text-blue-100 mb-4 relative z-10 max-w-[80%]">Join our expert network today.</p>
                <Link to="/tutor-registration" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors relative z-10">
                  Apply Now <FaGraduationCap />
                </Link>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-8 lg:p-12 dark:bg-slate-900 transition-colors">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors mb-2">Send Message</h3>
              <p className="text-slate-500 text-sm mb-8">We usually respond within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 text-slate-300 dark:text-slate-500" />
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" placeholder="Name" required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 text-slate-300 dark:text-slate-500" />
                      <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" placeholder="Email" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3 top-3 text-slate-300 dark:text-slate-500" />
                    <input name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" placeholder="Inquiry Subject" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none transition-colors" placeholder="Your message..." required />
                </div>

                <button type="submit" className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                  <FiSend /> Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <style jsx="true">{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Contact;
