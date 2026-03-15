import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  user: null,
  token: null, // Token handled via cookies
  userType: localStorage.getItem('userType'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        userType: action.payload.userType,
        error: null
      };

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        userType: null,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        userType: null,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const userType = localStorage.getItem('userType');

      if (!userType) {
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE, payload: 'No session found' });
        return;
      }

      try {
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });

        const { API_CONFIG, isBackendAvailable } = await import('../utils/apiConfig');

        const backendAvailable = await isBackendAvailable();
        if (!backendAvailable) {
          console.log('Backend not available - skipping user verification');
          dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE, payload: 'Backend not available' });
          return;
        }

        let endpoint;
        switch (userType) {
          case 'admin':
            endpoint = '/api/admin/verify';
            break;
          case 'tutor':
            endpoint = '/api/tutors/verify';
            break;
          case 'student':
            endpoint = '/api/students/verify';
            break;
          default:
            throw new Error('Invalid user type');
        }

        const response = await axios.get(`${API_CONFIG.BASE_URL}${endpoint}`, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        dispatch({
          type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
          payload: {
            user: response.data.user,
            userType: userType
          }
        });
      } catch (error) {
        console.error('Failed to load user:', error);
       
        if (error.response?.status === 404) {
          console.warn('User verification endpoint not found - continuing with stored user data');
         
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
            payload: {
              user: { id: 'unknown', email: 'unknown@example.com' },
              userType: userType
            }
          });
        } else {
          localStorage.removeItem('userType');
          localStorage.removeItem('adminData');
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER_FAILURE,
            payload: 'Session expired. Please login again.'
          });
        }
      }
    };

    loadUser();
  }, []);

  const login = async (email, password, userType) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      let endpoint;
      switch (userType) {
        case 'admin':
          endpoint = '/api/admin/login';
          break;
        case 'tutor':
          endpoint = '/api/tutors/login';
          break;
        case 'student':
          endpoint = '/api/students/login';
          break;
        default:
          throw new Error('Invalid user type');
      }

      const { API_CONFIG } = await import('../utils/apiConfig');
      const response = await axios.post(`${API_CONFIG.BASE_URL}${endpoint}`, {
        email,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem('userType', userType);
      if (userType === 'admin') {
        localStorage.setItem('adminData', JSON.stringify(user));
      }

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token,
          userType
        }
      });

      return { success: true, userType };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      const { API_CONFIG } = await import('../utils/apiConfig');
      let endpoint = '/api/students/logout'; // Default logout
      if (state.userType === 'admin') endpoint = '/api/admin/logout';
      if (state.userType === 'tutor') endpoint = '/api/tutors/logout';

      await axios.post(`${API_CONFIG.BASE_URL}${endpoint}`);
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('userType');
    localStorage.removeItem('adminData');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData
    });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    updateUser,
    dispatch
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
