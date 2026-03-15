const { query } = require('../config/mysqlDatabase');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

async function resetPassword() {
  const email = 'aderajew.aysheshim@aastustudent.edu.et';
  const newPassword = 'password123';

  try {
    console.log(`Resetting password for ${email} to "${newPassword}"...`);

    const hash = await bcrypt.hash(newPassword, 12);

    const result = await query(
      'UPDATE students SET password_hash = ? WHERE email = ?',
      [hash, email]
    );

    if (result.affectedRows > 0) {
      console.log('✅ Password reset successful!');
      console.log(`You can now login with:\nEmail: ${email}\nPassword: ${newPassword}`);
    } else {
      console.log('❌ User not found with that email.');
    }
  } catch (err) {
    console.error('Error resetting password:', err);
  } finally {
    process.exit();
  }
}

resetPassword();
