// Email service utility (SendGrid integration - Future implementation)

const sendEmail = async (options) => {
  // TODO: Implement SendGrid email sending
  console.log('Email would be sent:', options);

  // Example structure:
  // const msg = {
  //   to: options.email,
  //   from: process.env.FROM_EMAIL,
  //   subject: options.subject,
  //   text: options.message,
  //   html: options.html
  // };

  // await sgMail.send(msg);
};

const sendWelcomeEmail = async (user, userType) => {
  const message = `Welcome to TutorHub Institute! Your ${userType} account has been created successfully.`;

  await sendEmail({
    email: user.email,
    subject: 'Welcome to TutorHub Institute',
    message
  });
};

const sendBookingConfirmation = async (booking) => {
  const message = `Your tutoring session has been booked for ${booking.sessionDate}. Amount: ${booking.amount} ETB`;

  // Send to student
  await sendEmail({
    email: booking.student.email,
    subject: 'Booking Confirmation',
    message
  });

  // Send to tutor
  await sendEmail({
    email: booking.tutor.email,
    subject: 'New Booking Received',
    message: `You have a new booking for ${booking.sessionDate}`
  });
};

const sendPaymentConfirmation = async (booking) => {
  const message = `Payment of ${booking.amount} ETB has been confirmed. Transaction ID: ${booking.transactionId}`;

  await sendEmail({
    email: booking.student.email,
    subject: 'Payment Confirmed',
    message
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendPaymentConfirmation
};
