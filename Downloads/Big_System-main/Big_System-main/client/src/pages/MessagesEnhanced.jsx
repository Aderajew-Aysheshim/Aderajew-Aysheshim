import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG } from '../utils/apiConfig';
import {
  FaPaperPlane, FaArrowLeft, FaCheckDouble, FaCheck,
  FaSearch, FaEllipsisV, FaImage, FaSmile, FaStar,
  FaPaperclip, FaMicrophone, FaHeart, FaThumbsUp,
  FaLaugh, FaTrash, FaEdit, FaThumbtack, FaDownload,
  FaTimes, FaCircle, FaReply, FaFile, FaVideo,
  FaPhone, FaInfoCircle, FaBell, FaBellSlash, FaChevronLeft, FaShieldAlt
} from 'react-icons/fa';

const MessagesEnhanced = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userType, setUserType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [muted, setMuted] = useState(new Set());

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    if (!token) { navigate('/login'); return; }
    setUserType(type);
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (selectedConv) {
      const interval = setInterval(() => {
        const id = userType === 'student' ? selectedConv.tutor_id : selectedConv.student_id;
        const type = userType === 'student' ? 'tutor' : 'student';
        fetchMessages(id, type, true);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConv, userType]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_CONFIG.BASE_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: API_CONFIG.TIMEOUT
      });
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error('Fetch conversations failed:', err.message);
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        console.warn('Backend server not available - showing empty conversations');
      } else if (err.response?.status === 401) {
        navigate('/login');
      }
      // Set empty conversations when backend is unavailable
      setConversations([]);
    }
  };

  const fetchMessages = async (userId, uType, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_CONFIG.BASE_URL}/api/messages/${userId}/${uType}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: API_CONFIG.TIMEOUT
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Fetch messages failed:', err.message);
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        console.warn('Backend server not available - showing empty messages');
      } else if (err.response?.status === 401) {
        navigate('/login');
      }
      // Set empty messages when backend is unavailable
      setMessages([]);
    } finally { if (!silent) setLoading(false); }
  };

  const handleSelect = (conv) => {
    setSelectedConv(conv);
    const id = userType === 'student' ? conv.tutor_id : conv.student_id;
    const type = userType === 'student' ? 'tutor' : 'student';
    fetchMessages(id, type);
    setShowInfo(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    const tempMessage = newMessage; setNewMessage(''); setReplyTo(null);
    try {
      const token = localStorage.getItem('token');
      const receiverId = userType === 'student' ? selectedConv.tutor_id : selectedConv.student_id;
      const receiverType = userType === 'student' ? 'tutor' : 'student';

      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/messages/send`, {
        receiverId, receiverType, message: tempMessage
      }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        timeout: API_CONFIG.TIMEOUT
      });

      if (response.data.success) {
        fetchMessages(receiverId, receiverType, true);
        fetchConversations();
      } else {
        setNewMessage(tempMessage);
        alert('Failed to send message: ' + (response.data.error || 'Unknown error'));
      }
    } catch (err) {
      setNewMessage(tempMessage);
      console.error('Send message error:', err);
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        alert('Cannot connect to server. Please make sure the backend server is running on port 5000.\n\nTo start the server:\n1. Open command prompt\n2. Navigate to server folder\n3. Run: npm start\n\nOr double-click start_server.bat');
      } else if (err.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to send message: ' + (err.response?.data?.error || err.message || 'Network error'));
      }
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv => {
    const name = userType === 'student' ? conv.tutor_name : conv.student_name;
    return name && name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 font-sans flex overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/5 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[180px] rounded-full"></div>
      </div>

      {/* Side Comms Archive */}
      <div className="w-[400px] border-r border-slate-800 bg-slate-900/60 backdrop-blur-4xl flex flex-col relative z-20 transition-all duration-700">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"><FaChevronLeft /></button>
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">CONVERSATIONS</h2>
          </div>
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg animate-pulse"><FaShieldAlt size={14} /></div>
        </div>

        <div className="px-6 mb-6">
          <div className="relative group/search">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/search:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH MESSAGES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/40 border border-slate-800 rounded-full py-4 pl-14 pr-8 text-[10px] font-black text-white outline-none focus:border-indigo-500/50 transition-all placeholder-slate-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 px-4 pb-20">
          {filteredConversations.map((conv) => {
            const isSelected = selectedConv?.id === conv.id;
            const name = userType === 'student' ? conv.tutor_name : conv.student_name;
            const photo = userType === 'student' ? conv.tutor_photo : conv.student_photo;
            return (
              <div key={conv.id} onClick={() => handleSelect(conv)} className={`p-6 rounded-[32px] cursor-pointer transition-all border group ${isSelected ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-500/20 text-white' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'}`}>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img src={photo ? `http://localhost:5000${photo}` : 'https://via.placeholder.com/60'} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:scale-105 transition-transform" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-black uppercase tracking-widest text-xs truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{name || 'Unknown User'}</h3>
                      <span className={`text-[8px] font-black ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>{formatTime(conv.last_message_at)}</span>
                    </div>
                    <p className={`text-[10px] font-bold truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>{conv.last_message || 'START CONVERSATION...'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Bridge */}
      <div className="flex- grow flex flex-col relative z-10 w-full overflow-hidden">
        {selectedConv ? (
          <>
            {/* Bridge Header */}
            <div className="p-8 border-b border-slate-800 bg-slate-900/30 backdrop-blur-3xl flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={userType === 'student' ? (selectedConv.tutor_photo ? `http://localhost:5000${selectedConv.tutor_photo}` : 'https://via.placeholder.com/50') : (selectedConv.student_photo ? `http://localhost:5000${selectedConv.student_photo}` : 'https://via.placeholder.com/50')}
                    className="w-12 h-12 rounded-xl object-cover border border-indigo-500/30 shadow-lg"
                    alt=""
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-widest text-sm italic">
                    {userType === 'student' ? selectedConv.tutor_name : selectedConv.student_name}
                  </h3>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span> ONLINE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 bg-slate-800/40 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center"><FaPhone /></button>
                <button className="w-12 h-12 bg-slate-800/40 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center"><FaVideo /></button>
                <button onClick={() => setShowInfo(!showInfo)} className="w-12 h-12 bg-slate-800/40 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center"><FaInfoCircle /></button>
              </div>
            </div>

            {/* Transmission Feed */}
            <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
              {messages.map((msg, idx) => {
                const isMe = msg.sender_type === userType;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                    <div className={`max-w-[70%] group relative ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-8 py-5 rounded-[28px] shadow-2xl ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800/60 border border-slate-700 text-slate-200 rounded-bl-none backdrop-blur-3xl'}`}>
                        <p className="text-sm font-bold tracking-tight leading-relaxed">{msg.message}</p>
                      </div>
                      <div className={`flex items-center gap-3 mt-3 text-[9px] font-black uppercase tracking-widest text-slate-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span>{formatTime(msg.created_at)}</span>
                        {isMe && <FaCheckDouble className={msg.is_read ? 'text-indigo-400' : 'text-slate-600'} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Terminal */}
            <div className="p-10 border-t border-slate-800 bg-slate-900/40 backdrop-blur-4xl">
              <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-6">
                <button type="button" className="text-slate-600 hover:text-indigo-400 transition-colors p-2"><FaPaperclip size={20} /></button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="TYPE A MESSAGE..."
                    className="w-full bg-slate-800/40 border border-slate-800 rounded-[30px] py-5 px-8 text-sm font-black text-white focus:border-indigo-500/50 outline-none transition-all placeholder-slate-800"
                  />
                </div>
                <button type="submit" disabled={!newMessage.trim()} className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-20">
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <div className="w-24 h-24 bg-slate-900/60 rounded-[40px] flex items-center justify-center border border-slate-800 text-slate-700 mb-10 shadow-2xl animate-float">
              <FaPaperPlane size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-400 uppercase tracking-[0.6em] mb-4 italic">START CHATTING</h2>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">SELECT A CONVERSATION TO START CHATTING</p>
          </div>
        )}
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default MessagesEnhanced;
