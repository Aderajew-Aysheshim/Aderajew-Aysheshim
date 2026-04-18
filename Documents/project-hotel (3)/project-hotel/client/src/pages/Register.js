import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import './Register.css';

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\+?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      // Save user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      // Show success
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="row justify-content-center min-vh-100 align-items-center py-5">
          <div className="col-md-8 col-lg-6">
            <div className="register-card">
              {/* Success Message */}
              {success && (
                <div className="success-message text-center p-4">
                  <div className="success-icon mb-3">✅</div>
                  <h3 className="text-gold mb-3">Registration Successful!</h3>
                  <p>Welcome to Lucy Luxury Resort, {formData.name}!</p>
                  <p className="text-muted">Redirecting to homepage...</p>
                </div>
              )}

              {/* Registration Form */}
              {!success && (
                <>
                  <div className="text-center mb-4">
                    <h2 className="text-gold">Create Account</h2>
                    <p className="text-muted">Join us for an unforgettable experience</p>
                  </div>

                  {errors.submit && (
                    <div className="alert alert-danger">{errors.submit}</div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Password *</label>
                        <input
                          type="password"
                          name="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create password"
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Confirm Password *</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </div>

                      <div className="col-md-12 mb-4">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 8900"
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                        <small className="text-muted">Optional, but recommended for booking confirmations</small>
                      </div>
                    </div>

                    <div className="terms-agreement mb-4">
                      <div className="form-check">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          id="terms" 
                          required 
                        />
                        <label className="form-check-label" htmlFor="terms">
                          I agree to the <a href="#" className="text-gold">Terms of Service</a> and{' '}
                          <a href="#" className="text-gold">Privacy Policy</a>
                        </label>
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
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    <div className="text-center">
                      <p className="mb-0">
                        Already have an account?{' '}
                        <Link to="/login" className="text-gold text-decoration-none">
                          Login here
                        </Link>
                      </p>
                    </div>
                  </form>

                  {/* Benefits Section */}
                  <div className="benefits-section mt-4 pt-4 border-top">
                    <h5 className="text-center mb-3">Member Benefits</h5>
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="benefit-item">
                          <span className="benefit-icon">🎁</span>
                          <small>Welcome Gift</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="benefit-item">
                          <span className="benefit-icon">💰</span>
                          <small>Member Discounts</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="benefit-item">
                          <span className="benefit-icon">⭐</span>
                          <small>Priority Booking</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
