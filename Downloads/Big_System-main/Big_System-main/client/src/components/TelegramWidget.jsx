import React, { useEffect, useState } from 'react';
import { FaTelegram, FaBell, FaComments, FaUserPlus, FaCreditCard } from 'react-icons/fa';
import telegramService from '../utils/telegramService';

const TelegramWidget = ({
  showNotification = true,
  showWebAppButton = true,
  showChatButton = true,
  position = 'bottom-right',
  notifications = []
}) => {
  const [isTelegramReady, setIsTelegramReady] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Initialize Telegram Web App if available
    const webApp = telegramService.initTelegramWebApp();
    if (webApp) {
      setIsTelegramReady(true);
    }

    // Load Telegram Web App script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Update unread count
    setUnreadCount(notifications.length);
  }, [notifications]);

  const handleOpenTelegram = () => {
    telegramService.openTelegramWebApp();
  };

  const handleOpenChat = () => {
    telegramService.openTelegramChat();
  };

  const handleNotificationClick = (notification) => {
    // Handle notification click
    if (notification.action) {
      notification.action();
    }
    setShowNotifications(false);
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <FaUserPlus className="text-blue-400" />;
      case 'payment':
        return <FaCreditCard className="text-green-400" />;
      case 'message':
        return <FaComments className="text-purple-400" />;
      default:
        return <FaBell className="text-yellow-400" />;
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Telegram Web App Button */}
      {showWebAppButton && (
        <button
          onClick={handleOpenTelegram}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 mb-2 group"
          title="Open Telegram Web App"
        >
          <FaTelegram className="text-xl group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Telegram Chat Button */}
      {showChatButton && (
        <button
          onClick={handleOpenChat}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 mb-2 group"
          title="Open Telegram Chat"
        >
          <FaComments className="text-xl group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Notification Bell */}
      {showNotification && (
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            title="Notifications"
          >
            <FaBell className="text-xl" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && notifications.length > 0 && (
            <div className="absolute bottom-full mb-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-gray-700">
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{notification.title}</p>
                        <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Telegram Status Indicator */}
      {isTelegramReady && (
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Telegram Connected" />
      )}
    </div>
  );
};

export default TelegramWidget;
