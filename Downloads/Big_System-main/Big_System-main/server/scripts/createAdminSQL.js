const bcrypt = require('bcryptjs');

// This script generates the SQL to insert an admin user
async function generateAdminSQL() {
  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('\n✅ Copy and run this SQL in your MySQL database:\n');
    console.log('-- Create Admin User');
    console.log(`INSERT INTO admins (first_name, last_name, email, password_hash, role, is_active) VALUES`);
    console.log(`('Admin', 'User', 'admin@tutorhub.et', '${hashedPassword}', 'super-admin', TRUE);`);
    console.log('\n📧 Email: admin@tutorhub.et');
    console.log('🔑 Password: admin123\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateAdminSQL();
