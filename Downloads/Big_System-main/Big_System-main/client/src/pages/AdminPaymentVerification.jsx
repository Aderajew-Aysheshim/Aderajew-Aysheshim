import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaEye, FaClock, FaMoneyBillWave, FaShieldAlt, FaHistory, FaSearch, FaChevronRight, FaImages } from 'react-icons/fa';

const AdminPaymentVerification = () => {
  const [verifications, setVerifications] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchVerifications();
  }, [filter]);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/payment-verification/all?status=${filter}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVerifications(response.data.verifications || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this payment?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/payment-verification/${id}/approve`, { adminNotes }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ text: 'SUCCESS: Payment authorized and synchronized.', type: 'success' });
      setAdminNotes('');
      fetchVerifications();
    } catch (error) {
      setMessage({ text: 'ERROR: Authorization failed.', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    if (!adminNotes.trim()) {
      setMessage({ text: 'REJECTION REASON REQUIRED: Please update notes.', type: 'error' });
      return;
    }
    if (!window.confirm('Reject this payment request?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/payment-verification/${id}/reject`, { adminNotes }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ text: 'SUCCESS: Payment rejected and user notified.', type: 'success' });
      setAdminNotes('');
      fetchVerifications();
    } catch (error) {
      setMessage({ text: 'ERROR: Rejection failed.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 sm:px-10 lg:px-12 bg-[#0a0f1d] text-slate-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 animate-fadeIn">
          <div>
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-black tracking-widest text-xs uppercase mb-6 transition-all group">
              <FaShieldAlt className="group-hover:rotate-12 transition-transform" />
              RETURN TO DASHBOARD
            </button>
            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 leading-none">
              Payment <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">Verification</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Manage and monitor all incoming financial transactions and subscription requests. Ensure accurate verification of CBE, Telebirr, and Bank screenshots.
            </p>
          </div>

          <div className="flex p-1.5 bg-slate-900 rounded-[24px] border border-slate-800 shadow-2xl">
            {['pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-8 py-4 rounded-[18px] font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center gap-3 ${filter === status ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                {status === 'pending' && <FaClock />}
                {status === 'approved' && <FaCheckCircle />}
                {status === 'rejected' && <FaTimesCircle />}
                {status}
              </button>
            ))}
          </div>
        </div>

        {message.text && (
          <div className={`mb-12 p-6 rounded-[28px] font-bold text-center border-2 animate-pulse ${message.type === 'success' ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-40">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="font-black tracking-[0.4em] uppercase text-[10px]">Loading Transactions...</p>
          </div>
        ) : verifications.length === 0 ? (
          <div className="text-center py-40 bg-slate-900/20 rounded-[60px] border-2 border-dashed border-slate-800">
            <FaHistory size={60} className="mx-auto mb-6 text-slate-700" />
            <p className="font-black text-slate-600 uppercase tracking-widest">No transactions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {verifications.map((v, i) => (
              <div key={v.id} className="group bg-slate-900/40 backdrop-blur-3xl rounded-[50px] border border-slate-800 p-12 hover:border-blue-500/30 transition-all duration-500 shadow-2xl shadow-black/40">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-1 space-y-10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <span className="px-4 py-1.5 bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                          {v.payment_type.replace('-', ' ')}
                        </span>
                        <h3 className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors uppercase italic">{v.user_name}</h3>
                        <p className="text-slate-500 font-bold text-sm tracking-tight">{v.user_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Log Reference</p>
                        <p className="text-lg font-black text-slate-200">#{v.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {[
                        { label: "AMOUNT", value: `${v.amount} ETB`, highlight: true },
                        { label: "PAYMENT METHOD", value: v.payment_method.toUpperCase() },
                        { label: "REFERENCE", value: v.transaction_reference || "N/A" },
                        { label: "USER TYPE", value: v.user_type.toUpperCase() }
                      ].map((item, idx) => (
                        <div key={idx} className="p-6 bg-slate-800/20 rounded-[32px] border border-slate-800 group-hover:bg-slate-800/40 transition-colors">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 opacity-60">{item.label}</p>
                          <p className={`text-lg font-black tracking-tight ${item.highlight ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'text-slate-200'}`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {v.status === 'pending' ? (
                      <div className="space-y-6 pt-6 animate-slide-up">
                        <div className="relative">
                          <FaSearch className="absolute left-6 top-6 text-slate-500" />
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-[32px] p-6 pl-16 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/10 outline-none min-h-[120px] font-bold"
                            placeholder="Add administrative notes or rejection reasons..."
                          />
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => handleApprove(v.id)} className="flex-1 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest rounded-[28px] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-4 group/btn">
                            APPROVE PAYMENT
                            <FaCheckCircle className="group-hover/btn:scale-125 transition-transform" />
                          </button>
                          <button onClick={() => handleReject(v.id)} className="flex-1 py-6 bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 font-black tracking-widest rounded-[28px] border border-slate-700 hover:border-red-500/50 transition-all flex items-center justify-center gap-4 group/rej">
                            REJECT PAYMENT
                            <FaTimesCircle className="group-hover/rej:scale-125 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 bg-slate-800/10 rounded-[40px] border border-slate-800 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-2 h-full ${v.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <FaHistory /> ADMINISTRATIVE NOTES
                        </h4>
                        <p className="text-lg font-bold text-slate-200 leading-relaxed italic">
                          "{v.admin_notes || "Authorized via standard verification."}"
                        </p>
                        <div className="mt-8 pt-6 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-black text-slate-500 flex-wrap gap-4">
                          <span className="uppercase tracking-[0.2em]">ADMIN: <span className="text-slate-300 italic">{v.admin_name || "SYSTEM"}</span></span>
                          <span className="uppercase tracking-[0.2em]">DATE: <span className="text-slate-300">{new Date(v.verified_at || v.created_at).toLocaleString()}</span></span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:w-96 space-y-6">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2rem] flex items-center gap-2">
                      <FaImages /> PAYMENT PROOF
                    </p>
                    <div className="relative group/img overflow-hidden rounded-[40px] border-4 border-slate-800 hover:border-blue-500/50 transition-all duration-700 bg-slate-800/20">
                      {(v.screenshot_url || v.screenshot_path || v.registration_payment_screenshot || v.premium_payment_screenshot) ? (
                        <>
                          <img
                            src={(() => {
                              const url = v.screenshot_url || v.screenshot_path || v.registration_payment_screenshot || v.premium_payment_screenshot;
                              return url.startsWith('http') ? url : `http://localhost:5000${url}`;
                            })()}
                            alt="Payment Evidence"
                            className="w-full h-auto min-h-[250px] object-cover transition-transform duration-1000 group-hover/img:scale-110 cursor-zoom-in"
                            onClick={() => {
                              const url = v.screenshot_url || v.screenshot_path || v.registration_payment_screenshot || v.premium_payment_screenshot;
                              window.open(url.startsWith('http') ? url : `http://localhost:5000${url}`, '_blank');
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-8">
                            <button onClick={() => {
                              const url = v.screenshot_url || v.screenshot_path || v.registration_payment_screenshot || v.premium_payment_screenshot;
                              window.open(url.startsWith('http') ? url : `http://localhost:5000${url}`, '_blank');
                            }} className="w-full py-4 bg-white/10 backdrop-blur-xl rounded-[20px] font-black text-xs text-white border border-white/20 uppercase tracking-widest flex items-center justify-center gap-3">
                              VIEW HIGH-RES <FaEye />
                            </button>
                          </div>
                          <div className="hidden h-64 items-center justify-center text-slate-700 font-black italic uppercase tracking-widest text-[10px]">
                            Image not found
                          </div>
                        </>
                      ) : (
                        <div className="h-64 flex items-center justify-center text-slate-700 font-black italic uppercase tracking-widest text-[10px]">
                          Evidence Missing
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Date Reported</span>
                      <span className="text-[10px] font-black text-slate-400 italic">TRANS REFERENCE #{i + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentVerification;
