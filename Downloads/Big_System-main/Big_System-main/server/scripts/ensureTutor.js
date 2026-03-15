const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function ensureTutor() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'tutorhub_db'
    });
    console.log('Connected.');

    const email = 'tutor@tutorhub.et';
    const password = 'tutor123';

    // Check if tutor exists
    const [rows] = await connection.execute('SELECT * FROM tutors WHERE email = ?', [email]);

    if (rows.length > 0) {
      console.log('✅ Tutor user already exists.');
      // Ensure verified
      await connection.execute('UPDATE tutors SET is_verified = TRUE WHERE email = ?', [email]);
      console.log('✅ Tutor verification ensured.');
    } else {
      console.log('⚠️ Tutor user not found. Creating...');
      const hashedPassword = await bcrypt.hash(password, 12);

      const sql = `
        INSERT INTO tutors (
          full_name, email, password_hash, phone, specializations, 
          bio, is_verified, hourly_rate, activation_fee_paid
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.execute(sql, [
        'Test Tutor',
        email,
        hashedPassword,
        '0911223344',
        'Mathematics,Physics',
        'Experienced math tutor.',
        true,
        200.00,
        true
      ]);
      console.log('✅ Tutor user created successfully.');
    }

    console.log('\n======================================');
    console.log('Tutor Login Credentials:');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('======================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

ensureTutor();
