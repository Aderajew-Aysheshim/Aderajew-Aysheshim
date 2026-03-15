import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

const TelegramChatWidget = () => {
  // Use the handle from Contact.jsx or the phone number if preferred.
  // Using the handle implies a channel or username.
  // Using phone: https://t.me/+251960737167
  const telegramUrl = "https://t.me/TutorHubEthiopia";

  return (
    <a
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0088cc] hover:bg-[#007dbd] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
      aria-label="Chat on Telegram"
    >
      <FaTelegramPlane className="text-2xl" />
      <span className="font-bold text-sm hidden group-hover:inline-block transition-all duration-300 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
};

export default TelegramChatWidget;
