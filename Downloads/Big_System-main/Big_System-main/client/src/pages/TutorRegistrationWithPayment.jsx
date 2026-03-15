import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaMoneyBillWave, FaUpload, FaArrowRight, FaShieldAlt, FaChevronRight, FaFileContract } from 'react-icons/fa';

const TutorRegistrationWithPayment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', qualifications: '',
    subjects: '', availability: 'Flexible', bio: ''
  });
  const [documents, setDocuments] = useState({
    educationalDoc: null, cvResume: null, previewEducational: null, previewCv: null
  });
  const [educationInfo, setEducationInfo] = useState({
    university: '', degreeType: '', graduationYear: '', teachingExperience: ''
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
  const ACTIVATION_FEE = 1000;
  const paymentMethods = [
    { id: 'cbe', name: 'CBE Birr', account: '1000558675668', accountName: 'Aderajew Aysheshim' },
    { id: 'telebirr', name: 'Telebirr', phone: '0960737167', accountName: 'Aderajew Aysheshim' },
    { id: 'bank-transfer', name: 'Bank Transfer', bank: 'Commercial Bank of Ethiopia', account: '1000558675668' }
  ];

  const handleChange = (e) => {
    if (e.target.name in educationInfo) {
      setEducationInfo({ ...educationInfo, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleDocumentUpload = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: 'SIZE EXCEEDED: 5MB maximum.', type: 'error' });
      return;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ text: 'INVALID FORMAT: PDF, JPG, or PNG only.', type: 'error' });
      return;
    }
    setDocuments(prev => ({ ...prev, [docType]: file }));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewKey = docType === 'educationalDoc' ? 'previewEducational' : 'previewCv';
        setDocuments(prev => ({ ...prev, [previewKey]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
    setMessage({ text: `DOCUMENT UPLOADED: ${file.name}`, type: 'success' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'SIZE EXCEEDED: 5MB maximum.', type: 'error' });
        return;
      }
      setPaymentData({ ...paymentData, screenshot: file });
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPaymentData(prev => ({ ...prev, preview: reader.result }));
        reader.readAsDataURL(file);
      }
      setMessage({ text: '', type: '' });
    }
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setMessage({ text: 'DATA MISSING: Basic details required.', type: 'error' });
      return false;
    }
    if (formData.password.length < 6) {
      setMessage({ text: 'SECURITY ERROR: Password too short.', type: 'error' });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'SECURITY ERROR: Passwords do not match.', type: 'error' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ text: 'FORMAT ERROR: Invalid email.', type: 'error' });
      return false;
    }
    if (!formData.subjects || !formData.qualifications || !educationInfo.university || !educationInfo.degreeType) {
      setMessage({ text: 'DATA MISSING: Academic details required.', type: 'error' });
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
      setMessage({ text: 'INFORMATION MISSING: Complete payment.', type: 'error' });
      return;
    }
    setLoading(true); setMessage({ text: '', type: '' });
    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        qualifications: formData.qualifications,
        subjects: formData.subjects,
        availability: formData.availability || 'Flexible',
        bio: `${educationInfo.university} - ${educationInfo.degreeType}`
      };

      const registerResponse = await axios.post('http://localhost:5000/api/tutors/register', registrationData);

      if (documents.educationalDoc && documents.cvResume) {
        const docFormData = new FormData();
        docFormData.append('document1', documents.educationalDoc);
        docFormData.append('document2', documents.cvResume);
        await axios.post('http://localhost:5000/api/tutors/documents/upload', docFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      const paymentFormData = new FormData();
      paymentFormData.append('screenshot', paymentData.screenshot);
      paymentFormData.append('paymentType', 'tutor-activation');
      paymentFormData.append('amount', ACTIVATION_FEE);
      paymentFormData.append('paymentMethod', paymentData.paymentMethod);
      paymentFormData.append('transactionReference', paymentData.transactionRef);

      await axios.post('http://localhost:5000/api/payment-verification/upload', paymentFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('userType', 'tutor');
      setMessage({ text: 'SUCCESS: Redirecting...', type: 'success' });
      setTimeout(() => navigate('/tutors'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ text: error.response?.data?.error || 'REGISTRATION FAILED.', type: 'error' });
    } finally { setLoading(false); }
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentData.paymentMethod);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 relative overflow-hidden transition-colors duration-300">
      { }
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-6 sm:pt-10 pb-32 sm:pb-48">
        { }
        <div className="text-center mb-6 animate-fadeIn">
          <div className="inline-flex p-1.5 bg-blue-500/10 rounded-[12px] border border-blue-500/20 mb-2 relative group">
            <FaShieldAlt className="text-base sm:text-lg text-blue-600 dark:text-blue-400 relative z-10" />
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-1 leading-none">
            MENTOR <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">REGISTRATION</span>
          </h1>
          <p className="text-[7px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest">JOIN THE NETWORK</p>
        </div>

        { }
        {checking ? (
          <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div></div>
        ) : !isRegOpen ? (
          <div className="bg-white dark:bg-slate-900/40 p-10 rounded-[30px] border border-red-500/10 text-center mx-auto">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Induction Locked</h2>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            { }
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>1</div>
                <span className="text-[8px] font-bold uppercase tracking-wider">PROFILE</span>
              </div>
              <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>2</div>
                <span className="text-[8px] font-bold uppercase tracking-wider">PAYMENT</span>
              </div>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                <FaShieldAlt /> <p className="font-bold text-[10px] uppercase">{message.text}</p>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl p-4 sm:p-8 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-2xl">
              {step === 1 ? (
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">BASIC INFORMATION</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="firstName" placeholder="Abebe" value={formData.firstName} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" />
                    <input name="lastName" placeholder="Kebede" value={formData.lastName} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <input name="email" type="email" placeholder="abebe@example.com" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" />
                  <input name="phone" type="tel" placeholder="PHONE (09... / +251...)" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" />

                  <div className="grid grid-cols-2 gap-3">
                    <input name="password" type="password" placeholder="PASSWORD" value={formData.password} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" />
                    <input name="confirmPassword" type="password" placeholder="CONFIRM" value={formData.confirmPassword} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>

                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mt-6 mb-2">ACADEMIC PROFILE</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="university" placeholder="UNIVERSITY" value={educationInfo.university} onChange={handleChange} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500" />
                    <select name="degreeType" value={educationInfo.degreeType} onChange={handleChange} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500">
                      <option value="">DEGREE</option><option value="BSc">BSc</option><option value="MSc">MSc</option><option value="PhD">PhD</option>
                    </select>
                  </div>
                  <input name="subjects" placeholder="SUBJECTS (e.g. Math, Physics)" value={formData.subjects} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500" />
                  <input name="qualifications" placeholder="QUALIFICATIONS" value={formData.qualifications} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500" />

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className={`p-4 border border-dashed rounded-xl text-center cursor-pointer ${documents.educationalDoc ? 'border-green-500 text-green-400' : 'border-slate-700 text-slate-500'}`}>
                      <input type="file" accept=".pdf,.jpg,.png" className="hidden" id="doc1" onChange={(e) => handleDocumentUpload(e, 'educationalDoc')} />
                      <label htmlFor="doc1" className="cursor-pointer text-[9px] font-black uppercase flex flex-col items-center gap-1">
                        <FaGraduationCap size={16} /> {documents.educationalDoc ? 'UPLOADED' : 'DEGREE'}
                      </label>
                    </div>
                    <div className={`p-4 border border-dashed rounded-xl text-center cursor-pointer ${documents.cvResume ? 'border-green-500 text-green-400' : 'border-slate-700 text-slate-500'}`}>
                      <input type="file" accept=".pdf,.jpg,.png" className="hidden" id="doc2" onChange={(e) => handleDocumentUpload(e, 'cvResume')} />
                      <label htmlFor="doc2" className="cursor-pointer text-[9px] font-black uppercase flex flex-col items-center gap-1">
                        <FaFileContract size={16} /> {documents.cvResume ? 'UPLOADED' : 'CV/RESUME'}
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 mt-4 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                    CONTINUE <FaArrowRight />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase italic">ACTIVATION FEE</h3>
                      <p className="text-[8px] font-bold text-slate-500 uppercase">ONE-TIME PAYMENT</p>
                    </div>
                    <div className="text-xl font-black text-white italic">{ACTIVATION_FEE} <span className="text-[10px]">ETB</span></div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {paymentMethods.map(method => (
                      <button key={method.id} type="button" onClick={() => setPaymentData({ ...paymentData, paymentMethod: method.id })} className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentData.paymentMethod === method.id ? 'bg-blue-600/20 border-blue-500 shadow-lg' : 'bg-slate-800/30 border-slate-800'}`}>
                        <FaMoneyBillWave className={paymentData.paymentMethod === method.id ? 'text-blue-400' : 'text-slate-500'} />
                        <span className="text-[8px] font-black uppercase">{method.name}</span>
                      </button>
                    ))}
                  </div>

                  {selectedMethod && (
                    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
                      <p className="text-[9px] font-black text-blue-400 uppercase mb-2">INSTRUCTIONS</p>
                      <ul className="space-y-1 text-[9px] font-bold text-slate-400 uppercase">
                        <li>• Send {ACTIVATION_FEE} ETB to {selectedMethod.account || selectedMethod.phone}</li>
                        <li>• Reference: {selectedMethod.accountName}</li>
                        <li>• Keep transaction reference</li>
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <input value={paymentData.transactionRef} onChange={(e) => setPaymentData({ ...paymentData, transactionRef: e.target.value })} placeholder="TRANSACTION REFERENCE" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500" />

                    <div className="relative border border-dashed border-slate-700 rounded-xl p-8 text-center cursor-pointer group hover:border-indigo-500/50">
                      <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {paymentData.preview ? (
                        <div className="flex flex-col items-center">
                          <img src={paymentData.preview} className="h-20 rounded-lg mb-2" alt="Preview" />
                          <span className="text-[8px] font-black text-green-400 uppercase">UPLOADED</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FaUpload className="text-slate-600 group-hover:text-indigo-400" />
                          <span className="text-[8px] font-black text-slate-500 uppercase">UPLOAD PROOF</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-slate-800 text-slate-400 font-black text-[10px] uppercase rounded-xl">BACK</button>
                    <button type="submit" disabled={loading} className="flex-1 py-3 bg-white text-slate-900 font-black text-[10px] uppercase rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                      {loading ? 'PROCESSING...' : 'FINALIZE REGISTRATION'} <FaChevronRight />
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
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default TutorRegistrationWithPayment;
