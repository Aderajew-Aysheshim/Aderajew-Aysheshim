import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

axios.interceptors.request.use(config => {
  // Remove manual Authorization headers if they are null/undefined to let cookies take over
  if (config.headers.Authorization === 'Bearer null' || 
      config.headers.Authorization === 'Bearer undefined' || 
      !localStorage.getItem('token')) {
    delete config.headers.Authorization;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userType');
      localStorage.removeItem('adminData');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
