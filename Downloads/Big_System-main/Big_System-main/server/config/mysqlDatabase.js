const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'big_system',
  password: process.env.DB_PASSWORD || 'big_system',
  database: process.env.DB_NAME || 'big_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(config);

const generateId = () => Math.random().toString(36).substr(2, 9);

const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your .env file for correct credentials');
    console.log('3. Try connecting with these settings:');
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   Port: ${config.port}`);
    return false;
  } finally {
    if (connection) await connection.release();
  }
};

const query = async (sql, params = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    if (process.env.NODE_ENV === 'development') {
      console.log('SQL:', sql.replace(/\s+/g, ' ').trim());
      if (params.length) console.log('Params:', params);
    }
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    console.error('Failed SQL:', sql);
    console.error('Parameters:', params);
    throw error;
  } finally {
    if (connection) await connection.release();
  }
};

const transaction = async (callback) => {
  const connection = await pool.getConnection();
  const txnId = generateId();

  try {
    console.log(`[${txnId}] Starting transaction`);
    await connection.beginTransaction();

    const result = await callback({
      query: (sql, params) => connection.execute(sql, params),
      commit: async () => {
        await connection.commit();
        console.log(`[${txnId}] Transaction committed`);
      },
      rollback: async () => {
        await connection.rollback();
        console.warn(`[${txnId}] Transaction rolled back`);
      }
    });

    await connection.commit();
    console.log(`[${txnId}] Transaction completed successfully`);
    return result;
  } catch (error) {
    console.error(`[${txnId}] Transaction error:`, error.message);
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
};



module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  escape: mysql.escape,
  escapeId: mysql.escapeId,
  format: mysql.format
};