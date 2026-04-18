import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { login } from '../services/api';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      setSuccess(true);
      
      setTimeout(() => {
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center min-vh-100 align-items-center py-5">
          <div className="col-md-6 col-lg-5">
            <div className="login-card">
              {success && (
                <div className="success-message text-center p-4">
                  <div className="success-icon mb-3">✓</div>
                  <h3 className="text-gold mb-3">Login Successful!</h3>
                  <p>Redirecting you to the dashboard...</p>
                </div>
              )}

              {!success && (
                <>
                  <div className="text-center mb-4">
                    <div className="login-icon mb-3">🔑</div>
                    <h2 className="text-gold">Welcome Back</h2>
                    <p className="text-muted">Login to access your account</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text">📧</span>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <span className="input-group-text">🔒</span>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-gold w-100 py-3 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </button>

                    <div className="text-center">
                      <p className="mb-2">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-gold text-decoration-none">
                          Register here
                        </Link>
                      </p>
                      <p className="mb-0">
                        <Link to="/admin/login" className="text-muted text-decoration-none small">
                          Admin Login →
                        </Link>
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;