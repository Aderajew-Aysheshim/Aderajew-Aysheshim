import { useState, useEffect, useCallback } from 'react';
import telegramService from '../utils/telegramService';

export const useTelegramNotifications = (autoSend = true) => {
  const [notifications, setNotifications] = useState([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if Telegram is configured
    setIsConfigured(telegramService.isConfigured());
  }, []);

  // Add notification to local state
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      time: new Date().toLocaleTimeString()
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep only last 10

    // Auto-send to Telegram if enabled
    if (autoSend && isConfigured) {
      sendToTelegram(notification);
    }

    return newNotification;
  }, [autoSend, isConfigured]);

  // Send notification to Telegram
  const sendToTelegram = useCallback(async (notification) => {
    setIsLoading(true);
    try {
      let success = false;

      switch (notification.type) {
        case 'user_registration':
          success = await telegramService.sendUserRegistrationNotification(notification.data);
          break;
        case 'tutor_registration':
          success = await telegramService.sendTutorRegistrationNotification(notification.data);
          break;
        case 'payment':
          success = await telegramService.sendPaymentNotification(notification.data);
          break;
        case 'conversation':
          success = await telegramService.sendConversationNotification(notification.data);
          break;
        case 'system_alert':
          success = await telegramService.sendSystemAlert(
            notification.title,
            notification.message,
            notification.severity
          );
          break;
        case 'daily_summary':
          success = await telegramService.sendDailySummary(notification.data);
          break;
        default:
          success = await telegramService.sendNotification(notification.message);
      }

      if (success) {
        console.log('Telegram notification sent successfully');
      }
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Specific notification helpers
  const notifyUserRegistration = useCallback((userData) => {
    return addNotification({
      type: 'user_registration',
      title: 'New User Registration',
      message: `${userData.fullName || userData.name} has registered as a ${userData.userType}`,
      data: userData,
      action: () => window.open('/admin/users', '_blank')
    });
  }, [addNotification]);

  const notifyTutorRegistration = useCallback((tutorData) => {
    return addNotification({
      type: 'tutor_registration',
      title: 'New Tutor Registration',
      message: `${tutorData.fullName || tutorData.name} has registered as a tutor`,
      data: tutorData,
      action: () => window.open('/admin/tutors', '_blank')
    });
  }, [addNotification]);

  const notifyPayment = useCallback((paymentData) => {
    return addNotification({
      type: 'payment',
      title: 'Payment Received',
      message: `${paymentData.amount} ETB payment received`,
      data: paymentData,
      action: () => window.open('/admin/payments', '_blank')
    });
  }, [addNotification]);

  const notifyConversation = useCallback((conversationData) => {
    return addNotification({
      type: 'conversation',
      title: 'New Conversation Activity',
      message: `Activity in conversation with ${conversationData.participants}`,
      data: conversationData,
      action: () => window.open(`/admin/conversations/${conversationData.id}`, '_blank')
    });
  }, [addNotification]);

  const notifySystemAlert = useCallback((title, message, severity = 'INFO') => {
    return addNotification({
      type: 'system_alert',
      title,
      message,
      severity,
      action: () => window.open('/admin/dashboard', '_blank')
    });
  }, [addNotification]);

  const notifyDailySummary = useCallback((stats) => {
    return addNotification({
      type: 'daily_summary',
      title: 'Daily Summary',
      message: `System performance report for ${new Date().toLocaleDateString()}`,
      data: stats,
      action: () => window.open('/admin/analytics', '_blank')
    });
  }, [addNotification]);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remove specific notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Send custom message
  const sendCustomMessage = useCallback(async (message, options = {}) => {
    if (isConfigured) {
      return await telegramService.sendNotification(message, options);
    }
    return false;
  }, [isConfigured]);

  // Open Telegram Web App
  const openTelegram = useCallback(() => {
    telegramService.openTelegramWebApp();
  }, []);

  // Open Telegram Chat
  const openTelegramChat = useCallback(() => {
    telegramService.openTelegramChat();
  }, []);

  // Get Telegram Web App URL
  const getTelegramUrl = useCallback(() => {
    return telegramService.getWebAppUrl();
  }, []);

  // Get Telegram Chat URL
  const getTelegramChatUrl = useCallback(() => {
    return telegramService.getChatUrl();
  }, []);

  // Get Telegram Handle
  const getTelegramHandle = useCallback(() => {
    return telegramService.getTelegramHandle();
  }, []);

  // Open Telegram by handle
  const openTelegramByHandle = useCallback(() => {
    telegramService.openTelegramByHandle();
  }, []);

  // Send chat invitation
  const sendChatInvitation = useCallback(async (userName, userType = 'user') => {
    return await telegramService.sendChatInvitation(userName, userType);
  }, []);

  // Send chat link
  const sendChatLink = useCallback(async (userEmail, purpose = 'support') => {
    return await telegramService.sendChatLink(userEmail, purpose);
  }, []);

  return {
    // State
    notifications,
    isConfigured,
    isLoading,
    unreadCount: notifications.length,

    // Actions
    addNotification,
    clearNotifications,
    removeNotification,
    sendCustomMessage,
    openTelegram,
    openTelegramChat,
    openTelegramByHandle,
    getTelegramUrl,
    getTelegramChatUrl,
    getTelegramHandle,
    sendChatInvitation,
    sendChatLink,

    // Specific notification helpers
    notifyUserRegistration,
    notifyTutorRegistration,
    notifyPayment,
    notifyConversation,
    notifySystemAlert,
    notifyDailySummary
  };
};

export default useTelegramNotifications;
