const { query } = require('../config/mysqlDatabase');

async function checkAdmins() {
  try {
    const columns = await query('SHOW COLUMNS FROM admins');
    console.log('Columns in admins table:', columns.map(c => c.Field));

    const admins = await query('SELECT id, email, password_hash, is_active FROM admins');
    console.log('Admins in DB:', admins);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkAdmins();
