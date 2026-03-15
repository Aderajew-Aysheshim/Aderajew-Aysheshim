const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function inspectSchema() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'tutorhub_db'
    });

    const [columns] = await connection.query('SHOW COLUMNS FROM resource_downloads');
    console.log('Columns in resource_downloads:');
    columns.forEach(col => console.log(`- ${col.Field} (${col.Type})`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

inspectSchema();
