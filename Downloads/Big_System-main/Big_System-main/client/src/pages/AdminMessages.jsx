import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG } from '../utils/apiConfig';
import {
  FaComments, FaUser, FaSearch, FaEye, FaFilter, FaDownload,
  FaCheckCircle, FaClock, FaArrowLeft, FaTrash
} from 'react-icons/fa';

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchConversations();
  }, [navigate]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Fetching conversations with token:', token ? 'Token exists' : 'No token');

      const res = await axios.get(`${API_CONFIG.BASE_URL}/api/messages/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: API_CONFIG.TIMEOUT
      });

      console.log('📊 API Response:', res.data);
      console.log('📈 Conversations count:', res.data.conversations?.length || 0);

      if (res.data.success) {
        setConversations(res.data.conversations || []);
        console.log('✅ Conversations set:', res.data.conversations?.length || 0);
      } else {
        console.warn('⚠️ API returned success: false');
      }
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching conversations:', err);
      console.error('❌ Error details:', err.message);
      // Set empty conversations when backend is unavailable
      setConversations([]);
      setLoading(false);
    }
  };

  const viewConversation = async (conversation) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}/api/messages/admin/conversation/${conversation.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: API_CONFIG.TIMEOUT
        }
      );

      if (res.data.success) {
        setSelectedConversation(res.data.conversation);
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err.message);
      // Set empty messages when backend is unavailable
      setMessages([]);
    }
  };

  const exportConversation = (conversation) => {
    const data = messages.map(m => ({
      timestamp: new Date(m.created_at).toLocaleString(),
      sender: m.sender_name,
      message: m.message
    }));

    const csv = [
      ['Timestamp', 'Sender', 'Message'],
      ...data.map(row => [row.timestamp, row.sender, row.message])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversation.id}.csv`;
    a.click();
  };

  const deleteConversation = async (conversationId) => {
    if (!window.confirm('Are you sure you want to delete this conversation? This will permanently delete all messages in this conversation. This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(
        `${API_CONFIG.BASE_URL}/api/messages/admin/conversation/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: API_CONFIG.TIMEOUT
        }
      );

      if (res.data.success) {
        alert('Conversation deleted successfully');
        // If viewing this conversation, go back to list
        if (selectedConversation && selectedConversation.id === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
        // Refresh conversations list
        fetchConversations();
      }
    } catch (err) {
      console.error('Error deleting conversation:', err.message);
      alert('Failed to delete conversation - Backend may be unavailable');
    }
  };

  const filteredConversations = (conversations || []).filter(conv => {
    const matchesSearch =
      conv.tutor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.tutor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.student_email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'paid') return matchesSearch && conv.commission_paid;
    if (filterStatus === 'unpaid') return matchesSearch && !conv.commission_paid;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (selectedConversation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedConversation(null);
                  setMessages([]);
                }}
                className="btn btn-outline flex items-center gap-2"
              >
                <FaArrowLeft /> Back to All Conversations
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportConversation(selectedConversation)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <FaDownload /> Export Conversation
                </button>
                <button
                  onClick={() => deleteConversation(selectedConversation.id)}
                  className="btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                >
                  <FaTrash /> Delete Conversation
                </button>
              </div>
            </div>
          </div>

          {/* Conversation Info */}
          <div className="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Student</h3>
                <p className="text-gray-700">
                  <strong>Name:</strong> {selectedConversation.student_name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {selectedConversation.student_email}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tutor</h3>
                <p className="text-gray-700">
                  <strong>Name:</strong> {selectedConversation.tutor_name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {selectedConversation.tutor_email}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Total Messages:</span>
                  <span className="ml-2 font-semibold">{messages.length}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Commission Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${selectedConversation.commission_paid
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {selectedConversation.commission_paid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Conversation History</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${msg.sender_type === 'student'
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'bg-green-50 border-l-4 border-green-500'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaUser className={msg.sender_type === 'student' ? 'text-blue-600' : 'text-green-600'} />
                        <span className="font-semibold text-gray-900">{msg.sender_name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${msg.sender_type === 'student'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                          }`}>
                          {msg.sender_type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 ml-6">{msg.message}</p>
                    {msg.is_read && (
                      <div className="flex items-center gap-1 mt-2 ml-6 text-xs text-gray-500">
                        <FaCheckCircle className="text-green-500" />
                        <span>Read</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="card mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Message Monitoring</h1>
              <p className="text-lg opacity-90">View all student-tutor conversations</p>
            </div>
            <FaComments className="text-6xl opacity-50" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{conversations.length}</div>
                <div className="text-gray-700 mt-1">Total Conversations</div>
              </div>
              <FaComments className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="card bg-green-50 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {conversations.filter(c => c.commission_paid).length}
                </div>
                <div className="text-gray-700 mt-1">Commission Paid</div>
              </div>
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-600">
                  {conversations.filter(c => !c.commission_paid).length}
                </div>
                <div className="text-gray-700 mt-1">Commission Pending</div>
              </div>
              <FaClock className="text-4xl text-yellow-500" />
            </div>
          </div>

          <div className="card bg-purple-50 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {conversations.reduce((sum, c) => sum + (c.message_count || 0), 0)}
                </div>
                <div className="text-gray-700 mt-1">Total Messages</div>
              </div>
              <FaComments className="text-4xl text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input flex-1"
              >
                <option value="all">All Conversations</option>
                <option value="paid">Commission Paid</option>
                <option value="unpaid">Commission Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">All Conversations ({filteredConversations.length})</h3>
          <div className="space-y-4">
            {filteredConversations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No conversations found</p>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Student</p>
                          <p className="font-semibold text-gray-900">
                            {conv.student_name}
                          </p>
                          <p className="text-sm text-gray-600">{conv.student_email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tutor</p>
                          <p className="font-semibold text-gray-900">
                            {conv.tutor_name}
                          </p>
                          <p className="text-sm text-gray-600">{conv.tutor_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Messages: {conv.message_count || 0}</span>
                        <span>Last activity: {new Date(conv.last_message_at).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${conv.commission_paid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {conv.commission_paid ? 'Commission Paid' : 'Commission Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewConversation(conv)}
                        className="btn btn-primary flex items-center gap-2"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => deleteConversation(conv.id)}
                        className="btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
