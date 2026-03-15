import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaCheckCircle, FaMoneyBillWave, FaUpload, FaCrown, FaChevronRight, FaArrowLeft, FaShieldAlt, FaRocket, FaLock } from 'react-icons/fa';
import axios from 'axios';

const SubscribePremium = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType') || 'student';
  const price = userType === 'tutor' ? 1000 : 500;

  const paymentMethods = [
    {
      id: 'cbe',
      name: 'CBE Birr',
      account: '1000558675668',
      accountName: 'Aderajew Aysheshim',
      instructions: [
        'Open CBE Birr app',
        'Select "Send Money"',
        'Enter account: 1000558675668',
        `Amount: ${price} ETB`,
        'Complete payment',
        'Take screenshot of confirmation'
      ]
    },
    {
      id: 'telebirr',
      name: 'Telebirr',
      phone: '0960737167',
      accountName: 'Aderajew Aysheshim',
      instructions: [
        'Open Telebirr app',
        'Select "Send Money"',
        'Enter phone: 0960737167',
        `Amount: ${price} ETB`,
        'Complete payment',
        'Take screenshot of confirmation'
      ]
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      bank: 'Commercial Bank of Ethiopia',
      branch: 'Addis Ababa Main Branch',
      account: '1000558675668',
      accountName: 'Aderajew Aysheshim',
      instructions: [
        'Visit CBE branch',
        'Fill deposit slip',
        'Account: 1000558675668',
        `Amount: ${price} ETB`,
        'Get receipt',
        'Take photo of receipt'
      ]
    }
  ];

  const premiumFeatures = userType === 'tutor' ? [
    'Verified Tutor Badge',
    'Higher ranking in search results',
    'Unlimited resource uploads',
    'Ability to create interactive exams',
    'Advanced student analytics',
    'Priority placement on Home Page',
    'Direct messaging with students',
    'Premium dashboard metrics'
  ] : [
    'Access to all AASTU past papers',
    'Premium study materials',
    'Exclusive video tutorials',
    'Advanced interactive mock exams',
    'Priority support',
    'Download unlimited resources',
    'Ad-free experience',
    'Performance tracking'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ text: 'JPG, PNG, GIF, or PDF only.', type: 'error' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'File too large (>5MB).', type: 'error' });
        return;
      }
      setScreenshot(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      setMessage({ text: '', type: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot || !transactionRef) {
      setMessage({ text: 'All required fields must be completed.', type: 'error' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('screenshot', screenshot);
    formData.append('paymentType', userType === 'tutor' ? 'tutor-activation' : 'subscription');
    formData.append('amount', price);
    formData.append('paymentMethod', paymentMethod);
    formData.append('transactionReference', transactionRef);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/payment-verification/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage({ text: 'REQUEST SUBMITTED: Verification in progress.', type: 'success' });
      setTimeout(() => navigate('/payment-status'), 2000);
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'Verification failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Background Particles Placeholder */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-24">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            BACK
          </button>
          <div className="flex gap-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-3 h-3 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`}></div>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-[40px] border border-yellow-500/20 shadow-2xl mb-8 relative group">
            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <FaCrown className="text-5xl text-yellow-500 relative z-10 animate-bounce" />
          </div>
          UPGRADE TO <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent italic uppercase">PRO</span>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto uppercase tracking-wide">
            Access the definitive archive. Expert solutions. <br />
            <span className="text-blue-400 italic">Educational standard expertise for AASTU.</span>
          </p>
        </div>

        {/* Main Interface */}
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[60px] border border-slate-800 p-12 lg:p-16 shadow-2xl shadow-black/40 relative overflow-hidden">
          {message.text && (
            <div className={`mb-10 p-6 rounded-[30px] border-2 font-black text-center animate-pulse ${message.type === 'success' ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
              {message.text}
            </div>
          )}

          {/* STEP 1: Features & Pricing */}
          {step === 1 && (
            <div className="space-y-12 animate-slideUp">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {premiumFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-slate-800/20 rounded-[32px] border border-slate-800 transition-all hover:bg-slate-800/40 group">
                    <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                      <FaCheckCircle className="text-blue-400" />
                    </div>
                    <span className="text-slate-300 font-black tracking-tight text-lg">{f}</span>
                  </div>
                ))}
              </div>

              <div className="p-12 rounded-[50px] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-inner text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full"></div>
                <p className="text-yellow-500 font-black tracking-[0.4em] uppercase text-xs mb-4">Current Selection</p>
                <h2 className="text-6xl font-black text-white mb-2 tracking-tighter">
                  {price} <span className="text-2xl text-slate-500 italic uppercase">ETB</span>
                </h2>
                <p className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-10">SOLO MONTHLY ACCESS</p>
                <button onClick={() => setStep(2)} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-[0.2em] rounded-[28px] transition-all flex items-center justify-center gap-4 group/btn shadow-[0_20px_40px_rgba(37,99,235,0.3)]">
                  PAY NOW <FaChevronRight className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Nodes */}
          {step === 2 && (
            <div className="space-y-10 animate-slideUp">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8">Select Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paymentMethods.map(m => (
                  <div key={m.id} onClick={() => setPaymentMethod(m.id)} className={`p-10 rounded-[44px] border-2 cursor-pointer transition-all ${paymentMethod === m.id ? 'bg-blue-600/10 border-blue-500 shadow-2xl shadow-blue-500/10' : 'bg-slate-800/20 border-slate-800 hover:border-slate-600'
                    }`}>
                    <div className="flex flex-col items-center gap-6 text-center">
                      <div className={`p-5 rounded-[28px] ${paymentMethod === m.id ? 'bg-blue-500 text-white shadow-xl' : 'bg-slate-800 text-slate-400'}`}>
                        <FaMoneyBillWave size={30} />
                      </div>
                      <h3 className="font-black text-white tracking-widest uppercase text-xs">{m.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-10">
                <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-800 text-slate-400 font-black tracking-widest rounded-[28px] border border-slate-700 hover:text-white transition-all uppercase text-xs">BACK</button>
                <button disabled={!paymentMethod} onClick={() => setStep(3)} className="flex-[2] py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-black tracking-widest rounded-[28px] transition-all shadow-xl shadow-blue-600/20 uppercase text-xs">CONTINUE</button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification Payload */}
          {step === 3 && selectedMethod && (
            <div className="space-y-12 animate-slideUp">
              <div className="p-10 rounded-[44px] bg-blue-600/5 border border-blue-500/20">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <FaRocket /> INSTRUCTIONS: {selectedMethod.name}
                </h3>
                <ol className="space-y-6">
                  {selectedMethod.instructions.map((inst, i) => (
                    <li key={i} className="flex items-center gap-6 group">
                      <span className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-xs text-blue-400 border border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all">{i + 1}</span>
                      <p className="text-slate-300 font-bold text-lg">{inst}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-4">TRANSACTION REFERENCE</label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-[28px] p-6 text-xl font-black text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-600"
                    placeholder="Enter receipt identifier..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-4">PAYMENT PROOF (SCREENSHOT)</label>
                  <div className="relative group/upload overflow-hidden rounded-[44px] border-4 border-dashed border-slate-800 hover:border-blue-500/50 transition-all p-12 text-center bg-slate-800/10">
                    <input type="file" onChange={handleFileChange} id="payload-up" className="hidden" required />
                    <label htmlFor="payload-up" className="cursor-pointer block">
                      {preview ? (
                        <div className="animate-fadeIn">
                          <img src={preview} alt="Evidence" className="max-h-80 mx-auto rounded-[30px] border-4 border-slate-800 group-hover/upload:border-blue-500/50 transition-all shadow-2xl" />
                          <p className="mt-6 text-blue-400 font-black text-xs tracking-widest">RECEIPT ATTACHED</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <FaUpload className="text-6xl text-slate-700 mx-auto group-hover/upload:text-blue-500 transition-all" />
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Upload proof of transaction</p>
                          <p className="text-[10px] text-slate-600 font-black">JPG, PNG, PDF (MAX 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-6 bg-slate-800 text-slate-400 font-black tracking-widest rounded-[28px] uppercase text-xs" disabled={loading}>BACK</button>
                  <button type="submit" className="flex-[2] py-6 bg-white text-blue-900 font-black tracking-[0.3em] rounded-[28px] hover:bg-blue-50 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] uppercase text-xs disabled:opacity-40" disabled={loading}>
                    {loading ? 'UPGRADING...' : 'CONFIRM PAYMENT'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-16 flex items-center justify-center gap-10 opacity-30">
          <div className="flex items-center gap-3 font-black text-[10px] tracking-widest"><FaShieldAlt /> ENCRYPTED SECURE PAYMENT</div>
          <div className="flex items-center gap-3 font-black text-[10px] tracking-widest"><FaLock /> INSTANT VERIFICATION LOCK</div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default SubscribePremium;
