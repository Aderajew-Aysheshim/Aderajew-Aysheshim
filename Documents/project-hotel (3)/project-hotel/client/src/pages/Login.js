import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = 'http://localhost:5000';

async function simpleFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error');
    return data;
}

function Login({ setUser }) {
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
            // Try to register first (auto-create user)
            await simpleFetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                body: JSON.stringify({ 
                    name: email.split('@')[0], 
                    email, 
                    password 
                })
            });
            console.log('Registered successfully');
        } catch (err) {
            // User might already exist, that's okay
            console.log('Register error (may be already exists):', err.message);
        }

        // Now try to login
        try {
            const data = await simpleFetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            console.log('Login success:', data);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/');
        } catch (loginErr) {
            setError(loginErr.message || 'Login failed');
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
                            <div className="text-center mb-4">
                                <div className="login-icon mb-3">🔑</div>
                                <h2 className="text-gold">Welcome Back</h2>
                                <p className="text-muted">Login or register automatically</p>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" value={email}
                                        onChange={(e) => setEmail(e.target.value)} required />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" value={password}
                                        onChange={(e) => setPassword(e.target.value)} required />
                                </div>

                                <button type="submit" className="btn btn-gold w-100 py-3" disabled={loading}>
                                    {loading ? 'Processing...' : 'Login / Register'}
                                </button>

                                <div className="text-center mt-3">
                                    <Link to="/admin/login" className="text-muted">Admin Login →</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;