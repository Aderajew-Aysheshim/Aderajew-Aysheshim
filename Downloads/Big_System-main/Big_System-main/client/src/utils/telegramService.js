import { API_CONFIG } from './apiConfig';

class TelegramService {
  constructor() {
    this.botToken = API_CONFIG.TELEGRAM.BOT_TOKEN;
    this.chatId = API_CONFIG.TELEGRAM.CHAT_ID;
    this.webAppUrl = API_CONFIG.TELEGRAM.WEB_APP_URL;
    this.chatUrl = API_CONFIG.TELEGRAM.CHAT_URL;
    this.telegramHandle = API_CONFIG.TELEGRAM.TELEGRAM_HANDLE;
    this.apiUrl = API_CONFIG.TELEGRAM.API_URL;
  }

  // Open Telegram Web App
  openTelegramWebApp() {
    window.open(this.webAppUrl, '_blank');
  }

  // Open Telegram Chat
  openTelegramChat() {
    window.open(this.chatUrl, '_blank');
  }

  // Send notification to Telegram
  async sendNotification(message, options = {}) {
    if (!this.botToken || !this.chatId) {
      console.warn('Telegram bot token or chat ID not configured');
      return false;
    }

    try {
      const payload = {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
        ...options
      };

      const response = await fetch(`${this.apiUrl}${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.ok) {
        console.log('Telegram notification sent successfully');
        return true;
      } else {
        console.error('Telegram API error:', data.description);
        return false;
      }
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return false;
    }
  }

  // Send user registration notification
  async sendUserRegistrationNotification(userData) {
    const message = `
🎉 <b>New User Registration!</b>

👤 <b>User Details:</b>
• Name: ${userData.fullName || userData.firstName + ' ' + userData.lastName}
• Email: ${userData.email}
• Type: ${userData.userType || 'Unknown'}
• Phone: ${userData.phone || 'Not provided'}

📅 <b>Registered:</b> ${new Date().toLocaleString()}

🔗 <b>Manage Users:</b> ${window.location.origin}/admin/users
    `.trim();

    return this.sendNotification(message);
  }

  // Send tutor registration notification
  async sendTutorRegistrationNotification(tutorData) {
    const message = `
🎓 <b>New Tutor Registration!</b>

👨‍🏫 <b>Tutor Details:</b>
• Name: ${tutorData.fullName || tutorData.firstName + ' ' + tutorData.lastName}
• Email: ${tutorData.email}
• Phone: ${tutorData.phone || 'Not provided'}
• Subjects: ${tutorData.subjects || 'Not specified'}
• Qualifications: ${tutorData.qualifications || 'Not specified'}

📅 <b>Registered:</b> ${new Date().toLocaleString()}

💰 <b>Activation Fee:</b> ${tutorData.activationFee || '500'} ETB

🔗 <b>Verify Tutor:</b> ${window.location.origin}/admin/tutors
    `.trim();

    return this.sendNotification(message);
  }

  // Send payment notification
  async sendPaymentNotification(paymentData) {
    const message = `
💳 <b>New Payment Received!</b>

💰 <b>Payment Details:</b>
• Amount: ${paymentData.amount} ETB
• Type: ${paymentData.paymentType}
• Method: ${paymentData.paymentMethod}
• Reference: ${paymentData.transactionReference}

👤 <b>User:</b> ${paymentData.userName || 'Unknown'}
📅 <b>Date:</b> ${new Date().toLocaleString()}

🔗 <b>View Payments:</b> ${window.location.origin}/admin/payments
    `.trim();

    return this.sendNotification(message);
  }

  // Send system alert
  async sendSystemAlert(title, message, severity = 'INFO') {
    const severityEmojis = {
      INFO: 'ℹ️',
      WARNING: '⚠️',
      ERROR: '❌',
      SUCCESS: '✅'
    };

    const telegramMessage = `
${severityEmojis[severity]} <b>${title}</b>

${message}

📅 <b>Time:</b> ${new Date().toLocaleString()}
🔗 <b>Admin Panel:</b> ${window.location.origin}/admin
    `.trim();

    return this.sendNotification(telegramMessage);
  }

  // Send conversation notification
  async sendConversationNotification(conversationData) {
    const message = `
💬 <b>New Conversation Activity!</b>

👥 <b>Participants:</b>
• Student: ${conversationData.studentName || 'Unknown'}
• Tutor: ${conversationData.tutorName || 'Unknown'}

📝 <b>Last Message:</b>
"${conversationData.lastMessage || 'No message'}"

📊 <b>Messages:</b> ${conversationData.messageCount || 0}
📅 <b>Last Activity:</b> ${conversationData.lastMessageAt || new Date().toLocaleString()}

🔗 <b>View Conversation:</b> ${window.location.origin}/admin/conversations/${conversationData.id}
    `.trim();

    return this.sendNotification(message);
  }

  // Send daily summary
  async sendDailySummary(stats) {
    const message = `
📊 <b>Daily System Summary</b>

👥 <b>Users:</b>
• New Students: ${stats.newStudents || 0}
• New Tutors: ${stats.newTutors || 0}
• Total Users: ${stats.totalUsers || 0}

💬 <b>Conversations:</b>
• New Conversations: ${stats.newConversations || 0}
• Total Messages: ${stats.totalMessages || 0}

💰 <b>Payments:</b>
• New Payments: ${stats.newPayments || 0}
• Total Revenue: ${stats.totalRevenue || 0} ETB

📅 <b>Date:</b> ${new Date().toLocaleDateString()}
🔗 <b>Admin Panel:</b> ${window.location.origin}/admin
    `.trim();

    return this.sendNotification(message);
  }
  // Check if Telegram is configured
  isConfigured() {
    return !!(this.botToken && this.chatId);
  }
  // Get Telegram Web App URL
  getWebAppUrl() {
    return this.webAppUrl;
  }
// Get Telegram Chat URL
  getChatUrl() {
    return this.chatUrl;
  }

  // Get Telegram Handle
  getTelegramHandle() {
    return this.telegramHandle;
  }

  // Open Telegram by handle
  openTelegramByHandle() {
    window.open(`https://t.me/${this.telegramHandle.replace('@', '')}`, '_blank');
  }

  // Send chat invitation
  async sendChatInvitation(userName, userType = 'user') {
    const message = `
💬 <b>Chat Invitation!</b>

👋 <b>Welcome ${userName}!</b>

You've been invited to join our official Telegram chat group for ${userType}s!

🔗 <b>Join Chat:</b> ${this.chatUrl}
📱 <b>Telegram Handle:</b> ${this.telegramHandle}

📱 <b>Benefits:</b>
• Real-time support
• Community discussions
• Important updates
• Direct communication with team

🎯 <b>Quick Links:</b>
• Chat: ${this.chatUrl}
• Handle: ${this.telegramHandle}

See you there! 🚀
    `.trim();

    return this.sendNotification(message);
  }

  // Send chat link to user
  async sendChatLink(userEmail, purpose = 'support') {
    const message = `
🔗 <b>Telegram Chat Link</b>

📧 <b>For:</b> ${userEmail}
🎯 <b>Purpose:</b> ${purpose}

💬 <b>Join our Telegram chat:</b>
${this.chatUrl}

📱 <b>Telegram Handle:</b> ${this.telegramHandle}

🔗 <b>Quick Links:</b>
• Chat: ${this.chatUrl}
• Handle: ${this.telegramHandle}

We're here to help! 💪
    `.trim();

    return this.sendNotification(message);
  }

  // Initialize Telegram Web App
  initTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;

      // Expand the Web App
      webApp.expand();

      // Set theme colors
      webApp.setHeaderColor('#1f2937');
      webApp.setBackgroundColor('#111827');

      // Enable closing confirmation
      webApp.enableClosingConfirmation();

      // Show main button
      webApp.MainButton.setText('Open Dashboard');
      webApp.MainButton.show();

      // Handle main button click
      webApp.MainButton.onClick(() => {
        window.open(window.location.origin, '_blank');
      });

      return webApp;
    }

    return null;
  }

  // Send user location (if available)
  async sendLocation(userId, userType = 'user') {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const message = `
📍 <b>User Location Update</b>

👤 <b>User:</b> ${userType} ID: ${userId}
🌍 <b>Coordinates:</b>
• Latitude: ${position.coords.latitude}
• Longitude: ${position.coords.longitude}
• Accuracy: ${position.coords.accuracy}m

📅 <b>Time:</b> ${new Date().toLocaleString()}
          `.trim();

          const result = await this.sendNotification(message);
          resolve(result);
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(false);
        }
      );
    });
  }
}

// Create singleton instance
const telegramService = new TelegramService();

export default telegramService;
