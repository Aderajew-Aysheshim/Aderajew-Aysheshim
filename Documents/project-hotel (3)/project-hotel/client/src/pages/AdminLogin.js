import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { login } from '../services/api';

function AdminLogin({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email, password });
      
      if (data.user.role !== 'admin') {
        setError('Access denied. Admin only.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="container">
        <div className="row justify-content-center min-vh-100 align-items-center">
          <div className="col-md-5">
            <div className="admin-login-card">
              <div className="admin-header text-center mb-4">
                <div className="admin-icon">👑</div>
                <h2>Admin Login</h2>
                <p className="text-muted">Access the hotel management dashboard</p>
              </div>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@lucyluxury.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-gold w-100 py-3"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login to Admin Panel'}
                </button>
              </form>

              <div className="text-center mt-3">
                <a href="/login" className="text-gold">Back to User Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;