const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function ensureAdmin() {
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

    const email = 'admin@tutorhub.et';
    const password = 'admin123';

    // Check if admin exists
    const [rows] = await connection.execute('SELECT * FROM admins WHERE email = ?', [email]);

    if (rows.length > 0) {
      console.log('✅ Admin user already exists.');
    } else {
      console.log('⚠️ Admin user not found. Creating...');
      const hashedPassword = await bcrypt.hash(password, 12);

      const sql = `
        INSERT INTO admins (first_name, last_name, email, password_hash, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      await connection.execute(sql, [
        'Admin', 'User', email, hashedPassword, 'super-admin', true
      ]);
      console.log('✅ Admin user created successfully.');
    }

    console.log('\n======================================');
    console.log('Admin Login Credentials:');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('======================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

ensureAdmin();
