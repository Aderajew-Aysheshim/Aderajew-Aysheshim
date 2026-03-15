import axios from 'axios';
import telegramService from './telegramService';

// API base URL
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token is automatically sent via cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear session data from localStorage (non-sensitive info)
      localStorage.removeItem('userType');
      localStorage.removeItem('adminData');
      window.location.href = '/login';
    }
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden: Insufficient permissions');
    }
    return Promise.reject(error);
  }
);
// Token validation utilities
export const tokenUtils = {
  // Since token is HttpOnly cookie, we can't check it directly
  // We rely on AuthContext and backend verification
  isValid: () => {
    // If we have a userType, we assume session exists until backend says otherwise
    return !!localStorage.getItem('userType');
  },

  // Get token payload - cannot be done with HttpOnly cookies from JS
  getPayload: () => null,

  // Check if token will expire soon - cannot be done with HttpOnly cookies from JS
  willExpireSoon: () => false
};

// Role-based access control utilities
export const roleUtils = {
  // Check if user has required role
  hasRole: (userType, requiredRole) => {
    const roleHierarchy = {
      student: 1,
      tutor: 2,
      admin: 3
    };
    return roleHierarchy[userType] >= roleHierarchy[requiredRole];
  },

// Get accessible routes for user type
  getAccessibleRoutes: (userType) => {
    const routes = {
      student: [
        '/dashboard',
        '/courses',
        '/resources',
        '/exams',
        '/messages',
        '/student-profile',
        '/grade12-exams'
      ],
      tutor: [
        '/tutor-dashboard',
        '/tutor/dashboard',
        '/tutor-upload-resource',
        '/tutors',
        '/messages',
        '/tutor-profile',
        '/resources'
      ],
      admin: [
        '/admin/dashboard',
        '/admin/exam-papers',
        '/admin/grade12-exams',
        '/admin/upload-resource',
        '/admin/verify-tutors',
        '/admin/manage-resources',
        '/admin/create-exit-exam',
        '/admin/payment-verification',
        '/admin/messages',
        '/admin/manage-tutors',
        '/admin/manage-students'
      ]
    };

    return routes[userType] || [];
  },

  // Check if route is accessible
  canAccessRoute: (userType, route) => {
    const accessibleRoutes = roleUtils.getAccessibleRoutes(userType);
    return accessibleRoutes.some(allowedRoute =>
      route.startsWith(allowedRoute)
    );
  }
};

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (email, password, userType) => {
    try {
      const endpoint = userType === 'admin'
        ? '/api/admin/login'
        : userType === 'tutor'
          ? '/api/tutors/login'
          : '/api/students/login';

      const response = await api.post(endpoint, { email, password });

      // Send Telegram notification for admin login
      if (userType === 'admin' && response.data.success) {
        await telegramService.sendSystemAlert(
          'Admin Login',
          `Admin ${response.data.user?.fullName || email} logged in successfully`,
          'INFO'
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register user
  register: async (userData, userType) => {
    try {
      const endpoint = userType === 'tutor'
        ? '/api/tutors/register'
        : '/api/students/register';

      const response = await api.post(endpoint, userData);

      // Send Telegram notification for new registration
      if (response.data.success) {
        if (userType === 'tutor') {
          await telegramService.sendTutorRegistrationNotification({
            ...userData,
            fullName: `${userData.firstName} ${userData.lastName}`
          });
        } else {
          await telegramService.sendUserRegistrationNotification({
            ...userData,
            fullName: `${userData.firstName} ${userData.lastName}`,
            userType: 'student'
          });
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify token and get user data
  verifyToken: async (userType) => {
    try {
      const endpoint = userType === 'admin'
        ? '/api/admin/verify'
        : userType === 'tutor'
          ? '/api/tutors/verify'
          : '/api/students/verify';

      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/api/auth/refresh');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout user
  logout: async (userType) => {
    try {
      const endpoint = userType === 'admin' 
        ? '/api/admin/logout' 
        : userType === 'tutor' 
          ? '/api/tutors/logout' 
          : '/api/students/logout';
      await api.post(endpoint);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('userType');
      localStorage.removeItem('adminData');
    }
  }
};

// Password utilities
export const passwordUtils = {
  // Validate password strength
  validateStrength: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = {
      score: 0,
      feedback: []
    };

    if (password.length >= minLength) strength.score++;
    else strength.feedback.push('Password must be at least 8 characters long');

    if (hasUpperCase) strength.score++;
    else strength.feedback.push('Password must contain uppercase letters');

    if (hasLowerCase) strength.score++;
    else strength.feedback.push('Password must contain lowercase letters');

    if (hasNumbers) strength.score++;
    else strength.feedback.push('Password must contain numbers');

    if (hasSpecialChar) strength.score++;
    else strength.feedback.push('Password must contain special characters');

    strength.strong = strength.score >= 4;
    strength.medium = strength.score >= 3;

    return strength;
  },

  // Generate password reset token
  generateResetToken: () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
};

// Session management utilities
export const sessionUtils = {
  // Set session timeout warning
  setSessionWarning: (warningMinutes = 5) => {
    const checkSession = () => {
      if (tokenUtils.willExpireSoon(warningMinutes)) {
        // Show warning to user
        console.warn('Session will expire soon');
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  },

  // Auto logout on session expiry
  setAutoLogout: () => {
    const checkExpiry = () => {
      if (!tokenUtils.isValid()) {
        authAPI.logout();
        window.location.href = '/login';
      }
    };

    const interval = setInterval(checkExpiry, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }
};

export default api;
