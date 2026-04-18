import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const API_BASE_URL = 'http://localhost:5000';

async function simpleFetch(url, options = {}) {
    console.log('Fetching:', url, options);
    try {
        const response = await fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...options.headers }
        });
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Data:', data);
        if (!response.ok) throw new Error(data.error || 'Error');
        return data;
    } catch (err) {
        console.log('Fetch error:', err.message);
        throw err;
    }
}

function AdminLogin({ setUser }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Step 1: Trying to register admin...');
            
            // Try to register admin (will fail if exists)
            try {
                await simpleFetch(`${API_BASE_URL}/api/register`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        name: 'Admin User',
                        email: 'admin@lucyluxury.com', 
                        password: 'admin123' 
                    })
                });
                console.log('Admin registered');
            } catch (err) {
                console.log('Register failed (maybe exists):', err.message);
            }

            console.log('Step 2: Trying to login...');
            
            // Try to login
            const data = await simpleFetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                body: JSON.stringify({ email: 'admin@lucyluxury.com', password: 'admin123' })
            });

            console.log('Login success:', data);

            if (data.user.role !== 'admin') {
                throw new Error('Access denied. Admin only.');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Admin login error:', err);
            setError(err.message || 'Admin login failed');
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
                                <p className="text-muted">Click login - admin will be created</p>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <p className="text-muted">Email: admin@lucyluxury.com<br/>Password: admin123</p>
                                </div>

                                <button type="submit" className="btn btn-gold w-100 py-3" disabled={loading}>
                                    {loading ? 'Processing...' : 'Login to Admin Panel'}
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