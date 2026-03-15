import React from 'react';
import { FaTelegram } from 'react-icons/fa';
import { useTelegramNotifications } from '../hooks/useTelegramNotifications';

const TelegramHandle = ({ 
  showButton = true, 
  showText = true, 
  size = 'medium',
  className = ''
}) => {
  const { getTelegramHandle, openTelegramByHandle } = useTelegramNotifications();

  const handle = getTelegramHandle();

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
    xlarge: 'text-3xl'
  };

  const buttonSizes = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
    xlarge: 'px-8 py-4 text-lg'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showText && (
        <div className="flex items-center gap-2">
          <FaTelegram className="text-blue-500" />
          <span className={`${sizeClasses[size]} font-semibold text-gray-300`}>
            {handle}
          </span>
        </div>
      )}
      
      {showButton && (
        <button
          onClick={openTelegramByHandle}
          className={`${buttonSizes[size]} bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2`}
        >
          <FaTelegram />
          <span>Follow {handle}</span>
        </button>
      )}
    </div>
  );
};

export default TelegramHandle;
