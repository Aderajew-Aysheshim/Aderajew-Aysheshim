// API Configuration for development environment
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000',
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
  // Telegram Configuration
  TELEGRAM: {
    BOT_TOKEN: process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '',
    CHAT_ID: process.env.REACT_APP_TELEGRAM_CHAT_ID || '',
    WEB_APP_URL: 'https://t.me/TutorHubEthiopia',
    CHAT_URL: 'https://t.me/TutorHubEthiopia',
    TELEGRAM_HANDLE: '@TutorHubEthiopia',
    API_URL: 'https://api.telegram.org/bot'
  }
};
// Check if backend is available
export const isBackendAvailable = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/settings/public`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.log('Backend server not available:', error.message);
    return false;
  }
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export const MOCK_RESPONSES = {
  publicSettings: {
    settings: {
      publicRegistration: true,
      maintenanceMode: false
    }
  },
  verifyUser: null
};
