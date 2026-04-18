import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Restaurant from './pages/Restaurant';
import Transport from './pages/Transport';
import Gym from './pages/Gym';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load user from localStorage on app start
    const loadUser = () => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('User loaded from storage:', parsedUser);
        } catch (error) {
          console.error('Error parsing user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const handleSetUser = (userData) => {
    console.log('Setting user:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // Check if current path is admin panel
  const isAdminPath = location.pathname.includes('/admin/dashboard');

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Always show navigation bar except on admin dashboard */}
      {!isAdminPath && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <h2 className="text-gold mb-0">Lucy Luxury Resort</h2>
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/rooms">Rooms</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/restaurant">Restaurant</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/transport">Transport</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/gym">Gym & Spa</Link>
                </li>
                <li className="nav-item ms-lg-3">
                  {user ? (
                    <div className="d-flex align-items-center">
                      <span className="text-gold me-3">
                        👋 Welcome, {user.name}
                        {user.role === 'admin' && <span className="admin-badge ms-2">Admin</span>}
                      </span>
                      {user.role === 'admin' && (
                        <Link className="btn btn-gold btn-sm me-2" to="/admin/dashboard">
                          Dashboard
                        </Link>
                      )}
                      <button className="btn btn-outline-gold btn-sm" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex">
                      <Link className="btn btn-gold btn-sm me-2" to="/login">Login</Link>
                      <Link className="btn btn-outline-gold btn-sm me-2" to="/register">Register</Link>
                      <Link className="btn btn-outline-light btn-sm" to="/admin/login">Admin</Link>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content - Add padding top to account for fixed navbar */}
      <div style={{ paddingTop: !isAdminPath && user?.role !== 'admin' ? '80px' : '0' }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/rooms" element={<Rooms user={user} />} />
          <Route path="/restaurant" element={<Restaurant user={user} />} />
          <Route path="/transport" element={<Transport user={user} />} />
          <Route path="/gym" element={<Gym user={user} />} />
          <Route path="/login" element={<Login setUser={handleSetUser} />} />
          <Route path="/register" element={<Register setUser={handleSetUser} />} />
          <Route path="/admin/login" element={<AdminLogin setUser={handleSetUser} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard user={user} />} />
        </Routes>
      </div>

      {/* Footer - Hide in admin panel */}
      {!isAdminPath && (
        <footer className="footer bg-dark text-light py-5 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-4">
                <h4 className="text-gold mb-4">Lucy Luxury Resort</h4>
                <p>Experience unparalleled luxury and comfort in the heart of paradise. Your perfect getaway awaits.</p>
                <div className="social-links mt-3">
                  <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="text-light me-3"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="text-light me-3"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="text-light"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
              
              <div className="col-md-2 mb-4">
                <h5 className="text-gold mb-3">Quick Links</h5>
                <ul className="list-unstyled">
                  <li className="mb-2"><Link to="/" className="text-light text-decoration-none">Home</Link></li>
                  <li className="mb-2"><Link to="/rooms" className="text-light text-decoration-none">Rooms</Link></li>
                  <li className="mb-2"><Link to="/restaurant" className="text-light text-decoration-none">Restaurant</Link></li>
                  <li className="mb-2"><Link to="/transport" className="text-light text-decoration-none">Transport</Link></li>
                  <li className="mb-2"><Link to="/gym" className="text-light text-decoration-none">Gym & Spa</Link></li>
                </ul>
              </div>
              
              <div className="col-md-3 mb-4">
                <h5 className="text-gold mb-3">Contact Info</h5>
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="bi bi-geo-alt me-2"></i> 123 Luxury Lane, Paradise City</li>
                  <li className="mb-2"><i className="bi bi-telephone me-2"></i> +1 234 567 8900</li>
                  <li className="mb-2"><i className="bi bi-envelope me-2"></i> info@lucyluxury.com</li>
                  <li className="mb-2"><i className="bi bi-clock me-2"></i> 24/7 Customer Service</li>
                </ul>
              </div>
              
              <div className="col-md-3 mb-4">
                <h5 className="text-gold mb-3">Newsletter</h5>
                <p>Subscribe for special offers and updates</p>
                <div className="input-group">
                  <input type="email" className="form-control" placeholder="Your email" />
                  <button className="btn btn-gold" type="button">Subscribe</button>
                </div>
                <div className="mt-3">
                  <small className="text-muted">© 2024 Lucy Luxury Resort. All rights reserved.</small>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
