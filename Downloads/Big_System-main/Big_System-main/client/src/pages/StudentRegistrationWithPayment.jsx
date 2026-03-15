import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGraduationCap, FaMoneyBillWave, FaUpload, FaCheckCircle, FaArrowRight, FaShieldAlt, FaRocket, FaChevronRight } from 'react-icons/fa';

const StudentRegistrationWithPayment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', gradeLevel: '', studentId: ''
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: '', transactionRef: '', screenshot: null, preview: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkReg = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/settings/public');
        if (res.data.settings?.publicRegistration === false) {
          setIsRegOpen(false);
        }
      } catch (e) {
        console.error('Reg check fail');
      } finally {
        setChecking(false);
      }
    };
    checkReg();
  }, []);

  const paymentMethods = [
    { id: 'cbe', name: 'CBE Birr', account: '1000558675668', accountName: 'Aderajew Aysheshim' },
    { id: 'telebirr', name: 'Telebirr', phone: '0960737167', accountName: 'Aderajew Aysheshim' },
    { id: 'bank-transfer', name: 'Bank Transfer', bank: 'Commercial Bank of Ethiopia', account: '1000558675668' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type)) {
        setMessage({ text: 'INVALID FORMAT: JPG, PNG, GIF, or PDF.', type: 'error' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'SIZE EXCEEDED: 5MB max.', type: 'error' });
        return;
      }
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPaymentData({ ...paymentData, screenshot: file, preview: reader.result });
        reader.readAsDataURL(file);
      } else {
        setPaymentData({ ...paymentData, screenshot: file, preview: null });
      }
      setMessage({ text: '', type: '' });
    }
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setMessage({ text: 'DATA MISSING: All fields required.', type: 'error' });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'MISMATCH: Passwords do not match.', type: 'error' });
      return false;
    }
    if (formData.password.length < 6) {
      setMessage({ text: 'TOO SHORT: Min 6 characters.', type: 'error' });
      return false;
    }
    return true;
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (validateStep1()) { setMessage({ text: '', type: '' }); setStep(2); }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.paymentMethod || !paymentData.transactionRef || !paymentData.screenshot) {
      setMessage({ text: 'PAYMENT MISSING: Verify payment.', type: 'error' });
      return;
    }
    setLoading(true); setMessage({ text: '', type: '' });
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/students/register', {
        firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
        phone: formData.phone, password: formData.password, gradeLevel: formData.gradeLevel, studentId: formData.studentId
      });
      const paymentFormData = new FormData();
      paymentFormData.append('screenshot', paymentData.screenshot);
      paymentFormData.append('paymentType', 'registration');
      paymentFormData.append('amount', 50);
      paymentFormData.append('paymentMethod', paymentData.paymentMethod);
      paymentFormData.append('transactionReference', paymentData.transactionRef);

      await axios.post('http://localhost:5000/api/payment-verification/upload', paymentFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('userType', 'student');
      setMessage({ text: 'SUCCESS: Redirecting...', type: 'success' });
      setTimeout(() => navigate('/tutors'), 2000);
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'FAILED: Try again.', type: 'error' });
    } finally { setLoading(false); }
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentData.paymentMethod);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-300 font-sans selection:bg-indigo-500/30 pb-32 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[180px] rounded-full"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 pt-8">
        {/* Minimized Header */}
        <div className="text-center mb-6 animate-fadeIn">
          <div className="inline-flex p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-white/5 mb-3 shadow-sm">
            <FaRocket className="text-xl text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-1 leading-none">
            STUDENT <span className="text-indigo-600">REGISTRATION</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">JOIN TUTORHUB TODAY</p>
        </div>

        {checking ? (
          <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div></div>
        ) : !isRegOpen ? (
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-red-500/10 shadow-xl text-center max-w-md mx-auto">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2">Locked</h2>
            <Link to="/" className="text-xs text-indigo-500 font-bold hover:underline">Return Home</Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>1</div>
                <span className="text-[9px] font-bold uppercase tracking-wider">INFO</span>
              </div>
              <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>2</div>
                <span className="text-[9px] font-bold uppercase tracking-wider">PAYMENT</span>
              </div>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'}`}>
                <FaShieldAlt size={12} /> <p className="font-bold text-[10px] uppercase">{message.text}</p>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-[24px] border border-slate-100 dark:border-white/5 shadow-xl relative z-20">
              {step === 1 ? (
                <form onSubmit={handleStep1Submit} className="space-y-4 animate-slideUp">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">First Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-3 text-slate-300 text-xs" />
                        <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" placeholder="Abebe" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Last Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-3 text-slate-300 text-xs" />
                        <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" placeholder="Kebede" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-slate-300 text-xs" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" placeholder="abebe@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-slate-300 text-xs" />
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" placeholder="••••••" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Confirm</label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-slate-300 text-xs" />
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" placeholder="••••••" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Grade</label>
                      <div className="relative">
                        <FaGraduationCap className="absolute left-3 top-3 text-slate-300 text-xs" />
                        <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors appearance-none">
                          <option value="">Select</option>
                          <option value="9">Grade 9</option><option value="10">Grade 10</option><option value="11">Grade 11</option><option value="12">Grade 12</option><option value="university">University</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Phone</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-3 text-slate-300 text-xs" />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" placeholder="09... / +251..." />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                    CONTINUE <FaArrowRight />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleFinalSubmit} className="space-y-6 animate-slideUp">
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/10 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-2">
                        <FaMoneyBillWave className="text-emerald-500" /> REGISTRATION FEE
                      </h3>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">ONE-TIME Account Fee</p>
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white italic">50 <span className="text-[10px]">ETB</span></div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map(method => (
                      <button key={method.id} type="button" onClick={() => setPaymentData({ ...paymentData, paymentMethod: method.id })} className={`py-3 px-2 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentData.paymentMethod === method.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 shadow-md' : 'bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800'}`}>
                        <FaMoneyBillWave className={paymentData.paymentMethod === method.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                        <span className={`text-[8px] font-black uppercase text-center ${paymentData.paymentMethod === method.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500'}`}>{method.name}</span>
                      </button>
                    ))}
                  </div>

                  {selectedMethod && (
                    <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-indigo-500 uppercase mb-2">INSTRUCTIONS</p>
                      <ul className="space-y-1 text-[9px] font-bold text-slate-500 uppercase">
                        <li>• Send 50 ETB to {selectedMethod.account || selectedMethod.phone}</li>
                        <li>• Reference: {selectedMethod.accountName || 'TutorHub'}</li>
                        <li>• Save Screenshot</li>
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <input value={paymentData.transactionRef} onChange={(e) => setPaymentData({ ...paymentData, transactionRef: e.target.value })} placeholder="TRANSACTION REFERENCE" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-indigo-500" />

                    <div className="relative border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer group hover:border-indigo-500 transition-colors">
                      <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {paymentData.preview ? (
                        <div className="flex flex-col items-center">
                          <img src={paymentData.preview} className="h-20 rounded-lg mb-2 shadow-sm" alt="Preview" />
                          <span className="text-[8px] font-black text-emerald-500 uppercase">UPLOADED</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FaUpload className="text-slate-400 group-hover:text-indigo-500" />
                          <span className="text-[8px] font-black text-slate-500 uppercase">UPLOAD PROOF</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">BACK</button>
                    <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2">
                      {loading ? 'PROCESSING...' : <>FINALIZE <FaChevronRight /></>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default StudentRegistrationWithPayment;
